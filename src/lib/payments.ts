// Provider-ready payments layer.
//
// PayPal is the first (and currently only) live provider. Everything above
// this layer — Pricing, Settings, entitlement checks — talks to the
// PaymentProvider interface and the provider-agnostic `subscriptions` table,
// so a Stripe adapter can slot in later without a rebuild: implement
// PaymentProvider, return it from getProvider(), and have its webhook /
// verify function write the same `subscriptions` rows + profiles sync that
// supabase/functions/paypal-verify performs.
//
// Configuration (Vercel env vars, set by the site owner — see PAYMENTS.md):
//   VITE_PAYPAL_CLIENT_ID     PayPal app client id (public, safe in bundle)
//   VITE_PAYPAL_PLAN_COSMIC   PayPal subscription plan id for Cosmic ($9/mo)
// When either is absent the site runs in an honest "payments not open yet"
// state — no checkout button is rendered and nothing fakes a purchase.

import { requireSupabase } from './supabase';

// ---------------------------------------------------------------------------
// Products
// ---------------------------------------------------------------------------

export type ProductId = 'cosmic_monthly' | 'deep_reading_pack';

export interface Product {
  id: ProductId;
  name: string;
  price: number; // USD
  currency: 'USD';
  type: 'subscription' | 'one_time';
  enabled: boolean;
}

export const PRODUCTS: Record<ProductId, Product> = {
  cosmic_monthly: {
    id: 'cosmic_monthly',
    name: 'Cosmic',
    price: 9,
    currency: 'USD',
    type: 'subscription',
    enabled: true,
  },
  // Config-flagged OFF: defined here so the plumbing knows the product, but
  // it must never be surfaced in any UI while `enabled` is false.
  deep_reading_pack: {
    id: 'deep_reading_pack',
    name: 'Deep Reading Pack',
    price: 9,
    currency: 'USD',
    type: 'one_time',
    enabled: false,
  },
};

// ---------------------------------------------------------------------------
// Subscription record (mirrors the `subscriptions` table, migration 003)
// ---------------------------------------------------------------------------

export interface SubscriptionRow {
  id: string;
  user_id: string;
  provider: string; // 'paypal' | 'stripe'
  provider_subscription_id: string | null;
  provider_customer_id: string | null;
  product: string;
  status: string; // 'active' | 'cancelled' | 'expired' | 'completed'
  current_period_end: string | null;
  created_at: string;
  updated_at: string;
}

/** Latest subscription row for a user, or null. Never throws: until
 *  migration 003 is applied the table doesn't exist, and callers must
 *  degrade gracefully to the profiles.plan cache. */
export async function fetchLatestSubscription(userId: string): Promise<SubscriptionRow | null> {
  try {
    const supabase = requireSupabase();
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error) return null;
    return (data as SubscriptionRow) ?? null;
  } catch {
    return null;
  }
}

export function subscriptionIsActive(sub: SubscriptionRow | null): boolean {
  if (!sub || sub.status !== 'active') return false;
  if (!sub.current_period_end) return true;
  return new Date(sub.current_period_end).getTime() > Date.now();
}

// ---------------------------------------------------------------------------
// Provider interface
// ---------------------------------------------------------------------------

export interface VerifyCheckoutInput {
  subscriptionId?: string; // PayPal subscription id (from the JS SDK onApprove)
  orderId?: string; // PayPal order id (one-time purchases)
  userId: string; // Supabase user id — the edge function cross-checks it against the JWT
}

export interface VerifyCheckoutResult {
  status: string;
  currentPeriodEnd: string | null;
}

export interface PaymentProvider {
  readonly id: 'paypal' | 'stripe';
  isConfigured(): boolean;
  /** Ask the backend to verify a completed provider checkout against the
   *  provider's own API and record the entitlement. Resolves only when the
   *  provider confirmed the payment — never on the client's word alone. */
  verifyCheckout(input: VerifyCheckoutInput): Promise<VerifyCheckoutResult>;
}

export class PaymentsNotConfiguredError extends Error {
  constructor(message = 'Payments are not configured yet.') {
    super(message);
    this.name = 'PaymentsNotConfiguredError';
  }
}

// ---------------------------------------------------------------------------
// PayPal provider
// ---------------------------------------------------------------------------

const paypalClientId = import.meta.env.VITE_PAYPAL_CLIENT_ID as string | undefined;
const paypalCosmicPlanId = import.meta.env.VITE_PAYPAL_PLAN_COSMIC as string | undefined;

export const PAYPAL_CONFIG = {
  clientId: paypalClientId,
  cosmicPlanId: paypalCosmicPlanId,
} as const;

export function isPayPalConfigured(): boolean {
  return Boolean(paypalClientId && paypalCosmicPlanId);
}

class PayPalProvider implements PaymentProvider {
  readonly id = 'paypal' as const;

  isConfigured(): boolean {
    return isPayPalConfigured();
  }

  async verifyCheckout(input: VerifyCheckoutInput): Promise<VerifyCheckoutResult> {
    const supabase = requireSupabase();
    const { data, error } = await supabase.functions.invoke('paypal-verify', {
      body: {
        subscriptionId: input.subscriptionId,
        orderId: input.orderId,
        userId: input.userId,
      },
    });

    if (error) {
      // Edge functions return JSON errors; supabase-js wraps non-2xx in a
      // FunctionsHttpError whose `context` is the raw Response.
      let code: string | undefined;
      const context = (error as { context?: Response }).context;
      if (context && typeof context.clone === 'function') {
        try {
          code = ((await context.clone().json()) as { error?: string })?.error;
        } catch {
          /* fall through to the generic message */
        }
      }
      if (code === 'payments_not_configured') throw new PaymentsNotConfiguredError();
      throw new Error(code ?? 'We could not confirm your payment with PayPal. If you were charged, contact support.');
    }

    const result = data as { ok?: boolean; error?: string; status?: string; currentPeriodEnd?: string | null };
    if (!result?.ok) {
      if (result?.error === 'payments_not_configured') throw new PaymentsNotConfiguredError();
      throw new Error(result?.error ?? 'We could not confirm your payment with PayPal.');
    }
    return { status: result.status ?? 'active', currentPeriodEnd: result.currentPeriodEnd ?? null };
  }
}

let provider: PaymentProvider | null = null;

/** The single entry point the UI uses. PayPal today; a Stripe adapter only
 *  needs to be returned here (plus its own verify/webhook function writing
 *  the same `subscriptions` rows) to become the live provider. */
export function getProvider(): PaymentProvider {
  if (!provider) provider = new PayPalProvider();
  return provider;
}

// ---------------------------------------------------------------------------
// PayPal JS SDK loader (used by the subscribe-button component)
// ---------------------------------------------------------------------------

export interface PayPalButtonsConfig {
  style?: Record<string, string>;
  createSubscription: (
    data: Record<string, unknown>,
    actions: { subscription: { create: (opts: { plan_id: string }) => Promise<string> } },
  ) => Promise<string>;
  onApprove: (data: { subscriptionID?: string; orderID?: string }) => void | Promise<void>;
  onError?: (err: unknown) => void;
  onCancel?: () => void;
}

export interface PayPalNamespace {
  Buttons: (config: PayPalButtonsConfig) => { render: (container: HTMLElement) => Promise<void> };
}

declare global {
  interface Window {
    paypal?: PayPalNamespace;
  }
}

let sdkPromise: Promise<PayPalNamespace> | null = null;

export function loadPayPalSdk(clientId: string): Promise<PayPalNamespace> {
  if (window.paypal) return Promise.resolve(window.paypal);
  if (!sdkPromise) {
    sdkPromise = new Promise<PayPalNamespace>((resolve, reject) => {
      const script = document.createElement('script');
      script.src =
        `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(clientId)}` +
        '&vault=true&intent=subscription&currency=USD';
      script.async = true;
      script.onload = () => {
        if (window.paypal) resolve(window.paypal);
        else reject(new Error('PayPal SDK loaded without window.paypal'));
      };
      script.onerror = () => reject(new Error('Failed to load the PayPal SDK'));
      document.head.appendChild(script);
    });
  }
  return sdkPromise;
}

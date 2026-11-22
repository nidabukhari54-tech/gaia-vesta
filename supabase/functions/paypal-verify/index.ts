// Supabase Edge Function: paypal-verify
// Verifies a PayPal checkout (subscription or one-time order) against
// PayPal's own API and, only on a confirmed payment, records the entitlement:
//
//   1. upserts a provider-agnostic row into `subscriptions` (migration 003)
//   2. syncs the profiles cache (plan = 'premium', effectively unlimited AI
//      readings) — the same fields the Stripe webhook stub maintains, so the
//      app's quota checks stay provider-agnostic.
//
// The client NEVER grants itself Cosmic: the PayPal JS SDK's onApprove only
// hands us an id, and this function re-checks that id with PayPal directly.
//
// Deploy:  supabase functions deploy paypal-verify
// Secrets: supabase secrets set PAYPAL_CLIENT_ID=... PAYPAL_CLIENT_SECRET=... PAYPAL_ENV=live
//          (optional) PAYPAL_PLAN_COSMIC=P-...  — when set, subscription plan ids are cross-checked
//          SUPABASE_URL / SUPABASE_ANON_KEY / SUPABASE_SERVICE_ROLE_KEY are provided by Supabase.
// Without the PayPal secrets this returns { error: 'payments_not_configured' } — never a fake success.

import { serve } from 'https://deno.land/std@0.208.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const paypalClientId = Deno.env.get('PAYPAL_CLIENT_ID');
    const paypalClientSecret = Deno.env.get('PAYPAL_CLIENT_SECRET');
    if (!paypalClientId || !paypalClientSecret) {
      return json({ error: 'payments_not_configured' }, 503);
    }
    const paypalBase =
      Deno.env.get('PAYPAL_ENV') === 'live'
        ? 'https://api-m.paypal.com'
        : 'https://api-m.sandbox.paypal.com';

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    // --- Authenticate the caller; the JWT is the only trusted user id. ---
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) return json({ error: 'Unauthorized' }, 401);

    const supabaseAuth = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user }, error: userError } = await supabaseAuth.auth.getUser();
    if (userError || !user) return json({ error: 'Unauthorized' }, 401);

    const body = (await req.json().catch(() => ({}))) as {
      subscriptionId?: string;
      orderId?: string;
      userId?: string;
    };
    if (body.userId && body.userId !== user.id) {
      return json({ error: 'user_mismatch' }, 403);
    }
    if (!body.subscriptionId && !body.orderId) {
      return json({ error: 'missing_payment_id' }, 400);
    }

    // --- PayPal OAuth token ---
    const tokenRes = await fetch(`${paypalBase}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${btoa(`${paypalClientId}:${paypalClientSecret}`)}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });
    if (!tokenRes.ok) {
      console.error('PayPal token error:', await tokenRes.text());
      return json({ error: 'paypal_unreachable' }, 502);
    }
    const { access_token: accessToken } = await tokenRes.json();
    const paypalGet = (path: string) =>
      fetch(`${paypalBase}${path}`, {
        headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
      });

    const admin = createClient(supabaseUrl, serviceRoleKey);

    // --- Subscription path: Cosmic $9/mo ---
    if (body.subscriptionId) {
      const subRes = await paypalGet(`/v1/billing/subscriptions/${body.subscriptionId}`);
      if (!subRes.ok) {
        console.error('PayPal subscription fetch error:', await subRes.text());
        return json({ error: 'paypal_unreachable' }, 502);
      }
      const sub = await subRes.json();

      if (sub.status !== 'ACTIVE') {
        // APPROVED / APPROVAL_PENDING means PayPal hasn't finished activating
        // it yet — an honest "not yet", not a success.
        return json({ error: 'subscription_not_active', status: sub.status }, 409);
      }

      const expectedPlan = Deno.env.get('PAYPAL_PLAN_COSMIC');
      if (expectedPlan && sub.plan_id !== expectedPlan) {
        return json({ error: 'plan_mismatch' }, 400);
      }

      const currentPeriodEnd: string | null = sub.billing_info?.next_billing_time ?? null;
      const payerId: string | null = sub.subscriber?.payer_id ?? null;

      await upsertSubscription(admin, {
        user_id: user.id,
        provider: 'paypal',
        provider_subscription_id: sub.id,
        provider_customer_id: payerId,
        product: 'cosmic_monthly',
        status: 'active',
        current_period_end: currentPeriodEnd,
      });

      // Sync the entitlement cache the app reads (same contract as stripe-webhook).
      await admin
        .from('profiles')
        .update({ plan: 'premium', ai_queries_limit: 1000000 })
        .eq('id', user.id);

      return json({ ok: true, provider: 'paypal', status: 'active', currentPeriodEnd });
    }

    // --- One-time order path (e.g. a future Deep Reading Pack capture) ---
    const orderRes = await paypalGet(`/v2/checkout/orders/${body.orderId}`);
    if (!orderRes.ok) {
      console.error('PayPal order fetch error:', await orderRes.text());
      return json({ error: 'paypal_unreachable' }, 502);
    }
    const order = await orderRes.json();

    const captures: Array<{ status?: string }> =
      order.purchase_units?.flatMap(
        (u: { payments?: { captures?: Array<{ status?: string }> } }) => u.payments?.captures ?? [],
      ) ?? [];
    const captured = order.status === 'COMPLETED' && captures.some((c) => c.status === 'COMPLETED');
    if (!captured) {
      return json({ error: 'order_not_completed', status: order.status }, 409);
    }

    const payerId: string | null = order.payer?.payer_id ?? null;

    await upsertSubscription(admin, {
      user_id: user.id,
      provider: 'paypal',
      provider_subscription_id: order.id,
      provider_customer_id: payerId,
      product: 'deep_reading_pack',
      status: 'completed',
      current_period_end: null,
    });

    // A one-time pack is recorded, but it does not by itself flip the plan to
    // Cosmic — pack redemption/credit is a separate feature.
    return json({ ok: true, provider: 'paypal', status: 'completed', currentPeriodEnd: null });
  } catch (e) {
    console.error('paypal-verify error:', e);
    return json({ error: 'verify_failed' }, 500);
  }
});

// Insert-or-update keyed on (provider, provider_subscription_id). Done
// manually instead of PostgREST upsert because the unique index is partial
// (WHERE provider_subscription_id IS NOT NULL), which onConflict can't target.
async function upsertSubscription(
  admin: ReturnType<typeof createClient>,
  row: {
    user_id: string;
    provider: string;
    provider_subscription_id: string;
    provider_customer_id: string | null;
    product: string;
    status: string;
    current_period_end: string | null;
  },
) {
  const { data: existing } = await admin
    .from('subscriptions')
    .select('id')
    .eq('provider', row.provider)
    .eq('provider_subscription_id', row.provider_subscription_id)
    .maybeSingle();

  if (existing) {
    const { error } = await admin
      .from('subscriptions')
      .update({ ...row, updated_at: new Date().toISOString() })
      .eq('id', (existing as { id: string }).id);
    if (error) throw error;
  } else {
    const { error } = await admin.from('subscriptions').insert(row);
    if (error) throw error;
  }
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

import { useEffect, useRef, useState } from 'react';
import { Loader2, ShieldCheck } from 'lucide-react';
import {
  PAYPAL_CONFIG,
  PaymentsNotConfiguredError,
  getProvider,
  loadPayPalSdk,
} from '../lib/payments';

type PayPalSubscribeProps = {
  userId: string;
  onSuccess: () => void;
};

/**
 * Renders the real PayPal subscribe buttons for the Cosmic plan.
 * Only mounted when the PayPal env vars are configured (see Pricing) —
 * onApprove hands the subscription id to the paypal-verify edge function,
 * which confirms it with PayPal before any entitlement is granted.
 */
export function PayPalSubscribe({ userId, onSuccess }: PayPalSubscribeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const renderedRef = useRef(false);
  const onSuccessRef = useRef(onSuccess);
  onSuccessRef.current = onSuccess;
  const [state, setState] = useState<'loading' | 'ready' | 'verifying' | 'error'>('loading');
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (renderedRef.current) return;
    renderedRef.current = true;
    let cancelled = false;

    (async () => {
      try {
        const paypal = await loadPayPalSdk(PAYPAL_CONFIG.clientId!);
        if (cancelled || !containerRef.current) return;
        await paypal
          .Buttons({
            style: { shape: 'pill', color: 'gold', layout: 'vertical', label: 'subscribe' },
            createSubscription: (_data, actions) =>
              actions.subscription.create({ plan_id: PAYPAL_CONFIG.cosmicPlanId! }),
            onApprove: async (data) => {
              if (!data.subscriptionID) {
                setState('error');
                setMessage('PayPal did not return a subscription. No charge was confirmed.');
                return;
              }
              setState('verifying');
              setMessage('Confirming your subscription with PayPal…');
              try {
                await getProvider().verifyCheckout({ subscriptionId: data.subscriptionID, userId });
                onSuccessRef.current();
              } catch (e) {
                setState('error');
                if (e instanceof PaymentsNotConfiguredError) {
                  setMessage('Payments are still being connected on our side. You have not been charged.');
                } else if (e instanceof Error && e.message === 'subscription_not_active') {
                  setMessage('PayPal is still activating your subscription — give it a moment, then check Settings. If it stays pending, contact support.');
                } else {
                  setMessage('We could not confirm your subscription with PayPal. If you completed payment and don\'t see Cosmic in Settings shortly, contact support.');
                }
              }
            },
            onError: () => {
              setState('error');
              setMessage('PayPal hit a snag before checkout finished. You have not been charged — please try again.');
            },
          })
          .render(containerRef.current);
        if (!cancelled) setState('ready');
      } catch {
        if (!cancelled) {
          setState('error');
          setMessage('Could not load PayPal checkout. Check your connection and try again.');
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [userId]);

  return (
    <div>
      <div ref={containerRef} className="min-h-[52px]" />
      {state === 'loading' && (
        <p className="flex items-center justify-center gap-2 text-sm text-lavdim py-2">
          <Loader2 className="w-4 h-4 animate-spin" /> Loading secure PayPal checkout…
        </p>
      )}
      {state === 'verifying' && (
        <p className="flex items-center justify-center gap-2 text-sm text-goldlight py-2">
          <Loader2 className="w-4 h-4 animate-spin" /> {message}
        </p>
      )}
      {state === 'error' && message && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-300 px-4 py-3 rounded-lg text-sm mt-2">
          {message}
        </div>
      )}
      {state === 'ready' && (
        <p className="flex items-center justify-center gap-1.5 text-xs text-lavdim mt-2">
          <ShieldCheck className="w-3.5 h-3.5" /> Secured by PayPal — cancel anytime from your PayPal account.
        </p>
      )}
    </div>
  );
}

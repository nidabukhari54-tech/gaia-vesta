// Supabase Edge Function: stripe-webhook
// Receives Stripe webhook events and upgrades profiles to the Cosmic plan.
//
// Deploy:  supabase functions deploy stripe-webhook
// Secrets:  supabase secrets set STRIPE_SECRET_KEY=sk_live_... STRIPE_WEBHOOK_SECRET=whsec_... SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=...
//
// In the Stripe dashboard, register the webhook endpoint:
//   https://<project-ref>.supabase.co/functions/v1/stripe-webhook
// with events: checkout.session.completed, customer.subscription.deleted

import { serve } from 'https://deno.land/std@0.208.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';
import Stripe from 'https://esm.sh/stripe@16.12.0?target=deno';

serve(async (req) => {
  try {
    const stripeKey = Deno.env.get('STRIPE_SECRET_KEY')!;
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    const stripe = new Stripe(stripeKey, { apiVersion: '2024-06-20' });
    const signature = req.headers.get('stripe-signature');
    const body = await req.text();

    let event: Stripe.Event;
    if (webhookSecret && signature) {
      event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret);
    } else {
      // No secret configured — accept the raw payload (dev only, never in production)
      event = JSON.parse(body) as Stripe.Event;
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey);

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.supabase_user_id;
      const customerId = typeof session.customer === 'string' ? session.customer : session.customer?.id;

      if (userId) {
        await supabase
          .from('profiles')
          .update({
            plan: 'premium',
            stripe_customer_id: customerId ?? null,
            ai_queries_limit: 1000000, // effectively unlimited
          })
          .eq('id', userId);
        console.log(`Upgraded user ${userId} to premium`);
      }
    }

    if (event.type === 'customer.subscription.deleted') {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = typeof subscription.customer === 'string'
        ? subscription.customer
        : subscription.customer?.id;

      if (customerId) {
        await supabase
          .from('profiles')
          .update({ plan: 'free', ai_queries_limit: 5 })
          .eq('stripe_customer_id', customerId);
        console.log(`Downgraded customer ${customerId} to free`);
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error('stripe-webhook error:', e);
    return new Response(JSON.stringify({ error: 'Webhook failed' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});

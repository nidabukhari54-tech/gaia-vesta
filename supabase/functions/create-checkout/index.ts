// Supabase Edge Function: create-checkout
// Creates a Stripe Checkout session for the Cosmic ($9/mo) plan.
//
// Deploy:  supabase functions deploy create-checkout
// Secrets:  supabase secrets set STRIPE_SECRET_KEY=sk_live_... STRIPE_PRICE_ID=price_... SUPABASE_URL=... SUPABASE_ANON_KEY=... SITE_URL=https://your-domain.com

import { serve } from 'https://deno.land/std@0.208.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';
import Stripe from 'https://esm.sh/stripe@16.12.0?target=deno';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const stripeKey = Deno.env.get('STRIPE_SECRET_KEY');
    const priceId = Deno.env.get('STRIPE_PRICE_ID');
    const siteUrl = Deno.env.get('SITE_URL') ?? 'http://localhost:5173';

    if (!stripeKey || !priceId) {
      return json({ error: 'Payments are not configured (missing Stripe secrets).' }, 500);
    }

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) return json({ error: 'Unauthorized' }, 401);

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user || !user.email) return json({ error: 'Unauthorized' }, 401);

    const { data: profile } = await supabase
      .from('profiles')
      .select('plan, stripe_customer_id')
      .eq('id', user.id)
      .single();

    if (profile?.plan === 'premium') {
      return json({ error: 'You are already on the Cosmic plan.' }, 400);
    }

    const stripe = new Stripe(stripeKey, { apiVersion: '2024-06-20' });

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer_email: profile?.stripe_customer_id ? undefined : user.email,
      customer: profile?.stripe_customer_id ?? undefined,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${siteUrl}/settings?upgraded=1`,
      cancel_url: `${siteUrl}/pricing`,
      metadata: { supabase_user_id: user.id },
    });

    return json({ url: session.url });
  } catch (e) {
    console.error('create-checkout error:', e);
    return json({ error: 'Could not start checkout.' }, 500);
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

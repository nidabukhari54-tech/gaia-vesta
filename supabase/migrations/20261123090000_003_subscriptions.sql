-- 003: Provider-agnostic subscriptions table.
--
-- APPLY: paste this file into the Supabase SQL editor (or `supabase db push`).
--
-- One row per paid subscription/order, regardless of provider. Written ONLY by
-- edge functions using the service role key (paypal-verify today; a future
-- Stripe adapter writes the same shape). profiles.plan and
-- profiles.ai_queries_limit remain the synced entitlement cache the app reads
-- for quota checks; this table is the provider-level source of truth
-- (who billed them, which provider, when it renews).

CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  provider TEXT NOT NULL,                        -- 'paypal' | 'stripe'
  provider_subscription_id TEXT,                 -- PayPal subscription/order id, Stripe subscription id
  provider_customer_id TEXT,                     -- PayPal payer id, Stripe customer id
  product TEXT NOT NULL DEFAULT 'cosmic_monthly',
  status TEXT NOT NULL DEFAULT 'active',         -- 'active' | 'cancelled' | 'expired' | 'completed'
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_subscriptions_provider_sub
  ON subscriptions (provider, provider_subscription_id)
  WHERE provider_subscription_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_subscriptions_user ON subscriptions (user_id);

ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Users may read their own subscription rows. There are deliberately no
-- client INSERT/UPDATE/DELETE policies: all writes go through edge functions
-- with the service role key (which bypasses RLS).
CREATE POLICY "select_own_subscription" ON subscriptions FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

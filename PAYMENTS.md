# Payments — PayPal connection checklist (owner)

The payment plumbing is built and provider-ready (PayPal first; a Stripe
adapter can slot into `src/lib/payments.ts` later without a rebuild).
Until the steps below are done, the Pricing page honestly shows
"Cosmic payments open with our new domain tomorrow — start free today" —
that is expected, not a bug. Nothing on the site can fake a successful
payment: Cosmic is only granted after the `paypal-verify` edge function
confirms the subscription with PayPal's own API.

**Recommended order: sandbox first (steps 1–6 with sandbox values), one
sandbox test purchase, then swap the four credential values to live and
repeat the test purchase for real.**

---

## 1. Apply the subscriptions migration (Supabase)

Open the Supabase SQL editor for this project and run:

`supabase/migrations/20261123090000_003_subscriptions.sql`

This creates the provider-agnostic `subscriptions` table (users can read
their own rows; only edge functions can write).

## 2. Create the PayPal app (PayPal Developer Dashboard)

1. Go to https://developer.paypal.com → log in with the **PayPal Business**
   account that will receive the money.
2. **Apps & Credentials** → **Create App** (choose the Live tab — or Sandbox
   for the test pass).
3. Copy the **Client ID** and **Secret**.

## 3. Create the Cosmic subscription product + plan (PayPal)

1. In the PayPal Business account: **Pay & Get Paid → Subscriptions**
   (or via the Developer Dashboard's Products & Plans).
2. Create a product: *Gaia Vesta Cosmic*.
3. Create a plan on it: **$9.00 USD / month**, recurring, no trial
   (unless you decide otherwise).
4. Copy the **Plan ID** (looks like `P-XXXXXXXXXXXXXXXXXXXXXXXX`).

## 4. Set the Vercel environment variables

Project → Settings → Environment Variables (Production), then redeploy:

| Name | Value |
| --- | --- |
| `VITE_PAYPAL_CLIENT_ID` | Client ID from step 2 |
| `VITE_PAYPAL_PLAN_COSMIC` | Plan ID from step 3 |

## 5. Set the Supabase function secrets + deploy the verify function

```bash
supabase secrets set PAYPAL_CLIENT_ID=<client id> PAYPAL_CLIENT_SECRET=<secret> PAYPAL_ENV=live
# optional but recommended — makes paypal-verify reject subscriptions on any other plan:
supabase secrets set PAYPAL_PLAN_COSMIC=<plan id>
supabase functions deploy paypal-verify
# also redeploy interpret so it reads the subscriptions table:
supabase functions deploy interpret
```

For the sandbox pass use `PAYPAL_ENV=sandbox` and the sandbox app's
credentials + a sandbox plan id in steps 2–4.

## 6. Run one test purchase

1. Sign in on the live site → **Pricing** → the Cosmic card now shows real
   PayPal subscribe buttons.
2. Complete the subscription (sandbox buyer account for the test pass;
   a real second PayPal account for the live pass).
3. You should land on **Settings** with the "Welcome to Cosmic!" banner.
4. Confirm in Settings: plan shows **Cosmic**, "Billed via PayPal",
   and a renewal date; the **Manage subscription on PayPal** link opens
   PayPal's autopay page.
5. Generate an AI deep reading on any chart — it should no longer count
   against the 5/month free quota.
6. Cross-check the source of truth: in Supabase, the `subscriptions` table
   has a row with `provider = 'paypal'`, `status = 'active'`, and the
   buyer's `profiles.plan = 'premium'`.

## Notes

- **Cancelling:** subscribers manage/cancel from their own PayPal account
  (linked from Settings). When a PayPal subscription is cancelled it keeps
  running until the period ends; the row's `current_period_end` reflects
  that. (Automatic downgrade on lapse can be added later via PayPal
  webhooks — IPN/webhook listener — if wanted.)
- **Stripe later:** implement a `PaymentProvider` in `src/lib/payments.ts`,
  return it from `getProvider()`, and have the existing `stripe-webhook`
  stub also write `subscriptions` rows. No UI or entitlement changes needed.
- **Deep Reading Pack ($9 one-time)** exists in the product config with
  `enabled: false` and is not shown anywhere. `paypal-verify` already
  records completed one-time orders, but pack redemption is a separate
  feature to build when the pack is switched on.

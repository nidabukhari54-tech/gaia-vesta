# Gaia Vesta — Your Cosmic Blueprint

A Destiny Matrix web app: enter a birth date and decode a 22-arcana chart covering soul purpose, love patterns, money energy, and life path. Built with React + Vite + Tailwind + Supabase.

**Live demo concept:** public landing page with a free, no-signup chart demo → free accounts save charts, generate shareable links, and get AI deep readings → Cosmic plan ($9/mo) unlocks unlimited AI readings.

## Quick start

```bash
npm install
cp .env.example .env   # then fill in your Supabase keys
npm run dev            # http://localhost:5173
```

The landing page, demo, and shared-chart pages work **without** Supabase configured. Sign-in, saving, sharing, and AI readings need the env vars below.

## Supabase setup

1. Create a project at [supabase.com](https://supabase.com).
2. Run the SQL files in `supabase/migrations/` in the Supabase SQL editor (in order), or `supabase db push` with the CLI.
   - `001` creates `profiles` + `charts` tables with row-level security.
   - `002` adds the public read policy for shared chart links.
3. Set in `.env`:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

## Edge Functions (optional but recommended)

Located in `supabase/functions/`:

| Function | Purpose | Required secrets |
|---|---|---|
| `interpret` | AI deep reading from chart data (OpenAI `gpt-4o-mini`), enforces monthly quota | `OPENAI_API_KEY`, `SUPABASE_URL`, `SUPABASE_ANON_KEY` |
| `create-checkout` | Stripe Checkout session for the Cosmic plan | `STRIPE_SECRET_KEY`, `STRIPE_PRICE_ID`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SITE_URL` |
| `stripe-webhook` | Upgrades/downgrades `profiles.plan` on Stripe events | `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` |

Deploy each with:

```bash
supabase functions deploy interpret
supabase secrets set OPENAI_API_KEY=sk-... SUPABASE_URL=... SUPABASE_ANON_KEY=...
```

For Stripe: create a $9/month recurring product in the Stripe dashboard, copy its Price ID into `STRIPE_PRICE_ID`, then register the webhook endpoint `https://<project-ref>.supabase.co/functions/v1/stripe-webhook` for `checkout.session.completed` and `customer.subscription.deleted`.

Without these secrets, the app degrades gracefully: AI and checkout buttons explain what is missing instead of crashing.

## Deployment

Any static host works (the app is a client-side SPA):

- **Netlify / Vercel / Cloudflare Pages:** build command `npm run build`, publish directory `dist`. Add the `VITE_*` env vars in the host dashboard. Add a SPA rewrite (`/* → /index.html`, 200) so `/share/:token` links work on refresh.
- **Preview:** `npm run preview` serves the production build locally.

## Project structure

```
src/
  pages/          Landing, Auth, Dashboard, Chart, MyCharts, Settings, Pricing, SharedChart
  components/
    chart/        DestinyMatrixChart (SVG), ChartCalculator, ArcanaModal, AIReading
    auth/         LoginForm, SignupForm, ProtectedRoute
  lib/            matrix-calculator, arcana-meanings, supabase, auth, AuthContext
supabase/
  migrations/     001 profiles+charts tables & RLS, 002 shared-chart public read policy
  functions/      interpret, create-checkout, stripe-webhook
```

## Notes

- The Destiny Matrix calculation follows the classical 22-arcana reduction method.
- Content is for self-reflection and entertainment — the footer carries a disclaimer.
- `npm run typecheck` and `npm run lint` for code quality.

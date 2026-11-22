import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Star, Check, Sparkles } from 'lucide-react';
import { useAuth } from '../lib/AuthContext';
import { useMetaDescription, DESC } from '../lib/meta';
import { requireSupabase } from '../lib/supabase';
import { isPayPalConfigured } from '../lib/payments';
import { PayPalSubscribe } from '../components/PayPalSubscribe';
import { ConfigNotice } from '../components/ConfigNotice';

const TIERS = [
  {
    id: 'free',
    name: 'Starseed',
    tagline: 'For the curious',
    price: 'Free',
    features: [
      'Unlimited chart calculations',
      'Full 22-arcana interpretations',
      'Save charts to your library',
      '5 AI deep readings / month',
      'Shareable chart links',
    ],
  },
  {
    id: 'premium',
    name: 'Cosmic',
    tagline: 'For the devoted',
    price: '$9',
    per: '/month',
    popular: true,
    features: [
      'Everything in Starseed',
      'Unlimited AI deep readings',
      'Priority new features',
      'Ad-free experience',
      'Support indie astrology',
    ],
  },
];

export function Pricing() {
  useMetaDescription(DESC.pricing);
  const { user, configured } = useAuth();
  const navigate = useNavigate();
  const [plan, setPlan] = useState<string | null>(null);
  const paymentsConfigured = isPayPalConfigured();
  const isPremium = plan === 'premium';

  useEffect(() => {
    document.title = 'Pricing — Free & Cosmic | Gaia Vesta';
  }, []);

  useEffect(() => {
    if (!configured || !user) return;
    let cancelled = false;
    (async () => {
      try {
        const supabase = requireSupabase();
        const { data } = await supabase
          .from('profiles')
          .select('plan')
          .eq('id', user.id)
          .single();
        if (!cancelled && data) setPlan((data as { plan?: string }).plan ?? 'free');
      } catch (e) {
        console.error('Failed to load plan:', e);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [configured, user]);

  return (
    <div className="min-h-screen bg-night text-cream">
      <header className="bg-night2/80 backdrop-blur-sm border-b border-lav/15 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => navigate(user ? '/dashboard' : '/')}
              className="text-lav hover:text-cream transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline">{user ? 'Dashboard' : 'Home'}</span>
            </button>
            <h1 className="text-lg font-serif font-semibold text-cream">Pricing</h1>
            <div className="w-20" />
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative">
        <div className="pointer-events-none absolute -top-6 left-1/2 -translate-x-1/2 w-[34rem] h-[24rem] bg-gold/[0.08] rounded-full blur-3xl" />
        <ConfigNotice />

        <div className="text-center mb-12 relative">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-cream mb-4">Simple pricing</h2>
          <p className="text-lav">Start free. Go deeper when you're ready. Cancel anytime.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {TIERS.map((tier) => (
            <div
              key={tier.id}
              className={
                tier.popular
                  ? 'bg-night3 rounded-3xl p-8 border-2 border-goldlight/60 relative shadow-[0_0_50px_-12px_rgba(231,200,115,0.45)]'
                  : 'bg-night2 rounded-3xl p-8 border border-lav/15'
              }
            >
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-goldlight to-[#C9963C] text-night3 text-xs font-bold px-4 py-1 rounded-full">
                  MOST POPULAR
                </div>
              )}
              <h3 className="text-xl font-serif font-semibold text-cream mb-1">{tier.name}</h3>
              <p className="text-lavdim text-sm mb-4">{tier.tagline}</p>
              <p className="text-4xl font-serif font-bold text-cream mb-6">
                {tier.price}
                {tier.per && <span className="text-lg font-normal text-lavdim">{tier.per}</span>}
              </p>
              <ul className="space-y-3 text-sm text-lav mb-8">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    {tier.popular ? (
                      <Check className="w-4 h-4 text-goldlight mt-0.5 shrink-0" />
                    ) : (
                      <Star className="w-4 h-4 text-goldlight mt-0.5 shrink-0" />
                    )}
                    {f}
                  </li>
                ))}
              </ul>
              {tier.id === 'free' ? (
                <Link
                  to={user ? '/dashboard' : '/auth'}
                  className="block text-center px-6 py-3 bg-white/[0.04] border border-lav/30 text-cream hover:border-goldlight/60 font-medium rounded-xl transition-all"
                >
                  {user ? 'Go to dashboard' : 'Start free'}
                </Link>
              ) : isPremium ? (
                <div className="text-center">
                  <p className="flex items-center justify-center gap-2 px-6 py-3 bg-goldlight/10 border border-goldlight/40 text-goldlight font-semibold rounded-xl">
                    <Sparkles className="w-5 h-5" /> You're on Cosmic
                  </p>
                  <Link to="/settings" className="inline-block mt-3 text-sm text-lav hover:text-cream transition-colors">
                    Manage your plan in Settings
                  </Link>
                </div>
              ) : !paymentsConfigured ? (
                <div className="rounded-2xl border border-goldlight/30 bg-gold/[0.06] p-5">
                  <p className="font-serif text-lg text-cream mb-1.5">
                    Cosmic payments open with our new domain tomorrow — start free today.
                  </p>
                  <p className="text-sm text-lav mb-4">
                    Everything on Starseed is already unlocked, including 5 AI deep readings a month.
                    Cosmic checkout goes live the moment the new domain does — no need to wait to begin.
                  </p>
                  <Link
                    to={user ? '/dashboard' : '/auth'}
                    className="block text-center px-6 py-3 bg-gradient-to-r from-goldlight to-[#C9963C] text-night3 font-semibold rounded-xl hover:shadow-lg transition-all"
                  >
                    Start free — no card needed
                  </Link>
                </div>
              ) : !user ? (
                <button
                  onClick={() => navigate('/auth')}
                  className="w-full px-6 py-3 bg-gradient-to-r from-goldlight to-[#C9963C] text-night3 font-semibold rounded-xl hover:shadow-lg transition-all"
                >
                  Sign in to go Cosmic
                </button>
              ) : (
                <PayPalSubscribe
                  userId={user.id}
                  onSuccess={() => navigate('/settings?upgraded=1')}
                />
              )}
            </div>
          ))}
        </div>

        <p className="text-center text-sm text-lavdim mt-10">
          Secure payments by PayPal · Gaia Vesta is for self-reflection and entertainment.
        </p>
      </main>
    </div>
  );
}

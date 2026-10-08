import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Star, Loader2, Check } from 'lucide-react';
import { useAuth } from '../lib/AuthContext';
import { requireSupabase } from '../lib/supabase';
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
  const { user, configured } = useAuth();
  const navigate = useNavigate();
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpgrade = async () => {
    setError(null);
    if (!user) {
      navigate('/auth');
      return;
    }
    if (!configured) {
      setError('Payments are not configured yet. The site owner needs to add Stripe keys (see README).');
      return;
    }
    setCheckoutLoading(true);
    try {
      const supabase = requireSupabase();
      const { data, error: fnError } = await supabase.functions.invoke('create-checkout');
      if (fnError) throw fnError;
      const url = (data as { url?: string })?.url;
      if (!url) throw new Error('No checkout URL returned');
      window.location.href = url;
    } catch (e) {
      console.error('Checkout failed:', e);
      setError('Could not start checkout. Please try again later.');
      setCheckoutLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fef7ed] to-[#f3e8ff]">
      <header className="bg-white/80 backdrop-blur-sm border-b border-gold/20 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => navigate(user ? '/dashboard' : '/')}
              className="flex items-center gap-2 text-text-primary/70 hover:text-text-primary transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline">{user ? 'Dashboard' : 'Home'}</span>
            </button>
            <h1 className="text-lg font-serif font-semibold text-text-primary">Pricing</h1>
            <div className="w-20" />
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <ConfigNotice />

        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-text-primary mb-4">Simple pricing</h2>
          <p className="text-text-primary/60">Start free. Go deeper when you're ready. Cancel anytime.</p>
        </div>

        {error && (
          <div className="max-w-3xl mx-auto mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {TIERS.map((tier) => (
            <div
              key={tier.id}
              className={
                tier.popular
                  ? 'bg-gradient-to-br from-gold/15 to-purple/15 rounded-2xl p-8 border-2 border-gold/50 relative'
                  : 'bg-white/80 rounded-2xl p-8 border border-gold/20'
              }
            >
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-gold to-purple text-white text-xs font-semibold px-4 py-1 rounded-full">
                  MOST POPULAR
                </div>
              )}
              <h3 className="text-xl font-semibold text-text-primary mb-1">{tier.name}</h3>
              <p className="text-text-primary/60 text-sm mb-4">{tier.tagline}</p>
              <p className="text-4xl font-serif font-bold text-text-primary mb-6">
                {tier.price}
                {tier.per && <span className="text-lg font-normal text-text-primary/60">{tier.per}</span>}
              </p>
              <ul className="space-y-3 text-sm text-text-primary/70 mb-8">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    {tier.popular ? (
                      <Check className="w-4 h-4 text-purple mt-0.5 shrink-0" />
                    ) : (
                      <Star className="w-4 h-4 text-gold mt-0.5 shrink-0" />
                    )}
                    {f}
                  </li>
                ))}
              </ul>
              {tier.id === 'free' ? (
                <Link
                  to={user ? '/dashboard' : '/auth'}
                  className="block text-center px-6 py-3 bg-white/80 border border-gold/40 text-text-primary font-medium rounded-xl hover:border-gold transition-all"
                >
                  {user ? 'Go to dashboard' : 'Start free'}
                </Link>
              ) : (
                <button
                  onClick={handleUpgrade}
                  disabled={checkoutLoading}
                  className="w-full px-6 py-3 bg-gradient-to-r from-gold to-purple text-white font-medium rounded-xl hover:shadow-lg disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                >
                  {checkoutLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" /> Redirecting to checkout...
                    </>
                  ) : (
                    'Go Cosmic'
                  )}
                </button>
              )}
            </div>
          ))}
        </div>

        <p className="text-center text-sm text-text-primary/50 mt-10">
          Secure payments by Stripe · Gaia Vesta is for self-reflection and entertainment.
        </p>
      </main>
    </div>
  );
}

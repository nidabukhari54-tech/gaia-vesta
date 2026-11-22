import { useEffect, useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Settings as SettingsIcon, LogOut, Loader2, Crown, PartyPopper, ExternalLink } from 'lucide-react';
import { useAuth } from '../lib/AuthContext';
import { requireSupabase, type Profile } from '../lib/supabase';
import { fetchLatestSubscription, type SubscriptionRow } from '../lib/payments';
import { ConfigNotice } from '../components/ConfigNotice';

export function Settings() {
  const { user, signOut, configured } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const justUpgraded = searchParams.get('upgraded') === '1';
  const [profile, setProfile] = useState<Profile | null>(null);
  const [subscription, setSubscription] = useState<SubscriptionRow | null>(null);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!configured || !user) {
      setLoading(false);
      return;
    }
    const fetchProfile = async () => {
      try {
        const supabase = requireSupabase();
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        if (error) throw error;
        setProfile(data as Profile);
        setName((data as Profile).name ?? '');
        // Provider/renewal details live in the subscriptions table; this
        // resolves to null until migration 003 is applied — plan display
        // above keeps working from the profile either way.
        setSubscription(await fetchLatestSubscription(user.id));
      } catch (e) {
        console.error('Failed to load profile:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [configured, user]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const supabase = requireSupabase();
      const { error } = await supabase
        .from('profiles')
        .update({ name })
        .eq('id', user.id);
      if (error) throw error;
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (e) {
      console.error('Failed to save profile:', e);
      alert('Could not save changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const isPremium = profile?.plan === 'premium';

  return (
    <div className="min-h-screen bg-night text-cream">
      <header className="bg-night2/80 backdrop-blur-sm border-b border-lav/15 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => navigate('/dashboard')}
              className="text-lav hover:text-cream transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline">Dashboard</span>
            </button>
            <div className="flex items-center gap-2">
              <SettingsIcon className="w-5 h-5 text-goldlight" />
              <h1 className="text-lg font-serif font-semibold text-cream">Settings</h1>
            </div>
            <div className="w-20" />
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ConfigNotice />

        {justUpgraded && (
          <div className="bg-goldlight/10 border border-goldlight/40 rounded-xl p-5 mb-6 flex items-start gap-3">
            <PartyPopper className="w-6 h-6 text-goldlight shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold text-cream">Welcome to Cosmic!</p>
              <p className="text-sm text-lav">Your upgrade is complete — unlimited AI readings are now unlocked.</p>
            </div>
            <button
              onClick={() => { searchParams.delete('upgraded'); setSearchParams(searchParams); }}
              className="text-sm text-lavdim hover:text-cream"
            >
              Dismiss
            </button>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-8 h-8 text-goldlight animate-spin" />
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-night2 backdrop-blur-sm rounded-xl p-6 border border-lav/15">
              <h2 className="text-lg font-semibold text-cream mb-4">Profile</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-lav mb-1">Email</label>
                  <input
                    type="email"
                    value={user?.email ?? ''}
                    disabled
                    className="w-full px-4 py-3 bg-night/60 border border-lav/15 rounded-lg text-lavdim"
                  />
                </div>
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-lav mb-1">
                    Display name
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    className="w-full px-4 py-3 bg-night/50 border border-lav/25 rounded-lg text-cream placeholder:text-lavdim/70 focus:outline-none focus:ring-2 focus:ring-goldlight/60 focus:border-goldlight/60 transition-all"
                  />
                </div>
                <button
                  onClick={handleSave}
                  disabled={saving || !configured}
                  className="px-6 py-2.5 bg-gradient-to-r from-goldlight to-[#C9963C] text-night3 font-semibold rounded-lg hover:shadow-lg disabled:opacity-50 transition-all"
                >
                  {saved ? 'Saved!' : saving ? 'Saving...' : 'Save changes'}
                </button>
              </div>
            </div>

            <div className="bg-night2 backdrop-blur-sm rounded-xl p-6 border border-lav/15">
              <h2 className="text-lg font-semibold text-cream mb-4">Plan & usage</h2>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  {isPremium && <Crown className="w-5 h-5 text-gold" />}
                  <div>
                    <p className="font-medium text-cream">{isPremium ? 'Cosmic plan' : 'Starseed plan (Free)'}</p>
                    <p className="text-sm text-lavdim">
                      AI readings used: {profile?.ai_queries_used ?? 0} / {profile?.ai_queries_limit ?? 5} this month
                    </p>
                    {subscription && (
                      <p className="text-sm text-lavdim">
                        Billed via{' '}
                        {subscription.provider === 'paypal'
                          ? 'PayPal'
                          : subscription.provider === 'stripe'
                            ? 'Stripe'
                            : subscription.provider}
                        {subscription.current_period_end
                          ? ` · renews ${new Date(subscription.current_period_end).toLocaleDateString(undefined, {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}`
                          : ''}
                      </p>
                    )}
                  </div>
                </div>
                {!isPremium && (
                  <Link
                    to="/pricing"
                    className="px-5 py-2.5 bg-gradient-to-r from-goldlight to-[#C9963C] text-night3 text-sm font-semibold rounded-lg hover:shadow-lg transition-all"
                  >
                    Upgrade
                  </Link>
                )}
              </div>
              {subscription?.provider === 'paypal' && isPremium && (
                <a
                  href="https://www.paypal.com/myaccount/autopay"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-goldlight hover:text-gold transition-colors mb-4"
                >
                  Manage subscription on PayPal <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
              <div className="w-full bg-white/10 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-goldlight to-[#C9963C] h-2 rounded-full transition-all"
                  style={{
                    width: `${Math.min(100, ((profile?.ai_queries_used ?? 0) / (profile?.ai_queries_limit ?? 5)) * 100)}%`,
                  }}
                />
              </div>
            </div>

            <div className="bg-night2 backdrop-blur-sm rounded-xl p-6 border border-lav/15">
              <h2 className="text-lg font-semibold text-cream mb-4">Account</h2>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 px-5 py-2.5 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
              >
                <LogOut className="w-5 h-5" /> Sign out
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Settings as SettingsIcon, LogOut, Loader2, Crown, PartyPopper } from 'lucide-react';
import { useAuth } from '../lib/AuthContext';
import { requireSupabase, type Profile } from '../lib/supabase';
import { ConfigNotice } from '../components/ConfigNotice';

export function Settings() {
  const { user, signOut, configured } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const justUpgraded = searchParams.get('upgraded') === '1';
  const [profile, setProfile] = useState<Profile | null>(null);
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
    <div className="min-h-screen bg-gradient-to-br from-[#fef7ed] to-[#f3e8ff]">
      <header className="bg-white/80 backdrop-blur-sm border-b border-gold/20 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 text-text-primary/70 hover:text-text-primary transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline">Dashboard</span>
            </button>
            <div className="flex items-center gap-2">
              <SettingsIcon className="w-5 h-5 text-purple" />
              <h1 className="text-lg font-serif font-semibold text-text-primary">Settings</h1>
            </div>
            <div className="w-20" />
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ConfigNotice />

        {justUpgraded && (
          <div className="bg-gradient-to-r from-gold/20 to-purple/20 border border-gold/40 rounded-xl p-5 mb-6 flex items-start gap-3">
            <PartyPopper className="w-6 h-6 text-gold shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold text-text-primary">Welcome to Cosmic!</p>
              <p className="text-sm text-text-primary/70">Your upgrade is complete — unlimited AI readings are now unlocked.</p>
            </div>
            <button
              onClick={() => { searchParams.delete('upgraded'); setSearchParams(searchParams); }}
              className="text-sm text-text-primary/50 hover:text-text-primary"
            >
              Dismiss
            </button>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-8 h-8 text-purple animate-spin" />
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gold/20">
              <h2 className="text-lg font-semibold text-text-primary mb-4">Profile</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary/70 mb-1">Email</label>
                  <input
                    type="email"
                    value={user?.email ?? ''}
                    disabled
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-text-primary/60"
                  />
                </div>
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-text-primary/70 mb-1">
                    Display name
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    className="w-full px-4 py-3 bg-white/80 border border-purple/30 rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition-all"
                  />
                </div>
                <button
                  onClick={handleSave}
                  disabled={saving || !configured}
                  className="px-6 py-2.5 bg-gradient-to-r from-gold to-purple text-white font-medium rounded-lg hover:shadow-lg disabled:opacity-50 transition-all"
                >
                  {saved ? 'Saved!' : saving ? 'Saving...' : 'Save changes'}
                </button>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gold/20">
              <h2 className="text-lg font-semibold text-text-primary mb-4">Plan & usage</h2>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  {isPremium && <Crown className="w-5 h-5 text-gold" />}
                  <div>
                    <p className="font-medium text-text-primary capitalize">{profile?.plan ?? 'free'} plan</p>
                    <p className="text-sm text-text-primary/60">
                      AI readings used: {profile?.ai_queries_used ?? 0} / {profile?.ai_queries_limit ?? 5} this month
                    </p>
                  </div>
                </div>
                {!isPremium && (
                  <Link
                    to="/pricing"
                    className="px-5 py-2.5 bg-gradient-to-r from-gold to-purple text-white text-sm font-medium rounded-lg hover:shadow-lg transition-all"
                  >
                    Upgrade
                  </Link>
                )}
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-gold to-purple h-2 rounded-full transition-all"
                  style={{
                    width: `${Math.min(100, ((profile?.ai_queries_used ?? 0) / (profile?.ai_queries_limit ?? 5)) * 100)}%`,
                  }}
                />
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gold/20">
              <h2 className="text-lg font-semibold text-text-primary mb-4">Account</h2>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 px-5 py-2.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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

import { useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';
import { usePageMeta, DESC } from '../lib/meta';
import { Sparkles, LogOut, User, Plus, BarChart3, Settings as SettingsIcon, Crown, HeartHandshake, Wrench } from 'lucide-react';

export function Dashboard() {
  usePageMeta('Dashboard | Gaia Vesta', DESC.dashboard);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-night text-cream">
      <header className="bg-night2/80 backdrop-blur-sm border-b border-lav/15 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-goldlight to-[#C9963C] rounded-full flex items-center justify-center shadow-md">
                <Sparkles className="w-5 h-5 text-night3" />
              </div>
              <h1 className="text-xl font-serif font-semibold text-cream">
                Gaia Vesta
              </h1>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-lav">
                <User className="w-5 h-5" />
                <span className="hidden sm:inline text-sm font-medium">
                  {user?.email}
                </span>
              </div>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 px-4 py-2 text-lav
                           hover:text-cream hover:bg-white/[0.06] rounded-lg
                           transition-all duration-200"
              >
                <LogOut className="w-5 h-5" />
                <span className="hidden sm:inline text-sm">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-serif font-semibold text-cream mb-2">
            Welcome back!
          </h2>
          <p className="text-lav">
            Your cosmic journey continues here
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <button
            onClick={() => navigate('/chart')}
            className="bg-night2 backdrop-blur-sm rounded-xl p-6 border border-lav/15
                       hover:border-goldlight/40 hover:shadow-lg transition-all duration-200
                       text-left group"
          >
            <div className="w-12 h-12 bg-gradient-to-r from-goldlight to-[#C9963C] rounded-lg
                            flex items-center justify-center mb-4 group-hover:scale-110
                            transition-transform duration-200">
              <Plus className="w-6 h-6 text-night3" />
            </div>
            <h3 className="text-lg font-semibold text-cream mb-2">
              New Chart
            </h3>
            <p className="text-sm text-lavdim">
              Create a new birth chart or transit analysis
            </p>
          </button>

          <button
            onClick={() => navigate('/my-charts')}
            className="bg-night2 backdrop-blur-sm rounded-xl p-6 border border-lav/15
                       hover:border-goldlight/40 hover:shadow-lg transition-all duration-200
                       text-left group"
          >
            <div className="w-12 h-12 bg-gradient-to-r from-goldlight to-[#C9963C] rounded-lg
                            flex items-center justify-center mb-4 group-hover:scale-110
                            transition-transform duration-200">
              <BarChart3 className="w-6 h-6 text-night3" />
            </div>
            <h3 className="text-lg font-semibold text-cream mb-2">
              My Charts
            </h3>
            <p className="text-sm text-lavdim">
              View and manage your saved charts
            </p>
          </button>

          <button
            onClick={() => navigate('/settings')}
            className="bg-night2 backdrop-blur-sm rounded-xl p-6 border border-lav/15
                       hover:border-goldlight/40 hover:shadow-lg transition-all duration-200
                       text-left group"
          >
            <div className="w-12 h-12 bg-gradient-to-r from-goldlight to-[#C9963C] rounded-lg
                            flex items-center justify-center mb-4 group-hover:scale-110
                            transition-transform duration-200">
              <SettingsIcon className="w-6 h-6 text-night3" />
            </div>
            <h3 className="text-lg font-semibold text-cream mb-2">
              Settings
            </h3>
            <p className="text-sm text-lavdim">
              Manage your account and preferences
            </p>
          </button>

          <button
            onClick={() => navigate('/pricing')}
            className="bg-night3 backdrop-blur-sm rounded-xl p-6 border border-goldlight/40
                       hover:border-goldlight/70 hover:shadow-lg transition-all duration-200
                       text-left group"
          >
            <div className="w-12 h-12 bg-gradient-to-r from-goldlight to-[#C9963C] rounded-lg
                            flex items-center justify-center mb-4 group-hover:scale-110
                            transition-transform duration-200">
              <Crown className="w-6 h-6 text-night3" />
            </div>
            <h3 className="text-lg font-semibold text-cream mb-2">
              Go Cosmic
            </h3>
            <p className="text-sm text-lavdim">
              Unlimited AI readings and more
            </p>
          </button>

          <button
            onClick={() => navigate('/tools/compatibility')}
            className="bg-night2 backdrop-blur-sm rounded-xl p-6 border border-lav/15
                       hover:border-goldlight/40 hover:shadow-lg transition-all duration-200
                       text-left group"
          >
            <div className="w-12 h-12 bg-gradient-to-r from-goldlight to-[#C9963C] rounded-lg
                            flex items-center justify-center mb-4 group-hover:scale-110
                            transition-transform duration-200">
              <HeartHandshake className="w-6 h-6 text-night3" />
            </div>
            <h3 className="text-lg font-semibold text-cream mb-2">
              Compatibility
            </h3>
            <p className="text-sm text-lavdim">
              Merge two charts into one couple's reading
            </p>
          </button>

          <button
            onClick={() => navigate('/tools')}
            className="bg-night2 backdrop-blur-sm rounded-xl p-6 border border-lav/15
                       hover:border-goldlight/40 hover:shadow-lg transition-all duration-200
                       text-left group"
          >
            <div className="w-12 h-12 bg-gradient-to-r from-goldlight to-[#C9963C] rounded-lg
                            flex items-center justify-center mb-4 group-hover:scale-110
                            transition-transform duration-200">
              <Wrench className="w-6 h-6 text-night3" />
            </div>
            <h3 className="text-lg font-semibold text-cream mb-2">
              All Tools
            </h3>
            <p className="text-sm text-lavdim">
              Forecasts, numerology, moon phases and more
            </p>
          </button>
        </div>

        <div className="bg-night2 backdrop-blur-sm rounded-xl p-6 border border-lav/15">
          <h3 className="text-xl font-serif font-semibold text-cream mb-4">
            Getting Started
          </h3>
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 bg-white/[0.04] rounded-lg">
              <div className="w-8 h-8 bg-goldlight/15 rounded-full flex items-center justify-center text-goldlight font-semibold">
                1
              </div>
              <div>
                <h4 className="font-medium text-cream mb-1">
                  Create your first chart
                </h4>
                <p className="text-sm text-lavdim">
                  Enter birth details to generate your personalized astrological chart
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 bg-white/[0.04] rounded-lg">
              <div className="w-8 h-8 bg-goldlight/15 rounded-full flex items-center justify-center text-goldlight font-semibold">
                2
              </div>
              <div>
                <h4 className="font-medium text-cream mb-1">
                  Explore interpretations
                </h4>
                <p className="text-sm text-lavdim">
                  Get AI-powered insights about your planetary placements
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 bg-white/[0.04] rounded-lg">
              <div className="w-8 h-8 bg-goldlight/15 rounded-full flex items-center justify-center text-goldlight font-semibold">
                3
              </div>
              <div>
                <h4 className="font-medium text-cream mb-1">
                  Share with others
                </h4>
                <p className="text-sm text-lavdim">
                  Create shareable links for your charts
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

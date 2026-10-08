import { useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';
import { Sparkles, LogOut, User, Plus, BarChart3, Settings as SettingsIcon, Crown } from 'lucide-react';

export function Dashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fef7ed] to-[#f3e8ff]">
      <header className="bg-white/80 backdrop-blur-sm border-b border-gold/20 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-gold to-purple rounded-full flex items-center justify-center shadow-md">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-serif font-semibold text-text-primary">
                Gaia Vesta
              </h1>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-text-primary/70">
                <User className="w-5 h-5" />
                <span className="hidden sm:inline text-sm font-medium">
                  {user?.email}
                </span>
              </div>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 px-4 py-2 text-text-primary/70
                           hover:text-text-primary hover:bg-white/80 rounded-lg
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
          <h2 className="text-3xl font-serif font-semibold text-text-primary mb-2">
            Welcome back!
          </h2>
          <p className="text-text-primary/70">
            Your cosmic journey continues here
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <button
            onClick={() => navigate('/chart')}
            className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gold/20
                       hover:border-gold/40 hover:shadow-lg transition-all duration-200
                       text-left group"
          >
            <div className="w-12 h-12 bg-gradient-to-r from-gold to-purple rounded-lg
                            flex items-center justify-center mb-4 group-hover:scale-110
                            transition-transform duration-200">
              <Plus className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-text-primary mb-2">
              New Chart
            </h3>
            <p className="text-sm text-text-primary/60">
              Create a new birth chart or transit analysis
            </p>
          </button>

          <button
            onClick={() => navigate('/my-charts')}
            className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gold/20
                       hover:border-gold/40 hover:shadow-lg transition-all duration-200
                       text-left group"
          >
            <div className="w-12 h-12 bg-gradient-to-r from-gold to-purple rounded-lg
                            flex items-center justify-center mb-4 group-hover:scale-110
                            transition-transform duration-200">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-text-primary mb-2">
              My Charts
            </h3>
            <p className="text-sm text-text-primary/60">
              View and manage your saved charts
            </p>
          </button>

          <button
            onClick={() => navigate('/settings')}
            className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gold/20
                       hover:border-gold/40 hover:shadow-lg transition-all duration-200
                       text-left group"
          >
            <div className="w-12 h-12 bg-gradient-to-r from-gold to-purple rounded-lg
                            flex items-center justify-center mb-4 group-hover:scale-110
                            transition-transform duration-200">
              <SettingsIcon className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-text-primary mb-2">
              Settings
            </h3>
            <p className="text-sm text-text-primary/60">
              Manage your account and preferences
            </p>
          </button>

          <button
            onClick={() => navigate('/pricing')}
            className="bg-gradient-to-br from-gold/15 to-purple/15 backdrop-blur-sm rounded-xl p-6 border border-gold/30
                       hover:border-gold/60 hover:shadow-lg transition-all duration-200
                       text-left group"
          >
            <div className="w-12 h-12 bg-gradient-to-r from-gold to-purple rounded-lg
                            flex items-center justify-center mb-4 group-hover:scale-110
                            transition-transform duration-200">
              <Crown className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-text-primary mb-2">
              Go Cosmic
            </h3>
            <p className="text-sm text-text-primary/60">
              Unlimited AI readings and more
            </p>
          </button>
        </div>

        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-gold/20">
          <h3 className="text-xl font-serif font-semibold text-text-primary mb-4">
            Getting Started
          </h3>
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 bg-gold/5 rounded-lg">
              <div className="w-8 h-8 bg-gold/20 rounded-full flex items-center justify-center text-gold font-semibold">
                1
              </div>
              <div>
                <h4 className="font-medium text-text-primary mb-1">
                  Create your first chart
                </h4>
                <p className="text-sm text-text-primary/60">
                  Enter birth details to generate your personalized astrological chart
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 bg-gold/5 rounded-lg">
              <div className="w-8 h-8 bg-gold/20 rounded-full flex items-center justify-center text-gold font-semibold">
                2
              </div>
              <div>
                <h4 className="font-medium text-text-primary mb-1">
                  Explore interpretations
                </h4>
                <p className="text-sm text-text-primary/60">
                  Get AI-powered insights about your planetary placements
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 bg-gold/5 rounded-lg">
              <div className="w-8 h-8 bg-gold/20 rounded-full flex items-center justify-center text-gold font-semibold">
                3
              </div>
              <div>
                <h4 className="font-medium text-text-primary mb-1">
                  Share with others
                </h4>
                <p className="text-sm text-text-primary/60">
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

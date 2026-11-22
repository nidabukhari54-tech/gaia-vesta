import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginForm } from '../components/auth/LoginForm';
import { SignupForm } from '../components/auth/SignupForm';
import { useAuth } from '../lib/AuthContext';
import { ConfigNotice } from '../components/ConfigNotice';

export function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-night flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-goldlight/30 border-t-goldlight rounded-full animate-spin mx-auto mb-4" />
          <p className="text-lav font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-night text-cream relative overflow-x-clip flex items-center justify-center px-4 py-8">
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[38rem] h-[38rem] bg-gold/10 rounded-full blur-3xl" />
      <div className="w-full max-w-lg relative">
        <div className="text-center mb-8">
          <img
            src="/images/gaia-character.webp"
            alt="Gaia"
            className="w-20 h-20 rounded-full object-cover border-2 border-goldlight/60 shadow-[0_0_36px_rgba(231,200,115,0.35)] mx-auto mb-4"
          />
          <h1 className="text-4xl font-serif font-bold text-cream mb-2">
            Gaia Vesta
          </h1>
          <p className="text-lav">
            Discover your cosmic blueprint
          </p>
        </div>

        <div className="bg-night2 rounded-3xl shadow-xl p-8 border border-goldlight/25">
          <ConfigNotice />
          {isLogin ? (
            <LoginForm onSwitchToSignup={() => setIsLogin(false)} />
          ) : (
            <SignupForm onSwitchToLogin={() => setIsLogin(true)} />
          )}
        </div>

        <div className="text-center mt-8 text-sm text-lavdim">
          <p>By continuing, you agree to our Terms of Service and Privacy Policy</p>
        </div>
      </div>
    </div>
  );
}

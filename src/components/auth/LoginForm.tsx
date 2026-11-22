import React, { useState } from 'react';
import { useAuth } from '../../lib/AuthContext';
import { Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react';

type LoginFormProps = {
  onSwitchToSignup: () => void;
};

export function LoginForm({ onSwitchToSignup }: LoginFormProps) {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error: authError } = await signIn(email, password);

    if (authError) {
      setError(authError.message);
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-serif font-semibold text-cream mb-2">
          Welcome Back
        </h2>
        <p className="text-lav">
          Sign in to continue your cosmic journey
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="login-email" className="block text-sm font-medium text-cream mb-2">
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-lavdim" />
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-night/50 border border-lav/25 rounded-lg
                         text-cream placeholder:text-lavdim/70
                         focus:outline-none focus:ring-2 focus:ring-goldlight/60 focus:border-goldlight/60
                         transition-all duration-200"
              placeholder="Enter your email"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="login-password" className="block text-sm font-medium text-cream mb-2">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-lavdim" />
            <input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-12 pr-12 py-3 bg-night/50 border border-lav/25 rounded-lg
                         text-cream placeholder:text-lavdim/70
                         focus:outline-none focus:ring-2 focus:ring-goldlight/60 focus:border-goldlight/60
                         transition-all duration-200"
              placeholder="Enter your password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-lavdim
                         hover:text-cream transition-colors"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-300 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 bg-gradient-to-r from-goldlight to-[#C9963C] text-night3 font-semibold
                     rounded-lg shadow-md hover:shadow-lg disabled:opacity-50
                     disabled:cursor-not-allowed transition-all duration-200
                     flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-night3/30 border-t-night3 rounded-full animate-spin" />
              Signing in...
            </>
          ) : (
            <>
              <LogIn className="w-5 h-5" />
              Sign In
            </>
          )}
        </button>

        <div className="text-center pt-4">
          <p className="text-lav">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={onSwitchToSignup}
              className="text-goldlight hover:text-gold font-medium transition-colors"
            >
              Sign Up
            </button>
          </p>
        </div>
      </form>
    </div>
  );
}

import React, { useState } from 'react';
import { useAuth } from '../../lib/AuthContext';
import { Mail, Lock, Eye, EyeOff, UserPlus, User } from 'lucide-react';

type SignupFormProps = {
  onSwitchToLogin: () => void;
};

export function SignupForm({ onSwitchToLogin }: SignupFormProps) {
  const { signUp } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    const { error: authError } = await signUp(email, password);

    if (authError) {
      setError(authError.message);
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="w-full max-w-md mx-auto text-center">
        <div className="w-16 h-16 bg-gradient-to-r from-gold to-purple rounded-full flex items-center justify-center mx-auto mb-6">
          <UserPlus className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-serif font-semibold text-text-primary mb-4">
          Account Created!
        </h2>
        <p className="text-text-primary/70 mb-6">
          Please check your email to confirm your account, then sign in.
        </p>
        <button
          onClick={onSwitchToLogin}
          className="text-gold hover:text-purple font-medium transition-colors"
        >
          Back to Sign In
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-serif font-semibold text-text-primary mb-2">
          Create Account
        </h2>
        <p className="text-text-primary/70">
          Begin your astrological journey
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="signup-name" className="block text-sm font-medium text-text-primary mb-2">
            Name (optional)
          </label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-primary/50" />
            <input
              id="signup-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/80 border border-gold/30 rounded-lg
                         text-text-primary placeholder:text-text-primary/40
                         focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold
                         transition-all duration-200"
              placeholder="Your name"
            />
          </div>
        </div>

        <div>
          <label htmlFor="signup-email" className="block text-sm font-medium text-text-primary mb-2">
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-primary/50" />
            <input
              id="signup-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/80 border border-gold/30 rounded-lg
                         text-text-primary placeholder:text-text-primary/40
                         focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold
                         transition-all duration-200"
              placeholder="Enter your email"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="signup-password" className="block text-sm font-medium text-text-primary mb-2">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-primary/50" />
            <input
              id="signup-password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-12 pr-12 py-3 bg-white/80 border border-gold/30 rounded-lg
                         text-text-primary placeholder:text-text-primary/40
                         focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold
                         transition-all duration-200"
              placeholder="Create a password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-text-primary/50
                         hover:text-text-primary transition-colors"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <div>
          <label htmlFor="signup-confirm" className="block text-sm font-medium text-text-primary mb-2">
            Confirm Password
          </label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-primary/50" />
            <input
              id="signup-confirm"
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/80 border border-gold/30 rounded-lg
                         text-text-primary placeholder:text-text-primary/40
                         focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold
                         transition-all duration-200"
              placeholder="Confirm your password"
              required
            />
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 bg-gradient-to-r from-gold to-purple text-white font-medium
                     rounded-lg shadow-md hover:shadow-lg disabled:opacity-50
                     disabled:cursor-not-allowed transition-all duration-200
                     flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Creating account...
            </>
          ) : (
            <>
              <UserPlus className="w-5 h-5" />
              Create Account
            </>
          )}
        </button>

        <div className="text-center pt-4">
          <p className="text-text-primary/70">
            Already have an account?{' '}
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="text-gold hover:text-purple font-medium transition-colors"
            >
              Sign In
            </button>
          </p>
        </div>
      </form>
    </div>
  );
}

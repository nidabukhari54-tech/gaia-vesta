import { AlertTriangle } from 'lucide-react';
import { useAuth } from '../lib/AuthContext';

/**
 * Shown on auth/cloud pages when the Supabase environment variables are missing.
 */
export function ConfigNotice() {
  const { configured } = useAuth();

  if (configured) return null;

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 flex items-start gap-3">
      <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
      <div className="text-sm">
        <p className="font-semibold text-amber-800 mb-1">Cloud features not configured</p>
        <p className="text-amber-700">
          Set <code className="font-mono bg-amber-100 px-1 rounded">VITE_SUPABASE_URL</code> and{' '}
          <code className="font-mono bg-amber-100 px-1 rounded">VITE_SUPABASE_ANON_KEY</code> to
          enable sign-in, saving charts, and sharing. See the README for setup instructions.
        </p>
      </div>
    </div>
  );
}

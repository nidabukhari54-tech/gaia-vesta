import { useEffect, useState } from 'react';
import { BrainCircuit, Loader2, Sparkles, Lock } from 'lucide-react';
import { useAuth } from '../../lib/AuthContext';
import { requireSupabase, isSupabaseConfigured } from '../../lib/supabase';
import type { DestinyMatrixResult } from '../../lib/matrix-calculator';

type AIReadingProps = {
  result: DestinyMatrixResult;
  personName: string;
  birthDate: Date;
};

export function AIReading({ result, personName, birthDate }: AIReadingProps) {
  const { user, configured } = useAuth();
  const [loading, setLoading] = useState(false);
  const [reading, setReading] = useState<string | null>(null);
  const [quota, setQuota] = useState<{ used: number; limit: number; plan: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!configured || !user) return;
    const fetchQuota = async () => {
      try {
        const supabase = requireSupabase();
        const { data } = await supabase
          .from('profiles')
          .select('ai_queries_used, ai_queries_limit, plan')
          .eq('id', user.id)
          .single();
        if (data) {
          setQuota({
            used: data.ai_queries_used ?? 0,
            limit: data.ai_queries_limit ?? 5,
            plan: data.plan ?? 'free',
          });
        }
      } catch (e) {
        console.error('Failed to load AI quota:', e);
      }
    };
    fetchQuota();
  }, [configured, user]);

  const handleGenerate = async () => {
    setError(null);
    if (!configured) {
      setError('AI readings need Supabase configured. See the README.');
      return;
    }
    setLoading(true);
    try {
      const supabase = requireSupabase();
      const { data, error: fnError } = await supabase.functions.invoke('interpret', {
        body: {
          personName,
          birthDate: birthDate.toISOString().split('T')[0],
          matrix: result,
        },
      });
      if (fnError) throw fnError;
      const text = (data as { reading?: string; error?: string })?.reading;
      if (!text) throw new Error((data as { error?: string })?.error ?? 'No reading returned');
      setReading(text);
      setQuota((q) => (q ? { ...q, used: q.used + 1 } : q));
    } catch (e) {
      console.error('AI reading failed:', e);
      const message = e instanceof Error ? e.message : 'Something went wrong';
      if (/quota|limit/i.test(message)) {
        setError('You have used all your free AI readings this month. Upgrade to Cosmic for unlimited readings.');
      } else {
        setError('Could not generate the reading. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  const quotaExhausted = quota !== null && quota.used >= quota.limit && quota.plan !== 'premium';

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-purple/20 mb-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-gradient-to-r from-gold to-purple rounded-full flex items-center justify-center">
          <BrainCircuit className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="font-semibold text-text-primary">AI Deep Reading</h3>
          <p className="text-xs text-text-primary/60">
            {quota
              ? `${quota.used}/${quota.limit} free readings used this month${quota.plan === 'premium' ? ' (unlimited on Cosmic)' : ''}`
              : 'A personalized interpretation woven from your full chart'}
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-4">
          {error}
        </div>
      )}

      {reading ? (
        <div className="animate-fadeIn">
          <div className="bg-gradient-to-br from-purple/5 to-gold/5 rounded-lg p-5 border border-gold/20">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-gold" />
              <p className="text-sm font-semibold text-text-primary">Your personalized reading</p>
            </div>
            <p className="text-text-primary/80 whitespace-pre-wrap leading-relaxed text-sm">{reading}</p>
          </div>
          <button
            onClick={() => setReading(null)}
            className="mt-3 text-sm text-purple hover:text-text-primary transition-colors"
          >
            Generate a fresh reading
          </button>
        </div>
      ) : (
        <button
          onClick={handleGenerate}
          disabled={loading || quotaExhausted || !isSupabaseConfigured}
          className="w-full py-3 px-4 bg-gradient-to-r from-gold to-purple text-white font-medium rounded-lg
                     hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all
                     flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" /> Consulting the stars...
            </>
          ) : quotaExhausted ? (
            <>
              <Lock className="w-5 h-5" /> Monthly limit reached — upgrade for more
            </>
          ) : (
            <>
              <BrainCircuit className="w-5 h-5" /> Generate my AI reading
            </>
          )}
        </button>
      )}
    </div>
  );
}

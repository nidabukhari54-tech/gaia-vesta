import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Sparkles, Loader2, ArrowRight, Lock } from 'lucide-react';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import { DestinyMatrixChart } from '../components/chart/DestinyMatrixChart';
import { ArcanaModal, SelectedArcana } from '../components/chart/ArcanaModal';
import { getArcana } from '../lib/arcana-meanings';
import type { DestinyMatrixResult } from '../lib/matrix-calculator';

type SharedChartData = {
  person_name: string;
  birth_date: string;
  chart_data: DestinyMatrixResult;
  created_at: string;
};

export function SharedChart() {
  const { token } = useParams<{ token: string }>();
  const [chart, setChart] = useState<SharedChartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [selectedArcana, setSelectedArcana] = useState<SelectedArcana | null>(null);

  useEffect(() => {
    const client = supabase;
    if (!isSupabaseConfigured || !client || !token) {
      setLoading(false);
      setNotFound(true);
      return;
    }
    const fetchChart = async () => {
      try {
        const { data, error } = await client
          .from('charts')
          .select('person_name, birth_date, chart_data, created_at')
          .eq('shared_link', token)
          .eq('is_shared', true)
          .single();
        if (error || !data) {
          setNotFound(true);
        } else {
          setChart(data as SharedChartData);
        }
      } catch (e) {
        console.error('Failed to load shared chart:', e);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    fetchChart();
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#fef7ed] to-[#f3e8ff] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-purple animate-spin" />
      </div>
    );
  }

  if (notFound || !chart) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#fef7ed] to-[#f3e8ff] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-purple/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-purple/60" />
          </div>
          <h1 className="text-2xl font-serif font-semibold text-text-primary mb-2">Chart not available</h1>
          <p className="text-text-primary/60 mb-6">
            This link is invalid, or the chart is no longer shared. Ask the owner for a fresh link.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gold to-purple text-white font-medium rounded-xl hover:shadow-lg transition-all"
          >
            <Sparkles className="w-5 h-5" /> Create your own chart
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f4ff] to-[#fef7ed]">
      <header className="bg-white/80 backdrop-blur-sm border-b border-purple/20">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-r from-gold to-purple rounded-full flex items-center justify-center shadow-md">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <h1 className="text-lg font-serif font-semibold text-text-primary">Gaia Vesta</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-6">
          <p className="text-sm text-text-primary/50 mb-1">A shared Destiny Matrix</p>
          <h2 className="text-3xl font-serif font-semibold text-text-primary">{chart.person_name}</h2>
          <p className="text-text-primary/60 text-sm mt-1">
            Born {new Date(chart.birth_date + 'T00:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>

        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 mb-6 shadow-xl border border-purple/20">
          <DestinyMatrixChart
            result={chart.chart_data}
            onNodeClick={(position, arcana) =>
              setSelectedArcana({ position, arcana: getArcana(arcana.id) })
            }
          />
          <p className="text-center text-sm text-text-primary/50 mt-2">Tap any node for its meaning</p>
        </div>

        <div className="bg-gradient-to-r from-gold/10 to-purple/10 border border-gold/30 rounded-2xl p-8 text-center">
          <h3 className="text-xl font-serif font-semibold text-text-primary mb-2">Discover your own cosmic blueprint</h3>
          <p className="text-text-primary/60 mb-5">Free forever. Calculate your Destiny Matrix in seconds.</p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-gold to-purple text-white font-medium rounded-xl hover:shadow-xl transition-all"
          >
            Reveal my chart <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </main>

      <ArcanaModal selected={selectedArcana} onClose={() => setSelectedArcana(null)} />
    </div>
  );
}

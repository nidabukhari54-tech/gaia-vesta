import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, BarChart3, Trash2, Eye, Plus, Loader2 } from 'lucide-react';
import { useAuth } from '../lib/AuthContext';
import { requireSupabase, type ChartRow } from '../lib/supabase';
import { DestinyMatrixChart } from '../components/chart/DestinyMatrixChart';
import { ArcanaModal, SelectedArcana } from '../components/chart/ArcanaModal';
import { ConfigNotice } from '../components/ConfigNotice';
import { getArcana } from '../lib/arcana-meanings';
import type { DestinyMatrixResult } from '../lib/matrix-calculator';

export function MyCharts() {
  const { user, configured } = useAuth();
  const navigate = useNavigate();
  const [charts, setCharts] = useState<ChartRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewing, setViewing] = useState<ChartRow | null>(null);
  const [selectedArcana, setSelectedArcana] = useState<SelectedArcana | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    if (!configured || !user) {
      setLoading(false);
      return;
    }
    const fetchCharts = async () => {
      try {
        const supabase = requireSupabase();
        const { data, error } = await supabase
          .from('charts')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        if (error) throw error;
        setCharts((data ?? []) as ChartRow[]);
      } catch (e) {
        console.error('Failed to load charts:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchCharts();
  }, [configured, user]);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this chart? This cannot be undone.')) return;
    setDeleting(id);
    try {
      const supabase = requireSupabase();
      const { error } = await supabase.from('charts').delete().eq('id', id);
      if (error) throw error;
      setCharts((prev) => prev.filter((c) => c.id !== id));
      if (viewing?.id === id) setViewing(null);
    } catch (e) {
      console.error('Failed to delete chart:', e);
      alert('Could not delete the chart. Please try again.');
    } finally {
      setDeleting(null);
    }
  };

  const formatDate = (iso: string) =>
    new Date(iso + 'T00:00:00').toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fef7ed] to-[#f3e8ff]">
      <header className="bg-white/80 backdrop-blur-sm border-b border-gold/20 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 text-text-primary/70 hover:text-text-primary transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline">Dashboard</span>
            </button>
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-purple" />
              <h1 className="text-lg font-serif font-semibold text-text-primary">My Charts</h1>
            </div>
            <Link
              to="/chart"
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gold to-purple text-white text-sm font-medium rounded-lg hover:shadow-lg transition-all"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">New Chart</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ConfigNotice />

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-8 h-8 text-purple animate-spin" />
          </div>
        ) : charts.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-16 h-16 bg-purple/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="w-8 h-8 text-purple/60" />
            </div>
            <h2 className="text-2xl font-serif font-semibold text-text-primary mb-2">No charts yet</h2>
            <p className="text-text-primary/60 mb-6">Create your first Destiny Matrix to start your collection.</p>
            <Link
              to="/chart"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gold to-purple text-white font-medium rounded-xl hover:shadow-lg transition-all"
            >
              <Plus className="w-5 h-5" /> Create a chart
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {charts.map((chart) => (
              <div
                key={chart.id}
                className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gold/20 hover:border-gold/40 hover:shadow-lg transition-all"
              >
                <h3 className="text-lg font-semibold text-text-primary mb-1">{chart.person_name}</h3>
                <p className="text-sm text-text-primary/60 mb-1">Born {formatDate(chart.birth_date)}</p>
                <p className="text-xs text-text-primary/40 mb-4">
                  Saved {new Date(chart.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  {chart.is_shared && chart.shared_link && (
                    <span className="ml-2 inline-block bg-green-100 text-green-700 px-2 py-0.5 rounded-full">shared</span>
                  )}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setViewing(chart)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-gold to-purple text-white text-sm font-medium rounded-lg hover:shadow transition-all"
                  >
                    <Eye className="w-4 h-4" /> View
                  </button>
                  <button
                    onClick={() => handleDelete(chart.id)}
                    disabled={deleting === chart.id}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                    aria-label="Delete chart"
                  >
                    {deleting === chart.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {viewing && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 overflow-y-auto" onClick={() => setViewing(null)}>
          <div
            className="min-h-full flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 my-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-serif font-semibold text-text-primary">{viewing.person_name}</h3>
                  <p className="text-sm text-text-primary/60">Born {formatDate(viewing.birth_date)}</p>
                </div>
                <button
                  onClick={() => setViewing(null)}
                  className="px-4 py-2 text-sm text-text-primary/60 hover:text-text-primary hover:bg-purple/10 rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
              <DestinyMatrixChart
                result={viewing.chart_data as DestinyMatrixResult}
                onNodeClick={(position, arcana) =>
                  setSelectedArcana({ position, arcana: getArcana(arcana.id) })
                }
              />
              <p className="text-center text-sm text-text-primary/50 mt-2">Tap any node for its meaning</p>
            </div>
          </div>
        </div>
      )}

      <ArcanaModal selected={selectedArcana} onClose={() => setSelectedArcana(null)} />
    </div>
  );
}

import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';
import { usePageMeta, DESC } from '../lib/meta';
import { requireSupabase } from '../lib/supabase';
import { calculateDestinyMatrix, DestinyMatrixResult } from '../lib/matrix-calculator';
import { getArcana, Arcana } from '../lib/arcana-meanings';
import { DestinyMatrixChart } from '../components/chart/DestinyMatrixChart';
import { ChartCalculator } from '../components/chart/ChartCalculator';
import { ArcanaModal, SelectedArcana } from '../components/chart/ArcanaModal';
import { AIReading } from '../components/chart/AIReading';
import { SalesCTA } from '../components/SalesCTA';
import { JsonLd } from '../components/JsonLd';
import { webAppSchema } from '../lib/schema';
import { ChakraMap } from '../components/chart/ChakraMap';
import { exportChartPng } from '../lib/export-chart';
import { openPdfReport } from '../lib/report';
import { personalZones } from '../lib/zones';
import { ZoneCards } from '../components/ZoneCards';
import { Sparkles, ArrowLeft, Save, Heart, Coins, Compass, Share2, Copy, Check, Download, FileText } from 'lucide-react';

export function Chart() {
  usePageMeta('Your Destiny Matrix Chart | Gaia Vesta', DESC.chart);
  const { user, configured } = useAuth();
  const navigate = useNavigate();
  const [matrixResult, setMatrixResult] = useState<DestinyMatrixResult | null>(null);
  const [personName, setPersonName] = useState('');
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [selectedArcana, setSelectedArcana] = useState<SelectedArcana | null>(null);
  const chartRef = useRef<HTMLDivElement>(null);

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [savedChartId, setSavedChartId] = useState<string | null>(null);
  const [isSharing, setIsSharing] = useState(false);
  const [shareLink, setShareLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [pdfNote, setPdfNote] = useState('');

  const zones = matrixResult
    ? personalZones(matrixResult, undefined, { birthDate: birthDate ?? undefined, name: personName })
    : null;

  const handlePdf = () => {
    if (!matrixResult || !birthDate) return;
    const ok = openPdfReport(
      personName || 'Your',
      birthDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      matrixResult,
      birthDate,
    );
    setPdfNote(
      ok
        ? 'Your report opened in a new tab — choose "Save as PDF" in the print dialog. The complete reading, free.'
        : 'Your browser blocked the new tab. Allow pop-ups for this site, then press the button again.',
    );
  };

  const handleCalculate = (date: Date, name: string) => {
    const result = calculateDestinyMatrix(date);
    setMatrixResult(result);
    setPersonName(name);
    setBirthDate(date);
    setSelectedArcana(null);
    setSaveSuccess(false);
    setSavedChartId(null);
    setShareLink(null);
    setCopied(false);
    setPdfNote('');
  };

  // Arriving from the homepage hero calculator: /chart?date=YYYY-MM-DD&name=X
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const d = q.get('date');
    if (!d) return;
    const [y, m, dd] = d.split('-').map(Number);
    if (y && m && dd) handleCalculate(new Date(y, m - 1, dd), q.get('name') || 'Unknown');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleNodeClick = (position: string, arcana: Arcana) => {
    setSelectedArcana({ position, arcana });
  };

  const saveChart = async (): Promise<string | null> => {
    if (!user || !matrixResult || !birthDate) return null;

    setIsSaving(true);
    try {
      const supabase = requireSupabase();
      const { data, error } = await supabase.from('charts').insert({
        user_id: user.id,
        person_name: personName || 'Unknown',
        birth_date: birthDate.toISOString().split('T')[0],
        chart_data: matrixResult,
        chart_type: 'destiny_matrix',
      }).select('id').single();

      if (error) throw error;
      setSavedChartId(data.id);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      return data.id;
    } catch (error) {
      console.error('Error saving chart:', error);
      return null;
    } finally {
      setIsSaving(false);
    }
  };

  const handleSave = async () => {
    await saveChart();
  };

  const handleShare = async () => {
    if (!configured) return;
    setIsSharing(true);
    try {
      let id = savedChartId;
      if (!id) {
        id = await saveChart();
      }
      if (!id) throw new Error('Please save the chart first');

      const token = crypto.randomUUID().replace(/-/g, '');
      const supabase = requireSupabase();
      const { error } = await supabase
        .from('charts')
        .update({ is_shared: true, shared_link: token })
        .eq('id', id);

      if (error) throw error;
      setShareLink(`${window.location.origin}/share/${token}`);
    } catch (error) {
      console.error('Error creating share link:', error);
      alert('Could not create a share link. Please try again.');
    } finally {
      setIsSharing(false);
    }
  };

  const handleCopy = async () => {
    if (!shareLink) return;
    try {
      await navigator.clipboard.writeText(shareLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable; user can copy manually
    }
  };

  const handleReset = () => {
    setMatrixResult(null);
    setPersonName('');
    setBirthDate(null);
    setSelectedArcana(null);
    setSaveSuccess(false);
    setSavedChartId(null);
    setShareLink(null);
    setCopied(false);
  };

  return (
    <div className="min-h-screen bg-night text-cream">
      <JsonLd
        data={webAppSchema(
          'Destiny Matrix Calculator',
          '/chart',
          'Gaia Vesta reveals your Destiny Matrix from your birth date — 22 Major Arcana mapping your soul purpose, love patterns, money energy, and life path. Try it free, no account needed.',
        )}
      />
      <header className="bg-night2/80 backdrop-blur-sm border-b border-lav/15 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 text-lav hover:text-cream transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline">Back</span>
            </button>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-r from-goldlight to-[#C9963C] rounded-full flex items-center justify-center shadow-md">
                <Sparkles className="w-4 h-4 text-night3" />
              </div>
              <h1 className="text-lg font-serif font-semibold text-cream">
                Destiny Matrix
              </h1>
            </div>

            <div className="w-20 flex justify-end">
              {matrixResult && (
                <button
                  onClick={handleReset}
                  className="text-sm text-goldlight hover:text-cream transition-colors"
                >
                  New Chart
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {!matrixResult ? (
          <div className="animate-fadeIn">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-serif font-semibold text-cream mb-2">
                Discover Your Destiny Matrix
              </h2>
              <p className="text-lav">
                Based on ancient Tarot wisdom and numerology
              </p>
            </div>
            <ChartCalculator onCalculate={handleCalculate} />
          </div>
        ) : (
          <div className="animate-fadeIn">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-serif font-semibold text-cream">
                {personName}'s Destiny Matrix
              </h2>
              <p className="text-lav text-sm">
                Born {birthDate?.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
            </div>

            <div ref={chartRef} className="bg-night2 backdrop-blur-sm rounded-xl p-6 mb-6 shadow-lg border border-goldlight/25">
              <DestinyMatrixChart result={matrixResult} onNodeClick={handleNodeClick} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-night2 backdrop-blur-sm rounded-lg p-4 border border-lav/15 hover:border-goldlight/40 transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-goldlight/15 rounded-full flex items-center justify-center">
                    <Heart className="w-5 h-5 text-goldlight" />
                  </div>
                  <h3 className="font-semibold text-cream">Love Line</h3>
                </div>
                <div className="flex items-center justify-around">
                  <button
                    onClick={() => handleNodeClick('A', getArcana(matrixResult.loveLine.left))}
                    className="w-10 h-10 bg-gradient-to-br from-night3 to-night2 border border-goldlight/30 rounded-full
                               flex items-center justify-center hover:scale-110 transition-transform"
                  >
                    <span className="font-semibold text-sm text-cream">
                      {matrixResult.loveLine.left}
                    </span>
                  </button>
                  <span className="text-lavdim/60">→</span>
                  <button
                    onClick={() => handleNodeClick('X', getArcana(matrixResult.loveLine.center))}
                    className="w-12 h-12 bg-gradient-to-r from-goldlight to-[#C9963C] rounded-full
                               flex items-center justify-center hover:scale-110 transition-transform shadow-md"
                  >
                    <span className="font-bold text-night3">{matrixResult.loveLine.center}</span>
                  </button>
                  <span className="text-lavdim/60">→</span>
                  <button
                    onClick={() => handleNodeClick('C', getArcana(matrixResult.loveLine.right))}
                    className="w-10 h-10 bg-gradient-to-br from-night3 to-night2 border border-goldlight/30 rounded-full
                               flex items-center justify-center hover:scale-110 transition-transform"
                  >
                    <span className="font-semibold text-sm text-cream">
                      {matrixResult.loveLine.right}
                    </span>
                  </button>
                </div>
              </div>

              <div className="bg-night2 backdrop-blur-sm rounded-lg p-4 border border-lav/15 hover:border-goldlight/40 transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-goldlight/15 rounded-full flex items-center justify-center">
                    <Coins className="w-5 h-5 text-goldlight" />
                  </div>
                  <h3 className="font-semibold text-cream">Money Line</h3>
                </div>
                <div className="flex items-center justify-around">
                  <button
                    onClick={() => handleNodeClick('B', getArcana(matrixResult.moneyLine.left))}
                    className="w-10 h-10 bg-gradient-to-br from-night3 to-night2 border border-goldlight/30 rounded-full
                               flex items-center justify-center hover:scale-110 transition-transform"
                  >
                    <span className="font-semibold text-sm text-cream">
                      {matrixResult.moneyLine.left}
                    </span>
                  </button>
                  <span className="text-lavdim/60">→</span>
                  <button
                    onClick={() => handleNodeClick('X', getArcana(matrixResult.moneyLine.center))}
                    className="w-12 h-12 bg-gradient-to-r from-goldlight to-[#C9963C] rounded-full
                               flex items-center justify-center hover:scale-110 transition-transform shadow-md"
                  >
                    <span className="font-bold text-night3">{matrixResult.moneyLine.center}</span>
                  </button>
                  <span className="text-lavdim/60">→</span>
                  <button
                    onClick={() => handleNodeClick('D', getArcana(matrixResult.moneyLine.right))}
                    className="w-10 h-10 bg-gradient-to-br from-night3 to-night2 border border-goldlight/30 rounded-full
                               flex items-center justify-center hover:scale-110 transition-transform"
                  >
                    <span className="font-semibold text-sm text-cream">
                      {matrixResult.moneyLine.right}
                    </span>
                  </button>
                </div>
              </div>

              <div className="bg-night2 backdrop-blur-sm rounded-lg p-4 border border-lav/15 hover:border-goldlight/40 transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-goldlight/15 rounded-full flex items-center justify-center">
                    <Compass className="w-5 h-5 text-goldlight" />
                  </div>
                  <h3 className="font-semibold text-cream">Life Path</h3>
                </div>
                <div className="flex items-center justify-around">
                  <button
                    onClick={() => handleNodeClick('H', getArcana(matrixResult.lifePath.left))}
                    className="w-10 h-10 bg-gradient-to-br from-night3 to-night2 border border-goldlight/30 rounded-full
                               flex items-center justify-center hover:scale-110 transition-transform"
                  >
                    <span className="font-semibold text-sm text-cream">
                      {matrixResult.lifePath.left}
                    </span>
                  </button>
                  <span className="text-lavdim/60">→</span>
                  <button
                    onClick={() => handleNodeClick('X', getArcana(matrixResult.lifePath.center))}
                    className="w-12 h-12 bg-gradient-to-r from-goldlight to-[#C9963C] rounded-full
                               flex items-center justify-center hover:scale-110 transition-transform shadow-md"
                  >
                    <span className="font-bold text-night3">{matrixResult.lifePath.center}</span>
                  </button>
                  <span className="text-lavdim/60">→</span>
                  <button
                    onClick={() => handleNodeClick('F', getArcana(matrixResult.lifePath.right))}
                    className="w-10 h-10 bg-gradient-to-br from-night3 to-night2 border border-goldlight/30 rounded-full
                               flex items-center justify-center hover:scale-110 transition-transform"
                  >
                    <span className="font-semibold text-sm text-cream">
                      {matrixResult.lifePath.right}
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Your Reading — 12 Zones */}
            {zones && (
              <div className="mb-6">
                <ZoneCards
                  zones={zones}
                  heading="Your Reading — 12 Zones"
                  sub="Your whole chart, read zone by zone — the same named chapters other sites sell, free here in full. Tap a zone to open or close it."
                />
              </div>
            )}

            {/* Chakra Health Map */}
            <div className="bg-[#FAF5EA] backdrop-blur-sm rounded-2xl border border-goldlight/50 p-6 mb-6">
              <h3 className="font-serif font-semibold text-xl text-text-primary mb-1">Chakra Health Map</h3>
              <p className="text-sm text-text-primary/60 mb-6">
                Your seven energy centres read three ways — physical, energy and emotions. Tap a chakra, then a column, for the full reading.
              </p>
              <ChakraMap result={matrixResult} onArcanaClick={handleNodeClick} />
            </div>

            {matrixResult && birthDate && (
              <AIReading result={matrixResult} personName={personName || 'Unknown'} birthDate={birthDate} />
            )}

            <div className="text-center">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={handleSave}
                  disabled={isSaving || saveSuccess || !configured}
                  className={`px-6 py-3 rounded-lg font-medium transition-all duration-200
                             flex items-center gap-2
                             ${saveSuccess
                               ? 'bg-green-500 text-white'
                               : 'bg-gradient-to-r from-goldlight to-[#C9963C] text-night3 font-semibold hover:shadow-lg disabled:opacity-50'}`}
                >
                  {saveSuccess ? (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Chart Saved!
                    </>
                  ) : isSaving ? (
                    <>
                      <div className="w-5 h-5 border-2 border-night3/30 border-t-night3 rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      Save Chart
                    </>
                  )}
                </button>

                <button
                  onClick={handleShare}
                  disabled={isSharing || !configured}
                  className="px-6 py-3 rounded-lg font-medium transition-all duration-200
                             flex items-center gap-2 bg-white/[0.04] border border-lav/30 text-cream
                             hover:border-goldlight/60 hover:shadow-lg disabled:opacity-50"
                >
                  {isSharing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-goldlight/30 border-t-goldlight rounded-full animate-spin" />
                      Creating link...
                    </>
                  ) : (
                    <>
                      <Share2 className="w-5 h-5" />
                      Share Chart
                    </>
                  )}
                </button>

                <button
                  onClick={() => exportChartPng(chartRef.current, `${(personName || 'destiny-matrix').toLowerCase().replace(/\s+/g, '-')}-matrix.png`)}
                  className="px-6 py-3 rounded-lg font-medium transition-all duration-200
                             flex items-center gap-2 bg-white/[0.04] border border-lav/30 text-cream
                             hover:border-goldlight/60 hover:shadow-lg"
                >
                  <Download className="w-5 h-5" />
                  Download PNG (free)
                </button>

                <button
                  onClick={handlePdf}
                  className="px-6 py-3 rounded-lg font-medium transition-all duration-200
                             flex items-center gap-2 bg-gradient-to-r from-goldlight to-[#C9963C] text-night3 font-semibold
                             hover:shadow-lg"
                >
                  <FileText className="w-5 h-5" />
                  Free PDF Report
                </button>
              </div>

              {pdfNote && (
                <p className="text-sm text-lavdim mt-3 max-w-md mx-auto">{pdfNote}</p>
              )}

              {!configured && (
                <p className="text-sm text-lavdim mt-3">
                  Sign in with Supabase configured to save and share charts.
                </p>
              )}

              {shareLink && (
                <div className="mt-5 max-w-lg mx-auto bg-night2 border border-goldlight/30 rounded-xl p-4 animate-fadeIn">
                  <p className="text-sm font-medium text-cream mb-2">Your shareable link</p>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={shareLink}
                      onFocus={(e) => e.target.select()}
                      className="flex-1 px-3 py-2 bg-night/60 border border-lav/20 rounded-lg text-sm text-cream font-mono"
                    />
                    <button
                      onClick={handleCopy}
                      className="p-2.5 bg-gradient-to-r from-goldlight to-[#C9963C] text-night3 font-semibold rounded-lg hover:shadow transition-all"
                      aria-label="Copy link"
                    >
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-xs text-lavdim mt-2">
                    Anyone with this link can view the chart. {copied ? 'Copied!' : ''}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
        {matrixResult && (
          <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-16">
            <SalesCTA
              headline="This is your map. Now read the story behind it."
              context="You have seen the numbers. The AI deep reading connects them — why love repeats its pattern, where your money energy leaks, and which lesson this year is asking of you."
            />
          </div>
        )}
      </main>

      <ArcanaModal selected={selectedArcana} onClose={() => setSelectedArcana(null)} />
    </div>
  );
}

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';
import { requireSupabase } from '../lib/supabase';
import { calculateDestinyMatrix, DestinyMatrixResult } from '../lib/matrix-calculator';
import { getArcana, Arcana } from '../lib/arcana-meanings';
import { DestinyMatrixChart } from '../components/chart/DestinyMatrixChart';
import { ChartCalculator } from '../components/chart/ChartCalculator';
import { ArcanaModal, SelectedArcana } from '../components/chart/ArcanaModal';
import { AIReading } from '../components/chart/AIReading';
import { Sparkles, ArrowLeft, Save, Heart, Coins, Compass, Share2, Copy, Check } from 'lucide-react';

export function Chart() {
  const { user, configured } = useAuth();
  const navigate = useNavigate();
  const [matrixResult, setMatrixResult] = useState<DestinyMatrixResult | null>(null);
  const [personName, setPersonName] = useState('');
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [selectedArcana, setSelectedArcana] = useState<SelectedArcana | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [savedChartId, setSavedChartId] = useState<string | null>(null);
  const [isSharing, setIsSharing] = useState(false);
  const [shareLink, setShareLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

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
  };

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
    <div className="min-h-screen bg-gradient-to-br from-[#f8f4ff] to-[#fef7ed]">
      <header className="bg-white/80 backdrop-blur-sm border-b border-purple/20 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 text-text-primary/70 hover:text-text-primary transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline">Back</span>
            </button>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-r from-gold to-purple rounded-full flex items-center justify-center shadow-md">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-lg font-serif font-semibold text-text-primary">
                Destiny Matrix
              </h1>
            </div>

            <div className="w-20 flex justify-end">
              {matrixResult && (
                <button
                  onClick={handleReset}
                  className="text-sm text-purple hover:text-text-primary transition-colors"
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
              <h2 className="text-3xl font-serif font-semibold text-text-primary mb-2">
                Discover Your Destiny Matrix
              </h2>
              <p className="text-text-primary/70">
                Based on ancient Tarot wisdom and numerology
              </p>
            </div>
            <ChartCalculator onCalculate={handleCalculate} />
          </div>
        ) : (
          <div className="animate-fadeIn">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-serif font-semibold text-text-primary">
                {personName}'s Destiny Matrix
              </h2>
              <p className="text-text-primary/60 text-sm">
                Born {birthDate?.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
            </div>

            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 mb-6 shadow-lg border border-purple/20">
              <DestinyMatrixChart result={matrixResult} onNodeClick={handleNodeClick} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-purple/20 hover:border-purple/40 transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-purple/20 rounded-full flex items-center justify-center">
                    <Heart className="w-5 h-5 text-purple" />
                  </div>
                  <h3 className="font-semibold text-text-primary">Love Line</h3>
                </div>
                <div className="flex items-center justify-around">
                  <button
                    onClick={() => handleNodeClick('A', getArcana(matrixResult.loveLine.left))}
                    className="w-10 h-10 bg-gradient-to-br from-purple/30 to-gold/30 rounded-full
                               flex items-center justify-center hover:scale-110 transition-transform"
                  >
                    <span className="font-semibold text-sm text-text-primary">
                      {matrixResult.loveLine.left}
                    </span>
                  </button>
                  <span className="text-text-primary/30">→</span>
                  <button
                    onClick={() => handleNodeClick('X', getArcana(matrixResult.loveLine.center))}
                    className="w-12 h-12 bg-gradient-to-r from-gold to-purple rounded-full
                               flex items-center justify-center hover:scale-110 transition-transform shadow-md"
                  >
                    <span className="font-bold text-white">{matrixResult.loveLine.center}</span>
                  </button>
                  <span className="text-text-primary/30">→</span>
                  <button
                    onClick={() => handleNodeClick('C', getArcana(matrixResult.loveLine.right))}
                    className="w-10 h-10 bg-gradient-to-br from-purple/30 to-gold/30 rounded-full
                               flex items-center justify-center hover:scale-110 transition-transform"
                  >
                    <span className="font-semibold text-sm text-text-primary">
                      {matrixResult.loveLine.right}
                    </span>
                  </button>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-gold/20 hover:border-gold/40 transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-gold/20 rounded-full flex items-center justify-center">
                    <Coins className="w-5 h-5 text-gold" />
                  </div>
                  <h3 className="font-semibold text-text-primary">Money Line</h3>
                </div>
                <div className="flex items-center justify-around">
                  <button
                    onClick={() => handleNodeClick('B', getArcana(matrixResult.moneyLine.left))}
                    className="w-10 h-10 bg-gradient-to-br from-gold/30 to-purple/30 rounded-full
                               flex items-center justify-center hover:scale-110 transition-transform"
                  >
                    <span className="font-semibold text-sm text-text-primary">
                      {matrixResult.moneyLine.left}
                    </span>
                  </button>
                  <span className="text-text-primary/30">→</span>
                  <button
                    onClick={() => handleNodeClick('X', getArcana(matrixResult.moneyLine.center))}
                    className="w-12 h-12 bg-gradient-to-r from-gold to-purple rounded-full
                               flex items-center justify-center hover:scale-110 transition-transform shadow-md"
                  >
                    <span className="font-bold text-white">{matrixResult.moneyLine.center}</span>
                  </button>
                  <span className="text-text-primary/30">→</span>
                  <button
                    onClick={() => handleNodeClick('D', getArcana(matrixResult.moneyLine.right))}
                    className="w-10 h-10 bg-gradient-to-br from-gold/30 to-purple/30 rounded-full
                               flex items-center justify-center hover:scale-110 transition-transform"
                  >
                    <span className="font-semibold text-sm text-text-primary">
                      {matrixResult.moneyLine.right}
                    </span>
                  </button>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-purple/20 hover:border-purple/40 transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-purple/20 rounded-full flex items-center justify-center">
                    <Compass className="w-5 h-5 text-purple" />
                  </div>
                  <h3 className="font-semibold text-text-primary">Life Path</h3>
                </div>
                <div className="flex items-center justify-around">
                  <button
                    onClick={() => handleNodeClick('H', getArcana(matrixResult.lifePath.left))}
                    className="w-10 h-10 bg-gradient-to-br from-purple/30 to-gold/30 rounded-full
                               flex items-center justify-center hover:scale-110 transition-transform"
                  >
                    <span className="font-semibold text-sm text-text-primary">
                      {matrixResult.lifePath.left}
                    </span>
                  </button>
                  <span className="text-text-primary/30">→</span>
                  <button
                    onClick={() => handleNodeClick('X', getArcana(matrixResult.lifePath.center))}
                    className="w-12 h-12 bg-gradient-to-r from-gold to-purple rounded-full
                               flex items-center justify-center hover:scale-110 transition-transform shadow-md"
                  >
                    <span className="font-bold text-white">{matrixResult.lifePath.center}</span>
                  </button>
                  <span className="text-text-primary/30">→</span>
                  <button
                    onClick={() => handleNodeClick('F', getArcana(matrixResult.lifePath.right))}
                    className="w-10 h-10 bg-gradient-to-br from-purple/30 to-gold/30 rounded-full
                               flex items-center justify-center hover:scale-110 transition-transform"
                  >
                    <span className="font-semibold text-sm text-text-primary">
                      {matrixResult.lifePath.right}
                    </span>
                  </button>
                </div>
              </div>
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
                               : 'bg-gradient-to-r from-gold to-purple text-white hover:shadow-lg disabled:opacity-50'}`}
                >
                  {saveSuccess ? (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Chart Saved!
                    </>
                  ) : isSaving ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
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
                             flex items-center gap-2 bg-white/80 border border-gold/40 text-text-primary
                             hover:border-gold hover:shadow-lg disabled:opacity-50"
                >
                  {isSharing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
                      Creating link...
                    </>
                  ) : (
                    <>
                      <Share2 className="w-5 h-5" />
                      Share Chart
                    </>
                  )}
                </button>
              </div>

              {!configured && (
                <p className="text-sm text-text-primary/50 mt-3">
                  Sign in with Supabase configured to save and share charts.
                </p>
              )}

              {shareLink && (
                <div className="mt-5 max-w-lg mx-auto bg-white/80 border border-gold/30 rounded-xl p-4 animate-fadeIn">
                  <p className="text-sm font-medium text-text-primary mb-2">Your shareable link</p>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={shareLink}
                      onFocus={(e) => e.target.select()}
                      className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-text-primary/80 font-mono"
                    />
                    <button
                      onClick={handleCopy}
                      className="p-2.5 bg-gradient-to-r from-gold to-purple text-white rounded-lg hover:shadow transition-all"
                      aria-label="Copy link"
                    >
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-xs text-text-primary/50 mt-2">
                    Anyone with this link can view the chart. {copied ? 'Copied!' : ''}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <ArcanaModal selected={selectedArcana} onClose={() => setSelectedArcana(null)} />
    </div>
  );
}

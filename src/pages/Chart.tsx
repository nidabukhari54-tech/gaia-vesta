import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';
import { supabase } from '../lib/supabase';
import { calculateDestinyMatrix, DestinyMatrixResult } from '../lib/matrix-calculator';
import { getArcana, Arcana } from '../lib/arcana-meanings';
import { DestinyMatrixChart } from '../components/chart/DestinyMatrixChart';
import { ChartCalculator } from '../components/chart/ChartCalculator';
import { Sparkles, ArrowLeft, Save, Heart, Coins, Compass, X } from 'lucide-react';

export function Chart() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [matrixResult, setMatrixResult] = useState<DestinyMatrixResult | null>(null);
  const [personName, setPersonName] = useState('');
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [selectedArcana, setSelectedArcana] = useState<{ position: string; arcana: Arcana } | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleCalculate = (date: Date, name: string) => {
    const result = calculateDestinyMatrix(date);
    setMatrixResult(result);
    setPersonName(name);
    setBirthDate(date);
    setSelectedArcana(null);
    setSaveSuccess(false);
  };

  const handleNodeClick = (position: string, arcana: Arcana) => {
    setSelectedArcana({ position, arcana });
  };

  const handleSave = async () => {
    if (!user || !matrixResult || !birthDate) return;

    setIsSaving(true);
    try {
      const { error } = await supabase.from('charts').insert({
        user_id: user.id,
        person_name: personName || 'Unknown',
        birth_date: birthDate.toISOString().split('T')[0],
        chart_data: matrixResult,
        chart_type: 'destiny_matrix',
      });

      if (error) throw error;
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Error saving chart:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setMatrixResult(null);
    setPersonName('');
    setBirthDate(null);
    setSelectedArcana(null);
    setSaveSuccess(false);
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

            <div className="text-center">
              <button
                onClick={handleSave}
                disabled={isSaving || saveSuccess}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-200
                           flex items-center gap-2 mx-auto
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
            </div>
          </div>
        )}
      </main>

      {selectedArcana && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center
                        px-4 z-50" onClick={() => setSelectedArcana(null)}>
          <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 max-w-md w-full shadow-2xl
                          border border-purple/20 max-h-[90vh] overflow-y-auto"
               onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-gold to-purple rounded-full
                                flex items-center justify-center shadow-md">
                  <span className="font-bold text-white">{selectedArcana.arcana.id}</span>
                </div>
                <div>
                  <h3 className="text-xl font-serif font-semibold text-text-primary">
                    {selectedArcana.arcana.name}
                  </h3>
                  <p className="text-sm text-text-primary/60">Position {selectedArcana.position}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedArcana(null)}
                className="p-1 hover:bg-purple/10 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-text-primary/60" />
              </button>
            </div>

            <p className="text-text-primary/80 mb-4 italic">
              "{selectedArcana.arcana.description}"
            </p>

            <div className="space-y-4">
              <div className="bg-purple/5 rounded-lg p-3">
                <h4 className="font-semibold text-text-primary mb-1">Personality</h4>
                <p className="text-sm text-text-primary/70">{selectedArcana.arcana.personality}</p>
              </div>

              <div className="bg-gold/5 rounded-lg p-3">
                <h4 className="font-semibold text-text-primary mb-1">Love</h4>
                <p className="text-sm text-text-primary/70">{selectedArcana.arcana.loveMeaning}</p>
              </div>

              <div className="bg-purple/5 rounded-lg p-3">
                <h4 className="font-semibold text-text-primary mb-1">Money</h4>
                <p className="text-sm text-text-primary/70">{selectedArcana.arcana.moneyMeaning}</p>
              </div>

              <div className="bg-gold/5 rounded-lg p-3">
                <h4 className="font-semibold text-text-primary mb-1">Karmic Lesson</h4>
                <p className="text-sm text-text-primary/70">{selectedArcana.arcana.karmicLesson}</p>
              </div>

              <div className="bg-gradient-to-r from-purple/10 to-gold/10 rounded-lg p-3 text-center">
                <p className="text-sm font-medium text-text-primary italic">
                  "{selectedArcana.arcana.affirmation}"
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-green-50 rounded-lg p-3">
                  <h4 className="font-semibold text-green-700 text-sm mb-1">Strengths</h4>
                  <ul className="text-xs text-green-600 space-y-1">
                    {selectedArcana.arcana.strengths.map((s, i) => (
                      <li key={i}>• {s}</li>
                    ))}
                  </ul>
                </div>
                <div className="bg-red-50 rounded-lg p-3">
                  <h4 className="font-semibold text-red-700 text-sm mb-1">Challenges</h4>
                  <ul className="text-xs text-red-600 space-y-1">
                    {selectedArcana.arcana.challenges.map((c, i) => (
                      <li key={i}>• {c}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

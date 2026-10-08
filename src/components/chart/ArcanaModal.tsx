import { X } from 'lucide-react';
import type { Arcana } from '../../lib/arcana-meanings';

export type SelectedArcana = {
  position: string;
  arcana: Arcana;
};

type ArcanaModalProps = {
  selected: SelectedArcana | null;
  onClose: () => void;
};

export function ArcanaModal({ selected, onClose }: ArcanaModalProps) {
  if (!selected) return null;

  const { position, arcana } = selected;

  return (
    <div
      className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center px-4 z-50"
      onClick={onClose}
    >
      <div
        className="bg-white/95 backdrop-blur-sm rounded-xl p-6 max-w-md w-full shadow-2xl border border-purple/20 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-gold to-purple rounded-full flex items-center justify-center shadow-md">
              <span className="font-bold text-white">{arcana.id}</span>
            </div>
            <div>
              <h3 className="text-xl font-serif font-semibold text-text-primary">{arcana.name}</h3>
              <p className="text-sm text-text-primary/60">Position {position}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-purple/10 rounded-full transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-text-primary/60" />
          </button>
        </div>

        <p className="text-text-primary/80 mb-4 italic">"{arcana.description}"</p>

        <div className="space-y-4">
          <div className="bg-purple/5 rounded-lg p-3">
            <h4 className="font-semibold text-text-primary mb-1">Personality</h4>
            <p className="text-sm text-text-primary/70">{arcana.personality}</p>
          </div>

          <div className="bg-gold/5 rounded-lg p-3">
            <h4 className="font-semibold text-text-primary mb-1">Love</h4>
            <p className="text-sm text-text-primary/70">{arcana.loveMeaning}</p>
          </div>

          <div className="bg-purple/5 rounded-lg p-3">
            <h4 className="font-semibold text-text-primary mb-1">Money</h4>
            <p className="text-sm text-text-primary/70">{arcana.moneyMeaning}</p>
          </div>

          <div className="bg-gold/5 rounded-lg p-3">
            <h4 className="font-semibold text-text-primary mb-1">Karmic Lesson</h4>
            <p className="text-sm text-text-primary/70">{arcana.karmicLesson}</p>
          </div>

          <div className="bg-gradient-to-r from-purple/10 to-gold/10 rounded-lg p-3 text-center">
            <p className="text-sm font-medium text-text-primary italic">"{arcana.affirmation}"</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-green-50 rounded-lg p-3">
              <h4 className="font-semibold text-green-700 text-sm mb-1">Strengths</h4>
              <ul className="text-xs text-green-600 space-y-1">
                {arcana.strengths.map((s, i) => (
                  <li key={i}>• {s}</li>
                ))}
              </ul>
            </div>
            <div className="bg-red-50 rounded-lg p-3">
              <h4 className="font-semibold text-red-700 text-sm mb-1">Challenges</h4>
              <ul className="text-xs text-red-600 space-y-1">
                {arcana.challenges.map((c, i) => (
                  <li key={i}>• {c}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

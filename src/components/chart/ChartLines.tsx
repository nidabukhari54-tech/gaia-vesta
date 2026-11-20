import { Heart, Coins, Compass } from 'lucide-react';
import { getArcana, type Arcana } from '../../lib/arcana-meanings';
import type { DestinyMatrixResult } from '../../lib/matrix-calculator';

type ChartLinesProps = {
  result: DestinyMatrixResult;
  onNodeClick?: (position: string, arcana: Arcana) => void;
};

/** The Love / Money / Life Path line cards shown under a matrix chart. */
export function ChartLines({ result, onNodeClick }: ChartLinesProps) {
  const lines = [
    { key: 'love', title: 'Love Line', icon: Heart, accent: 'purple' as const, line: result.loveLine, positions: ['A', 'X', 'C'] },
    { key: 'money', title: 'Money Line', icon: Coins, accent: 'gold' as const, line: result.moneyLine, positions: ['B', 'X', 'D'] },
    { key: 'path', title: 'Life Path', icon: Compass, accent: 'purple' as const, line: result.lifePath, positions: ['H', 'X', 'F'] },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {lines.map(({ key, title, icon: Icon, accent, line, positions }) => (
        <div
          key={key}
          className={`bg-white/80 backdrop-blur-sm rounded-lg p-4 border transition-all ${
            accent === 'gold' ? 'border-gold/20 hover:border-gold/40' : 'border-purple/20 hover:border-purple/40'
          }`}
        >
          <div className="flex items-center gap-3 mb-3">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                accent === 'gold' ? 'bg-gold/20' : 'bg-purple/20'
              }`}
            >
              <Icon className={`w-5 h-5 ${accent === 'gold' ? 'text-gold' : 'text-purple'}`} />
            </div>
            <h3 className="font-semibold text-text-primary">{title}</h3>
          </div>
          <div className="flex items-center justify-around">
            <button
              onClick={() => onNodeClick?.(positions[0], getArcana(line.left))}
              className="w-10 h-10 bg-gradient-to-br from-purple/30 to-gold/30 rounded-full flex items-center justify-center hover:scale-110 transition-transform"
            >
              <span className="font-semibold text-sm text-text-primary">{line.left}</span>
            </button>
            <span className="text-text-primary/30">→</span>
            <button
              onClick={() => onNodeClick?.(positions[1], getArcana(line.center))}
              className="w-12 h-12 bg-gradient-to-r from-gold to-purple rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-md"
            >
              <span className="font-bold text-white">{line.center}</span>
            </button>
            <span className="text-text-primary/30">→</span>
            <button
              onClick={() => onNodeClick?.(positions[2], getArcana(line.right))}
              className="w-10 h-10 bg-gradient-to-br from-purple/30 to-gold/30 rounded-full flex items-center justify-center hover:scale-110 transition-transform"
            >
              <span className="font-semibold text-sm text-text-primary">{line.right}</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

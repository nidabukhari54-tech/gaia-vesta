import { useState } from 'react';
import { chakraMap, type ChakraReading } from '../../lib/chakra';
import { getArcana, type Arcana } from '../../lib/arcana-meanings';
import type { DestinyMatrixResult } from '../../lib/matrix-calculator';

type ChakraMapProps = {
  result: DestinyMatrixResult;
  onArcanaClick?: (position: string, arcana: Arcana) => void;
};

export function ChakraMap({ result, onArcanaClick }: ChakraMapProps) {
  const readings = chakraMap(result);
  const [active, setActive] = useState<ChakraReading>(readings[3]); // heart by default

  return (
    <div>
      {/* Spine visual */}
      <div className="flex flex-col items-center gap-1.5 mb-8">
        {readings.map((r) => {
          const isActive = active.chakra.id === r.chakra.id;
          return (
            <button
              key={r.chakra.id}
              onClick={() => setActive(r)}
              className={`group flex items-center gap-3 rounded-full pr-4 transition-all ${
                isActive ? 'bg-white shadow-md border border-gold/40' : 'hover:bg-white/60 border border-transparent'
              }`}
            >
              <span
                className={`w-11 h-11 rounded-full flex items-center justify-center text-white font-bold shadow transition-transform ${
                  isActive ? 'scale-110' : 'group-hover:scale-105'
                }`}
                style={{ backgroundColor: r.chakra.color }}
              >
                {r.physical.id}
              </span>
              <span className={`text-sm font-medium ${isActive ? 'text-text-primary' : 'text-text-primary/60'}`}>
                {r.chakra.name}
                <span className="hidden sm:inline text-text-primary/40 font-normal"> · {r.chakra.sanskrit}</span>
              </span>
            </button>
          );
        })}
      </div>

      {/* Detail panel */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gold/20 p-6 animate-fadeIn" key={active.chakra.id}>
        <div className="flex items-center gap-3 mb-2">
          <span className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold" style={{ backgroundColor: active.chakra.color }}>
            {active.physical.id}
          </span>
          <div>
            <h3 className="font-serif font-semibold text-lg leading-tight">
              {active.chakra.name} Chakra — {active.physical.name}
            </h3>
            <p className="text-xs text-text-primary/50">{active.chakra.area}</p>
          </div>
        </div>
        <p className="text-sm text-text-primary/70 mb-5 italic">{active.chakra.theme}</p>

        <div className="grid sm:grid-cols-3 gap-4">
          {(
            [
              { label: 'Physical', arcana: active.physical, note: 'Body, habits, the material side of this centre.' },
              { label: 'Energy', arcana: active.energy, note: 'Drive and vitality flowing through this centre.' },
              { label: 'Emotions', arcana: active.emotions, note: 'Feelings and karmic patterns held here.' },
            ] as const
          ).map((col) => (
            <button
              key={col.label}
              onClick={() => onArcanaClick?.(`${active.chakra.name} · ${col.label}`, col.arcana)}
              className="text-left bg-gradient-to-br from-purple/5 to-gold/5 rounded-xl p-4 border border-purple/10 hover:border-gold/40 transition-all"
            >
              <p className="text-xs font-semibold tracking-wide uppercase text-purple mb-1.5">{col.label}</p>
              <p className="font-semibold text-text-primary mb-1">
                {col.arcana.id} · {col.arcana.name}
              </p>
              <p className="text-xs text-text-primary/60 mb-2">{col.note}</p>
              <p className="text-sm text-text-primary/75">{col.arcana.description}</p>
            </button>
          ))}
        </div>

        <p className="text-xs text-text-primary/45 mt-4 text-center">
          Tap a column to read the full arcana interpretation.
          {getArcana(active.physical.id).name === active.physical.name ? '' : ''}
        </p>
      </div>
    </div>
  );
}

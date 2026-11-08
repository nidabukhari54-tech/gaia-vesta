import { reduceToArcana, type DestinyMatrixResult } from './matrix-calculator';
import { getArcana, type Arcana } from './arcana-meanings';

export type ChakraInfo = {
  id: string;
  name: string;
  sanskrit: string;
  color: string;
  area: string;
  theme: string;
};

export const CHAKRAS: ChakraInfo[] = [
  { id: 'crown', name: 'Crown', sanskrit: 'Sahasrara', color: '#8B7FB0', area: 'Connection, spirit, higher purpose', theme: 'Your link to meaning and the bigger picture.' },
  { id: 'thirdeye', name: 'Third Eye', sanskrit: 'Ajna', color: '#5B6ABF', area: 'Intuition, vision, insight', theme: 'How clearly you see patterns and trust your inner knowing.' },
  { id: 'throat', name: 'Throat', sanskrit: 'Vishuddha', color: '#4A90C4', area: 'Voice, truth, expression', theme: 'How honestly and freely you speak your truth.' },
  { id: 'heart', name: 'Heart', sanskrit: 'Anahata', color: '#4CAF7D', area: 'Love, compassion, bonds', theme: 'Your capacity to give and receive love without armour.' },
  { id: 'solar', name: 'Solar Plexus', sanskrit: 'Manipura', color: '#D9A62E', area: 'Will, confidence, personal power', theme: 'Your drive, self-belief, and ability to act.' },
  { id: 'sacral', name: 'Sacral', sanskrit: 'Svadhisthana', color: '#E07B39', area: 'Pleasure, creativity, desire', theme: 'Your enjoyment of life, sensuality, and creative flow.' },
  { id: 'root', name: 'Root', sanskrit: 'Muladhara', color: '#C0453A', area: 'Safety, body, survival, money basics', theme: 'Your grounding: body, home, and material security.' },
];

export type ChakraReading = {
  chakra: ChakraInfo;
  /** the physical column: the chakra's own arcana */
  physical: Arcana;
  /** the energy column: that arcana blended with the chart's centre (X) */
  energy: Arcana;
  /** the emotions column: that arcana blended with the karmic point (C) */
  emotions: Arcana;
};

/**
 * Chakra Health Map derived from the Destiny Matrix.
 * The seven chakras sit on the chart's vertical axis — Crown at the top
 * point (A), Root at the earth point (C), Heart at the centre (X) — with
 * the in-between points blended from the axis, following the method's
 * health-chart tradition.
 */
export function chakraMap(result: DestinyMatrixResult): ChakraReading[] {
  const axis: Record<string, number> = {
    crown: result.A,
    thirdeye: reduceToArcana(result.A + result.X),
    throat: reduceToArcana(result.E + result.H),
    heart: result.X,
    solar: reduceToArcana(result.F + result.G),
    sacral: reduceToArcana(result.X + result.C),
    root: result.C,
  };

  return CHAKRAS.map((chakra) => {
    const base = axis[chakra.id];
    return {
      chakra,
      physical: getArcana(base),
      energy: getArcana(reduceToArcana(base + result.X)),
      emotions: getArcana(reduceToArcana(base + result.C)),
    };
  });
}

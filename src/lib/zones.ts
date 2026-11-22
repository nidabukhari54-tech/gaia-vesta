import {
  reduceToArcana,
  type ChartPosition,
  type DestinyMatrixResult,
} from './matrix-calculator';
import { getArcana, type Arcana } from './arcana-meanings';
import {
  analyzeNumbers,
  getFatherLine,
  getMotherLine,
  getParentChildLine,
  getTalentLine,
  purposeByStage,
  type ChartLine,
} from './lines';
import { getKarmicTail } from './karmic-tail';
import { chakraMap } from './chakra';
import { personalYearNumber } from './numerology';
import { PERSONAL_YEAR_MEANINGS } from './numerology-meanings';

/**
 * The zone system: every reading on Gaia Vesta is presented as named zones —
 * the same chapters rivals sell, assembled here entirely from the chart's
 * own points and the arcana fields attached to them. No zone invents data:
 * each body is built from the arcana sitting on real chart positions.
 */
export type Zone = {
  id: string;
  title: string;
  /** lucide icon key, mapped to a component by the ZoneCards renderer */
  icon: string;
  /** the chart points this zone reads, e.g. "Centre X · 7 — The Chariot" */
  points: string;
  /** body paragraphs, in reading order */
  body: string[];
  /** the light side — strengths these points carry */
  light?: string;
  /** the shadow side — challenges these points carry */
  shadow?: string;
};

export type ZoneExtras = {
  birthDate?: Date;
  name?: string;
  partnerName?: string;
};

const a = (id: number): Arcana => getArcana(id);

const tag = (key: string, id: number) => `${key} · ${id} — ${a(id).name}`;

const joinList = (items: string[]) => items.join(', ').toLowerCase();

function lineBody(line: ChartLine, field: 'personality' | 'karmicLesson'): string[] {
  return line.points.map(
    (p) => `${p.role} — ${p.key} · ${p.arcana.id} ${p.arcana.name}. ${p.arcana[field]}`,
  );
}

/* ------------------------------------------------------------------ */
/* Personal — 12 zones                                                 */
/* ------------------------------------------------------------------ */

export function personalZones(
  result: DestinyMatrixResult,
  positions?: ChartPosition[],
  extras: ZoneExtras = {},
): Zone[] {
  void positions; // points strings are built from the result itself
  const core = a(result.X);
  const tail = getKarmicTail(result);
  const talent = getTalentLine(result);
  const father = getFatherLine(result);
  const mother = getMotherLine(result);
  const purposes = purposeByStage(result);
  const analysis = analyzeNumbers(result);
  const chakras = chakraMap(result);
  const byChakra = (id: string) => chakras.find((c) => c.chakra.id === id)!;

  const zones: Zone[] = [
    {
      id: 'personality-core',
      title: 'Personality Core',
      icon: 'sparkles',
      points: tag('Centre X', result.X),
      body: [
        `Everything in your chart orbits one centre: ${core.id}, ${core.name} — ${core.description.toLowerCase()}. This is the energy you return to when you are rested, honest and not performing for anyone.`,
        core.personality,
        `Your karmic lesson at the centre: ${core.karmicLesson}`,
        `A sentence to carry: “${core.affirmation}”`,
      ],
      light: `At your best you bring ${joinList(core.strengths)}.`,
      shadow: `The pattern to notice: ${joinList(core.challenges)}. Naming it early is what keeps it a choice rather than a habit.`,
    },
    {
      id: 'soul-purpose',
      title: 'Soul Purpose',
      icon: 'compass',
      points: `${tag('H', result.lifePath.left)} → ${tag('X', result.lifePath.center)} → ${tag('F', result.lifePath.right)}`,
      body: [
        `Your life path runs from ${a(result.lifePath.left).name} through your centre to ${a(result.lifePath.right).name}. Read as one sentence, it is the road your chart keeps pointing you down.`,
        `You set out with ${a(result.lifePath.left).id} — ${a(result.lifePath.left).name}: ${a(result.lifePath.left).personality}`,
        `At the centre, ${core.name} sets the terms: ${core.karmicLesson}`,
        `The road leads toward ${a(result.lifePath.right).id} — ${a(result.lifePath.right).name}: ${a(result.lifePath.right).personality}`,
      ],
      light: `Purpose feels close when you lean on ${joinList(a(result.lifePath.right).strengths)}.`,
      shadow: `The detour to watch for: ${joinList(a(result.lifePath.left).challenges)} at the start of the road, ${joinList(core.challenges)} in the middle of it.`,
    },
    {
      id: 'love-relationships',
      title: 'Love & Relationships',
      icon: 'heart',
      points: `${tag('A', result.loveLine.left)} → ${tag('X', result.loveLine.center)} → ${tag('C', result.loveLine.right)}`,
      body: [
        `How you enter love — ${a(result.loveLine.left).name}: ${a(result.loveLine.left).loveMeaning}`,
        `Love at your centre — ${core.name}: ${core.loveMeaning}`,
        `What love builds toward — ${a(result.loveLine.right).name}: ${a(result.loveLine.right).loveMeaning}`,
      ],
      light: `Your gifts in love: ${joinList(core.strengths)} — and the warmth of ${joinList(a(result.loveLine.right).strengths)} as the bond matures.`,
      shadow: `Friction tends to start with ${joinList(a(result.loveLine.left).challenges)} and deepen through ${joinList(core.challenges)}. These are patterns to notice together, not verdicts.`,
    },
    {
      id: 'money-career',
      title: 'Money & Career',
      icon: 'coins',
      points: `${tag('B', result.moneyLine.left)} → ${tag('X', result.moneyLine.center)} → ${tag('D', result.moneyLine.right)}`,
      body: [
        `Your money drive — ${a(result.moneyLine.left).name}: ${a(result.moneyLine.left).moneyMeaning}`,
        `Money at your centre — ${core.name}: ${core.moneyMeaning}`,
        `Your material foundation — ${a(result.moneyLine.right).name}: ${a(result.moneyLine.right).moneyMeaning}`,
      ],
      light: `Earning comes most naturally through ${joinList(a(result.moneyLine.left).strengths)}, steadied by ${joinList(core.strengths)}.`,
      shadow: `Money leaks usually trace back to ${joinList(a(result.moneyLine.right).challenges)} — worth an honest look before any big commitment.`,
    },
    {
      id: 'talents-gifts',
      title: 'Talents & Gifts',
      icon: 'gift',
      points: talent.points.map((p) => tag(p.key, p.arcana.id)).join(' · '),
      body: [talent.intro, ...lineBody(talent, 'personality')],
      light: `The gift cluster is strongest where it repeats: ${joinList(a(result.E).strengths)} at the talent point itself.`,
      shadow: `Gifts go quiet when their shadow runs them — here, ${joinList(a(result.E).challenges)}. Deliberate practice is the antidote.`,
    },
    {
      id: 'family-lines',
      title: 'Family Lines & Ancestral Legacy',
      icon: 'users',
      points: `Father ${tag('H', result.H)} → ${tag('F', result.F)} · Mother ${tag('E', result.E)} → ${tag('G', result.G)}`,
      body: [
        father.intro,
        ...father.points.map((p) => `Father's line — ${p.role} (${p.key} · ${p.arcana.id} ${p.arcana.name}): ${p.arcana.personality}`),
        mother.intro,
        ...mother.points.map((p) => `Mother's line — ${p.role} (${p.key} · ${p.arcana.id} ${p.arcana.name}): ${p.arcana.personality}`),
        'Neither line is a sentence you must serve. Read them as weather you were born into: some of it you will keep, some you will consciously hand back.',
      ],
      light: `Inherited strengths include ${joinList(a(result.H).strengths)} from the father's side and ${joinList(a(result.E).strengths)} from the mother's.`,
      shadow: `Inherited patterns worth noticing: ${joinList(a(result.F).challenges)} on the father's line, ${joinList(a(result.G).challenges)} on the mother's.`,
    },
    {
      id: 'karmic-tail',
      title: 'Karmic Tail',
      icon: 'infinity',
      points: `Tail ${tail.code} — ${tail.points.map((p) => tag(p.key, p.arcana.id)).join(' → ')}`,
      body: [
        `Your karmic tail is ${tail.code}: the pattern you carried in, the way it keeps repeating, and the lesson that resolves it. It is read as one story in three beats.`,
        ...tail.points.map((p) => `${p.role} — ${p.heading} (${p.key} · ${p.arcana.id} ${p.arcana.name}). ${p.arcana.karmicLesson}`),
      ],
      light: `The resolution point, ${a(result.M).name}, grows through ${joinList(a(result.M).strengths)}.`,
      shadow: `The cycle restarts through ${joinList(a(result.C).challenges)} at the root and ${joinList(a(result.G).challenges)} in the repetition. Spotting the restart early is most of the work.`,
    },
    {
      id: 'health-energy',
      title: 'Health & Energy',
      icon: 'activity',
      points: `Crown ${result.A} · Heart ${result.X} · Root ${result.C}`,
      body: [
        'Your chart maps onto the seven energy centres, from crown to root. Three of them carry the chart\'s main axis — read them as a picture of where your energy gathers and where it drains. This is a reflective map, not a medical reading; for anything to do with your health, a qualified professional is the right reader.',
        `Crown — ${byChakra('crown').chakra.area.toLowerCase()}: ${byChakra('crown').physical.name} (${byChakra('crown').physical.id}). ${byChakra('crown').chakra.theme}`,
        `Heart — ${byChakra('heart').chakra.area.toLowerCase()}: your centre, ${core.name}. ${byChakra('heart').chakra.theme} ${core.personality}`,
        `Root — ${byChakra('root').chakra.area.toLowerCase()}: ${byChakra('root').physical.name} (${byChakra('root').physical.id}). ${byChakra('root').chakra.theme}`,
        `The full map — all seven centres read physically, energetically and emotionally — is in the Chakra Health Map alongside your chart.`,
      ],
      light: `Energy flows best through ${joinList(byChakra('heart').physical.strengths)} at the heart centre.`,
      shadow: `Drain tends to show first at the root: ${joinList(byChakra('root').physical.challenges)}. Rest and grounding are maintenance, not rewards.`,
    },
    {
      id: 'purpose-by-stage',
      title: 'Purpose by Life Stage',
      icon: 'target',
      points: purposes.map((p) => `${p.stage} · ${p.arcana.id}`).join(' · '),
      body: [
        'In the Destiny Matrix method, purpose is not one sentence for a whole life — it unfolds in chapters, and each stage has its own guiding arcana.',
        ...purposes.map((p) => `${p.stage} — ${p.label}: ${p.arcana.id} ${p.arcana.name}. ${p.arcana.karmicLesson}`),
      ],
      light: `Each stage builds on the last: the strengths of ${purposes.map((p) => p.arcana.name).join(', ')} arrive in that order for a reason.`,
      shadow: 'The common trap is living a later stage\'s lesson early, or refusing to leave an earlier one. The stage you are in asks its own question.',
    },
    {
      id: 'your-numbers',
      title: 'Your Numbers',
      icon: 'hash',
      points: `${analysis.presentCount} of 22 arcana present · ${analysis.repeated.length} repeated · ${analysis.missing.length} missing`,
      body: [
        'Across all sixteen points of your chart, some arcana speak more than once — and some never appear. Both facts mean something.',
        ...(analysis.repeated.length
          ? analysis.repeated.map(
              (r) =>
                `Repeated — ${r.arcana.id} ${r.arcana.name} appears ${r.count} times (${r.positions.join(', ').toLowerCase()}): ${r.arcana.description.toLowerCase()}. A repeated arcana is a loud energy — its lesson and its gift both run through several areas of your life at once.`,
            )
          : ['No arcana repeats in your chart — your energies are spread evenly, with no single number dominating.']),
        `Missing — ${analysis.missing.length} of the 22 arcana do not appear natively: ${analysis.missing.map((m) => `${m.id} ${m.name}`).join(' · ')}. These are not flaws. They are the qualities you meet through other people and build deliberately, rather than by instinct.`,
      ],
      light: analysis.repeated.length
        ? `Your loudest gift is ${analysis.repeated[0].arcana.name}: ${joinList(analysis.repeated[0].arcana.strengths)}.`
        : 'An even spread is its own gift: no single pattern runs your life.',
      shadow: analysis.missing.length
        ? `Your clearest growth edge is the first missing energy, ${analysis.missing[0].name} — ${analysis.missing[0].description.toLowerCase()}.`
        : undefined,
    },
  ];

  // Zone 11 — Year Ahead (needs the birth date for the Personal Year cycle)
  const year = new Date().getFullYear();
  if (extras.birthDate) {
    const py = personalYearNumber(extras.birthDate, year);
    const meaning = PERSONAL_YEAR_MEANINGS[py];
    const next = PERSONAL_YEAR_MEANINGS[personalYearNumber(extras.birthDate, year + 1)];
    zones.push({
      id: 'year-ahead',
      title: 'Year Ahead',
      icon: 'calendar',
      points: `Personal Year ${py} · ${year}`,
      body: [
        `${year} is a Personal Year ${py} for you — ${meaning.theme}. ${meaning.description}`,
        `Lean in: ${meaning.focus}`,
        `Go gently: ${meaning.avoid}`,
        `In love this year: ${meaning.love}`,
        `With money and work: ${meaning.money}`,
        `Next year the wheel turns to Personal Year ${personalYearNumber(extras.birthDate, year + 1)} — ${next.theme}. Nothing to do about that yet; it simply colours how this year's endings will feel.`,
      ],
      light: `This year's tailwind: ${meaning.focus}`,
      shadow: `This year's headwind: ${meaning.avoid}`,
    });
  } else {
    zones.push({
      id: 'year-ahead',
      title: 'Year Ahead',
      icon: 'calendar',
      points: `The 9-year cycle · ${year}`,
      body: [
        'Your chart also sits inside a nine-year cycle — each calendar year carries a Personal Year number, from 1 (new beginnings) to 9 (completion and release), and the year you are in colours everything else in this reading.',
        'Your Personal Year is calculated from your birth day and month plus the current year. On your chart page it is worked out exactly; the free Personal Year tool shows your current year, month and day together.',
      ],
    });
  }

  // Zone 12 — Shadow & Growth
  const resolution = a(result.M);
  zones.push({
    id: 'shadow-growth',
    title: 'Shadow & Growth',
    icon: 'moon',
    points: `${tag('M', result.M)} · ${analysis.missing.length} missing arcana`,
    body: [
      'Every chart has a shadow side — not a flaw in the design, but the part of the design that only grows on purpose. Yours gathers in two places.',
      `First, the resolution point of your karmic tail: ${resolution.id} ${resolution.name}. ${resolution.karmicLesson} Its shadow — ${joinList(resolution.challenges)} — is usually the exact shape the old pattern takes when it returns.`,
      `Second, the energies your chart does not carry natively. ${analysis.missing.slice(0, 4).map((m) => `${m.id} ${m.name} (${m.description.toLowerCase()})`).join('; ')} — these arrive through other people, mentors and deliberate practice rather than instinct.`,
      `And at the centre, your own shadow: ${joinList(core.challenges)}. ${core.name}'s growth is not about becoming someone else — it is about noticing sooner.`,
    ],
    light: `Growth here is compounding: ${joinList(resolution.strengths)} at the resolution point strengthens every other zone in this reading.`,
    shadow: `The honest summary: ${joinList(core.challenges)} at the centre, ${joinList(resolution.challenges)} at the tail. Patterns to notice — never predictions.`,
  });

  return zones;
}

/* ------------------------------------------------------------------ */
/* Compatibility — 9 zones                                             */
/* ------------------------------------------------------------------ */

const TENSE = new Set([13, 15, 16, 22]);

function allValues(r: DestinyMatrixResult): number[] {
  return [r.A, r.B, r.C, r.D, r.E, r.F, r.G, r.H, r.X, r.J, r.K, r.L, r.M, r.N, r.O, r.P];
}

export function compatibilityZones(
  chart1: DestinyMatrixResult,
  chart2: DestinyMatrixResult,
  combined: DestinyMatrixResult,
  extras: ZoneExtras = {},
): Zone[] {
  const name1 = extras.name || 'Partner One';
  const name2 = extras.partnerName || 'Partner Two';
  const core1 = a(chart1.X);
  const core2 = a(chart2.X);
  const combinedCore = a(combined.X);
  const tail1 = getKarmicTail(chart1);
  const tail2 = getKarmicTail(chart2);
  const combinedTail = getKarmicTail(combined);

  const shared = [...new Set(allValues(chart1).filter((v) => allValues(chart2).includes(v)))].sort(
    (x, y) => x - y,
  );

  // The positions where the two charts pull hardest against each other:
  // where the combined point lands on a tense arcana, the friction is real.
  const POS_LABEL: Record<string, string> = {
    A: 'the portrait point', B: 'the drive point', C: 'the foundation point',
    D: 'the karmic point', X: 'the centre', M: 'the tail resolution', G: 'the tail repetition',
  };
  const friction = (['X', 'C', 'A', 'M', 'G'] as const)
    .filter((k) => TENSE.has(combined[k]))
    .map((k) => ({ key: k, label: POS_LABEL[k], arcana: a(combined[k]) }));

  const pc1 = getParentChildLine(chart1);
  const pc2 = getParentChildLine(chart2);
  const combinedPurposes = purposeByStage(combined);

  return [
    {
      id: 'two-cores',
      title: 'Two Cores',
      icon: 'sparkles',
      points: `${name1} ${tag('X', chart1.X)} · ${name2} ${tag('X', chart2.X)} · Together ${tag('X', combined.X)}`,
      body: [
        `Every relationship is two centres learning to orbit each other. ${name1}'s centre is ${core1.id} ${core1.name}: ${core1.personality}`,
        `${name2}'s centre is ${core2.id} ${core2.name}: ${core2.personality}`,
        `Together your centres blend into ${combinedCore.id} ${combinedCore.name} — ${combinedCore.description.toLowerCase()}. This is the flavour the relationship itself takes on when you are in a room together: ${combinedCore.personality}`,
      ],
      light: `Between you, you carry ${joinList(core1.strengths)} and ${joinList(core2.strengths)} — a wider toolkit than either of you holds alone.`,
      shadow: `Two centres also means two shadows: ${joinList(core1.challenges)} meeting ${joinList(core2.challenges)}. Most couples' arguments are these two lists introducing themselves.`,
    },
    {
      id: 'shared-strengths',
      title: 'Shared Strengths',
      icon: 'gift',
      points: shared.length
        ? `Shared arcana: ${shared.map((id) => `${id} ${a(id).name}`).join(' · ')}`
        : 'No arcana appears in both charts',
      body: shared.length
        ? [
            `${shared.length} ${shared.length === 1 ? 'arcana appears' : 'arcana appear'} in both of your charts. Shared numbers are the ground you already agree on — the instincts you never have to explain to each other.`,
            ...shared.slice(0, 4).map(
              (id) => `${id} ${a(id).name} — ${a(id).description.toLowerCase()}. Together you bring ${joinList(a(id).strengths)}.`,
            ),
          ]
        : [
            'No arcana appears in both charts — which is not a lack. It means you cover different ground: what one of you does by instinct, the other does by admiration. Couples like this rarely compete, because their gifts do not overlap.',
            `The bridge between you is your combined centre, ${combinedCore.name}: ${combinedCore.personality}`,
          ],
      light: shared.length
        ? `Your shared ground is real: ${shared.map((id) => a(id).name).join(', ')}.`
        : 'Difference, handled well, is its own strength — you are each other\'s missing numbers.',
      shadow: shared.length
        ? 'Shared numbers share shadows too — a blind spot neither of you can see for the other. Outside perspective matters for this couple.'
        : undefined,
    },
    {
      id: 'love-connection',
      title: 'Love & Connection',
      icon: 'heart',
      points: `Together ${tag('A', combined.loveLine.left)} → ${tag('X', combined.loveLine.center)} → ${tag('C', combined.loveLine.right)}`,
      body: [
        `${name1} enters love through ${a(chart1.loveLine.left).name}: ${a(chart1.loveLine.left).loveMeaning}`,
        `${name2} enters love through ${a(chart2.loveLine.left).name}: ${a(chart2.loveLine.left).loveMeaning}`,
        `At the heart of the bond sits ${a(combined.loveLine.center).name}: ${a(combined.loveLine.center).loveMeaning}`,
        `And the bond is building toward ${a(combined.loveLine.right).name}: ${a(combined.loveLine.right).loveMeaning}`,
      ],
      light: `Affection flows most easily in the language of ${a(combined.loveLine.center).name}: ${joinList(a(combined.loveLine.center).strengths)}.`,
      shadow: `Love frays first through ${joinList(a(combined.loveLine.left).challenges)} at the entry point — the small beginnings of distance are worth catching early.`,
    },
    {
      id: 'money-work',
      title: 'Money & Work Together',
      icon: 'coins',
      points: `Together ${tag('B', combined.moneyLine.left)} → ${tag('X', combined.moneyLine.center)} → ${tag('D', combined.moneyLine.right)}`,
      body: [
        `${name1}'s money drive is ${a(chart1.moneyLine.left).name}: ${a(chart1.moneyLine.left).moneyMeaning}`,
        `${name2}'s money drive is ${a(chart2.moneyLine.left).name}: ${a(chart2.moneyLine.left).moneyMeaning}`,
        `As a household, your money centre is ${a(combined.moneyLine.center).name}: ${a(combined.moneyLine.center).moneyMeaning}`,
        `Your shared material foundation is ${a(combined.moneyLine.right).name}: ${a(combined.moneyLine.right).moneyMeaning}`,
      ],
      light: `Financially, this pairing earns best through ${joinList(a(combined.moneyLine.left).strengths)} and saves best through ${joinList(a(combined.moneyLine.right).strengths)}.`,
      shadow: `Money friction usually traces to ${joinList(a(combined.moneyLine.right).challenges)} at the foundation — a pattern to budget around, together and out loud.`,
    },
    {
      id: 'communication',
      title: 'Communication',
      icon: 'message',
      points: `${tag('N', combined.N)} · centres ${chart1.X} & ${chart2.X}`,
      body: [
        `How a couple talks is written where their centres meet their blend point. Your blend point — the sum of your inner corners — is ${combined.N}, ${a(combined.N).name}: ${a(combined.N).personality}`,
        `${name1} speaks from ${core1.name}: their instinct under pressure runs to ${joinList(core1.challenges)} — which the other can misread if they do not know it is a stress pattern, not a message.`,
        `${name2} speaks from ${core2.name}: their instinct under pressure runs to ${joinList(core2.challenges)}.`,
        `The repair language that suits this bond is ${a(combined.N).name}'s: ${a(combined.N).karmicLesson}`,
      ],
      light: `At your best you hear each other through ${joinList(a(combined.N).strengths)}.`,
      shadow: 'Most "communication problems" in this chart are timing problems: two stress patterns talking at once. One pattern at a time is the whole technique.',
    },
    {
      id: 'main-challenge',
      title: 'Main Challenge & Breakup Risks',
      icon: 'alert',
      points: friction.length
        ? friction.map((f) => `${f.key} · ${f.arcana.id} ${f.arcana.name}`).join(' · ')
        : `Combined centre ${combined.X} · tail ${combinedTail.code}`,
      body: [
        'Every chart pairing has friction points — places where the combined numbers carry a tenser energy. These are not predictions and not a verdict on the relationship. They are the patterns couples with this chart most often describe, named early so they can be worked with rather than discovered the hard way.',
        ...(friction.length
          ? friction.map(
              (f) =>
                `At ${f.label} (${f.key}), your combined chart carries ${f.arcana.id} ${f.arcana.name} — ${f.arcana.description.toLowerCase()}. Its shadow in a relationship: ${joinList(f.arcana.challenges)}. Couples tend to meet this as a recurring argument shape rather than a single event.`,
            )
          : [
              `Your combined chart carries no classically tense arcana at the main friction points — its centre is ${combinedCore.name} and its tail resolves at ${a(combined.M).name}. The risk profile here is quieter: drift and assumption rather than explosion.`,
            ]),
        `The combined karmic tail is ${combinedTail.code}, resolving at ${a(combined.M).name}: ${a(combined.M).karmicLesson} When this couple repeats an old pattern, that resolution point is the exit.`,
        'The honest reading of "breakup risk" in any chart is the same: risk lives where a pattern is repeated without being named. Everything in this zone can be named — which is most of the protection there is.',
      ],
      light: `Your shared exit from old patterns is ${a(combined.M).name}: ${joinList(a(combined.M).strengths)}.`,
      shadow: friction.length
        ? `Named plainly, the watch-list is: ${friction.map((f) => joinList(f.arcana.challenges)).join('; ')}.`
        : 'The watch-list here is complacency: assuming a quiet chart needs no maintenance.',
    },
    {
      id: 'children-parenting',
      title: 'Children & Parenting',
      icon: 'baby',
      points: `${name1} passes on ${tag('C', chart1.C)} · ${name2} passes on ${tag('C', chart2.C)}`,
      body: [
        'Whether or not children are part of your story, this zone reads how each of you nurtures — what you were handed by your own parents, and what you would hand on. It is about parenting style, not prophecy.',
        `${name1}, at the crossing of the family lines: ${pc1.points[2].arcana.personality} What flows from ${name1} to the next generation sits at the bottom point — ${a(chart1.C).id} ${a(chart1.C).name}: ${a(chart1.C).personality}`,
        `${name2}, at the crossing: ${pc2.points[2].arcana.personality} What flows from ${name2} onward — ${a(chart2.C).id} ${a(chart2.C).name}: ${a(chart2.C).personality}`,
        `As a parenting pair, your combined centre is ${combinedCore.name}: children in this household would meet ${joinList(combinedCore.strengths)} as the everyday weather.`,
      ],
      light: `The gifts most likely to be handed down deliberately: ${joinList(a(chart1.C).strengths)} from ${name1}, ${joinList(a(chart2.C).strengths)} from ${name2}.`,
      shadow: `The patterns most worth handing back instead: ${joinList(a(chart1.C).challenges)} and ${joinList(a(chart2.C).challenges)} — noticed, they rarely repeat.`,
    },
    {
      id: 'karmic-lesson',
      title: 'Karmic Lesson Together',
      icon: 'infinity',
      points: `Tails ${tail1.code} & ${tail2.code} → together ${combinedTail.code}`,
      body: [
        `${name1}'s karmic tail is ${tail1.code} — resolving at ${a(chart1.M).name}: ${a(chart1.M).karmicLesson}`,
        `${name2}'s karmic tail is ${tail2.code} — resolving at ${a(chart2.M).name}: ${a(chart2.M).karmicLesson}`,
        `Together, your combined tail is ${combinedTail.code}: ${combinedTail.points.map((p) => `${p.arcana.name}`).join(' → ')}. ${a(combined.M).karmicLesson}`,
        'Read plainly: you each arrived with a pattern, and the relationship keeps seating you across from the other\'s. That is not an accident of this chart — it is most of what the chart is for.',
      ],
      light: `Together you resolve through ${joinList(a(combined.M).strengths)}.`,
      shadow: `The shared repetition to notice: ${joinList(a(combined.G).challenges)} at the middle of the combined tail.`,
    },
    {
      id: 'purpose-together',
      title: 'Purpose Together',
      icon: 'compass',
      points: `Together ${tag('H', combined.lifePath.left)} → ${tag('X', combined.lifePath.center)} → ${tag('F', combined.lifePath.right)}`,
      body: [
        `Your combined life path runs from ${a(combined.lifePath.left).name} through ${combinedCore.name} to ${a(combined.lifePath.right).name} — the direction this relationship itself is travelling, separate from either of your individual roads.`,
        `By life stage, the shared purpose unfolds as: ${combinedPurposes.map((p) => `${p.stage.toLowerCase()} — ${p.arcana.name}`).join('; ')}.`,
        `${combinedPurposes[0].arcana.karmicLesson}`,
        'A shared purpose is not a shared personality. It is simply the thing this pairing, at its best, keeps producing in the world.',
      ],
      light: `The pairing produces ${joinList(a(combined.lifePath.right).strengths)} most reliably when it aims at them on purpose.`,
      shadow: `Purpose drifts when the centre is neglected: ${joinList(combinedCore.challenges)} is the early warning sign.`,
    },
  ];
}

/* ------------------------------------------------------------------ */
/* Child — 7 zones                                                     */
/* ------------------------------------------------------------------ */

export function childZones(
  result: DestinyMatrixResult,
  positions?: ChartPosition[],
): Zone[] {
  void positions;
  const core = a(result.X);
  const talent = getTalentLine(result);
  const parentChild = getParentChildLine(result);

  return [
    {
      id: 'child-core',
      title: "Child's Core",
      icon: 'sparkles',
      points: tag('Centre X', result.X),
      body: [
        `At the centre of your child's chart sits ${core.id}, ${core.name} — ${core.description.toLowerCase()}. This is the energy they return to when they are simply being themselves.`,
        core.personality,
        `A sentence worth keeping on the fridge: “${core.affirmation}” — said in your own words, it is close to what this child most needs to hear.`,
      ],
      light: `Already visible, usually early: ${joinList(core.strengths)}.`,
      shadow: `Gentle watch-outs: ${joinList(core.challenges)}. In a child these are not faults — they are the same strengths, overdone or tired.`,
    },
    {
      id: 'temperament',
      title: 'Temperament',
      icon: 'sun',
      points: `${tag('A', result.A)} · ${tag('B', result.B)} · ${tag('C', result.C)} · ${tag('D', result.D)}`,
      body: [
        `The four outer points sketch your child's everyday temperament — how they meet the world before anyone teaches them how.`,
        `The face the world sees first (A · ${a(result.A).name}): ${a(result.A).personality}`,
        `Their drive and spark (B · ${a(result.B).name}): ${a(result.B).personality}`,
        `Their foundation and comfort (C · ${a(result.C).name}): ${a(result.C).personality}`,
        `Their deeper, quieter layer (D · ${a(result.D).name}): ${a(result.D).personality}`,
      ],
      light: `Temperament strengths to make room for: ${joinList(a(result.A).strengths)} and ${joinList(a(result.B).strengths)}.`,
      shadow: `Friction at home often comes from temperament, not disobedience — especially ${joinList(a(result.D).challenges)} in the quiet layer.`,
    },
    {
      id: 'talents-gifts',
      title: 'Talents & Gifts',
      icon: 'gift',
      points: talent.points.map((p) => tag(p.key, p.arcana.id)).join(' · '),
      body: [
        'Every chart carries a gift cluster near its top. In a child, these are the abilities that show up before training — the things they do for fun, for hours, without being asked.',
        ...talent.points.map(
          (p) => `${p.role} (${p.key} · ${p.arcana.id} ${p.arcana.name}): ${p.arcana.personality} Strengths to nurture: ${joinList(p.arcana.strengths)}.`,
        ),
      ],
      light: `The headline gift sits at the talent point itself — ${a(result.E).name}: ${joinList(a(result.E).strengths)}.`,
      shadow: `Gifts this strong can hide their shadow — ${joinList(a(result.E).challenges)}. Praise the effort and the kindness, not only the talent.`,
    },
    {
      id: 'learning-style',
      title: 'Learning Style',
      icon: 'book',
      points: `${tag('H', result.H)} · ${tag('E', result.E)} · ${tag('X', result.X)}`,
      body: [
        'This is a reflective reading of how your child\'s mind likes to take the world in — not a diagnosis and not a school report. Treat it as a set of experiments to try.',
        `Through the wisdom point (H · ${a(result.H).name}): ${a(result.H).personality} Learning tends to stick when it connects to this kind of understanding.`,
        `Through the talent point (E · ${a(result.E).name}): strengths like ${joinList(a(result.E).strengths)} are often the doorway — a subject taught through the gift is a subject remembered.`,
        `At the centre (${core.name}): motivation returns when learning feels connected to who they are. ${core.karmicLesson}`,
      ],
      light: `Best first experiment: teach through ${a(result.E).name}'s strengths — ${joinList(a(result.E).strengths)}.`,
      shadow: `Boredom in this chart usually signals a mismatch of doorway, not ability — watch for ${joinList(a(result.H).challenges)} when a subject "won't go in".`,
    },
    {
      id: 'emotional-world',
      title: 'Emotional World',
      icon: 'moon',
      points: `${tag('G', result.G)} · ${tag('H', result.H)} · ${tag('A', result.loveLine.left)}`,
      body: [
        'The lower-left of the chart is the moon side — feelings, comfort and the inner weather your child may not yet have words for.',
        `The deep-feeling point (G · ${a(result.G).name}): ${a(result.G).personality}`,
        `The reflective point (H · ${a(result.H).name}): ${a(result.H).personality}`,
        `Where affection starts (A · ${a(result.loveLine.left).name}): ${a(result.loveLine.left).loveMeaning} Read for a child, this describes how love and safety register — the tone of voice, the rituals, the repair after a rupture.`,
      ],
      light: `Comfort lands best through ${joinList(a(result.G).strengths)} — small, repeated, predictable kindnesses.`,
      shadow: `Big feelings may arrive as ${joinList(a(result.G).challenges)}. Naming the feeling for them, calmly and early, is the whole technique at this age.`,
    },
    {
      id: 'family-connection',
      title: 'Family Connection',
      icon: 'users',
      points: parentChild.points.map((p) => tag(p.key, p.arcana.id)).join(' · '),
      body: [
        parentChild.intro,
        ...parentChild.points.map(
          (p) => `${p.role} (${p.key} · ${p.arcana.id} ${p.arcana.name}): ${p.arcana.personality}`,
        ),
        'Read as a parent, the last point matters most: what you pass on is not what you say — it is the energy at the bottom of their chart, which they will carry as "just how things are" until they are old enough to choose.',
      ],
      light: `What this child receives most easily from family: ${joinList(a(result.H).strengths)} from one line, ${joinList(a(result.E).strengths)} from the other.`,
      shadow: `Family patterns to soften rather than repeat: ${joinList(a(result.C).challenges)} at the point of inheritance.`,
    },
    {
      id: 'growth-support',
      title: 'Growth & Support',
      icon: 'sprout',
      points: `${tag('X', result.X)} · ${tag('A', result.A)} · ${tag('E', result.E)}`,
      body: [
        'Every child\'s chart has edges — the places where growing will take longer, and where your support changes the most. In this chart they gather around three points.',
        `At the core (${core.name}): ${joinList(core.challenges)}. Met with patience, each of these is a strength in training — the chart does not change, but the child\'s relationship to it does.`,
        `In temperament (${a(result.A).name}): ${joinList(a(result.A).challenges)}. Structure, warning before transitions, and repair after conflict help more than consequences do.`,
        `In the gifts (${a(result.E).name}): ${joinList(a(result.E).challenges)}. Protect the gift from becoming the identity — the child is more than the talent.`,
        `Their centre's lesson, translated for parents: ${core.karmicLesson} Your job is not to teach it — it is to make the home a place where learning it is safe.`,
      ],
      light: `Support that compounds: ${joinList(core.strengths)} noticed and named out loud, often.`,
      shadow: 'Nothing in this zone is a warning about who your child will become. It is a map of where your patience will be spent — and patience, spent there, is never wasted.',
    },
  ];
}

/** Convenience: the combined-chart zones need both birth dates resolved first. */
export function combinedCentre(result: DestinyMatrixResult): number {
  return reduceToArcana(result.X);
}

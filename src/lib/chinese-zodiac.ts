/**
 * Chinese zodiac — the 12 year-animals, the 5-element / yin-yang stem cycle,
 * and a verified Chinese New Year table used to place January/February
 * birthdays in the correct zodiac year.
 *
 * CNY dates verified 2026-11-22 against China Highlights, datescal.com and
 * shengxiao.org (all three agree on every year 1990–2032, including
 * CNY 2027 = Saturday 6 February 2027, opening the Fire Goat year), and
 * cross-checked against the Wikibooks Ba Zi table (agrees on all years
 * except 2030, where the three CNY sources give 3 Feb and we follow them).
 */

export type ChineseElement = 'Wood' | 'Fire' | 'Earth' | 'Metal' | 'Water';
export type Polarity = 'Yang' | 'Yin';

export interface ChineseAnimal {
  name: string;
  slug: string;
  /** Chinese character for the animal. */
  glyph: string;
  /** Fixed element of the animal's earthly branch. */
  branchElement: ChineseElement;
  /** Birth years belonging to this animal, 1924–2036. */
  years: number[];
  traits: string;
  strengths: string[];
  challenges: string[];
  luckyNumbers: number[];
  luckyColours: string[];
  /** The other two animals of its San He (Three Harmonies) trine — slugs. */
  matches: string[];
  /** The opposite animal on the wheel — the traditional clash — slug. */
  clash: string;
  elementNote: string;
}

const yearsFrom = (first: number): number[] => {
  const out: number[] = [];
  for (let y = first; y <= 2036; y += 12) out.push(y);
  return out;
};

export const ANIMALS: ChineseAnimal[] = [
  {
    name: 'Rat',
    slug: 'rat',
    glyph: '鼠',
    branchElement: 'Water',
    years: yearsFrom(1924),
    traits:
      'Rats notice everything. Quick, curious and quietly resourceful, you read a room in seconds and spot the opportunity — or the exit — before anyone else has finished their first impression. You are at your best when life feels like a puzzle to be solved rather than a weight to be carried, and your charm is the practical kind: you remember what people said, what they need, and exactly when to bring it up.',
    strengths: ['Resourceful', 'Sharp-eyed', 'Adaptable', 'Charming under pressure'],
    challenges: ['Restless', 'Slow to trust fully', 'Prone to hoarding worries', 'Can outsmart itself'],
    luckyNumbers: [2, 3],
    luckyColours: ['Blue', 'Gold', 'Green'],
    matches: ['dragon', 'monkey'],
    clash: 'horse',
    elementNote:
      'The Rat’s branch is Water — the element of intelligence, adaptability and quiet depth. Your birth-year element (below) colours how that Water flows: a Wood Rat grows, a Fire Rat sparkles, a Metal Rat gleams.',
  },
  {
    name: 'Ox',
    slug: 'ox',
    glyph: '牛',
    branchElement: 'Earth',
    years: yearsFrom(1925),
    traits:
      'The Ox does not rush, and does not need to. Patient, methodical and almost stubbornly reliable, you build things that last — careers, families, reputations — one honest day’s work at a time. People lean on you because your word, once given, behaves like a contract. Beneath the calm surface there is a dry humour and a deep loyalty that only those close to you ever fully see.',
    strengths: ['Dependable', 'Patient', 'Methodical', 'Honest to the bone'],
    challenges: ['Stubborn', 'Slow to forgive', 'Resists change', 'Carries too much alone'],
    luckyNumbers: [1, 9],
    luckyColours: ['Red', 'Blue', 'Purple'],
    matches: ['snake', 'rooster'],
    clash: 'goat',
    elementNote:
      'The Ox’s branch is Earth — the element of endurance, honesty and slow, real growth. Your birth-year element shapes the soil: a Fire Ox burns with ambition, a Water Ox quietly nourishes everything it touches.',
  },
  {
    name: 'Tiger',
    slug: 'tiger',
    glyph: '虎',
    branchElement: 'Wood',
    years: yearsFrom(1926),
    traits:
      'Tigers were not made for the sidelines. Bold, magnetic and allergic to being told what to do, you would rather leap and adjust mid-air than wait for permission. Your confidence is not an act — it is fuel — and rooms reorganise themselves around it. The Tiger’s lifelong craft is learning that the bravest move is sometimes the patient one.',
    strengths: ['Brave', 'Magnetic', 'Decisive', 'Fiercely protective'],
    challenges: ['Impulsive', 'Rebels on principle', 'All-or-nothing moods', 'Dislikes taking advice'],
    luckyNumbers: [1, 3, 4],
    luckyColours: ['Blue', 'Grey', 'Orange'],
    matches: ['horse', 'dog'],
    clash: 'monkey',
    elementNote:
      'The Tiger’s branch is Wood — the element of growth, courage and spring’s first surge. Your birth-year element steers the hunt: an Earth Tiger stalks patiently, a Fire Tiger simply charges, gloriously.',
  },
  {
    name: 'Rabbit',
    slug: 'rabbit',
    glyph: '兔',
    branchElement: 'Wood',
    years: yearsFrom(1927),
    traits:
      'The Rabbit moves through the world like water around stones — gently, gracefully, and almost never by force. You have exquisite taste, a diplomat’s instinct for the unspoken thing in the room, and a private inner life richer than most people guess. Peace is not a luxury for you; it is the condition in which everything you are good at becomes possible.',
    strengths: ['Graceful', 'Perceptive', 'Diplomatic', 'Impeccable taste'],
    challenges: ['Conflict-avoidant', 'Over-cautious', 'Keeps worries private', 'Escapes into comfort'],
    luckyNumbers: [3, 4, 6],
    luckyColours: ['Red', 'Pink', 'Purple', 'Blue'],
    matches: ['goat', 'pig'],
    clash: 'rooster',
    elementNote:
      'The Rabbit’s branch is Wood — soft, growing, bending without breaking. Your birth-year element refines it further: a Metal Rabbit has a steel stem inside the silk, a Water Rabbit is pure intuition.',
  },
  {
    name: 'Dragon',
    slug: 'dragon',
    glyph: '龙',
    branchElement: 'Earth',
    years: yearsFrom(1928),
    traits:
      'Dragons carry weather with them. Ambitious, vivid and unshakeably self-assured, you think in decades and epics where others think in weeks. Luck seems to follow you, though those who know you understand it is mostly appetite — for life, for scale, for the grand gesture. Your work is to aim that fire at things worthy of it.',
    strengths: ['Visionary', 'Confident', 'Generous', 'Tireless'],
    challenges: ['Perfectionist', 'Blunt', 'Restless with routine', 'Expects its own standard from everyone'],
    luckyNumbers: [1, 6, 7],
    luckyColours: ['Gold', 'Silver', 'Grey-white'],
    matches: ['rat', 'monkey'],
    clash: 'dog',
    elementNote:
      'The Dragon’s branch is Earth — storm-clouds over mountains, power with a foundation. Your birth-year element gives the Dragon its weather: a Wood Dragon grows empires, a Metal Dragon guards treasure, a Water Dragon brings the rain.',
  },
  {
    name: 'Snake',
    slug: 'snake',
    glyph: '蛇',
    branchElement: 'Fire',
    years: yearsFrom(1929),
    traits:
      'The Snake is the zodiac’s quiet philosopher. Intuitive, elegant and intensely private, you trust your own read of a situation over any amount of noise around it — and your read is usually right. You shed skins for a living: old selves, old plans, old grudges are left behind without ceremony. What remains is focus, and a wisdom that unsettles people who prefer things simple.',
    strengths: ['Intuitive', 'Composed', 'Wise', 'Self-reliant'],
    challenges: ['Guarded', 'Possessive', 'Slow to trust', 'Can hold a grudge in silence'],
    luckyNumbers: [2, 8, 9],
    luckyColours: ['Black', 'Red', 'Yellow'],
    matches: ['ox', 'rooster'],
    clash: 'pig',
    elementNote:
      'The Snake’s branch is Fire — but a banked, lamp-like fire: insight rather than blaze. Your birth-year element tends the flame: an Earth Snake glows steady, a Fire Snake burns twice as bright and twice as private.',
  },
  {
    name: 'Horse',
    slug: 'horse',
    glyph: '马',
    branchElement: 'Fire',
    years: yearsFrom(1930),
    traits:
      'Horses are built for open country. Warm-blooded, quick-witted and gloriously impatient with anything slow or false, you come alive in motion — new cities, new projects, new people. Your energy is contagious and your honesty disarming. The Horse’s lesson is the fence it keeps jumping: freedom matters most when you have chosen what to run toward, not just what to run from.',
    strengths: ['Energetic', 'Warm', 'Quick-witted', 'Independent'],
    challenges: ['Impatient', 'Blunt mid-gallop', 'Bored by detail', 'Leaves things unfinished'],
    luckyNumbers: [2, 3, 7],
    luckyColours: ['Yellow', 'Green'],
    matches: ['tiger', 'dog'],
    clash: 'rat',
    elementNote:
      'The Horse’s branch is Fire at full noon — warmth, speed and visibility. Your birth-year element decides the terrain: a Water Horse runs like a river, an Earth Horse like a campaign, a Fire Horse like wildfire.',
  },
  {
    name: 'Goat',
    slug: 'goat',
    glyph: '羊',
    branchElement: 'Earth',
    years: yearsFrom(1931),
    traits:
      'The Goat is the artist of the zodiac — gentle, imaginative and tuned to beauty and feeling the way musicians are tuned to pitch. You dream vividly and care deeply, and the people lucky enough to be loved by you are loved thoroughly. Harmony is your native country; conflict feels like exile. Your growth edge is trusting that your softness is a strength and not something to apologise for.',
    strengths: ['Creative', 'Empathetic', 'Gentle', 'Devoted'],
    challenges: ['Anxious', 'Indecisive', 'Needs reassurance', 'Avoids hard conversations'],
    luckyNumbers: [2, 7],
    luckyColours: ['Green', 'Red', 'Purple'],
    matches: ['rabbit', 'pig'],
    clash: 'ox',
    elementNote:
      'The Goat’s branch is Earth — meadow earth: warm, fertile, made for growing beautiful things. Your birth-year element seasons it: a Wood Goat is a garden in spring, a Fire Goat a hearth in winter.',
  },
  {
    name: 'Monkey',
    slug: 'monkey',
    glyph: '猴',
    branchElement: 'Metal',
    years: yearsFrom(1932),
    traits:
      'Monkeys are the zodiac’s beloved troublemakers — inventive, playful and three moves ahead in any game worth playing. You learn anything quickly, fix anything eventually, and bore at the speed of light. Beneath the jokes is a genuinely strategic mind that solves in an afternoon what committees circle for months. Your craft is aiming the mischief at problems instead of people.',
    strengths: ['Inventive', 'Witty', 'Strategic', 'Versatile'],
    challenges: ['Mischievous', 'Easily bored', 'Can cut corners', 'Tests patience for sport'],
    luckyNumbers: [4, 9],
    luckyColours: ['White', 'Blue', 'Gold'],
    matches: ['rat', 'dragon'],
    clash: 'tiger',
    elementNote:
      'The Monkey’s branch is Metal — quicksilver intelligence, tools and bright edges. Your birth-year element picks the instrument: a Water Monkey is pure improvisation, an Earth Monkey builds the machine that does the trick.',
  },
  {
    name: 'Rooster',
    slug: 'rooster',
    glyph: '鸡',
    branchElement: 'Metal',
    years: yearsFrom(1933),
    traits:
      'The Rooster sees everything — every detail, every flaw, every thread out of place — and says so. Precise, proud and secretly theatrical, you hold yourself and everyone else to a standard most people only talk about. Your honesty can sting, but it is almost never wrong, and your loyalty to the people in your flock is absolute. Underneath the polish is a heart that worries more than it admits.',
    strengths: ['Observant', 'Precise', 'Loyal', 'Hardworking'],
    challenges: ['Bluntly critical', 'Proud', 'Worries in private', 'Struggles to switch off'],
    luckyNumbers: [5, 7, 8],
    luckyColours: ['Gold', 'Brown', 'Yellow'],
    matches: ['ox', 'snake'],
    clash: 'rabbit',
    elementNote:
      'The Rooster’s branch is Metal — polished, exact, made to catch the light at dawn. Your birth-year element sets the finish: a Fire Rooster is a signal flare, a Water Rooster a still, reflective blade.',
  },
  {
    name: 'Dog',
    slug: 'dog',
    glyph: '狗',
    branchElement: 'Earth',
    years: yearsFrom(1934),
    traits:
      'Dogs are the conscience of the zodiac. Loyal to the bone, allergic to injustice and quietly anxious on behalf of everyone they love, you are the friend who shows up — early, prepared, and without being asked twice. You judge character the way others judge weather, instantly and usually correctly. Your lesson is learning that the world is not, in fact, your sole responsibility to guard.',
    strengths: ['Loyal', 'Just', 'Vigilant', 'Selfless'],
    challenges: ['Anxious', 'Pessimistic streak', 'Slow to trust newcomers', 'Takes on others’ burdens'],
    luckyNumbers: [3, 4, 9],
    luckyColours: ['Green', 'Red', 'Purple'],
    matches: ['tiger', 'horse'],
    clash: 'dragon',
    elementNote:
      'The Dog’s branch is Earth — the guarded gate and the kept promise. Your birth-year element shapes the watch: a Wood Dog guards a garden, a Metal Dog a vault, a Fire Dog the whole village.',
  },
  {
    name: 'Pig',
    slug: 'pig',
    glyph: '猪',
    branchElement: 'Water',
    years: yearsFrom(1935),
    traits:
      'The Pig believes in the good life and in good people, and is usually right about both. Generous, sincere and blessed with both diligence and taste, you build comfort around you and then invite everyone in. You work harder than your easy manner suggests and forgive faster than your pride would prefer. Your edge is discernment — learning that your open heart deserves a guest list.',
    strengths: ['Generous', 'Sincere', 'Diligent', 'Good-humoured'],
    challenges: ['Too trusting', 'Indulgent', 'Avoids confrontation', 'Gullible to flattery'],
    luckyNumbers: [2, 5, 8],
    luckyColours: ['Yellow', 'Grey', 'Brown', 'Gold'],
    matches: ['rabbit', 'goat'],
    clash: 'snake',
    elementNote:
      'The Pig’s branch is Water — deep, warm, life-giving water: the river that feeds the fields. Your birth-year element flavours it: an Earth Pig is a rich delta, a Fire Pig a hot spring, a Wood Pig a shaded stream.',
  },
];

export function getAnimalBySlug(slug: string): ChineseAnimal | undefined {
  return ANIMALS.find((a) => a.slug === slug.toLowerCase());
}

/* ------------------------------------------------------------------ */
/* The stem cycle: element + polarity for any year                     */
/* ------------------------------------------------------------------ */

/**
 * The ten heavenly stems pair each element with Yang then Yin:
 * years ending 4/5 are Wood, 6/7 Fire, 8/9 Earth, 0/1 Metal, 2/3 Water;
 * even years are Yang, odd years Yin. Anchors, verified against published
 * tables: 2024 Yang Wood Dragon, 2025 Yin Wood Snake, 2026 Yang Fire
 * Horse, 2027 Yin Fire Goat, 2028 Yang Earth Monkey.
 */
export function elementForYear(year: number): { element: ChineseElement; polarity: Polarity } {
  const d = ((year % 10) + 10) % 10;
  const element: ChineseElement =
    d === 4 || d === 5 ? 'Wood' : d === 6 || d === 7 ? 'Fire' : d === 8 || d === 9 ? 'Earth' : d === 0 || d === 1 ? 'Metal' : 'Water';
  return { element, polarity: year % 2 === 0 ? 'Yang' : 'Yin' };
}

/** The animal whose zodiac year begins at Chinese New Year of `year`. */
export function animalForYear(year: number): ChineseAnimal {
  const idx = (((year - 2020) % 12) + 12) % 12; // 2020 = Rat
  return ANIMALS[idx];
}

/* ------------------------------------------------------------------ */
/* Verified Chinese New Year dates, 1990–2032 (month, day)             */
/* ------------------------------------------------------------------ */

export const CNY_DATES: Record<number, [number, number]> = {
  1990: [1, 27], 1991: [2, 15], 1992: [2, 4], 1993: [1, 23], 1994: [2, 10],
  1995: [1, 31], 1996: [2, 19], 1997: [2, 7], 1998: [1, 28], 1999: [2, 16],
  2000: [2, 5], 2001: [1, 24], 2002: [2, 12], 2003: [2, 1], 2004: [1, 22],
  2005: [2, 9], 2006: [1, 29], 2007: [2, 18], 2008: [2, 7], 2009: [1, 26],
  2010: [2, 14], 2011: [2, 3], 2012: [1, 23], 2013: [2, 10], 2014: [1, 31],
  2015: [2, 19], 2016: [2, 8], 2017: [1, 28], 2018: [2, 16], 2019: [2, 5],
  2020: [1, 25], 2021: [2, 12], 2022: [2, 1], 2023: [1, 22], 2024: [2, 10],
  2025: [1, 29], 2026: [2, 17], 2027: [2, 6], 2028: [1, 26], 2029: [2, 13],
  2030: [2, 3], 2031: [1, 23], 2032: [2, 11],
};

export interface BirthAnimalResult {
  animal: ChineseAnimal;
  /** The zodiac year the birthday actually falls in (may be birth year − 1). */
  effectiveYear: number;
  element: ChineseElement;
  polarity: Polarity;
  /** True when the verified CNY table decided the boundary exactly. */
  exact: boolean;
  /** True when born before that year's CNY — belongs to the previous animal. */
  beforeNewYear: boolean;
}

/**
 * Find the Chinese zodiac animal for a birth date. The animal changes on
 * Chinese New Year, not on 1 January. For birth years inside the verified
 * table (1990–2032) the boundary is exact; outside it we return the
 * calendar year's animal flagged `exact: false` so the UI can be honest
 * about January/February birthdays.
 */
export function animalForBirthDate(date: Date): BirthAnimalResult {
  const y = date.getFullYear();
  const cny = CNY_DATES[y];
  if (cny) {
    const cnyDate = new Date(y, cny[0] - 1, cny[1]);
    const before = date.getTime() < cnyDate.getTime();
    const effectiveYear = before ? y - 1 : y;
    const { element, polarity } = elementForYear(effectiveYear);
    return { animal: animalForYear(effectiveYear), effectiveYear, element, polarity, exact: true, beforeNewYear: before };
  }
  const { element, polarity } = elementForYear(y);
  return { animal: animalForYear(y), effectiveYear: y, element, polarity, exact: false, beforeNewYear: false };
}

/* ------------------------------------------------------------------ */
/* 2027 — the Year of the Fire Goat                                    */
/* ------------------------------------------------------------------ */

export interface AnimalOutlook2027 {
  theme: string;
  love: string;
  career: string;
  wellbeing: string;
}

export const YEAR_2027 = {
  animal: 'Goat',
  element: 'Fire' as ChineseElement,
  polarity: 'Yin' as Polarity,
  /** Chinese New Year 2027 — verified (see table note above). */
  cnyDate: 'February 6, 2027',
  endsDate: 'January 25, 2028',
  overview: [
    'After the Fire Horse’s gallop through 2026, the Fire Goat year slows the tempo without cooling the flame. The Goat is the zodiac’s artist and peacemaker, and Fire is the element of warmth and visibility — together they make 2027 a year that rewards craft over speed, harmony over conquest, and beauty made slowly and well.',
    'Expect the year’s energy to gather around home, family, friendship and creative work. Big loud launches fare worse than things tended daily; reconciliation fares better than victory. The Fire Goat’s shadow is worry — a soft, free-floating anxiety that everything might go wrong — and its gift is the antidote: community. Almost nothing in 2027 is meant to be carried alone.',
    'The Goat year runs from Chinese New Year on February 6, 2027 to January 25, 2028. Read your animal’s outlook below as weather, not fate: a climate to dress for, in a year that favours gardeners over gamblers.',
  ],
  themes: ['Creativity', 'Harmony', 'Home & family', 'Craftsmanship', 'Compassion'],
};

export const OUTLOOKS_2027: Record<string, AnimalOutlook2027> = {
  rat: {
    theme:
      'A quieter year that rewards the Rat’s favourite skill: preparation. The Goat’s gentle pace may feel slow at first, but it gives you room to consolidate money, repair alliances and finally build the thing you kept postponing. Think of 2027 as the year your plans stop being notes and start being structures.',
    love: 'Old friendships warm into something more; couples do well building small shared rituals — the weekly meal, the Sunday walk — rather than grand gestures.',
    career: 'Behind-the-scenes work pays better than spotlight-chasing this year. Organise, save, streamline: the system you build in 2027 quietly funds 2028.',
    wellbeing: 'Guard your sleep. Your mind keeps working after you stop, so give it a closing time — and a notebook by the bed for the ideas that arrive at 2 a.m.',
  },
  ox: {
    theme:
      'Ox and Goat sit opposite each other on the wheel, so 2027 asks flexibility from you. Plans will bend this year — other people’s feelings, timing, weather — and the year goes markedly better when you let them bend gracefully instead of snapping. This is a year for practising the soft answer.',
    love: 'Softness is the whole lesson. Say the kind thing before the correct thing, and watch how much faster the correct thing gets heard afterwards.',
    career: 'Avoid head-on clashes with authority. Quiet, visible competence outlasts every argument, and someone senior is noticing more than they say.',
    wellbeing: 'Stretch, walk, unclench. Your body keeps the score of every compromise you swallow, so give it somewhere to put them down.',
  },
  tiger: {
    theme:
      'The Goat year will not match your pace, Tiger — and that is precisely its gift. Use the slower current to aim properly instead of leaping at everything that moves. One deliberate, well-timed move in 2027 is worth five dramatic ones.',
    love: 'Charm works, but consistency wins. Show up twice, steadily, before you declare anything — being believed is this year’s romance.',
    career: 'One well-chosen project beats five loud launches. Pick the prey worth the year and let the rest of the herd go past.',
    wellbeing: 'Channel surplus fire into sport before it becomes temper. Your body wants a contest; give it a friendly one.',
  },
  rabbit: {
    theme:
      'Rabbit and Goat are allies in the same harmony trine, which makes 2027 one of your kindest years in the cycle. Creative doors open, gentle people gather, and the world seems unusually willing to meet you at your own pace. Let it.',
    love: 'Romance has a storybook quality this year. Allow yourself to be chosen as well as choosing — being pursued suits you more than you admit.',
    career: 'Aesthetic and people-facing work flourishes. Your taste is not decoration this year; it is the strategy. Charge accordingly.',
    wellbeing: 'Protect your peace from other people’s emergencies. Not every crisis that knocks is addressed to you.',
  },
  dragon: {
    theme:
      'A humbler tempo than you prefer, Dragon. The Goat year rewards those who tend details and relationships instead of charging, so treat 2027 as the forge rather than the parade: unglamorous months that temper everything you will swing in 2028.',
    love: 'Grand gestures land less well than steady presence. Listen more than you announce, and let someone else hold the spotlight at dinner.',
    career: 'Finish and polish existing work. A quiet completion now — shipped, signed, delivered — funds a very loud year after.',
    wellbeing: 'Watch for burnout disguised as boredom. Rest is also training, and the forge cools the metal on purpose.',
  },
  snake: {
    theme:
      'Goat years suit the Snake’s private rhythm — unhurried, intuitive, rich in inner life. Research, study and quiet creation all thrive in 2027’s soft light, and you need less from the crowd than in any recent year. Trust the shed-and-renew cycle; a new skin is already forming.',
    love: 'Someone earns your trust slowly this year, in small consistent proofs. Let the process itself be the pleasure rather than a delay.',
    career: 'Work that happens offstage — strategy, writing, analysis, design — carries your name furthest. Let others present; you compose.',
    wellbeing: 'Your nervous system wants rhythm: regular hours, warm food, fewer screens after dark. Boredom, for you, is often just recovery.',
  },
  horse: {
    theme:
      'Horse and Goat are secret friends in the zodiac — a harmonious pairing that makes 2027 surprisingly kind to you, especially in love and creative work. The Fire you share with the year runs warm rather than wild: less stampede, more hearth.',
    love: 'One of your best recent years for real partnership. Say yes to being known — slowly, honestly, without the performance.',
    career: 'Creative collaborations beat solo sprints. Choose partners whose patience complements your pace, and put the agreement in writing early.',
    wellbeing: 'Keep moving, but let some of the runs be slow ones. Even wild horses walk to water.',
  },
  goat: {
    theme:
      'Your own year, Goat — the wheel comes home. Being the year’s sign brings visibility and a little pressure: everyone watches the host. Move like you belong here, because you do. The art you have been making in private is ready for an audience.',
    love: 'You are magnetic when you stop apologising for your sensitivity. The right people do not call it too much; they call it depth.',
    career: 'Put your name on the work this year. Artistry presented confidently becomes income — price it like you mean it.',
    wellbeing: 'Your energy mirrors your surroundings more than most. Curate people and rooms ruthlessly, and let home be genuinely soft.',
  },
  monkey: {
    theme:
      'The Goat’s sincerity disarms your usual tricks, Monkey — 2027 rewards the direct approach in a way that surprises you. What you build honestly this year outlasts three clever shortcuts, and people can tell the difference.',
    love: 'Drop the performance for one person. Someone is trying to love the unedited version of you, and it is going better than you think.',
    career: 'Mentoring and teaching surface your best skills this year and open doors your résumé could not. Share the trick; keep the timing.',
    wellbeing: 'Boredom is your warning light. Vary the routine before you vary the commitments — new routes, not new lives.',
  },
  rooster: {
    theme:
      'A year of craft, Rooster. The Goat values exactly the care and finish you bring, so your standards stop being “too much” and start being the whole point. Work you touch in 2027 gets admired for the details nobody else noticed.',
    love: 'Let someone see the unpolished morning version of you. Intimacy lives there, not in the presentation.',
    career: 'Quality-focused work — editing, design, inspection, detail roles of every kind — shines. Your corrections are the product; invoice them proudly.',
    wellbeing: 'Schedule rest like an appointment, in ink. If you do not, your body will schedule it for you, at its own convenience.',
  },
  dog: {
    theme:
      'Goat and Dog share a gentle, home-loving frequency, and 2027 softens your vigilance enough to let you actually enjoy the people you usually just protect. The year asks less guarding and more gathering.',
    love: 'Loyalty gets returned in kind this year — visibly, repeatedly. Practise receiving it without immediately looking for the catch.',
    career: 'Community, care and service work carries both meaning and momentum. The team you steady becomes the reference you are known by.',
    wellbeing: 'Worry less by writing it down. Not every fear needs a night shift, and not every watch is yours to stand.',
  },
  pig: {
    theme:
      'Pig and Goat are trine allies, which makes 2027 one of your most harmonious years in the cycle — rich in friendship, food, art and uncomplicated affection. The discipline this year is simply to enjoy it without auditing it.',
    love: 'Romance feels easy in the best way. Shared pleasures — tables, trips, music — build the bond faster than serious talks.',
    career: 'Hospitality, food, beauty and people businesses flourish. Generosity returns with interest, but keep one honest ledger anyway.',
    wellbeing: 'Pleasure is medicine for you this year, in genuine moderation. Your body keeps every celebration; let it keep good ones.',
  },
};

export function getOutlook2027(slug: string): AnimalOutlook2027 | undefined {
  return OUTLOOKS_2027[slug.toLowerCase()];
}

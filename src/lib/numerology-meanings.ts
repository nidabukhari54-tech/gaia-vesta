// Original interpretation content for the numerology tools.

export type NumberMeaning = {
  number: number;
  title: string;
  keywords: string[];
  description: string;
  strengths: string[];
  challenges: string[];
  love: string;
  career: string;
};

export const LIFE_PATH_MEANINGS: Record<number, NumberMeaning> = {
  1: {
    number: 1, title: 'The Independent Leader',
    keywords: ['Leadership', 'Originality', 'Drive'],
    description: 'You are here to lead, initiate, and stand on your own two feet. Life keeps handing you situations where nobody else will go first — because going first is your lesson and your gift.',
    strengths: ['Self-reliant', 'Pioneering', 'Determined'],
    challenges: ['Stubbornness', 'Impatience', 'Going it alone too long'],
    love: 'You need a partner who respects your independence and is not threatened by your ambition.',
    career: 'Entrepreneur, founder, manager, inventor, freelancer — anywhere you can be first or in charge.',
  },
  2: {
    number: 2, title: 'The Diplomatic Peacemaker',
    keywords: ['Harmony', 'Intuition', 'Partnership'],
    description: 'You are here to connect, mediate, and feel what others cannot say out loud. Your sensitivity is not a weakness — it is a radar most people never develop.',
    strengths: ['Empathic', 'Patient', 'Tactful'],
    challenges: ['Over-sensitivity', 'Indecision', 'Putting others first always'],
    love: 'Partnership is your natural home. You thrive with emotional honesty and gentle communication.',
    career: 'Counsellor, mediator, healer, diplomat, teacher — roles built on trust and understanding.',
  },
  3: {
    number: 3, title: 'The Creative Communicator',
    keywords: ['Expression', 'Joy', 'Creativity'],
    description: 'You are here to express — through words, art, humour, or sheer presence. When you create, you heal; when you go silent, life feels grey.',
    strengths: ['Expressive', 'Optimistic', 'Charismatic'],
    challenges: ['Scattered focus', 'Avoiding depth', 'Mood swings'],
    love: 'You fall for minds and laughter. You need playfulness and conversation as much as romance.',
    career: 'Writer, artist, performer, marketer, teacher — anywhere your voice is the product.',
  },
  4: {
    number: 4, title: 'The Master Builder',
    keywords: ['Stability', 'Craft', 'Endurance'],
    description: 'You are here to build things that last — systems, homes, businesses, families. Slow and solid beats fast and flashy in your world, every time.',
    strengths: ['Reliable', 'Methodical', 'Hard-working'],
    challenges: ['Rigidity', 'Overwork', 'Resistance to change'],
    love: 'You love through loyalty and showing up. Grand gestures matter less to you than consistency.',
    career: 'Engineer, architect, craftsperson, operations, finance — work where quality compounds.',
  },
  5: {
    number: 5, title: 'The Freedom Seeker',
    keywords: ['Change', 'Experience', 'Movement'],
    description: 'You are here to experience life in full variety — places, people, ideas, sensations. Routine slowly suffocates you; growth comes through change you choose, not change that ambushes you.',
    strengths: ['Adaptable', 'Curious', 'Magnetic'],
    challenges: ['Restlessness', 'Excess', 'Commitment fear'],
    love: 'You need space inside togetherness. The right partner is an adventure companion, not a cage.',
    career: 'Travel, media, sales, events, hospitality — work with movement, people, and novelty.',
  },
  6: {
    number: 6, title: 'The Nurturing Guardian',
    keywords: ['Responsibility', 'Home', 'Devotion'],
    description: 'You are here to care — for family, community, and the people who land in your orbit. Your lesson is balance: giving without keeping score, and receiving without guilt.',
    strengths: ['Warm', 'Responsible', 'Protective'],
    challenges: ['Perfectionism', 'Martyr tendencies', 'Meddling'],
    love: 'Home and commitment are sacred to you. You build love like a house — brick by brick.',
    career: 'Healthcare, education, design, hospitality, family business — work that serves and beautifies.',
  },
  7: {
    number: 7, title: 'The Seeker of Truth',
    keywords: ['Wisdom', 'Analysis', 'Spirit'],
    description: 'You are here to understand — how things work, why people are as they are, what lies beneath the surface. Solitude recharges you; shallow small talk drains you.',
    strengths: ['Analytical', 'Intuitive', 'Deep'],
    challenges: ['Isolation', 'Scepticism', 'Overthinking'],
    love: 'You open slowly but completely. Intellectual and spiritual connection matters more than drama.',
    career: 'Research, technology, science, spirituality, writing — work that rewards depth.',
  },
  8: {
    number: 8, title: 'The Powerhouse',
    keywords: ['Abundance', 'Authority', 'Achievement'],
    description: 'You are here to master the material world — money, power, and results — without letting them master you. Your life tends to swing between feast and famine until you find your balance point.',
    strengths: ['Ambitious', 'Resilient', 'Business-minded'],
    challenges: ['Workaholism', 'Control issues', 'Defining worth by wealth'],
    love: 'You respect strength and competence in a partner, and you show love by providing and protecting.',
    career: 'Business, finance, real estate, leadership — anywhere results are measured and rewarded.',
  },
  9: {
    number: 9, title: 'The Compassionate Humanitarian',
    keywords: ['Compassion', 'Completion', 'Idealism'],
    description: 'You carry a piece of every other number, and your path is to turn experience into wisdom and wisdom into service. Letting go — of people, grudges, chapters — is your recurring exam.',
    strengths: ['Wise', 'Generous', 'Artistic'],
    challenges: ['Boundary issues', 'Melancholy', 'Holding on too long'],
    love: 'You love widely and deeply, and must learn that not every soul you meet is yours to save.',
    career: 'Healing, arts, charity, teaching, law — work with meaning beyond the pay cheque.',
  },
  11: {
    number: 11, title: 'The Illuminated Intuitive (Master Number)',
    keywords: ['Inspiration', 'Intuition', 'Intensity'],
    description: 'A master number: the 2\'s sensitivity amplified into spiritual voltage. You are here to inspire — your intuition arrives like lightning, and your nervous system pays the price when you ignore it.',
    strengths: ['Highly intuitive', 'Inspiring', 'Visionary'],
    challenges: ['Anxiety', 'Intensity overload', 'Self-doubt'],
    love: 'You crave a soul-level bond. Ordinary relationships feel like static; you hold out for resonance.',
    career: 'Healer, artist, coach, spiritual teacher, innovator — work that channels insight to others.',
  },
  22: {
    number: 22, title: 'The Master Builder (Master Number)',
    keywords: ['Vision at scale', 'Legacy', 'Discipline'],
    description: 'The most powerful number in numerology: the 4\'s craft fused with an 11-grade vision. You are here to turn impossible plans into institutions, structures, and movements that outlive you.',
    strengths: ['Visionary', 'Capable', 'Enduring'],
    challenges: ['Crushing self-pressure', 'Fear of failure', 'All-or-nothing thinking'],
    love: 'You need a partner who believes in the mission and can hold the home front while you build.',
    career: 'Founder, architect of systems, reformer, producer — big visions made practical.',
  },
  33: {
    number: 33, title: 'The Master Teacher (Master Number)',
    keywords: ['Healing', 'Devotion', 'Uplift'],
    description: 'The 6 raised to master level: your life bends toward healing and uplifting others at scale. The trap is sacrificing yourself entirely; the path is service with boundaries.',
    strengths: ['Deeply compassionate', 'Healing presence', 'Selfless'],
    challenges: ['Self-neglect', 'Saviour complex', 'Emotional overload'],
    love: 'Love is your spiritual practice. You need a partner who gives back as fully as you give.',
    career: 'Teacher, healer, humanitarian leader, artist — work that raises people up.',
  },
};

export function lifePathMeaning(n: number): NumberMeaning {
  return LIFE_PATH_MEANINGS[n] ?? LIFE_PATH_MEANINGS[reduceKey(n)];
}

function reduceKey(n: number): number {
  let x = n;
  while (x > 9) x = String(x).split('').reduce((a, d) => a + Number(d), 0);
  return x;
}

// ---------- Personal Year ----------

export type PersonalYearMeaning = {
  year: number;
  theme: string;
  description: string;
  focus: string;
  avoid: string;
};

export const PERSONAL_YEAR_MEANINGS: Record<number, PersonalYearMeaning> = {
  1: { year: 1, theme: 'New Beginnings', description: 'A fresh 9-year cycle opens. Seeds planted now shape the next decade, so choose them deliberately — this is a year for starting, not finishing.', focus: 'Launch, decide, claim your direction.', avoid: 'Waiting for permission or perfect timing.' },
  2: { year: 2, theme: 'Patience & Partnership', description: 'The seeds of last year need quiet tending. Relationships, diplomacy, and emotional intelligence take centre stage; forcing outcomes backfires.', focus: 'Cooperate, listen, nurture key bonds.', avoid: 'Ultimatums and rushed decisions.' },
  3: { year: 3, theme: 'Expression & Joy', description: 'A lighter, social year. Your voice wants an audience — write, speak, create, celebrate. Visibility grows when you let yourself be seen.', focus: 'Create, socialise, market yourself.', avoid: 'Scattering energy across ten projects at once.' },
  4: { year: 4, theme: 'Work & Foundations', description: 'The builder\'s year. Systems, health, money habits, and home all ask for honest repair. Unglamorous effort now buys freedom later.', focus: 'Organise, budget, build routines.', avoid: 'Shortcuts and skipping the boring steps.' },
  5: { year: 5, theme: 'Change & Freedom', description: 'The pivot year of the cycle. Expect movement — travel, role changes, surprises. Flexibility is your superpower; clinging is your trap.', focus: 'Experiment, travel, adapt fast.', avoid: 'Signing away your freedom impulsively.' },
  6: { year: 6, theme: 'Home & Responsibility', description: 'Family, home, and commitments deepen. It is a year for weddings, repairs, care — and for learning which duties are truly yours.', focus: 'Commit wisely, beautify your home, show up.', avoid: 'Carrying everyone else\'s load alone.' },
  7: { year: 7, theme: 'Reflection & Study', description: 'A sabbath year in the cycle. Rest, research, and inner work pay more than hustle. Answers arrive in quiet, not in noise.', focus: 'Study, retreat, review your direction.', avoid: 'Forcing big launches or ignoring fatigue.' },
  8: { year: 8, theme: 'Power & Abundance', description: 'The harvest-and-ambition year. Money, career, and authority move — ask for the raise, sign the deal, step into visibility.', focus: 'Negotiate, invest in yourself, lead.', avoid: 'Playing small or letting money fears decide.' },
  9: { year: 9, theme: 'Completion & Release', description: 'The cycle closes. Finish, forgive, clear out. What you release this year makes room for the brand-new cycle that starts next year.', focus: 'Complete projects, declutter, give back.', avoid: 'Starting major new commitments or clinging to the past.' },
};

// ---------- Name numbers (Expression / Soul Urge / Personality) ----------

export const NAME_NUMBER_TITLES: Record<number, string> = {
  1: 'The Pioneer', 2: 'The Harmoniser', 3: 'The Expressive', 4: 'The Builder',
  5: 'The Adventurer', 6: 'The Caretaker', 7: 'The Thinker', 8: 'The Achiever',
  9: 'The Humanitarian', 11: 'The Intuitive (Master)', 22: 'The Visionary Builder (Master)',
  33: 'The Healer-Teacher (Master)',
};

export function nameNumberBlurb(kind: 'expression' | 'soulUrge' | 'personality', n: number): string {
  const base = LIFE_PATH_MEANINGS[n] ?? LIFE_PATH_MEANINGS[reduceKey(n)];
  if (kind === 'expression') {
    return `Your Expression number shows your natural talents and life direction. As ${base.title.replace(' (Master Number)', '')}, ${base.description.charAt(0).toLowerCase()}${base.description.slice(1)}`;
  }
  if (kind === 'soulUrge') {
    return `Your Soul Urge reveals what your heart secretly wants, beneath roles and duties. With a ${n} heart, ${base.love.charAt(0).toLowerCase()}${base.love.slice(1)}`;
  }
  return `Your Personality number is the face the world meets first. With ${n} energy, people sense someone ${base.keywords.join(', ').toLowerCase()} before they know the real you.`;
}

// ---------- Angel numbers ----------

export type AngelMeaning = {
  number: string;
  title: string;
  meaning: string;
  love: string;
  money: string;
};

export const ANGEL_NUMBERS: Record<string, AngelMeaning> = {
  '111': { number: '111', title: 'The Wake-Up Call', meaning: 'Your thoughts are manifesting unusually fast right now. 111 asks you to aim them deliberately — think about what you want, not what you fear.', love: 'A new chapter in love begins; be honest about what you truly want.', money: 'A fresh opportunity is near — act on the idea you keep postponing.' },
  '222': { number: '222', title: 'Trust the Process', meaning: 'Balance and patience. 222 appears when things are aligning behind the scenes — your job is to stay steady and not force the outcome.', love: 'Partnership energy is strong; harmony grows through gentle communication.', money: 'Cooperation pays better than solo effort right now.' },
  '333': { number: '333', title: 'Expression & Support', meaning: 'You are supported. 333 encourages you to speak your truth and use your creative gifts — guidance is closer than you think.', love: 'Say the thing you have been holding back, kindly and clearly.', money: 'Your voice and ideas are the asset — put them in front of people.' },
  '444': { number: '444', title: 'Protection & Foundations', meaning: 'The builders\' number. 444 signals protection and steady progress — the unglamorous work you are doing is laying a foundation that will hold.', love: 'Stability is sexy now; reliability deepens a bond more than drama.', money: 'Keep building. Systems and savings beat speculation.' },
  '555': { number: '555', title: 'Big Change Incoming', meaning: 'Change is not coming — it is here. 555 marks a turning point; resistance makes it harder, curiosity makes it an adventure.', love: 'An old pattern in love is ready to break. Let it.', money: 'A pivot can upgrade your income — stay flexible.' },
  '666': { number: '666', title: 'Rebalance Your Thoughts', meaning: 'Not a bad omen — a mirror. 666 asks you to soften fear-based thinking and rebalance the material with the spiritual.', love: 'Release control and suspicion; nurture without keeping score.', money: 'Worry about money is louder than the reality. Check facts, then breathe.' },
  '777': { number: '777', title: 'Luck & Inner Wisdom', meaning: 'The mystic\'s number. 777 signals spiritual growth and a streak of quiet luck — study, rest, and trust your intuition over noise.', love: 'Soul-level connection deepens when you share your inner world.', money: 'A studied decision beats a gamble — but fortune favours you now.' },
  '888': { number: '888', title: 'Abundance Flow', meaning: 'The infinity loop doubled. 888 is tied to financial flow and karmic reward — effort from the past starts paying out.', love: 'Give and receive in equal measure; generosity returns multiplied.', money: 'One of the strongest money signs: expect movement — receivables, offers, growth.' },
  '999': { number: '999', title: 'Completion & Release', meaning: 'A chapter is complete. 999 asks you to close it with gratitude — the next cycle cannot start while you hold the old one open.', love: 'Release an old story about love; forgiveness sets both sides free.', money: 'End an unprofitable commitment to make room for a better one.' },
  '1111': { number: '1111', title: 'The Portal', meaning: 'The most famous angel number of all: a doorway moment. 1111 is a snapshot of alignment — make the wish, set the intention, take the first step.', love: 'Twin-flame energy and instant recognition are associated with 1111.', money: 'A portal opens around an idea — start it now, refine it later.' },
  '1212': { number: '1212', title: 'Step by Step', meaning: 'Growth in sequence. 1212 says your goal is reached by steady steps, not one leap — stay out of your comfort zone a little longer.', love: 'Love grows through small consistent acts, not grand gestures.', money: 'Compound effort wins; keep the rhythm going.' },
  '1234': { number: '1234', title: 'Simplification', meaning: 'The staircase number. 1234 points to progress through order: declutter your space, your schedule, and your mind, one step at a time.', love: 'Clear the air and simplify expectations — love breathes easier.', money: 'Streamline expenses and processes; simplicity scales.' },
  '1010': { number: '1010', title: 'Awakening & Momentum', meaning: 'Beginnings with wisdom. 1010 combines a fresh start (1) with infinite potential (0) — you are being nudged to level up consciously.', love: 'A relationship evolves to a new level — or a new one begins at a higher standard.', money: 'Invest in skills; your next level needs new tools.' },
  '911': { number: '911', title: 'The Lightworker Call', meaning: 'An urgent nudge from the universe: stop delaying the thing your soul keeps mentioning. 911 pairs endings (9) with bold beginnings (11).', love: 'Choose the love that matches who you are becoming.', money: 'Your purpose and your income want to be the same road.' },
  '711': { number: '711', title: 'Intuition Confirmed', meaning: 'Luck meets intuition. 711 appears when your inner knowing is accurate — that quiet feeling is data, not imagination.', love: 'Trust your read on someone; it is sharper than usual.', money: 'A hunch about an opportunity deserves one small real-world test.' },
  '311': { number: '311', title: 'Create It Now', meaning: 'Creative energy with a starting gun. 311 says the idea is ready and so are you — joy is the strategy, not the reward.', love: 'Playfulness rekindles attraction; plan something fun.', money: 'Create the offer, post, or product — visibility is the bottleneck.' },
  '000': { number: '000', title: 'The Blank Slate', meaning: 'Wholeness and reset. 000 is the universe\'s pause button — a reminder that you are one with the source and a new cycle can begin from zero.', love: 'Start the relationship conversation from a clean page.', money: 'A reset of money habits can start today, from exactly where you are.' },
};

export const ANGEL_NUMBER_LIST = Object.keys(ANGEL_NUMBERS);

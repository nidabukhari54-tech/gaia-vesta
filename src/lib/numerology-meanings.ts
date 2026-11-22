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
  love: string;
  money: string;
};

export const PERSONAL_YEAR_MEANINGS: Record<number, PersonalYearMeaning> = {
  1: { year: 1, theme: 'New Beginnings', description: 'A fresh 9-year cycle opens. Seeds planted now shape the next decade, so choose them deliberately — this is a year for starting, not finishing.', focus: 'Launch, decide, claim your direction.', avoid: 'Waiting for permission or perfect timing.' , love: 'New sparks and fresh starts in love. If you are single, a 1 year favours meeting someone through action — a new class, project or place. Couples do well beginning a new chapter together rather than re-running the old one.', money: 'A seed-planting year for income: start the venture, apply for the role, set the direction. Returns are modest at first but compound through the cycle — spend on tools and skills, not display.' },
  2: { year: 2, theme: 'Patience & Partnership', description: 'The seeds of last year need quiet tending. Relationships, diplomacy, and emotional intelligence take centre stage; forcing outcomes backfires.', focus: 'Cooperate, listen, nurture key bonds.', avoid: 'Ultimatums and rushed decisions.' , love: 'A tender, relationship-centred year. Patience, listening and small kindnesses deepen a bond more than grand gestures; rushed ultimatums tend to backfire.', money: 'Slow, steady finances. Partnerships, contracts and cooperation matter more than bold moves, and lending money on impulse is the classic 2-year trap.' },
  3: { year: 3, theme: 'Expression & Joy', description: 'A lighter, social year. Your voice wants an audience — write, speak, create, celebrate. Visibility grows when you let yourself be seen.', focus: 'Create, socialise, market yourself.', avoid: 'Scattering energy across ten projects at once.' , love: 'Social, playful, flirtatious energy. Joy and honest conversation revive a connection; scattered attention and mixed signals are the shadow side.', money: 'Income grows through creativity, voice and visibility — writing, speaking, selling your ideas. Watch celebration spending that outruns earnings.' },
  4: { year: 4, theme: 'Work & Foundations', description: 'The builder\'s year. Systems, health, money habits, and home all ask for honest repair. Unglamorous effort now buys freedom later.', focus: 'Organise, budget, build routines.', avoid: 'Shortcuts and skipping the boring steps.' , love: 'Love gets practical: commitment, shared plans and building a home base together — or honest repair of what has been neglected. Reliability is romance this year.', money: 'Budget, organise, pay down debt. The unglamorous systems you build this year — savings, routines, records — quietly create next year\'s freedom.' },
  5: { year: 5, theme: 'Change & Freedom', description: 'The pivot year of the cycle. Expect movement — travel, role changes, surprises. Flexibility is your superpower; clinging is your trap.', focus: 'Experiment, travel, adapt fast.', avoid: 'Signing away your freedom impulsively.' , love: 'A restless heart. Travel, novelty and shared adventures revive a bond; singles often meet someone far from their usual routine. Freedom inside togetherness is the negotiation.', money: 'Variable income and surprise expenses are both possible. Keep a buffer, diversify how you earn, and read the fine print before signing away your flexibility.' },
  6: { year: 6, theme: 'Home & Responsibility', description: 'Family, home, and commitments deepen. It is a year for weddings, repairs, care — and for learning which duties are truly yours.', focus: 'Commit wisely, beautify your home, show up.', avoid: 'Carrying everyone else\'s load alone.' , love: 'The commitment year of the cycle — engagements, weddings, growing families, or a conscious, caring parting. Home is where the year\'s real work happens.', money: 'Money flows toward home and family: repairs, shared security, supporting loved ones. Invest in your living space rather than speculation.' },
  7: { year: 7, theme: 'Reflection & Study', description: 'A sabbath year in the cycle. Rest, research, and inner work pay more than hustle. Answers arrive in quiet, not in noise.', focus: 'Study, retreat, review your direction.', avoid: 'Forcing big launches or ignoring fatigue.' , love: 'A quieter year for love — depth over drama. You may need more solitude than usual; say that plainly instead of withdrawing in silence and letting a partner guess.', money: 'A review year for money: research before any commitment, audit subscriptions and debts, and let launches wait. Study counts as progress.' },
  8: { year: 8, theme: 'Power & Abundance', description: 'The harvest-and-ambition year. Money, career, and authority move — ask for the raise, sign the deal, step into visibility.', focus: 'Negotiate, invest in yourself, lead.', avoid: 'Playing small or letting money fears decide.' , love: 'Magnetism and ambition run high, and love can feel like a power partnership. Be honest about priorities and control inside the relationship.', money: 'The harvest year of the cycle: negotiate, launch, invest in yourself and step into visibility. Effort tends to be rewarded — but ruthless shortcuts carry a delayed price.' },
  9: { year: 9, theme: 'Completion & Release', description: 'The cycle closes. Finish, forgive, clear out. What you release this year makes room for the brand-new cycle that starts next year.', focus: 'Complete projects, declutter, give back.', avoid: 'Starting major new commitments or clinging to the past.' , love: 'A year of forgiveness and release. Old relationships may close with grace, and unfinished emotional business asks to be completed so the next cycle begins clean.', money: 'Tie up loose ends: settle debts, finish contracts, close unprofitable commitments. Generosity returns in kind; major new ventures are better seeded next year.' },
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
  spiritual: string;
  seeing: string;
};

export const ANGEL_NUMBERS: Record<string, AngelMeaning> = {
  '111': { number: '111', title: 'The Wake-Up Call', meaning: 'Your thoughts are manifesting unusually fast right now. 111 asks you to aim them deliberately — think about what you want, not what you fear.', love: 'A new chapter in love begins; be honest about what you truly want.', money: 'A fresh opportunity is near — act on the idea you keep postponing.' , spiritual: 'Spiritually, 111 is a doorway number — a reminder that your inner state and your outer life are mirroring each other unusually closely right now.', seeing: 'When 111 keeps appearing, pause and notice what you were just thinking. Treat it as a prompt to choose that thought deliberately: write the goal down, take the first small step, and stop rehearsing the fear version.' },
  '222': { number: '222', title: 'Trust the Process', meaning: 'Balance and patience. 222 appears when things are aligning behind the scenes — your job is to stay steady and not force the outcome.', love: 'Partnership energy is strong; harmony grows through gentle communication.', money: 'Cooperation pays better than solo effort right now.' , spiritual: 'Spiritually, 222 is the number of faith in the unseen — the part of the journey where the work happens underground, like roots before a sprout.', seeing: 'Seeing 222 repeatedly is traditionally read as \'do not force it\'. Check your balance — work and rest, giving and receiving — and let one pending thing resolve in its own timing while you tend what is already in your hands.' },
  '333': { number: '333', title: 'Expression & Support', meaning: 'You are supported. 333 encourages you to speak your truth and use your creative gifts — guidance is closer than you think.', love: 'Say the thing you have been holding back, kindly and clearly.', money: 'Your voice and ideas are the asset — put them in front of people.' , spiritual: 'Spiritually, 333 is linked with guidance close at hand and the mind–body–spirit triad — a nudge that your inner life wants equal airtime with your outer one.', seeing: 'When 333 follows you around, say the unsaid thing: send the message, start the page, book the conversation. It is also a cue to ask for help — support tends to be nearer than you assume.' },
  '444': { number: '444', title: 'Protection & Foundations', meaning: 'The builders\' number. 444 signals protection and steady progress — the unglamorous work you are doing is laying a foundation that will hold.', love: 'Stability is sexy now; reliability deepens a bond more than drama.', money: 'Keep building. Systems and savings beat speculation.' , spiritual: 'Spiritually, 444 is the number of the four directions and the four elements — grounded protection, the sense of being held while you build.', seeing: 'Keep seeing 444? Keep building. It tends to appear mid-effort, when results are not visible yet. Review your foundations — sleep, savings, systems — and repair one small crack instead of starting something new.' },
  '555': { number: '555', title: 'Big Change Incoming', meaning: 'Change is not coming — it is here. 555 marks a turning point; resistance makes it harder, curiosity makes it an adventure.', love: 'An old pattern in love is ready to break. Let it.', money: 'A pivot can upgrade your income — stay flexible.' , spiritual: 'Spiritually, 555 is the number of the winds changing — the deeper self asking for a bigger, truer shape of life, even before the mind has a plan.', seeing: 'When 555 repeats, name the change you have been avoiding. Loosen one fixed plan, say yes to one unfamiliar door, and expect the in-between phase to feel untidy before it feels free.' },
  '666': { number: '666', title: 'Rebalance Your Thoughts', meaning: 'Not a bad omen — a mirror. 666 asks you to soften fear-based thinking and rebalance the material with the spiritual.', love: 'Release control and suspicion; nurture without keeping score.', money: 'Worry about money is louder than the reality. Check facts, then breathe.' , spiritual: 'Spiritually, 666 is a call back to balance between the material and the inner life — not a warning of evil, but of attention spent too long on worry.', seeing: 'If 666 keeps catching your eye, audit your thoughts for a day: how much is fear, how much is fact? Rebalance one practical thing (a budget, a schedule, screen time) and one nourishing thing (rest, prayer, time in nature).' },
  '777': { number: '777', title: 'Luck & Inner Wisdom', meaning: 'The mystic\'s number. 777 signals spiritual growth and a streak of quiet luck — study, rest, and trust your intuition over noise.', love: 'Soul-level connection deepens when you share your inner world.', money: 'A studied decision beats a gamble — but fortune favours you now.' , spiritual: 'Spiritually, 777 is the mystic\'s number — study, contemplation, and the quiet luck that follows inner alignment rather than effort.', seeing: 'Seeing 777 often is read as a confirmation: your intuition about a situation is accurate. Protect some silence this week, study the question instead of polling opinions, and let one decision come from the gut.' },
  '888': { number: '888', title: 'Abundance Flow', meaning: 'The infinity loop doubled. 888 is tied to financial flow and karmic reward — effort from the past starts paying out.', love: 'Give and receive in equal measure; generosity returns multiplied.', money: 'One of the strongest money signs: expect movement — receivables, offers, growth.' , spiritual: 'Spiritually, 888 mirrors the infinity symbol — the teaching that what you circulate with an open hand tends to return through other doors.', seeing: 'When 888 repeats, look at your flow: invoices to send, gratitude to express, a price to stop undercharging. It is traditionally a green light for receiving — and a reminder to close loops cleanly.' },
  '999': { number: '999', title: 'Completion & Release', meaning: 'A chapter is complete. 999 asks you to close it with gratitude — the next cycle cannot start while you hold the old one open.', love: 'Release an old story about love; forgiveness sets both sides free.', money: 'End an unprofitable commitment to make room for a better one.' , spiritual: 'Spiritually, 999 is the number of the completed lesson — compassion learned, a cycle integrated, the soul ready to travel lighter.', seeing: 'Keep seeing 999? Something is finished, even if nobody has announced it. Declutter one space, forgive one debt — owed to you or by you — and resist reopening a door you already know is closed.' },
  '1111': { number: '1111', title: 'The Portal', meaning: 'The most famous angel number of all: a doorway moment. 1111 is a snapshot of alignment — make the wish, set the intention, take the first step.', love: 'Twin-flame energy and instant recognition are associated with 1111.', money: 'A portal opens around an idea — start it now, refine it later.' , spiritual: 'Spiritually, 1111 is read as a moment of alignment between thought, soul and circumstance — a snapshot of the veil at its thinnest.', seeing: 'When 1111 keeps appearing, treat the moment as a marker: stop, breathe, and state clearly — aloud or in writing — what you are calling in. Then take one physical step toward it the same day.' },
  '1212': { number: '1212', title: 'Step by Step', meaning: 'Growth in sequence. 1212 says your goal is reached by steady steps, not one leap — stay out of your comfort zone a little longer.', love: 'Love grows through small consistent acts, not grand gestures.', money: 'Compound effort wins; keep the rhythm going.' , spiritual: 'Spiritually, 1212 blends beginnings (1) with harmony (2), twice over — growth that asks for both courage and balance, in alternating steps.', seeing: 'Seeing 1212 repeatedly suggests your next level is built in sequence, not in a leap. Identify the very next step — only that one — and do it before looking further up the staircase.' },
  '1234': { number: '1234', title: 'Simplification', meaning: 'The staircase number. 1234 points to progress through order: declutter your space, your schedule, and your mind, one step at a time.', love: 'Clear the air and simplify expectations — love breathes easier.', money: 'Streamline expenses and processes; simplicity scales.' , spiritual: 'Spiritually, 1234 is the staircase made visible — the teaching that growth, like everything else, is climbed one honest step at a time.', seeing: 'When 1234 follows you, simplify. Clear one drawer, one debt, one obligation. Progress right now is measured in things removed, not things added.' },
  '1010': { number: '1010', title: 'Awakening & Momentum', meaning: 'Beginnings with wisdom. 1010 combines a fresh start (1) with infinite potential (0) — you are being nudged to level up consciously.', love: 'A relationship evolves to a new level — or a new one begins at a higher standard.', money: 'Invest in skills; your next level needs new tools.' , spiritual: 'Spiritually, 1010 joins the spark of beginning (1) with the whole, open circle of potential (0) — awakening with room to grow into it.', seeing: 'Keep seeing 1010? You are likely between versions of yourself. Invest in the new one — a course, a practice, a space of your own — and let one old habit quietly lapse.' },
  '911': { number: '911', title: 'The Lightworker Call', meaning: 'An urgent nudge from the universe: stop delaying the thing your soul keeps mentioning. 911 pairs endings (9) with bold beginnings (11).', love: 'Choose the love that matches who you are becoming.', money: 'Your purpose and your income want to be the same road.' , spiritual: 'Spiritually, 911 pairs the humanitarian 9 with the master spark of 11 — a call to aim your gifts at something beyond yourself.', seeing: 'When 911 repeats, the delay is the message: the thing your soul keeps mentioning — the course, the move, the honest conversation — is ready to be acted on, not analysed further.' },
  '711': { number: '711', title: 'Intuition Confirmed', meaning: 'Luck meets intuition. 711 appears when your inner knowing is accurate — that quiet feeling is data, not imagination.', love: 'Trust your read on someone; it is sharper than usual.', money: 'A hunch about an opportunity deserves one small real-world test.' , spiritual: 'Spiritually, 711 joins the seeker (7) with a doubled spark of beginning (11) — intuition not as a whisper but as a headline.', seeing: 'Seeing 711 often is read as confirmation of a hunch. Give it one small, real test — a call, a draft, a visit — and let reality, not anxiety, deliver the verdict.' },
  '311': { number: '311', title: 'Create It Now', meaning: 'Creative energy with a starting gun. 311 says the idea is ready and so are you — joy is the strategy, not the reward.', love: 'Playfulness rekindles attraction; plan something fun.', money: 'Create the offer, post, or product — visibility is the bottleneck.' , spiritual: 'Spiritually, 311 is creative fire with guidance behind it — the 3 of expression lit by the master 11.', seeing: 'When 311 keeps appearing, make the thing. Post it, send it, show it. Joy is the strategy here; polish can come after the first brave version exists.' },
  '000': { number: '000', title: 'The Blank Slate', meaning: 'Wholeness and reset. 000 is the universe\'s pause button — a reminder that you are one with the source and a new cycle can begin from zero.', love: 'Start the relationship conversation from a clean page.', money: 'A reset of money habits can start today, from exactly where you are.' , spiritual: 'Spiritually, 000 is the void and the whole at once — the pause before creation, and a reminder of your connection to the source of things.', seeing: 'Keep seeing 000? Begin from zero on purpose: a clean page, a cleared desk, a forgiven ledger. It tends to appear when a genuine reset — not an escape, a reset — is available to you.' },
};

export const ANGEL_NUMBER_LIST = Object.keys(ANGEL_NUMBERS);

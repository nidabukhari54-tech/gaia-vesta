// Daily horoscope — Gaia Vesta's own data and engine.
// No third-party APIs: sign profiles are standard tropical astrology reference
// content, and the daily guidance is generated deterministically from the sign
// and the local date, so every reader of a sign sees the same reading all day
// and a fresh one tomorrow. Guidance is written as reflection in the
// astrological tradition — never as a promise about outcomes.

import { moonPhase } from './numerology';

export type HoroscopeSign = {
  slug: string;
  name: string;
  glyph: string;
  dates: string;
  element: 'Fire' | 'Earth' | 'Air' | 'Water';
  ruler: string;
  traits: string[];
  strengths: string[];
  challenges: string[];
  loveStyle: string;
  careerStyle: string;
  description: string;
  start: [number, number]; // [month, day]
  end: [number, number];
  themes: string[]; // daily theme bank — first sentence works as a one-liner
};

export const SIGNS: HoroscopeSign[] = [
  {
    slug: 'aries',
    name: 'Aries',
    glyph: '♈',
    dates: 'Mar 21 – Apr 19',
    element: 'Fire',
    ruler: 'Mars',
    traits: ['Bold', 'Driven', 'Pioneering', 'Direct'],
    strengths: ['Courage to begin', 'Honest to a fault', 'Fast recovery from setbacks'],
    challenges: ['Impatience', 'Starting more than you finish', 'Heat-of-the-moment words'],
    loveStyle: 'You love at full speed — direct, generous and a little competitive. You need a partner who can match your energy without trying to tame it, and who understands that your bluntness is honesty, not cruelty.',
    careerStyle: 'You work best where initiative is rewarded: leading, building, competing, starting. Slow hierarchies and endless meetings drain you; clear goals and real stakes bring out your best.',
    description:
      'Aries is the first spark of the zodiac — the sign of beginnings, nerve and forward motion. Ruled by Mars, you carry more raw starting energy than any other sign, along with its classic trap: the launch is thrilling, the tenth week is not. Your growth edge is never courage; it is follow-through.',
    start: [3, 21],
    end: [4, 19],
    themes: [
      'Start the thing today, Aries — not perfectly, just started. Your energy is at its best in the first hour of a project, so give the important one your first hour. By evening you will be glad the ice is broken.',
      'A conversation you have been avoiding wants your honesty today. Say the true thing early and kindly, before impatience says it for you. People can work with your directness; it is the suspense that wears them down.',
      'Your body is asking for a contest today, even a small one. Move hard, compete at something, burn the restlessness off physically. A tired Aries is a patient Aries, and patience is what the afternoon will ask of you.',
      'Someone slower is not someone lesser today. The person moving at half your speed may be carrying the detail you would have missed. Borrow their thoroughness instead of resenting it, and the work lands properly.',
      'Money wants a decision you have been circling. Look at the numbers once, decide like the leader you are, and stop re-opening it. Your instinct on this one was right the first time.',
      'Today rewards the finisher, not the starter. Pick the open loop that has been nagging at you and close it before beginning anything new. The relief you feel tonight is the real prize.',
    ],
  },
  {
    slug: 'taurus',
    name: 'Taurus',
    glyph: '♉',
    dates: 'Apr 20 – May 20',
    element: 'Earth',
    ruler: 'Venus',
    traits: ['Steady', 'Sensual', 'Loyal', 'Patient'],
    strengths: ['Endurance', 'A gift for comfort and quality', 'Calm under pressure'],
    challenges: ['Resistance to change', 'Holding on too long', 'Comfort over growth'],
    loveStyle: 'You love slowly and completely — through presence, touch, good food and showing up every single day. You need loyalty you never have to audit, and you give a devotion few signs can match once you are sure.',
    careerStyle: 'You build value that lasts: crafts, finance, food, land, anything where quality compounds. You are not built for chaos or pivots-for-fun; given a stable field, you outlast everyone.',
    description:
      'Taurus is the zodiac\u2019s builder and gardener — ruled by Venus, grounded in Earth, fluent in the language of the senses. You turn effort into things that endure: savings, skills, homes, trust. Your lesson is rarely effort; it is knowing when holding on has quietly become standing still.',
    start: [4, 20],
    end: [5, 20],
    themes: [
      'Slow is not stuck today, Taurus. The steady pace you trust is doing more than the frantic pace around you — let results argue for you. Tend one thing well rather than five things anxiously.',
      'Your senses are the instrument today: good food, real rest, something beautiful within reach. You do not recharge by scrolling; you recharge by touching the physical world. Give yourself one genuinely pleasant hour.',
      'A change you have been resisting deserves a second, fairer look. Not every new thing is a threat to what you have built — some are additions, not replacements. Judge it by its merits, not by its newness.',
      'Money is behaving today if you let your own rules run: buy the quality version once, skip the cheap version three times. Your long game is working. Do not let one impatient moment spend what patience earned.',
      'Someone needs your calm today more than your advice. Sit with them, feed them, listen all the way to the end. Your steadiness is a form of love people remember for years.',
      'Finish the beautiful thing. There is a project that only needs your patience to become real — an hour of unhurried work today moves it further than a week of good intentions.',
    ],
  },
  {
    slug: 'gemini',
    name: 'Gemini',
    glyph: '♊',
    dates: 'May 21 – Jun 20',
    element: 'Air',
    ruler: 'Mercury',
    traits: ['Curious', 'Quick', 'Versatile', 'Witty'],
    strengths: ['A mind that connects anything to anything', 'Conversation as a superpower', 'Adaptability'],
    challenges: ['Scattered attention', 'Boredom with the middle of things', 'Saying more than you meant to'],
    loveStyle: 'You fall for minds first. You need conversation that never runs dry, laughter, and a partner who is also your favourite person to talk to — romance without friendship bores you within a month.',
    careerStyle: 'You thrive where information moves: media, teaching, writing, sales, technology, anything with variety built in. One desk, one task, one topic forever is your idea of a slow fade — you need range.',
    description:
      'Gemini is the zodiac\u2019s messenger — Mercury-ruled, quicksilver-bright, built to gather and connect. You hold two perspectives at once, which makes you the best devil\u2019s advocate and the worst keeper of a single routine. Your growth edge is depth: choosing which of your ten interests gets the full year.',
    start: [5, 21],
    end: [6, 20],
    themes: [
      'Your mind is fast today, Gemini — aim it at one target. The scattered version of you starts six things; the focused version finishes the one that matters. Write the priority down before the day writes it for you.',
      'A conversation today carries more than it seems to. Listen for the sentence underneath the sentence — someone is telling you something important in a casual voice. Ask the second question.',
      'Learn something small and real today. A short lesson, a chapter, a skill drill — your curiosity is hungry and it behaves better fed. Random facts count, but one useful skill counts double.',
      'Careful with the throwaway comment today. Your words travel further than you think, and one casual remark could be repeated in rooms you are not in. Keep the wit, check the payload.',
      'Two good options are pulling you in opposite directions. The tiebreaker is not which is better — it is which one you will still care about in three months. Choose that one and let the other go cleanly.',
      'Write it down today. The idea, the plan, the thing you keep meaning to say — it is evaporating because it only lives in your head. Ten minutes of writing turns weather into climate.',
    ],
  },
  {
    slug: 'cancer',
    name: 'Cancer',
    glyph: '♋',
    dates: 'Jun 21 – Jul 22',
    element: 'Water',
    ruler: 'Moon',
    traits: ['Protective', 'Intuitive', 'Deep-feeling', 'Tenacious'],
    strengths: ['Emotional radar', 'Fierce loyalty to your people', 'Memory for what matters'],
    challenges: ['Carrying moods that are not yours', 'Retreating instead of asking', 'Old wounds on repeat'],
    loveStyle: 'You love as shelter — you want to be someone\u2019s safe place and to have one of your own. You open slowly, test quietly, and once someone is inside the shell they are family in every way that counts.',
    careerStyle: 'You excel where care and memory matter: people, homes, food, history, health, anything with a human heartbeat. You work hardest for those who feel like your own, and you never forget how you were treated.',
    description:
      'Cancer is the zodiac\u2019s tide — ruled by the Moon, moving by feeling, remembering everything. Beneath the soft surface is one of the toughest signs in the zodiac: you endure, you protect, you provide. Your lesson is the boundary — caring for everyone else\u2019s weather while ignoring your own storm.',
    start: [6, 21],
    end: [7, 22],
    themes: [
      'Home is the headline today, Cancer. One small improvement to your space — cleared, mended, made beautiful — will steady your whole mood. Your environment is not decoration; it is your nervous system\u2019s address.',
      'You already know the answer your intuition gave you this morning. The hesitation is not confusion, it is tenderness — you do not want the answer to be true. Sit with it gently; it will still be there, and so will you.',
      'Feed someone today, including possibly yourself. Your love language is nourishment in every sense, and a shared meal will repair something that words have been circling for weeks.',
      'A memory is visiting today, not to haunt you but to hand you something. Let it finish its sentence before you decide what it means. There is a lesson in it you could not have heard the first time.',
      'Protect your energy like it is money, because it is. One draining obligation can be postponed without the world ending. Your people need the rested version of you, not the resentful one.',
      'Ask for the hug, the help, the hour off — out loud. Your people are not mind-readers, and your habit of coping silently reads as not needing anything. Let yourself be cared for at the level you care for others.',
    ],
  },
];

SIGNS.push(
  {
    slug: 'leo',
    name: 'Leo',
    glyph: '♌',
    dates: 'Jul 23 – Aug 22',
    element: 'Fire',
    ruler: 'Sun',
    traits: ['Radiant', 'Proud', 'Generous', 'Playful'],
    strengths: ['Natural warmth people gather around', 'Creative courage', 'Loyalty with theatre'],
    challenges: ['Pride before the fall', 'Needing the applause to feel real', 'Taking slights personally'],
    loveStyle: 'You love grandly and out loud — romance should feel like a celebration, not an arrangement. You need admiration that is genuine and a partner proud to stand beside you; in return you give devotion with both hands.',
    careerStyle: 'You are built for the visible roles: leading, performing, creating, representing. Work that hides you in a back room starves you; work with an audience — literal or figurative — feeds your best output.',
    description:
      'Leo is the zodiac\u2019s hearth-fire — ruled by the Sun itself, warm, visible and made to shine. Your generosity is real and so is your pride; the two wrestle in you constantly. Your growth edge is learning that your light does not dim when someone else\u2019s is lit — it was never a competition for oxygen.',
    start: [7, 23],
    end: [8, 22],
    themes: [
      'Dress like the day matters today, Leo, because for you it does. When you feel like the main character of your own life, you act like it — braver, kinder, more generous. The costume is not vanity; it is a switch.',
      'Praise someone else today, specifically and in public. Your spotlight is big enough to share, and watching you share it will teach the room what real confidence looks like. Generosity is your most attractive setting.',
      'A small slight is still echoing louder than it deserves. Ask whether it was truly about you — most carelessness is just other people\u2019s weather. Do not let a cloudy five minutes cancel a sunny day.',
      'Create the thing, do not just plan the premiere. Today\u2019s joy is in the making — the sketch, the draft, the rehearsal. The audience part will come; fall in love with the workshop hours first.',
      'Your heart wants play today, not productivity theatre. Schedule something purely fun and defend the appointment like a meeting with your most important client — because it is one.',
      'A loyal friend needs your warmth at full wattage today. Show up like you mean it. The people who have cheered for you longest should never have to wonder if you noticed.',
    ],
  },
  {
    slug: 'virgo',
    name: 'Virgo',
    glyph: '♍',
    dates: 'Aug 23 – Sep 22',
    element: 'Earth',
    ruler: 'Mercury',
    traits: ['Precise', 'Devoted', 'Analytical', 'Quietly funny'],
    strengths: ['Seeing the flaw before it becomes the failure', 'Craftsmanship', 'Help that actually helps'],
    challenges: ['Perfectionism dressed as standards', 'Self-criticism on loop', 'Fixing instead of resting'],
    loveStyle: 'You love in acts of service and attention to detail — you remember how they take their tea and what they said in March. You need a partner who notices the quiet devotion and never mistakes it for smallness.',
    careerStyle: 'You are the master of the craft layer: editing, systems, health, analysis, quality. Given a messy process you produce order; given trust, you produce work so clean it looks effortless — it is not.',
    description:
      'Virgo is the zodiac\u2019s craftsperson — Mercury-ruled Earth, devoted to the useful and the well-made. Your eye for what is wrong is a genuine gift; the wound is turning that eye on yourself at 2 a.m. Your lesson is the difference between excellent and perfect — one is a standard, the other is a cage.',
    start: [8, 23],
    end: [9, 22],
    themes: [
      'Fix the small annoying thing today, Virgo. The wobbly detail you keep stepping over is taxing you daily — twenty minutes ends the tax. Your peace is built out of exactly these repairs.',
      'Done is a respectable standard today. The version you are polishing for the fourth time is already better than most people\u2019s best — release it and let the real world give the feedback your imagination is inventing.',
      'Your body is a system too, and it has been sending polite error messages. Sleep, water, a walk, the appointment you keep postponing — treat one message as a ticket to close, not a flaw to judge.',
      'Help, but do not take over. Someone\u2019s imperfect attempt is their lesson, not your assignment. Offer the one useful tip, then let them own the rest — including the outcome.',
      'Sort one drawer, one folder, one corner of the budget. Order spreads from small cleared spaces like warmth from a stove. By tonight you will feel the room — and your head — breathe easier.',
      'Receive the compliment today without correcting it. When someone praises your work, "thank you" is the complete sentence. You are allowed to be appreciated at face value.',
    ],
  },
  {
    slug: 'libra',
    name: 'Libra',
    glyph: '♎',
    dates: 'Sep 23 – Oct 22',
    element: 'Air',
    ruler: 'Venus',
    traits: ['Graceful', 'Fair', 'Romantic', 'Diplomatic'],
    strengths: ['Seeing every side of the story', 'Taste and aesthetic instinct', 'Making peace without making it fake'],
    challenges: ['Deciding', 'People-pleasing past your own limits', 'Avoiding the necessary conflict'],
    loveStyle: 'You are the zodiac\u2019s romantic — partnership is your art form, and you do it beautifully when you do not disappear inside it. You need harmony with honesty: a partner who can disagree with you and stay kind.',
    careerStyle: 'You thrive in the relational professions: design, law, diplomacy, partnerships, anything where judgement and taste are the product. You work best with a counterpart — your thinking sharpens in dialogue.',
    description:
      'Libra is the zodiac\u2019s scales — Venus-ruled Air, built for balance, beauty and the fair hearing. You can hold two truths at once, which makes you wise and, on bad days, paralysed. Your growth edge is discovering that a decision made is worth more than a perfect decision imagined.',
    start: [9, 23],
    end: [10, 22],
    themes: [
      'Decide today, Libra — the coin has been spinning long enough. Either choice is workable; the unmade decision is the only one actually costing you. Pick, commit, and let relief do the rest.',
      'Beauty is not frivolous today; it is functional. Rearrange the desk, wear the good thing, put flowers where you can see them. Your mind genuinely works better in a harmonious room — that is data, not indulgence.',
      'A relationship needs one honest sentence today. You have been keeping the peace by editing yourself, and the edited version is starting to resent the cast. Say it kindly, say it once, let it land.',
      'Weigh the favour before you grant it. Your yes is generous, but today it is being asked of the part of you that is already tired. A graceful no now prevents an ungraceful collapse later.',
      'Pair up today. Your best thinking happens in conversation, so take the problem to the person whose mind complements yours. What is stuck alone will move in dialogue.',
      'Spend on the shared experience, not the solo treat. A meal, a ticket, an afternoon with your favourite person — connection is your currency today, and it pays interest immediately.',
    ],
  },
  {
    slug: 'scorpio',
    name: 'Scorpio',
    glyph: '♏',
    dates: 'Oct 23 – Nov 21',
    element: 'Water',
    ruler: 'Pluto',
    traits: ['Intense', 'Magnetic', 'Private', 'All-or-nothing'],
    strengths: ['X-ray honesty about motives', 'Total commitment once committed', 'Calm in a crisis'],
    challenges: ['Trust issued slowly and revoked permanently', 'Control as a love language', 'Keeping score in silence'],
    loveStyle: 'You do not do casual with your heart — love is a merger of souls or it is a waste of your intensity. You need absolute honesty and loyalty, and you offer a depth of devotion that can remake a person\u2019s life.',
    careerStyle: 'You excel where depth and stakes live: research, finance, psychology, investigation, strategy, anything hidden that needs uncovering. Surface-level busywork insults you; give you a real problem and you disappear into it happily.',
    description:
      'Scorpio is the zodiac\u2019s deep water — Pluto-ruled, still on the surface, fathomless underneath. You are the sign of transformation: you know how things end, what people hide, and what it costs to start again. Your lesson is trust — not blind, but brave enough to let someone see the unedited version.',
    start: [10, 23],
    end: [11, 21],
    themes: [
      'You already know what is really going on today, Scorpio. The question is whether to say it. Choose one person who has earned the unedited version and give them the truth — it will deepen something real.',
      'A secret you are keeping for someone else is costing you more than it costs them. You do not have to tell it — but you are allowed to hand the weight back. Loyalty does not require self-erasure.',
      'Put the intensity somewhere useful today: the hard workout, the deep work session, the honest journal page. Channelled, your force builds; unchannelled, it interrogates the people you love.',
      'Forgiveness is on the table today — not the performative kind, the private kind where you stop paying interest on an old debt. You do not have to announce it. Just notice the moment you feel lighter.',
      'Money and power want a clear-eyed look today. Read the fine print, ask the blunt question, check the account. Your detective instincts are sharp — point them at the paperwork before someone hopes you won\u2019t.',
      'Let someone in by one inch today. Not the whole archive — one true thing. Vulnerability at your pace is still vulnerability, and the right person will handle the inch like it matters, because it does.',
    ],
  },
);

SIGNS.push(
  {
    slug: 'sagittarius',
    name: 'Sagittarius',
    glyph: '♐',
    dates: 'Nov 22 – Dec 21',
    element: 'Fire',
    ruler: 'Jupiter',
    traits: ['Adventurous', 'Honest', 'Philosophical', 'Restless'],
    strengths: ['Seeing the big picture instantly', 'Optimism that survives evidence', 'Teaching by enthusiasm'],
    challenges: ['Promising more horizon than you can deliver', 'Bluntness at full gallop', 'Boredom with maintenance'],
    loveStyle: 'You love as adventure — you need a fellow traveller, not an anchor: someone to explore ideas, places and life itself with. Honesty is your love language, and freedom inside the bond is what makes you stay.',
    careerStyle: 'You thrive where horizons expand: travel, publishing, teaching, law, philosophy, entrepreneurship. Routine administration is your kryptonite; a mission with a map and a meaning is your fuel.',
    description:
      'Sagittarius is the zodiac\u2019s archer — Jupiter-ruled Fire, aiming at truth, distance and meaning. You are the philosopher and the pilgrim in one body, happiest mid-journey. Your growth edge is the return trip: learning that depth in one place can be its own adventure.',
    start: [11, 22],
    end: [12, 21],
    themes: [
      'Book the thing today, Sagittarius — the ticket, the course, the first step of the plan. Your optimism needs a date on the calendar to become real. Vague someday energy is beneath you.',
      'Your honesty is a gift with a sharp edge today. Aim it at ideas, not people, and it will land as wisdom instead of wounding. The truth does not need volume to be true.',
      'A big question is asking for a walk, not an answer. Take the philosophical knot outside and let your legs think. You will come home with the shape of it, which is all today requires.',
      'Teach something today — you are good at it even when you do not notice. The thing that is obvious to you is a revelation to someone two steps behind. Generosity with knowledge is your signature move.',
      'Check the promise before you make it. Your yes is enthusiastic and your calendar is mortal. One kept promise beats three exciting maybes — protect your reputation for meaning it.',
      'Novelty is calling, but look closer: the adventure may be inside the familiar — the unread book, the unasked question, the road in your own city you have never taken. Exploration is a posture, not a postcode.',
    ],
  },
  {
    slug: 'capricorn',
    name: 'Capricorn',
    glyph: '♑',
    dates: 'Dec 22 – Jan 19',
    element: 'Earth',
    ruler: 'Saturn',
    traits: ['Ambitious', 'Patient', 'Masterful', 'Dry-witted'],
    strengths: ['Playing the longest game in the room', 'Self-discipline', 'Building real things from nothing'],
    challenges: ['Rest treated as laziness', 'Carrying it all so nobody sees you struggle', 'Worth measured only in output'],
    loveStyle: 'You love as commitment — you are building a life, not auditioning for one. You show devotion through reliability and provision, and you need a partner who respects the mission and softens the commander.',
    careerStyle: 'You are the zodiac\u2019s executive: structure, strategy, institutions, mastery earned over decades. You respect competence, keep your word like currency, and quietly become the person everything depends on.',
    description:
      'Capricorn is the zodiac\u2019s mountain — Saturn-ruled Earth, climbing by patience and craft. You were old at fifteen and get younger as you age, as the summit gets closer and the view improves. Your lesson is that rest is part of the climb, not a reward for finishing it.',
    start: [12, 22],
    end: [1, 19],
    themes: [
      'Play the long game out loud today, Capricorn. One decision is being pushed for a quick answer, but your advantage has always been the ten-year view. Buy the time your strategy deserves.',
      'Delegate one thing today — actually delegate it, not supervise it into a second job. Your standards are high; other people\u2019s 90% is enough for this, and your hours are the scarcest resource in the building.',
      'Rest is on the schedule today, commander. Not as a reward — as maintenance on the machine everything depends on. An evening genuinely off will pay for itself by Friday.',
      'A quiet piece of work deserves to be seen today. You do not have to brag; just stop hiding the result. The right people cannot reward what they do not know exists.',
      'Call the elder, or be the elder. There is a conversation across a generation that matters more than the agenda items crowding it out. Legacy is built in these unhurried exchanges.',
      'Review the mountain, not just the next step. Once a season you should ask whether the summit you are climbing is still the one you want. Today is a good day for that honest audit.',
    ],
  },
  {
    slug: 'aquarius',
    name: 'Aquarius',
    glyph: '♒',
    dates: 'Jan 20 – Feb 18',
    element: 'Air',
    ruler: 'Uranus',
    traits: ['Original', 'Humanitarian', 'Independent', 'Contrarian'],
    strengths: ['Seeing the future before it is fashionable', 'Loyalty to ideas and people alike', 'Comfort with being the odd one out'],
    challenges: ['Detaching when feelings get loud', 'Rebelling on principle past the point of usefulness', 'Loneliness inside the crowd'],
    loveStyle: 'You love as friendship first — your partner must be your co-conspirator, the person you call with the weird idea at midnight. You need intellectual kinship and room to be strange; possessiveness ends you.',
    careerStyle: 'You thrive at the edges: technology, science, community, reform, anything being invented. Hierarchies bore you; missions recruit you. You do your best work slightly ahead of the consensus.',
    description:
      'Aquarius is the zodiac\u2019s water-bearer — Uranus-ruled Air, pouring out ideas for a future most people cannot see yet. You are the friend of humanity who sometimes forgets individual humans need you warmer and closer. Your lesson is that the revolution also needs a heart.',
    start: [1, 20],
    end: [2, 18],
    themes: [
      'Share the weird idea today, Aquarius. The one you have been keeping because the room is not ready — the room is readier than you think, and your timing has always been your gift. Say it plainly.',
      'Come down from the concept and into the room today. Someone near you does not need your analysis; they need your presence. Put the future down for an hour and be a person, warmly.',
      'A system you rely on is ready for your redesign. You can see the better version clearly — sketch it, cost it, propose it. Reform is your love language; today it has an audience.',
      'Protect the odd friendship today. The person who matches your frequency is rare and valuable — send the message, make the plan. Your people are scattered, but they are yours.',
      'Question one rule you follow automatically. Not all of them — one. If it still makes sense, keep it with conviction; if it is just inherited, today is a fine day to retire it.',
      'Your detachment is information, not failure. If you have gone cool and distant, ask what feeling is underneath asking for a witness. Even visionaries are allowed a witness.',
    ],
  },
  {
    slug: 'pisces',
    name: 'Pisces',
    glyph: '♓',
    dates: 'Feb 19 – Mar 20',
    element: 'Water',
    ruler: 'Neptune',
    traits: ['Empathic', 'Dreamy', 'Artistic', 'Gentle'],
    strengths: ['Feeling what a room needs before anyone speaks', 'Imagination with real depth', 'Compassion without conditions'],
    challenges: ['Boundaries that dissolve', 'Escaping instead of deciding', 'Absorbing other people\u2019s weather'],
    loveStyle: 'You love as merging — romance, poetry and soul-recognition are your native country. You need a partner who honours your sensitivity as strength and helps you keep one foot kindly on the shore.',
    careerStyle: 'You excel where imagination and compassion are the work: arts, healing, music, film, spirituality, care. Rigid corporate water is not your ocean; you need work with meaning you can feel.',
    description:
      'Pisces is the zodiac\u2019s ocean — Neptune-ruled Water, the last sign, carrying a little of every sign before it. You dream in high definition and feel in surround sound. Your growth edge is the shoreline: learning which feelings are yours, and that boundaries are how compassion survives.',
    start: [2, 19],
    end: [3, 20],
    themes: [
      'Make something today, Pisces — however small. A sketch, a melody, four lines in a notebook. Your imagination is not decoration; unexpressed, it turns into fog. Expressed, it turns into weather you can enjoy.',
      'Check whose feelings you are carrying before noon. If the heaviness is not yours, you are allowed to set it down gently. Compassion with a boundary lasts; compassion without one becomes weather damage.',
      'Sleep and water are medicine today — the literal kind. A bath, a swim, an early night. Your system processes the world through dreams, so give it the hours it asks for without apologising.',
      'A dream from last night is worth two minutes of writing before it dissolves. Not every dream is a message — but yours have a habit of filing reports early. Keep the notebook close.',
      'Say the kind true thing to yourself today, in the voice you use for people you love. Your inner critic has been borrowing your sensitivity and aiming it backwards. Take the microphone back.',
      'One practical anchor today: the bill, the form, the appointment. Handle the shore-business first and the rest of the day can be ocean. Freedom, for you, is built out of finished errands.',
    ],
  },
);

// ---------- Shared daily banks ----------

export const LOVE_LINES: string[] = [
  'Love favours the honest sentence today — the one you have been rehearsing. Say it plainly and let it be enough.',
  'A small kindness lands bigger than a grand gesture today. Do the tiny thing, on purpose, and watch it echo.',
  'If you are attached, put the phones down for one shared hour. If you are single, put yourself where interesting people gather.',
  'Someone is listening more closely than you realise today. Speak about what you love as if it matters — it is contagious.',
  'Old warmth may resurface today — a memory, a name, a song. Notice what it actually asks of you before you act on it.',
  'Love asks for patience with an imperfect timeline today. Not everything ripening is late.',
  'Give the compliment you have been thinking. It has been sitting in you for days, and it belongs to them.',
  'Today, listening is the love language. Ask the question, then let the silence do its work.',
  'A boundary, kindly held, protects the love it seems to limit. Say your no like you mean your yes.',
  'Romance hides in the ordinary errand today — the shared trip, the carried bag, the saved seat. Look there.',
  'If love feels distant today, check the basics first: sleep, food, one real conversation. Drama is rarely the diagnosis.',
  'Let someone surprise you today. The people we love are not finished products, and neither are we.',
  'Forgiving a small thing quickly is today\u2019s quiet superpower. Do not let a pebble become the wall.',
  'Your heart is braver than your habits today. Let the heart pick one small move and follow it.',
];

export const MONEY_LINES: string[] = [
  'Check the numbers once today — the account, the bill, the quiet subscription. Clarity is the cheapest financial tool there is.',
  'A small, boring, correct money move beats a dramatic one today. Automate the transfer; future you sends thanks.',
  'Someone\u2019s offer deserves a slower read today. The fine print is where the real offer lives.',
  'Invest in the tool, the course or the hour of help that saves you ten hours. Frugality that costs time is expensive.',
  'Today favours finishing the invoice, sending the quote, asking for the amount. Money often waits on one sent message.',
  'Resist the purchase that is really a mood in disguise. Sleep on it; if it still shines tomorrow, it was real.',
  'A skill you already have is underpriced. Today is a good day to notice that, and to say the bigger number out loud once.',
  'Tidy one money corner: the drawer of receipts, the spreadsheet, the budget line that has been guessing. Order compounds.',
  'Collaboration pays better than solo effort today. The split of a bigger pie beats all of a small one.',
  'Do not lend what you cannot gift today. Generosity is beautiful; resentment is a terrible interest rate.',
  'Your long game is working even where you cannot see it yet. Do not dig up the seeds to check on them.',
  'One honest conversation about money — with a partner, a client, yourself — clears more than a month of worry.',
  'Quality over quantity today: the version that lasts, bought once, with a calm mind.',
  'Track today\u2019s spending without judgement, just with eyes open. Awareness alone changes the pattern.',
];

export const MOODS: { word: string; note: string }[] = [
  { word: 'Bright', note: 'Energy arrives early and stays if you feed it one clear purpose.' },
  { word: 'Tender', note: 'Feelings sit close to the surface today — handle yourself and others gently.' },
  { word: 'Restless', note: 'Movement is the medicine: walk it, work it, do not sit on it.' },
  { word: 'Grounded', note: 'A slow, solid day. Roots before branches, and both will thank you.' },
  { word: 'Electric', note: 'Ideas spark faster than usual — catch them in writing before they arc away.' },
  { word: 'Reflective', note: 'The past has something useful to hand you today. Receive it, then return to now.' },
  { word: 'Bold', note: 'Courage is cheaper than usual today. Spend a little of it on the thing that matters.' },
  { word: 'Soft', note: 'A low-volume day. Comfort, quiet and kindness are not indulgences; they are the plan.' },
  { word: 'Curious', note: 'Questions open more doors than answers today. Follow the interesting one.' },
  { word: 'Steady', note: 'Nothing dramatic — and that is the gift. Let consistency do its quiet magic.' },
  { word: 'Playful', note: 'Humour unlocks what effort cannot today. Let yourself be amused by life once or twice.' },
  { word: 'Focused', note: 'One target, full attention. The world cooperates with a mind that has chosen.' },
  { word: 'Dreamy', note: 'Imagination runs the meeting today. Give it a notebook and a little supervision.' },
  { word: 'Warm', note: 'People lean toward you today. Your presence is doing more than your words.' },
];

const LUCKY_COLOURS: string[] = [
  'Gold', 'Deep indigo', 'Burgundy', 'Emerald green', 'Ivory', 'Burnt orange',
  'Midnight blue', 'Rose', 'Teal', 'Copper', 'Lavender', 'Charcoal', 'Crimson', 'Sage green',
];

// One line per moon phase for the horoscope pages (the full readings live on /tools/moon-phase).
const MOON_LINES: Record<string, string> = {
  'New Moon': 'A blank-page moon: plant intentions quietly and let them germinate in the dark.',
  'Waxing Crescent': 'First light after the new moon: small brave steps gather surprising momentum.',
  'First Quarter': 'A pushing moon: friction today is the intention proving it matters.',
  'Waxing Gibbous': 'A refining moon: polish what is already moving; the reveal is close.',
  'Full Moon': 'A harvest moon: things come into the light — celebrate what ripened, release what peaked.',
  'Waning Gibbous': 'A gratitude moon: share what this cycle taught you while it is fresh.',
  'Last Quarter': 'A clearing moon: forgive, declutter and close what the cycle has finished.',
  'Waning Crescent': 'A resting moon: do less on purpose and let the battery refill.',
};

// ---------- Daily engine ----------

function dayNumber(date: Date): number {
  return Math.floor(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86400000);
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function getSignBySlug(slug: string): HoroscopeSign | undefined {
  return SIGNS.find((s) => s.slug === slug.toLowerCase());
}

export function getSignForDate(month: number, day: number): HoroscopeSign {
  for (const sign of SIGNS) {
    const [sm, sd] = sign.start;
    const [em, ed] = sign.end;
    if (sm <= em) {
      if ((month === sm && day >= sd) || (month === em && day <= ed)) return sign;
    } else {
      // wraps the year (Capricorn)
      if ((month === sm && day >= sd) || (month === em && day <= ed)) return sign;
    }
  }
  return SIGNS[9]; // Capricorn fallback
}

export type DailyHoroscope = {
  sign: HoroscopeSign;
  dateString: string;
  theme: string;
  themeHeadline: string;
  love: string;
  money: string;
  moodWord: string;
  moodNote: string;
  luckyNumber: number;
  luckyColour: string;
  bestMatch: HoroscopeSign;
  moonName: string;
  moonEmoji: string;
  moonIllumination: number; // 0–100, rounded
  moonLine: string;
};

export function getDailyHoroscope(sign: HoroscopeSign, date: Date = new Date()): DailyHoroscope {
  const i = SIGNS.indexOf(sign);
  const d = dayNumber(date);

  const theme = sign.themes[d % sign.themes.length];
  const love = LOVE_LINES[(d + i * 3) % LOVE_LINES.length];
  const money = MONEY_LINES[(d * 2 + i * 5) % MONEY_LINES.length];
  const mood = MOODS[(d * 3 + i * 7) % MOODS.length];
  const luckyNumber = ((d * 31 + i * 17) % 99) + 1;
  const luckyColour = LUCKY_COLOURS[(d + i * 11) % LUCKY_COLOURS.length];
  const others = SIGNS.filter((s) => s.slug !== sign.slug);
  const bestMatch = others[(d + i) % others.length];

  const moon = moonPhase(date);

  return {
    sign,
    dateString: formatDate(date),
    theme,
    themeHeadline: theme.split('. ')[0].replace(/\.$/, '') + '.',
    love,
    money,
    moodWord: mood.word,
    moodNote: mood.note,
    luckyNumber,
    luckyColour,
    bestMatch,
    moonName: moon.name,
    moonEmoji: moon.emoji,
    moonIllumination: Math.round(moon.illumination * 100),
    moonLine: MOON_LINES[moon.name] ?? '',
  };
}

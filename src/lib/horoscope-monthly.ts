// Monthly horoscope — Gaia Vesta's own data and engine.
// No third-party APIs: each sign carries its own bank of month themes
// written for that sign's character, and shared monthly banks cover love,
// money and growth. A seed built from the sign and the calendar month picks
// one of each, so every reader of a sign shares the same reading all month
// and a fresh one next month. The moon dates are calculated with the shared
// moon engine (lib/moons.ts). Guidance is reflection in the astrological
// tradition — never a promise about outcomes.

import { SIGNS, type HoroscopeSign } from './horoscope';
import { moonsInMonth } from './moons';
import { MONTH_NAMES } from './horoscope-2027';

// ---------- Per-sign month themes (6 per sign) ----------

const MONTH_THEMES: Record<string, string[]> = {
  aries: [
    'This month is a campaign, not a sprint, Aries. Choose the one objective that actually matters and organise the weeks around it — your fire burns longest when it has a single hearth. Expect a mid-month test of your patience; passing it quietly is worth more than winning it loudly.',
    'Your ruling planet energy runs high this month, and the theme is initiative with a steering wheel. Start the thing, yes — but write the plan before you charge, because this month rewards the Aries who aims. People are watching how you begin; begin like someone who intends to finish.',
    'Money and momentum share the stage this month. A bold ask about your worth — a rate, a role, a bigger brief — is better timed than it feels, provided you make it once, cleanly, and then let it land. Do not negotiate against yourself in the waiting.',
    'This is a month for closing loops, warrior. The unfinished project from a past season is quietly taxing every new start; finish it or formally abandon it, but stop carrying it. By the final week you will feel the difference as pure speed.',
    'Relationships ask for your steadiness this month, not your intensity. Someone close needs the version of you that stays — for the whole conversation, the whole errand, the whole hard week. Show them that Aries loyalty is not a spark; it is a fire that keeps hours.',
    'Your body sets the agenda this month. Train like it matters, sleep like it is training, and treat rest as part of the campaign rather than a surrender from it. The Aries who manages energy this month will not need to manage crises next month.',
  ],
  taurus: [
    'A compounding month, Taurus — nothing flashy, everything fertile. The small deposits count double now: the savings habit, the skill practised weekly, the kindness repeated until it becomes the relationship. Trust the flat middle of the month; that is where the growth is hiding.',
    'This month asks you to look fairly at one change you have been refusing on principle. Not every new thing replaces something you love — some things extend it. Give the change a fair hearing early in the month, while the decision is still yours to make calmly.',
    'Money is the garden this month, and it wants tending rather than worrying. Review where it flows, prune one leak without drama, and plant one thing meant to be harvested seasons from now. Your patience is a financial instrument; let it work.',
    'Home asks for one real improvement this month — the repair, the rearrangement, the corner made beautiful. Your nervous system lives in your space, and upgrading it upgrades everything downstream. Choose the project you can finish inside the month; completion is the pleasure.',
    'Love deepens this month through the senses and through routine: the shared meal cooked properly, the walk taken together, the ritual defended against busy-ness. If you are single, someone who appreciates slowness is worth more of your time than someone who only applauds your calm.',
    'This month, guard the boundary between generosity and obligation. You will be asked for loans of money, time and calm — give what is freely given and decline the rest without a court case. Your peace is not a public resource, however public-spirited you are.',
  ],
  gemini: [
    'One deep river, Gemini — that is the month\u2019s whole assignment. Your many currents are all interesting, but this month pays for depth: the course finished, the draft completed, the skill taken past the fun beginner stage. Notice how much calmer your mind is when it has somewhere deep to go.',
    'Conversations carry unusual weight this month — one of them contains an offer, an introduction or an idea with a long fuse. Show up to your social life like it is a newsroom: curious, note-taking, following up. The follow-up message, sent within a day, is where this month\u2019s luck actually lives.',
    'This month your words want publishing. The piece, the pitch, the page, the proposal — something you know is ready to leave your head and enter the world. Publish the imperfect version mid-month and let real readers give the feedback your imagination keeps inventing.',
    'Money this month is a tale of two streams, and the tiebreaker is your oldest reliable one: which will you still care about in three months? Choose that one properly, fund it with your attention, and let the other become a pleasant someday instead of a guilty daily drain.',
    'Your mind needs feeding with structure this month — a syllabus, a series, a book with an argument — or it will feed on worry and other people\u2019s drama. Curate your inputs like an editor. What goes in this month decides what comes out next month.',
    'Restlessness peaks mid-month, and it is information, not instruction. Before you blow up a routine that is quietly working, ask what the restlessness actually wants: novelty can be a weekend, a guest, a new route — it does not have to be a new life.',
  ],
  cancer: [
    'Home expands this month, Cancer — in who is welcomed, what is repaired, or what home finally means. One decision about your space or your people sets the tone for the season ahead; make it from love rather than from guilt, and make it while the month is young.',
    'This month asks you to speak one need early, while it is still small. Your pattern is to carry things silently until they become weather; the people who love you would rather hear the small true sentence in week one than weather the storm in week four. Practise on something minor.',
    'Money and security intertwine this month — the savings that buy peace of mind, the family expense handled without resentment, the home cost faced squarely. A practical decision made calmly in the first half of the month buys you a noticeably softer second half.',
    'Your intuition is running loud this month, and it is mostly about people: who is tired, who is lying kindly, who needs feeding in every sense. Trust the read, but verify the important ones with one gentle question. Even tides check the shore.',
    'This is a month for handing back weather that is not yours. You will absorb at least one person\u2019s storm by accident; notice it, name it privately, and return it with love. The boundary you practise this month becomes next season\u2019s peace.',
    'Creative and domestic pleasures restore you this month more than any grand plan. Cook the elaborate thing, mend the beloved thing, host the small gathering. Your joy is not a luxury item in the budget of your life — it is load-bearing.',
  ],
  leo: [
    'A steady-flame month, Leo. The theme is not the premiere but the run of the show: the project, the bond, the practice that gets your glow week after week. Whatever you tend consistently this month will be unrecognisable — in the good way — by its end.',
    'Visibility is the assignment this month: stop hiding the finished work in the drawer. Show the result, send the portfolio, tell the room what you made. The right people cannot reward, hire or applaud what they do not know exists, and this month they are unusually ready to know.',
    'Money follows courage this month — specifically the courage to price your work like you respect it. An ask you have been rehearsing is better timed than your pride admits. Make it once, grandly and calmly, and let silence do the negotiating afterwards.',
    'This month, generosity is your most attractive setting: praise someone else specifically, publicly, and first. Your spotlight is big enough to share, and sharing it teaches the room what real confidence looks like. Watch how quickly the light you give comes back multiplied.',
    'Love asks for your warmth at full wattage and your pride at low volume this month. The apology you almost make is the one that matters; the slight you almost take personally almost certainly was not one. Choose the generous interpretation twice and notice the month soften.',
    'Play is scheduled maintenance this month, not a reward for finishing. Your creativity runs on joy the way engines run on fuel, and the tank has been politely asking for a refill. Defend one purely delightful appointment like a meeting with your most important client.',
  ],
  virgo: [
    'A systems month, Virgo — your favourite kind, if you let it be kind. One overhaul at a time: the budget, the morning, the workflow, each given room to root before the next begins. By month\u2019s end your days should run measurably lighter, and the lightness is the achievement.',
    'This month the standard is excellent-and-released. Something you are polishing for the fourth time is already better than most people\u2019s best; ship it mid-month and let the real world teach you what your imagination has been charging rent to rehearse. Feedback is data, not verdict.',
    'Health is the quiet headline this month: sleep, water, movement, the appointment kept. Treat your body like the primary instrument of your craft — because it is — and close one polite error message it has been sending for weeks. Small and kept beats grand and abandoned.',
    'Money wants your craft this month: the rate that finally reflects the quality, the subscription quietly cancelled, the spreadsheet that finally tells the truth. Do the unglamorous review early; the rest of the month spends the calm it buys.',
    'This month, help without taking over. Someone\u2019s imperfect attempt is their lesson, not your assignment — offer the one useful tip, then let them own the outcome. The energy you save becomes available for the work that is actually yours.',
    'Receive this month: the compliment without correcting it, the help without a corrections memo, the rest without earning it twice. Your growth edge is not effort — it never was. It is letting good things land on you at face value.',
  ],
  libra: [
    'A choosing month, Libra. The coin has been spinning on something since last season; this month it lands — by your hand, on your deadline. Either option is workable; the unmade decision is the only one still charging you rent. Decide in the first half and spend the second half enjoying the quiet.',
    'Partnership is both the theme and the tool this month. Your best thinking happens in dialogue, so take the stuck problem to the person whose mind complements yours. A collaboration offered this month deserves a serious yes-shaped look — it could carry your work further than a season of solo effort.',
    'Beauty is functional this month, not frivolous. The room rearranged, the wardrobe edited, the table set properly on an ordinary Tuesday — your mind genuinely works better in harmony, and this month proves it daily. Budget a little money and one free afternoon for aesthetics without apologising.',
    'Money moves through people this month: the joint venture, the client who becomes a patron, the fair contract. Your taste is a commercial asset — price it. Before you sign anything, read the one clause your optimism wants to skip; fairness includes future you.',
    'This month an honest sentence resets a relationship that politeness has been slowly bending out of shape. Say it kindly, say it once, early enough that it is still small. Then — the harder part for you — let it land without managing the other person\u2019s weather about it.',
    'Weigh the favour before you grant it this month. Your yes is generous, but several requests are aimed at the part of you that is already tired. A graceful no in week one prevents an ungraceful collapse in week four — and keeps your yes worth having.',
  ],
  scorpio: [
    'A transformation month, Scorpio — on schedule or not, something is ready to change form: an arrangement, a role, a way of carrying an old story. Your power this month is not control; it is your unmatched ability to come back altered and stronger. Choose the change once, and it costs you half as much.',
    'Shared money is the month\u2019s practical theme: debts, investments, a partner\u2019s situation, the paperwork nobody wants to open. Point your detective instincts at it early, while everything is still friendly. By month\u2019s end an arrangement can be rebuilt on terms that respect who you are now.',
    'This month asks you to hand someone one piece of weight you have been carrying alone — the secret, the fear, the task only you do properly. Choose the person carefully and the piece honestly. Each handover that does not end in betrayal rewrites an old rule in you.',
    'Love goes where you usually keep the door locked this month. Vulnerability at your pace is still vulnerability: one true inch, offered to the person who has earned it, deepens something real. Watch how they handle the inch — it tells you everything about the mile.',
    'Your intensity needs a worthy channel this month: the deep work, the hard training, the research rabbit hole with a real question at the bottom. Channelled, your force builds cathedrals; unchannelled, it interrogates the people you love. Choose the cathedral early.',
    'Forgiveness is quietly on the table this month — the private kind, where you stop paying interest on an old debt without announcing anything. You will know the moment by the lightness. Do not rush it and do not perform it; just stop arguing with it when it arrives.',
  ],
  sagittarius: [
    'A return-journey month, Sagittarius. The adventure this month is depth in a place you already know: the book finished, the promise kept, the hometown road never taken. Exploration is a posture, not a postcode — and this month proves how much undiscovered country fits inside the familiar.',
    'Teaching is your money move this month: the course, the guide, the session where what you know becomes what you offer. Package one piece of your experience properly and price it honestly. Your enthusiasm is the marketing; your follow-through is the product.',
    'This month, check every promise before you make it — your yes is generous and your calendar is mortal. One kept promise will do more for your reputation, and your peace, than three exciting maybes. Protect the archer\u2019s honour: when you say you will be there, be there.',
    'A big question is asking for a walk this month, not an answer. Take the philosophical knot outside and let your legs think; come home with the shape of it. The shape is enough — the full answer is scheduled for a later season, and it will find you mid-journey.',
    'Love this month needs a fellow traveller who can also land. Test every bond, new or old, by the ordinary Tuesday: who shares both the road and the dishes? Spend your considerable warmth where both answers are yes, and watch a good thing become a durable one.',
    'Book the thing this month — the ticket, the course, the first dated step of the plan. Your optimism needs a date on the calendar to become real, and someday is not a date. Future you, standing at the departure gate, is already grateful.',
  ],
  capricorn: [
    'A harvest month, Capricorn — the long game shows visible results, and your assignment is to actually collect them: the evidence filed, the win stated plainly, the reward taken without immediately converting it into more work. Receiving is a skill. Practise it at altitude.',
    'This month, delegate one real thing — properly, not supervised into a second job. Someone\u2019s competent 90% frees your scarcest resource, which is not money or talent but hours. Spend the reclaimed hours on the summit only you can climb, or — radical thought — on rest.',
    'Rest is on the schedule this month, commander, as maintenance on the machine everything depends on. Not as a reward for finishing, because your finish lines move. One genuinely off stretch will pay for itself in judgement quality for the rest of the season.',
    'Money asks for consolidation this month: review what the structures are earning and what they are costing, including the one that has quietly become a cage with good branding. Renegotiate one arrangement to fit who you have become, not who signed it.',
    'Love softens the commander this month: presence over provision, once in a while. The unhurried evening, the phone put away, the feeling said in actual words. Your devotion has always been real; this month it learns a second language, and someone close has been waiting to hear it.',
    'This month, audit the summit itself. Once in a while the mountain you are climbing deserves one honest question — is this still the one I want? Ask it on a quiet day, answer it in writing, and let the answer, whichever way it goes, make the climb lighter.',
  ],
  aquarius: [
    'A coming-closer month, Aquarius. Your ideas find their people now — the room, the thread, the small crowd that gets it. Show up in person where you can; the future you keep describing gets built by hand, in company, and this month the company is unusually good.',
    'Prototype the idea this month — cheaply, quickly, in front of real humans. The concept you have been refining in orbit needs ground contact: a test, a pilot, a first small version someone can react to. Their reactions are the data your brilliance has been missing.',
    'Money moves through networks this month: the collaboration, the platform, the friend-of-a-friend with a budget. Say plainly what you offer and what it costs; your people cannot refer what they cannot describe. Late in the month, a shared project is ready to become a signed thing.',
    'This month, when feelings get loud, stay in the room. Your reflex is orbit — analysis, distance, the concept of the feeling. Someone close does not need your framework; they need your presence for one unhurried hour. It will feel better than your theory predicts.',
    'Question one inherited rule this month — just one. If it still makes sense, keep it with conviction; if it is merely old, retire it with thanks. Your gift is seeing the future early; this month, apply it to one small system in your own daily life.',
    'Protect the odd friendships this month — the rare people who match your frequency. Send the message, make the plan, do the maintenance that scattered, beloved networks need. Your people are your infrastructure for every revolution you have planned.',
  ],
  pisces: [
    'A shoreline month, Pisces: giving dreams schedules and compassion boundaries. One practical anchor per week — the form, the invoice, the appointment — buys your dreaming a freer month. Freedom, for you, is built out of finished errands, and this month you get to feel that.',
    'Make things this month — however small, however private. A sketch, a melody, four lines in the notebook. Unexpressed, your imagination turns to fog; expressed, it turns into weather you can enjoy and, increasingly, work you can share. Keep the notebook within reach at all times.',
    'This month, check whose feelings you are carrying — weekly, like a tide table. At least one heaviness in circulation is not yours; set it down gently and without announcement. Compassion with a boundary is the only kind that survives a whole season, and you are built for seasons.',
    'Sleep and water are medicine this month, the literal kind: the swim, the bath, the early night defended without apology. Your system processes the world through dreams, so give it the hours it asks for. Mornings after real rest will quietly double your clarity.',
    'Your creative work has real value this month — price it like you believe that, especially when someone asks with a smile for it free. The awkward conversation lasts four minutes; the resentment from skipping it lasts the season. Choose the four minutes.',
    'Say the kind true thing to yourself this month, in the voice you reserve for people you love. Your inner critic has been borrowing your sensitivity and aiming it backwards for long enough. Take the microphone back, gently, every time you notice — noticing is most of the victory.',
  ],
};

// ---------- Shared monthly banks ----------

const MONTH_LOVE: string[] = [
  'Love this month rewards the unhurried conversation — the one with no phones, no agenda and no clock. Schedule it like it matters, because it does.',
  'A shared project does more for love this month than a grand gesture: cook it, build it, plan it, finish it together and notice what the finishing feels like.',
  'This month, say the appreciation out loud and in detail. General praise is weather; specific praise is climate — it changes what grows between you.',
  'If you are single, this month favours the interesting room over the endless scroll: one real gathering is worth a month of profiles. If attached, be a beginner together at something.',
  'An old pattern in love is ready to be retired this month — you will recognise it by how tired it makes you. Name it once, kindly, and practise the new move instead.',
  'Love asks for repair this month where repair is due: the small apology, the kept promise, the subject finally opened. Small repairs, done early, are what long love is actually made of.',
  'This month your heart wants honesty about capacity: what you can give, what you cannot, and what you need. Said plainly and early, it reads as love. Said late, it reads as distance.',
  'Romance hides in logistics this month — the lift given, the appointment remembered, the heavy thing carried without being asked. Do the unglamorous kind thing and watch it land like poetry.',
  'A friend may be the love story of this month: the one who shows up, remembers, and tells you the truth. Invest in that bond deliberately; it is not the consolation prize, it is a main character.',
  'This month, listen for the sentence underneath the sentence in your closest relationship. Ask the second question. What surfaces will save you a season of guessing.',
  'Boundaries are a love language this month. The no you say kindly, to protect rest or honesty, is guarding the yes you actually mean.',
  'Let someone surprise you this month. The people you love are not finished products, and the version of them you have filed away may be due an update.',
];

const MONTH_MONEY: string[] = [
  'This month favours the calm review: accounts open, subscriptions audited, one leak pruned without drama. Clarity now buys calm for the whole season.',
  'Price your work like you respect it this month. If a number has been embarrassingly small for a while, this is the month it grows — say the bigger one once, out loud, to a real person.',
  'A collaboration is worth more than a solo grind this month. The split of a bigger pie beats all of a small one, and the right partner is closer than you think.',
  'Invest in the thing that saves time this month — the tool, the help, the course with a syllabus. Frugality that costs you ten hours is the most expensive kind.',
  'Send the invoice, the quote, the application this month. Money in your world is often waiting on one sent message, and the message is already written in your head.',
  'This month, sleep on the shiny purchase. If it still shines after three nights, it was real; if it fades, it was a mood wearing a price tag.',
  'Build the boring buffer this month: the automatic transfer, the separate account, the small sum that moves before you can negotiate with it. Future you sends thanks in advance.',
  'One honest money conversation clears more than a month of private worry this month — with a partner, a client or a mirror. Have it in the first half of the month and enjoy the lighter second half.',
  'Your existing skill is underpriced or under-offered this month. Package what you already know — the session, the guide, the service — and put a date on its launch.',
  'Read the fine print this month, especially on the friendly offer. The real terms live there, and your clear eyes are worth more than the discount.',
  'Do not lend what you cannot gift this month. Generosity is beautiful; resentment is a terrible interest rate, and it compounds in silence.',
  'Track the month\u2019s spending with eyes open and no judgement. Awareness alone changes the pattern — most people find the leak within a fortnight of actually looking.',
];

const MONTH_GROWTH: string[] = [
  'The growth edge this month is finishing: one open loop, closed properly, teaches your nervous system more than five fresh starts.',
  'This month, practise receiving — help, praise, rest — without deflecting or immediately repaying. Let good things land at face value.',
  'Your lesson this month arrives disguised as boredom in the middle of something worthwhile. Stay ten more minutes than your restlessness wants; the interesting part lives just past it.',
  'Growth this month is a boundary kept kindly: one clear no, held without a court case, that protects the yes you actually mean.',
  'This month asks for the honest audit: one habit that is quietly costing you power, named in writing, retired without ceremony.',
  'The edge this month is patience with your own timeline. Seeds do not grow faster for being dug up and inspected; water them and do something else.',
  'This month, let someone else\u2019s 90% be enough. Delegating one real thing — and not re-doing it — is the practice, not the shortcut.',
  'Your growth this month is a conversation you have been postponing. It will be shorter and kinder than the version you rehearse at 3 a.m.',
  'This month, choose depth over novelty once, deliberately: the next chapter instead of a new book, the deeper skill instead of a new hobby.',
  'The lesson this month is rest treated as part of the work, scheduled like a meeting and defended like one. Recovery is not the reward; it is the mechanism.',
  'Growth this month looks like asking — for the rate, the help, the introduction, the second chance. The ask you rehearse most is usually the one that matters.',
  'This month, forgive the small thing quickly and the old thing privately. Stop paying interest on debts nobody is collecting anymore.',
];

const MONTH_POWER_WORDS: string[] = [
  'Steady', 'Root', 'Finish', 'Depth', 'Welcome', 'Enough', 'Decide', 'Release',
  'Return', 'Soften', 'Belong', 'Anchor', 'Gather', 'Tend', 'Begin', 'Shine',
];

// ---------- Monthly engine ----------

export type MonthlyHoroscope = {
  sign: HoroscopeSign;
  year: number;
  monthIndex: number; // 0-based
  monthName: string;
  monthYear: string; // "November 2026"
  theme: string;
  themeHeadline: string;
  love: string;
  money: string;
  growth: string;
  luckyDays: number[];
  powerWord: string;
  newMoons: number[];
  fullMoons: number[];
  daysInMonth: number;
};

export function getMonthlyHoroscope(sign: HoroscopeSign, date: Date = new Date()): MonthlyHoroscope {
  const i = SIGNS.indexOf(sign);
  const year = date.getFullYear();
  const monthIndex = date.getMonth();
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const absMonth = year * 12 + monthIndex;

  const themes = MONTH_THEMES[sign.slug];
  const theme = themes[(absMonth + i * 5) % themes.length];
  const love = MONTH_LOVE[(absMonth + i * 3) % MONTH_LOVE.length];
  const money = MONTH_MONEY[(absMonth * 2 + i * 5) % MONTH_MONEY.length];
  const growth = MONTH_GROWTH[(absMonth * 3 + i * 7) % MONTH_GROWTH.length];
  const powerWord = MONTH_POWER_WORDS[(absMonth + i * 11) % MONTH_POWER_WORDS.length];

  // Three distinct lucky days, seeded by sign and month.
  const base = absMonth * 131 + i * 101 + 17;
  const picks = new Set<number>();
  for (const mult of [1, 7, 13]) {
    let d = ((base * mult + mult * 29) % daysInMonth) + 1;
    while (picks.has(d)) d = (d % daysInMonth) + 1;
    picks.add(d);
  }
  const luckyDays = [...picks].sort((a, b) => a - b);

  const moons = moonsInMonth(year, monthIndex);

  return {
    sign,
    year,
    monthIndex,
    monthName: MONTH_NAMES[monthIndex],
    monthYear: `${MONTH_NAMES[monthIndex]} ${year}`,
    theme,
    themeHeadline: theme.split('. ')[0].replace(/\.$/, '') + '.',
    love,
    money,
    growth,
    luckyDays,
    powerWord,
    newMoons: moons.newMoons,
    fullMoons: moons.fullMoons,
    daysInMonth,
  };
}


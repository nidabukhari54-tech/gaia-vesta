// 2027 Yearly Horoscope — Gaia Vesta's own content and data.
// No third-party APIs and no copied feeds: every sign's year is written by us
// in that sign's voice, anchored only to things that are really true — the
// standard tropical sign-season calendar, the seasons, and the 2027 moon
// dates, which are *calculated* day by day with the same moonPhase() engine
// that powers our Moon Phase tool. Guidance is written as reflection in the
// astrological tradition — never as a promise about outcomes.

import { moonPhase } from './numerology';
import { SIGNS, type HoroscopeSign } from './horoscope';

// ---------- 2027 moon calendar (computed, real) ----------

const SYNODIC = 29.530588853;

export const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export type MonthMoons = {
  month: string;
  /** day-of-month numbers of the new moon(s) falling in this month */
  newMoons: number[];
  /** day-of-month numbers of the full moon(s) falling in this month */
  fullMoons: number[];
};

function computeMoonCalendar2027(): MonthMoons[] {
  const months: MonthMoons[] = MONTH_NAMES.map((m) => ({
    month: m,
    newMoons: [],
    fullMoons: [],
  }));
  const HALF = SYNODIC / 2;

  // Walk the year at local noon (avoids DST edge cases). A new moon is the
  // day the moon's age wraps past the end of the cycle; a full moon is the
  // day the age crosses the cycle's halfway point. In each case the event
  // belongs to whichever of the two neighbouring days sits closer to it.
  let prevAge = moonPhase(new Date(2026, 11, 31, 12)).age;
  let prevMonth = 11; // December 2026
  let prevDay = 31;

  for (let m = 0; m < 12; m++) {
    const daysInMonth = new Date(2027, m + 1, 0).getDate();
    for (let d = 1; d <= daysInMonth; d++) {
      const age = moonPhase(new Date(2027, m, d, 12)).age;

      if (age < prevAge) {
        // age wrapped: the new moon fell between yesterday and today
        if (SYNODIC - prevAge < age) months[prevMonth].newMoons.push(prevDay);
        else months[m].newMoons.push(d);
      }
      if (prevAge < HALF && age >= HALF) {
        // age crossed the halfway point: the full moon fell in between
        if (HALF - prevAge < age - HALF) months[prevMonth].fullMoons.push(prevDay);
        else months[m].fullMoons.push(d);
      }

      prevAge = age;
      prevMonth = m;
      prevDay = d;
    }
  }
  return months;
}

export const MOON_CALENDAR_2027: MonthMoons[] = computeMoonCalendar2027();

export function moonsForMonth(monthIndex: number): MonthMoons {
  return MOON_CALENDAR_2027[monthIndex];
}

export function ordinal(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

// ---------- The 2027 sign years ----------

export type SignYear2027 = {
  slug: string;
  yearThemeTitle: string;
  yearTheme: string;
  yearLove: string;
  yearMoney: string;
  yearGrowth: string;
  bestMonths: { month: string; why: string }[];
  gentleMonths: { month: string; why: string }[];
  months: { month: string; note: string }[];
  luckyNumberYear: number;
  powerWord: string;
};

const YEARS: Record<string, Omit<SignYear2027, 'slug'>> = {
  aries: {
    yearThemeTitle: 'The Year of Finishing What You Start',
    yearTheme:
      '2027 is not short of beginnings for you, Aries — it never is. What this year asks is rarer: landings. The story of your 2027 is one big intention chosen early, defended through the distracting middle, and carried over a finish line you can actually point to by December. Expect fewer launches than usual and more proof — the deeply satisfying kind — that your fire can build as well as ignite.',
    yearLove:
      'Love deepens this year when you slow down by ten percent. Partners and prospects alike respond to the Aries who stays for the whole conversation, not just the exciting first half. Your birthday season in spring is the year\u2019s most magnetic stretch; autumn asks for honesty about what you share — money, time, the future — and rewards it.',
    yearMoney:
      'Your income story in 2027 is about funding one thing properly instead of five things thinly. Spring favours the brave decision about what your work is worth; late summer is for enjoying what you earn without apology. Read the fine print in October, when shared money and other people\u2019s promises need your clear eyes.',
    yearGrowth:
      'Your growth edge has never been courage — it is follow-through and the patience it demands. This year hands you repeated, almost comic opportunities to practise both: the slow colleague, the delayed result, the project in its boring tenth week. Each one you stay with quietly rewires what you believe you are capable of.',
    bestMonths: [
      { month: 'March', why: 'Your season opens with the spring equinox — energy, visibility and fresh starts all peak at once.' },
      { month: 'May', why: 'Building weather: the ideas of spring turn into funded, physical progress.' },
      { month: 'September', why: 'Partnerships sharpen and the right ally appears; negotiate from strength.' },
    ],
    gentleMonths: [
      { month: 'July', why: 'High summer heat meets your own — tempers, yours included, run short. Cool heads win.' },
      { month: 'December', why: 'The year ends asking for review, not one more charge. Rest is the assignment.' },
    ],
    months: [
      { month: 'January', note: 'Mid-winter, and everyone expects you to sprint out of the gate. Resist the false start: January is for choosing the one race that matters, not entering twelve.' },
      { month: 'February', note: 'Late winter tests your patience, so use the quiet on purpose — train, plan and sharpen. The launch you are known for this year is assembled now, invisibly.' },
      { month: 'March', note: 'The equinox lights your season on the 21st and the year truly begins for you. Set the big intention this month and say it out loud to someone who will remember it.' },
      { month: 'April', note: 'Birthday season, full strength. Momentum is real — spend it on the project with a finish line, not on the loudest distraction in the room.' },
      { month: 'May', note: 'Spring settles into building weather and money comes into focus. What you fund now, and what you refuse to fund, quietly decides the shape of your autumn.' },
      { month: 'June', note: 'The solstice brings the longest days and a decision close to home. Choose the option that gives future-you the most room to move.' },
      { month: 'July', note: 'High summer, high heat — yours included. This is the year\u2019s most combustible month; the argument that matters will be won by the version of you that stayed cool.' },
      { month: 'August', note: 'Play returns, and it is not a detour. Romance, creativity and sheer fun refill the tank that the serious months of this year have been draining.' },
      { month: 'September', note: 'The equinox balances the year and partnerships take the stage. Sign nothing in a hurry; negotiate like someone playing the long game — because you are.' },
      { month: 'October', note: 'Autumn asks for depth. Shared money, old debts — emotional or otherwise — want honest handling. Pay what is owed, in every sense, and feel how light that is.' },
      { month: 'November', note: 'The year\u2019s questions get bigger: study, travel, meaning. Book the journey or the course. Your mind is hungry, and February-you is already grateful.' },
      { month: 'December', note: 'The solstice closes your year in a season of stock-taking. Count the summits actually climbed before naming the next one — the count is better than you think.' },
    ],
    luckyNumberYear: 9,
    powerWord: 'Finish',
  },

  taurus: {
    yearThemeTitle: 'The Year of Quiet Compounding',
    yearTheme:
      'Nothing about your 2027 will look dramatic from the outside, Taurus — and it may be the most productive year you have had in a decade. This is a compounding year: small deposits of effort, money and care, made steadily, in the right soil. Your task is to trust the process in the flat middle months, when nothing seems to be happening and everything is.',
    yearLove:
      'Love in 2027 grows the way you like it: slowly, sensually, through shared routines that become rituals. Spring — your own season — is the year\u2019s sweetest stretch for romance, new or old. The risk is not conflict but comfortable autopilot; one deliberate surprise a month keeps the garden interesting.',
    yearMoney:
      'This is a builder\u2019s year financially: the budget, the savings habit, the skill that raises your rate. May and October favour signing, buying and committing — after your usual unhurried inspection. Avoid lending from guilt in late summer; generosity and good boundaries are different virtues.',
    yearGrowth:
      'Your lesson in 2027 is the difference between roots and ruts. Twice this year — around April and again in November — life will offer a change that looks like a threat and is actually an addition. You do not have to leap. You do have to look fairly before you refuse.',
    bestMonths: [
      { month: 'May', why: 'Your birthday season at spring\u2019s peak — appetite, income and affection all run generous.' },
      { month: 'October', why: 'Harvest energy: commitments made now are well-judged and built to last.' },
      { month: 'February', why: 'Quiet planning weather; the year\u2019s best decisions are drafted here, unhurried.' },
    ],
    gentleMonths: [
      { month: 'August', why: 'Heat and other people\u2019s urgency press on you — guard your pace and your wallet alike.' },
    ],
    months: [
      { month: 'January', note: 'The year opens in your favourite way: slowly. Use January to set the systems — money, mornings, meals — that will quietly run the whole year for you.' },
      { month: 'February', note: 'Late winter is planning weather. Behind the scenes is exactly where you like to be; the year\u2019s smartest decisions get drafted now, without an audience.' },
      { month: 'March', note: 'The equinox stirs something restless under the calm. A low-key month for you — rest, clear the ground, and let the louder signs exhaust themselves first.' },
      { month: 'April', note: 'Your season begins on the 20th and the light changes. Energy returns to your body first, then your plans. Begin the thing the year will be remembered for.' },
      { month: 'May', note: 'Birthday season at the peak of spring — your strongest month of 2027. Ask for the rate, plant the garden, say the yes. Everything you start now has your full strength behind it.' },
      { month: 'June', note: 'The solstice turns the year and money matters move to the front. A conversation about worth — yours — goes better than you fear. Have it.' },
      { month: 'July', note: 'High summer asks you to enjoy what you have built so far. Home, food, water, shade: pleasure is not procrastination this month, it is maintenance.' },
      { month: 'August', note: 'Other people\u2019s urgency is not your emergency. Late summer tests your boundaries around time and lending — hold them kindly and hold them completely.' },
      { month: 'September', note: 'The equinox brings harvest habits: routines, health, the daily craft of your work. Small repairs now prevent expensive ones in winter.' },
      { month: 'October', note: 'Partnership season, and your judgement about people is at its sharpest. Commitments made in October — contracts, promises, engagements of every kind — are built to last.' },
      { month: 'November', note: 'Autumn deepens and a change you have been resisting shows its friendly face. Look fairly this time. Not every new thing replaces something you love; some things extend it.' },
      { month: 'December', note: 'The solstice closes a compounding year. Add it up honestly — money, skill, love, calm — and you will see how much quiet months can hold.' },
    ],
    luckyNumberYear: 42,
    powerWord: 'Root',
  },

  gemini: {
    yearThemeTitle: 'The Year of One Deep River',
    yearTheme:
      'You will not lack for ideas in 2027, Gemini — you never do. This year\u2019s invitation is depth: choosing one or two of your many currents and following them all the way to mastery, audience or income. The surprise waiting for you is that depth is not boring. Depth, it turns out, is where the interesting strangers live.',
    yearLove:
      'Love asks for your attention span this year — the whole conversation, the remembered detail, the second question. Late spring, your own season, crackles with meetings and messages; the connection that matters will be the one that survives your busiest month. If attached, novelty together beats novelty elsewhere.',
    yearMoney:
      'Your mind is the asset in 2027, and the year rewards packaging it: the course, the column, the pitch, the product made from what you know. Two income streams want choosing between in summer — pick the one you will still care about in three months, which is your most reliable tiebreaker.',
    yearGrowth:
      'Scattered is your shadow and focus is your practice this year. Expect your growth to come disguised as boredom in the middle of worthwhile things — the chapter, the module, the week six. Stay. The Gemini who finishes becomes a different order of dangerous.',
    bestMonths: [
      { month: 'June', why: 'Your season at the solstice — maximum light, maximum you; launch and publish now.' },
      { month: 'September', why: 'Back-to-school energy suits your mind; study and signing both go well.' },
      { month: 'April', why: 'Social spring: the right rooms, the right introductions, ideas catching fire.' },
    ],
    gentleMonths: [
      { month: 'November', why: 'Late-autumn fog suits neither your mood nor your judgement — postpone the irreversible.' },
      { month: 'February', why: 'Restlessness peaks in the dark weeks; feed your mind deliberately or it will feed on worry.' },
    ],
    months: [
      { month: 'January', note: 'The year opens with your mind already racing ahead of it. January\u2019s gift is a shortlist: write down every project calling you, then circle two. Only two get your year.' },
      { month: 'February', note: 'Late winter makes you restless, so feed the mind on purpose — a book with an argument, a skill with a syllabus. Structured curiosity beats doom-scrolling the void.' },
      { month: 'March', note: 'The equinox wakes the social season. People, pitches and plans multiply; your job is remembering which two projects all this energy is supposed to serve.' },
      { month: 'April', note: 'Spring at full tilt: invitations, introductions, ideas catching fire in conversation. Say yes to the rooms where your people gather — one April meeting matters more than it looks.' },
      { month: 'May', note: 'Your season begins on the 21st and the tempo rises. Words carry further this month — publish, pitch, present. The draft you have been sitting on is ready to be read.' },
      { month: 'June', note: 'Birthday season at the solstice, the longest light of the year — your peak month. Launch the thing. Your wit, timing and luck are all running at full brightness.' },
      { month: 'July', note: 'High summer turns the focus to money and worth. Two streams are calling; choose by the three-month test — which will you still love in October?' },
      { month: 'August', note: 'The pace drops and your mind hates it — briefly. Then it discovers the pleasure of the deep middle: the chapter, the module, the craft. Stay with the river you chose.' },
      { month: 'September', note: 'The equinox brings back-to-school energy and your mind purrs. Courses, contracts and careful edits all go well. This is a signing month, not a starting month.' },
      { month: 'October', note: 'Partnership season sharpens your favourite skill: dialogue. A collaboration offered now could carry your deep project further than a year of solo effort.' },
      { month: 'November', note: 'Late-autumn fog rolls in and your judgement gets theatrical. Postpone the irreversible decisions; use the month for research, drafts and delicious questions instead.' },
      { month: 'December', note: 'The solstice closes the year in storytelling season — appropriately. Tell the story of what you built this year, out loud, to people. It is a better story than you have been admitting.' },
    ],
    luckyNumberYear: 17,
    powerWord: 'Depth',
  },

  cancer: {
    yearThemeTitle: 'The Year of the Open Door',
    yearTheme:
      'Your instinct is to protect what you love by closing around it, Cancer. 2027 teaches the braver version: protecting by opening — the door, the conversation, the invitation, your own two hands. This is a year when home expands in every sense: who is in it, what it holds, and how much of the world you let it welcome.',
    yearLove:
      'Love in 2027 wants your honesty earlier than usual — the need spoken in May rather than the resentment nursed until October. Your own season, around the solstice, is the year\u2019s most tender and magnetic stretch. Family and the people-who-are-family feature in every chapter; let them help carry what you usually carry alone.',
    yearMoney:
      'Money this year is tied to shelter and security: the home investment, the family expense, the savings that buy peace of mind. A practical decision in early spring sets up a calmer year. Your intuition about people is a financial instrument — when a deal smells wrong in autumn, believe your nose.',
    yearGrowth:
      'Your growth edge in 2027 is the boundary drawn with love: caring without carrying. The year will hand you several chances to notice whose weather you are absorbing — and to hand it back, gently, without closing your heart. That distinction is the whole lesson.',
    bestMonths: [
      { month: 'July', why: 'Your season at high summer — emotional strength, magnetism and home all peak together.' },
      { month: 'March', why: 'The equinox opens doors: invitations and reconciliations arrive with the spring.' },
      { month: 'November', why: 'Deep-water month in your element — intuition is loud and accurate; act on it.' },
    ],
    gentleMonths: [
      { month: 'January', why: 'The year opens in the opposite sign\u2019s season; ambition-talk exhausts you. Start soft.' },
      { month: 'October', why: 'Old wounds get poked in the darkening weeks — feel them, but do not move house emotionally.' },
    ],
    months: [
      { month: 'January', note: 'The year opens in Capricorn\u2019s season, all business, and it can feel like the world wants your output before your feelings. Start soft anyway: January is for deciding what home means this year.' },
      { month: 'February', note: 'Late winter turns you inward, productively. Money and trust entwine this month — one honest conversation about both clears the air for spring.' },
      { month: 'March', note: 'The equinox opens the door — literally, in spirit. Invitations arrive, old friends resurface, a reconciliation becomes possible. You choose which ones to welcome in.' },
      { month: 'April', note: 'Spring asks what you are building toward, out in the world. A quiet ambition you have kept private deserves one practical step this month — and one witness.' },
      { month: 'May', note: 'Speak the need in May, out loud, while it is still small. This is the month the year\u2019s big lesson is cheapest to learn: your people cannot read your mind, however much they love you.' },
      { month: 'June', note: 'Your season begins at the solstice, on the longest day. From here the year is yours: energy, clarity and tenderness all rise together. Set the summer\u2019s intention by the water if you can.' },
      { month: 'July', note: 'Birthday season at high summer — your strongest, softest month. Home expands: a guest, a project, a decision about where and with whom you live. Let it be joyful, not just practical.' },
      { month: 'August', note: 'Late summer turns to money and worth. The calm practical decision you make now — about earning, charging or saving — buys you peace of mind for the rest of the year.' },
      { month: 'September', note: 'The equinox brings conversations with siblings, neighbours, the near circle. A short trip or a long letter restores something. Words are the bridge this month; walk across.' },
      { month: 'October', note: 'The darkening weeks poke at old wounds — that is their job, not your failure. Feel what surfaces, write it down, and refuse to make permanent decisions from a temporary haunting.' },
      { month: 'November', note: 'Deep-water month, and your intuition is running loud and accurate. Romance, creativity and honest friendship all deepen. Act on the quiet knowing before it has to shout.' },
      { month: 'December', note: 'The solstice closes the year with partnership in focus. Look at who stood beside you in 2027 — and let the door of your home, and your heart, open to them one inch wider.' },
    ],
    luckyNumberYear: 28,
    powerWord: 'Welcome',
  },

  leo: {
    yearThemeTitle: 'The Year of the Steady Flame',
    yearTheme:
      'Your light is not in question in 2027, Leo — its steadiness is. This is a year for burning like a hearth rather than a firework: warm, constant, the place people gather. The projects and relationships that get your sustained glow will be transformed by December; the ones fed only on opening-night excitement will teach you why the flame needed tending.',
    yearLove:
      'Romance in 2027 favours the generous version of you — the one who praises specifically, shows up grandly for other people\u2019s moments, and does not keep score of applause. Your own season in high summer is the year\u2019s most radiant stretch for love. In autumn, pride is the only real obstacle; the apology you almost make is the one that matters.',
    yearMoney:
      'Money follows visibility this year: the work that is seen gets paid, so stop hiding your best results in drawers. Spring favours asking and launching; late summer, your birthday season, favours spending on joy without guilt — within the budget your wiser self set in spring.',
    yearGrowth:
      'Your growth edge in 2027 is discovering that your light does not dim when someone else\u2019s is lit. The year offers a few bright colleagues and one genuinely talented rival. Cheering for them — early, publicly, without being asked — turns out to be the most confident move you have ever practised.',
    bestMonths: [
      { month: 'August', why: 'Your season at summer\u2019s height — charisma, romance and creative courage all peak.' },
      { month: 'April', why: 'Spring fire: launches and brave asks land well; your timing is excellent.' },
      { month: 'December', why: 'Festive season suits your hearth-energy; recognition arrives with the lights.' },
    ],
    gentleMonths: [
      { month: 'February', why: 'The year\u2019s greyest weeks dim your solar battery — plan warmth, literally and socially.' },
      { month: 'October', why: 'A slight lands harder than it should; check whether it was ever really about you.' },
    ],
    months: [
      { month: 'January', note: 'The year opens quietly and your battery starts low — that is winter, not a verdict. January is for choosing this year\u2019s stage: the one production your flame will feed all year.' },
      { month: 'February', note: 'The greyest weeks of the year, and your solar nature feels them. Manufacture warmth on purpose: people, light, movement, colour. Partnership also asks a fair question this month — answer honestly.' },
      { month: 'March', note: 'The equinox returns the light and your spirits with it. Travel, study and big ideas call. Say yes to the horizon-expanding plan; it feeds everything else.' },
      { month: 'April', note: 'Spring fire season, and your timing is excellent. Launch, ask, audition, propose. The brave move made in April sets the year\u2019s plot in motion.' },
      { month: 'May', note: 'Money and worth take the stage. This is the month to price your work like you respect it — because the market is mostly taking its cue from you.' },
      { month: 'June', note: 'The solstice brings the year\u2019s longest days and a behind-the-scenes month for you. Rest and plotting, in that order: your season is coming, and it will want you bright.' },
      { month: 'July', note: 'Your season begins on the 23rd and the lights come up. Energy, appetite and magnetism all rise. Begin the personal chapter you have been rehearsing since spring.' },
      { month: 'August', note: 'Birthday season at summer\u2019s height — your peak month of 2027. Create loudly, love generously, celebrate without a shred of apology. This is what the steady flame was being saved for.' },
      { month: 'September', note: 'The equinox turns the focus to craft and money alike. Harvest what summer grew: send the invoice, bank the win, and fix the one system that keeps leaking time.' },
      { month: 'October', note: 'A small slight echoes louder than it deserves this month. Before you roar, check the evidence — most carelessness is just other people\u2019s weather, not a challenge to your throne.' },
      { month: 'November', note: 'Home and roots call in the darkening weeks. A family matter wants your warmth at full wattage; give it, and notice how little it costs the flame.' },
      { month: 'December', note: 'The solstice closes the year in festival season — your natural habitat. Recognition arrives quietly, from the right people. Let yourself be celebrated; you tended the flame all year.' },
    ],
    luckyNumberYear: 19,
    powerWord: 'Radiance',
  },

  virgo: {
    yearThemeTitle: 'The Year of Enough',
    yearTheme:
      '2027 offers you a radical standard, Virgo: enough. Not perfect, not optimised to the last decimal — enough, and done, and released. This is a year when your formidable craft gets aimed at the few things that matter most, and your health, work and relationships all improve in the space that perfectionism vacates. The harvest comes in your own season, and it is a good one.',
    yearLove:
      'Love in 2027 responds to the unedited you — the one who receives a compliment without correcting it and asks for help without a spreadsheet of justifications. Your season in late summer is the year\u2019s most quietly romantic stretch. If attached, shared routines become sacred; if single, someone who notices details is worth a second look.',
    yearMoney:
      'Your money year is a systems year: the budget that finally runs itself, the rate that finally reflects the quality, the expense quietly cancelled in March that pays you all year. Avoid lending your perfectionism to other people\u2019s chaos in autumn — help with advice, not absorption.',
    yearGrowth:
      'The growth edge is the gap between excellent and perfect, and 2027 keeps staging the lesson: the version released in June teaches you more than the version polished until September. Each time you ship at excellent, something in you unclenches. That unclenching is the point of the whole year.',
    bestMonths: [
      { month: 'September', why: 'Your season at the equinox — clarity, craft and harvest all align; your peak month.' },
      { month: 'May', why: 'Spring systems season: health, money and workflow overhauls all take root.' },
      { month: 'January', why: 'A planning month in a fellow earth sign\u2019s season — your kind of fresh start.' },
    ],
    gentleMonths: [
      { month: 'December', why: 'Festive chaos offends your systems and your sleep; defend both without guilt.' },
      { month: 'June', why: 'Solstice noise and other people\u2019s drama peak — your nervous system wants a smaller stage.' },
    ],
    months: [
      { month: 'January', note: 'A fresh start in a fellow earth sign\u2019s season — your favourite kind. January is for designing the year\u2019s systems calmly, on paper, before anyone else\u2019s urgency gets a vote.' },
      { month: 'February', note: 'Health and daily rhythm take the stage. One small habit, kept all month, will do more than the grand overhaul you are tempted to schedule. Small is not a compromise; it is the mechanism.' },
      { month: 'March', note: 'The equinox turns the light toward partnership. Someone close needs your honesty delivered at your gentlest setting — which, when you choose it, is very gentle indeed.' },
      { month: 'April', note: 'Spring deepens and shared resources want a careful look: the account, the agreement, the fine print. Your eye for the flaw is a gift this month. Use it on paper, not on people.' },
      { month: 'May', note: 'Systems season. The budget, the workflow, the morning — one overhaul at a time, each given a full month to root. By the solstice your days will run noticeably lighter.' },
      { month: 'June', note: 'The solstice brings noise, heat and other people\u2019s drama to a peak. Your assignment is a smaller stage: decline one stage too many and pour the saved energy into the craft itself.' },
      { month: 'July', note: 'High summer softens your edges, pleasantly. Friends, pleasure and unproductive afternoons are not bugs in the system this month — they are scheduled maintenance for the human running it.' },
      { month: 'August', note: 'Your season begins on the 23rd and the year comes into focus. Energy and clarity return together. Begin the harvest: gather what the year has grown and name it accurately.' },
      { month: 'September', note: 'Birthday season at the equinox — your peak month of 2027. Craft, health and income all align. Release the year\u2019s best work now, at excellent, and watch what it does in the world.' },
      { month: 'October', note: 'Partnership season asks for help received gracefully. Someone wants to carry a piece of your load. Let them — imperfectly, gratefully, without a corrections memo.' },
      { month: 'November', note: 'The darkening weeks turn you toward home and repair. Mend the small broken things — object, habit, apology — and feel how much of your peace is built from exactly that.' },
      { month: 'December', note: 'Festive chaos arrives and your systems groan. Defend your sleep and your short list of real priorities; let the rest of the season be gloriously, deliberately imperfect.' },
    ],
    luckyNumberYear: 33,
    powerWord: 'Enough',
  },

  libra: {
    yearThemeTitle: 'The Year of Choosing',
    yearTheme:
      'The scales are your gift and your trap, Libra, and 2027 is the year you set them down. Again and again, this year rewards the decision made over the perfect decision imagined — in love, in work, in the mirror. By your season in the autumn, something remarkable has happened: you trust your own judgement, because you have watched it work all year.',
    yearLove:
      'Partnership is your art form, and 2027 asks you to practise it without disappearing inside it. Spring brings the year\u2019s most romantic weather, and a relationship — new or renewed — asks for one honest sentence you have been editing for months. Say it kindly, say it once, and let it land.',
    yearMoney:
      'Money in 2027 moves through collaboration: the partnership, the joint venture, the client who becomes a patron. Your taste is a commercial asset this year — price it. Autumn, your season, favours signing; just read the clause your optimism wants to skip.',
    yearGrowth:
      'Your growth edge is decision without consensus. The year keeps presenting choices where no amount of consultation will produce certainty — only a deadline will. Each time you choose and survive the choosing (you will, easily), the next one gets lighter. That lightness is the year\u2019s real prize.',
    bestMonths: [
      { month: 'October', why: 'Your season at autumn\u2019s heart — beauty, love and fair dealing all peak; your best month.' },
      { month: 'May', why: 'Spring romance weather: connection, art and pleasure in generous supply.' },
      { month: 'February', why: 'Creative late winter — collaborations spark and taste runs sharp.' },
    ],
    gentleMonths: [
      { month: 'April', why: 'The opposite season pushes for speed; your considered pace gets mistaken for doubt. Hold it.' },
      { month: 'July', why: 'Home-and-family friction peaks in high summer; diplomacy starts with rest.' },
    ],
    months: [
      { month: 'January', note: 'The year opens with work and ambition in the air, and a decision carried over from last year still spinning. January\u2019s assignment is unglamorous and liberating: pick a deadline for it, and honour it.' },
      { month: 'February', note: 'Late winter turns creative and romantic in your favour. Collaborations spark; your taste is running sharp. Start the beautiful project with the person whose mind complements yours.' },
      { month: 'March', note: 'The equinox opens your opposite season and relationships come into close-up. One honest sentence, kindly said, resets a bond that politeness has been slowly bending out of shape.' },
      { month: 'April', note: 'Aries season pushes for speed and your considered pace gets read as doubt. It is not doubt; it is judgement. Hold your tempo — but do land the decision by month\u2019s end.' },
      { month: 'May', note: 'Spring at its most beautiful, and you are in your element: art, pleasure, connection. Romance — new, old or with your own life — gets a generous month. Spend on the shared experience.' },
      { month: 'June', note: 'The solstice turns your gaze outward: study, travel, the bigger picture. A question about meaning that has been circling deserves a real journey, literal or intellectual.' },
      { month: 'July', note: 'High summer stirs home and family friction — old roles, tender spots. Diplomacy begins with rest; do not mediate anyone\u2019s peace on an empty tank, including your own.' },
      { month: 'August', note: 'Late summer is harvest-and-honesty season for your work. Show the results, send the invoice, ask for the testimonial. Quiet excellence has done its part; visibility does the rest.' },
      { month: 'September', note: 'Your season begins at the equinox, on the 23rd, and the year exhales. Balance stops being a theory. Set the autumn\u2019s intentions in a beautiful room, on paper, with someone you trust.' },
      { month: 'October', note: 'Birthday season at autumn\u2019s heart — your peak month of 2027. Love, beauty and fair dealing all run in your favour. Sign the good contract, wear the good thing, choose the good person. Especially: choose.' },
      { month: 'November', note: 'Money and values come into focus in the darkening weeks. A calm review of what things cost — in currency and in peace — sets up a generous December.' },
      { month: 'December', note: 'The solstice closes your year of choosing with conversation and kin. Tell the people who shared it what they meant. Then notice: the scales are down, and your hands are free.' },
    ],
    luckyNumberYear: 24,
    powerWord: 'Decide',
  },

  scorpio: {
    yearThemeTitle: 'The Year of Letting It Transform You',
    yearTheme:
      'You are the sign of transformation, Scorpio, but you prefer to conduct it on your own terms. 2027 keeps removing that option — lovingly. This is a year of changes you did not schedule: an ending that clears ground, a truth that rearranges a relationship, a desire that will not stay buried. Your power this year is not control. It is your unmatched ability to come back from anything, altered and stronger.',
    yearLove:
      'Love in 2027 goes where you usually keep the door locked. Vulnerability at your pace is still vulnerability, and the person who handles your one true inch like it matters is telling you everything. Autumn, your season, is the year\u2019s most intense and honest stretch — what survives it is real.',
    yearMoney:
      'Shared money is the year\u2019s financial theme: debts, investments, a partner\u2019s situation, an inheritance of one kind or another. Your detective instincts are the asset — point them at the paperwork early, in spring, before anyone hopes you won\u2019t. By winter, a financial arrangement is ready to be rebuilt on honest terms.',
    yearGrowth:
      'Your growth edge is trust — not blind, but brave. The year will ask, more than once, whether you will hand someone the weight you have been carrying alone: the secret, the fear, the task only you do properly. Each handover that does not end in betrayal rewrites an old rule in you.',
    bestMonths: [
      { month: 'November', why: 'Your season in the deep autumn — power, desire and clarity all peak; your strongest month.' },
      { month: 'July', why: 'High-summer water season softens you in the best way; love and rest both deepen.' },
      { month: 'March', why: 'The equinox brings creative and romantic renewal — an old feeling, transformed.' },
    ],
    gentleMonths: [
      { month: 'May', why: 'Your opposite season stirs money-and-trust friction; read everything twice.' },
      { month: 'August', why: 'Visibility demands peak while your energy wants privacy — ration the spotlight.' },
    ],
    months: [
      { month: 'January', note: 'The year opens with work and structure in focus, and you are quietly glad of the cover. Use January to audit the foundations: the accounts, the commitments, the promises — including the ones made to you.' },
      { month: 'February', note: 'Late winter turns toward home and the past. Something ancestral — a story, an object, a pattern — asks to be understood rather than repeated. You are the right detective for this cold case.' },
      { month: 'March', note: 'The equinox brings renewal to romance and creativity. An old feeling returns wearing new clothes; look carefully before deciding whether it is a visitor or a resident this time.' },
      { month: 'April', note: 'Spring sharpens daily life: work, health, the rituals that hold you. One habit is quietly costing you power. You already know which one — April is when you retire it.' },
      { month: 'May', note: 'Your opposite season, and money-and-trust friction rises with the temperature. Read everything twice, ask the blunt question once, and do not sign from suspicion or from hope — only from evidence.' },
      { month: 'June', note: 'The solstice opens the deepest part of your year: shared resources, shared beds, shared truths. A conversation you have been circling since spring finally happens. It goes better than your 3 a.m. version predicted.' },
      { month: 'July', note: 'High summer, your fellow water sign\u2019s season, and you soften in the best way. Rest, water, one trusted person, no performance. Your intensity also needs a shore.' },
      { month: 'August', note: 'Visibility demands peak — career, reputation, being seen — while your energy wants privacy. Ration the spotlight deliberately and let your results do the appearing for you.' },
      { month: 'September', note: 'The equinox turns you toward friendship and the future. A group or community asks for your depth; give the version of it that does not cost you your secrets.' },
      { month: 'October', note: 'Your season begins on the 23rd and the year\u2019s tide turns. Energy returns like water finding its level. Whatever this year has been transforming in you starts, unmistakably, to show.' },
      { month: 'November', note: 'Birthday season in the deep autumn — your peak month of 2027. Power, desire and clarity run at full strength. Choose the transformation instead of bracing against it, and watch what you become.' },
      { month: 'December', note: 'The solstice closes the year with money and worth in honest focus. Rebuild one financial arrangement on terms that respect who you are now — not who you were when you signed the old one.' },
    ],
    luckyNumberYear: 13,
    powerWord: 'Release',
  },

  sagittarius: {
    yearThemeTitle: 'The Year of the Return Journey',
    yearTheme:
      'Your whole life is a departure, Sagittarius. 2027 adds the rarer half of the journey: the return — bringing what you have learned back to a place, a person, a body of work, and discovering it means something different now. This is not settling down. It is depth disguised as homecoming, and it may be the most interesting trip you have taken in years.',
    yearLove:
      'Love in 2027 needs a fellow traveller who also knows how to land. Late spring and your own season bookend the year\u2019s most romantic weather. The test in any bond this year is simple: can this person share both the road and the ordinary Tuesday? Choose the one who can.',
    yearMoney:
      'Money follows meaning this year: teaching, publishing, guiding, the work that spreads what you know. A spring opportunity to monetise your experience is real — check the promise before you make yours, since your enthusiasm signs cheques your calendar must cash. Autumn favours the honest pricing conversation.',
    yearGrowth:
      'Your growth edge is the return trip: finishing the book, keeping the promise, staying for the unglamorous middle of the thing you started at full gallop. The year keeps offering fresh horizons precisely when the current one gets ordinary. Recognising that pattern — and staying anyway — is your whole curriculum.',
    bestMonths: [
      { month: 'December', why: 'Your season at the solstice — fire, honesty and celebration; the year ends at your brightest.' },
      { month: 'May', why: 'Late-spring adventure weather: journeys and brave plans all get green lights.' },
      { month: 'August', why: 'High-summer fire season — travel, teaching and romance all run hot, in the good way.' },
    ],
    gentleMonths: [
      { month: 'June', why: 'Home and roots tug against your restlessness; do not sign away your freedom impulsively.' },
      { month: 'September', why: 'Detail season exposes any promise you over-made — audit before the equinox.' },
    ],
    months: [
      { month: 'January', note: 'The year opens with money and worth in plain view — an honest place to start. January asks you to price the journey properly before booking it: what will this year\u2019s adventure actually cost, in every currency?' },
      { month: 'February', note: 'Late winter is study weather, and your mind is hungry. A book, a language, a map on the wall — feed the philosopher now and the pilgrim will know where to go in spring.' },
      { month: 'March', note: 'The equinox stirs home and roots. A question about where you belong — and with whom — starts its year-long conversation. Do not rush it; it is the good kind of question.' },
      { month: 'April', note: 'Spring fire season, and romance and creativity both catch light. Play is not the reward this month; it is the research. Follow the fun with unusual seriousness.' },
      { month: 'May', note: 'Adventure weather at its best. Book the journey, pitch the wild idea, say yes to the road. Late spring is your green-light month — the plans made now carry the whole summer.' },
      { month: 'June', note: 'The solstice turns the focus to shared resources and deep water. Someone\u2019s offer deserves a slower read, and a promise deserves checking before you make it. Freedom, examined, is still freedom.' },
      { month: 'July', note: 'High summer asks the big questions out loud: belief, meaning, the point of the map. Take the philosophical knot on a long walk — your legs are your best thinking tool.' },
      { month: 'August', note: 'Fellow fire season, and you are incandescent: travel, teaching and romance all run hot in the good way. August is for the journey itself — be on it, fully.' },
      { month: 'September', note: 'The equinox brings detail season, and any promise you over-made in the spring sunshine comes due. Audit kindly, renegotiate honestly, and keep the ones that matter — kept promises are your reputation.' },
      { month: 'October', note: 'Partnership season turns the mirror toward your closest bonds. The year\u2019s question sharpens: who shares both the road and the ordinary Tuesday? You already know. Act accordingly.' },
      { month: 'November', note: 'Your season begins on the 22nd and the light, paradoxically, gets brighter as the days shorten. Energy and optimism return together. Set the year-end\u2019s intentions like you mean them.' },
      { month: 'December', note: 'Birthday season at the solstice — your peak. The return journey completes itself: you end the year somewhere familiar, seeing it with traveller\u2019s eyes, which is to say truly. Celebrate like it matters, because it does.' },
    ],
    luckyNumberYear: 55,
    powerWord: 'Return',
  },

  capricorn: {
    yearThemeTitle: 'The Year the Mountain Blooms',
    yearTheme:
      'You have been climbing for years, Capricorn, and 2027 is when the mountain does something unexpected: it blooms. This is a year when the structures you built start paying you back in the currencies you secretly wanted all along — time, tenderness, room to play. Your work is not to climb harder. It is to learn to receive at altitude.',
    yearLove:
      'Love in 2027 softens the commander. Your devotion has always shown in provision and reliability; this year it learns to show in presence — the unhurried evening, the phone put away, the feelings said in words. Your own season bookends the year with the most honest romantic weather; summer asks you to let someone see the unarmoured version.',
    yearMoney:
      'A harvest-and-consolidate year financially. The long game you have been playing shows visible results by autumn — protect them with the same discipline that built them, and resist one shiny spring risk that flatters your ambition. Delegating one money task, properly, buys you the year\u2019s scarcest asset: hours.',
    yearGrowth:
      'Your growth edge is rest treated as part of the climb rather than a reward for finishing it — a finish line that, left to you, would never arrive. The year keeps testing whether you can stop while the work is merely excellent and the light is still good. Each time you do, the mountain gets strangely more beautiful.',
    bestMonths: [
      { month: 'January', why: 'Your season at the year\u2019s gate — maximum authority and clarity; set the year\u2019s terms.' },
      { month: 'September', why: 'Harvest season in a fellow earth sign — results become undeniable, including to you.' },
      { month: 'May', why: 'Spring softness: play, romance and creativity refill the commander\u2019s reserves.' },
    ],
    gentleMonths: [
      { month: 'July', why: 'Your opposite season stirs home-versus-work tension at its peak; choose deliberately, not by default.' },
      { month: 'April', why: 'Spring speed pressures your long game — do not let urgency auction off your strategy.' },
    ],
    months: [
      { month: 'January', note: 'Your season, and the year opens on your terms — the only way you entirely trust. Use January to set the year\u2019s true summit: one goal that is actually yours, not inherited. Write it where only you can see it.' },
      { month: 'February', note: 'Late winter turns to money and worth. Review the long game calmly: what the structures are earning, what they are costing, and which one has quietly become a cage with good branding.' },
      { month: 'March', note: 'The equinox brings conversations, contracts and the near circle into focus. A short journey or a straight talk with a sibling-in-arms clears more than a quarter of meetings would.' },
      { month: 'April', note: 'Spring runs fast and loud around you, pressuring the long game. Do not let other people\u2019s urgency auction off your strategy. The mountain does not care about the weather of one month.' },
      { month: 'May', note: 'Spring softens, and so — unusually, delightfully — do you. Play, romance and creativity are not distractions in May; they are the bloom this whole year is about. Schedule them like summits.' },
      { month: 'June', note: 'The solstice turns to health and daily craft. One system in your routine is running on willpower alone; rebuild it properly and June quietly upgrades the rest of the year.' },
      { month: 'July', note: 'Your opposite season, and home-versus-work tension peaks in the heat. Choose deliberately — a week genuinely off will pay for itself by September, and everyone under your command knows it.' },
      { month: 'August', note: 'Late summer turns to shared resources and trust. Read the agreement, ask the plain question, and let one arrangement be renegotiated to fit who you have become.' },
      { month: 'September', note: 'The equinox brings harvest in a fellow earth sign\u2019s season. Results become undeniable — including, at last, to you. Let the evidence argue with your inner auditor; collect the win in writing.' },
      { month: 'October', note: 'Partnership season asks what your closest bonds need from the unarmoured version of you. Presence is the assignment: the unhurried evening, the phone away, the sentence said in words.' },
      { month: 'November', note: 'The darkening weeks turn to friendship and the far horizon. An old ally resurfaces with an idea that fits your next decade better than your next quarter. Listen all the way to the end.' },
      { month: 'December', note: 'Your season returns at the solstice and the year closes at altitude. Look back at the climb — then notice the flowers. You grew those too, commander, in the cracks of all that discipline.' },
    ],
    luckyNumberYear: 10,
    powerWord: 'Soften',
  },

  aquarius: {
    yearThemeTitle: 'The Year of Coming Closer',
    yearTheme:
      'You are the friend of humanity, Aquarius, and 2027 brings the revolution home — to individual humans, specific rooms, one particular heart. This is a year when your ideas find their people and your people find you warmer and closer than your reputation suggests. The future you keep describing starts, quietly, to be built by hand, in company.',
    yearLove:
      'Love in 2027 begins as friendship and deepens into something that surprises even you. Your season in late winter carries the year\u2019s most electric meetings. The growth edge in every bond is the same: when feelings get loud, stay in the room. Presence, not analysis, is what your people are asking for — and it turns out to feel better than expected.',
    yearMoney:
      'Money moves through networks this year: the community, the platform, the collaboration that did not exist last year. A spring idea that seems too early is merely early — prototype it cheaply and let your people improve it. Late autumn favours turning the shared project into a signed, paying thing.',
    yearGrowth:
      'Your growth edge is letting yourself be known at close range. The year offers a few people who match your frequency — rare, valuable — and asks whether you will protect those friendships with actual time, or admire them from orbit. Come down. The view from inside a life is better.',
    bestMonths: [
      { month: 'February', why: 'Your season in the deep winter — originality and electric meetings peak; your strongest start.' },
      { month: 'June', why: 'Solstice light suits your mind: create, publish, gather your people in one place.' },
      { month: 'October', why: 'Partnership season in a fellow air sign — collaborations and romance both think clearly.' },
    ],
    gentleMonths: [
      { month: 'August', why: 'Your opposite season turns up every spotlight; ration exposure and guard your odd hours.' },
      { month: 'May', why: 'Money-and-comfort friction: the collective idea meets the individual bill. Budget for both.' },
    ],
    months: [
      { month: 'January', note: 'The year opens with the future already on your mind — it always is. January\u2019s twist: pick the one idea you will actually build this year, with actual hands, and let the other nine wait their turn in the notebook.' },
      { month: 'February', note: 'Your season runs through these bright cold weeks until the 18th, and they are your peak: originality, courage and electric meetings all run high. Share the weird idea out loud; the room is readier than you think.' },
      { month: 'March', note: 'The equinox turns to money and materials. The vision needs a budget to become a build. March is for costing the dream honestly — you will like it more with numbers attached.' },
      { month: 'April', note: 'Spring multiplies conversations, short trips and messages that matter. One April introduction has a long fuse; you will not see the whole shape of it until autumn. Keep the thread warm.' },
      { month: 'May', note: 'Comfort and cost collide a little in May: the collective idea meets the individual bill. Budget for both without resentment — your home base is infrastructure for the mission, not a distraction from it.' },
      { month: 'June', note: 'The solstice brings the longest light and your creative season in spirit. Make the thing, publish the thing, gather your scattered people in one place if you can. June is when the network becomes a community.' },
      { month: 'July', note: 'High summer turns to health and daily systems. Your body is also a piece of technology you rely on; July is for its maintenance window — sleep, water, movement, the unglamorous upgrades.' },
      { month: 'August', note: 'Your opposite season turns every spotlight up while your energy wants the lab. Ration exposure deliberately. Let partners and collaborators front the work this month; your name travels fine without you.' },
      { month: 'September', note: 'The equinox deepens things: shared resources, shared truths. A collaboration is ready to get financially real. Read the terms with your usual clarity and sign the fair version.' },
      { month: 'October', note: 'Partnership season in a fellow air sign, and your thinking about love and work alike runs clear. This is the month to formalise the bond — contract, commitment or honest redefinition — that the year has been building toward.' },
      { month: 'November', note: 'The darkening weeks turn to career and visibility, and the April thread resurfaces with its full shape visible. Step forward. The future you described in February is hiring; it wants you.' },
      { month: 'December', note: 'The solstice closes the year among your people. Look around the room — literal or virtual — at who gathered. Coming closer was the whole assignment, and you did it without becoming anyone else. That was the trick, and you pulled it off.' },
    ],
    luckyNumberYear: 71,
    powerWord: 'Belong',
  },

  pisces: {
    yearThemeTitle: 'The Year of the Shoreline',
    yearTheme:
      'You are the ocean of the zodiac, Pisces, and 2027 is about your shoreline — the beautiful, necessary line where your deep water meets solid ground. This is a year of giving your dreams schedules, your compassion boundaries, and your imagination a finished shape. Nothing about you gets smaller. It gets *held* — and held things can finally be shared.',
    yearLove:
      'Love in 2027 asks for the merged heart and the kept self, both at once. Your season in late winter is the year\u2019s most romantic weather, and a connection — new or long-standing — deepens when you say the true thing in your gentlest voice. Summer tests whose feelings you are carrying; hand back, kindly, the ones that are not yours.',
    yearMoney:
      'Money this year improves through anchors: the finished errand, the sent invoice, the practical hour scheduled before the dreaming starts. Your creative work has real value in 2027 — autumn especially favours pricing it like you believe that. Beware the generous impulse that is actually avoidance of an awkward conversation.',
    yearGrowth:
      'Your growth edge is the boundary that lets compassion survive: one clear no, kept kindly, is worth a year of resentful yeses. The year stages the lesson in friendship, family and work by turns. Each time you hold the shoreline, the ocean in you gets calmer — not smaller, calmer.',
    bestMonths: [
      { month: 'March', why: 'Your season at the equinox — imagination, romance and intuition all peak; your best month.' },
      { month: 'November', why: 'Deep-water autumn suits your soul; meaning, travel and honest love all deepen.' },
      { month: 'July', why: 'Fellow water season at high summer — rest, romance and dreams all run restorative.' },
    ],
    gentleMonths: [
      { month: 'September', why: 'Detail season frays your edges; other people\u2019s systems are not your assignment.' },
      { month: 'December', why: 'Festive noise floods your senses — ration gatherings and protect the quiet.' },
    ],
    months: [
      { month: 'January', note: 'The year opens with everyone else in ambition mode and you still dreaming — correctly. January is your planning water: let the intentions form below the surface before anyone asks you to announce them.' },
      { month: 'February', note: 'Your season begins on the 19th and the light, though still cold, turns yours. Energy returns through the imagination first: make something small and real this month, however private.' },
      { month: 'March', note: 'Birthday season at the equinox — your peak month of 2027. Intuition, romance and creative power all run at full tide. Set the year\u2019s intention the way you set everything true: quietly, completely, in writing.' },
      { month: 'April', note: 'Spring turns to money and the material shore. One practical anchor now — the form, the invoice, the appointment — buys your dreaming a freer summer. Handle the shore-business first.' },
      { month: 'May', note: 'Conversations multiply in the bright weeks, and your words carry a healing charge. Say the kind true thing where it is needed — including, especially, to yourself.' },
      { month: 'June', note: 'The solstice turns toward home. A question about where you live and who feels like family wants a gentle, honest answer. Rearranging the shore — a room, a routine — rearranges the water too.' },
      { month: 'July', note: 'Fellow water season at high summer, and everything restorative is available: water, sleep, romance, unhurried days. Let July be the month the tide simply comes in and you simply receive it.' },
      { month: 'August', note: 'Late summer asks for health and daily rhythm. Your system processes the world through dreams and rest; give it the hours it asks for without apologising, and watch your clarity double.' },
      { month: 'September', note: 'Detail season frays your edges — forms, critiques, other people\u2019s systems. None of it is your assignment. Keep your September small, kind and mostly yours.' },
      { month: 'October', note: 'Partnership and depth intertwine in the darkening weeks. A bond asks for your one true inch of extra honesty. Give it at your pace; at your pace is still giving it.' },
      { month: 'November', note: 'Deep-water autumn, and your soul is in its element: meaning, journeys of the mind, love that has weathered things. November is for the far shore — the book, the retreat, the conversation that changes the map.' },
      { month: 'December', note: 'Festive noise floods your senses at the solstice. Ration the gatherings, protect the quiet, and end the year the way the shoreline ends the land: softly, and exactly where you choose.' },
    ],
    luckyNumberYear: 47,
    powerWord: 'Anchor',
  },
};

// ---------- Public accessors ----------

export type Year2027Reading = {
  sign: HoroscopeSign;
  year: SignYear2027;
};

export function getYear2027(sign: HoroscopeSign): Year2027Reading {
  return { sign, year: YEARS[sign.slug] };
}

export const YEAR_2027_READINGS: Year2027Reading[] = SIGNS.map((sign) => ({
  sign,
  year: YEARS[sign.slug],
}));


// Weekly horoscope — Gaia Vesta's own data and engine.
// No third-party APIs: each sign carries its own bank of week themes written
// for that sign's character; love, money and mood rotate from the shared
// banks in lib/horoscope.ts. A seed built from the sign and the ISO
// year-week picks one of each, so every reader of a sign shares the same
// reading all week (Monday to Sunday) and a fresh one next week. The moon
// arc is real astronomy: the phase is calculated at the week's first and
// last day with the same moonPhase() engine as the Moon Phase tool.
// Guidance is reflection in the astrological tradition — never a promise.

import {
  SIGNS, LOVE_LINES, MONEY_LINES, MOODS, formatDate, type HoroscopeSign,
} from './horoscope';
import { moonPhase } from './numerology';

// ---------- Per-sign week themes (6 per sign) ----------

const WEEK_THEMES: Record<string, string[]> = {
  aries: [
    'This week rewards the Aries who picks one target by Tuesday and defends it all week. Your starting energy is plentiful; your finishing energy is what the week is training. Close one loop before Friday and the weekend will feel like a victory lap instead of a recovery ward.',
    'A conversation early in the week sets the tone for everything after it. Say the true thing kindly and early, before impatience volunteers to say it for you. By the weekend, someone will thank you for the clarity you almost apologised for.',
    'Your body wants a contest this week — a race, a match, a hard session with a number attached. Burn the restlessness off physically and watch your patience double in every other arena. A tired Aries is a diplomatic Aries.',
    'Money asks for one decision this week, made once and not re-opened. Look at the numbers on a weekday morning, decide like the leader you are, and spend the rest of the week executing instead of circling.',
    'Someone slower is carrying a detail you need this week. Borrow their thoroughness instead of resenting their pace, and the joint work lands properly the first time — which, even for you, is the fastest outcome available.',
    'This week, finish the thing from last week before starting the shiny thing. The open loop is taxing every new beginning; closing it releases more energy than any fresh start could. Friday-you is already grateful.',
  ],
  taurus: [
    'A slow, rich week, Taurus — the kind where steady beats spectacular. Tend one thing well each day and let the results argue for you by the weekend. Your calm is not a lack of ambition; it is ambition with a longer fuse.',
    'This week, give one resisted change a fair hearing. Judge it by its merits rather than its newness, and decide before the weekend so the decision can be calm instead of cornered. Some new things are additions, not replacements.',
    'Your senses are the instrument this week: real food, real rest, something beautiful within reach every day. You do not recharge by scrolling; you recharge by touching the physical world. Schedule one genuinely pleasant hour and defend it.',
    'Money behaves this week if your own rules run it: the quality version once, the cheap version never, the savings transfer before the spending starts. Your long game is working — do not let one impatient afternoon spend what patience earned.',
    'Someone needs your steadiness this week more than your advice. Sit with them, feed them, listen all the way to the end. The calm you lend will be remembered long after the crisis that borrowed it is forgotten.',
    'Finish the beautiful thing this week. The project that only needs your patience to become real deserves one unhurried hour a day. By Sunday it will either be done or visibly becoming — both are pleasures of your favourite kind.',
  ],
  gemini: [
    'Your mind is quick this week, Gemini — aim it at one target before the week scatters it across six. Write the priority down on Monday; by Friday the focused version of you will have something finished to show for it.',
    'A conversation this week carries more than it seems to. Listen for the sentence underneath the sentence, and ask the second question. Someone is telling you something important in a casual voice, probably midweek.',
    'Learn one small, real thing this week — a lesson, a chapter, a drill. Your curiosity behaves better fed, and a useful skill counts double. By the weekend you will be showing it off, which is exactly the point.',
    'Mind the throwaway comment this week. Your words travel further than you think, and one casual remark could be repeated in rooms you are not in. Keep the wit; check the payload before it leaves.',
    'Two good options pull opposite ways this week. The tiebreaker is not which is better — it is which one you will still care about in three months. Choose that one early and let the other go cleanly.',
    'Write it down this week: the idea, the plan, the thing you keep meaning to say. Ten minutes of writing turns weather into climate. What only lives in your head evaporates; what is written starts negotiating with reality.',
  ],
  cancer: [
    'Home is the headline this week, Cancer. One small improvement to your space — cleared, mended, made beautiful — steadies your whole mood by the weekend. Your environment is not decoration; it is your nervous system\u2019s address.',
    'You already know the answer your intuition gave you on Monday. The hesitation is tenderness, not confusion. Sit with the answer gently this week; it will still be there, and so will you — and acting on it kindly is the week\u2019s real work.',
    'Feed someone this week, including possibly yourself. Your love language is nourishment in every sense, and one shared meal will repair something words have been circling for weeks. Set the table before the weekend.',
    'A memory visits this week — not to haunt you, but to hand you something. Let it finish its sentence before deciding what it means. There is a lesson in it you could not have heard the first time around.',
    'Protect your energy like money this week, because it is. One draining obligation can be postponed without the world ending. Your people need the rested version of you, not the resentful one, by the weekend.',
    'Ask out loud this week — for the hug, the help, the hour off. Your people are not mind-readers, and coping silently reads as not needing anything. Let yourself be cared for at the level you care for others.',
  ],
  leo: [
    'Dress like the week matters, Leo, because for you it does. When you feel like the main character of your own life you act like it — braver, kinder, more generous. The costume is not vanity; it is a switch. Flip it on Monday.',
    'Praise someone else this week — specifically, and where others can hear it. Your spotlight is big enough to share, and watching you share it teaches the room what real confidence looks like. Generosity is your most attractive setting.',
    'A small slight echoes louder than it deserves this week. Before it writes the week\u2019s story, ask whether it was truly about you — most carelessness is just other people\u2019s weather. Do not let a cloudy five minutes cancel a sunny week.',
    'Create the thing this week; do not just plan the premiere. The joy is in the making — the sketch, the draft, the rehearsal. Fall in love with the workshop hours and the audience part will take care of itself.',
    'Your heart wants play this week, not productivity theatre. Put something purely fun in the calendar and defend the appointment like a meeting with your most important client — because it is one, and the client is you.',
    'A loyal friend needs your warmth at full wattage this week. Show up like you mean it, preferably before the weekend. The people who have cheered for you longest should never have to wonder whether you noticed.',
  ],
  virgo: [
    'Fix the small annoying thing this week, Virgo. The wobbly detail you keep stepping over is taxing you daily; twenty minutes ends the tax for good. Your peace is built out of exactly these repairs, one per week.',
    'Done is a respectable standard this week. The version you are polishing for the fourth time is already better than most people\u2019s best — release it midweek and let the real world give the feedback your imagination keeps inventing.',
    'Your body is a system too, and it has been sending polite error messages. Sleep, water, a walk, the postponed appointment — treat one message as a ticket to close this week, not a flaw to judge.',
    'Help this week, but do not take over. Someone\u2019s imperfect attempt is their lesson, not your assignment. Offer the one useful tip, then let them own the rest — including the outcome, and including the credit.',
    'Sort one drawer, one folder, one corner of the budget this week. Order spreads from small cleared spaces like warmth from a stove. By Sunday the room — and your head — will breathe easier.',
    'Receive the compliment this week without correcting it. When someone praises your work, "thank you" is the complete sentence. You are allowed to be appreciated at face value, at least until Monday.',
  ],
  libra: [
    'Decide this week, Libra — the coin has been spinning long enough. Either choice is workable; the unmade decision is the only one actually costing you. Pick by midweek, commit, and let relief do the rest.',
    'Beauty is functional this week, not frivolous. Rearrange the desk, wear the good thing, put flowers where you can see them. Your mind genuinely works better in a harmonious room — that is data, not indulgence.',
    'A relationship needs one honest sentence this week. You have been keeping the peace by editing yourself, and the edited version is starting to resent the cast. Say it kindly, say it once, and let it land.',
    'Weigh the favour before you grant it this week. Your yes is generous, but the requests are landing on the part of you that is already tired. A graceful no now prevents an ungraceful collapse by the weekend.',
    'Pair up this week. Your best thinking happens in conversation, so take the stuck problem to the person whose mind complements yours. What is stuck alone will move in dialogue — probably by Thursday.',
    'Spend on the shared experience this week, not the solo treat. A meal, a ticket, an afternoon with your favourite person — connection is your currency, and it pays interest immediately.',
  ],
  scorpio: [
    'You already know what is really going on this week, Scorpio. The question is whether to say it. Choose one person who has earned the unedited version and give them the truth — it will deepen something real by the weekend.',
    'A secret you are keeping for someone else is costing you more than it costs them this week. You do not have to tell it — but you are allowed to hand the weight back. Loyalty does not require self-erasure.',
    'Put the intensity somewhere useful this week: the hard workout, the deep work session, the honest journal page. Channelled, your force builds; unchannelled, it interrogates the people you love. Choose the channel on Monday.',
    'Forgiveness is on the table this week — the private kind, where you stop paying interest on an old debt without announcing anything. You will know the moment by the lightness. Do not rush it; just stop arguing with it.',
    'Money and power want a clear-eyed look this week. Read the fine print, ask the blunt question, check the account. Your detective instincts are sharp — point them at the paperwork before someone hopes you won\u2019t.',
    'Let someone in by one inch this week. Not the whole archive — one true thing. Vulnerability at your pace is still vulnerability, and the right person will handle the inch like it matters, because it does.',
  ],
  sagittarius: [
    'Book the thing this week, Sagittarius — the ticket, the course, the first step of the plan. Your optimism needs a date on the calendar to become real. Vague someday energy is beneath you, and this week proves it.',
    'Your honesty is a gift with a sharp edge this week. Aim it at ideas, not people, and it lands as wisdom instead of wounding. The truth does not need volume to be true — even at full gallop.',
    'A big question is asking for a walk this week, not an answer. Take the philosophical knot outside and let your legs think. You will come home with the shape of it, which is all this week requires.',
    'Teach something this week — you are good at it even when you do not notice. The thing that is obvious to you is a revelation to someone two steps behind. Generosity with knowledge is your signature move.',
    'Check the promise before you make it this week. Your yes is enthusiastic and your calendar is mortal. One kept promise beats three exciting maybes — protect your reputation for meaning it.',
    'The adventure this week may be inside the familiar: the unread book, the unasked question, the road in your own city you have never taken. Exploration is a posture, not a postcode. Pack light and go anyway.',
  ],
  capricorn: [
    'Play the long game out loud this week, Capricorn. One decision is being pushed for a quick answer, but your advantage has always been the ten-year view. Buy the time your strategy deserves, and say so plainly.',
    'Delegate one thing this week — actually delegate it, not supervise it into a second job. Your standards are high; other people\u2019s 90% is enough for this, and your hours are the scarcest resource in the building.',
    'Rest is on the schedule this week, commander. Not as a reward — as maintenance on the machine everything depends on. One evening genuinely off will pay for itself by Friday, in judgement quality alone.',
    'A quiet piece of work deserves to be seen this week. You do not have to brag; just stop hiding the result. The right people cannot reward what they do not know exists, and this week they are looking.',
    'Call the elder this week, or be the elder. There is a conversation across a generation that matters more than the agenda items crowding it out. Legacy is built in exactly these unhurried exchanges.',
    'Review the mountain this week, not just the next step. Ask whether the summit you are climbing is still the one you want. An honest audit now saves a season of excellent climbing in the wrong direction.',
  ],
  aquarius: [
    'Share the weird idea this week, Aquarius. The one you have been keeping because the room is not ready — the room is readier than you think, and timing has always been your gift. Say it plainly, preferably before Thursday.',
    'Come down from the concept and into the room this week. Someone near you does not need your analysis; they need your presence. Put the future down for one hour and be a person, warmly, on purpose.',
    'A system you rely on is ready for your redesign this week. You can see the better version clearly — sketch it, cost it, propose it. Reform is your love language, and this week it has an audience.',
    'Protect the odd friendship this week. The person who matches your frequency is rare and valuable — send the message, make the plan. Your people are scattered, but they are yours, and networks need tending.',
    'Question one rule you follow automatically this week. Not all of them — one. If it still makes sense, keep it with conviction; if it is just inherited, this is a fine week to retire it with thanks.',
    'Your detachment is information this week, not failure. If you have gone cool and distant, ask what feeling underneath is asking for a witness. Even visionaries are allowed a witness.',
  ],
  pisces: [
    'Make something this week, Pisces — however small. A sketch, a melody, four lines in a notebook. Unexpressed, your imagination turns into fog; expressed, it turns into weather you can enjoy. Keep the notebook close.',
    'Check whose feelings you are carrying before midweek. If the heaviness is not yours, you are allowed to set it down gently. Compassion with a boundary lasts; compassion without one becomes weather damage by Friday.',
    'Sleep and water are medicine this week — the literal kind. A bath, a swim, an early night. Your system processes the world through dreams, so give it the hours it asks for without apologising.',
    'A dream this week is worth two minutes of writing before it dissolves. Not every dream is a message — but yours have a habit of filing reports early. The notebook by the bed is this week\u2019s hardest-working tool.',
    'Say the kind true thing to yourself this week, in the voice you use for people you love. Your inner critic has been borrowing your sensitivity and aiming it backwards. Take the microphone back, gently.',
    'One practical anchor this week: the bill, the form, the appointment. Handle the shore-business first and the rest of the week can be ocean. Freedom, for you, is built out of finished errands.',
  ],
};

// ---------- Weekly engine ----------

export const WEEKDAY_NAMES = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday',
];

/** Monday of the week containing `date` (local time). */
export function startOfWeek(date: Date): Date {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const shift = (d.getDay() + 6) % 7; // days since Monday
  d.setDate(d.getDate() - shift);
  return d;
}

/** ISO 8601 week number and week-year for a date. */
export function isoWeek(date: Date): { year: number; week: number } {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = (d.getUTCDay() + 6) % 7; // Mon = 0
  d.setUTCDate(d.getUTCDate() - dayNum + 3); // Thursday of this week
  const isoYear = d.getUTCFullYear();
  const firstThursday = new Date(Date.UTC(isoYear, 0, 4));
  const fDay = (firstThursday.getUTCDay() + 6) % 7;
  firstThursday.setUTCDate(firstThursday.getUTCDate() - fDay + 3);
  const week = 1 + Math.round((d.getTime() - firstThursday.getTime()) / (7 * 86400000));
  return { year: isoYear, week };
}

export type WeeklyHoroscope = {
  sign: HoroscopeSign;
  weekStart: Date;
  weekEnd: Date;
  weekRange: string; // "Monday 23 November – Sunday 29 November 2026"
  theme: string;
  themeHeadline: string;
  love: string;
  money: string;
  moodWord: string;
  moodNote: string;
  bestDay: string;
  moonStartName: string;
  moonStartEmoji: string;
  moonEndName: string;
  moonEndEmoji: string;
};

export function getWeeklyHoroscope(sign: HoroscopeSign, date: Date = new Date()): WeeklyHoroscope {
  const i = SIGNS.indexOf(sign);
  const weekStart = startOfWeek(date);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);
  const { year, week } = isoWeek(weekStart);
  const seed = year * 53 + week;

  const themes = WEEK_THEMES[sign.slug];
  const theme = themes[(seed + i * 5) % themes.length];
  const love = LOVE_LINES[(seed + i * 3) % LOVE_LINES.length];
  const money = MONEY_LINES[(seed * 2 + i * 5) % MONEY_LINES.length];
  const mood = MOODS[(seed * 3 + i * 7) % MOODS.length];
  const bestDay = WEEKDAY_NAMES[(seed + i * 3) % 7];

  const moonStart = moonPhase(weekStart);
  const moonEnd = moonPhase(weekEnd);

  const sameYear = weekStart.getFullYear() === weekEnd.getFullYear();
  const startStr = formatDate(weekStart);
  const endStr = sameYear
    ? weekEnd.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
    : formatDate(weekEnd);

  return {
    sign,
    weekStart,
    weekEnd,
    weekRange: `${startStr} – ${endStr}`,
    theme,
    themeHeadline: theme.split('. ')[0].replace(/\.$/, '') + '.',
    love,
    money,
    moodWord: mood.word,
    moodNote: mood.note,
    bestDay,
    moonStartName: moonStart.name,
    moonStartEmoji: moonStart.emoji,
    moonEndName: moonEnd.name,
    moonEndEmoji: moonEnd.emoji,
  };
}

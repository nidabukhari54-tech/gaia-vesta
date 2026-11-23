import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { X, Send, Volume2, Crown } from 'lucide-react';
import { isSupabaseConfigured, supabaseUrl, supabaseAnonKey } from '../lib/supabase';

type ChatLink = { label: string; to: string };
type Msg = { from: 'gaia' | 'user'; text: string; links?: ChatLink[] };
type Intent = { keys: string[]; answer: string; links?: ChatLink[] };

const INTENTS: Intent[] = [
  {
    keys: ['karmic', 'tail', 'repeating pattern', 'keep repeating', 'same pattern'],
    answer:
      'Your karmic tail is the three-number chain at the base of your chart — the root of a lesson, the way it keeps repeating, and its resolution. If the same kind of problem keeps finding you, the tail usually names it. The calculator is completely free.',
    links: [{ label: 'Open the Karmic Tail Calculator', to: '/tools/karmic-tail' }],
  },
  {
    keys: ['compatib', 'partner', 'couple', 'match', 'husband', 'wife', 'boyfriend', 'girlfriend', 'relationship match'],
    answer:
      'The Compatibility Matrix lays two birth dates over one another and scores the bond — love, money and purpose — so you can see where you flow and where you friction. It takes two birth dates and about ten seconds.',
    links: [{ label: 'Check compatibility — free', to: '/tools/compatibility' }],
  },
  {
    keys: ['pdf', 'report', 'download', 'print', 'keepsake'],
    answer:
      'Yes — the full PDF report is free. Draw your chart with the calculator on the homepage, open it, and use the PDF button: you get your chart, every point interpreted, your love, money and life-path lines, karmic tail, family lines and purposes — one keepsake document, no card, no catch.',
    links: [
      { label: 'Draw my chart', to: '/#demo' },
      { label: 'How to read your chart', to: '/tools/how-to-read-destiny-matrix' },
    ],
  },
  {
    keys: ['cosmic', 'price', 'cost', 'paid', 'premium', 'subscription', 'plan', 'pay'],
    answer:
      'Almost everything on Gaia Vesta is free — every chart, every tool, the full interpretations and the PDF report. The one paid plan is Cosmic at $9 a month: it makes your AI deep readings unlimited (free accounts get 5 a month) for people who read charts often. Nothing you can do free today ever moves behind the paywall.',
    links: [{ label: 'See Free vs Cosmic', to: '/#pricing' }],
  },
  {
    keys: ['child', 'kid', 'baby', 'son', 'daughter', 'children', 'parenting'],
    answer:
      "The Children's Matrix reads your child's chart through a parent's eyes — their talents, emotional needs and the way they learn best. Many parents tell us it explains things they always sensed but could not name.",
    links: [{ label: "Open the Children's Matrix", to: '/tools/child-matrix' }],
  },
  {
    keys: ['family', 'mother', 'father', 'parent', 'talent line', 'family lines'],
    answer:
      "Your chart carries two inherited lines — your father's line and your mother's line — and where they cross is the parent–child pattern you live out. The Family Lines tool maps them, plus your talent line and the numbers your chart repeats or misses.",
    links: [{ label: 'Explore Family Lines', to: '/tools/family-lines' }],
  },
  {
    keys: ['angel', '111', '222', '333', '444', '555', '666', '777', '888', '999', '000', 'repeating number', 'seeing'],
    answer:
      'Seeing the same number everywhere — on clocks, receipts, plates? Each angel number carries a traditional meaning, and we have a full page for every one of them, from 000 to 999 and beyond.',
    links: [{ label: 'Browse Angel Numbers', to: '/tools/angel-numbers' }],
  },
  {
    keys: ['moon', 'lunar', 'phase'],
    answer:
      "Today's moon phase shapes the day's energy more than most people realise. Our Moon Phase tool shows the live phase, its illumination, and what it traditionally means for decisions, rest and beginnings.",
    links: [{ label: "See today's Moon Phase", to: '/tools/moon-phase' }],
  },
  {
    keys: ['life path', 'lifepath', 'life-path'],
    answer:
      'Your Life Path Number is the single number most people start with — the road your birth date sets you walking. Our calculator shows yours with its full reading, free.',
    links: [{ label: 'Find my Life Path Number', to: '/tools/life-path' }],
  },
  {
    keys: ['name numerology', 'name number', 'destiny number'],
    answer:
      'Name Numerology reads the vibration of the name you carry every day — the letters add up to a number that colours how the world meets you. Try it with your full name, or the name you are actually called.',
    links: [{ label: 'Try Name Numerology', to: '/tools/name-numerology' }],
  },
  {
    keys: ['year forecast', 'personal year', 'this year', 'next year', '2026', '2025'],
    answer:
      'Your matrix turns with the years — each year lights up different points of your chart, and your Personal Year number sets the theme. The Year Forecast shows both, for any year you choose.',
    links: [
      { label: 'My Year Forecast', to: '/tools/year-forecast' },
      { label: 'My Personal Year', to: '/tools/personal-year' },
    ],
  },
  {
    keys: ['zodiac', 'star sign', 'aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo', 'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'],
    answer:
      'Zodiac compatibility compares two star signs element by element — fire with air, earth with water — across all 78 pairings, each with its own honest reading.',
    links: [{ label: 'Zodiac Compatibility', to: '/tools/zodiac-compatibility' }],
  },
  {
    keys: ['today', 'daily', 'card of the day', 'arcana of the day'],
    answer:
      "Every day carries one arcana's energy. Today's Arcana page draws it for you each morning, with what it asks of you and what it warns against.",
    links: [{ label: "See today's Arcana", to: '/tools/daily-arcana' }],
  },
  {
    keys: ['arcana', 'tarot', 'major arcana', 'archetype'],
    answer:
      'The 22 Major Arcana are the energies your whole chart is woven from — The Fool, The Magician, The Star and the rest. Our encyclopedia gives each one a full page: its gift, its shadow, and what it means at each position of your chart.',
    links: [{ label: 'Meet the 22 Arcana', to: '/arcana' }],
  },
  {
    keys: ['how to read', 'what is', 'destiny matrix', 'understand my chart', 'chart mean', 'how does it work', 'explain'],
    answer:
      'A Destiny Matrix is a chart drawn from your birth date: sixteen points, each holding one of the 22 Major Arcana. Read together, they map your soul purpose, your love and money lines, your karmic tail and your family patterns. Our guide walks you through reading your own chart, point by point — and the calculator itself is free.',
    links: [
      { label: 'How to read your chart', to: '/tools/how-to-read-destiny-matrix' },
      { label: 'Draw my chart — free', to: '/#demo' },
    ],
  },
  {
    keys: ['free', 'really free', 'is it free', 'charge'],
    answer:
      'Truly free — every calculator, every full interpretation, compatibility, family lines, and the complete PDF report. Free accounts even include 5 AI deep readings a month. The only paid thing is Cosmic ($9/month) for unlimited AI readings, and it is entirely optional.',
    links: [{ label: 'See all free tools', to: '/tools' }],
  },
  {
    keys: ['who are you', 'your name', 'gaia', 'about you'],
    answer:
      "I am Gaia, the guide of Gaia Vesta. I walk beside you while you read the chart your birth date drew — pointing to the patterns, the gifts, and the lessons written into it. Ask me about any tool, or tap one of the questions below.",
  },
  {
    keys: ['sign up', 'account', 'login', 'log in', 'save my chart', 'register'],
    answer:
      'A free account lets you save your charts, keep a library of the people you read for, and receive your 5 monthly AI deep readings. Sign-up takes an email and a few seconds — and the demo on the homepage needs no account at all.',
    links: [{ label: 'Create a free account', to: '/auth' }],
  },
  {
    keys: ['tools', 'what can you do', 'help', 'menu', 'options', 'features'],
    answer:
      'Here is what I can walk you to: your personal Destiny Matrix chart, Compatibility, the Karmic Tail, Family Lines, the Children\'s Matrix, Year Forecast, Angel Numbers, Moon Phase, Life Path, Name Numerology, Zodiac Compatibility and today\'s Arcana — every one of them free. The full shelf is on the Tools page.',
    links: [{ label: 'Open all tools', to: '/tools' }],
  },
  {
    keys: ['hello', 'hi', 'hey', 'salam', 'aoa', 'good morning', 'good evening'],
    answer:
      'Hello, and welcome. I am Gaia. Tell me what brings you — a pattern that keeps repeating, a bond you want to understand, a child you want to see more clearly — or tap a question below and I will walk you there.',
  },
];

const FALLBACK: Msg = {
  from: 'gaia',
  text: 'I can guide you through the chart, the tools and the readings. Ask me about your karmic tail, compatibility, your family lines, angel numbers — or whether the PDF is really free (it is). Tap a question below if you like.',
  links: [{ label: 'See all tools', to: '/tools' }],
};

const CHIPS = [
  'Is the PDF really free?',
  'Find my karmic tail',
  'Check compatibility',
  'What is a Destiny Matrix?',
  "Today's arcana",
  "What's in Cosmic?",
];

const GREETING: Msg = {
  from: 'gaia',
  text: "Hello, I'm Gaia — your guide to the Destiny Matrix. Ask me anything about your chart, the tools, or the free PDF report, and I will walk you to the right place.",
};

function answerFor(raw: string): Msg {
  const q = raw.toLowerCase();
  for (const intent of INTENTS) {
    if (intent.keys.some((k) => q.includes(k))) {
      return { from: 'gaia', text: intent.answer, links: intent.links };
    }
  }
  return FALLBACK;
}

// Tries the live gaia-chat edge function first (works for logged-out
// visitors too — the anon key is the bearer). Returns null on ANY
// failure or timeout so the caller silently falls back to the built-in
// keyword answers above. Skipped entirely when Supabase is not
// configured on this deployment.
async function askGaiaLive(
  message: string,
  history: { from: 'gaia' | 'user'; text: string }[],
): Promise<string | null> {
  if (!isSupabaseConfigured || !supabaseUrl || !supabaseAnonKey) return null;
  const ctrl = new AbortController();
  const timer = window.setTimeout(() => ctrl.abort(), 12000);
  try {
    const res = await fetch(`${supabaseUrl}/functions/v1/gaia-chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${supabaseAnonKey}`,
        apikey: supabaseAnonKey,
      },
      body: JSON.stringify({ message, history }),
      signal: ctrl.signal,
    });
    if (!res.ok) return null;
    const data = await res.json().catch(() => null);
    const reply = typeof data?.reply === 'string' ? data.reply.trim() : '';
    return reply || null;
  } catch {
    return null;
  } finally {
    window.clearTimeout(timer);
  }
}

export default function GaiaChat() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([GREETING]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [msgs, typing, open]);

  useEffect(() => {
    const open = () => setOpen(true);
    window.addEventListener('gaia:open-chat', open);
    return () => window.removeEventListener('gaia:open-chat', open);
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    };
  }, []);

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    setSpeaking(false);
  };

  const speak = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    if (speaking) {
      stopSpeaking();
      return;
    }
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 1;
    u.pitch = 1.05;
    u.onend = () => setSpeaking(false);
    u.onerror = () => setSpeaking(false);
    setSpeaking(true);
    window.speechSynthesis.speak(u);
  };

  const send = async (raw?: string) => {
    const text = (raw ?? input).trim();
    if (!text || typing) return;
    setInput('');
    const history = msgs.slice(-8).map((m) => ({ from: m.from, text: m.text }));
    setMsgs((m) => [...m, { from: 'user', text }]);
    setTyping(true);
    const liveReply = await askGaiaLive(text, history);
    if (liveReply) {
      setMsgs((m) => [...m, { from: 'gaia', text: liveReply }]);
      setTyping(false);
      return;
    }
    timerRef.current = window.setTimeout(() => {
      setMsgs((m) => [...m, answerFor(text)]);
      setTyping(false);
    }, 650);
  };

  const close = () => {
    stopSpeaking();
    setOpen(false);
  };

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 group animate-sway"
          aria-label="Ask Gaia — open chat"
        >
          <span className="hidden sm:block bg-night2/90 backdrop-blur border border-goldlight/35 text-cream text-xs font-medium rounded-full pl-4 pr-3 py-2 shadow-xl group-hover:border-goldlight/60 transition-all">
            Ask Gaia
          </span>
          <span className="relative block animate-float">
            <span className="absolute inset-0 rounded-full bg-goldlight/40 animate-ping" />
            <img
              src="/images/gaia-character.webp"
              alt="Gaia"
              className="relative w-14 h-14 rounded-full object-cover object-top border-2 border-goldlight shadow-[0_16px_40px_-10px_rgba(231,200,115,0.65)]"
              loading="lazy"
              decoding="async"
            />
            <span className="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-night" />
          </span>
        </button>
      )}

      {open && (
        <div className="fixed bottom-4 right-4 sm:bottom-5 sm:right-5 z-50 w-[calc(100vw-2rem)] max-w-sm h-[min(620px,80vh)] flex flex-col rounded-3xl bg-night2 border border-goldlight/30 shadow-[0_30px_80px_-20px_rgba(231,200,115,0.45)] overflow-hidden animate-fadeIn">
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3.5 bg-night3/70 border-b border-white/10">
            <img
              src="/images/gaia-character.webp"
              alt="Gaia"
              className="w-11 h-11 rounded-full object-cover object-top border border-goldlight/50"
              loading="lazy"
              decoding="async"
            />
            <div className="flex-1 min-w-0">
              <p className="font-serif text-cream leading-tight">Gaia</p>
              <p className="text-[11px] text-lavdim flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                Your Destiny Matrix guide
              </p>
            </div>
            <button
              onClick={close}
              className="w-8 h-8 rounded-full border border-white/15 text-lav hover:text-cream hover:border-goldlight/40 flex items-center justify-center transition-all"
              aria-label="Close chat"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3.5">
            {msgs.map((m, i) =>
              m.from === 'gaia' ? (
                <div key={i} className="flex gap-2 items-start">
                  <img
                    src="/images/gaia-character.webp"
                    alt=""
                    className="w-7 h-7 rounded-full object-cover object-top border border-goldlight/40 mt-0.5 shrink-0"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="max-w-[85%]">
                    <div className="bg-white/[0.06] border border-white/10 rounded-2xl rounded-tl-md px-3.5 py-2.5 text-sm text-cream/90 leading-relaxed">
                      {m.text}
                      {m.links && (
                        <div className="flex flex-wrap gap-1.5 mt-2.5">
                          {m.links.map((l) =>
                            l.to.startsWith('/#') ? (
                              <a
                                key={l.to}
                                href={l.to}
                                onClick={close}
                                className="text-xs font-medium text-goldlight border border-goldlight/40 rounded-full px-3 py-1.5 hover:bg-goldlight/10 transition-all"
                              >
                                {l.label}
                              </a>
                            ) : (
                              <Link
                                key={l.to}
                                to={l.to}
                                onClick={close}
                                className="text-xs font-medium text-goldlight border border-goldlight/40 rounded-full px-3 py-1.5 hover:bg-goldlight/10 transition-all"
                              >
                                {l.label}
                              </Link>
                            ),
                          )}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => speak(m.text)}
                      className="mt-1 ml-1 inline-flex items-center gap-1 text-[11px] text-lavdim hover:text-goldlight transition-colors"
                      aria-label="Listen to this answer"
                    >
                      <Volume2 className="w-3.5 h-3.5" /> {speaking ? 'Stop' : 'Listen'}
                    </button>
                  </div>
                </div>
              ) : (
                <div key={i} className="flex justify-end">
                  <div className="max-w-[85%] bg-gradient-to-r from-goldlight to-[#C9963C] text-night3 font-medium rounded-2xl rounded-br-md px-3.5 py-2.5 text-sm leading-relaxed">
                    {m.text}
                  </div>
                </div>
              ),
            )}
            {typing && (
              <div className="flex gap-2 items-center">
                <img
                  src="/images/gaia-character.webp"
                  alt=""
                  className="w-7 h-7 rounded-full object-cover object-top border border-goldlight/40"
                  loading="lazy"
                  decoding="async"
                />
                <div className="bg-white/[0.06] border border-white/10 rounded-2xl rounded-tl-md px-3.5 py-3 flex gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-goldlight/70 animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-goldlight/70 animate-bounce" style={{ animationDelay: '0.15s' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-goldlight/70 animate-bounce" style={{ animationDelay: '0.3s' }} />
                </div>
              </div>
            )}
          </div>

          {/* Quick questions */}
          <div className="px-3 pb-2 flex gap-1.5 overflow-x-auto no-scrollbar">
            {CHIPS.map((c) => (
              <button
                key={c}
                onClick={() => send(c)}
                className="whitespace-nowrap text-xs text-goldlight/90 border border-goldlight/30 bg-white/[0.03] rounded-full px-3 py-1.5 hover:bg-goldlight/10 transition-all"
              >
                {c}
              </button>
            ))}
          </div>

          {/* Paid section */}
          <div className="mx-3 mb-2.5 rounded-2xl border border-goldlight/45 bg-gradient-to-r from-goldlight/[0.14] to-purple/25 px-3.5 py-3">
            <div className="flex items-center gap-2">
              <Crown className="w-4 h-4 text-goldlight" />
              <p className="text-xs font-semibold tracking-wide text-cream">COSMIC — THE PAID PLAN</p>
              <span className="ml-auto font-serif text-goldlight">$9/mo</span>
            </div>
            <p className="text-[11px] text-lav/80 mt-1 leading-relaxed">
              Everything free stays free. Cosmic simply makes your AI deep readings unlimited.
            </p>
            <button
              onClick={() => send("What's in Cosmic?")}
              className="text-[11px] font-semibold text-goldlight hover:text-gold transition-colors mt-1"
            >
              See what Cosmic includes →
            </button>
          </div>

          {/* Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send();
            }}
            className="flex items-center gap-2 px-3 pb-3.5"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Gaia anything…"
              className="flex-1 min-w-0 bg-white/[0.05] border border-white/10 rounded-full px-4 py-2.5 text-sm text-cream placeholder:text-lavdim focus:outline-none focus:border-goldlight/50"
            />
            <button
              type="submit"
              className="w-10 h-10 shrink-0 rounded-full bg-gradient-to-r from-goldlight to-[#C9963C] text-night3 flex items-center justify-center hover:shadow-[0_0_18px_rgba(231,200,115,0.5)] transition-all"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}

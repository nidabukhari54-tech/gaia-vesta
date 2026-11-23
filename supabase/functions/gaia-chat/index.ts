// Supabase Edge Function: gaia-chat
// Powers the floating "Ask Gaia" guide chat for ALL visitors, including
// logged-out ones. The frontend calls it with the anon key as the bearer
// token — no user JWT is required.
//
// DEPLOY NOTE: deploy this function with verify_jwt = FALSE (in the
// Supabase dashboard: the function's "Verify JWT" toggle OFF), otherwise
// anonymous visitors' calls are rejected before reaching this code.
//
// Accepts POST { message: string, history?: { from: 'gaia' | 'user', text: string }[] }
// Returns { reply: string }. No quota, no database access.
//
// AI PROVIDER ROUTER: providers are tried in order — Groq, then Gemini,
// then OpenAI — each with a ~20s timeout, moving to the next on any
// non-200 response, timeout or empty reply. If no key is set at all, the
// function returns the honest "AI is not configured" error and the
// frontend silently falls back to its built-in keyword answers.
//
// Deploy:  supabase functions deploy gaia-chat --no-verify-jwt
// Secrets:  supabase secrets set GROQ_API_KEY=... GEMINI_API_KEY=... OPENAI_API_KEY=sk-...

import { serve } from 'https://deno.land/std@0.208.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// --- AI provider router constants ---
const GROQ_MODEL = 'openai/gpt-oss-120b';
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GEMINI_MODEL = 'gemini-2.5-flash';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;
const OPENAI_MODEL = 'gpt-4o-mini';
const OPENAI_URL = 'https://api.openai.com/v1/chat/completions';
const PROVIDER_TIMEOUT_MS = 20_000;

const MAX_MESSAGE_CHARS = 500;
const MAX_HISTORY_ITEMS = 8;

type ChatMessage = { role: 'system' | 'user' | 'assistant'; content: string };

function aiConfigured(): boolean {
  return Boolean(
    Deno.env.get('GROQ_API_KEY') || Deno.env.get('GEMINI_API_KEY') || Deno.env.get('OPENAI_API_KEY'),
  );
}

async function fetchWithTimeout(url: string, init: RequestInit, timeoutMs: number): Promise<Response> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    return await fetch(url, { ...init, signal: ctrl.signal });
  } finally {
    clearTimeout(timer);
  }
}

// OpenAI-compatible chat call (used for both Groq and OpenAI).
async function tryOpenAICompatible(
  provider: string,
  url: string,
  model: string,
  apiKey: string,
  messages: ChatMessage[],
  maxTokens: number,
  temperature: number,
): Promise<string | null> {
  try {
    const res = await fetchWithTimeout(
      url,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({ model, messages, max_tokens: maxTokens, temperature }),
      },
      PROVIDER_TIMEOUT_MS,
    );
    if (!res.ok) {
      console.error(`${provider} error:`, await res.text());
      return null;
    }
    const data = await res.json();
    return data.choices?.[0]?.message?.content?.trim() || null;
  } catch (e) {
    console.error(`${provider} request failed:`, e);
    return null;
  }
}

async function tryGemini(
  apiKey: string,
  messages: ChatMessage[],
  maxTokens: number,
  temperature: number,
): Promise<string | null> {
  try {
    // Gemini format: system text goes to systemInstruction; the rest become
    // contents with role 'user' / 'model'. The first turn must be a user turn.
    const systemText = messages
      .filter((m) => m.role === 'system')
      .map((m) => m.content)
      .join('\n');
    const turns = messages.filter((m) => m.role !== 'system');
    const contents = turns.map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));
    if (contents.length === 0 || contents[0].role !== 'user') {
      contents.unshift({ role: 'user', parts: [{ text: 'Please continue.' }] });
    }

    const body: Record<string, unknown> = {
      contents,
      generationConfig: { maxOutputTokens: maxTokens, temperature },
    };
    if (systemText) {
      body.systemInstruction = { parts: [{ text: systemText }] };
    }

    const res = await fetchWithTimeout(
      GEMINI_URL,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey,
        },
        body: JSON.stringify(body),
      },
      PROVIDER_TIMEOUT_MS,
    );
    if (!res.ok) {
      console.error('Gemini error:', await res.text());
      return null;
    }
    const data = await res.json();
    const parts = data.candidates?.[0]?.content?.parts;
    const text = Array.isArray(parts)
      ? parts.map((p: { text?: string }) => p.text ?? '').join('').trim()
      : '';
    return text || null;
  } catch (e) {
    console.error('Gemini request failed:', e);
    return null;
  }
}

// Tries Groq → Gemini → OpenAI, in that order. Returns the first
// successful reply, or null when every configured provider failed.
async function generateText(
  messages: ChatMessage[],
  maxTokens: number,
  temperature: number,
): Promise<string | null> {
  const groqKey = Deno.env.get('GROQ_API_KEY');
  if (groqKey) {
    const text = await tryOpenAICompatible('Groq', GROQ_URL, GROQ_MODEL, groqKey, messages, maxTokens, temperature);
    if (text) return text;
  }

  const geminiKey = Deno.env.get('GEMINI_API_KEY');
  if (geminiKey) {
    const text = await tryGemini(geminiKey, messages, maxTokens, temperature);
    if (text) return text;
  }

  const openaiKey = Deno.env.get('OPENAI_API_KEY');
  if (openaiKey) {
    const text = await tryOpenAICompatible('OpenAI', OPENAI_URL, OPENAI_MODEL, openaiKey, messages, maxTokens, temperature);
    if (text) return text;
  }

  return null;
}

const SYSTEM_PROMPT = [
  `You are Gaia, the warm guide of the Gaia Vesta website — a Destiny Matrix and numerology site built on the 22 Major Arcana.`,
  `Answer briefly and warmly, in at most about 120 words, in plain text (no markdown headers, no lists unless truly needed).`,
  `Answer from Destiny Matrix and numerology knowledge: the chart is drawn from a birth date, its points hold Major Arcana, and it maps soul purpose, love and money lines, the karmic tail, family lines and life stages.`,
  `When a site tool fits the question, point to exactly ONE tool and include its path in your reply, like this: /tools/karmic-tail.`,
  `Tools: Destiny Matrix chart calculator (/#demo), How to read your chart (/tools/how-to-read-destiny-matrix), Compatibility (/tools/compatibility), Karmic Tail (/tools/karmic-tail), Family Lines (/tools/family-lines), Children's Matrix (/tools/child-matrix), Year Forecast (/tools/year-forecast), Personal Year (/tools/personal-year), Angel Numbers (/tools/angel-numbers), Moon Phase (/tools/moon-phase), Life Path (/tools/life-path), Name Numerology (/tools/name-numerology), Zodiac Compatibility (/tools/zodiac-compatibility), Daily Arcana (/tools/daily-arcana), the 22 Arcana encyclopedia (/arcana), all tools (/tools), pricing (/#pricing).`,
  `Honest facts you may state: every chart, tool, full interpretation and the complete PDF report are free; a free account includes 5 AI deep readings a month; the only paid plan is Cosmic at $9/month, which makes AI deep readings unlimited. Never invent other prices or features.`,
  `Keep it spiritual but grounded — never give medical, legal, or financial advice, and never claim to predict the future with certainty.`,
  `If you cannot help with something, say so gently and suggest a tool or the guide page instead.`,
].join('\n');

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    if (req.method !== 'POST') {
      return json({ error: 'Method not allowed' }, 405);
    }

    if (!aiConfigured()) {
      return json({ error: 'AI is not configured (no AI provider key set).' }, 500);
    }

    const { message, history } = await req.json().catch(() => ({}));
    const text = typeof message === 'string' ? message.trim().slice(0, MAX_MESSAGE_CHARS) : '';
    if (!text) return json({ error: 'Missing message' }, 400);

    const messages: ChatMessage[] = [{ role: 'system', content: SYSTEM_PROMPT }];
    if (Array.isArray(history)) {
      for (const item of history.slice(-MAX_HISTORY_ITEMS)) {
        const itemText = typeof item?.text === 'string' ? item.text.trim().slice(0, MAX_MESSAGE_CHARS) : '';
        if (!itemText) continue;
        messages.push({ role: item.from === 'gaia' ? 'assistant' : 'user', content: itemText });
      }
    }
    messages.push({ role: 'user', content: text });

    const reply = await generateText(messages, 320, 0.7);
    if (!reply) {
      return json({ error: 'AI service unavailable. Please try again later.' }, 502);
    }

    return json({ reply });
  } catch (e) {
    console.error('gaia-chat error:', e);
    return json({ error: 'Something went wrong. Please try again.' }, 500);
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

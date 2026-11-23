// Supabase Edge Function: interpret
// Generates a personalized AI deep reading from a Destiny Matrix chart.
// Enforces the monthly free quota (profiles.ai_queries_used / ai_queries_limit);
// premium plans get unlimited readings.
//
// AI PROVIDER ROUTER: providers are tried in order — Groq, then Gemini,
// then OpenAI — each with a ~20s timeout, moving to the next on any
// non-200 response, timeout or empty reply. The first provider with a
// key configured AND a successful reply wins. If no key is set at all,
// the function returns the honest "AI is not configured" error.
//
// Deploy:  supabase functions deploy interpret
// Secrets:  supabase secrets set GROQ_API_KEY=... GEMINI_API_KEY=... OPENAI_API_KEY=sk-...
//           (SUPABASE_URL / SUPABASE_ANON_KEY are provided by Supabase.)

import { serve } from 'https://deno.land/std@0.208.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

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

const ARCANA_NAMES: Record<number, string> = {
  1: 'The Magician', 2: 'The High Priestess', 3: 'The Empress', 4: 'The Emperor',
  5: 'The Hierophant', 6: 'The Lovers', 7: 'The Chariot', 8: 'Justice',
  9: 'The Hermit', 10: 'The Wheel of Fortune', 11: 'Strength', 12: 'The Hanged Man',
  13: 'Death', 14: 'Temperance', 15: 'The Devil', 16: 'The Tower',
  17: 'The Star', 18: 'The Moon', 19: 'The Sun', 20: 'Judgement',
  21: 'The World', 22: 'The Fool',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;

    if (!aiConfigured()) {
      return json({ error: 'AI is not configured (no AI provider key set).' }, 500);
    }

    // Authenticate the caller
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) return json({ error: 'Unauthorized' }, 401);

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) return json({ error: 'Unauthorized' }, 401);

    // Check quota
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('plan, ai_queries_used, ai_queries_limit')
      .eq('id', user.id)
      .single();
    if (profileError || !profile) return json({ error: 'Profile not found' }, 404);

    // Provider-agnostic entitlement: profiles.plan is the synced cache
    // (written by stripe-webhook / paypal-verify), and an active row in the
    // `subscriptions` table — whichever provider wrote it — also unlocks
    // Cosmic. If the subscriptions table doesn't exist yet (migration 003
    // not applied), the query errors and we fall back to the cache alone.
    let hasActiveSub = false;
    const { data: activeSubs, error: subError } = await supabase
      .from('subscriptions')
      .select('status, current_period_end')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .limit(1);
    if (!subError && activeSubs) {
      hasActiveSub = activeSubs.some(
        (s: { current_period_end?: string | null }) =>
          !s.current_period_end || new Date(s.current_period_end) > new Date(),
      );
    }
    const isPremium = profile.plan === 'premium' || hasActiveSub;
    if (!isPremium && (profile.ai_queries_used ?? 0) >= (profile.ai_queries_limit ?? 5)) {
      return json({ error: 'Monthly AI reading quota reached. Upgrade to Cosmic for unlimited readings.' }, 402);
    }

    const { personName, birthDate, matrix } = await req.json();
    if (!matrix) return json({ error: 'Missing chart data' }, 400);

    const arc = (n: number) => `${n} (${ARCANA_NAMES[n] ?? 'Unknown'})`;
    const prompt = [
      `You are Gaia Vesta, a wise and warm interpreter of the Destiny Matrix, a system based on the 22 Major Arcana of the tarot and numerology.`,
      `Write a personal deep reading for ${personName ?? 'the seeker'}, born ${birthDate ?? 'on an unknown date'}.`,
      ``,
      `Their Destiny Matrix:`,
      `- Soul purpose / comfort point (X): ${arc(matrix.X)}`,
      `- Love line: ${arc(matrix.loveLine.left)} → ${arc(matrix.loveLine.center)} → ${arc(matrix.loveLine.right)}`,
      `- Money line: ${arc(matrix.moneyLine.left)} → ${arc(matrix.moneyLine.center)} → ${arc(matrix.moneyLine.right)}`,
      `- Life path: ${arc(matrix.lifePath.left)} → ${arc(matrix.lifePath.center)} → ${arc(matrix.lifePath.right)}`,
      `- Corner arcana: A=${arc(matrix.A)}, B=${arc(matrix.B)}, C=${arc(matrix.C)}, D=${arc(matrix.D)}`,
      ``,
      `Write 250–400 words in a warm, encouraging tone. Cover: their soul purpose, love patterns, money energy, and one practical piece of guidance for the year ahead.`,
      `Use plain text paragraphs (no markdown headers). End with a short affirmation.`,
      `Keep it spiritual but grounded — never medical, legal, or financial advice.`,
    ].join('\n');

    const reading = await generateText([{ role: 'user', content: prompt }], 800, 0.8);
    if (!reading) {
      return json({ error: 'AI service unavailable. Please try again later.' }, 502);
    }

    // Consume one quota unit for free plans
    if (!isPremium) {
      await supabase
        .from('profiles')
        .update({ ai_queries_used: (profile.ai_queries_used ?? 0) + 1 })
        .eq('id', user.id);
    }

    return json({ reading });
  } catch (e) {
    console.error('interpret error:', e);
    return json({ error: 'Something went wrong generating your reading.' }, 500);
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

// Supabase Edge Function: interpret
// Generates a personalized AI deep reading from a Destiny Matrix chart.
// Enforces the monthly free quota (profiles.ai_queries_used / ai_queries_limit);
// premium plans get unlimited readings.
//
// Deploy:  supabase functions deploy interpret
// Secrets:  supabase secrets set OPENAI_API_KEY=sk-... SUPABASE_URL=... SUPABASE_ANON_KEY=...

import { serve } from 'https://deno.land/std@0.208.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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
    const openaiKey = Deno.env.get('OPENAI_API_KEY');

    if (!openaiKey) {
      return json({ error: 'AI is not configured (missing OPENAI_API_KEY).' }, 500);
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

    const isPremium = profile.plan === 'premium';
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

    const aiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${openaiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 800,
        temperature: 0.8,
      }),
    });

    if (!aiRes.ok) {
      const text = await aiRes.text();
      console.error('OpenAI error:', text);
      return json({ error: 'AI service unavailable. Please try again later.' }, 502);
    }

    const aiData = await aiRes.json();
    const reading: string | undefined = aiData.choices?.[0]?.message?.content?.trim();
    if (!reading) return json({ error: 'AI returned an empty reading.' }, 502);

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

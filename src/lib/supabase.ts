import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

/**
 * True when the Supabase environment variables are present.
 * Public pages (landing, demo, shared charts) work without them;
 * auth and cloud features show a friendly setup notice instead.
 */
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : null;

export function requireSupabase(): SupabaseClient {
  if (!supabase) {
    throw new Error(
      'Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to enable this feature.'
    );
  }
  return supabase;
}

export type Profile = {
  id: string;
  email: string;
  name?: string;
  plan: string;
  stripe_customer_id?: string;
  ai_queries_used: number;
  ai_queries_limit: number;
  family_group_id?: string;
  created_at: string;
};

export type ChartRow = {
  id: string;
  user_id: string;
  person_name: string;
  birth_date: string;
  chart_data: unknown;
  chart_type?: string;
  notes?: string;
  is_shared: boolean;
  shared_link?: string | null;
  created_at: string;
};

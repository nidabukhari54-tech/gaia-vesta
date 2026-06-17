import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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

export type Chart = {
  id: string;
  user_id: string;
  person_name: string;
  birth_date: string;
  chart_data: unknown;
  chart_type?: string;
  notes?: string;
  is_shared: boolean;
  shared_link?: string;
  created_at: string;
};

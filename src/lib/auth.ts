import { requireSupabase } from './supabase';
import type { User, Session, AuthError } from '@supabase/supabase-js';

export type AuthResponse = {
  user: User | null;
  session: Session | null;
  error: AuthError | null;
};

export async function signUp(email: string, password: string): Promise<AuthResponse> {
  const supabase = requireSupabase();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    return { user: null, session: null, error };
  }

  if (data.user) {
    const { error: profileError } = await supabase.from('profiles').insert({
      id: data.user.id,
      email: data.user.email,
      plan: 'free',
      ai_queries_used: 0,
      ai_queries_limit: 5,
    });

    if (profileError) {
      console.error('Error creating profile:', profileError);
    }
  }

  return { user: data.user, session: data.session, error: null };
}

export async function signIn(email: string, password: string): Promise<AuthResponse> {
  const supabase = requireSupabase();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { user: null, session: null, error };
  }

  return { user: data.user, session: data.session, error: null };
}

export async function signOut(): Promise<{ error: AuthError | null }> {
  const supabase = requireSupabase();
  const { error } = await supabase.auth.signOut();
  return { error };
}

export async function getCurrentUser(): Promise<User | null> {
  const supabase = requireSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function getCurrentSession(): Promise<Session | null> {
  const supabase = requireSupabase();
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}

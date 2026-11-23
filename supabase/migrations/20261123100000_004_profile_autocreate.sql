-- 004: Guarantee every auth user has a profiles row.
--
-- APPLY: paste this file into the Supabase SQL editor and Run.
--
-- Why: the app creates the profile row from the browser right after signUp,
-- but with email confirmation ON there is no session yet at that moment, so
-- the profiles RLS policy (insert requires an authenticated session) rejects
-- the insert. Result: confirmed users exist in auth.users with NO profile
-- row, and the interpret edge function answers 404 "Profile not found".
-- Google sign-ins skip the browser insert entirely and hit the same gap.
--
-- Fix in two parts:
-- 1) Backfill a profile row for every existing auth user who lacks one.
-- 2) A trigger that creates the row at signup time, inside the database,
--    regardless of confirmation flow or provider.

-- 1) Backfill existing users (plan/ai limits come from the table defaults).
INSERT INTO public.profiles (id, email)
SELECT u.id, u.email
FROM auth.users u
ON CONFLICT (id) DO NOTHING;

-- 2) Auto-create the profile for every future signup.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

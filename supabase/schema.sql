-- ==============================================================================
-- INNOVISION: Supabase Profiles Table & Row Level Security (RLS) Setup
-- ==============================================================================
-- Run this script in the Supabase Dashboard -> SQL Editor (1-Click Run).
-- It creates the public.profiles table, sets up RLS policies using auth.uid(),
-- and configures automatic profile creation on user registration.
-- ==============================================================================

-- 1. Create the profiles table referencing auth.users(id)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT DEFAULT '',
  phone TEXT DEFAULT '',
  college TEXT DEFAULT '',
  course TEXT DEFAULT '',
  year TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Comment on table and columns for documentation
COMMENT ON TABLE public.profiles IS 'Application-specific profile data for INNOVISION authenticated users.';
COMMENT ON COLUMN public.profiles.id IS 'References the authenticated user in auth.users.';

-- 2. Enable Row Level Security (RLS) on public.profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 3. Drop existing policies if re-running script
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

-- 4. Create RLS Policies strictly checking auth.uid()
-- Policy: Users can only SELECT their own profile
CREATE POLICY "Users can view own profile"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Policy: Users can only INSERT a profile matching their authenticated ID
CREATE POLICY "Users can insert own profile"
  ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Policy: Users can only UPDATE their own profile
CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- 5. Trigger to update updated_at timestamp on record modification
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_profiles_updated_at ON public.profiles;
CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- 6. Trigger to automatically create a profile entry whenever a new user
-- signs up via Google OAuth or Email OTP
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (
    NEW.id,
    COALESCE(
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'name',
      ''
    )
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ==============================================================================
-- Verification Query (Run to confirm table & policies exist)
-- SELECT tablename, rowsecurity FROM pg_tables WHERE tablename = 'profiles';
-- ==============================================================================

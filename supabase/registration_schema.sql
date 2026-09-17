-- ==============================================================================
-- INNOVISION 2026: Registration, Events, Attendance & Role-Based Security Schema
-- ==============================================================================
-- Run this script in the Supabase Dashboard -> SQL Editor (1-Click Run).
-- ==============================================================================

-- 1. USER ROLES TABLE (Participant, Volunteer, Admin)
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'participant' CHECK (role IN ('participant', 'volunteer', 'admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Helper security functions
CREATE OR REPLACE FUNCTION public.get_user_role(p_user_id UUID)
RETURNS TEXT
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT COALESCE(
    (SELECT role FROM public.user_roles WHERE user_id = p_user_id),
    'participant'
  );
$$;

CREATE OR REPLACE FUNCTION public.is_admin(p_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT (public.get_user_role(p_user_id) = 'admin');
$$;

CREATE OR REPLACE FUNCTION public.is_volunteer_or_admin(p_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT (public.get_user_role(p_user_id) IN ('volunteer', 'admin'));
$$;

-- Explicit RLS Policies for user_roles (defined after functions)
DROP POLICY IF EXISTS "Users can read own role" ON public.user_roles;
CREATE POLICY "Users can read own role"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id OR public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Only admins can modify user roles" ON public.user_roles;
CREATE POLICY "Only admins can modify user roles"
  ON public.user_roles FOR ALL
  USING (public.is_admin(auth.uid()));

-- 2. EVENTS TABLE
CREATE TABLE IF NOT EXISTS public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  venue TEXT DEFAULT 'NIT Rourkela',
  capacity INTEGER NOT NULL DEFAULT 100 CHECK (capacity >= 0),
  registered_count INTEGER NOT NULL DEFAULT 0 CHECK (registered_count <= capacity),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_events_slug ON public.events(slug);
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Events are viewable by everyone" ON public.events;
CREATE POLICY "Events are viewable by everyone"
  ON public.events FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Only admins can modify events" ON public.events;
CREATE POLICY "Only admins can modify events"
  ON public.events FOR ALL
  USING (public.is_admin(auth.uid()));

-- Seed baseline Odyssey events if not existing
INSERT INTO public.events (slug, title, description, venue, capacity)
VALUES
  ('hacknitr', 'HackNITR 7.0 Hackathon', 'Flagship 36-hour planetary hackathon.', 'SAC Building', 150),
  ('roborace', 'RoboRace Odyssey', 'High-velocity autonomous rover challenge.', 'Main Arena', 60),
  ('web3-ai', 'Celestial AI & Web3 Summit', 'Symposium on decentralized machine cognition.', 'BBA Auditorium', 120),
  ('game-jam', 'Cosmic Game Jam', '48-hour celestial game dev challenge.', 'CS Lab 3', 80)
ON CONFLICT (slug) DO NOTHING;

-- 3. REGISTRATIONS TABLE (Primary Delegate Ticket)
CREATE TABLE IF NOT EXISTS public.registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  registration_code TEXT UNIQUE NOT NULL,
  qr_payload TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_registrations_user_id ON public.registrations(user_id);
CREATE INDEX IF NOT EXISTS idx_registrations_code ON public.registrations(registration_code);
CREATE INDEX IF NOT EXISTS idx_registrations_qr ON public.registrations(qr_payload);
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users view own registration" ON public.registrations;
CREATE POLICY "Users view own registration"
  ON public.registrations FOR SELECT
  USING (auth.uid() = user_id OR public.is_volunteer_or_admin(auth.uid()));

DROP POLICY IF EXISTS "Users insert own registration" ON public.registrations;
CREATE POLICY "Users insert own registration"
  ON public.registrations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 4. EVENT_REGISTRATIONS TABLE (Event-specific bookings)
CREATE TABLE IF NOT EXISTS public.event_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_id UUID NOT NULL REFERENCES public.registrations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'registered' CHECK (status IN ('registered', 'cancelled', 'waitlisted')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  -- CRITICAL UNIQUE CONSTRAINTS (Database level duplicate prevention)
  CONSTRAINT uq_event_reg_reg_event UNIQUE(registration_id, event_id),
  CONSTRAINT uq_event_reg_user_event UNIQUE(user_id, event_id)
);

CREATE INDEX IF NOT EXISTS idx_event_registrations_user ON public.event_registrations(user_id, event_id);
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users view own event registrations" ON public.event_registrations;
CREATE POLICY "Users view own event registrations"
  ON public.event_registrations FOR SELECT
  USING (auth.uid() = user_id OR public.is_volunteer_or_admin(auth.uid()));

DROP POLICY IF EXISTS "Users insert own event registration" ON public.event_registrations;
CREATE POLICY "Users insert own event registration"
  ON public.event_registrations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 5. ATTENDANCE TABLE (Controlled Check-In)
CREATE TABLE IF NOT EXISTS public.attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_id UUID NOT NULL REFERENCES public.registrations(id) ON DELETE CASCADE,
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  checked_in_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  checked_in_by UUID NOT NULL REFERENCES auth.users(id),
  check_in_type TEXT NOT NULL DEFAULT 'gate',
  -- Prevent double check-in at the database level
  CONSTRAINT uq_attendance_reg_event UNIQUE(registration_id, event_id)
);

CREATE INDEX IF NOT EXISTS idx_attendance_reg ON public.attendance(registration_id, event_id);
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users view own attendance" ON public.attendance;
CREATE POLICY "Users view own attendance"
  ON public.attendance FOR SELECT
  USING (auth.uid() = user_id OR public.is_volunteer_or_admin(auth.uid()));

-- CRITICAL: Only volunteers and admins can insert attendance records. Participants CANNOT!
DROP POLICY IF EXISTS "Only volunteers or admins mark attendance" ON public.attendance;
CREATE POLICY "Only volunteers or admins mark attendance"
  ON public.attendance FOR INSERT
  WITH CHECK (public.is_volunteer_or_admin(auth.uid()));

DROP POLICY IF EXISTS "Only admins can modify attendance" ON public.attendance;
CREATE POLICY "Only admins can modify attendance"
  ON public.attendance FOR UPDATE
  USING (public.is_admin(auth.uid()));

-- 6. ATOMIC STORED PROCEDURE: register_for_event (Concurrency & Capacity Safe)
-- Drops previous signature if existing
DROP FUNCTION IF EXISTS public.register_for_event(UUID, UUID, TEXT, TEXT);

CREATE OR REPLACE FUNCTION public.register_for_event(
  p_event_id UUID,
  p_registration_code TEXT,
  p_qr_payload TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID;
  v_registration_id UUID;
  v_event_record RECORD;
  v_new_event_reg_id UUID;
BEGIN
  -- 1. STRICT AUTHENTICATION ENFORCEMENT: auth.uid() MUST NOT BE NULL
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RETURN jsonb_build_object(
      'success', false,
      'status_code', 401,
      'error_code', 'UNAUTHORIZED',
      'message', 'Authentication required. An active authenticated Supabase session is required.'
    );
  END IF;

  -- Step 1: Ensure/Fetch the authenticated user's primary registration record
  SELECT id INTO v_registration_id
  FROM public.registrations
  WHERE user_id = v_user_id;

  IF v_registration_id IS NULL THEN
    INSERT INTO public.registrations (user_id, registration_code, qr_payload)
    VALUES (v_user_id, p_registration_code, p_qr_payload)
    RETURNING id INTO v_registration_id;
  END IF;

  -- Step 2: Check for existing duplicate registration
  IF EXISTS (
    SELECT 1 FROM public.event_registrations
    WHERE registration_id = v_registration_id AND event_id = p_event_id
  ) THEN
    RETURN jsonb_build_object(
      'success', false,
      'status_code', 409,
      'error_code', 'DUPLICATE_REGISTRATION',
      'message', 'You are already registered for this event.'
    );
  END IF;

  -- Step 3: Concurrency-Safe Capacity Lock with ROW-LEVEL EXCLUSIVE LOCK (FOR UPDATE)
  SELECT id, capacity, registered_count, title
  INTO v_event_record
  FROM public.events
  WHERE id = p_event_id
  FOR UPDATE; -- Prevents concurrent requests from over-subscribing capacity

  IF NOT FOUND THEN
    RETURN jsonb_build_object(
      'success', false,
      'status_code', 404,
      'error_code', 'EVENT_NOT_FOUND',
      'message', 'The specified event was not found.'
    );
  END IF;

  IF v_event_record.registered_count >= v_event_record.capacity THEN
    RETURN jsonb_build_object(
      'success', false,
      'status_code', 409,
      'error_code', 'EVENT_FULL',
      'message', 'Registration closed: event has reached maximum capacity.'
    );
  END IF;

  -- Step 4: Atomic insertion into event_registrations
  INSERT INTO public.event_registrations (registration_id, user_id, event_id, status)
  VALUES (v_registration_id, v_user_id, p_event_id, 'registered')
  RETURNING id INTO v_new_event_reg_id;

  -- Step 5: Atomically increment registered_count
  UPDATE public.events
  SET registered_count = registered_count + 1,
      updated_at = NOW()
  WHERE id = p_event_id;

  RETURN jsonb_build_object(
    'success', true,
    'status_code', 201,
    'registration_id', v_registration_id,
    'event_registration_id', v_new_event_reg_id,
    'event_title', v_event_record.title,
    'registration_code', (SELECT registration_code FROM public.registrations WHERE id = v_registration_id),
    'qr_payload', (SELECT qr_payload FROM public.registrations WHERE id = v_registration_id)
  );
EXCEPTION
  WHEN unique_violation THEN
    RETURN jsonb_build_object(
      'success', false,
      'status_code', 409,
      'error_code', 'DUPLICATE_REGISTRATION',
      'message', 'You are already registered for this event.'
    );
  WHEN OTHERS THEN
    RETURN jsonb_build_object(
      'success', false,
      'status_code', 500,
      'error_code', 'DATABASE_ERROR',
      'message', 'An error occurred during registration. Please try again.'
    );
END;
$$;

-- 7. RESTRICT EXECUTE PERMISSIONS (Security Definer Hardening)
-- Revoke execution from public and anonymous callers; allow only authenticated users & service role
REVOKE EXECUTE ON FUNCTION public.register_for_event(UUID, TEXT, TEXT) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.register_for_event(UUID, TEXT, TEXT) FROM anon;
GRANT EXECUTE ON FUNCTION public.register_for_event(UUID, TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.register_for_event(UUID, TEXT, TEXT) TO service_role;

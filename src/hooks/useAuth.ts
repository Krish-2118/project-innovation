"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User, Session, AuthError } from "@supabase/supabase-js";

interface UseAuthReturn {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signInWithGoogle: (redirectTo?: string) => Promise<{ error: AuthError | null }>;
  signInWithEmailOtp: (email: string, redirectTo?: string) => Promise<{ error: AuthError | null }>;
  verifyEmailOtp: (
    email: string,
    token: string
  ) => Promise<{ session: Session | null; user: User | null; error: AuthError | null }>;
  signOut: () => Promise<{ error: AuthError | null }>;
}

/**
 * React hook providing Supabase Auth state and authentication actions.
 * Exclusively supports Google OAuth and Passwordless Email OTP.
 * Tokens are managed automatically by Supabase and synchronized with SSR cookies.
 */
export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    let authListener: { unsubscribe: () => void } | null = null;

    async function initAuth() {
      try {
        const supabase = createClient();

        // Retrieve initial session
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (mounted) {
          setSession(session);
          setUser(session?.user ?? null);
          setLoading(false);
        }

        // Listen for auth state changes (sign in, sign out, token refresh)
        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
          if (mounted) {
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
          }
        });

        authListener = subscription;
      } catch (err) {
        console.warn("Supabase auth client not yet configured:", err);
        if (mounted) {
          setLoading(false);
        }
      }
    }

    void initAuth();

    return () => {
      mounted = false;
      if (authListener) {
        authListener.unsubscribe();
      }
    };
  }, []);

  /**
   * Initiates Google OAuth flow.
   * Redirects user to Google sign-in and returns to /auth/callback.
   */
  const signInWithGoogle = useCallback(
    async (redirectTo?: string): Promise<{ error: AuthError | null }> => {
      try {
        const supabase = createClient();
        const origin = typeof window !== "undefined" ? window.location.origin : "";
        const targetRedirect = redirectTo
          ? `${origin}/auth/callback?next=${encodeURIComponent(redirectTo)}`
          : `${origin}/auth/callback`;

        const { error } = await supabase.auth.signInWithOAuth({
          provider: "google",
          options: {
            redirectTo: targetRedirect,
          },
        });

        return { error };
      } catch (err) {
        return { error: err as AuthError };
      }
    },
    []
  );

  /**
   * Initiates passwordless email login (sends 6-digit OTP code or magic link).
   */
  const signInWithEmailOtp = useCallback(
    async (email: string, redirectTo?: string): Promise<{ error: AuthError | null }> => {
      try {
        const supabase = createClient();
        const origin = typeof window !== "undefined" ? window.location.origin : "";
        const targetRedirect = redirectTo
          ? `${origin}/auth/callback?next=${encodeURIComponent(redirectTo)}`
          : `${origin}/auth/callback`;

        const { error } = await supabase.auth.signInWithOtp({
          email,
          options: {
            emailRedirectTo: targetRedirect,
            shouldCreateUser: true,
          },
        });

        return { error };
      } catch (err) {
        return { error: err as AuthError };
      }
    },
    []
  );

  /**
   * Verifies the 6-digit OTP token received by the user via email.
   */
  const verifyEmailOtp = useCallback(
    async (
      email: string,
      token: string
    ): Promise<{ session: Session | null; user: User | null; error: AuthError | null }> => {
      try {
        const supabase = createClient();
        const { data, error } = await supabase.auth.verifyOtp({
          email,
          token,
          type: "email",
        });

        if (!error && data?.session) {
          setSession(data.session);
          setUser(data.user);
        }

        return { session: data?.session ?? null, user: data?.user ?? null, error };
      } catch (err) {
        return { session: null, user: null, error: err as AuthError };
      }
    },
    []
  );

  /**
   * Signs out the user and clears session tokens.
   */
  const signOut = useCallback(async (): Promise<{ error: AuthError | null }> => {
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signOut();
      if (!error) {
        setUser(null);
        setSession(null);
      }
      return { error };
    } catch (err) {
      return { error: err as AuthError };
    }
  }, []);

  return {
    user,
    session,
    loading,
    signInWithGoogle,
    signInWithEmailOtp,
    verifyEmailOtp,
    signOut,
  };
}

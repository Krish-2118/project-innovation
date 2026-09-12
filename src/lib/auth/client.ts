import { createClient } from "@/lib/supabase/client";
import type { AuthError, Session, User } from "@supabase/supabase-js";

/**
 * Initiates Google OAuth sign in flow.
 */
export async function signInWithGoogle(
  redirectTo?: string
): Promise<{ error: AuthError | null }> {
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
}

/**
 * Initiates passwordless email OTP / magic link flow.
 */
export async function signInWithEmailOtp(
  email: string,
  redirectTo?: string
): Promise<{ error: AuthError | null }> {
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
}

/**
 * Verifies 6-digit email OTP token.
 */
export async function verifyEmailOtp(
  email: string,
  token: string
): Promise<{ session: Session | null; user: User | null; error: AuthError | null }> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: "email",
    });

    return {
      session: data?.session ?? null,
      user: data?.user ?? null,
      error,
    };
  } catch (err) {
    return { session: null, user: null, error: err as AuthError };
  }
}

/**
 * Signs out the currently authenticated user.
 */
export async function signOutUser(): Promise<{ error: AuthError | null }> {
  try {
    const supabase = createClient();
    const { error } = await supabase.auth.signOut();
    return { error };
  } catch (err) {
    return { error: err as AuthError };
  }
}

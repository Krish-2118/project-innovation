import { createClient } from "@/lib/supabase/server";
import type { User, Session, SupabaseClient } from "@supabase/supabase-js";

/**
 * Retrieves the currently authenticated user on the server.
 * Uses `auth.getUser()` which validates the auth token against Supabase Auth servers.
 */
export async function getCurrentUser(): Promise<User | null> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return null;
    }

    return user;
  } catch (err) {
    console.error("Failed to retrieve current user:", err);
    return null;
  }
}

/**
 * Retrieves the active session on the server.
 */
export async function getCurrentSession(): Promise<Session | null> {
  try {
    const supabase = await createClient();
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error || !session) {
      return null;
    }

    return session;
  } catch (err) {
    console.error("Failed to retrieve current session:", err);
    return null;
  }
}

/**
 * Defense-in-Depth Guard: Enforces that the request has an active authenticated Supabase user.
 * Throws an Error if unauthenticated.
 * Returns the verified user and the server client.
 */
export async function requireAuth(): Promise<{
  user: User;
  supabase: SupabaseClient;
}> {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Error("Unauthorized: Valid Supabase session required");
  }

  return { user, supabase };
}

/**
 * Checks if a given user has administrative privileges.
 * Supports Supabase app_metadata.role and user_metadata.role.
 */
export function checkIsAdmin(user: User): boolean {
  return (
    user.app_metadata?.role === "admin" ||
    user.user_metadata?.role === "admin"
  );
}

/**
 * Defense-in-Depth Guard: Enforces that the request has an active user with admin privileges.
 * Throws an Error with appropriate reason if unauthenticated or unauthorized.
 */
export async function requireAdmin(): Promise<{
  user: User;
  supabase: SupabaseClient;
}> {
  const { user, supabase } = await requireAuth();

  if (!checkIsAdmin(user)) {
    throw new Error("Forbidden: Administrator privileges required");
  }

  return { user, supabase };
}

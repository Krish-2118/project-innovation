"use server";

import { createClient } from "@/lib/supabase/server";
import type { UserProfile, UserProfileUpdateInput } from "@/types/profile";

/**
 * Retrieves the profile of the currently authenticated user.
 * The user ID is strictly derived from the authenticated Supabase session.
 * Never accepts or trusts client-supplied IDs.
 *
 * If the profile does not yet exist (e.g. user registered before DB trigger was installed),
 * it creates the initial profile row for the authenticated user.
 */
export async function getAuthenticatedProfile(): Promise<{
  profile: UserProfile | null;
  email: string | null;
  userId: string | null;
  error: string | null;
}> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        profile: null,
        email: null,
        userId: null,
        error: "Not authenticated. Please sign in to view your profile.",
      };
    }

    // Query the profiles table where id = auth.uid()
    const { data: existingProfile, error: fetchError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();

    if (fetchError) {
      console.error("Error fetching user profile:", fetchError);
      return {
        profile: null,
        email: user.email ?? null,
        userId: user.id,
        error:
          process.env.NODE_ENV === "production"
            ? "Unable to load profile data."
            : fetchError.message,
      };
    }

    // If profile exists, return it
    if (existingProfile) {
      return {
        profile: existingProfile as UserProfile,
        email: user.email ?? null,
        userId: user.id,
        error: null,
      };
    }

    // Auto-create initial profile row if missing
    const initialName =
      (user.user_metadata?.full_name as string) ||
      (user.user_metadata?.name as string) ||
      "";

    const { data: createdProfile, error: insertError } = await supabase
      .from("profiles")
      .insert({
        id: user.id,
        full_name: initialName,
        phone: "",
        college: "",
        course: "",
        year: "",
      })
      .select()
      .single();

    if (insertError) {
      console.error("Error auto-creating profile:", insertError);
      return {
        profile: null,
        email: user.email ?? null,
        userId: user.id,
        error:
          process.env.NODE_ENV === "production"
            ? "Unable to initialize profile record."
            : insertError.message,
      };
    }

    return {
      profile: createdProfile as UserProfile,
      email: user.email ?? null,
      userId: user.id,
      error: null,
    };
  } catch (err: unknown) {
    const msg =
      process.env.NODE_ENV === "production"
        ? "Unexpected server error."
        : err instanceof Error
        ? err.message
        : "Unexpected server error";
    return { profile: null, email: null, userId: null, error: msg };
  }
}

/**
 * Updates application-specific profile data for the authenticated user.
 * Prevents modification of user ID, roles, or any other user's records.
 */
export async function updateAuthenticatedProfile(input: UserProfileUpdateInput): Promise<{
  success: boolean;
  profile: UserProfile | null;
  error: string | null;
}> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        success: false,
        profile: null,
        error: "Authentication required to update profile.",
      };
    }

    // Whitelist only editable application fields
    const sanitizedUpdate: Record<string, string> = {};
    if (input.full_name !== undefined) sanitizedUpdate.full_name = input.full_name.trim();
    if (input.phone !== undefined) sanitizedUpdate.phone = input.phone.trim();
    if (input.college !== undefined) sanitizedUpdate.college = input.college.trim();
    if (input.course !== undefined) sanitizedUpdate.course = input.course.trim();
    if (input.year !== undefined) sanitizedUpdate.year = input.year.trim();

    const { data: updatedProfile, error: updateError } = await supabase
      .from("profiles")
      .update(sanitizedUpdate)
      .eq("id", user.id)
      .select()
      .single();

    if (updateError) {
      return {
        success: false,
        profile: null,
        error:
          process.env.NODE_ENV === "production"
            ? "Unable to update profile. Please verify your inputs."
            : updateError.message,
      };
    }

    return {
      success: true,
      profile: updatedProfile as UserProfile,
      error: null,
    };
  } catch (err: unknown) {
    const msg =
      process.env.NODE_ENV === "production"
        ? "Failed to update profile."
        : err instanceof Error
        ? err.message
        : "Failed to update profile";
    return { success: false, profile: null, error: msg };
  }
}

/**
 * Security Verification: Attempts to query a profile by an arbitrary target user ID.
 * Under PostgreSQL Row Level Security (RLS) with `auth.uid() = id`,
 * querying another user's profile MUST be denied (returns null or empty set).
 */
export async function verifyRlsCrossAccessDenied(targetUserId: string): Promise<{
  denied: boolean;
  message: string;
  returnedData: unknown;
}> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return {
        denied: true,
        message: "Not authenticated. Query blocked.",
        returnedData: null,
      };
    }

    // Attempt to select another user's profile
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", targetUserId)
      .maybeSingle();

    // If RLS is enabled, querying another user's ID returns data = null
    const isDenied = data === null || error !== null;

    return {
      denied: isDenied,
      message: isDenied
        ? "RLS successfully verified: Access denied to foreign user profile."
        : "Warning: Cross-user data was returned. Check RLS policies.",
      returnedData: data,
    };
  } catch {
    return {
      denied: true,
      message: "Query rejected by database.",
      returnedData: null,
    };
  }
}

import { createClient } from "@/lib/supabase/server";

export type UserRole = "participant" | "volunteer" | "admin";

/**
 * Retrieves the security role of a user from user_roles or metadata.
 * Defaults to 'participant'.
 */
export async function getUserRole(userId: string): Promise<UserRole> {
  if (!userId) return "participant";

  try {
    const supabase = await createClient();

    // 1. Check user_roles table
    const { data: roleRecord } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .maybeSingle();

    if (roleRecord?.role) {
      return roleRecord.role as UserRole;
    }

    // 2. Check auth metadata
    const { data: { user } } = await supabase.auth.getUser();
    if (user && user.id === userId) {
      const metaRole =
        (user.app_metadata?.role as string) ||
        (user.user_metadata?.role as string);

      if (metaRole === "admin" || metaRole === "volunteer") {
        return metaRole;
      }
    }

    return "participant";
  } catch (err) {
    console.error("Error retrieving user role:", err);
    return "participant";
  }
}

/**
 * Checks if a user is an authorized volunteer or administrator.
 */
export async function isVolunteerOrAdmin(userId: string): Promise<boolean> {
  const role = await getUserRole(userId);
  return role === "volunteer" || role === "admin";
}

/**
 * Checks if a user is an administrator.
 */
export async function isAdministrator(userId: string): Promise<boolean> {
  const role = await getUserRole(userId);
  return role === "admin";
}

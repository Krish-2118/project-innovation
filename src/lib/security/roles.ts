import { createClient } from "@/lib/supabase/server";

export type UserRole = "participant" | "volunteer" | "admin";

function isConfiguredAdminEmail(email?: string): boolean {
  if (!email) return false;
  const adminEmails = process.env.ADMIN_EMAILS || "";
  const list = adminEmails
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  return list.includes(email.toLowerCase());
}

/**
 * Retrieves the security role of a user from user_roles, app_metadata, or admin email allowlist.
 * STRICT SECURITY: NEVER trusts user_metadata as it is client-writable in Supabase.
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

    // 2. Check auth server-verified user
    const { data: { user } } = await supabase.auth.getUser();
    if (user && user.id === userId) {
      // Check admin email allowlist
      if (isConfiguredAdminEmail(user.email)) {
        return "admin";
      }

      // Check app_metadata (secure, read-only to clients)
      const appRole = user.app_metadata?.role as string;
      if (appRole === "admin" || appRole === "volunteer") {
        return appRole as UserRole;
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

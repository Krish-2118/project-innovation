import { NextResponse } from "next/server";
import { getCurrentUser, checkIsAdmin } from "@/lib/auth/server";

export const dynamic = "force-dynamic";

/**
 * Admin API: GET /api/admin/overview
 * Enforces dual-level verification (Authentication + Admin Authorization).
 */
export async function GET() {
  const user = await getCurrentUser();

  // 1. Authentication check
  if (!user) {
    return NextResponse.json(
      {
        error: "Unauthorized: Administrator session required.",
      },
      { status: 401 }
    );
  }

  // 2. Authorization (role) check
  if (!checkIsAdmin(user)) {
    return NextResponse.json(
      {
        error: "Forbidden: You do not possess administrator privileges.",
        role: user.app_metadata?.role || user.user_metadata?.role || "user",
      },
      { status: 403 }
    );
  }

  // 3. Admin-only data payload
  return NextResponse.json({
    success: true,
    data: {
      adminEmail: user.email,
      adminId: user.id,
      timestamp: new Date().toISOString(),
      systemStatus: "Operational",
      activeRegistrations: 124,
      gateAccessChecked: 87,
    },
  });
}

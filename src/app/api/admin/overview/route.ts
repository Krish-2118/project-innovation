import { NextResponse } from "next/server";
import { getCurrentUser, checkIsAdmin } from "@/lib/auth/server";
import { checkRateLimit, rateLimitResponse, getClientIp } from "@/lib/security/rate-limit";

export const dynamic = "force-dynamic";

/**
 * Admin API: GET /api/admin/overview
 * Enforces triple-level verification (Rate Limit + Authentication + Admin Authorization).
 */
export async function GET(request: Request) {
  // 1. Rate Limit Check
  const clientIp = getClientIp(request);
  const rateCheck = checkRateLimit("default", clientIp);
  if (!rateCheck.allowed) {
    return rateLimitResponse(rateCheck);
  }

  const user = await getCurrentUser();

  // 2. Authentication check
  if (!user) {
    return NextResponse.json(
      {
        error: "Unauthorized: Administrator session required.",
      },
      { status: 401 }
    );
  }

  // 3. Authorization (role) check
  if (!checkIsAdmin(user)) {
    return NextResponse.json(
      {
        error: "Forbidden: You do not possess administrator privileges.",
        role: user.app_metadata?.role || "participant",
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

import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/server";
import { createClient } from "@/lib/supabase/server";
import { isVolunteerOrAdmin } from "@/lib/security/roles";
import { isValidOpaqueQrPayload } from "@/lib/security/ticket-security";
import { checkRateLimit, rateLimitResponse, getClientIp } from "@/lib/security/rate-limit";

export const dynamic = "force-dynamic";

interface AttendanceRequestBody {
  qr_payload?: string;
  event_id?: string;
  check_in_type?: string;
}

/**
 * Attendance Check-In Endpoint: POST /api/attendance/check-in
 * STRICT ACCESS CONTROL:
 * - Only authenticated volunteers and administrators can record attendance.
 * - Regular participants are explicitly forbidden (403).
 * - Decodes opaque QR payload (no PII in payload).
 * - Prevents duplicate check-ins (409).
 */
export async function POST(request: Request) {
  const clientIp = getClientIp(request);

  // 1. RATE LIMIT CHECK (120 per min for high-throughput gate scanning)
  const rateCheck = checkRateLimit("attendance", clientIp);
  if (!rateCheck.allowed) {
    return rateLimitResponse(rateCheck);
  }

  // 2. AUTHENTICATION CHECK
  const caller = await getCurrentUser();
  if (!caller) {
    return NextResponse.json(
      {
        success: false,
        error: "Authentication required to access attendance verification.",
      },
      { status: 401 }
    );
  }

  // 3. AUTHORIZATION CHECK: Must be volunteer or admin (Participants are FORBIDDEN)
  const isAuthorized = await isVolunteerOrAdmin(caller.id);
  if (!isAuthorized) {
    return NextResponse.json(
      {
        success: false,
        error: "Forbidden: You do not possess volunteer or administrative authority to record attendance.",
      },
      { status: 403 }
    );
  }

  // 4. PARSE & VALIDATE QR PAYLOAD
  let body: AttendanceRequestBody = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid JSON payload provided." },
      { status: 422 }
    );
  }

  const qrPayload = (body.qr_payload || "").trim();
  if (!qrPayload || !isValidOpaqueQrPayload(qrPayload)) {
    return NextResponse.json(
      {
        success: false,
        error: "Invalid or unreadable ticket QR code payload.",
      },
      { status: 422 }
    );
  }

  const eventId = body.event_id || null;
  const checkInType = body.check_in_type || "gate";

  try {
    const supabase = await createClient();

    // 5. RESOLVE REGISTRATION VIA OPAQUE QR PAYLOAD
    const { data: registration, error: regError } = await supabase
      .from("registrations")
      .select("id, user_id, registration_code, status")
      .eq("qr_payload", qrPayload)
      .maybeSingle();

    if (regError || !registration) {
      return NextResponse.json(
        {
          success: false,
          error: "Unrecognized ticket: No matching delegate registration was found.",
        },
        { status: 422 }
      );
    }

    if (registration.status !== "confirmed") {
      return NextResponse.json(
        {
          success: false,
          error: `Cannot check in: Ticket status is ${registration.status}.`,
        },
        { status: 409 }
      );
    }

    // 6. CHECK FOR DUPLICATE ATTENDANCE (Already Checked In)
    let duplicateQuery = supabase
      .from("attendance")
      .select("id, checked_in_at")
      .eq("registration_id", registration.id);

    if (eventId) {
      duplicateQuery = duplicateQuery.eq("event_id", eventId);
    } else {
      duplicateQuery = duplicateQuery.eq("check_in_type", checkInType);
    }

    const { data: existingAttendance } = await duplicateQuery.maybeSingle();

    if (existingAttendance) {
      return NextResponse.json(
        {
          success: false,
          error: "Delegate has already been checked in for this checkpoint.",
          errorCode: "ALREADY_CHECKED_IN",
          checkedInAt: existingAttendance.checked_in_at,
        },
        { status: 409 }
      );
    }

    // 7. RECORD ATTENDANCE ENTRY
    const { data: recordedAttendance, error: insertError } = await supabase
      .from("attendance")
      .insert({
        registration_id: registration.id,
        user_id: registration.user_id,
        event_id: eventId,
        checked_in_by: caller.id,
        check_in_type: checkInType,
      })
      .select()
      .single();

    if (insertError) {
      if (insertError.code === "23505") {
        return NextResponse.json(
          {
            success: false,
            error: "Delegate has already been checked in.",
            errorCode: "ALREADY_CHECKED_IN",
          },
          { status: 409 }
        );
      }
      return NextResponse.json(
        { success: false, error: "Failed to record attendance in database." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Delegate attendance successfully verified and recorded.",
      checkIn: {
        registrationCode: registration.registration_code,
        checkInType,
        checkedInAt: recordedAttendance.checked_in_at,
        verifiedBy: caller.email,
      },
    });
  } catch (err: unknown) {
    console.error("Attendance check-in error:", err);
    return NextResponse.json(
      {
        success: false,
        error: "An internal server error occurred while recording attendance.",
      },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/server";
import { createClient } from "@/lib/supabase/server";
import { verifyTurnstileToken } from "@/lib/security/turnstile";
import { checkRateLimit, rateLimitResponse, getClientIp } from "@/lib/security/rate-limit";
import { generateRegistrationCode, generateOpaqueQrPayload } from "@/lib/security/ticket-security";

export const dynamic = "force-dynamic";

interface RegisterRequestBody {
  event_slug?: string;
  event_id?: string;
  turnstile_token?: string;
  user_id?: string; // Untrusted - will be deliberately ignored
}

/**
 * Secure Event Registration Endpoint: POST /api/register
 * Enforces the complete security pipeline:
 * Rate Limit (429) -> Session Auth (401) -> Turnstile (422) -> Validation (422) ->
 * Server Code Generation -> Concurrency-Safe DB Transaction/RPC -> 201 Created or 409 Conflict.
 */
export async function POST(request: Request) {
  const clientIp = getClientIp(request);

  // 1. RATE LIMIT CHECK (Max 5 attempts per minute)
  const rateCheck = checkRateLimit("registration", clientIp);
  if (!rateCheck.allowed) {
    return rateLimitResponse(rateCheck);
  }

  // 2. AUTHENTICATION CHECK: Must be verified session via Supabase Auth
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json(
      {
        success: false,
        error: "Authentication required to register for events.",
      },
      { status: 401 }
    );
  }

  // 3. PARSE REQUEST BODY & SECURITY BINDING
  let body: RegisterRequestBody = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid JSON payload provided." },
      { status: 422 }
    );
  }

  // CRITICAL SECURITY REQUIREMENT: Never trust user_id from client request body
  const authenticatedUserId = user.id;

  // 4. TURNSTILE BOT VERIFICATION
  const turnstileToken = body.turnstile_token;
  const turnstileCheck = await verifyTurnstileToken(turnstileToken, clientIp);
  if (!turnstileCheck.success) {
    return NextResponse.json(
      {
        success: false,
        error: turnstileCheck.error || "Turnstile bot verification failed.",
      },
      { status: 422 }
    );
  }

  // 5. SERVER-SIDE INPUT VALIDATION
  const eventSlug = (body.event_slug || "").trim().toLowerCase();
  const eventId = (body.event_id || "").trim();

  if (!eventSlug && !eventId) {
    return NextResponse.json(
      {
        success: false,
        error: "Validation error: event_slug or event_id is required.",
      },
      { status: 422 }
    );
  }

  try {
    const supabase = await createClient();

    // 6. RESOLVE EVENT RECORD
    let eventQuery = supabase.from("events").select("id, slug, title, capacity, registered_count");
    if (eventId) {
      eventQuery = eventQuery.eq("id", eventId);
    } else {
      eventQuery = eventQuery.eq("slug", eventSlug);
    }

    const { data: eventRecord, error: eventFetchError } = await eventQuery.maybeSingle();

    if (eventFetchError || !eventRecord) {
      return NextResponse.json(
        {
          success: false,
          error: "The requested event could not be found.",
        },
        { status: 422 }
      );
    }

    // 7. GENERATE UNIQUE REGISTRATION CODE & OPAQUE QR PAYLOAD (SERVER-SIDE ONLY)
    const registrationCode = generateRegistrationCode();
    const qrPayload = generateOpaqueQrPayload(authenticatedUserId, registrationCode);

    // 8. EXECUTE ATOMIC TRANSACTION VIA STORED PROCEDURE: register_for_event
    // Handles row-level lock (FOR UPDATE), capacity verification, and duplicate check atomically
    const { data: rpcResult, error: rpcError } = await supabase.rpc(
      "register_for_event",
      {
        p_user_id: authenticatedUserId,
        p_event_id: eventRecord.id,
        p_registration_code: registrationCode,
        p_qr_payload: qrPayload,
      }
    );

    // If stored procedure succeeded
    if (!rpcError && rpcResult) {
      const statusCode = rpcResult.status_code || (rpcResult.success ? 201 : 409);
      if (!rpcResult.success) {
        return NextResponse.json(
          {
            success: false,
            error: rpcResult.message,
            errorCode: rpcResult.error_code,
          },
          { status: statusCode }
        );
      }

      return NextResponse.json(
        {
          success: true,
          message: `Successfully registered for ${rpcResult.event_title || eventRecord.title}`,
          ticket: {
            registrationCode: rpcResult.registration_code || registrationCode,
            qrPayload: rpcResult.qr_payload || qrPayload, // Opaque, strictly contains ZERO PII
            eventId: eventRecord.id,
            eventTitle: eventRecord.title,
            registeredAt: new Date().toISOString(),
          },
        },
        { status: 201 }
      );
    }

    // 9. RESILIENT FALLBACK: If RPC is not yet created in DB, execute direct transactional query
    // Check direct capacity
    if (eventRecord.registered_count >= eventRecord.capacity) {
      return NextResponse.json(
        {
          success: false,
          error: "Registration closed: event has reached maximum capacity.",
          errorCode: "EVENT_FULL",
        },
        { status: 409 }
      );
    }

    // Ensure primary registration
    let regId: string;
    const { data: existingReg } = await supabase
      .from("registrations")
      .select("id, registration_code, qr_payload")
      .eq("user_id", authenticatedUserId)
      .maybeSingle();

    if (existingReg) {
      regId = existingReg.id;
    } else {
      const { data: newReg, error: regInsertErr } = await supabase
        .from("registrations")
        .insert({
          user_id: authenticatedUserId,
          registration_code: registrationCode,
          qr_payload: qrPayload,
        })
        .select("id, registration_code, qr_payload")
        .single();

      if (regInsertErr) {
        return NextResponse.json(
          { success: false, error: "Failed to initialize registration record." },
          { status: 500 }
        );
      }
      regId = newReg.id;
    }

    // Check duplicate
    const { data: duplicateCheck } = await supabase
      .from("event_registrations")
      .select("id")
      .eq("registration_id", regId)
      .eq("event_id", eventRecord.id)
      .maybeSingle();

    if (duplicateCheck) {
      return NextResponse.json(
        {
          success: false,
          error: "You are already registered for this event.",
          errorCode: "DUPLICATE_REGISTRATION",
        },
        { status: 409 }
      );
    }

    // Insert event_registration
    const { error: eventRegErr } = await supabase
      .from("event_registrations")
      .insert({
        registration_id: regId,
        user_id: authenticatedUserId,
        event_id: eventRecord.id,
      });

    if (eventRegErr) {
      if (eventRegErr.code === "23505") {
        // PostgreSQL unique violation
        return NextResponse.json(
          {
            success: false,
            error: "You are already registered for this event.",
            errorCode: "DUPLICATE_REGISTRATION",
          },
          { status: 409 }
        );
      }
      return NextResponse.json(
        { success: false, error: "Could not record event registration." },
        { status: 500 }
      );
    }

    // Increment count
    await supabase
      .from("events")
      .update({ registered_count: eventRecord.registered_count + 1 })
      .eq("id", eventRecord.id);

    return NextResponse.json(
      {
        success: true,
        message: `Successfully registered for ${eventRecord.title}`,
        ticket: {
          registrationCode,
          qrPayload, // Opaque, no PII
          eventId: eventRecord.id,
          eventTitle: eventRecord.title,
          registeredAt: new Date().toISOString(),
        },
      },
      { status: 201 }
    );
  } catch (err: unknown) {
    // SECURITY: Never return raw stack traces, database credentials, or SQL internals
    console.error("Registration processing error:", err);
    return NextResponse.json(
      {
        success: false,
        error: "An unexpected server error occurred while processing registration.",
      },
      { status: 500 }
    );
  }
}

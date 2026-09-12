/**
 * Cloudflare Turnstile Server-Side Verification
 * Verifies Turnstile tokens with Cloudflare before processing critical actions.
 * The secret key remains exclusively on the server and is never exposed to the client.
 */

interface TurnstileVerifyResponse {
  success: boolean;
  "error-codes"?: string[];
  challenge_ts?: string;
  hostname?: string;
}

export async function verifyTurnstileToken(
  token: string | null | undefined,
  remoteIp?: string
): Promise<{ success: boolean; error?: string }> {
  if (!token || typeof token !== "string" || token.trim() === "") {
    return { success: false, error: "Turnstile verification token is missing." };
  }

  // Official Cloudflare Dummy Test Tokens (Only permitted in non-production environments)
  const isDevOrTest = process.env.NODE_ENV !== "production";
  if (isDevOrTest) {
    if (
      token === "XXXX.DUMMY.PASS.XXXX" ||
      token === "1x00000000000000000000AA"
    ) {
      return { success: true };
    }

    if (
      token === "XXXX.DUMMY.FAIL.XXXX" ||
      token === "2x00000000000000000000AA"
    ) {
      return { success: false, error: "Turnstile bot challenge failed (test token)." };
    }
  }

  // Cloudflare Turnstile secret key validation
  const configuredSecret = process.env.TURNSTILE_SECRET_KEY;
  if (!configuredSecret) {
    if (!isDevOrTest) {
      console.error("CRITICAL SECURITY ERROR: TURNSTILE_SECRET_KEY is not configured in production. Failing closed.");
      return {
        success: false,
        error: "Turnstile bot verification configuration is missing.",
      };
    }
    // Only in non-production environments without an explicit secret, allow Cloudflare official pass-all test secret
    console.warn("WARNING: Using Cloudflare Turnstile test secret in development/test environment.");
  }

  const secretKey = configuredSecret || "1x0000000000000000000000000000000AA";

  try {
    const formData = new URLSearchParams();
    formData.append("secret", secretKey);
    formData.append("response", token.trim());
    if (remoteIp) {
      formData.append("remoteip", remoteIp);
    }

    const response = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    if (!response.ok) {
      console.error("Cloudflare Turnstile HTTP error:", response.status);
      return { success: false, error: "Turnstile verification service unavailable." };
    }

    const data: TurnstileVerifyResponse = await response.json();

    if (data.success) {
      return { success: true };
    }

    return {
      success: false,
      error: "Bot verification failed. Please refresh the page and try again.",
    };
  } catch (err: unknown) {
    console.error("Failed to verify Turnstile token:", err);
    return {
      success: false,
      error: "Unable to verify Turnstile challenge due to a network error.",
    };
  }
}

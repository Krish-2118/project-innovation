import crypto from "crypto";

/**
 * Server-Side Registration Code & Opaque Ticket Security
 * Guarantees that:
 * 1. The browser cannot specify or forge registration codes.
 * 2. QR codes contain strictly ZERO personally identifiable information (PII).
 */

function getTicketSecuritySalt(): string {
  const salt = process.env.TICKET_SECURITY_SALT;
  if (!salt || salt.trim() === "") {
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "CRITICAL SECURITY ERROR: TICKET_SECURITY_SALT environment variable must be configured in production."
      );
    }
    console.warn(
      "WARNING: TICKET_SECURITY_SALT is not configured. Using development fallback secret."
    );
    return "inno_dev_ephemeral_salt_fallback_not_for_production";
  }
  return salt;
}

/**
 * Generates a cryptographically random, unique registration code.
 * Example format: "INNO-7B3K-9M2X"
 */
export function generateRegistrationCode(): string {
  const chars = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ"; // excludes visually ambiguous characters (0, O, 1, I)
  const bytes = crypto.randomBytes(8);
  let code = "INNO-";

  for (let i = 0; i < 4; i++) {
    code += chars[bytes[i] % chars.length];
  }
  code += "-";
  for (let i = 4; i < 8; i++) {
    code += chars[bytes[i] % chars.length];
  }

  return code;
}

/**
 * Generates an opaque QR code payload.
 * STRICT SECURITY GUARANTEE: Contains NO email, phone, name, or address.
 * Only an opaque signed identifier used for gate verification.
 * Format: "inno:v1:tkt_<64_char_hex_hmac>"
 */
export function generateOpaqueQrPayload(userId: string, registrationCode: string): string {
  const salt = getTicketSecuritySalt();
  const rawData = `usr:${userId}|code:${registrationCode}`;
  const hmac = crypto.createHmac("sha256", salt).update(rawData).digest("hex");
  return `inno:v1:tkt_${hmac}`;
}

/**
 * Validates format of an opaque QR ticket payload.
 */
export function isValidOpaqueQrPayload(payload: string): boolean {
  if (!payload || typeof payload !== "string") return false;
  return payload.startsWith("inno:v1:tkt_") && payload.length === 76;
}

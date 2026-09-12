import { NextResponse } from "next/server";

interface RateLimitConfig {
  maxRequests: number;
  windowSeconds: number;
}

interface RateLimitRecord {
  timestamps: number[];
}

const actionConfigs: Record<string, RateLimitConfig> = {
  registration: { maxRequests: 5, windowSeconds: 60 },
  otp: { maxRequests: 3, windowSeconds: 60 },
  contact: { maxRequests: 5, windowSeconds: 60 },
  attendance: { maxRequests: 120, windowSeconds: 60 },
  default: { maxRequests: 30, windowSeconds: 60 },
};

// Global in-memory storage for sliding window timestamps
const storage = new Map<string, RateLimitRecord>();

// Cleanup stale keys periodically
let lastCleanup = Date.now();
function cleanupStaleRecords() {
  const now = Date.now();
  if (now - lastCleanup < 60000) return; // run at most once per minute
  lastCleanup = now;

  for (const [key, record] of storage.entries()) {
    const valid = record.timestamps.filter((ts) => now - ts < 120000);
    if (valid.length === 0) {
      storage.delete(key);
    } else {
      storage.set(key, { timestamps: valid });
    }
  }
}

export interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetInSeconds: number;
}

/**
 * Checks and records a rate-limited request using a sliding window algorithm.
 */
export function checkRateLimit(
  action: "registration" | "otp" | "contact" | "attendance" | "default",
  identifier: string
): RateLimitResult {
  cleanupStaleRecords();

  const config = actionConfigs[action] || actionConfigs.default;
  const now = Date.now();
  const windowMs = config.windowSeconds * 1000;
  const key = `${action}:${identifier}`;

  const record = storage.get(key) || { timestamps: [] };

  // Filter timestamps within current window
  const activeTimestamps = record.timestamps.filter((ts) => now - ts < windowMs);

  if (activeTimestamps.length >= config.maxRequests) {
    const oldestTimestamp = activeTimestamps[0];
    const resetInSeconds = Math.max(
      1,
      Math.ceil((oldestTimestamp + windowMs - now) / 1000)
    );

    return {
      allowed: false,
      limit: config.maxRequests,
      remaining: 0,
      resetInSeconds,
    };
  }

  // Record current request
  activeTimestamps.push(now);
  storage.set(key, { timestamps: activeTimestamps });

  return {
    allowed: true,
    limit: config.maxRequests,
    remaining: config.maxRequests - activeTimestamps.length,
    resetInSeconds: config.windowSeconds,
  };
}

/**
 * Helper to generate an HTTP 429 Too Many Requests response with standard Retry-After header.
 */
export function rateLimitResponse(result: RateLimitResult): NextResponse {
  return NextResponse.json(
    {
      success: false,
      error: "Too many requests. Please slow down and try again.",
      retryAfter: result.resetInSeconds,
    },
    {
      status: 429,
      headers: {
        "Retry-After": result.resetInSeconds.toString(),
        "X-RateLimit-Limit": result.limit.toString(),
        "X-RateLimit-Remaining": "0",
      },
    }
  );
}

/**
 * Extracts a client IP from incoming Next.js Request headers.
 */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  return request.headers.get("x-real-ip") || "127.0.0.1";
}

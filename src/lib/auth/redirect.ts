/**
 * Centralized Route & Redirect Security Utilities for INNOVISION
 */

/**
 * Sanitizes redirect target strictly ensuring internal relative paths only.
 * Prevents Open Redirect attacks (e.g. //evil.com, /\evil.com, https://..., javascript:).
 */
export function sanitizeRedirectUrl(target: string | null | undefined): string {
  if (!target) return "/";
  const trimmed = target.trim();

  // Must begin with a single forward slash and cannot be protocol-relative (//) or backslash (/\)
  if (!trimmed.startsWith("/") || trimmed.startsWith("//") || trimmed.startsWith("/\\")) {
    return "/";
  }

  // Prevent embedded protocol schemes or bypasses
  if (
    trimmed.includes("://") ||
    trimmed.toLowerCase().includes("javascript:") ||
    trimmed.toLowerCase().includes("data:")
  ) {
    return "/";
  }

  return trimmed;
}

/**
 * Checks if a pathname matches public routes (open to everyone without authentication).
 */
export function isPublicPath(pathname: string): boolean {
  if (pathname === "/") return true;

  const publicPrefixes = [
    "/events",
    "/schedule",
    "/sponsors",
    "/gallery",
    "/about",
    "/contact",
    "/login",
    "/auth",
  ];

  return publicPrefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}

/**
 * Checks if a pathname is an Admin route (requires authenticated user with admin privileges).
 */
export function isAdminPath(pathname: string): boolean {
  return (
    pathname === "/admin" ||
    pathname.startsWith("/admin/") ||
    pathname === "/api/admin" ||
    pathname.startsWith("/api/admin/")
  );
}

/**
 * Checks if a pathname is an Authenticated route (requires valid user session).
 */
export function isAuthenticatedPath(pathname: string): boolean {
  const protectedPrefixes = [
    "/profile",
    "/register",
    "/my-registration",
    "/ticket",
    "/dashboard",
  ];

  return protectedPrefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}

/**
 * Checks if a pathname is a Protected API route that must return 401 JSON instead of redirecting.
 */
export function isProtectedApiPath(pathname: string): boolean {
  if (pathname.startsWith("/api/admin")) return true;
  if (pathname === "/api/register" || pathname.startsWith("/api/register/")) return true;
  if (pathname === "/api/attendance" || pathname.startsWith("/api/attendance/")) return true;
  return false;
}

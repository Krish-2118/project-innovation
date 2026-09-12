import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import {
  sanitizeRedirectUrl,
  isAuthenticatedPath,
  isAdminPath,
  isProtectedApiPath,
} from "@/lib/auth/redirect";

/**
 * Normalizes Supabase URL by removing trailing slashes or /rest/v1 path.
 */
function sanitizeSupabaseUrl(url: string): string {
  return url.trim().replace(/\/rest\/v1\/?$/, "").replace(/\/+$/, "");
}

/**
 * Updates the user's Supabase session and enforces route protection.
 * Follows official Supabase SSR guidelines by validating session with auth.getUser().
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Gracefully bypass if environment variables are not yet configured
  if (!rawUrl || !supabaseKey || rawUrl.includes("placeholder-project")) {
    return supabaseResponse;
  }

  const supabaseUrl = sanitizeSupabaseUrl(rawUrl);
  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        supabaseResponse = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  // IMPORTANT: Do NOT merely check cookie presence.
  // Validate token with Supabase Auth server.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname, search } = request.nextUrl;

  // Helper to copy refreshed cookies to redirect or error responses
  const withCookies = (res: NextResponse) => {
    supabaseResponse.cookies.getAll().forEach((c) => {
      res.cookies.set(c.name, c.value, c);
    });
    return res;
  };

  // Case 1: Unauthenticated request to protected route
  if (!user) {
    // Protected API route -> 401 Unauthorized JSON
    if (isProtectedApiPath(pathname)) {
      return withCookies(
        NextResponse.json(
          {
            error: "Unauthorized: Active session required",
            authenticated: false,
          },
          { status: 401 }
        )
      );
    }

    // Protected web pages -> Redirect to /login with sanitized internal destination
    if (isAuthenticatedPath(pathname) || isAdminPath(pathname)) {
      const fullTarget = sanitizeRedirectUrl(`${pathname}${search}`);
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", fullTarget);
      return withCookies(NextResponse.redirect(loginUrl));
    }
  }

  // Case 2: Authenticated request to Admin route -> Check admin role
  if (user && isAdminPath(pathname)) {
    const isAdmin =
      user.app_metadata?.role === "admin" ||
      user.user_metadata?.role === "admin";

    if (!isAdmin) {
      if (pathname.startsWith("/api/")) {
        return withCookies(
          NextResponse.json(
            {
              error: "Forbidden: Administrator privileges required",
              role: user.app_metadata?.role || "user",
            },
            { status: 403 }
          )
        );
      }

      // Web page: redirect non-admin to dashboard with informative query
      const forbiddenRedirect = new URL("/dashboard", request.url);
      forbiddenRedirect.searchParams.set("error", "admin_required");
      return withCookies(NextResponse.redirect(forbiddenRedirect));
    }
  }

  return supabaseResponse;
}

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sanitizeRedirectUrl } from "@/lib/auth/redirect";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  // Sanitize redirect target to prevent open redirect vulnerabilities
  const safeNext = sanitizeRedirectUrl(next);
  // Default to home page ("/") after login; preserve redirect only for specific event registrations
  const finalRedirect = safeNext.startsWith("/register/") ? safeNext : "/";

  if (code) {
    try {
      const supabase = await createClient();
      const { error } = await supabase.auth.exchangeCodeForSession(code);

      if (!error) {
        const forwardedHost = request.headers.get("x-forwarded-host");
        const isLocalEnv = process.env.NODE_ENV === "development";

        if (isLocalEnv) {
          return NextResponse.redirect(`${origin}${finalRedirect}`);
        } else if (forwardedHost) {
          return NextResponse.redirect(`https://${forwardedHost}${finalRedirect}`);
        } else {
          return NextResponse.redirect(`${origin}${finalRedirect}`);
        }
      }
    } catch (err) {
      console.error("Auth callback error:", err);
    }
  }

  // If code exchange failed or no code present, redirect to an auth error page
  return NextResponse.redirect(`${origin}/auth/auth-error?error=ExchangeFailed`);
}

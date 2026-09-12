import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sanitizeRedirectUrl } from "@/lib/auth/redirect";
import type { EmailOtpType } from "@supabase/supabase-js";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = searchParams.get("next") ?? "/";

  // Sanitize redirect target to ensure internal relative path
  const finalRedirect = sanitizeRedirectUrl(next);

  const getRedirectUrl = (path: string) => {
    const forwardedHost = request.headers.get("x-forwarded-host");
    const isLocalEnv = process.env.NODE_ENV === "development";

    if (isLocalEnv) {
      return `${origin}${path}`;
    } else if (forwardedHost) {
      return `https://${forwardedHost}${path}`;
    } else {
      return `${origin}${path}`;
    }
  };

  try {
    const supabase = await createClient();

    // Flow 1: PKCE Code Exchange (Google OAuth & PKCE Magic Links)
    if (code) {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error) {
        return NextResponse.redirect(getRedirectUrl(finalRedirect));
      }
      console.error("exchangeCodeForSession error:", error);
    }

    // Flow 2: Token Hash Verification (Email Magic Links)
    if (token_hash && type) {
      const { error } = await supabase.auth.verifyOtp({
        token_hash,
        type,
      });
      if (!error) {
        return NextResponse.redirect(getRedirectUrl(finalRedirect));
      }
      console.error("verifyOtp error:", error);
    }
  } catch (err) {
    console.error("Auth callback error:", err);
  }

  // If code exchange or token verification failed, redirect to auth error page
  return NextResponse.redirect(`${origin}/auth/auth-error?error=ExchangeFailed`);
}


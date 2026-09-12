"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import {
  Sparkles,
  Mail,
  ArrowRight,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Loader2,
  LogOut,
  ShieldCheck,
} from "lucide-react";
import { sanitizeRedirectUrl } from "@/lib/auth/redirect";

/**
 * Categorizes and formats Supabase error messages into clean user-friendly text.
 */
function formatAuthError(error: unknown): string {
  if (!error) return "";
  const message =
    typeof error === "object" && error !== null && "message" in error
      ? String((error as { message: unknown }).message)
      : String(error);

  const lower = message.toLowerCase();

  if (
    lower.includes("rate limit") ||
    lower.includes("too many requests") ||
    lower.includes("over_email_send_rate_limit")
  ) {
    return "Too many attempts. Please wait a moment before requesting another magic link.";
  }
  if (
    lower.includes("network") ||
    lower.includes("failed to fetch") ||
    lower.includes("fetch failed")
  ) {
    return "Network connection error. Please check your internet connection and try again.";
  }

  return message || "An authentication error occurred. Please try again.";
}

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawRedirect = searchParams.get("redirect") || searchParams.get("next");
  const targetRedirect = sanitizeRedirectUrl(rawRedirect);

  const {
    user,
    loading: authLoading,
    signInWithGoogle,
    signInWithEmailOtp,
    signOut,
  } = useAuth();

  // Stage state: 'email' or 'link-sent'
  const [stage, setStage] = useState<"email" | "link-sent">("email");
  const [email, setEmail] = useState("");

  // Loading & status states
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isSendingLink, setIsSendingLink] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successInfo, setSuccessInfo] = useState<string | null>(null);

  // Resend cooldown timer (60 seconds)
  const [cooldown, setCooldown] = useState(0);

  // Cooldown countdown timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  // Handler: Continue with Google
  const handleGoogleSignIn = async () => {
    setErrorMessage(null);
    setIsGoogleLoading(true);
    try {
      const { error } = await signInWithGoogle(targetRedirect);
      if (error) {
        setErrorMessage(formatAuthError(error));
        setIsGoogleLoading(false);
      }
    } catch (err) {
      setErrorMessage(formatAuthError(err));
      setIsGoogleLoading(false);
    }
  };

  // Handler: Send Magic Link
  const handleSendMagicLink = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanEmail = email.trim();

    if (!cleanEmail || !cleanEmail.includes("@")) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    setErrorMessage(null);
    setIsSendingLink(true);

    try {
      const { error } = await signInWithEmailOtp(cleanEmail, targetRedirect);

      if (error) {
        setErrorMessage(formatAuthError(error));
        setIsSendingLink(false);
      } else {
        setStage("link-sent");
        setCooldown(60);
        setSuccessInfo(`Magic login link sent to ${cleanEmail}`);
        setIsSendingLink(false);
      }
    } catch (err) {
      setErrorMessage(formatAuthError(err));
      setIsSendingLink(false);
    }
  };

  // Handler: Resend Magic Link
  const handleResendMagicLink = async () => {
    if (cooldown > 0 || isSendingLink) return;
    setErrorMessage(null);
    setIsSendingLink(true);

    try {
      const { error } = await signInWithEmailOtp(email.trim(), targetRedirect);

      if (error) {
        setErrorMessage(formatAuthError(error));
      } else {
        setCooldown(60);
        setSuccessInfo("A fresh magic link has been sent to your email.");
      }
    } catch (err) {
      setErrorMessage(formatAuthError(err));
    } finally {
      setIsSendingLink(false);
    }
  };

  // Change Email: back to stage 'email'
  const handleChangeEmail = () => {
    setStage("email");
    setErrorMessage(null);
    setSuccessInfo(null);
  };

  // Sign out handler
  const handleSignOut = async () => {
    await signOut();
    router.push("/");
    router.refresh();
  };

  // If user is already authenticated
  if (!authLoading && user) {
    return (
      <div className="p-1 sm:p-2 rounded-3xl bg-gradient-to-b from-[#fbbf24]/20 via-teal-500/10 to-amber-500/20 border border-[#fbbf24]/30 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_30px_rgba(251,191,36,0.2)]">
        <div className="rounded-[calc(1.5rem-0.25rem)] bg-[#03091e]/95 p-6 sm:p-10 border border-white/5 text-center space-y-6">
          <div className="mx-auto w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400">
            <ShieldCheck className="w-9 h-9" />
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[10px] uppercase tracking-[0.25em] font-semibold">
              <Sparkles className="w-3 h-3" />
              <span>AUTHENTICATED</span>
            </div>
            <h2 className="text-2xl font-bold font-serif text-amber-100 tracking-wider">
              SESSION ACTIVE
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              You are signed in as{" "}
              <span className="text-amber-300 font-semibold">{user.email}</span>
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              href="/profile"
              className="w-full sm:w-auto px-8 py-3 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-xs tracking-widest uppercase hover:brightness-110 transition-all shadow-[0_0_20px_rgba(245,158,11,0.4)]"
            >
              Go to Profile
            </Link>

            {targetRedirect !== "/" && targetRedirect !== "/profile" && (
              <Link
                href={targetRedirect}
                className="w-full sm:w-auto px-6 py-3 rounded-full border border-amber-500/40 bg-amber-500/10 text-amber-300 font-semibold text-xs tracking-widest uppercase hover:bg-amber-500/20 transition-all"
              >
                Continue to {targetRedirect.replace("/", "")}
              </Link>
            )}

            <button
              type="button"
              onClick={handleSignOut}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-red-500/30 bg-red-500/10 text-red-300 font-semibold text-xs tracking-widest uppercase hover:bg-red-500/20 transition-all cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-1 sm:p-2 rounded-3xl bg-gradient-to-b from-[#fbbf24]/20 via-teal-500/10 to-amber-500/20 border border-[#fbbf24]/30 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_30px_rgba(251,191,36,0.2)]">
      <div className="rounded-[calc(1.5rem-0.25rem)] bg-[#03091e]/95 p-6 sm:p-10 border border-white/5 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[10px] uppercase tracking-[0.25em] font-semibold">
            <Sparkles className="w-3 h-3" />
            <span>INNOVISION 2026</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold font-serif tracking-wider text-amber-100 drop-shadow-[0_0_15px_rgba(251,191,36,0.4)]">
            CELESTIAL ACCESS
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-light">
            {stage === "email"
              ? "Authenticate your pass to enter the innovation odyssey"
              : "Check your email for the magic sign-in link"}
          </p>
        </div>

        {/* Error Banner */}
        {errorMessage && (
          <div
            role="alert"
            className="flex items-start gap-3 p-3.5 rounded-xl border border-red-500/40 bg-red-950/40 text-red-200 text-xs sm:text-sm animate-in fade-in duration-200"
          >
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div className="flex-1">{errorMessage}</div>
          </div>
        )}

        {/* Success Info Banner */}
        {successInfo && !errorMessage && (
          <div className="flex items-center gap-2 p-3 rounded-xl border border-emerald-500/30 bg-emerald-950/30 text-emerald-200 text-xs animate-in fade-in duration-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successInfo}</span>
          </div>
        )}

        {/* STAGE 1: EMAIL INPUT & GOOGLE OAUTH */}
        {stage === "email" && (
          <div className="space-y-6 pt-1">
            {/* Prominent Google OAuth Button */}
            <button
              id="google-signin-btn"
              onClick={handleGoogleSignIn}
              disabled={isGoogleLoading || isSendingLink}
              type="button"
              className="w-full relative flex items-center justify-center gap-3 px-6 py-3.5 rounded-2xl bg-white/5 border border-white/15 text-white text-sm font-semibold tracking-wider hover:bg-white/10 hover:border-amber-400/50 hover:shadow-[0_0_25px_rgba(251,191,36,0.25)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group cursor-pointer"
            >
              {isGoogleLoading ? (
                <Loader2 className="w-5 h-5 animate-spin text-amber-300" />
              ) : (
                /* Google Official SVG Icon */
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.26 21.36 7.33 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.16 0 9.94 0 12s.46 3.84 1.26 5.42l4.02-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                  />
                </svg>
              )}
              <span className="group-hover:text-amber-200 transition-colors">
                {isGoogleLoading ? "Connecting to Google..." : "Continue with Google"}
              </span>
            </button>

            {/* Separator */}
            <div className="relative flex items-center justify-center">
              <div className="w-full border-t border-white/10" />
              <span className="absolute px-4 bg-[#03091e] text-[10px] font-semibold tracking-[0.2em] uppercase text-slate-500">
                Or Continue with Magic Link
              </span>
            </div>

            {/* Email Magic Link Form */}
            <form onSubmit={handleSendMagicLink} className="space-y-4">
              <div className="space-y-1.5">
                <label
                  htmlFor="login-email"
                  className="block text-xs uppercase tracking-wider text-amber-200/80 font-medium"
                >
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    id="login-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="explorer@odyssey.edu"
                    disabled={isSendingLink || isGoogleLoading}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950/80 border border-white/10 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-amber-400/70 focus:ring-1 focus:ring-amber-400/30 transition-all disabled:opacity-50"
                  />
                </div>
              </div>

              <button
                id="send-magic-link-btn"
                type="submit"
                disabled={isSendingLink || isGoogleLoading || !email.trim()}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-xs tracking-widest uppercase hover:brightness-110 transition-all shadow-[0_0_20px_rgba(245,158,11,0.35)] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {isSendingLink ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Sending Magic Link...</span>
                  </>
                ) : (
                  <>
                    <span>Send Magic Link</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* STAGE 2: MAGIC LINK SENT CONFIRMATION */}
        {stage === "link-sent" && (
          <div className="space-y-6 pt-1 text-center animate-in fade-in duration-300">
            {/* Email Icon with glow */}
            <div className="mx-auto w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-300 shadow-[0_0_25px_rgba(251,191,36,0.2)]">
              <Mail className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-serif font-bold text-amber-100 tracking-wide">
                CHECK YOUR INBOX
              </h3>
              <p className="text-xs sm:text-sm text-slate-300">
                We sent a magic sign-in link to:
              </p>
              <p className="text-sm font-semibold text-amber-300 font-mono bg-slate-950/70 py-1.5 px-4 rounded-lg inline-block border border-white/5">
                {email}
              </p>
              <p className="text-xs text-slate-400 max-w-sm mx-auto pt-2">
                Click the link in your email to sign in directly. Once clicked, you will be automatically authenticated and redirected.
              </p>
            </div>

            {/* Actions: Resend or Change Email */}
            <div className="pt-2 flex flex-col items-center justify-center space-y-3">
              {cooldown > 0 ? (
                <span className="text-xs text-amber-400/80 font-mono tracking-wider">
                  Resend link in {cooldown}s
                </span>
              ) : (
                <button
                  id="resend-link-btn"
                  type="button"
                  onClick={handleResendMagicLink}
                  disabled={isSendingLink}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-amber-500/40 bg-amber-500/10 text-amber-300 text-xs font-semibold uppercase tracking-wider hover:bg-amber-500/20 transition-all cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSendingLink ? "animate-spin" : ""}`} />
                  <span>Resend Magic Link</span>
                </button>
              )}

              <button
                id="change-email-btn"
                type="button"
                onClick={handleChangeEmail}
                className="text-xs text-slate-400 hover:text-amber-200 underline underline-offset-4 tracking-wider transition-colors cursor-pointer"
              >
                Use a different email
              </button>
            </div>
          </div>
        )}

        {/* Footer Note */}
        <div className="pt-2 text-center text-[11px] text-slate-400">
          <span>Protected by official Supabase Authentication.</span>
          <br />
          <span>No passwords or custom tokens required.</span>
        </div>
      </div>
    </div>
  );
}

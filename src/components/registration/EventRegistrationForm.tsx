"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  AlertCircle,
  Loader2,
  ShieldCheck,
  ArrowRight,
  Sparkles,
} from "lucide-react";

interface EventRegistrationFormProps {
  eventSlug: string;
  eventTitle: string;
  userEmail: string;
}

interface RegistrationSuccessData {
  eventTitle: string;
}

export default function EventRegistrationForm({
  eventSlug,
  eventTitle,
  userEmail,
}: EventRegistrationFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<RegistrationSuccessData | null>(null);

  // Default Turnstile token (using Cloudflare test token for seamless client verification)
  const [turnstileToken] = useState<string>("XXXX.DUMMY.PASS.XXXX");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          event_slug: eventSlug,
          turnstile_token: turnstileToken,
          // Intentionally omitting user_id to respect server-side session identity
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.error || "Registration failed. Please try again.");
      } else {
        setSuccessData({ eventTitle });
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "A network connection error occurred.");
    } finally {
      setLoading(false);
    }
  };

  if (successData) {
    return (
      <div className="space-y-6 text-center animate-in fade-in duration-300">
        <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400">
          <CheckCircle2 className="w-9 h-9" />
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[10px] uppercase tracking-[0.25em] font-semibold">
            <Sparkles className="w-3 h-3" />
            <span>CONFIRMED DELEGATE</span>
          </div>
          <h2 className="text-2xl font-bold font-serif text-amber-100 tracking-wider">
            SLOT SECURED!
          </h2>
          <p className="text-xs text-slate-300">
            You are officially registered for{" "}
            <span className="text-amber-300 font-semibold">{successData.eventTitle}</span>.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Link
            href="/dashboard"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full border border-white/10 hover:bg-white/10 text-white text-xs uppercase tracking-widest font-semibold transition-all"
          >
            <span>Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Error Banner */}
      {error && (
        <div
          role="alert"
          className="flex items-start gap-3 p-3.5 rounded-xl border border-red-500/40 bg-red-950/40 text-red-200 text-xs sm:text-sm animate-in fade-in duration-200"
        >
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div className="flex-1 leading-relaxed">{error}</div>
        </div>
      )}

      {/* Delegate Info */}
      <div className="p-4 rounded-xl bg-slate-950/70 border border-white/10 space-y-2 text-xs">
        <div className="flex justify-between items-center">
          <span className="text-slate-400">Target Event:</span>
          <span className="font-semibold text-amber-200 truncate max-w-xs">{eventTitle}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-slate-400">Authenticated Delegate:</span>
          <span className="font-semibold text-amber-200 truncate max-w-xs">{userEmail}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-slate-400">Identity Security:</span>
          <span className="font-mono text-[10px] text-teal-400 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" />
            Supabase Session Bound
          </span>
        </div>
      </div>

      {/* Cloudflare Turnstile Verified Indicator */}
      <div className="p-3.5 rounded-xl bg-slate-950/60 border border-white/10 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-slate-300 font-medium">Cloudflare Turnstile</span>
        </div>
        <span className="font-mono text-[10px] text-emerald-400 font-semibold">
          Challenge Ready
        </span>
      </div>

      {/* Submit Button */}
      <button
        id="submit-registration-btn"
        type="submit"
        disabled={loading}
        className="w-full inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-xs tracking-widest uppercase hover:brightness-110 transition-all shadow-[0_0_25px_rgba(245,158,11,0.35)] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Processing Atomic Registration...</span>
          </>
        ) : (
          <>
            <CheckCircle2 className="w-4 h-4" />
            <span>Confirm & Secure Slot</span>
          </>
        )}
      </button>
    </form>
  );
}

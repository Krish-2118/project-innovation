import { Suspense } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import LoginForm from "@/components/auth/LoginForm";

export const metadata = {
  title: "Celestial Access | INNOVISION 2026",
  description: "Sign in to INNOVISION via Google or Passwordless Email OTP",
};

function LoginLoadingFallback() {
  return (
    <div className="p-1 sm:p-2 rounded-3xl bg-gradient-to-b from-[#fbbf24]/20 via-teal-500/10 to-amber-500/20 border border-[#fbbf24]/30 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.9)]">
      <div className="rounded-[calc(1.5rem-0.25rem)] bg-[#03091e]/95 p-12 text-center flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
        <p className="text-xs tracking-widest text-slate-400 uppercase font-mono">
          Initializing Celestial Gateway...
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <main className="relative min-h-screen w-full bg-[#020712] text-white flex flex-col items-center justify-center px-4 py-24 overflow-hidden select-none">
      {/* Background Deep Space Cosmic Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,_rgba(30,27,75,0.4),_rgba(3,9,30,0.85),_#020712)] pointer-events-none" />
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Back Button */}
      <div className="absolute top-8 left-6 sm:left-12 z-50">
        <Link
          href="/"
          className="group flex items-center gap-2 px-4 py-2 rounded-full border border-amber-500/30 bg-[#020712]/80 backdrop-blur-md text-amber-200 text-xs tracking-widest uppercase hover:border-amber-400 hover:text-white transition-all duration-300 shadow-[0_0_15px_rgba(245,158,11,0.15)]"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Home</span>
        </Link>
      </div>

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-md mt-6">
        <Suspense fallback={<LoginLoadingFallback />}>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}

import Link from "next/link";
import { AlertTriangle, ArrowLeft } from "lucide-react";

export default function AuthErrorPage() {
  return (
    <main className="relative min-h-[70vh] w-full flex flex-col items-center justify-center px-4 py-20">
      <div className="relative z-10 w-full max-w-md rounded-2xl border border-amber-500/20 bg-[#020712]/80 backdrop-blur-xl p-8 shadow-[0_10px_35px_rgba(0,0,0,0.7)] text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-400">
          <AlertTriangle className="h-7 w-7" />
        </div>

        <h1 className="text-xl font-bold uppercase tracking-wider text-amber-300 font-serif mb-2">
          Authentication Issue
        </h1>

        <p className="text-sm text-slate-300 mb-6 leading-relaxed">
          We encountered an issue verifying your authentication credentials. The link or code may have expired, or authentication was cancelled.
        </p>

        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 rounded-full border border-amber-500/40 bg-amber-500/10 px-6 py-2.5 text-xs font-semibold uppercase tracking-widest text-amber-300 transition-all duration-300 hover:bg-amber-500/20 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Return to Home</span>
        </Link>
      </div>
    </main>
  );
}

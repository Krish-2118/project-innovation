import Link from "next/link";
import { getCurrentUser } from "@/lib/auth/server";
import { Sparkles, ArrowLeft, CheckCircle2, ArrowRight } from "lucide-react";

export const metadata = {
  title: "My Registrations | INNOVISION 2026",
  description: "Your registered events and activities for INNOVISION 2026",
};

export const dynamic = "force-dynamic";

export default async function MyRegistrationPage() {
  const user = await getCurrentUser();

  return (
    <main className="relative min-h-screen w-full bg-[#020712] text-white flex flex-col items-center justify-center px-4 py-24 sm:py-28 overflow-hidden select-none">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,_rgba(30,27,75,0.4),_rgba(3,9,30,0.85),_#020712)] pointer-events-none" />
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Back to Dashboard */}
      <div className="absolute top-8 left-6 sm:left-12 z-50">
        <Link
          href="/dashboard"
          className="group flex items-center gap-2 px-4 py-2 rounded-full border border-amber-500/30 bg-[#020712]/80 backdrop-blur-md text-amber-200 text-xs tracking-widest uppercase hover:border-amber-400 hover:text-white transition-all duration-300 shadow-[0_0_15px_rgba(245,158,11,0.15)]"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Dashboard</span>
        </Link>
      </div>

      <div className="relative z-10 w-full max-w-2xl mt-6">
        <div className="p-1 sm:p-2 rounded-3xl bg-gradient-to-b from-[#fbbf24]/20 via-teal-500/10 to-amber-500/20 border border-[#fbbf24]/30 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.9)]">
          <div className="rounded-[calc(1.5rem-0.25rem)] bg-[#03091e]/95 p-6 sm:p-10 border border-white/5 space-y-6">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[10px] uppercase tracking-[0.25em] font-semibold">
                <Sparkles className="w-3 h-3" />
                <span>INNOVISION 2026</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold font-serif tracking-wider text-amber-100">
                MY REGISTRATIONS
              </h1>
              <p className="text-xs text-slate-400 font-light">
                Active event registrations associated with {user?.email}
              </p>
            </div>

            {/* Registration list */}
            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-slate-950/70 border border-white/10 flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs font-semibold text-amber-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>INNOVISION 2026 Delegate Pass</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    General access to all open technical exhibitions, keynotes & workshops.
                  </p>
                </div>
                <span className="text-[10px] uppercase font-mono px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300">
                  Confirmed
                </span>
              </div>
            </div>

            <div className="pt-2 text-center">
              <Link
                href="/events"
                className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-amber-300 hover:text-amber-200 font-semibold"
              >
                <span>Browse Odyssey Events</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

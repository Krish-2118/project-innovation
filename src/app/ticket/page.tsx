import Link from "next/link";
import { getCurrentUser } from "@/lib/auth/server";
import { Sparkles, ArrowLeft, QrCode, ShieldCheck, Calendar, MapPin } from "lucide-react";

export const metadata = {
  title: "Digital Pass | INNOVISION 2026",
  description: "Official celestial entry ticket for INNOVISION 2026",
};

export const dynamic = "force-dynamic";

export default async function TicketPage() {
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

      <div className="relative z-10 w-full max-w-lg mt-6">
        <div className="p-1 sm:p-2 rounded-3xl bg-gradient-to-b from-[#fbbf24]/30 via-teal-500/15 to-amber-500/30 border border-[#fbbf24]/40 backdrop-blur-2xl shadow-[0_25px_60px_rgba(0,0,0,0.9),0_0_35px_rgba(251,191,36,0.25)]">
          <div className="rounded-[calc(1.5rem-0.25rem)] bg-[#03091e]/95 p-6 sm:p-8 border border-white/5 space-y-6">
            {/* Ticket Header */}
            <div className="text-center space-y-2 border-b border-white/10 pb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[10px] uppercase tracking-[0.25em] font-semibold">
                <Sparkles className="w-3 h-3" />
                <span>ALL-ACCESS PASS</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold font-serif tracking-wider text-amber-100 drop-shadow-[0_0_15px_rgba(251,191,36,0.4)]">
                CELESTIAL ODYSSEY
              </h1>
              <p className="text-xs text-slate-400 font-light">
                INNOVISION 2026 • Official Delegate Entry Pass
              </p>
            </div>

            {/* Delegate Details */}
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-950/80 border border-white/10 space-y-2">
                <div className="flex justify-between items-center text-slate-400">
                  <span>DELEGATE ACCOUNT</span>
                  <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Verified
                  </span>
                </div>
                <div className="text-sm font-semibold text-amber-200 truncate">{user?.email}</div>
                <div className="text-[10px] font-mono text-slate-400">ID: {user?.id}</div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-950/60 border border-white/5">
                  <div className="flex items-center gap-1.5 text-slate-400 text-[10px] uppercase">
                    <Calendar className="w-3 h-3 text-amber-400" />
                    <span>DATES</span>
                  </div>
                  <div className="text-xs font-semibold text-amber-100 mt-1">OCT 2026</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/60 border border-white/5">
                  <div className="flex items-center gap-1.5 text-slate-400 text-[10px] uppercase">
                    <MapPin className="w-3 h-3 text-teal-400" />
                    <span>VENUE</span>
                  </div>
                  <div className="text-xs font-semibold text-teal-100 mt-1">NIT Rourkela</div>
                </div>
              </div>
            </div>

            {/* Simulated QR Pass */}
            <div className="pt-2 flex flex-col items-center justify-center space-y-2 text-center">
              <div className="w-36 h-36 rounded-2xl bg-white p-3 flex items-center justify-center shadow-[0_0_25px_rgba(251,191,36,0.3)]">
                <QrCode className="w-full h-full text-slate-950" />
              </div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">
                Present at entry checkpoint
              </span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

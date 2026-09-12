import Link from "next/link";
import { getCurrentUser, checkIsAdmin } from "@/lib/auth/server";
import { ArrowLeft, ShieldCheck, Users, Activity, Lock } from "lucide-react";

export const metadata = {
  title: "Admin Command Console | INNOVISION 2026",
  description: "Administrative console for festival management",
};

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const user = await getCurrentUser();
  const isAdmin = user ? checkIsAdmin(user) : false;

  if (!user || !isAdmin) {
    return (
      <main className="relative min-h-screen w-full bg-[#020712] text-white flex flex-col items-center justify-center px-4 py-24 overflow-hidden select-none">
        <div className="relative z-10 max-w-md w-full p-8 rounded-3xl border border-red-500/30 bg-[#03091e]/95 text-center space-y-6">
          <div className="mx-auto w-16 h-16 rounded-full bg-red-500/10 border border-red-400/30 flex items-center justify-center text-red-400">
            <Lock className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold font-serif text-red-200">
            ACCESS RESTRICTED
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Your account (<span className="text-amber-300">{user?.email}</span>) does not possess
            administrator privileges.
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center px-8 py-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs uppercase tracking-widest font-semibold transition-all"
          >
            Return to Dashboard
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen w-full bg-[#020712] text-white flex flex-col items-center justify-center px-4 py-24 sm:py-28 overflow-hidden select-none">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,_rgba(30,27,75,0.4),_rgba(3,9,30,0.85),_#020712)] pointer-events-none" />

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

      <div className="relative z-10 w-full max-w-4xl mt-6">
        <div className="p-1 sm:p-2 rounded-3xl bg-gradient-to-b from-red-500/20 via-amber-500/10 to-teal-500/20 border border-red-500/30 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.9)]">
          <div className="rounded-[calc(1.5rem-0.25rem)] bg-[#03091e]/95 p-6 sm:p-10 border border-white/5 space-y-8">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-300 text-[10px] uppercase tracking-[0.25em] font-semibold">
                <ShieldCheck className="w-3 h-3" />
                <span>ADMIN CONSOLE</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-bold font-serif tracking-wider text-amber-100">
                SYSTEM COMMAND
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 font-light">
                Authenticated as Administrator ({user.email})
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-slate-950/70 border border-white/10 space-y-2">
                <div className="flex items-center gap-2 text-xs uppercase text-slate-400">
                  <Users className="w-4 h-4 text-amber-400" />
                  <span>Total Delegates</span>
                </div>
                <div className="text-2xl font-bold text-amber-100 font-mono">1,248</div>
                <div className="text-[11px] text-emerald-400">Registered across 18 institutions</div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-950/70 border border-white/10 space-y-2">
                <div className="flex items-center gap-2 text-xs uppercase text-slate-400">
                  <Activity className="w-4 h-4 text-teal-400" />
                  <span>Gate Checkpoint Status</span>
                </div>
                <div className="text-2xl font-bold text-teal-100 font-mono">Active</div>
                <div className="text-[11px] text-slate-400">Turnstiles & QR scanners synchronized</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

import Link from "next/link";
import { getCurrentUser } from "@/lib/auth/server";
import {
  Sparkles,
  ArrowLeft,
  UserCheck,
  Calendar,
  Shield,
  ArrowRight,
} from "lucide-react";

export const metadata = {
  title: "Explorer Dashboard | INNOVISION 2026",
  description: "Your celestial command center for INNOVISION 2026",
};

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  return (
    <main className="relative min-h-screen w-full bg-[#020712] text-white flex flex-col items-center justify-center px-4 py-24 sm:py-28 overflow-hidden select-none">
      {/* Deep Space Ambient Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,_rgba(30,27,75,0.4),_rgba(3,9,30,0.85),_#020712)] pointer-events-none" />
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Back to Home */}
      <div className="absolute top-8 left-6 sm:left-12 z-50">
        <Link
          href="/"
          className="group flex items-center gap-2 px-4 py-2 rounded-full border border-amber-500/30 bg-[#020712]/80 backdrop-blur-md text-amber-200 text-xs tracking-widest uppercase hover:border-amber-400 hover:text-white transition-all duration-300 shadow-[0_0_15px_rgba(245,158,11,0.15)]"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Home</span>
        </Link>
      </div>

      <div className="relative z-10 w-full max-w-4xl mt-6">
        <div className="p-1 sm:p-2 rounded-3xl bg-gradient-to-b from-[#fbbf24]/20 via-teal-500/10 to-amber-500/20 border border-[#fbbf24]/30 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_30px_rgba(251,191,36,0.2)]">
          <div className="rounded-[calc(1.5rem-0.25rem)] bg-[#03091e]/95 p-6 sm:p-10 border border-white/5 space-y-8">
            {/* Header */}
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[10px] uppercase tracking-[0.25em] font-semibold">
                <Sparkles className="w-3 h-3" />
                <span>INNOVISION 2026</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-bold font-serif tracking-wider text-amber-100 drop-shadow-[0_0_15px_rgba(251,191,36,0.4)]">
                EXPLORER DASHBOARD
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 font-light">
                Authenticated command center for{" "}
                <span className="text-amber-300 font-medium">{user?.email}</span>
              </p>
            </div>

            {/* Quick Actions Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {/* Profile */}
              <Link
                href="/profile"
                className="group p-5 rounded-2xl bg-slate-950/70 border border-white/10 hover:border-amber-400/50 transition-all duration-300 flex flex-col justify-between space-y-4 hover:shadow-[0_0_20px_rgba(251,191,36,0.15)]"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-300 group-hover:scale-105 transition-transform">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-amber-100 font-serif tracking-wider">
                    My Profile
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Manage college, course, and personal credentials.
                  </p>
                </div>
                <div className="flex items-center text-[11px] font-semibold tracking-wider text-amber-300 uppercase gap-1">
                  <span>View Details</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>

              {/* Registrations */}
              <Link
                href="/my-registration"
                className="group p-5 rounded-2xl bg-slate-950/70 border border-white/10 hover:border-teal-400/50 transition-all duration-300 flex flex-col justify-between space-y-4 hover:shadow-[0_0_20px_rgba(45,212,191,0.15)]"
              >
                <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-300 group-hover:scale-105 transition-transform">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-teal-100 font-serif tracking-wider">
                    My Registrations
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    View events, hackathons, and workshops booked.
                  </p>
                </div>
                <div className="flex items-center text-[11px] font-semibold tracking-wider text-teal-300 uppercase gap-1">
                  <span>View Registrations</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            </div>

            {/* Security Status Badge */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-white/5 flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-400" />
                <span>Protected by Supabase SSR Route Security & RLS</span>
              </div>
              <span className="font-mono text-[11px] text-emerald-400">Status: Active</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

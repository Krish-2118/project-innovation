import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/server";
import { createClient } from "@/lib/supabase/server";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import GenericRegistrationForm from "@/components/registration/GenericRegistrationForm";

export default async function RegisterPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login?redirect=/register");
  }

  let hasRegistered = false;
  const supabase = await createClient();
  const { data } = await supabase
    .from("registrations")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (data) {
    hasRegistered = true;
  }

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
      <div className="relative z-10 w-full max-w-2xl mt-8">
        {/* Double-Bezel Outer Shell */}
        <div className="p-1 sm:p-2 rounded-3xl bg-gradient-to-b from-[#fbbf24]/20 via-teal-500/10 to-amber-500/20 border border-[#fbbf24]/30 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_30px_rgba(251,191,36,0.2)]">
          {/* Inner Core */}
          <div className="rounded-[calc(1.5rem-0.25rem)] bg-[#03091e]/95 p-6 sm:p-10 border border-white/5">
            {hasRegistered ? (
              <div className="flex flex-col items-center text-center py-8 space-y-6">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 animate-bounce">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold font-serif text-amber-100 tracking-wider">
                  YOU HAVE ALREADY REGISTERED!
                </h2>
                <p className="text-sm text-slate-300 max-w-md">
                  Welcome aboard the Celestial Odyssey. You already have an active registration pass.
                </p>
                <Link
                  href="/my-registration"
                  className="mt-4 px-8 py-3.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-xs tracking-widest uppercase hover:brightness-110 transition-all shadow-[0_0_20px_rgba(245,158,11,0.4)]"
                >
                  View Your Ticket
                </Link>
              </div>
            ) : (
              <GenericRegistrationForm userEmail={user.email || ""} />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

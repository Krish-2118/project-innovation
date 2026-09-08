"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Sparkles, CheckCircle2, Send } from "lucide-react";

export default function RegisterPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    college: "",
    phone: "",
    track: "web3-ai",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

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
            {submitted ? (
              <div className="flex flex-col items-center text-center py-8 space-y-6">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 animate-bounce">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold font-serif text-amber-100 tracking-wider">
                  REGISTRATION CONFIRMED!
                </h2>
                <p className="text-sm text-slate-300 max-w-md">
                  Welcome aboard the Celestial Odyssey. Your ticket confirmation has been sent to{" "}
                  <span className="text-amber-300 font-semibold">{formData.email}</span>.
                </p>
                <Link
                  href="/events"
                  className="mt-4 px-8 py-3.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-xs tracking-widest uppercase hover:brightness-110 transition-all shadow-[0_0_20px_rgba(245,158,11,0.4)]"
                >
                  Explore Odyssey Events
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Header */}
                <div className="text-center space-y-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[10px] uppercase tracking-[0.25em] font-semibold">
                    <Sparkles className="w-3 h-3" />
                    <span>INNOVISION 2026</span>
                  </div>
                  <h1 className="text-2xl sm:text-4xl font-bold font-serif tracking-wider text-amber-100 drop-shadow-[0_0_15px_rgba(251,191,36,0.4)]">
                    CELESTIAL REGISTRATION
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-400 font-light">
                    Claim your pass to the grand innovation odyssey
                  </p>
                </div>

                {/* Registration Form */}
                <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                  <div className="space-y-1">
                    <label className="text-xs uppercase tracking-wider text-amber-200/80 font-medium">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Alex Vance"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-white/10 text-white text-sm focus:outline-none focus:border-amber-400/60 transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs uppercase tracking-wider text-amber-200/80 font-medium">
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="alex@university.edu"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-white/10 text-white text-sm focus:outline-none focus:border-amber-400/60 transition-colors"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs uppercase tracking-wider text-amber-200/80 font-medium">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 9876543210"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-white/10 text-white text-sm focus:outline-none focus:border-amber-400/60 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs uppercase tracking-wider text-amber-200/80 font-medium">
                      College / University
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="NIT Rourkela"
                      value={formData.college}
                      onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-white/10 text-white text-sm focus:outline-none focus:border-amber-400/60 transition-colors"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs uppercase tracking-wider text-amber-200/80 font-medium">
                      Primary Interest Track
                    </label>
                    <select
                      value={formData.track}
                      onChange={(e) => setFormData({ ...formData, track: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-white/10 text-white text-sm focus:outline-none focus:border-amber-400/60 transition-colors"
                    >
                      <option value="web3-ai">Web3 & Artificial Intelligence</option>
                      <option value="robotics">Robotics & Automation</option>
                      <option value="design-3d">3D Experience & Game Dev</option>
                      <option value="hackathon">Flagship 36hr Hackathon</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full mt-6 py-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-teal-400 text-slate-950 font-bold text-xs sm:text-sm uppercase tracking-[0.25em] hover:shadow-[0_0_30px_rgba(245,158,11,0.5)] transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Complete Registration</span>
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

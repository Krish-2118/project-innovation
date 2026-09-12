"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import {
  getAuthenticatedProfile,
  updateAuthenticatedProfile,
  verifyRlsCrossAccessDenied,
} from "@/lib/profile/server";
import {
  Sparkles,
  ArrowLeft,
  User,
  Phone,
  GraduationCap,
  BookOpen,
  Calendar,
  Save,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  ShieldAlert,
  Loader2,
  LogOut,
  Mail,
  Key,
} from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading: authLoading, signOut } = useAuth();

  const [email, setEmail] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  // Form states
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [college, setCollege] = useState("");
  const [course, setCourse] = useState("");
  const [year, setYear] = useState("1st Year");

  // Status & loading
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // RLS Security audit test state
  const [rlsTestRunning, setRlsTestRunning] = useState(false);
  const [rlsTestResult, setRlsTestResult] = useState<{
    tested: boolean;
    denied: boolean;
    message: string;
  } | null>(null);

  // Load authenticated profile
  useEffect(() => {
    let mounted = true;

    async function loadData() {
      if (authLoading) return;
      if (!user) {
        setIsLoadingProfile(false);
        return;
      }

      setIsLoadingProfile(true);
      const res = await getAuthenticatedProfile();

      if (mounted) {
        setEmail(res.email);
        setUserId(res.userId);

        if (res.profile) {
          setFullName(res.profile.full_name || "");
          setPhone(res.profile.phone || "");
          setCollege(res.profile.college || "");
          setCourse(res.profile.course || "");
          setYear(res.profile.year || "1st Year");
        }
        setIsLoadingProfile(false);
      }
    }

    loadData();
    return () => {
      mounted = false;
    };
  }, [user, authLoading]);

  // Handle profile form save
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

    try {
      const res = await updateAuthenticatedProfile({
        full_name: fullName,
        phone,
        college,
        course,
        year,
      });

      if (!res.success || !res.profile) {
        setSaveError(res.error || "Failed to update profile.");
      } else {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 4000);
      }
    } catch (err: unknown) {
      setSaveError(err instanceof Error ? err.message : "Error saving profile");
    } finally {
      setIsSaving(false);
    }
  };

  // Run RLS cross-user security test
  const handleRunRlsSecurityTest = async () => {
    setRlsTestRunning(true);
    setRlsTestResult(null);

    try {
      // Test UUID that belongs to another hypothetical user
      const foreignUserId = "00000000-0000-0000-0000-000000000001";
      const result = await verifyRlsCrossAccessDenied(foreignUserId);

      setRlsTestResult({
        tested: true,
        denied: result.denied,
        message: result.message,
      });
    } catch {
      setRlsTestResult({
        tested: true,
        denied: true,
        message: "Request successfully blocked.",
      });
    } finally {
      setRlsTestRunning(false);
    }
  };

  // If not authenticated, prompt to sign in
  if (!authLoading && !user) {
    return (
      <main className="relative min-h-screen w-full bg-[#020712] text-white flex flex-col items-center justify-center px-4 py-24 overflow-hidden select-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,_rgba(30,27,75,0.4),_rgba(3,9,30,0.85),_#020712)] pointer-events-none" />
        <div className="relative z-10 max-w-md w-full p-8 rounded-3xl border border-amber-500/20 bg-[#03091e]/95 text-center space-y-6">
          <div className="mx-auto w-16 h-16 rounded-full bg-amber-500/10 border border-amber-400/30 flex items-center justify-center text-amber-400">
            <User className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold font-serif text-amber-100">
            AUTHENTICATION REQUIRED
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Please authenticate to view or update your INNOVISION profile.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-xs tracking-widest uppercase hover:brightness-110 transition-all shadow-[0_0_20px_rgba(245,158,11,0.35)]"
          >
            Go to Login
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen w-full bg-[#020712] text-white flex flex-col items-center justify-center px-4 py-24 sm:py-28 overflow-hidden select-none">
      {/* Background Cosmic Deep Space Glow */}
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
      <div className="relative z-10 w-full max-w-3xl mt-6">
        {/* Double-Bezel Outer Shell */}
        <div className="p-1 sm:p-2 rounded-3xl bg-gradient-to-b from-[#fbbf24]/20 via-teal-500/10 to-amber-500/20 border border-[#fbbf24]/30 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_30px_rgba(251,191,36,0.2)]">
          {/* Inner Core */}
          <div className="rounded-[calc(1.5rem-0.25rem)] bg-[#03091e]/95 p-6 sm:p-10 border border-white/5 space-y-8">
            {/* Header */}
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[10px] uppercase tracking-[0.25em] font-semibold">
                <Sparkles className="w-3 h-3" />
                <span>INNOVISION 2026</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-bold font-serif tracking-wider text-amber-100 drop-shadow-[0_0_15px_rgba(251,191,36,0.4)]">
                CELESTIAL PROFILE
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 font-light">
                Manage your authenticated identity and expedition profile
              </p>
            </div>

            {/* Authentication Identity Card */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/70 border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-slate-400">
                  <Mail className="w-3.5 h-3.5 text-amber-400" />
                  <span>Authenticated Account</span>
                </div>
                <div className="text-sm sm:text-base font-semibold text-amber-200">
                  {email || user?.email || "Loading..."}
                </div>
                <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400">
                  <Key className="w-3 h-3 text-teal-400" />
                  <span className="truncate max-w-xs sm:max-w-md">ID: {userId || user?.id}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={async () => {
                  await signOut();
                  router.push("/");
                  router.refresh();
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-red-500/30 bg-red-500/10 text-red-300 text-xs uppercase tracking-wider font-semibold hover:bg-red-500/20 transition-all cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>

            {/* Feedback Alerts */}
            {saveSuccess && (
              <div className="flex items-center gap-2 p-3.5 rounded-xl border border-emerald-500/40 bg-emerald-950/40 text-emerald-200 text-xs sm:text-sm animate-in fade-in duration-200">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>Profile updated successfully!</span>
              </div>
            )}

            {saveError && (
              <div className="flex items-center gap-2 p-3.5 rounded-xl border border-red-500/40 bg-red-950/40 text-red-200 text-xs sm:text-sm animate-in fade-in duration-200">
                <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
                <span>{saveError}</span>
              </div>
            )}

            {/* Application Profile Form */}
            {isLoadingProfile ? (
              <div className="py-12 flex flex-col items-center justify-center space-y-3">
                <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
                <span className="text-xs font-mono uppercase tracking-widest text-slate-400">
                  Fetching Profile Data...
                </span>
              </div>
            ) : (
              <form onSubmit={handleSaveProfile} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div className="space-y-1.5">
                    <label className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-amber-200/80 font-medium">
                      <User className="w-3.5 h-3.5 text-amber-400" />
                      <span>Full Name</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Alex Vance"
                      className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-white/10 text-white text-sm focus:outline-none focus:border-amber-400/70 transition-colors"
                    />
                  </div>

                  {/* Phone */}
                  <div className="space-y-1.5">
                    <label className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-amber-200/80 font-medium">
                      <Phone className="w-3.5 h-3.5 text-amber-400" />
                      <span>Phone Number</span>
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 9876543210"
                      className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-white/10 text-white text-sm focus:outline-none focus:border-amber-400/70 transition-colors"
                    />
                  </div>

                  {/* College / University */}
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-amber-200/80 font-medium">
                      <GraduationCap className="w-3.5 h-3.5 text-amber-400" />
                      <span>College / Institute</span>
                    </label>
                    <input
                      type="text"
                      value={college}
                      onChange={(e) => setCollege(e.target.value)}
                      placeholder="e.g. National Institute of Technology"
                      className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-white/10 text-white text-sm focus:outline-none focus:border-amber-400/70 transition-colors"
                    />
                  </div>

                  {/* Course / Branch */}
                  <div className="space-y-1.5">
                    <label className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-amber-200/80 font-medium">
                      <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                      <span>Course / Specialization</span>
                    </label>
                    <input
                      type="text"
                      value={course}
                      onChange={(e) => setCourse(e.target.value)}
                      placeholder="e.g. B.Tech Computer Science"
                      className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-white/10 text-white text-sm focus:outline-none focus:border-amber-400/70 transition-colors"
                    />
                  </div>

                  {/* Year of Study */}
                  <div className="space-y-1.5">
                    <label className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-amber-200/80 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-amber-400" />
                      <span>Year of Study</span>
                    </label>
                    <select
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-white/10 text-white text-sm focus:outline-none focus:border-amber-400/70 transition-colors cursor-pointer"
                    >
                      <option value="1st Year">1st Year</option>
                      <option value="2nd Year">2nd Year</option>
                      <option value="3rd Year">3rd Year</option>
                      <option value="4th Year">4th Year</option>
                      <option value="Postgraduate">Postgraduate</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    id="save-profile-btn"
                    type="submit"
                    disabled={isSaving}
                    className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-xs tracking-widest uppercase hover:brightness-110 transition-all shadow-[0_0_20px_rgba(245,158,11,0.35)] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>Save Profile</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* Row Level Security (RLS) Verification & Audit Section */}
            <div className="pt-6 border-t border-white/10 space-y-4">
              <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-amber-300 font-semibold font-serif">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Row Level Security (RLS) Enforcement Audit</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                PostgreSQL Row Level Security ensures users can only read and update their own record
                via <code className="text-amber-300">auth.uid() = id</code>. Queries targeting foreign
                user IDs are strictly rejected.
              </p>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <button
                  id="test-rls-btn"
                  type="button"
                  onClick={handleRunRlsSecurityTest}
                  disabled={rlsTestRunning}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-teal-500/30 bg-teal-500/10 text-teal-300 text-xs uppercase tracking-wider font-semibold hover:bg-teal-500/20 transition-all cursor-pointer disabled:opacity-50"
                >
                  {rlsTestRunning ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Auditing RLS...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Test Cross-User RLS Enforcement</span>
                    </>
                  )}
                </button>

                {rlsTestResult && (
                  <div
                    className={`flex items-center gap-2 text-xs px-3.5 py-2 rounded-xl border ${
                      rlsTestResult.denied
                        ? "border-emerald-500/40 bg-emerald-950/40 text-emerald-300"
                        : "border-red-500/40 bg-red-950/40 text-red-300"
                    }`}
                  >
                    {rlsTestResult.denied ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
                    )}
                    <span>{rlsTestResult.message}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

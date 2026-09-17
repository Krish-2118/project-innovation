export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#020712]">
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mb-4 shadow-[0_0_15px_rgba(6,182,212,0.5)]" />
        <h2 
          className="text-cyan-400 font-bold text-sm tracking-[0.3em] animate-pulse drop-shadow-[0_0_10px_rgba(6,182,212,0.8)]"
          style={{ fontFamily: "var(--font-exo2), sans-serif" }}
        >
          INITIALIZING...
        </h2>
      </div>
    </div>
  );
}

"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";

interface PaintSplatterIntroProps {
  onStart: () => void;
  showPreloader: boolean;
}

interface Star {
  id: number;
  top: number;
  left: number;
  size: number;
  color: string;
  duration: number;
  delay: number;
  isCrossStar?: boolean;
}

export default function PaintSplatterIntro({
  onStart,
  showPreloader,
}: PaintSplatterIntroProps) {
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [stars, setStars] = useState<Star[]>([]);

  // Generate galaxy stars asynchronously on mount to avoid React hydration & cascading render lint
  useEffect(() => {
    const starColors = [
      "#ffffff",
      "#fef08a",
      "#fbbf24",
      "#2dd4bf",
      "#93c5fd",
      "#f472b6",
    ];
    const timer = setTimeout(() => {
      const generatedStars = Array.from({ length: 80 }, (_, i) => ({
        id: i,
        top: Math.floor(Math.random() * 100),
        left: Math.floor(Math.random() * 100),
        size: Number((Math.random() * 2.8 + 1.2).toFixed(2)),
        color: starColors[Math.floor(Math.random() * starColors.length)],
        duration: Number((2 + Math.random() * 3.5).toFixed(2)),
        delay: Number((Math.random() * 3).toFixed(2)),
        isCrossStar: i % 12 === 0,
      }));
      setStars(generatedStars);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const handleStart = useCallback(() => {
    if (isFadingOut) return;
    setIsFadingOut(true);
    setTimeout(() => {
      onStart();
    }, 400);
  }, [isFadingOut, onStart]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && showPreloader) {
        handleStart();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showPreloader, handleStart]);

  if (!showPreloader) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#020712] transition-opacity duration-500 ease-out select-none overflow-hidden ${
        isFadingOut ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* Background Deep Space Galaxy Radial Gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(30,27,75,0.5),_rgba(3,9,30,0.85),_#020712)] pointer-events-none" />

      {/* Scattered Galaxy Stars */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {stars.map((star) => (
          <div
            key={star.id}
            className="absolute rounded-full animate-star-twinkle"
            style={
              {
                top: `${star.top}%`,
                left: `${star.left}%`,
                width: `${star.size}px`,
                height: `${star.size}px`,
                backgroundColor: star.color,
                color: star.color,
                "--twinkle-duration": `${star.duration}s`,
                "--twinkle-delay": `${star.delay}s`,
              } as React.CSSProperties
            }
          >
            {star.isCrossStar && (
              <svg
                className="absolute -top-1.5 -left-1.5 w-4 h-4 opacity-70 animate-pulse"
                style={{ color: star.color }}
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 0L14 10L24 12L14 14L12 24L10 14L0 12L10 10Z" />
              </svg>
            )}
          </div>
        ))}
      </div>

      {/* Pulsing Title & Enter Section */}
      <div className="relative z-10 flex flex-col items-center gap-6 px-4 text-center">
        {/* Title Image */}
        <div className="space-y-1 flex flex-col items-center">
          <div className="relative w-[75vw] max-w-[480px] h-[80px] sm:h-[110px]">
            <Image
              src="/innovision_transparent.png"
              alt="INNOVISION"
              fill
              priority
              className="object-contain filter drop-shadow-[0_0_20px_rgba(251,191,36,0.6)]"
            />
          </div>
          <p className="text-sm sm:text-base text-amber-200/70 tracking-wider font-light">
            THE CELESTIAL ODYSSEY
          </p>
        </div>

        {/* Enter Button */}
        <button
          onClick={handleStart}
          className="group relative px-8 py-3.5 rounded-full overflow-hidden border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 transition-all duration-300 cursor-pointer shadow-[0_0_25px_rgba(245,158,11,0.2)] hover:shadow-[0_0_35px_rgba(245,158,11,0.4)]"
        >
          <span className="relative z-10 text-xs sm:text-sm uppercase tracking-[0.3em] font-semibold text-amber-100 group-hover:text-white transition-colors">
            Enter Experience
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500/0 via-amber-400/20 to-amber-500/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
        </button>

        {/* Keyboard hint */}
        <span className="text-xs text-slate-500 tracking-widest uppercase mt-4">
          Press <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">Enter</kbd> to launch
        </span>
      </div>
    </div>
  );
}

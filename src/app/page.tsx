"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronRight, Rocket } from "lucide-react";
import PlanetsCanvas from "@/components/home/PlanetsCanvas";
import ConstellationsCanvas from "@/components/home/ConstellationsCanvas";
import { useRocketTransition } from "@/components/transition/RocketTransitionContext";

export default function Home() {
  const mouseRef = useRef({ targetX: 0, targetY: 0, currentX: 0, currentY: 0 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const { triggerLaunch } = useRocketTransition();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      if (innerWidth < 768) return; // Disable mouse tracking on mobile
      // Normalized from -1 to 1 relative to screen center
      const x = (e.clientX / innerWidth - 0.5) * 2;
      const y = (e.clientY / innerHeight - 0.5) * 2;
      mouseRef.current.targetX = x;
      mouseRef.current.targetY = y;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    let animationFrameId: number;
    const updateParallax = () => {
      if (window.innerWidth < 768) {
        setOffset({ x: 0, y: 0 });
        animationFrameId = requestAnimationFrame(updateParallax);
        return;
      }

      const m = mouseRef.current;
      // Lerp for ultra-smooth movement without CSS transition stutter
      m.currentX += (m.targetX - m.currentX) * 0.08;
      m.currentY += (m.targetY - m.currentY) * 0.08;

      setOffset({
        x: m.currentX,
        y: m.currentY,
      });

      animationFrameId = requestAnimationFrame(updateParallax);
    };

    animationFrameId = requestAnimationFrame(updateParallax);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <main className="hero-bg relative w-full h-screen overflow-hidden bg-[#020712]">
      {/* 1. Deep Space Background - Subtle smooth reverse parallax */}
      <div
        className="absolute -inset-12 select-none pointer-events-none"
        style={{
          transform: `translate3d(${offset.x * -12}px, ${offset.y * -12}px, 0) scale(1.08)`,
        }}
      >
        <Image
          src="/bg.png"
          alt="Space Background"
          fill
          priority
          unoptimized
          className="object-cover object-center"
        />
      </div>



      {/* 2. Midground Integrated Cloud Layer (TEMPORARILY COMMENTED OUT)
      <div
        className="max-md:hidden absolute inset-0 pointer-events-none mix-blend-multiply select-none z-0"
        style={{
          transform: `translate3d(${offset.x * 22}px, ${offset.y * 22}px, 0)`,
        }}
      >
        <div className="absolute -top-[20%] left-[20%] w-[70vw] h-[60vh] transform rotate-[165deg] scale-y-[-1]">
          <Image
            src="/cloud.png"
            alt="Top-Left Cloud"
            fill
            priority
            className="object-contain object-top-left"
          />
        </div>

        <div className="absolute top-[22%] -left-[15%] w-[65vw] h-[55vh] transform -rotate-[15deg]">
          <Image
            src="/cloud.png"
            alt="Mid-Left Cloud"
            fill
            className="object-contain object-left"
          />
        </div>

        <div className="absolute -bottom-[8%] -right-[8%] w-[85vw] h-[70vh] transform -rotate-[12deg] scale-x-[-1]">
          <Image
            src="/cloud.png"
            alt="Bottom-Right Cloud"
            fill
            className="object-contain object-bottom-right"
          />
        </div>

        <div className="absolute -bottom-[50%] -left-[10%] w-[60vw] h-[50vh] transform rotate-[25deg]">
          <Image
            src="/cloud.png"
            alt="Bottom-Left Cloud"
            fill
            className="object-contain object-bottom-left"
          />
        </div>
      </div>
      */}

      {/* 2. Deep Space 3D Constellations & Full-Page Shooting Stars Canvas */}
      <ConstellationsCanvas mouseX={offset.x} mouseY={offset.y} />

      {/* 3. Three.js 3D Textured Planets Canvas (TEMPORARILY ON STANDBY) */}
      {/* <PlanetsCanvas mouseX={offset.x} mouseY={offset.y} /> */}

      {/* 4. Foreground Floating Transparent Cloud Layer (TEMPORARILY COMMENTED OUT)
      <div
        className="max-md:hidden absolute inset-0 pointer-events-none select-none z-[100]"
        style={{
          transform: `translate3d(${offset.x * 48}px, ${offset.y * 48}px, 0)`,
        }}
      >
        <div className="absolute -bottom-[42%] -right-[65%] w-[85vw] h-[95vh] transform -rotate-[6deg] scale-x-[-1] opacity-95">
          <Image
            src="/cloud-transparent.png"
            alt="Foreground Bottom-Right Cloud"
            fill
            className="object-contain object-bottom-right drop-shadow-[0_10px_25px_rgba(0,0,0,0.5)]"
          />
        </div>

        <div className="absolute -top-[40%] -left-[25%] w-[80vw] h-[70vh] transform rotate-[170deg] opacity-90">
          <Image
            src="/cloud-transparent.png"
            alt="Foreground Top-Left Cloud"
            fill
            className="object-contain object-top-left drop-shadow-[0_10px_20px_rgba(0,0,0,0.6)]"
          />
        </div>

        <div className="absolute top-[65%] -left-[32%] w-[68%] h-[98vh] opacity-95 transform -rotate-[10deg]">
          <Image
            src="/fat-cloud-transparent.png"
            alt="Fat Cloud"
            fill
            className="object-contain drop-shadow-[0_12px_30px_rgba(0,0,0,0.6)]"
          />
        </div>

        <div className="absolute bottom-[60%] left-[78%] w-[80vw] h-[95vh] transform scale-x-[-1] opacity-85">
          <Image
            src="/cloud-transparent.png"
            alt="Foreground Bottom-Left Cloud"
            fill
            className="object-contain object-bottom-left drop-shadow-[0_8px_20px_rgba(0,0,0,0.4)]"
          />
        </div>
      </div>
      */}



      {/* 4. Artistic Floating Astronaut - Zero Gravity Parallax Floating Element */}
      <div
        className="absolute bottom-[20%] sm:-bottom-[7%] right-[4%] sm:right-[7%] w-[38vw] sm:w-[28vw] md:w-[22vw] max-w-[340px] aspect-[0.7] pointer-events-none select-none z-[25] transition-transform duration-300 ease-out"
        style={{
          transform: `translate3d(${offset.x * 42}px, ${offset.y * 42}px, 0)`,
        }}
      >
        <div className="relative w-full h-full animate-astro-float">
          {/* Subtle Ambient Cosmic Backlight Glow */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-cyan-500/20 via-amber-400/15 to-purple-600/20 blur-2xl opacity-70" />

          {/* Floating Astronaut Asset with Clean Removed Background */}
          <Image
            src="/astronaut.png"
            alt="Artistic Floating Astronaut"
            fill
            priority
            unoptimized
            className="object-contain filter drop-shadow-[0_15px_35px_rgba(0,0,0,0.85)] drop-shadow-[0_0_20px_rgba(56,189,248,0.4)]"
          />
        </div>
      </div>

      {/* 4b. Secondary Floating Astronaut (Top-Left Zero Gravity Element) */}
      <div
        className="absolute top-[22%] sm:top-[2%] left-[3%] sm:left-[6%] w-[35vw] sm:w-[25vw] md:w-[20vw] max-w-[310px] aspect-[0.75] pointer-events-none select-none z-[25] transition-transform duration-300 ease-out"
        style={{
          transform: `translate3d(${offset.x * -38}px, ${offset.y * -38}px, 0)`,
        }}
      >
        <div className="relative w-full h-full animate-astro-float-reverse">
          {/* Ambient Cosmic Backlight Glow */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-400/20 via-purple-600/15 to-cyan-500/20 blur-2xl opacity-65" />

          {/* Second Floating Astronaut Asset with Clean Removed Background */}
          <Image
            src="/astronaut2.png"
            alt="Second Floating Astronaut"
            fill
            priority
            unoptimized
            className="object-contain filter drop-shadow-[0_15px_35px_rgba(0,0,0,0.85)] drop-shadow-[0_0_20px_rgba(251,191,36,0.4)]"
          />
        </div>
      </div>

      {/* 5. Center Hero Title & High-End Theme-Matched CTA Button */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-30 px-4"
        style={{
          transform: `translate3d(${offset.x * 35}px, ${offset.y * 35}px, 0)`,
        }}
      >
        <div className="relative -translate-y-6 sm:-translate-y-10 w-[98vw] sm:w-[90vw] max-w-[1200px] h-[75vh] sm:h-[65vh] md:h-[75vh] lg:h-[95vh] flex items-center justify-center">

          {/* Celestial Subtitle Header above INNOVISION */}
          <div className="absolute top-[40%] sm:top-[30%] md:top-[30%] lg:top-[32%] pointer-events-none z-40 flex items-center gap-3">
            <span className="text-amber-300/80 text-xs sm:text-xl md:text-base font-serif drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]">✦</span>
            <h2 className="text-xs sm:text-base md:text-xl lg:text-2xl font-bold tracking-[0.4em] sm:tracking-[0.5em] uppercase font-[family-name:var(--font-cinzel)] text-amber-200 bg-[url('/celestial-text-bg-inverted.png')] bg-cover bg-center bg-clip-text text-transparent filter drop-shadow-[0_0_18px_rgba(251,191,36,0.75)] drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
              NIT ROURKELA&apos;S
            </h2>
            <span className="text-amber-300/80 text-xs sm:text-sm md:text-base font-serif drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]">✦</span>
          </div>

          <Image
            src="/innovision_transparent.png"
            alt="INNOVISION"
            fill
            priority
            className="relative z-30 object-contain filter drop-shadow-[0_8px_30px_rgba(0,0,0,0.95)] drop-shadow-[0_0_16px_rgba(251,191,36,0.6)]"
          />

          {/* Register Button */}
          <div className="absolute bottom-[30%] sm:bottom-[14%] md:bottom-[18%] lg:bottom-[22%] pointer-events-auto z-40">
            <button
              onClick={() => triggerLaunch("/register")}
              className="group relative inline-flex items-center justify-center p-1 sm:p-1.5 rounded-full bg-[#020712]/80 border border-white/20 backdrop-blur-2xl shadow-[0_12px_35px_rgba(0,0,0,0.9)] hover:border-white/50 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:scale-105 active:scale-95 cursor-pointer"
            >
              {/* Double-Bezel Inner Core */}
              <div className="relative flex items-center gap-3.5 sm:gap-4.5 rounded-full px-7 sm:px-9 py-3.5 sm:py-4 bg-[#03091e]/90 border border-white/10 shadow-[inset_0_1px_2px_rgba(255,255,255,0.2)] overflow-hidden">
                {/* Celestial Constellation Texture Overlay */}
                <div className="absolute inset-0 bg-[url('/celestial-text-bg.png')] bg-cover bg-center opacity-20 mix-blend-screen pointer-events-none group-hover:opacity-35 transition-opacity duration-500" />

                {/* Micro Glint Sweep Effect on Hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />

                {/* Celestial Text Label */}
                <div className="relative z-10 flex items-center gap-2">
                  <span className="text-[10px] text-cyan-300/80 font-serif">✦</span>
                  <span className="text-sm sm:text-base md:text-lg font-black tracking-[0.35em] uppercase text-white font-serif">
                    REGISTER
                  </span>
                  <span className="text-[10px] text-cyan-300/80 font-serif">✦</span>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* 6. Mobile Only Bottom Moon Horizon & Rover */}
      <div className="md:hidden absolute -bottom-32 left-1/2 -translate-x-1/2 w-[135vw] max-w-[650px] pointer-events-none select-none z-20 flex flex-col items-center justify-end">
        {/* Artistic Lunar Lander Craft Attached to Moon Apex */}
        <div className="relative w-32 sm:w-44 h-32 sm:h-44 -mb-10 sm:-mb-14 translate-y-8 -translate-x-24 sm:-translate-x-8 z-30 transform -rotate-14">
          <Image
            src="/lander.png"
            alt="Artistic Lunar Lander Spacecraft"
            fill
            unoptimized
            className="object-contain filter drop-shadow-[0_8px_20px_rgba(0,0,0,0.95)] drop-shadow-[0_0_15px_rgba(251,191,36,0.35)]"
          />
        </div>

        <Image
          src="/mobile-moon.png"
          alt="Moon Horizon"
          width={700}
          height={400}
          priority
          unoptimized
          className="object-contain object-bottom w-full h-auto filter drop-shadow-[0_-8px_20px_rgba(255,255,255,0.12)]"
        />
      </div>
    </main>
  );
}

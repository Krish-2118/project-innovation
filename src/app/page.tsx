"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import ConstellationsCanvas from "@/components/home/ConstellationsCanvas";
import { useRocketTransition } from "@/components/transition/RocketTransitionContext";
import FooterWithParticles from "@/components/layout/FooterWithParticles";

export default function Home() {
  const mouseRef = useRef({ targetX: 0, targetY: 0, currentX: 0, currentY: 0 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const { triggerLaunch } = useRocketTransition();

  // Framer Motion scroll transforms for continuous background and scroll-driven hero fade
  const { scrollY } = useScroll();

  // Scroll animations: text & astronauts persist longer and float away smoothly as user scrolls down.
  // Extended range ensures the hero content floats gracefully upward as the footer rises in,
  // preventing the page from ever feeling empty.
  const heroOpacity = useTransform(scrollY, [0, 180, 420, 620], [1, 0.95, 0.45, 0]);
  const heroY = useTransform(scrollY, [0, 620], [0, -110]);
  const heroScale = useTransform(scrollY, [0, 620], [1, 0.93]);

  const astroOpacity = useTransform(scrollY, [0, 180, 400, 600], [1, 0.92, 0.4, 0]);
  const astro1Y = useTransform(scrollY, [0, 600], [0, -125]);
  const astro2Y = useTransform(scrollY, [0, 600], [0, -155]);

  const scrollCueOpacity = useTransform(scrollY, [0, 120], [1, 0]);

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
    <div className="relative w-full min-h-screen bg-[#020712] flex flex-col selection:bg-[#fbbf24]/30 selection:text-amber-200">
      {/* 1. CONTINUOUS FIXED DEEP SPACE BACKGROUND (Seamless across hero and footer) */}
      <div className="fixed inset-0 select-none pointer-events-none z-0 overflow-hidden">
        {/* Deep Space Background Image - Subtle smooth reverse parallax */}
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

        {/* Deep Space 3D Constellations & Full-Page Shooting Stars Canvas */}
        <ConstellationsCanvas mouseX={offset.x} mouseY={offset.y} />

        {/* Ambient Cosmic Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_45%,#020712_95%)] opacity-70 pointer-events-none" />
      </div>

      {/* 2. HERO SECTION */}
      <main className="hero-bg relative w-full h-screen overflow-hidden shrink-0 z-10 pointer-events-none">
        {/* 4. Artistic Floating Astronaut (Bottom-Right) - Fades out on scroll */}
        <motion.div
          style={{ opacity: astroOpacity, y: astro1Y }}
          className="absolute bottom-[20%] sm:-bottom-[7%] right-[4%] sm:right-[7%] w-[38vw] sm:w-[28vw] md:w-[22vw] max-w-[340px] aspect-[0.7] select-none z-[25]"
        >
          <div
            className="w-full h-full transition-transform duration-300 ease-out"
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
        </motion.div>

        {/* 4b. Secondary Floating Astronaut (Top-Left) - Fades out on scroll */}
        <motion.div
          style={{ opacity: astroOpacity, y: astro2Y }}
          className="absolute top-[22%] sm:top-[2%] left-[3%] sm:left-[6%] w-[35vw] sm:w-[25vw] md:w-[20vw] max-w-[310px] aspect-[0.75] select-none z-[25]"
        >
          <div
            className="w-full h-full transition-transform duration-300 ease-out"
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
        </motion.div>

        {/* 5. Center Hero Title & High-End Theme-Matched CTA Button - Fades out on scroll */}
        <motion.div
          style={{ opacity: heroOpacity, y: heroY, scale: heroScale }}
          className="absolute inset-0 flex items-center justify-center select-none z-30 px-4"
        >
          <div
            className="relative -translate-y-6 sm:-translate-y-10 w-[98vw] sm:w-[90vw] max-w-[1200px] h-[75vh] sm:h-[65vh] md:h-[75vh] lg:h-[95vh] flex items-center justify-center"
            style={{
              transform: `translate3d(${offset.x * 35}px, ${offset.y * 35}px, 0)`,
            }}
          >
            {/* Celestial Subtitle Header above INNOVISION */}
            <div className="absolute top-[40%] sm:top-[30%] md:top-[30%] lg:top-[32%] z-40 flex items-center gap-3">
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
        </motion.div>

        {/* 6. Mobile Only Bottom Moon Horizon & Rover */}
        <motion.div
          style={{ opacity: heroOpacity }}
          className="md:hidden absolute -bottom-32 left-1/2 -translate-x-1/2 w-[135vw] max-w-[650px] select-none z-20 flex flex-col items-center justify-end"
        >
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
        </motion.div>

        {/* 7. Celestial Scroll Down Cue */}
        <motion.div
          style={{ opacity: scrollCueOpacity }}
          className="hidden md:flex absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex-col items-center gap-1 pointer-events-auto transition-opacity"
        >
          <button
            onClick={() => {
              window.scrollTo({
                top: window.innerHeight * 0.7,
                behavior: "smooth",
              });
            }}
            className="flex flex-col items-center gap-1 text-slate-400 hover:text-amber-300 transition-colors cursor-pointer group"
            aria-label="Scroll to explore"
          >
            <span className="text-[9px] tracking-[0.3em] uppercase font-mono text-amber-200/60 group-hover:text-amber-200">
              Scroll to Explore
            </span>
            <div className="w-4 h-7 rounded-full border border-amber-400/30 flex items-start justify-center p-0.5 bg-[#020712]/40 backdrop-blur-sm shadow-[0_0_10px_rgba(251,191,36,0.1)]">
              <div className="w-1 h-2 rounded-full bg-gradient-to-b from-amber-300 to-teal-300 animate-bounce" />
            </div>
          </button>
        </motion.div>
      </main>

      {/* 3. CELESTIAL GLASSMORPHIC FOOTER WITH PARTICLES (Overlaying the continuous starry canvas) */}
      <div className="relative z-20 w-full pointer-events-auto -mt-10 sm:-mt-16 md:-mt-20">
        <FooterWithParticles />
      </div>
    </div>
  );
}

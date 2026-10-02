"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { SITE } from "@/lib/data/site";

/**
 * Chapter 0 — Launch. The original hero composition, choreographed: the logo
 * resolves out of a blur as the intro ink-reveal finishes, the astronauts
 * drift in, and on scroll the camera "flies through" them as the frame fades
 * to the black the Mission Briefing opens on.
 */
export default function HeroSection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  const titleY = useTransform(scrollYProgress, [0, 1], ["0vh", "-16vh"]);
  const titleScale = useTransform(scrollYProgress, [0, 1], [1, 0.82]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const astroScale = useTransform(scrollYProgress, [0, 1], [1, 1.45]);
  const astroRightX = useTransform(scrollYProgress, [0, 1], ["0vw", "24vw"]);
  const astroRightY = useTransform(scrollYProgress, [0, 1], ["0vh", "-12vh"]);
  const astroLeftX = useTransform(scrollYProgress, [0, 1], ["0vw", "-24vw"]);
  const astroLeftY = useTransform(scrollYProgress, [0, 1], ["0vh", "8vh"]);
  const astroOpacity = useTransform(scrollYProgress, [0.35, 0.9], [1, 0]);


  // Markup never branches on reduced motion (that would break hydration);
  // `.iv-scroll-fx` neutralises these transforms in CSS instead.
  const titleStyle = { y: titleY, scale: titleScale, opacity: titleOpacity };
  const rightStyle = { x: astroRightX, y: astroRightY, scale: astroScale, opacity: astroOpacity };
  const leftStyle = { x: astroLeftX, y: astroLeftY, scale: astroScale, opacity: astroOpacity };

  return (
    <section
      ref={ref}
      id="launch"
      aria-labelledby="launch-title"
      className="iv-hero relative z-20 h-[100svh] min-h-[560px] w-full shrink-0 overflow-x-clip"
    >
      {/* Fade to the briefing's ink so the next section starts without a seam */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 z-[5] h-[38vh] bg-gradient-to-b from-transparent to-[var(--ink)]" />

      <h1 id="launch-title" className="sr-only">
        {SITE.name} {SITE.edition} — {SITE.institute}&apos;s {SITE.theme}
      </h1>

      {/* Primary floating astronaut (bottom-right) */}
      <motion.div
        style={rightStyle}
        className="iv-scroll-fx absolute bottom-[20%] sm:-bottom-[7%] right-[4%] sm:right-[7%] w-[38vw] sm:w-[28vw] md:w-[22vw] max-w-[340px] aspect-[0.7] pointer-events-none select-none z-[25]"
      >
        <div className="iv-hero-in iv-hero-in--from-right h-full w-full">
          <div data-parallax="42" className="h-full w-full">
            <div className="relative w-full h-full animate-astro-float">
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-cyan-500/20 via-amber-400/15 to-purple-600/20 blur-2xl opacity-70" />
              <Image
                src="/astronaut.png"
                alt=""
                fill
                sizes="(max-width: 768px) 38vw, 22vw"
                className="object-contain drop-shadow-[0_15px_35px_rgba(0,0,0,0.85)]"
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Secondary floating astronaut (top-left) */}
      <motion.div
        style={leftStyle}
        className="iv-scroll-fx absolute top-[22%] sm:top-[2%] left-[3%] sm:left-[6%] w-[35vw] sm:w-[25vw] md:w-[20vw] max-w-[310px] aspect-[0.75] pointer-events-none select-none z-[25]"
      >
        <div className="iv-hero-in iv-hero-in--from-left h-full w-full">
          <div data-parallax="-38" className="h-full w-full">
            <div className="relative w-full h-full animate-astro-float-reverse">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-400/20 via-purple-600/15 to-cyan-500/20 blur-2xl opacity-65" />
              <Image
                src="/astronaut2.png"
                alt=""
                fill
                sizes="(max-width: 768px) 35vw, 20vw"
                className="object-contain drop-shadow-[0_15px_35px_rgba(0,0,0,0.85)]"
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Title, subtitle and primary call to action */}
      <motion.div
        style={titleStyle}
        className="iv-scroll-fx absolute inset-0 z-30 flex items-center justify-center px-4 pointer-events-none select-none"
      >
        <div data-parallax="35" className="flex h-full w-full items-center justify-center">
          <div className="relative -translate-y-6 sm:-translate-y-10 w-[98vw] sm:w-[90vw] max-w-[1200px] h-[75vh] sm:h-[65vh] md:h-[75vh] lg:h-[95vh] flex items-center justify-center">
            <div
              aria-hidden="true"
              className="iv-hero-in iv-hero-in--spread absolute top-[35%] sm:top-[30%] lg:top-[32%] z-40 flex items-center gap-3"
            >
              <span className="text-amber-300/80 text-xs sm:text-base font-serif drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]">✦</span>
              <p className="text-xs sm:text-base md:text-xl lg:text-2xl font-bold tracking-[0.4em] sm:tracking-[0.5em] uppercase font-[family-name:var(--font-cinzel)] text-amber-200 bg-[url('/celestial-text-bg-inverted.png')] bg-cover bg-center bg-clip-text text-transparent drop-shadow-[0_0_18px_rgba(251,191,36,0.75)]">
                {SITE.institute}&apos;s
              </p>
              <span className="text-amber-300/80 text-xs sm:text-base font-serif drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]">✦</span>
            </div>

            <div className="iv-hero-in iv-hero-in--focus absolute inset-0 z-30">
              <Image
                src="/innovision_transparent.png"
                alt=""
                fill
                loading="eager"
                fetchPriority="high"
                sizes="(max-width: 640px) 98vw, (max-width: 1280px) 90vw, 1200px"
                className="object-contain drop-shadow-[0_8px_30px_rgba(0,0,0,0.95)] drop-shadow-[0_0_16px_rgba(251,191,36,0.6)]"
              />
            </div>

            <div className="iv-hero-in iv-hero-in--rise absolute bottom-[30%] sm:bottom-[14%] md:bottom-[18%] lg:bottom-[22%] z-40 pointer-events-auto">
              <Link href="/register" className="iv-btn-primary group">
                <span className="iv-btn-primary__core">
                  <span className="iv-btn-primary__texture" aria-hidden="true" />
                  <span className="iv-btn-primary__glint" aria-hidden="true" />
                  <span className="relative z-10 flex items-center gap-2">
                    <span className="text-[10px] text-cyan-300/80 font-serif" aria-hidden="true">✦</span>
                    <span className="text-sm sm:text-base md:text-lg font-black tracking-[0.35em] uppercase text-white font-serif">
                      Register
                    </span>
                    <span className="text-[10px] text-cyan-300/80 font-serif" aria-hidden="true">✦</span>
                  </span>
                </span>
              </Link>
            </div>
          </div>
        </div>
      </motion.div>


    </section>
  );
}

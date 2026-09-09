"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import dynamic from "next/dynamic";

const EventGlobe = dynamic(() => import("./EventGlobe"), { ssr: false });

const EVENTS = [
  {
    id: "robowars",
    title: "ROBO WARS",
    subtitle: "FLAGSHIP EVENT",
    description:
      "Witness the ultimate clash of steel and circuits. Design, build, and battle your robots in an arena of pure mechanical fury. Registration opens soon — gear up for glory!",
    textureUrl: "/planets/robowars.jpg",
    prevLabel: "HACKINNOVISION",
    nextLabel: "STELLAR NIGHT",
  },
  {
    id: "stellarnight",
    title: "STELLAR NIGHT",
    subtitle: "FLAGSHIP EVENT",
    description:
      "An evening of celestial wonder — live performances, immersive light shows, and cosmic vibes under the stars. The night sky comes alive with music, art, and unforgettable energy.",
    textureUrl: "/planets/stellarnight.jpg",
    prevLabel: "ROBO WARS",
    nextLabel: "HACKINNOVISION",
  },
  {
    id: "hackinnovision",
    title: "HACK INNOVISION",
    subtitle: "FLAGSHIP EVENT",
    description:
      "A 24-hour hackathon where brilliant minds converge to build the future. Code, collaborate, and compete for glory. Push the boundaries of innovation — one commit at a time.",
    textureUrl: "/planets/hackinnovision.jpg",
    prevLabel: "STELLAR NIGHT",
    nextLabel: "ROBO WARS",
  },
];

const textures = EVENTS.map(e => e.textureUrl);

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 200 : -200,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 200 : -200,
    opacity: 0,
  }),
};


export default function EventCarousel({ isActive = true }: { isActive?: boolean }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const isScrollingRef = React.useRef(false);

  const currentEvent = EVENTS[currentIndex];

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setCurrentIndex(prev => {
      const next = prev + newDirection;
      if (next < 0) return EVENTS.length - 1;
      if (next >= EVENTS.length) return 0;
      return next;
    });
  };

  React.useEffect(() => {
    if (!isActive) return;

    const handleWheel = (e: WheelEvent) => {
      // Allow scrolling up to the hero if at the first planet
      if (currentIndex === 0 && e.deltaY < 0) {
        return;
      }
      
      e.preventDefault();

      if (isScrollingRef.current) return;
      
      if (e.deltaY > 50) {
        isScrollingRef.current = true;
        paginate(1);
        setTimeout(() => { isScrollingRef.current = false; }, 1000);
      } else if (e.deltaY < -50) {
        isScrollingRef.current = true;
        paginate(-1);
        setTimeout(() => { isScrollingRef.current = false; }, 1000);
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [isActive, currentIndex]);

  return (
    <div 
      className="relative h-screen w-full overflow-hidden text-white flex flex-col selection:bg-white/30 bg-transparent"
      style={{ fontFamily: "var(--font-inter), sans-serif" }}
    >
      
      {/* ===== 3D PLANET CAROUSEL (Background Layer) ===== */}
      <div className="absolute inset-0 w-full h-full z-10 pointer-events-none">
        <EventGlobe textures={textures} currentIndex={currentIndex} className="w-full h-full pointer-events-auto" />
      </div>

      {/* ===== MAIN CONTENT ===== */}
      <main className="flex-grow flex flex-col items-center justify-start pt-[14vh] md:pt-[18vh] relative z-20 px-4 pointer-events-none">
        
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="flex flex-col items-center text-center max-w-3xl pointer-events-auto"
          >
            {/* Subtitle */}
            <h2 className="text-[10px] md:text-sm uppercase tracking-[0.5em] text-cyan-300 mb-4 font-medium drop-shadow-[0_0_18px_rgba(34,211,238,0.7)]" style={{ fontFamily: "var(--font-exo2), sans-serif" }}>
              {currentEvent.subtitle}
            </h2>

            {/* Title */}
            <h1 className="text-3xl md:text-6xl lg:text-[6.8rem] whitespace-nowrap leading-[0.9] tracking-[0.08em] mb-5 drop-shadow-[0_12px_30px_rgba(0,0,0,0.85)] font-semibold" style={{ fontFamily: "var(--font-exo2), sans-serif" }}>
              {currentEvent.title}
            </h1>

            {/* Teal accent line */}
            <div className="w-12 h-[2px] bg-cyan-400 mb-6" />

            {/* Description */}
            <p className="text-sm md:text-base leading-relaxed text-slate-100/90 max-w-xl mx-auto drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)] mb-8" style={{ fontFamily: "var(--font-lora), serif" }}>
              {currentEvent.description}
            </p>
            
            {/* CTA Button */}
            <button className="border border-cyan-400/60 text-white px-10 py-3 rounded-full font-bold text-[10px] md:text-xs tracking-[0.28em] hover:bg-cyan-300 hover:text-slate-950 transition-all duration-300 backdrop-blur-sm shadow-[0_0_20px_rgba(34,211,238,0.18)]" style={{ fontFamily: "var(--font-exo2), sans-serif" }}>
              GET STARTED
            </button>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Down Arrow */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 animate-bounce pointer-events-none">
        <ChevronDown className="w-6 h-6 text-gray-400" />
      </div>
    </div>
  );
}

"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

export default function FloatingAstronauts() {
  const [mounted, setMounted] = useState(false);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);

    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 2; // -1 to 1
      const y = (e.clientY / innerHeight - 0.5) * 2;
      setMouseOffset({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-25 overflow-hidden select-none">
      {/* 1. LEFT FLOATING UFO SPACESHIP */}
      <motion.div
        initial={{ opacity: 0, x: -60, scale: 0.9 }}
        animate={{
          opacity: 1,
          x: mouseOffset.x * -18,
          y: mouseOffset.y * -14,
          scale: 1,
        }}
        transition={{
          opacity: { duration: 1.2, ease: "easeOut" },
          scale: { duration: 1.2, ease: "easeOut" },
          x: { duration: 0.6, ease: "easeOut" },
          y: { duration: 0.6, ease: "easeOut" },
        }}
        className="absolute left-[2%] sm:left-[3%] lg:left-[4%] xl:left-[6%] top-[28%] sm:top-[32%] lg:top-[36%] -translate-y-1/2 w-[160px] sm:w-[190px] md:w-[230px] lg:w-[275px] xl:w-[315px] aspect-[1501/871] hidden sm:block"
      >
        <motion.div
          animate={{
            y: [-10, 14, -10],
            rotate: [-2, 2.5, -2],
          }}
          transition={{
            duration: 6.8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="relative w-full h-full filter drop-shadow-[0_0_30px_rgba(251,191,36,0.45)] drop-shadow-[0_0_60px_rgba(56,189,248,0.25)]"
        >
          <Image
            src="/ufo.png"
            alt="Alien UFO Spaceship Floating in Deep Space"
            fill
            priority
            sizes="(max-width: 768px) 190px, (max-width: 1200px) 275px, 315px"
            className="object-contain"
          />
        </motion.div>
      </motion.div>

      {/* 2. RIGHT WAVING ASTRONAUT */}
      <motion.div
        initial={{ opacity: 0, x: 60, scale: 0.9 }}
        animate={{
          opacity: 1,
          x: mouseOffset.x * 16,
          y: mouseOffset.y * 14,
          scale: 1,
        }}
        transition={{
          opacity: { duration: 1.2, ease: "easeOut" },
          scale: { duration: 1.2, ease: "easeOut" },
          x: { duration: 0.6, ease: "easeOut" },
          y: { duration: 0.6, ease: "easeOut" },
        }}
        className="absolute right-[2%] sm:right-[3%] lg:right-[5%] xl:right-[7%] top-[28%] sm:top-[31%] lg:top-[33%] -translate-y-1/2 w-[110px] sm:w-[135px] md:w-[165px] lg:w-[195px] xl:w-[225px] aspect-[402/509] hidden sm:block"
      >
        <motion.div
          animate={{
            y: [16, -14, 16],
            rotate: [2.5, -2.5, 2.5],
          }}
          transition={{
            duration: 7.2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="relative w-full h-full filter drop-shadow-[0_0_35px_rgba(56,189,248,0.35)] drop-shadow-[0_0_70px_rgba(251,191,36,0.2)]"
        >
          <Image
            src="/astronaut-waving.png"
            alt="Cosmic Astronaut Waving in Space"
            fill
            priority
            sizes="(max-width: 768px) 0vw, (max-width: 1200px) 340px, 390px"
            className="object-contain"
          />
        </motion.div>
      </motion.div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

interface CosmicTitleProps {
  text?: string;
  className?: string;
  delay?: number;
  animateOnHover?: boolean;
}

export function CosmicTitleText({
  className = "",
  delay = 0,
}: CosmicTitleProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`relative inline-flex items-center justify-center cursor-pointer select-none group py-2 px-4 ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 1. Deep Cosmic Backlight & Flare */}
      <motion.div
        animate={{
          scale: isHovered ? [1, 1.15, 1.05] : [1, 1.08, 1],
          opacity: isHovered ? 0.9 : 0.6,
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 bg-gradient-to-r from-amber-500/30 via-cyan-500/40 to-blue-600/30 blur-3xl rounded-full pointer-events-none -z-10"
      />

      {/* 2. Main 3D Logo Graphic with Entrance & Floating Motion */}
      <motion.div
        initial={{ opacity: 0, scale: 0.85, y: 20, filter: "blur(12px)" }}
        animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
        transition={{
          duration: 1.0,
          delay: delay / 1000,
          ease: [0.16, 1, 0.3, 1],
        }}
        className="relative flex items-center justify-center w-full max-w-[90vw] sm:max-w-lg md:max-w-xl lg:max-w-2xl"
      >
        <motion.div
          animate={{
            y: isHovered ? [-2, -8, -2] : [0, -5, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="relative w-full h-[75px] sm:h-[95px] md:h-[120px] lg:h-[130px] aspect-[1000/296]"
        >
          <Image
            src="/about-us-transparent.png"
            alt="ABOUT US"
            fill
            priority
            sizes="(max-width: 768px) 90vw, 672px"
            className="object-contain drop-shadow-[0_0_35px_rgba(0,191,255,0.7)] drop-shadow-[0_0_15px_rgba(255,215,0,0.8)] transition-transform duration-500 group-hover:scale-[1.03]"
          />

          {/* 3. Lens Flare Star Sparkle Overlays */}
          <motion.div
            animate={{
              opacity: [0.3, 1, 0.3],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[28%] left-[58%] w-4 h-4 md:w-6 md:h-6 pointer-events-none"
          >
            <div className="w-full h-full bg-amber-200 rounded-full blur-[2px] shadow-[0_0_12px_#F59E0B]" />
            <div className="absolute top-1/2 left-0 w-full h-[2px] bg-white -translate-y-1/2 shadow-[0_0_8px_#FFF]" />
            <div className="absolute left-1/2 top-0 h-full w-[2px] bg-white -translate-x-1/2 shadow-[0_0_8px_#FFF]" />
          </motion.div>

          {/* 4. Character-Masked Sweeping Shimmer Flare */}
          <div 
            className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden mix-blend-color-dodge z-20"
            style={{
              WebkitMaskImage: "url('/about-us-transparent.png')",
              maskImage: "url('/about-us-transparent.png')",
              WebkitMaskSize: "contain",
              maskSize: "contain",
              WebkitMaskRepeat: "no-repeat",
              maskRepeat: "no-repeat",
              WebkitMaskPosition: "center",
              maskPosition: "center",
            }}
          >
            <div className="w-1/3 h-full bg-gradient-to-r from-transparent via-amber-100/90 to-transparent -skew-x-25 translate-x-[-150%] group-hover:translate-x-[350%] transition-transform duration-1000 ease-in-out" />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export const HyperText = CosmicTitleText;
export default CosmicTitleText;

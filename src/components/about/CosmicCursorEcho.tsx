"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Waypoint {
  id: number;
  topPct: number;
  leftPct: number;
  category: string;
  statement: string;
}

const CELESTIAL_WAYPOINTS: Waypoint[] = [
  {
    id: 1,
    topPct: 16,
    leftPct: 5,
    category: "SIGNAL DETECTED",
    statement: "Curiosity leaves traces in unexplored space.",
  },
  {
    id: 2,
    topPct: 16,
    leftPct: 95,
    category: "TRANSMISSION ECHO",
    statement: "Starlight carries memories across cosmic voids.",
  },
  {
    id: 3,
    topPct: 62,
    leftPct: 95,
    category: "COORDINATE ANCHORED",
    statement: "Navigation vector recorded in quantum memory.",
  },
  {
    id: 4,
    topPct: 92,
    leftPct: 75,
    category: "ORBITAL VECTOR",
    statement: "Tracing human intention through the cosmos.",
  },
  {
    id: 5,
    topPct: 92,
    leftPct: 10,
    category: "CELESTIAL TRACE",
    statement: "Pioneering pathways beyond the known horizon.",
  },
  {
    id: 6,
    topPct: 54,
    leftPct: 5,
    category: "ANOMALY DETECTED",
    statement: "Extraterrestrial frequencies resonating across uncharted sectors.",
  },
];

export default function CosmicCursorEcho() {
  const [displayWaypoint, setDisplayWaypoint] = useState<Waypoint | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || typeof window === "undefined") return;

    const handlePointerMove = (e: MouseEvent | PointerEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;

      const PROXIMITY_THRESHOLD = Math.max(130, Math.min(innerWidth * 0.13, 190));

      let matchedWp: Waypoint | null = null;
      let minDistance = Infinity;

      CELESTIAL_WAYPOINTS.forEach((wp) => {
        const wpX = (wp.leftPct / 100) * innerWidth;
        const wpY = (wp.topPct / 100) * innerHeight;
        const dist = Math.hypot(clientX - wpX, clientY - wpY);

        if (dist < PROXIMITY_THRESHOLD && dist < minDistance) {
          minDistance = dist;
          matchedWp = wp;
        }
      });

      if (matchedWp) {
        setDisplayWaypoint((prev) => (prev?.id !== matchedWp!.id ? matchedWp : prev));
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener("mousemove", handlePointerMove, { passive: true });
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("mouseleave", handleMouseLeave, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handlePointerMove);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [mounted]);

  if (!mounted) return null;

  const getWaypointStyle = (wp: Waypoint | null): React.CSSProperties => {
    if (!wp) return { left: "2.2vw", top: "16%" };
    switch (wp.id) {
      case 1:
        return { left: "2.2vw", top: "16%" };
      case 2:
        return { right: "2.2vw", top: "16%" };
      case 3:
        return { right: "2.2vw", top: "60%", transform: "translateY(-50%)" };
      case 4:
        return { right: "2.8vw", bottom: "5%" };
      case 5:
        return { left: "2.2vw", bottom: "5%" };
      case 6:
        return { left: "2.2vw", top: "54%", transform: "translateY(-50%)" };
      default:
        return { left: "2.2vw", top: "12%" };
    }
  };

  const isRightAligned = displayWaypoint?.id === 2 || displayWaypoint?.id === 3 || displayWaypoint?.id === 4;

  return (
    <div className="fixed inset-0 pointer-events-none z-35 overflow-hidden select-none">
      <AnimatePresence>
        {isVisible && displayWaypoint && (
          <motion.div
            key={displayWaypoint.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28, ease: "easeIn" }}
            className={`absolute w-[22vw] min-w-[220px] max-w-[310px] pointer-events-none select-none z-50 flex flex-col gap-2 ${
              isRightAligned ? "items-end text-right" : "items-start text-left"
            }`}
            style={getWaypointStyle(displayWaypoint)}
          >
            {/* Category Header & Waypoint Tag */}
            <motion.div
              initial={{
                opacity: 0,
                y: 20,
                scale: 0.92,
                rotateX: 10,
                filter: "blur(8px)",
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
                rotateX: 0,
                filter: "blur(0px)",
              }}
              exit={{
                opacity: 0,
                y: -12,
                scale: 0.95,
                filter: "blur(5px)",
                transition: { duration: 0.24, ease: "easeIn" },
              }}
              transition={{
                duration: 0.6,
                ease: [0.34, 1.56, 0.64, 1],
              }}
              className={`flex flex-wrap items-center gap-2 ${isRightAligned ? "flex-row-reverse" : "flex-row"}`}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-[#FFE600] shadow-[0_0_12px_#FFE600,0_0_24px_#FFE600] animate-pulse shrink-0" />
              <span
                className="text-xs sm:text-sm md:text-[14px] font-black tracking-[0.2em] uppercase font-orbitron text-[#FFE600]"
                style={{
                  textShadow:
                    "0 0 14px #FFE600, 0 0 28px rgba(255,230,0,0.8), 0 2px 4px #000, -1.5px -1.5px 0 #000, 1.5px -1.5px 0 #000, -1.5px 1.5px 0 #000, 1.5px 1.5px 0 #000",
                }}
              >
                {displayWaypoint.category}
              </span>
              <span
                className="text-[11px] sm:text-xs font-mono font-black text-[#00F0FF] tracking-wider"
                style={{
                  textShadow:
                    "0 0 10px #00F0FF, 0 2px 4px #000, -1px -1px 0 #000, 1px -1px 0 #000",
                }}
              >
                [0{displayWaypoint.id}]
              </span>
            </motion.div>

            {/* High-Contrast Luminous Statement Text */}
            <motion.p
              initial={{
                opacity: 0,
                y: 20,
                scale: 0.92,
                rotateX: 10,
                filter: "blur(8px)",
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
                rotateX: 0,
                filter: "blur(0px)",
              }}
              exit={{
                opacity: 0,
                y: -12,
                scale: 0.95,
                filter: "blur(5px)",
                transition: { duration: 0.24, ease: "easeIn" },
              }}
              transition={{
                duration: 0.6,
                delay: 0.05,
                ease: [0.34, 1.56, 0.64, 1],
              }}
              className="text-sm sm:text-base md:text-[17px] lg:text-[18px] font-orbitron font-bold leading-snug tracking-wide text-white"
              style={{
                textShadow:
                  "0 0 14px rgba(0,240,255,0.85), 0 0 28px rgba(0,240,255,0.45), 0 2px 4px #000, 0 4px 10px #000, -1.5px -1.5px 0 #000, 1.5px 1.5px 0 #000, -1.5px 1.5px 0 #000, 1.5px 1.5px 0 #000",
              }}
            >
              {displayWaypoint.statement}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

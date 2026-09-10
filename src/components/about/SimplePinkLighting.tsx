"use client";

import React, { useEffect, useState } from "react";

interface SpotData {
  top: string;
  left: string;
  width: string;
  height: string;
  gradient: string;
}

const COLOR_PALETTE = [
  "rgba(219, 39, 119, 0.40)", // Deep Hot Magenta
  "rgba(190, 24, 93, 0.38)",  // Deep Rose Berry
  "rgba(225, 29, 72, 0.36)",  // Deep Cosmic Crimson Pink
  "rgba(157, 23, 77, 0.34)",  // Deep Dark Plum Pink
  "rgba(192, 38, 211, 0.32)", // Deep Fuchsia Violet
];

const INITIAL_SPOT_1: SpotData = {
  top: "10%",
  left: "8%",
  width: "800px",
  height: "640px",
  gradient:
    "radial-gradient(ellipse 65% 55% at 50% 50%, rgba(219, 39, 119, 0.40) 0%, rgba(190, 24, 93, 0.16) 45%, rgba(112, 26, 117, 0.04) 75%, transparent 100%)",
};

const INITIAL_SPOT_2: SpotData = {
  top: "25%",
  left: "55%",
  width: "850px",
  height: "680px",
  gradient:
    "radial-gradient(ellipse 65% 55% at 50% 50%, rgba(190, 24, 93, 0.38) 0%, rgba(157, 23, 77, 0.14) 45%, rgba(112, 26, 117, 0.04) 75%, transparent 100%)",
};

const INITIAL_SPOT_3: SpotData = {
  top: "60%",
  left: "20%",
  width: "820px",
  height: "660px",
  gradient:
    "radial-gradient(ellipse 65% 55% at 50% 50%, rgba(225, 29, 72, 0.36) 0%, rgba(219, 39, 119, 0.14) 45%, transparent 100%)",
};

const generateRandomFullViewportSpot = (): SpotData => {
  const topPct = Math.floor(Math.random() * 80);
  const leftPct = Math.floor(Math.random() * 75);
  const widthPx = Math.floor(Math.random() * 300 + 700);
  const heightPx = Math.floor(widthPx * 0.82);

  const mainColor =
    COLOR_PALETTE[Math.floor(Math.random() * COLOR_PALETTE.length)];

  return {
    top: `${topPct}%`,
    left: `${leftPct}%`,
    width: `${widthPx}px`,
    height: `${heightPx}px`,
    gradient: `radial-gradient(ellipse 65% 55% at 50% 50%, ${mainColor} 0%, rgba(190, 24, 93, 0.16) 45%, rgba(112, 26, 117, 0.04) 75%, transparent 100%)`,
  };
};

export default function SimplePinkLighting() {
  const [mounted, setMounted] = useState(false);
  const [spot1, setSpot1] = useState<SpotData>(INITIAL_SPOT_1);
  const [spot2, setSpot2] = useState<SpotData>(INITIAL_SPOT_2);
  const [spot3, setSpot3] = useState<SpotData>(INITIAL_SPOT_3);

  const [opacity1, setOpacity1] = useState(0);
  const [opacity2, setOpacity2] = useState(0);
  const [opacity3, setOpacity3] = useState(0);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);

    let t1: NodeJS.Timeout;
    let t2: NodeJS.Timeout;

    setSpot1(generateRandomFullViewportSpot());
    setOpacity1(0.85);

    const runFullViewportLoop = () => {
      t1 = setTimeout(() => {
        setSpot2(generateRandomFullViewportSpot());
        setOpacity2(0.85);
        setOpacity1(0);

        t2 = setTimeout(() => {
          setSpot3(generateRandomFullViewportSpot());
          setOpacity3(0.85);
          setOpacity2(0);

          setTimeout(() => {
            setSpot1(generateRandomFullViewportSpot());
            setOpacity1(0.85);
            setOpacity3(0);

            runFullViewportLoop();
          }, 3500);
        }, 3500);
      }, 3500);
    };

    runFullViewportLoop();

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  if (!mounted) {
    return (
      <div className="absolute inset-0 pointer-events-none select-none z-10 overflow-hidden" />
    );
  }

  return (
    <div className="absolute inset-0 pointer-events-none select-none z-10 overflow-hidden">
      {/* SPOT 1: FULL VIEWPORT RANDOM PINK GRADIENT */}
      <div
        className="absolute rounded-full pointer-events-none mix-blend-screen transition-all duration-[3800ms] ease-in-out"
        style={{
          top: spot1.top,
          left: spot1.left,
          width: spot1.width,
          height: spot1.height,
          background: spot1.gradient,
          filter: opacity1 > 0 ? "blur(65px)" : "blur(85px)",
          transform: opacity1 > 0 ? "scale(1.06)" : "scale(0.90)",
          opacity: opacity1,
        }}
      />

      {/* SPOT 2: FULL VIEWPORT RANDOM PINK GRADIENT */}
      <div
        className="absolute rounded-full pointer-events-none mix-blend-screen transition-all duration-[3800ms] ease-in-out"
        style={{
          top: spot2.top,
          left: spot2.left,
          width: spot2.width,
          height: spot2.height,
          background: spot2.gradient,
          filter: opacity2 > 0 ? "blur(65px)" : "blur(85px)",
          transform: opacity2 > 0 ? "scale(1.06)" : "scale(0.90)",
          opacity: opacity2,
        }}
      />

      {/* SPOT 3: FULL VIEWPORT RANDOM PINK GRADIENT */}
      <div
        className="absolute rounded-full pointer-events-none mix-blend-screen transition-all duration-[3800ms] ease-in-out"
        style={{
          top: spot3.top,
          left: spot3.left,
          width: spot3.width,
          height: spot3.height,
          background: spot3.gradient,
          filter: opacity3 > 0 ? "blur(65px)" : "blur(85px)",
          transform: opacity3 > 0 ? "scale(1.06)" : "scale(0.90)",
          opacity: opacity3,
        }}
      />
    </div>
  );
}

"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import PlanetaryWaypoints from "@/components/about/PlanetaryWaypoints";
import AboutConstellations from "@/components/about/AboutConstellations";
import SimplePinkLighting from "@/components/about/SimplePinkLighting";
import SpacecraftCursor from "@/components/about/SpacecraftCursor";
import CosmicCursorEcho from "@/components/about/CosmicCursorEcho";
import CosmicCometSystem from "@/components/about/CosmicCometSystem";
import FloatingAstronauts from "@/components/about/FloatingAstronauts";
import "./about.css";

export default function AboutPage() {
  const mouseRef = useRef({ targetX: 0, targetY: 0, currentX: 0, currentY: 0 });
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 2;
      const y = (e.clientY / innerHeight - 0.5) * 2;
      mouseRef.current.targetX = x;
      mouseRef.current.targetY = y;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    let animationFrameId: number;
    const updateParallax = () => {
      const m = mouseRef.current;
      m.currentX += (m.targetX - m.currentX) * 0.08;
      m.currentY += (m.targetY - m.currentY) * 0.08;

      if (bgRef.current) {
        bgRef.current.style.transform = `translate3d(${m.currentX * -12}px, ${m.currentY * -12}px, 0) scale(1.05)`;
      }

      animationFrameId = requestAnimationFrame(updateParallax);
    };

    animationFrameId = requestAnimationFrame(updateParallax);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <main className="relative w-full h-screen bg-[#020712] overflow-hidden">
      {/* REALISTIC 3D SPACECRAFT CURSOR WITH THRUST ANIMATION */}
      <SpacecraftCursor />

      {/* COSMIC CURSOR ECHO INTERACTION */}
      <CosmicCursorEcho />

      {/* FIXED BACKGROUND LAYER */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* 1. Deep Space Background */}
        <div
          ref={bgRef}
          className="absolute -inset-8 will-change-transform"
          style={{
            transform: `translate3d(0px, 0px, 0) scale(1.05)`,
          }}
        >
          <Image
            src="/back2.png"
            alt="Deep Cosmic Space Background"
            fill
            priority
            className="object-cover object-center opacity-95"
          />
        </div>

        {/* 2. Simple Soft Pink Ambient Lighting with Fade */}
        <SimplePinkLighting />

        {/* 3. Interactive Constellation Network */}
        <AboutConstellations />

        {/* 4. Cinematic Intermittent Comet / Meteor Flyby System */}
        <CosmicCometSystem />
      </div>

      {/* 3D REALISTIC FLOATING ASTRONAUTS ON BOTH SIDES */}
      <FloatingAstronauts />

      {/* MAIN CONTENT LAYER */}
      <div className="relative z-40 w-full flex flex-col items-center justify-center h-screen">
        <PlanetaryWaypoints />
      </div>
    </main>
  );
}

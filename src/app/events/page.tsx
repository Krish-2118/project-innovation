"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import EventCarousel from "@/components/events/EventCarousel";

// Dynamically import the heavy canvas component to avoid blocking initial load
const StarConstellationCanvas = dynamic(
  () => import("@/components/events/StarConstellationCanvas"),
  { ssr: false }
);

export default function EventsPage() {
  const mouseRef = useRef({ targetX: 0, targetY: 0, currentX: 0, currentY: 0 });
  const bgRef = useRef<HTMLDivElement>(null);
  const starsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      if (innerWidth < 768) return; // Disable mouse tracking on mobile
      const x = (e.clientX / innerWidth - 0.5) * 2;
      const y = (e.clientY / innerHeight - 0.5) * 2;
      mouseRef.current.targetX = x;
      mouseRef.current.targetY = y;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    let animationFrameId: number;
    const updateParallax = () => {
      if (window.innerWidth >= 768) {
        const m = mouseRef.current;
        m.currentX += (m.targetX - m.currentX) * 0.08;
        m.currentY += (m.targetY - m.currentY) * 0.08;

        // Apply transforms directly to the DOM to avoid React re-renders
        if (bgRef.current) {
          bgRef.current.style.transform = `translate3d(${m.currentX * -12}px, ${m.currentY * -12}px, 0) scale(1.08)`;
        }
        if (starsRef.current) {
          starsRef.current.style.transform = `translate3d(${m.currentX * 6}px, ${m.currentY * 6}px, 0)`;
        }
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
    <main className="hero-bg relative w-full h-screen overflow-hidden bg-[#020712] text-white">
      {/* 1. Deep Space Background - Subtle smooth reverse parallax */}
      <div
        ref={bgRef}
        className="absolute -inset-12 select-none pointer-events-none"
        style={{ transform: "translate3d(0px, 0px, 0) scale(1.08)" }}
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

      {/* 2. Interactive Prominent Stars & User Cursor Constellation Drawer */}
      <div ref={starsRef} className="absolute inset-0 pointer-events-none">
        <StarConstellationCanvas />
      </div>

      {/* 3. Event Carousel and Interactive Content */}
      <div className="relative z-10 w-full h-full">
        <EventCarousel />
      </div>
    </main>
  );
}

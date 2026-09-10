"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import EventCarousel from "@/components/events/EventCarousel";
import StarConstellationCanvas from "@/components/events/StarConstellationCanvas";

export default function EventsPage() {
  const mouseRef = useRef({ targetX: 0, targetY: 0, currentX: 0, currentY: 0 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });

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
      if (window.innerWidth < 768) {
        setOffset({ x: 0, y: 0 });
        animationFrameId = requestAnimationFrame(updateParallax);
        return;
      }

      const m = mouseRef.current;
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
    <main className="hero-bg relative w-full h-screen overflow-hidden bg-[#020712] text-white">
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

      {/* 2. Interactive Prominent Stars & User Cursor Constellation Drawer */}
      <StarConstellationCanvas offsetX={offset.x} offsetY={offset.y} />

      {/* 3. Event Carousel and Interactive Content */}
      <div className="relative z-10 w-full h-full">
        <EventCarousel />
      </div>
    </main>
  );
}


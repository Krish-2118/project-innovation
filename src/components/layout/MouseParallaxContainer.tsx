"use client";

import { useEffect, useRef, ReactNode } from "react";

interface MouseParallaxContainerProps {
  children: ReactNode;
  className?: string;
}

const MIN_WIDTH = 768;
const EASE = 0.08;
// Stop the loop once the eased position is within this distance of the target.
const SETTLE_EPSILON = 0.0005;

export default function MouseParallaxContainer({ children, className = "" }: MouseParallaxContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ targetX: 0, targetY: 0, currentX: 0, currentY: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let elements: { el: HTMLElement; multiplier: number; scale: string | null }[] = [];
    let animationFrameId = 0;
    let running = false;

    const collect = () => {
      elements = Array.from(container.querySelectorAll<HTMLElement>("[data-parallax]")).map((el) => ({
        el,
        multiplier: parseFloat(el.getAttribute("data-parallax") || "0"),
        scale: el.getAttribute("data-parallax-scale"),
      }));
    };

    const isEnabled = () => window.innerWidth >= MIN_WIDTH && !reducedMotion.matches;

    const resetTransforms = () => {
      for (const { el, scale } of elements) {
        el.style.transform = scale ? `scale(${scale})` : "none";
      }
    };

    const updateParallax = () => {
      const m = mouseRef.current;
      m.currentX += (m.targetX - m.currentX) * EASE;
      m.currentY += (m.targetY - m.currentY) * EASE;

      for (const { el, multiplier, scale } of elements) {
        let transform = `translate3d(${m.currentX * multiplier}px, ${m.currentY * multiplier}px, 0)`;
        if (scale) transform += ` scale(${scale})`;
        el.style.transform = transform;
      }

      const settled =
        Math.abs(m.targetX - m.currentX) < SETTLE_EPSILON && Math.abs(m.targetY - m.currentY) < SETTLE_EPSILON;
      if (settled) {
        running = false;
        return;
      }
      animationFrameId = requestAnimationFrame(updateParallax);
    };

    const start = () => {
      if (running || !isEnabled()) return;
      running = true;
      animationFrameId = requestAnimationFrame(updateParallax);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isEnabled()) return;
      const { innerWidth, innerHeight } = window;
      mouseRef.current.targetX = (e.clientX / innerWidth - 0.5) * 2;
      mouseRef.current.targetY = (e.clientY / innerHeight - 0.5) * 2;
      start();
    };

    const handleResize = () => {
      if (!isEnabled()) {
        cancelAnimationFrame(animationFrameId);
        running = false;
        mouseRef.current = { targetX: 0, targetY: 0, currentX: 0, currentY: 0 };
        resetTransforms();
      }
    };

    collect();
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("resize", handleResize);
    reducedMotion.addEventListener("change", handleResize);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      reducedMotion.removeEventListener("change", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
}

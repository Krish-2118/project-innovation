"use client";

import { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  size: number;
  alpha: number;
  pulseSpeed: number;
  pulseOffset: number;
  hue: string;
}

interface StarConstellationCanvasProps {
  offsetX?: number;
  offsetY?: number;
}

export default function StarConstellationCanvas({
  offsetX = 0,
  offsetY = 0,
}: StarConstellationCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const userSegmentsRef = useRef<{ p1: { x: number; y: number }; p2: { x: number; y: number }; time: number }[]>([]);
  const activeStarRef = useRef<Star | null>(null);
  const mousePosRef = useRef<{ x: number; y: number; active: boolean }>({ x: 0, y: 0, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initStars();
    };

    const isBlankSpace = (x: number, y: number) => {
      // 1. Top Navbar buffer
      if (y < 80) return false;

      // 2. Text bounding box:
      // The text container has max-w-3xl (approx 768px wide), centered horizontally.
      // Top starts around 8vh, subtitle, title, teal line, description, and button end around 44vh.
      const centerX = width * 0.5;
      const textHalfWidth = Math.min(width * 0.44, 400); // 800px max width
      const textTop = height * 0.07;
      const textBottom = height * 0.46;

      if (
        x > centerX - textHalfWidth &&
        x < centerX + textHalfWidth &&
        y > textTop &&
        y < textBottom
      ) {
        return false;
      }

      // 3. Main bottom center planet
      const planetCenterX = width * 0.5;
      const planetCenterY = height * 0.88;
      const planetRadius = Math.min(width * 0.36, 300);
      if (Math.hypot(x - planetCenterX, y - planetCenterY) < planetRadius) {
        return false;
      }

      // 4. Bottom arrow navigation
      if (Math.abs(x - width * 0.5) < 70 && y > height - 70) {
        return false;
      }

      return true;
    };

    const initStars = () => {
      const stars: Star[] = [];
      const hues = ["#ffffff", "#fef08a", "#bae6fd", "#fde68a", "#e2e8f0"];

      // Grid-jittered sampling for balanced, uniform distribution across the whole screen
      // Divide screen into cells so every region gets its fair share of stars without bunching
      const cellSize = Math.max(75, Math.min(110, Math.sqrt((width * height) / 45)));
      const cols = Math.ceil(width / cellSize);
      const rows = Math.ceil(height / cellSize);

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          // Jitter position within cell
          const cellLeft = c * cellSize;
          const cellTop = r * cellSize;
          const x = cellLeft + Math.random() * (cellSize * 0.85) + cellSize * 0.075;
          const y = cellTop + Math.random() * (cellSize * 0.85) + cellSize * 0.075;

          if (x > 15 && x < width - 15 && y > 15 && y < height - 15) {
            if (isBlankSpace(x, y)) {
              // Ensure minimum distance from any existing star for clean, uniform spacing
              const tooClose = stars.some((s) => Math.hypot(s.x - x, s.y - y) < cellSize * 0.65);
              if (!tooClose) {
                stars.push({
                  x,
                  y,
                  // Prominent visible stars (1.6px - 2.8px)
                  size: Math.random() * 1.2 + 1.6,
                  alpha: Math.random() * 0.35 + 0.65,
                  pulseSpeed: Math.random() * 0.025 + 0.015,
                  pulseOffset: Math.random() * Math.PI * 2,
                  hue: hues[Math.floor(Math.random() * hues.length)],
                });
              }
            }
          }
        }
      }
      starsRef.current = stars;
    };

    initStars();
    window.addEventListener("resize", handleResize);

    const onPointerMove = (e: MouseEvent) => {
      mousePosRef.current = { x: e.clientX, y: e.clientY, active: true };

      const stars = starsRef.current;
      const mx = e.clientX;
      const my = e.clientY;
      const snapRadius = 48;

      let nearestStar: Star | null = null;
      let minDist = snapRadius;

      for (const s of stars) {
        const d = Math.hypot(s.x - mx, s.y - my);
        if (d < minDist) {
          minDist = d;
          nearestStar = s;
        }
      }

      if (nearestStar) {
        if (activeStarRef.current && activeStarRef.current !== nearestStar) {
          // Connect previously active star to this star
          const newSeg = {
            p1: { x: activeStarRef.current.x, y: activeStarRef.current.y },
            p2: { x: nearestStar.x, y: nearestStar.y },
            time: Date.now(),
          };

          // If adding this segment completes a constellation of 4-5 stars (4 segments)
          // or user already has a completed constellation, start fade/reset cycle
          if (userSegmentsRef.current.length >= 4) {
            // Once 4-5 stars are joined (4 segments), expire the oldest group or reset
            userSegmentsRef.current.shift();
          }

          userSegmentsRef.current.push(newSeg);
        }
        activeStarRef.current = nearestStar;
      }
    };

    const onPointerLeave = () => {
      mousePosRef.current.active = false;
      activeStarRef.current = null;
    };

    window.addEventListener("mousemove", onPointerMove);
    window.addEventListener("mouseleave", onPointerLeave);

    let frame = 0;
    const render = () => {
      frame++;
      ctx.clearRect(0, 0, width, height);

      const now = Date.now();
      const stars = starsRef.current;
      const mouse = mousePosRef.current;

      // 1. Draw user connected constellation lines (stays visible to form 4-5 stars, then erases in 2.2s)
      const FADE_DURATION = 2200;
      userSegmentsRef.current = userSegmentsRef.current.filter((seg) => now - seg.time < FADE_DURATION);

      for (const seg of userSegmentsRef.current) {
        const age = (now - seg.time) / FADE_DURATION;
        const opacity = Math.max(0, (1 - age));

        // Outer vibrant cosmic golden/cyan aura
        ctx.beginPath();
        ctx.moveTo(seg.p1.x, seg.p1.y);
        ctx.lineTo(seg.p2.x, seg.p2.y);
        ctx.strokeStyle = `rgba(251, 191, 36, ${opacity * 0.7})`;
        ctx.lineWidth = 4;
        ctx.stroke();

        // Inner glowing core line (bright celestial white-gold)
        ctx.beginPath();
        ctx.moveTo(seg.p1.x, seg.p1.y);
        ctx.lineTo(seg.p2.x, seg.p2.y);
        ctx.strokeStyle = `rgba(254, 240, 138, ${opacity * 0.95})`;
        ctx.lineWidth = 2.2;
        ctx.stroke();

        // High intensity center filament
        ctx.beginPath();
        ctx.moveTo(seg.p1.x, seg.p1.y);
        ctx.lineTo(seg.p2.x, seg.p2.y);
        ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }

      // 2. Bright active guide line stretching from anchored star to user cursor
      if (activeStarRef.current && mouse.active) {
        const d = Math.hypot(activeStarRef.current.x - mouse.x, activeStarRef.current.y - mouse.y);
        if (d < 220) {
          const stretchAlpha = (1 - d / 220);

          // Glow behind guide line
          ctx.beginPath();
          ctx.moveTo(activeStarRef.current.x, activeStarRef.current.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(251, 191, 36, ${stretchAlpha * 0.5})`;
          ctx.lineWidth = 3;
          ctx.stroke();

          // Bright dashed cursor trace
          ctx.beginPath();
          ctx.moveTo(activeStarRef.current.x, activeStarRef.current.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(255, 255, 255, ${stretchAlpha * 0.9})`;
          ctx.lineWidth = 1.5;
          ctx.setLineDash([5, 4]);
          ctx.stroke();
          ctx.setLineDash([]);
        } else {
          activeStarRef.current = null;
        }
      }

      // 3. Render Stars (prominent, clear luminous points)
      for (const s of stars) {
        const pulse = Math.sin(frame * s.pulseSpeed + s.pulseOffset);
        const currentAlpha = Math.min(1, Math.max(0.4, s.alpha + pulse * 0.25));
        const isHovered = mouse.active && Math.hypot(s.x - mouse.x, s.y - mouse.y) < 48;
        const isCurrentActive = activeStarRef.current === s;

        const effectiveSize = isHovered || isCurrentActive ? s.size * 1.6 : s.size;
        const effectiveAlpha = isHovered || isCurrentActive ? 1.0 : currentAlpha;

        // Glowing celestial halo
        const glowRadius = effectiveSize * (isHovered || isCurrentActive ? 4.2 : 2.8);
        const grad = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, glowRadius);
        const glowColor = isHovered || isCurrentActive ? "251, 191, 36" : "219, 234, 254";
        grad.addColorStop(0, `rgba(${glowColor}, ${effectiveAlpha * 0.85})`);
        grad.addColorStop(0.5, `rgba(${glowColor}, ${effectiveAlpha * 0.3})`);
        grad.addColorStop(1, `rgba(${glowColor}, 0)`);

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(s.x, s.y, glowRadius, 0, Math.PI * 2);
        ctx.fill();

        // Bright star core
        ctx.fillStyle = isHovered || isCurrentActive ? "#ffffff" : s.hue;
        ctx.beginPath();
        ctx.arc(s.x, s.y, effectiveSize, 0, Math.PI * 2);
        ctx.fill();

        // 4-point micro cross glint on hover/active or slightly bigger stars
        if (isHovered || isCurrentActive || s.size > 2.3) {
          const glintLen = effectiveSize * (isHovered || isCurrentActive ? 3.0 : 2.0);
          ctx.strokeStyle = `rgba(255, 255, 255, ${effectiveAlpha * 0.85})`;
          ctx.lineWidth = 0.9;
          ctx.beginPath();
          ctx.moveTo(s.x - glintLen, s.y);
          ctx.lineTo(s.x + glintLen, s.y);
          ctx.moveTo(s.x, s.y - glintLen);
          ctx.lineTo(s.x, s.y + glintLen);
          ctx.stroke();
        }
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", onPointerMove);
      window.removeEventListener("mouseleave", onPointerLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-[15]"
      style={{
        transform: `translate3d(${offsetX * 6}px, ${offsetY * 6}px, 0)`,
      }}
    />
  );
}

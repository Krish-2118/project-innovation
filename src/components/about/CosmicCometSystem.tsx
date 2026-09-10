"use client";

import React, { useEffect, useRef } from "react";

interface DustParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  alpha: number;
  color: string;
}

interface CometInstance {
  id: number;
  isActive: boolean;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  progress: number;
  flybyDuration: number;
  startTime: number;
  tailLength: number;
  glowColor: string;
  dustParticles: DustParticle[];
  timerId: NodeJS.Timeout | null;
}

export default function CosmicCometSystem() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Check reduced motion preference
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let animFrameId: number | null = null;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    // Random Trajectory Generator FAR OFF-SCREEN (25-35% beyond viewport edges)
    const getRandomFarOffscreenPoint = (): { x: number; y: number } => {
      const edge = Math.floor(Math.random() * 4); // 0: Top, 1: Right, 2: Bottom, 3: Left
      switch (edge) {
        case 0:
          return { x: -0.25 + Math.random() * 1.5, y: -0.30 };
        case 1:
          return { x: 1.30, y: -0.25 + Math.random() * 1.5 };
        case 2:
          return { x: -0.25 + Math.random() * 1.5, y: 1.30 };
        case 3:
        default:
          return { x: -0.30, y: -0.25 + Math.random() * 1.5 };
      }
    };

    const generateRandomTrajectory = () => {
      const start = getRandomFarOffscreenPoint();
      let end = getRandomFarOffscreenPoint();

      let attempts = 0;
      while (Math.hypot(end.x - start.x, end.y - start.y) < 0.9 && attempts < 10) {
        end = getRandomFarOffscreenPoint();
        attempts++;
      }

      return { startX: start.x, startY: start.y, endX: end.x, endY: end.y };
    };

    const GLOW_HUES = [
      "rgba(56, 189, 248, 0.65)",
      "rgba(14, 165, 233, 0.65)",
      "rgba(186, 230, 253, 0.75)",
    ];

    const comets: CometInstance[] = Array.from({ length: 2 }, (_, i) => ({
      id: i,
      isActive: false,
      startX: 0,
      startY: 0,
      endX: 1,
      endY: 1,
      progress: 0,
      flybyDuration: 7000,
      startTime: 0,
      tailLength: 300,
      glowColor: GLOW_HUES[0],
      dustParticles: [],
      timerId: null,
    }));

    const spawnComet = (c: CometInstance) => {
      if (c.isActive) return;

      const traj = generateRandomTrajectory();
      c.startX = traj.startX;
      c.startY = traj.startY;
      c.endX = traj.endX;
      c.endY = traj.endY;

      c.flybyDuration = 5500 + Math.random() * 4000;
      c.tailLength = width < 768 ? 180 : 280 + Math.random() * 100;
      c.glowColor = GLOW_HUES[Math.floor(Math.random() * GLOW_HUES.length)];
      c.progress = 0;
      c.startTime = performance.now();
      c.dustParticles = [];
      c.isActive = true;

      if (!animFrameId) {
        animFrameId = requestAnimationFrame(renderLoop);
      }
    };

    const scheduleCometSpawn = (c: CometInstance, delayMs: number) => {
      c.isActive = false;
      c.timerId = setTimeout(() => spawnComet(c), delayMs);
    };

    scheduleCometSpawn(comets[0], 2000);
    scheduleCometSpawn(comets[1], 6500);

    const renderLoop = (now: number) => {
      ctx.clearRect(0, 0, width, height);

      let anyActive = false;

      comets.forEach((c) => {
        if (c.isActive) {
          anyActive = true;
          const elapsed = now - c.startTime;
          c.progress = elapsed / c.flybyDuration;

          const t = Math.min(Math.max(c.progress, 0), 1);
          const easeT = t;

          const sx = c.startX * width;
          const sy = c.startY * height;
          const ex = c.endX * width;
          const ey = c.endY * height;

          const currentX = sx + (ex - sx) * easeT;
          const currentY = sy + (ey - sy) * easeT;

          const dx = ex - sx;
          const dy = ey - sy;
          const angle = Math.atan2(dy, dx);

          let globalAlpha = 1;
          if (elapsed < 1000) {
            globalAlpha = elapsed / 1000;
          } else if (c.progress > 0.85) {
            globalAlpha = (1 - c.progress) / 0.15;
          }
          globalAlpha = Math.max(0, Math.min(1, globalAlpha));

          ctx.save();
          ctx.globalAlpha = globalAlpha;

          // 1. Tapered White / Cyan Plasma Tail
          const tailX = currentX - Math.cos(angle) * c.tailLength;
          const tailY = currentY - Math.sin(angle) * c.tailLength;

          const gradient = ctx.createLinearGradient(currentX, currentY, tailX, tailY);
          gradient.addColorStop(0, "rgba(255, 255, 255, 0.95)");
          gradient.addColorStop(0.15, c.glowColor);
          gradient.addColorStop(0.5, "rgba(56, 189, 248, 0.2)");
          gradient.addColorStop(1, "rgba(56, 189, 248, 0)");

          ctx.beginPath();
          const perpX = Math.cos(angle + Math.PI / 2);
          const perpY = Math.sin(angle + Math.PI / 2);
          const headWidth = width < 768 ? 3.5 : 5.5;

          ctx.moveTo(currentX + perpX * headWidth, currentY + perpY * headWidth);
          ctx.lineTo(currentX - perpX * headWidth, currentY - perpY * headWidth);
          ctx.lineTo(tailX, tailY);
          ctx.closePath();
          ctx.fillStyle = gradient;
          ctx.fill();

          // 2. Soft Outer Cyan Ambient Glow Halo
          const haloGrad = ctx.createRadialGradient(
            currentX,
            currentY,
            0,
            currentX,
            currentY,
            headWidth * 5.5
          );
          haloGrad.addColorStop(0, "rgba(255, 255, 255, 0.85)");
          haloGrad.addColorStop(0.35, c.glowColor);
          haloGrad.addColorStop(1, "rgba(56, 189, 248, 0)");

          ctx.beginPath();
          ctx.arc(currentX, currentY, headWidth * 5.5, 0, Math.PI * 2);
          ctx.fillStyle = haloGrad;
          ctx.fill();

          // 3. Compact Bright White Core Nucleus
          ctx.beginPath();
          ctx.arc(currentX, currentY, headWidth * 0.85, 0, Math.PI * 2);
          ctx.fillStyle = "#ffffff";
          ctx.shadowColor = "#38bdf8";
          ctx.shadowBlur = 12;
          ctx.fill();
          ctx.shadowBlur = 0;

          // 4. Shed Microscopic Stardust Particles along Tail
          const maxDustCount = width < 768 ? 1 : 2;
          for (let i = 0; i < maxDustCount; i++) {
            c.dustParticles.push({
              x: currentX - Math.cos(angle) * (Math.random() * 25),
              y: currentY - Math.sin(angle) * (Math.random() * 25),
              vx: -Math.cos(angle) * (0.3 + Math.random() * 0.6) + (Math.random() - 0.5) * 0.3,
              vy: -Math.sin(angle) * (0.3 + Math.random() * 0.6) + (Math.random() - 0.5) * 0.3,
              life: 0,
              maxLife: 25 + Math.random() * 30,
              size: 0.8 + Math.random() * 1.3,
              alpha: 0.75,
              color: Math.random() > 0.4 ? "#ffffff" : "#bae6fd",
            });
          }

          ctx.restore();

          // Render & update stardust particles for this comet
          for (let i = c.dustParticles.length - 1; i >= 0; i--) {
            const p = c.dustParticles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.life++;

            const pProgress = p.life / p.maxLife;
            p.alpha = Math.max(0, 0.75 * (1 - pProgress));

            if (p.alpha <= 0 || p.life >= p.maxLife) {
              c.dustParticles.splice(i, 1);
              continue;
            }

            ctx.save();
            ctx.globalAlpha = p.alpha * globalAlpha;
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          }

          if (c.progress >= 1.05) {
            const nextDelay = 4000 + Math.random() * 4500;
            scheduleCometSpawn(c, nextDelay);
          }
        }
      });

      if (anyActive || comets.some((c) => c.dustParticles.length > 0)) {
        animFrameId = requestAnimationFrame(renderLoop);
      } else {
        animFrameId = null;
      }
    };

    return () => {
      window.removeEventListener("resize", resize);
      comets.forEach((c) => {
        if (c.timerId) clearTimeout(c.timerId);
      });
      if (animFrameId) cancelAnimationFrame(animFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-10 w-full h-full"
    />
  );
}

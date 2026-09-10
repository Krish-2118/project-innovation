"use client";

import React, { useEffect, useRef } from "react";

export default function SpacecraftCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const posRef = useRef({ x: -100, y: -100 });
  const prevPosRef = useRef({ x: -100, y: -100 });
  const velRef = useRef({ x: 0, y: 0 });
  const prevEventPos = useRef({ x: -100, y: -100 });
  const targetPosRef = useRef({ x: -100, y: -100 });
  const renderPosRef = useRef({ x: -100, y: -100 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Hide default system cursor on document & body while this component is active
    document.documentElement.style.cursor = "none";
    document.body.style.cursor = "none";

    let width = window.innerWidth;
    let height = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener("resize", resize);

    const updatePointerPos = (e: MouseEvent | PointerEvent) => {
      if (prevEventPos.current.x !== -100) {
        const dx = e.clientX - prevEventPos.current.x;
        const dy = e.clientY - prevEventPos.current.y;
        velRef.current.x += dx * 0.45;
        velRef.current.y += dy * 0.45;
      }
      prevEventPos.current.x = e.clientX;
      prevEventPos.current.y = e.clientY;

      targetPosRef.current.x = e.clientX;
      targetPosRef.current.y = e.clientY;

      if (renderPosRef.current.x === -100) {
        renderPosRef.current.x = e.clientX;
        renderPosRef.current.y = e.clientY;
      }
    };

    window.addEventListener("mousemove", updatePointerPos, { passive: true });
    window.addEventListener("pointermove", updatePointerPos, { passive: true });
    window.addEventListener("mousedown", updatePointerPos, { passive: true });
    window.addEventListener("pointerdown", updatePointerPos, { passive: true });

    let animationFrameId: number;
    let currentAngle = -Math.PI / 4; // Top-left -45deg idle orientation
    const DEFAULT_IDLE_ANGLE = -Math.PI / 4;

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      life: number;
      maxLife: number;
      color: string;
    }> = [];

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Smooth lerp pointer position towards target
      if (targetPosRef.current.x !== -100) {
        renderPosRef.current.x += (targetPosRef.current.x - renderPosRef.current.x) * 0.4;
        renderPosRef.current.y += (targetPosRef.current.y - renderPosRef.current.y) * 0.4;
      }
      posRef.current.x = renderPosRef.current.x;
      posRef.current.y = renderPosRef.current.y;

      // Calculate velocity vector & speed
      const vx = posRef.current.x - prevPosRef.current.x;
      const vy = posRef.current.y - prevPosRef.current.y;

      velRef.current.x = velRef.current.x * 0.82 + vx * 0.18;
      velRef.current.y = velRef.current.y * 0.82 + vy * 0.18;

      prevPosRef.current.x = posRef.current.x;
      prevPosRef.current.y = posRef.current.y;

      const p = posRef.current;
      const speed = Math.hypot(velRef.current.x, velRef.current.y);

      // Rotation Damping: Orient along movement direction when active, return to -45deg when idle
      if (speed > 0.8) {
        const targetAngle = Math.atan2(velRef.current.y, velRef.current.x) + Math.PI / 2;
        let diff = targetAngle - currentAngle;

        while (diff < -Math.PI) diff += Math.PI * 2;
        while (diff > Math.PI) diff -= Math.PI * 2;

        currentAngle += diff * 0.14;
      } else {
        let diff = DEFAULT_IDLE_ANGLE - currentAngle;

        while (diff < -Math.PI) diff += Math.PI * 2;
        while (diff > Math.PI) diff -= Math.PI * 2;

        currentAngle += diff * 0.08;
      }

      // Exhaust Particle Generation (Rear of spacecraft at y = 22) - RED & AMBER FLAMES
      if (p.x > 0 && p.y > 0) {
        const rearDist = 22;
        const rearX = p.x - Math.sin(currentAngle) * rearDist;
        const rearY = p.y + Math.cos(currentAngle) * rearDist;

        const particleCount = speed > 1.2 ? 3 : 1;
        for (let i = 0; i < particleCount; i++) {
          const spread = (Math.random() - 0.5) * 0.5;
          const pSpeed = speed > 1.2 ? Math.random() * 2.2 + 1.2 : Math.random() * 0.6 + 0.3;

          particles.push({
            x: rearX + (Math.random() - 0.5) * 2,
            y: rearY + (Math.random() - 0.5) * 2,
            vx: -Math.sin(currentAngle + spread) * pSpeed + (Math.random() - 0.5) * 0.4,
            vy: Math.cos(currentAngle + spread) * pSpeed + (Math.random() - 0.5) * 0.4,
            size: Math.random() * 2.2 + 1.0,
            life: 0,
            maxLife: Math.random() * 14 + 10,
            color: Math.random() > 0.3 ? "rgba(239, 68, 68, " : "rgba(245, 158, 11, ",
          });
        }
      }

      // Render Trailing Ion Particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const pt = particles[i];
        pt.life += 1;

        if (pt.life >= pt.maxLife) {
          particles.splice(i, 1);
          continue;
        }

        pt.x += pt.vx;
        pt.y += pt.vy;

        const progress = pt.life / pt.maxLife;
        const opacity = 1 - progress;
        const radius = pt.size * (1 - progress * 0.6);

        ctx.fillStyle = `${pt.color}${opacity * 0.85})`;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, Math.max(0.2, radius), 0, Math.PI * 2);
        ctx.fill();
      }

      // Render Spacecraft Model: WHITE FUSELAGE / BODY + VIBRANT RED FINS
      if (p.x > 0 && p.y > 0) {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(currentAngle);

        // --- FIERY RED/ORANGE ENGINE PLUMES (Rear at y = 20) ---
        const thrustLength = speed > 1.2 ? Math.random() * 8 + 10 : Math.random() * 3 + 5;

        // Dual Engine Left Plume
        const plumeGrad = ctx.createLinearGradient(0, 20, 0, 20 + thrustLength);
        plumeGrad.addColorStop(0, "rgba(239, 68, 68, 0.95)");
        plumeGrad.addColorStop(0.4, "rgba(249, 115, 22, 0.85)");
        plumeGrad.addColorStop(1, "rgba(254, 240, 138, 0)");

        ctx.fillStyle = plumeGrad;
        ctx.beginPath();
        ctx.moveTo(-3, 20);
        ctx.lineTo(-2, 20 + thrustLength);
        ctx.lineTo(-1, 20);
        ctx.fill();

        // Dual Engine Right Plume
        ctx.beginPath();
        ctx.moveTo(1, 20);
        ctx.lineTo(2, 20 + thrustLength);
        ctx.lineTo(3, 20);
        ctx.fill();

        // --- VIBRANT RED STABILIZER WINGS / FINS ---
        const leftWingGrad = ctx.createLinearGradient(-13, 0, -3, 0);
        leftWingGrad.addColorStop(0, "#ef4444");
        leftWingGrad.addColorStop(0.5, "#dc2626");
        leftWingGrad.addColorStop(1, "#991b1b");

        ctx.fillStyle = leftWingGrad;
        ctx.beginPath();
        ctx.moveTo(-3, 11);
        ctx.lineTo(-13, 17);
        ctx.lineTo(-11, 20);
        ctx.lineTo(-3, 16);
        ctx.closePath();
        ctx.fill();

        const rightWingGrad = ctx.createLinearGradient(3, 0, 13, 0);
        rightWingGrad.addColorStop(0, "#991b1b");
        rightWingGrad.addColorStop(0.5, "#dc2626");
        rightWingGrad.addColorStop(1, "#ef4444");

        ctx.fillStyle = rightWingGrad;
        ctx.beginPath();
        ctx.moveTo(3, 11);
        ctx.lineTo(13, 17);
        ctx.lineTo(11, 20);
        ctx.lineTo(3, 16);
        ctx.closePath();
        ctx.fill();

        // Fin Tip Red Laser Energy Accents
        ctx.fillStyle = "#ff2a2a";
        ctx.fillRect(-13, 16.5, 2, 2.5);
        ctx.fillRect(11, 16.5, 2, 2.5);

        // --- PURE METALLIC WHITE FUSELAGE / BODY ---
        const bodyGrad = ctx.createLinearGradient(-5, 0, 5, 0);
        bodyGrad.addColorStop(0, "#cbd5e1");
        bodyGrad.addColorStop(0.2, "#f1f5f9");
        bodyGrad.addColorStop(0.5, "#ffffff");
        bodyGrad.addColorStop(0.8, "#f1f5f9");
        bodyGrad.addColorStop(1, "#94a3b8");

        ctx.fillStyle = bodyGrad;
        ctx.beginPath();
        ctx.moveTo(0, 0);         // Sharp Nose Tip (Exact Mouse Hotspot)
        ctx.lineTo(5.5, 11);      // Mid Right Hull
        ctx.lineTo(4, 20);        // Rear Right Nozzle
        ctx.lineTo(-4, 20);       // Rear Left Nozzle
        ctx.lineTo(-5.5, 11);     // Mid Left Hull
        ctx.closePath();
        ctx.fill();

        // Dark Chrome Structural Outline & Bevel Lines
        ctx.strokeStyle = "#475569";
        ctx.lineWidth = 0.8;
        ctx.stroke();

        // Spine Center Bevel Line
        ctx.strokeStyle = "rgba(100, 116, 139, 0.6)";
        ctx.lineWidth = 0.6;
        ctx.beginPath();
        ctx.moveTo(0, 1);
        ctx.lineTo(0, 18);
        ctx.stroke();

        // Red Racing Stripes on Rear White Fuselage
        ctx.fillStyle = "#dc2626";
        ctx.beginPath();
        ctx.moveTo(-2.2, 13);
        ctx.lineTo(-4.2, 17.5);
        ctx.lineTo(-3.2, 18);
        ctx.lineTo(-1.5, 13.5);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(2.2, 13);
        ctx.lineTo(4.2, 17.5);
        ctx.lineTo(3.2, 18);
        ctx.lineTo(1.5, 13.5);
        ctx.closePath();
        ctx.fill();

        // --- RUBY CRYSTAL COCKPIT CANOPY ---
        const canopyGrad = ctx.createLinearGradient(0, 3, 0, 11);
        canopyGrad.addColorStop(0, "#991b1b");
        canopyGrad.addColorStop(0.4, "#ef4444");
        canopyGrad.addColorStop(0.8, "#fca5a5");
        canopyGrad.addColorStop(1, "#ffffff");

        ctx.fillStyle = canopyGrad;
        ctx.beginPath();
        ctx.moveTo(0, 3);
        ctx.lineTo(2.8, 10);
        ctx.lineTo(0, 11.5);
        ctx.lineTo(-2.8, 10);
        ctx.closePath();
        ctx.fill();

        // Canopy White Glint Highlight Line
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(-1.2, 5.5);
        ctx.lineTo(1.2, 8.5);
        ctx.stroke();

        // --- DUAL REAR THRUSTER HOUSINGS ---
        ctx.fillStyle = "#1e293b";
        ctx.fillRect(-3.5, 19, 2.5, 2);
        ctx.fillRect(1, 19, 2.5, 2);

        // --- PRECISION RED PHOTON HOTSPOT DOT AT (0,0) ---
        const tipGlow = ctx.createRadialGradient(0, 0, 0, 0, 0, 4.5);
        tipGlow.addColorStop(0, "rgba(255, 255, 255, 1)");
        tipGlow.addColorStop(0.4, "rgba(239, 68, 68, 0.9)");
        tipGlow.addColorStop(1, "rgba(239, 68, 68, 0)");

        ctx.fillStyle = tipGlow;
        ctx.beginPath();
        ctx.arc(0, 0, 4.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(0, 0, 1.2, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      // Clean up cursor suppression so navigating away restores default cursor on other pages!
      document.documentElement.style.cursor = "";
      document.body.style.cursor = "";
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", updatePointerPos);
      window.removeEventListener("pointermove", updatePointerPos);
      window.removeEventListener("mousedown", updatePointerPos);
      window.removeEventListener("pointerdown", updatePointerPos);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none select-none z-50 overflow-hidden"
    />
  );
}

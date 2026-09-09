"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, ShieldCheck, Lock, X, Heart, Sparkles } from "lucide-react";

type ModalType = "terms" | "conduct" | "privacy" | null;

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  baseSize: number;
  alpha: number;
  baseAlpha: number;
  color: string;
  seed: number;
}

interface BurstParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  color: string;
  life: number;
  maxLife: number;
}

/**
 * Interactive Cosmic Particle Canvas specifically integrated with INNOVISION branding.
 * Features ambient constellation stardust, mouse gravity / web connections,
 * and supernova click sparks.
 */
function InnovisionParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mouseRef = useRef<{ x: number; y: number; active: boolean }>({
    x: -9999,
    y: -9999,
    active: false,
  });
  const burstParticlesRef = useRef<BurstParticle[]>([]);

  const createSupernova = useCallback((clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    const colors = [
      "#FBBF24", // gold
      "#2DD4BF", // teal
      "#38BDF8", // sky
      "#F43F5E", // rose
      "#FFFFFF", // starlight
    ];

    const count = 36;
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.4;
      const speed = 1.5 + Math.random() * 5.5;
      burstParticlesRef.current.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 1.5 + Math.random() * 2.8,
        alpha: 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 0,
        maxLife: 35 + Math.random() * 25,
      });
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animId: number;
    let width = 0;
    let height = 0;

    const colors = [
      { r: 251, g: 191, b: 36 }, // amber gold
      { r: 45, g: 212, b: 191 }, // teal cyan
      { r: 56, g: 189, b: 248 }, // sky blue
      { r: 192, g: 132, b: 252 }, // electric violet
      { r: 255, g: 255, b: 255 }, // pure star
    ];

    let particles: Particle[] = [];

    const initParticles = (w: number, h: number) => {
      // Density-based count
      const count = Math.min(Math.floor((w * h) / 3800), 130);
      particles = [];

      for (let i = 0; i < count; i++) {
        const c = colors[Math.floor(Math.random() * colors.length)];
        const baseAlpha = 0.35 + Math.random() * 0.55;
        const baseSize = 1.2 + Math.random() * 2.4;

        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.6,
          vy: (Math.random() - 0.5) * 0.6,
          size: baseSize,
          baseSize,
          alpha: baseAlpha,
          baseAlpha,
          color: `${c.r}, ${c.g}, ${c.b}`,
          seed: Math.random() * 100,
        });
      }
    };

    const handleResize = () => {
      const rect = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      initParticles(width, height);
    };

    handleResize();

    const ro = new ResizeObserver(() => handleResize());
    ro.observe(container);

    let frame = 0;

    const render = () => {
      frame++;
      ctx.clearRect(0, 0, width, height);

      const mouse = mouseRef.current;
      const connectionDist = Math.min(width * 0.12, 85);
      const mouseInfluenceDist = 120;

      // 1. Draw subtle interactive mouse aura glow
      if (mouse.active) {
        const radialGlow = ctx.createRadialGradient(
          mouse.x,
          mouse.y,
          0,
          mouse.x,
          mouse.y,
          mouseInfluenceDist
        );
        radialGlow.addColorStop(0, "rgba(251, 191, 36, 0.12)");
        radialGlow.addColorStop(0.5, "rgba(45, 212, 191, 0.05)");
        radialGlow.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = radialGlow;
        ctx.fillRect(
          mouse.x - mouseInfluenceDist,
          mouse.y - mouseInfluenceDist,
          mouseInfluenceDist * 2,
          mouseInfluenceDist * 2
        );
      }

      // 2. Update & Draw Ambient Constellation Particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Cosmic wave oscillation
        p.x += p.vx + Math.sin(frame * 0.015 + p.seed) * 0.25;
        p.y += p.vy + Math.cos(frame * 0.018 + p.seed) * 0.25;

        // Wrap around boundaries
        if (p.x < -10) p.x = width + 10;
        else if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10;
        else if (p.y > height + 10) p.y = -10;

        // Mouse reaction (gravitational repulsion & connection)
        if (mouse.active) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < mouseInfluenceDist && dist > 1) {
            const force = (1 - dist / mouseInfluenceDist) * 1.5;
            p.x += (dx / dist) * force;
            p.y += (dy / dist) * force;
            p.alpha = Math.min(1, p.baseAlpha + (1 - dist / mouseInfluenceDist) * 0.5);
            p.size = p.baseSize * (1 + (1 - dist / mouseInfluenceDist) * 0.6);

            // Draw connection thread to cursor
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = `rgba(${p.color}, ${(1 - dist / mouseInfluenceDist) * 0.35})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          } else {
            p.alpha += (p.baseAlpha - p.alpha) * 0.05;
            p.size += (p.baseSize - p.size) * 0.05;
          }
        }

        // Draw connections between neighboring particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionDist) {
            const lineAlpha = (1 - dist / connectionDist) * 0.22 * Math.min(p.alpha, p2.alpha);
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(${p.color}, ${lineAlpha})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }

        // Draw particle with gentle glow
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(0.5, p.size), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color}, ${p.alpha})`;
        ctx.shadowColor = `rgba(${p.color}, 0.8)`;
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.shadowBlur = 0; // reset for performance
      }

      // 3. Update & Draw Click Supernova Particles
      const bursts = burstParticlesRef.current;
      for (let i = bursts.length - 1; i >= 0; i--) {
        const bp = bursts[i];
        bp.life++;
        bp.x += bp.vx;
        bp.y += bp.vy;
        bp.vx *= 0.94; // friction
        bp.vy *= 0.94;
        bp.alpha = 1 - bp.life / bp.maxLife;

        if (bp.life >= bp.maxLife) {
          bursts.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(bp.x, bp.y, Math.max(0.4, bp.size * (1 - bp.life / bp.maxLife)), 0, Math.PI * 2);
        ctx.fillStyle = bp.color;
        ctx.globalAlpha = bp.alpha;
        ctx.shadowColor = bp.color;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        mouseRef.current = {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
          active: true,
        };
      }}
      onMouseLeave={() => {
        mouseRef.current.active = false;
      }}
      onClick={(e) => {
        createSupernova(e.clientX, e.clientY);
      }}
      className="absolute -inset-4 sm:-inset-8 pointer-events-auto z-10 cursor-crosshair"
      title="Click or move cursor across INNOVISION for cosmic supernova stardust!"
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
}

export default function FooterWithParticles() {
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [burstCount, setBurstCount] = useState(0);

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveModal(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <motion.footer
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full bg-transparent pt-6 sm:pt-8 pb-4 sm:pb-5 overflow-hidden select-none"
      >
        {/* 1. Transparent Ambient Nebula Accents */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-950/10 to-transparent pointer-events-none" />
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[600px] h-[350px] bg-teal-500/[0.04] rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 w-[500px] h-[300px] bg-cyan-600/[0.04] rounded-full blur-[130px] pointer-events-none" />

        {/* 2. Floating Deep Space Satellites */}
        <div className="absolute top-2 sm:top-6 left-[4%] sm:left-[6%] w-12 sm:w-16 h-12 sm:h-16 pointer-events-none z-0 opacity-80 transform -rotate-12 animate-astro-float">
          <div className="relative w-full h-full">
            <div className="absolute inset-0 bg-cyan-400/20 blur-md rounded-full" />
            <Image
              src="/satellite.png"
              alt="Floating Satellite"
              fill
              className="object-contain filter drop-shadow-[0_0_12px_rgba(56,189,248,0.4)]"
            />
          </div>
        </div>

        <div className="absolute bottom-4 sm:bottom-8 right-[3%] sm:right-[5%] w-11 sm:w-14 h-11 sm:h-14 pointer-events-none z-0 opacity-75 transform rotate-25 animate-astro-float-reverse">
          <div className="relative w-full h-full">
            <div className="absolute inset-0 bg-teal-400/20 blur-md rounded-full" />
            <Image
              src="/satellite.png"
              alt="Deep Space Satellite"
              fill
              className="object-contain filter drop-shadow-[0_0_12px_rgba(45,212,191,0.35)]"
            />
          </div>
        </div>

        {/* 3. Entire-Width Glassmorphism Container */}
        <div className="relative z-10 w-full px-2 sm:px-4 md:px-6 lg:px-8">
          <div className="glass-footer-card w-full rounded-2xl sm:rounded-3xl px-4 sm:px-8 md:px-12 py-5 sm:py-6 relative overflow-hidden">

            {/* Subtle Cyan Blueprint Tech Grid on Left Side */}
            <div
              className="absolute left-0 top-0 bottom-0 w-1/2 pointer-events-none opacity-20"
              style={{
                backgroundImage: `
                  linear-gradient(to right, rgba(56, 189, 248, 0.18) 1px, transparent 1px),
                  linear-gradient(to bottom, rgba(56, 189, 248, 0.18) 1px, transparent 1px)
                `,
                backgroundSize: "22px 22px",
                maskImage: "linear-gradient(to right, black 30%, transparent 100%)",
                WebkitMaskImage: "linear-gradient(to right, black 30%, transparent 100%)",
              }}
            />

            {/* Subtle Circuit Traces on Left Side */}
            <div className="absolute left-6 bottom-16 pointer-events-none opacity-35 hidden md:block">
              <svg width="220" height="60" viewBox="0 0 220 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 40H60L80 15H160L175 30H220" stroke="#F59E0B" strokeWidth="1" strokeOpacity="0.7" />
                <circle cx="60" cy="40" r="2.5" fill="#FBBF24" />
                <circle cx="80" cy="15" r="2" fill="#FBBF24" />
                <circle cx="160" cy="15" r="2" fill="#FBBF24" />
                <circle cx="220" cy="30" r="2.5" fill="#FBBF24" />
              </svg>
            </div>

            {/* 1. TOP ROW: Centered Instagram & WhatsApp with NO background - Generous vertical separation */}
            <div className="relative z-10 w-full flex items-center justify-center gap-8 sm:gap-12 mb-6 sm:mb-8 md:mb-9">
              {/* Instagram Button (No background) */}
              <a
                href="https://www.instagram.com/innovision.nitr"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2.5 text-slate-200 hover:text-pink-300 transition-all duration-300 cursor-pointer hover:scale-105"
                aria-label="Instagram"
              >
                <div className="p-1.5 rounded-lg bg-gradient-to-tr from-amber-500 via-pink-500 to-purple-600 text-white shadow-md group-hover:scale-110 group-hover:shadow-[0_0_18px_rgba(236,72,153,0.5)] transition-all">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </div>
                <span className="text-sm sm:text-base font-semibold tracking-wider text-slate-100 group-hover:text-pink-300 transition-colors">
                  Instagram
                </span>
              </a>

              {/* WhatsApp Button (No background) */}
              <a
                href="https://chat.whatsapp.com/innovision2026"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2.5 text-slate-200 hover:text-emerald-300 transition-all duration-300 cursor-pointer hover:scale-105"
                aria-label="WhatsApp"
              >
                <div className="p-1.5 rounded-lg bg-emerald-500 text-white shadow-md group-hover:scale-110 group-hover:shadow-[0_0_18px_rgba(16,185,129,0.5)] transition-all">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                  </svg>
                </div>
                <span className="text-sm sm:text-base font-semibold tracking-wider text-slate-100 group-hover:text-emerald-300 transition-colors">
                  WhatsApp
                </span>
              </a>
            </div>

            {/* 2. MAIN BRANDING: Integrated with Interactive Cosmic Particles */}
            <div className="relative z-10 w-full flex flex-col items-center justify-center text-center">
              {/* NIT ROURKELA'S Header */}
              <div className="flex items-center justify-center gap-2.5 sm:gap-3 mb-0.5 sm:mb-1">
                <span className="text-amber-300/80 text-xs sm:text-base md:text-xl font-serif drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]">✦</span>
                <h2 className="text-xs sm:text-base md:text-xl lg:text-2xl font-bold tracking-[0.4em] sm:tracking-[0.5em] uppercase font-[family-name:var(--font-cinzel)] text-amber-200 bg-[url('/celestial-text-bg-inverted.png')] bg-cover bg-center bg-clip-text text-transparent filter drop-shadow-[0_0_18px_rgba(251,191,36,0.75)] drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
                  NIT ROURKELA&apos;S
                </h2>
                <span className="text-amber-300/80 text-xs sm:text-sm md:text-base font-serif drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]">✦</span>
              </div>

              {/* INNOVISION Logo with Dynamic Particle Layer - Wider, reduced height, zero vertical gap */}
              <div className="relative w-full max-w-[1240px] mx-auto my-0 px-1 sm:px-3 group flex items-center justify-center">
                {/* Embedded Interactive Particle Canvas */}
                <InnovisionParticleCanvas />

                {/* Subtle Interactive Particle Cue / Badge on Hover */}
                <div className="absolute top-0 right-4 pointer-events-none opacity-0 group-hover:opacity-80 transition-opacity duration-300 hidden sm:flex items-center gap-1.5 text-[11px] font-mono text-amber-300/90 bg-slate-950/60 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-amber-400/20 z-20">
                  <Sparkles className="w-3 h-3 text-amber-400 animate-spin" />
                  <span>Interactive Stardust</span>
                </div>

                {/* INNOVISION Particles Bright Title Asset */}
                <div className="relative z-10 pointer-events-none w-full flex items-center justify-center">
                  <Image
                    src="/innovision_particles_bright.png"
                    alt="INNOVISION 2026 Particle Constellation"
                    width={1613}
                    height={229}
                    priority
                    unoptimized
                    className="w-full max-h-[110px] sm:max-h-[140px] md:max-h-[165px] lg:max-h-[180px] object-contain filter brightness-125 contrast-110 drop-shadow-[0_8px_30px_rgba(0,0,0,0.95)] drop-shadow-[0_0_24px_rgba(45,212,191,0.6)] drop-shadow-[0_0_15px_rgba(251,191,36,0.5)] group-hover:drop-shadow-[0_0_35px_rgba(56,189,248,0.8)] transition-all duration-500"
                  />
                </div>
              </div>

              {/* Subtitle: Eastern India's Largest Tech Fest */}
              <p className="text-xs sm:text-sm md:text-base lg:text-lg font-semibold tracking-[0.3em] uppercase text-[#2dd4bf] font-mono drop-shadow-[0_0_12px_rgba(45,212,191,0.4)] mt-0.5 sm:mt-1">
                Eastern India&apos;s Largest Tech Fest
              </p>
            </div>

            {/* 3. BOTTOM ROW: High-contrast, larger font size, crisp and clear text */}
            <div className="mt-5 sm:mt-6 pt-4 sm:pt-5 border-t border-white/15 flex flex-col md:flex-row items-center justify-between gap-4 text-sm sm:text-base md:text-[17px] text-slate-100 w-full">
              {/* Left Horizontally: Terms, Conduct, Privacy, Copyright */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-5 sm:gap-x-7 gap-y-3 font-medium">
                <button
                  onClick={() => setActiveModal("terms")}
                  className="text-slate-100 hover:text-amber-300 transition-colors duration-200 cursor-pointer font-medium tracking-wide hover:underline"
                >
                  Terms and Conditions
                </button>
                <span className="text-amber-400/40 hidden sm:inline font-bold">·</span>
                <button
                  onClick={() => setActiveModal("conduct")}
                  className="text-slate-100 hover:text-teal-300 transition-colors duration-200 cursor-pointer font-medium tracking-wide hover:underline"
                >
                  Code of Conduct
                </button>
                <span className="text-amber-400/40 hidden sm:inline font-bold">·</span>
                <button
                  onClick={() => setActiveModal("privacy")}
                  className="text-slate-100 hover:text-amber-300 transition-colors duration-200 cursor-pointer font-medium tracking-wide hover:underline"
                >
                  Privacy Policy
                </button>
                <span className="text-amber-400/40 hidden sm:inline font-bold">·</span>
                <span className="text-slate-300 font-normal tracking-wide">
                  Copyright &copy; {new Date().getFullYear()} INNOVISION
                </span>
              </div>

              {/* Right: Crafted with love by OpenCode NIT Rourkela */}
              <div className="flex items-center gap-2 self-center md:self-auto px-5 py-2 rounded-full border border-white/15 bg-white/[0.05] backdrop-blur-md shadow-lg text-sm sm:text-base md:text-[17px] text-white font-medium">
                <span>Crafted with</span>
                <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-rose-500 fill-rose-500 animate-pulse drop-shadow-[0_0_10px_rgba(244,63,94,0.9)] inline-block" />
                <span>by</span>
                <a
                  href="https://github.com/OpencodeNIT-R"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-300 font-semibold tracking-wide hover:text-amber-200 hover:underline transition-all duration-200 drop-shadow-[0_0_10px_rgba(251,191,36,0.4)]"
                >
                  OpenCode NIT Rourkela
                </a>
                <span className="text-cyan-300/70 text-sm ml-1">✦</span>
              </div>
            </div>

          </div>
        </div>
      </motion.footer>

      {/* 4. Interactive Glassmorphic Modals */}
      <AnimatePresence>
        {activeModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-2xl"
            onClick={() => setActiveModal(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-3xl border border-amber-400/25 bg-[#020712]/95 backdrop-blur-3xl p-6 sm:p-8 shadow-[0_25px_80px_rgba(0,0,0,0.95),0_0_35px_rgba(251,191,36,0.15)] text-slate-200"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-5">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-400/20 text-amber-400">
                    {activeModal === "terms" && <FileText className="w-5 h-5" />}
                    {activeModal === "conduct" && <ShieldCheck className="w-5 h-5" />}
                    {activeModal === "privacy" && <Lock className="w-5 h-5" />}
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold font-[family-name:var(--font-cinzel)] text-white tracking-wide">
                      {activeModal === "terms" && "Terms and Conditions"}
                      {activeModal === "conduct" && "Code of Conduct"}
                      {activeModal === "privacy" && "Privacy Policy"}
                    </h3>
                    <p className="text-xs font-mono text-amber-300/80 tracking-widest uppercase mt-0.5">
                      INNOVISION 2026 • NIT Rourkela
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setActiveModal(null)}
                  className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="space-y-4 text-sm text-slate-300 leading-relaxed font-light">
                {activeModal === "terms" && (
                  <>
                    <section>
                      <h4 className="font-semibold text-amber-300 mb-1">
                        1. Eligibility & Registration
                      </h4>
                      <p>
                        Participation in INNOVISION 2026 events, workshops, and flagship competitions
                        is open to bonafide students of recognized educational institutions. A valid
                        institutional ID is mandatory during physical verification on campus.
                      </p>
                    </section>
                    <section>
                      <h4 className="font-semibold text-amber-300 mb-1">
                        2. Event Participation & Fair Play
                      </h4>
                      <p>
                        All submissions, hackathon repositories, and project prototypes must be
                        original creations within the specified competition window. Plagiarism will
                        lead to immediate disqualification.
                      </p>
                    </section>
                    <section>
                      <h4 className="font-semibold text-amber-300 mb-1">
                        3. Campus Safety & Regulations
                      </h4>
                      <p>
                        All attendees must abide by NIT Rourkela campus guidelines and safety
                        measures. The organizing committee reserves the right to cancel registration
                        in cases of gross misconduct.
                      </p>
                    </section>
                  </>
                )}

                {activeModal === "conduct" && (
                  <>
                    <section>
                      <h4 className="font-semibold text-teal-300 mb-1">
                        1. Mutual Respect & Inclusivity
                      </h4>
                      <p>
                        Innovision NIT Rourkela provides a welcoming, safe, and enriching environment
                        for all participants, mentors, and guests regardless of background, identity,
                        or skill level.
                      </p>
                    </section>
                    <section>
                      <h4 className="font-semibold text-teal-300 mb-1">
                        2. Zero Tolerance for Harassment
                      </h4>
                      <p>
                        Any form of intimidation, derogatory remarks, or disruptive conduct across
                        physical grounds or digital channels will result in immediate ejection and
                        escalation to the respective institute.
                      </p>
                    </section>
                    <section>
                      <h4 className="font-semibold text-teal-300 mb-1">
                        3. Integrity & Scientific Curiosity
                      </h4>
                      <p>
                        Uphold academic honesty, cheer for your fellow participants, and embrace the
                        spirit of technological innovation and discovery.
                      </p>
                    </section>
                  </>
                )}

                {activeModal === "privacy" && (
                  <>
                    <section>
                      <h4 className="font-semibold text-amber-300 mb-1">
                        1. Information Collection
                      </h4>
                      <p>
                        Personal credentials collected during participant registration (Full Name,
                        College, Contact details) are utilized strictly for event verification, team
                        formations, and issuing verified participation certificates.
                      </p>
                    </section>
                    <section>
                      <h4 className="font-semibold text-amber-300 mb-1">
                        2. Data Security
                      </h4>
                      <p>
                        Your data is handled securely and never sold or traded to commercial third
                        parties. Only relevant event organizers have vetted access for logistic and
                        competition purposes.
                      </p>
                    </section>
                  </>
                )}
              </div>

              {/* Modal Footer */}
              <div className="mt-6 pt-4 border-t border-white/10 flex justify-end">
                <button
                  onClick={() => setActiveModal(null)}
                  className="px-6 py-2 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-bold text-xs tracking-wider uppercase hover:from-amber-300 hover:to-amber-400 transition-colors shadow-[0_0_15px_rgba(251,191,36,0.3)] cursor-pointer"
                >
                  Understood
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

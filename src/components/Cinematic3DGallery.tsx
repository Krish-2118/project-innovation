"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "./Cinematic3DGallery.css";

export interface GalleryItem {
  id: string | number;
  image: string;
  title: string;
  subtitle: string;
  category: string;
  location?: string;
}

const DEFAULT_GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1511497584788-876761c119ef?q=80&w=1200&auto=format&fit=crop",
    title: "MIMISA ROCKS",
    location: "AUSTRALIA",
    subtitle: "A piece of heaven",
    category: "#Oceania",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop",
    title: "EMERALD COAST",
    location: "MALDIVES",
    subtitle: "Crystal clear ocean waters",
    category: "#Coastal",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?q=80&w=1200&auto=format&fit=crop",
    title: "SERENGETI SAFARI",
    location: "KENYA",
    subtitle: "Majestic animal frontiers",
    category: "#Wildlife",
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1200&auto=format&fit=crop",
    title: "DOLOMITE PEAKS",
    location: "ITALY",
    subtitle: "Sun-drenched alpine spires",
    category: "#Mountains",
  },
  {
    id: 5,
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200&auto=format&fit=crop",
    title: "AURORA BOREALIS",
    location: "NORWAY",
    subtitle: "Luminous green arctic night",
    category: "#PolarSky",
  },
  {
    id: 6,
    image: "https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=1200&auto=format&fit=crop",
    title: "JUNGLE TREK",
    location: "COSTA RICA",
    subtitle: "Hidden crystal waterfalls",
    category: "#Rainforest",
  },
  {
    id: 7,
    image: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=1200&auto=format&fit=crop",
    title: "SAHARA DUNES",
    location: "MOROCCO",
    subtitle: "Endless golden sand twilight",
    category: "#Desert",
  },
  {
    id: 8,
    image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=1200&auto=format&fit=crop",
    title: "MISTY VALLEY",
    location: "SWITZERLAND",
    subtitle: "Quiet morning fog lake",
    category: "#Nature",
  },
];

// Ambient floating particles
const AMBIENT_PARTICLES = Array.from({ length: 16 }, (_, i) => ({
  id: i,
  x: Math.sin(i * 1.37) * 44 + 50, // 6% - 94%
  y: Math.cos(i * 0.93) * 40 + 50, // 10% - 90%
  size: (i % 3) + 2.5,
  duration: 4.5 + (i % 4) * 1.6,
  delay: (i % 4) * 0.6,
}));

interface Cinematic3DGalleryProps {
  items?: GalleryItem[];
}

// ─── Coverflow Circular Track Math ────────────────────────────────────────────
function getCoverflowTransform(
  diff: number, // signed offset from active: -3 -2 -1 0 1 2 3
  isMobile: boolean,
  isTablet: boolean,
) {
  const distance = Math.abs(diff);
  if (distance > 3) return { x: 0, z: -320, rotateY: 0, scale: 0.3, opacity: 0, brightness: 0.2, blur: 5 };

  if (isMobile) {
    const angleStep = 32;
    const cylinderRadius = 310;
    const angleRad = (diff * angleStep * Math.PI) / 180;
    const x = cylinderRadius * Math.sin(angleRad);
    const zBase = cylinderRadius * (Math.cos(angleRad) - 1);
    const z = diff === 0 ? zBase + 160 : zBase;
    const rotateY = -diff * angleStep;
    const scale = distance === 0 ? 1.15 : distance === 1 ? 0.88 : 0.68;
    const opacity = distance === 0 ? 1 : distance === 1 ? 0.95 : 0.72;
    const brightness = distance === 0 ? 1.12 : distance === 1 ? 0.92 : 0.70;
    const blur = distance === 0 ? 0 : distance === 1 ? 0 : 0.8;
    return { x, z, rotateY, scale, opacity, brightness, blur };
  }

  // Progressive curved alignment with increased horizontal dimension
  const rotateAngles = [0, 18, 36, 52]; // progressive inward tilt
  const rotateY = diff > 0 ? -rotateAngles[distance] : rotateAngles[distance];

  const xOffsetsTablet = [0, 195, 365, 515];
  const xOffsetsDesktop = [0, 255, 485, 685]; // wider horizontal span reaching screen borders
  const xOffsets = isTablet ? xOffsetsTablet : xOffsetsDesktop;
  const x = diff < 0 ? -xOffsets[distance] : xOffsets[distance];

  const zDepths = [160, 10, -105, -230];
  const z = zDepths[distance];

  const scales = [1.15, 0.88, 0.70, 0.54];
  const scale = scales[distance];

  const opacities = [1, 0.96, 0.84, 0.65];
  const opacity = opacities[distance];

  const brightnesses = [1.12, 0.96, 0.80, 0.64];
  const brightness = brightnesses[distance];

  const blurs = [0, 0, 0.6, 1.2];
  const blur = blurs[distance];

  return { x, z, rotateY, scale, opacity, brightness, blur };
}

// Pre-computed stable chaos offsets per card index
const CARD_CHAOS = Array.from({ length: 12 }, (_, i) => ({
  x: (Math.sin(i * 2.3 + 1) * 600),        // -600 to +600 px scatter
  y: (Math.cos(i * 1.7 + 0.5) * 500),      // -500 to +500 px scatter
  rotateY: (Math.sin(i * 3.1) * 180),       // wild rotateY -180 to +180
  rotateZ: (Math.cos(i * 2.7) * 35),        // skew tilt -35 to +35
  scale: 0.18 + (i % 4) * 0.06,            // tiny chaotic scale
}));

export default function Cinematic3DGallery({
  items = DEFAULT_GALLERY_ITEMS,
}: Cinematic3DGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [viewportWidth, setViewportWidth] = useState(1200);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [isArranged, setIsArranged] = useState(false);
  const hasArrangedOnceRef = useRef(false);

  const autoplayTimerRef = useRef<NodeJS.Timeout | null>(null);
  const userInteractionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const totalItems = items.length;

  // Drag / swipe state
  const [isDragging, setIsDragging] = useState(false);
  const dragStartXRef = useRef<number | null>(null);
  const dragDeltaRef = useRef(0);
  const wheelCooldownRef = useRef(false);

  const rawDragAngle = useMotionValue(0);
  useSpring(rawDragAngle, { stiffness: 280, damping: 32, mass: 0.6 });

  // Page entrance trigger — first mount chaotic, then arrange after noticeable delay
  useEffect(() => {
    const t2 = setTimeout(() => setIsArranged(true), 500); // 500ms clear view of chaotic state
    const t3 = setTimeout(() => { hasArrangedOnceRef.current = true; }, 3200);
    return () => { clearTimeout(t2); clearTimeout(t3); };
  }, []);

  // Viewport tracking
  useEffect(() => {
    const onResize = () => setViewportWidth(window.innerWidth);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const isMobile = viewportWidth < 640;
  const isTablet = viewportWidth >= 640 && viewportWidth < 1024;
  const maxVisible = isMobile ? 2 : 3;

  const handleNext = useCallback(() => {
    setActiveIndex((p) => (p + 1) % totalItems);
  }, [totalItems]);

  const handlePrev = useCallback(() => {
    setActiveIndex((p) => (p - 1 + totalItems) % totalItems);
  }, [totalItems]);

  const triggerUserInteraction = useCallback(() => {
    setIsPaused(true);
    if (userInteractionTimeoutRef.current) clearTimeout(userInteractionTimeoutRef.current);
    userInteractionTimeoutRef.current = setTimeout(() => setIsPaused(false), 4500);
  }, []);

  // Autoplay
  useEffect(() => {
    if (isPaused || totalItems <= 1) return;
    autoplayTimerRef.current = setInterval(handleNext, 4000);
    return () => { if (autoplayTimerRef.current) clearInterval(autoplayTimerRef.current); };
  }, [isPaused, totalItems, handleNext]);

  // Keyboard navigation
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") { triggerUserInteraction(); handlePrev(); }
      if (e.key === "ArrowRight") { triggerUserInteraction(); handleNext(); }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleNext, handlePrev, triggerUserInteraction]);

  // Mouse drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStartXRef.current = e.clientX;
    dragDeltaRef.current = 0;
    rawDragAngle.set(0);
    triggerUserInteraction();
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || dragStartXRef.current === null) return;
    const delta = e.clientX - dragStartXRef.current;
    dragDeltaRef.current = delta;
    rawDragAngle.set(-delta * 0.12);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    const threshold = isMobile ? 40 : 55;
    if (dragDeltaRef.current < -threshold) handleNext();
    else if (dragDeltaRef.current > threshold) handlePrev();
    rawDragAngle.set(0);
    setIsDragging(false);
    dragStartXRef.current = null;
    dragDeltaRef.current = 0;
  };

  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
    rawDragAngle.set(0);
    triggerUserInteraction();
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const delta = e.touches[0].clientX - touchStartX;
    rawDragAngle.set(-delta * 0.12);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(delta) > 40) {
      if (delta < 0) handleNext(); else handlePrev();
    }
    rawDragAngle.set(0);
    setTouchStartX(null);
  };

  // Wheel handler
  const handleWheel = (e: React.WheelEvent) => {
    if (Math.abs(e.deltaX) < Math.abs(e.deltaY)) return;
    if (wheelCooldownRef.current) return;
    if (Math.abs(e.deltaX) > 15) {
      triggerUserInteraction();
      if (e.deltaX > 0) handleNext(); else handlePrev();
      wheelCooldownRef.current = true;
      setTimeout(() => { wheelCooldownRef.current = false; }, 350);
    }
  };

  // Shortest circular diff
  const getRelativeDiff = (index: number) => {
    let diff = index - activeIndex;
    const half = totalItems / 2;
    if (diff > half) diff -= totalItems;
    if (diff < -half) diff += totalItems;
    return diff;
  };

  const activeItem = items[activeIndex] ?? items[0];

  // Card dimensions
  const cardW = isMobile ? 185 : isTablet ? 245 : 310;
  const cardH = isMobile ? 280 : isTablet ? 365 : 460;
  const stageH = Math.round(cardH * 1.22) + 20;

  return (
    <div
      className="cinematic-gallery-wrapper relative flex flex-col items-center pt-24 sm:pt-28 md:pt-32 pb-12 px-0 overflow-hidden w-full min-h-screen justify-between select-none font-[family-name:var(--font-outfit)]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => { setIsPaused(false); handleMouseUp(); }}
      onMouseMove={handleMouseMove}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onWheel={handleWheel}
    >
      {/* ── Dark-to-bright opening veil ─────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 1.4, ease: "easeOut" }}
        className="fixed inset-0 bg-[#020712] pointer-events-none z-[200]"
      />

      {/* ── Transparent overlay for ambient glows (bg.png shows through) ────── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {/* Ambient static background glows matching site theme */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[55vh] bg-amber-500/8 rounded-full blur-[140px]" />
        <div className="absolute bottom-1/3 left-1/2 -translate-x-1/2 w-[55vw] h-[40vh] bg-teal-500/8 rounded-full blur-[120px]" />
        <div className="absolute top-0 left-0 w-[350px] h-[350px] bg-amber-500/6 rounded-full blur-[130px]" />
        <div className="absolute top-0 right-0 w-[350px] h-[350px] bg-teal-500/6 rounded-full blur-[130px]" />

        {/* Floating ambient particle embers */}
        {AMBIENT_PARTICLES.map((p) => (
          <motion.div
            key={`particle-${p.id}`}
            initial={{ opacity: 0.2, y: 0 }}
            animate={{ opacity: [0.25, 0.75, 0.25], y: [-15, 15, -15], x: [-10, 10, -10] }}
            transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: "easeInOut" }}
            className="absolute rounded-full bg-amber-400/40 pointer-events-none"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
              boxShadow: "0 0 10px rgba(251,191,36,0.6)",
            }}
          />
        ))}

        {/* ── Brief Smoky / Mist pulse animation on active card change (~500ms) ── */}
        <AnimatePresence mode="popLayout">
          <motion.div
            key={`smoke-${activeItem.id}`}
            initial={{ opacity: 0.75, scale: 0.55, filter: "blur(20px)" }}
            animate={{ opacity: 0, scale: 1.5, filter: "blur(80px)" }}
            transition={{ duration: 0.52, ease: "easeOut" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] rounded-full pointer-events-none z-0"
            style={{
              background:
                "radial-gradient(circle, rgba(251,191,36,0.38) 0%, rgba(45,212,191,0.22) 42%, rgba(2,7,18,0) 75%)",
            }}
          />
        </AnimatePresence>
      </div>

      {/* ── Header ───────────────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 text-center mb-4 sm:mb-6 select-none"
      >
        <div className="flex items-center justify-center gap-3 mb-1">
          <span className="text-amber-300/80 text-sm sm:text-base font-serif drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]">✦</span>
          <h1
            className="text-3xl sm:text-5xl font-extrabold tracking-[0.2em] text-white drop-shadow-[0_4px_28px_rgba(0,0,0,0.95)] uppercase font-[family-name:var(--font-cinzel)]"
          >
            OUR{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#fbbf24] via-[#fef3c7] to-[#2dd4bf]">
              GALLERY
            </span>
          </h1>
          <span className="text-amber-300/80 text-sm sm:text-base font-serif drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]">✦</span>
        </div>
      </motion.div>

      {/* ── 3D Stage with Side Navigation Arrows ─────────────────────────────── */}
      <div className="cinematic-gallery-perspective relative z-10 w-full flex-1 flex items-center justify-center my-auto">
        {/* Left Arrow Button */}
        <button
          onClick={(e) => { e.stopPropagation(); triggerUserInteraction(); handlePrev(); }}
          aria-label="Previous Slide"
          className="cinematic-nav-btn absolute left-3 sm:left-8 md:left-12 z-30 opacity-75 hover:opacity-100 transition-opacity"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>

        {/* Right Arrow Button */}
        <button
          onClick={(e) => { e.stopPropagation(); triggerUserInteraction(); handleNext(); }}
          aria-label="Next Slide"
          className="cinematic-nav-btn absolute right-3 sm:right-8 md:right-12 z-30 opacity-75 hover:opacity-100 transition-opacity"
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </button>

        <div
          className={`cinematic-gallery-stage ${isDragging ? "cinematic-gallery-stage-dragging" : ""}`}
          style={{ height: stageH }}
        >
          {items.map((item, index) => {
            const diff = getRelativeDiff(index);
            const distance = Math.abs(diff);
            if (distance > maxVisible) return null;

            const isActive = diff === 0;
            const { x, z, rotateY, scale, opacity, brightness, blur } =
              getCoverflowTransform(diff, isMobile, isTablet);

            // Per-card chaos offsets for the distorted initial state
            const chaos = CARD_CHAOS[index % CARD_CHAOS.length];
            const arrangeDelay = isArranged ? 0.08 + distance * 0.12 : 0;

            const navDuration = isDragging ? 0.04 : 0.7;
            const navEase: [number, number, number, number] = [0.22, 1, 0.36, 1];
            const floatY = [0, -6, 0];

            return (
              <motion.div
                key={item.id}
                initial={{
                  x: chaos.x,
                  y: chaos.y,
                  z: -200,
                  rotateY: chaos.rotateY,
                  rotateZ: chaos.rotateZ,
                  scale: chaos.scale,
                  opacity: 0,
                  filter: "blur(18px) brightness(0.4)",
                }}
                animate={isArranged ? {
                  x,
                  y: isActive ? floatY : 0,
                  z,
                  rotateY,
                  rotateZ: 0,
                  scale,
                  opacity,
                  filter: `brightness(${brightness}) blur(${blur}px)`,
                } : {
                  x: chaos.x * 0.75,
                  y: chaos.y * 0.75,
                  z: -140,
                  rotateY: chaos.rotateY * 0.65,
                  rotateZ: chaos.rotateZ * 0.65,
                  scale: chaos.scale * 1.5,
                  opacity: 0.85,
                  filter: "blur(4px) brightness(0.8)",
                }}
                transition={isArranged ? (
                  hasArrangedOnceRef.current ? {
                    x: { duration: navDuration, ease: navEase },
                    y: isActive
                      ? { duration: 3.5, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }
                      : { duration: navDuration, ease: navEase },
                    z: { duration: navDuration, ease: navEase },
                    rotateY: { duration: navDuration, ease: navEase },
                    rotateZ: { duration: navDuration, ease: navEase },
                    scale: { duration: navDuration, ease: navEase },
                    opacity: { duration: 0.5 },
                    filter: { duration: 0.5 },
                  } : {
                    x: { type: "spring", stiffness: 55, damping: 14, delay: arrangeDelay },
                    y: isActive
                      ? { duration: 3.5, repeat: Infinity, repeatType: "mirror", ease: "easeInOut", delay: arrangeDelay + 1.2 }
                      : { type: "spring", stiffness: 55, damping: 14, delay: arrangeDelay },
                    z: { type: "spring", stiffness: 55, damping: 14, delay: arrangeDelay },
                    rotateY: { type: "spring", stiffness: 50, damping: 13, delay: arrangeDelay },
                    rotateZ: { type: "spring", stiffness: 55, damping: 14, delay: arrangeDelay },
                    scale: { type: "spring", stiffness: 55, damping: 14, delay: arrangeDelay },
                    opacity: { duration: 0.7, delay: arrangeDelay },
                    filter: { duration: 0.8, delay: arrangeDelay },
                  }
                ) : {
                  duration: 0.25,
                }}
                style={{
                  position: "absolute",
                  width: cardW,
                  height: cardH,
                  zIndex: 100 - distance,
                  transformStyle: "preserve-3d",
                  cursor: isActive ? "grab" : "pointer",
                }}
                className={`cinematic-gallery-card select-none ${isActive ? "cinematic-gallery-card-active" : ""}`}
                onClick={() => {
                  if (Math.abs(dragDeltaRef.current) < 6) {
                    triggerUserInteraction();
                    setActiveIndex(index);
                  }
                }}
              >
                <div className="cinematic-gallery-card-frame relative w-full h-full overflow-hidden" style={{ borderRadius: 16 }}>
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes={`${cardW}px`}
                    priority={isActive || distance === 1}
                    className="cinematic-gallery-card-img object-cover object-center"
                    style={{ borderRadius: 16 }}
                  />

                  {/* Dark vignette overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/40 pointer-events-none" />

                  {/* ── Active Card Layout & Typography ───── */}
                  {isActive ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4 }}
                      className="absolute inset-0 p-4 flex flex-col justify-between pointer-events-none z-20"
                    >
                      {/* Top Right Tag Badge */}
                      <div className="flex justify-end">
                        <span className="bg-[#020712]/75 backdrop-blur-md border border-[#fbbf24]/30 text-[#fbbf24] text-[11px] font-semibold px-3 py-0.5 rounded-full shadow-[0_0_12px_rgba(251,191,36,0.2)]">
                          {item.category}
                        </span>
                      </div>

                      {/* Center Overlay Text Block */}
                      <div className="flex flex-col items-center justify-center text-center my-auto px-3 py-3.5 bg-[#020712]/60 backdrop-blur-md rounded-2xl border border-[#fbbf24]/20 shadow-2xl mx-1">
                        <h2 className="text-xl sm:text-2xl font-black text-white tracking-wider uppercase drop-shadow-[0_2px_12px_rgba(0,0,0,1)] leading-tight font-[family-name:var(--font-cinzel)]">
                          {item.title}
                        </h2>
                        {item.location && (
                          <p className="text-sm sm:text-base font-extrabold text-[#fbbf24] tracking-widest uppercase mt-0.5 drop-shadow-[0_2px_8px_rgba(0,0,0,1)]">
                            - {item.location}
                          </p>
                        )}
                        <div className="w-12 h-[2px] bg-gradient-to-r from-[#fbbf24] to-[#2dd4bf] mx-auto my-2 rounded-full shadow-[0_0_8px_#fbbf24]" />
                        <p className="text-xs sm:text-sm text-slate-100 font-sans tracking-wide italic drop-shadow-[0_1px_4px_rgba(0,0,0,1)]">
                          {item.subtitle}
                        </p>
                      </div>
                    </motion.div>
                  ) : (
                    /* Side Cards subtle bottom label */
                    <div className="absolute bottom-0 left-0 right-0 p-3 text-center pointer-events-none z-10 bg-gradient-to-t from-black/90 to-transparent">
                      <p className="text-[11px] font-bold text-white/90 uppercase truncate tracking-wide drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)] font-[family-name:var(--font-cinzel)]">
                        {item.title}
                      </p>
                    </div>
                  )}

                  {/* Active Card Gold Border Glow */}
                  {isActive && (
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        borderRadius: 16,
                        border: "2px solid rgba(251, 191, 36, 0.45)",
                        boxShadow: "inset 0 0 20px rgba(251, 191, 36, 0.2), 0 0 25px rgba(251, 191, 36, 0.15)",
                      }}
                    />
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

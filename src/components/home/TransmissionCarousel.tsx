"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, MotionConfig, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Testimonial } from "@/lib/data/testimonials";

const ADVANCE_MS = 9000;

/** Rotating quotes, presented as incoming transmissions. */
export default function TransmissionCarousel({ items }: { items: Testimonial[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  // Only used for the auto-advance timer; rendering never branches on it (hydration-safe).
  const reduceMotion = useReducedMotion();
  const regionRef = useRef<HTMLDivElement>(null);
  const count = items.length;

  const go = useCallback((delta: number) => setIndex((i) => (i + delta + count) % count), [count]);

  useEffect(() => {
    if (paused || reduceMotion || count < 2) return;
    const id = window.setTimeout(() => go(1), ADVANCE_MS);
    return () => window.clearTimeout(id);
  }, [index, paused, reduceMotion, count, go]);

  const item = items[index];
  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div
      ref={regionRef}
      role="region"
      aria-roledescription="carousel"
      aria-label="Testimonials"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={(e) => {
        if (!regionRef.current?.contains(e.relatedTarget as Node)) setPaused(false);
      }}
      className="relative mx-auto w-full max-w-4xl"
    >
      <span className="iv-quote-glyph" aria-hidden="true">
        &ldquo;
      </span>

      <div aria-live={paused ? "polite" : "off"} className="relative min-h-[260px] sm:min-h-[220px]">
        <MotionConfig reducedMotion="user">
        <AnimatePresence mode="wait" initial={false}>
          <motion.figure
            key={index}
            initial={{ opacity: 0, y: 18, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -12, filter: "blur(6px)" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            aria-roledescription="slide"
            aria-label={`${index + 1} of ${count}`}
            className="text-center"
          >
            <blockquote className="iv-quote">{item.quote}</blockquote>
            <figcaption className="mt-8 flex flex-col items-center gap-1">
              <span className="font-[family-name:var(--font-cinzel)] text-base tracking-[0.2em] text-amber-100">
                {item.name}
              </span>
              <span className="iv-mono text-amber-100/55">
                {item.role}
                {item.edition ? ` · ${item.edition}` : ""}
              </span>
            </figcaption>
          </motion.figure>
        </AnimatePresence>
        </MotionConfig>
      </div>

      {count > 1 && (
        <div className="mt-10 flex items-center justify-center gap-6">
          <button type="button" onClick={() => go(-1)} className="iv-icon-btn" aria-label="Previous testimonial">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="iv-mono text-amber-100/60" aria-hidden="true">
            Transmission {pad(index + 1)} / {pad(count)}
          </span>
          <button type="button" onClick={() => go(1)} className="iv-icon-btn" aria-label="Next testimonial">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}

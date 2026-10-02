"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { TextLoopBand } from "@/lib/data/textLoops";
import "./text-loop.css";

// Each row holds two identical halves so a -50% shift wraps seamlessly; each
// half repeats the words so it is always wider than the screen.
const REPEATS_PER_HALF = 2;

interface TextLoopProps {
  band: TextLoopBand;
  /** "ink" paints the band on solid --ink (for joins between ink sections). */
  tone?: "clear" | "ink";
  className?: string;
}

function DisplayHalf({ band }: { band: TextLoopBand }) {
  return (
    <div className="tl__half">
      {Array.from({ length: REPEATS_PER_HALF }).flatMap((_, r) =>
        band.words.map((word, i) => (
          <span key={`${r}-${i}`} className="tl__unit">
            <span className={`tl__word tl__word--${word.style}`}>{word.text}</span>
            <span className="tl__star">✦</span>
          </span>
        ))
      )}
    </div>
  );
}

function TelemetryHalf({ band }: { band: TextLoopBand }) {
  return (
    <div className="tl__half">
      {Array.from({ length: REPEATS_PER_HALF * 2 }).flatMap((_, r) =>
        band.telemetry.map((line, i) => (
          <span key={`${r}-${i}`} className="tl__tele">
            {line}
            <span className="tl__dot">·</span>
          </span>
        ))
      )}
    </div>
  );
}

/**
 * A scroll-reactive marquee band. Decorative (the same words appear as real
 * content elsewhere on the page), so it is hidden from assistive technology.
 */
export default function TextLoop({ band, tone = "clear", className = "" }: TextLoopProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reverse = band.direction === "left" ? "right" : "left";

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    gsap.registerPlugin(ScrollTrigger);

    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const rows = gsap.utils.toArray<HTMLElement>(".tl__row", root);
      const drifts = gsap.utils.toArray<HTMLElement>(".tl__drift", root);

      // 1. Endless loops, paused until the band is on screen.
      const loops = rows.map((row) => {
        const toLeft = row.dataset.dir === "left";
        return gsap.fromTo(
          row,
          { xPercent: toLeft ? 0 : -50 },
          {
            xPercent: toLeft ? -50 : 0,
            duration: Number(row.dataset.duration),
            ease: "none",
            repeat: -1,
            paused: true,
          }
        );
      });

      // 2. Entrance: rows rise into place the first time the band appears.
      gsap.from(drifts, {
        yPercent: 70,
        autoAlpha: 0,
        duration: 1.3,
        ease: "power3.out",
        stagger: 0.14,
        scrollTrigger: { trigger: root, start: "top 90%", once: true },
      });

      // 3. Scrubbed drift: rows slide against each other as the band crosses the viewport.
      drifts.forEach((drift) => {
        const sign = Number(drift.dataset.drift);
        gsap.fromTo(
          drift,
          { xPercent: -5 * sign },
          {
            xPercent: 5 * sign,
            ease: "none",
            scrollTrigger: { trigger: root, start: "top bottom", end: "bottom top", scrub: 0.8 },
          }
        );
      });

      // 4. Run only while visible; scroll velocity briefly accelerates the loops.
      ScrollTrigger.create({
        trigger: root,
        start: "top bottom",
        end: "bottom top",
        onToggle: (self) => loops.forEach((loop) => (self.isActive ? loop.play() : loop.pause())),
        onUpdate: (self) => {
          const boost = 1 + Math.min(Math.abs(self.getVelocity()) / 350, 5);
          loops.forEach((loop) => loop.timeScale(Math.max(loop.timeScale(), boost)));
          gsap.to(loops, { timeScale: 1, duration: 1.4, ease: "power3.out", overwrite: true });
        },
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={`tl tl--${tone} ${className}`}
      style={{ "--tilt": band.tilt } as CSSProperties}
    >
      <div className="tl__tape">
        <div className="tl__drift" data-drift={band.direction === "left" ? 1 : -1}>
          <div className="tl__row" data-dir={band.direction} data-duration={band.duration}>
            <DisplayHalf band={band} />
            <DisplayHalf band={band} />
          </div>
        </div>
        <div className="tl__drift" data-drift={band.direction === "left" ? -1 : 1}>
          <div className="tl__row" data-dir={reverse} data-duration={band.duration * 0.8}>
            <TelemetryHalf band={band} />
            <TelemetryHalf band={band} />
          </div>
        </div>
      </div>
    </div>
  );
}

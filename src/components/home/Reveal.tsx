"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Delay in milliseconds before the element animates in. */
  delay?: number;
  /** Visual style of the entrance — see `.iv-reveal` variants in home.css. */
  variant?: "rise" | "fade" | "focus" | "drift-left" | "drift-right" | "briefing";
  id?: string;
  /** IntersectionObserver options for when the entrance triggers. */
  threshold?: number;
  rootMargin?: string;
}

/**
 * Marks its child as revealed the first time it scrolls into view. The
 * animation itself lives in CSS, so content is fully server-rendered and
 * remains visible when JavaScript or motion is unavailable.
 */
export default function Reveal({
  children,
  className = "",
  delay = 0,
  variant = "rise",
  id,
  threshold = 0.12,
  rootMargin = "0px 0px -12% 0px",
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.dataset.reveal = "pending";

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            el.dataset.reveal = "in";
            observer.disconnect();
          }
        }
      },
      { rootMargin, threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return (
    <div
      ref={ref}
      id={id}
      className={`iv-reveal iv-reveal--${variant} ${className}`}
      style={{ "--iv-delay": `${delay}ms` } as CSSProperties}
    >
      {children}
    </div>
  );
}

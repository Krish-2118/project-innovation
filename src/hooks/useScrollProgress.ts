import { useEffect, type RefObject } from "react";
import { addFrameTask, requestFrame } from "@/lib/motion/frameLoop";

interface ScrollProgressOptions {
  /** CSS custom property to write (default `--p`). */
  property?: string;
  /**
   * `"through"` (default): 0 as the element's top enters from below, 1 as its
   * bottom leaves at the top.
   * `"pinned"`: progress across a sticky section — 0 when its top reaches the
   * top of the viewport, 1 when its bottom reaches the bottom.
   */
  mode?: "through" | "pinned";
  /**
   * Pinned mode only: viewport heights at the end of the section that hold
   * at p = 1 (e.g. while the next section slides over the pinned stage).
   */
  holdViewports?: number;
}

/**
 * Writes an element's scroll progress (0 → 1) to a CSS custom property so
 * layers can be driven from CSS. Values never go through React state.
 */
export function useScrollProgress(
  ref: RefObject<HTMLElement | null>,
  { property = "--p", mode = "through", holdViewports = 0 }: ScrollProgressOptions = {}
) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let last = -1;
    const removeTask = addFrameTask(() => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      let p: number;
      if (mode === "pinned") {
        const distance = rect.height - vh * (1 + holdViewports);
        p = distance > 0 ? -rect.top / distance : rect.top <= 0 ? 1 : 0;
      } else {
        p = (vh - rect.top) / (vh + rect.height);
      }
      p = Math.min(1, Math.max(0, p));
      // Skip redundant style writes while the section is off-screen.
      if (Math.abs(p - last) > 0.0001) {
        el.style.setProperty(property, p.toFixed(4));
        last = p;
      }
    });

    window.addEventListener("scroll", requestFrame, { passive: true });
    window.addEventListener("resize", requestFrame, { passive: true });
    return () => {
      removeTask();
      window.removeEventListener("scroll", requestFrame);
      window.removeEventListener("resize", requestFrame);
      el.style.removeProperty(property);
    };
  }, [ref, property, mode, holdViewports]);
}

import { useEffect } from "react";
import { addFrameTask, requestFrame } from "@/lib/motion/frameLoop";

const EASE = 0.07;
const SETTLE = 0.0005;

/**
 * Eases the pointer position into `--mx` / `--my` (-1 → 1) on the page root,
 * so any layer can derive a depth offset from it in CSS. Skipped on touch-only
 * devices and when the user prefers reduced motion.
 */
export function usePointerDepth(depthMultiplier = 1) {
  useEffect(() => {
    if (window.matchMedia("(hover: none)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const root = document.documentElement;
    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };

    const removeTask = addFrameTask(() => {
      current.x += (target.x - current.x) * EASE;
      current.y += (target.y - current.y) * EASE;
      root.style.setProperty("--mx", (current.x * depthMultiplier).toFixed(4));
      root.style.setProperty("--my", (current.y * depthMultiplier).toFixed(4));
      // Keep ticking only until the eased value catches up.
      return Math.abs(target.x - current.x) > SETTLE || Math.abs(target.y - current.y) > SETTLE;
    });

    const onMove = (e: PointerEvent) => {
      target.x = (e.clientX / window.innerWidth) * 2 - 1;
      target.y = (e.clientY / window.innerHeight) * 2 - 1;
      requestFrame();
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      removeTask();
      window.removeEventListener("pointermove", onMove);
      root.style.removeProperty("--mx");
      root.style.removeProperty("--my");
    };
  }, [depthMultiplier]);
}

"use client";

import { usePointerDepth } from "@/hooks/usePointerDepth";

/** Mounts the page-wide `--mx` / `--my` pointer loop once for every section that uses it. */
export default function PointerDepth() {
  usePointerDepth();
  return null;
}

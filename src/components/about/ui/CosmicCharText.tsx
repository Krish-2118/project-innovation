"use client";

import React, { useRef } from "react";

function HolographicWord({ word }: { word: string }) {
  const wordRef = useRef<HTMLSpanElement>(null);
  const isScanningRef = useRef(false);

  const triggerScan = () => {
    const el = wordRef.current;
    if (!el || isScanningRef.current) return;
    isScanningRef.current = true;
    el.classList.add("hologram-active");

    setTimeout(() => {
      if (el) el.classList.remove("hologram-active");
      isScanningRef.current = false;
    }, 580);
  };

  return (
    <span
      ref={wordRef}
      onMouseEnter={triggerScan}
      className="hologram-word relative inline-block whitespace-nowrap cursor-default select-none px-[3px] py-[2px]"
    >
      {/* 1. Base Text */}
      <span className="hologram-base inline-block">{word}</span>

      {/* 2. Chromatic Prism Flare Overlay (Cyan to Gold Starlight Split) */}
      <span aria-hidden="true" className="hologram-prism">
        {word}
      </span>
    </span>
  );
}

export default function CosmicInteractiveParagraph({
  paragraphs,
  className = "",
  style,
}: {
  paragraphs: string[];
  className?: string;
  style?: React.CSSProperties;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  // High-speed sweep tracking: trigger laser sweep on words even during rapid cursor glides
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null;
    const wordEl = target?.closest(".hologram-word") as HTMLElement | null;
    if (wordEl && containerRef.current?.contains(wordEl) && !wordEl.classList.contains("hologram-active")) {
      wordEl.classList.add("hologram-active");
      setTimeout(() => {
        wordEl.classList.remove("hologram-active");
      }, 580);
    }
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="flex flex-col items-center text-center gap-3 sm:gap-4 w-full cursor-default select-none"
    >
      {paragraphs.map((paraText, pIdx) => {
        const words = paraText.split(" ");
        return (
          <p key={pIdx} className={className} style={style}>
            {words.map((word, wIdx) => (
              <React.Fragment key={wIdx}>
                <HolographicWord word={word} />
                {wIdx < words.length - 1 && (
                  <span className="inline-block select-none">&nbsp;</span>
                )}
              </React.Fragment>
            ))}
          </p>
        );
      })}
    </div>
  );
}

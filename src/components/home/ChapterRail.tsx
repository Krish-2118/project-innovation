"use client";

import { useEffect, useState } from "react";

const CHAPTERS = [
  { id: "launch", numeral: "0", label: "Launch" },
  { id: "about", numeral: "I", label: "Briefing" },
  { id: "transmissions", numeral: "II", label: "Transmissions" },
  { id: "gallery", numeral: "III", label: "Gallery" },
  { id: "navigation", numeral: "IV", label: "Navigation" },
  { id: "horizon", numeral: "V", label: "Horizon" },
] as const;

/**
 * A vertical orbit on the left edge of large screens that tracks which
 * chapter of the voyage is in view and lets visitors jump between them.
 */
export default function ChapterRail() {
  const [active, setActive] = useState<string>(CHAPTERS[0].id);

  useEffect(() => {
    const sections = CHAPTERS.map((c) => document.getElementById(c.id)).filter(
      (el): el is HTMLElement => el !== null
    );

    // A section is "current" while it crosses the middle band of the viewport.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-48% 0px -48% 0px" }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  const activeIndex = CHAPTERS.findIndex((c) => c.id === active);

  return (
    <nav aria-label="Page chapters" className="iv-rail hidden lg:flex">
      <span className="iv-rail__line" aria-hidden="true">
        <span
          className="iv-rail__progress"
          style={{ transform: `scaleY(${activeIndex / (CHAPTERS.length - 1)})` }}
        />
      </span>
      <ol className="relative flex flex-col gap-7">
        {CHAPTERS.map((chapter, i) => {
          const isActive = chapter.id === active;
          return (
            <li key={chapter.id}>
              <a
                href={`#${chapter.id}`}
                aria-current={isActive ? "location" : undefined}
                data-active={isActive}
                data-passed={i < activeIndex}
                className="iv-rail__item group"
              >
                <span className="iv-rail__node" aria-hidden="true" />
                <span className="iv-rail__label">
                  <span className="iv-rail__numeral">{chapter.numeral}</span>
                  {chapter.label}
                </span>
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

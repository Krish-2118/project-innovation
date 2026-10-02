import type { ReactNode } from "react";
import Reveal from "./Reveal";

interface ChapterHeadingProps {
  numeral: string;
  chapter: string;
  title: ReactNode;
  id: string;
  align?: "left" | "center";
  tone?: "gold" | "teal" | "violet";
  children?: ReactNode;
}

/** Shared "chapter" heading used to stitch the homepage sections into one voyage. */
export default function ChapterHeading({
  numeral,
  chapter,
  title,
  id,
  align = "left",
  tone = "gold",
  children,
}: ChapterHeadingProps) {
  const centered = align === "center";
  return (
    <header className={`iv-chapter iv-tone-${tone} ${centered ? "items-center text-center" : "items-start text-left"} flex flex-col`}>
      <Reveal variant="fade" className={`flex items-center gap-3 ${centered ? "justify-center" : ""}`}>
        <span className="iv-chapter__numeral" aria-hidden="true">
          {numeral}
        </span>
        <span className="iv-chapter__rule" aria-hidden="true" />
        <span className="iv-eyebrow">{chapter}</span>
      </Reveal>
      <Reveal variant="focus" delay={120}>
        <h2 id={id} className="iv-display mt-5 text-[clamp(2.1rem,5.2vw,4.6rem)]">
          {title}
        </h2>
      </Reveal>
      {children && (
        <Reveal variant="rise" delay={240} className={`mt-6 max-w-xl ${centered ? "mx-auto" : ""}`}>
          {children}
        </Reveal>
      )}
    </header>
  );
}

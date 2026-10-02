"use client";

import { useRef, type CSSProperties } from "react";
import { MISSION_BRIEFING } from "@/lib/data/about";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import Reveal from "./Reveal";
import "./mission-briefing.css";

/**
 * Chapter I — Mission Briefing (About). Lines of the statement ignite as the
 * section scrolls (`--p`), two starfields and a Saturn drift at different
 * depths, and the pointer (`--mx`/`--my`, from <PointerDepth />) shifts each layer by its own amount.
 */
export default function MissionBriefing() {
  const ref = useRef<HTMLElement>(null);
  useScrollProgress(ref);

  const { eyebrow, lines, chips, saturn } = MISSION_BRIEFING;

  return (
    <section ref={ref} id="about" aria-labelledby="about-title" className="mb">
      <div className="mb__stars mb__stars--far" aria-hidden="true" />
      <div className="mb__stars mb__stars--near" aria-hidden="true" />
      <div
        className="mb__saturn"
        aria-hidden="true"
        style={{ backgroundImage: `url(${saturn})` } as CSSProperties}
      />

      <div className="mb__inner">
        <Reveal variant="briefing" threshold={0.15} rootMargin="0px">
          <h2 id="about-title" className="mb__eyebrow">
            <span aria-hidden="true">✦ </span>
            {eyebrow}
            <span aria-hidden="true"> ✦</span>
          </h2>
        </Reveal>

        <p className="mb__statement">
          {lines.map((line) => (
            <span
              key={line.text}
              className={"emphasis" in line && line.emphasis ? "mb__line mb__line--emphasis" : "mb__line"}
              style={{ "--s": line.reveal } as CSSProperties}
            >
              {line.text}{" "}
            </span>
          ))}
        </p>

        <Reveal variant="briefing" delay={120} threshold={0.15} rootMargin="0px">
          <ul className="mb__chips" aria-label="Event categories">
            {chips.map((chip) => (
              <li key={chip} className="mb__chip">
                {chip}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}

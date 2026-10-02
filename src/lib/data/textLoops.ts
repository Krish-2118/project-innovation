import { SITE } from "./site";

// Scroll-reactive text loops (marquee bands) placed between homepage chapters.
// Each band has a large display line and a small telemetry line that runs the
// opposite way. `style` sets how each word is drawn:
//   solid   — paper-white
//   outline — hollow, stroked letters
//   gold    — gold italic serif

export type LoopWordStyle = "solid" | "outline" | "gold";

export interface TextLoopBand {
  words: { text: string; style: LoopWordStyle }[];
  telemetry: string[];
  /** Direction of the large line; the telemetry line runs the other way. */
  direction: "left" | "right";
  /** Seconds for one full loop of the large line at rest. */
  duration: number;
  /** Slight tilt in degrees for a crossing-tape rhythm down the page. */
  tilt: number;
}

export const TEXT_LOOPS = {
  // Hero → Mission Briefing
  identity: {
    words: [
      { text: `${SITE.name} ${SITE.edition}`, style: "solid" },
      { text: SITE.theme, style: "gold" },
      { text: SITE.institute, style: "outline" },
    ],
    telemetry: [SITE.coordinates, "Mission log open", "All systems nominal"],
    direction: "left",
    duration: 42,
    tilt: -1.5,
  },
  // Mission Briefing → Flight Recorder
  flagships: {
    words: [
      { text: "Robo Wars", style: "outline" },
      { text: "Stellar Night", style: "gold" },
      { text: "Hack Innovision", style: "solid" },
    ],
    telemetry: ["Flagship worlds", "Flight recorder engaged", "Past editions ahead"],
    direction: "right",
    duration: 38,
    tilt: 1.5,
  },
  // Top of the Finale
  tagline: {
    words: [
      { text: "Where ideas", style: "solid" },
      { text: "transcend", style: "gold" },
      { text: "boundaries", style: "outline" },
    ],
    telemetry: ["Launch window open", "Register now", SITE.coordinates],
    direction: "left",
    duration: 46,
    tilt: -1.5,
  },
} satisfies Record<string, TextLoopBand>;

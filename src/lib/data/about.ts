// Copy for the homepage "Mission Briefing" (About) section.
// Each statement line renders as its own block and lights up in order on
// scroll; `reveal` is the scroll progress (0–1) at which the line starts.

export const MISSION_BRIEFING = {
  eyebrow: "Mission Briefing",
  lines: [
    { text: "Every year, a campus in Rourkela", reveal: 0.2 },
    { text: "turns its lecture halls into launchpads —", reveal: 0.26 },
    { text: "robots duel, code ships at dawn,", reveal: 0.32 },
    { text: "and ideas finally leave orbit.", reveal: 0.38 },
    { text: "This is Innovision.", reveal: 0.44, emphasis: true },
  ],
  chips: ["Technical", "Managerial", "Cultural", "Workshops"],
  // Transparent PNG, roughly 504 × 308, placed at /public/saturn.png
  saturn: "/saturn.png",
} as const;

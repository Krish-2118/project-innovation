import type { Metadata } from "next";
import MouseParallaxContainer from "@/components/layout/MouseParallaxContainer";
import HomeBackdrop from "@/components/home/HomeBackdrop";
import HeroSection from "@/components/home/HeroSection";
import MissionBriefing from "@/components/home/MissionBriefing";

import FlightRecorder from "@/components/home/FlightRecorder";
import TextLoop from "@/components/home/TextLoop";
import { TEXT_LOOPS } from "@/lib/data/textLoops";
import PointerDepth from "@/components/home/PointerDepth";
import "@/components/home/home.css";

export const metadata: Metadata = {
  title: "INNOVISION 2026 | The Celestial Odyssey — NIT Rourkela",
  description:
    "INNOVISION 2026 — NIT Rourkela's Celestial Odyssey. Discover the festival, explore its events and register for the journey.",
};

export default function Home() {
  return (
    // overflow-x-clip (not hidden) so the pinned gallery's position: sticky keeps working.
    <MouseParallaxContainer className="iv-home relative flex w-full flex-col overflow-x-clip bg-[#020712]">
      <HomeBackdrop />
      <PointerDepth />

      {/* Text loops are spaced as identical beats between chapters; the third
          lives inside the Finale so the gallery → finale slide-over still works. */}
      <HeroSection />
      <TextLoop band={TEXT_LOOPS.identity} tone="ink" />
      <MissionBriefing />
      <TextLoop band={TEXT_LOOPS.flagships} />
      <FlightRecorder />

    </MouseParallaxContainer>
  );
}

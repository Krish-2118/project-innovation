import Image from "next/image";
import PlanetaryWaypoints from "@/components/about/PlanetaryWaypoints";
import SimplePinkLighting from "@/components/about/SimplePinkLighting";
import SpacecraftCursor from "@/components/about/SpacecraftCursor";
import CosmicCursorEcho from "@/components/about/CosmicCursorEcho";
import MouseParallaxContainer from "@/components/layout/MouseParallaxContainer";

import ClientAboutConstellations from "@/components/about/ClientAboutConstellations";
import ClientCosmicCometSystem from "@/components/about/ClientCosmicCometSystem";
import ClientFloatingAstronauts from "@/components/about/ClientFloatingAstronauts";
import "./about.css";

export default function AboutPage() {
  return (
    <MouseParallaxContainer className="relative w-full h-screen bg-[#020712] overflow-hidden">
      {/* REALISTIC 3D SPACECRAFT CURSOR WITH THRUST ANIMATION */}
      <SpacecraftCursor />

      {/* COSMIC CURSOR ECHO INTERACTION */}
      <CosmicCursorEcho />

      {/* FIXED BACKGROUND LAYER */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* 1. Deep Space Background */}
        <div
          data-parallax="-12"
          data-parallax-scale="1.05"
          className="absolute -inset-8 will-change-transform"
          style={{
            transform: `translate3d(0px, 0px, 0) scale(1.05)`,
          }}
        >
          <Image
            src="/backdrop.png"
            alt="Deep Cosmic Space Background"
            fill
            priority
            className="object-cover object-center opacity-95"
          />
        </div>

        {/* 2. Simple Soft Pink Ambient Lighting with Fade */}
        <SimplePinkLighting />

        {/* 3. Interactive Constellation Network */}
        <ClientAboutConstellations />

        {/* 4. Cinematic Intermittent Comet / Meteor Flyby System */}
        <ClientCosmicCometSystem />
      </div>

      {/* 3D REALISTIC FLOATING ASTRONAUTS ON BOTH SIDES */}
      <ClientFloatingAstronauts />

      {/* MAIN CONTENT LAYER */}
      <div className="relative z-40 w-full flex flex-col items-center justify-center h-screen">
        <PlanetaryWaypoints />
      </div>
    </MouseParallaxContainer>
  );
}

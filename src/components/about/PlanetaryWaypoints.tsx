"use client";

import React from "react";
import { HyperText } from "@/components/about/ui/hyper-text";
import CosmicInteractiveParagraph from "@/components/about/ui/CosmicCharText";

export default function PlanetaryWaypoints() {
  return (
    <section className="relative w-full h-screen px-6 flex items-center justify-center pointer-events-auto z-30 overflow-hidden pt-12 sm:pt-14 pb-8">
      
      {/* CENTERED ABOUT US CONTENT FRAME (PROPORTIONALLY BOUNDED TO MIDDLE 47VW) */}
      <div className="w-full max-w-[min(680px,46vw)] lg:max-w-[min(720px,47vw)] mx-auto flex flex-col items-center text-center gap-2 sm:gap-3 -mt-3 sm:-mt-5">
        
        {/* 1. 3D About Us Title */}
        <div className="w-full flex justify-center">
          <HyperText className="scale-100 origin-center" />
        </div>

        {/* 2. Description Paragraphs */}
        <div className="flex flex-col items-center text-center gap-3 sm:gap-4 font-orbitron w-full">
          {/* Supporting Paragraphs with Cosmic Starlight Proximity Field */}
          <CosmicInteractiveParagraph
            paragraphs={[
              "Step into a realm where high-performance WebGL physics seamlessly merges with generative intelligence. We construct immersive digital dimensions designed to inspire, connect, and elevate the human experience.",
              "Welcome to the Celestial Odyssey. Innovision is the ultimate convergence of technology, innovation, and cosmic exploration. Embark on a journey through the stars as we uncover the mysteries of the universe, one event at a time."
            ]}
            className="w-full text-xs sm:text-sm md:text-base lg:text-[18px] xl:text-[19px] text-slate-100/95 leading-[1.68] sm:leading-[1.72] audiowide-regular tracking-wide text-center"
            style={{
              fontFamily: '"Audiowide", sans-serif',
              textShadow: "0 1px 3px rgba(0,0,0,0.95), 0 0 16px rgba(56, 189, 248, 0.3)",
            }}
          />
        </div>
      </div>
    </section>
  );
}

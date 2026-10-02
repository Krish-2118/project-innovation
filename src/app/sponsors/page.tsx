import Image from "next/image";
import { 
  Hexagon, 
  CircleDashed, 
  Sparkles, 
  Triangle, 
  Box, 
  Pyramid,
  Waves,
  Infinity,
  Aperture,
  Compass,
  Crown,
  Dna,
  Eclipse,
  Flame,
  Globe2,
  Leaf,
  MoonStar
} from "lucide-react";
import "./sponsors.css";
import MouseParallaxContainer from "@/components/layout/MouseParallaxContainer";

// Sponsor data mapping
const sponsorCategories = [
  {
    id: "01",
    title: "OUR SPONSORS",
    sponsors: [
      { name: "Alpha", icon: <Triangle className="w-12 h-12 stroke-[1.5]" /> },
      { name: "Nexus", icon: <Hexagon className="w-12 h-12 stroke-[1.5]" /> },
      { name: "Lumina", icon: <Sparkles className="w-12 h-12 stroke-[1.5]" /> },
      { name: "Orbit", icon: <CircleDashed className="w-12 h-12 stroke-[1.5]" /> },
      { name: "Vertex", icon: <Pyramid className="w-12 h-12 stroke-[1.5]" /> },
      { name: "Quantum", icon: <Box className="w-12 h-12 stroke-[1.5]" /> },
    ]
  },
  {
    id: "02",
    title: "MEDIA SPONSORS",
    sponsors: [
      { name: "Broadcast", icon: <Aperture className="w-10 h-10 stroke-[1.5]" /> },
      { name: "Stream", icon: <Waves className="w-10 h-10 stroke-[1.5]" /> },
      { name: "Vision", icon: <Eclipse className="w-10 h-10 stroke-[1.5]" /> },
      { name: "Global", icon: <Globe2 className="w-10 h-10 stroke-[1.5]" /> },
      { name: "Infinity", icon: <Infinity className="w-10 h-10 stroke-[1.5]" /> },
    ]
  },
  {
    id: "03",
    title: "FOOD SPONSORS",
    sponsors: [
      { name: "Harvest", icon: <Leaf className="w-10 h-10 stroke-[1.5]" /> },
      { name: "Flame", icon: <Flame className="w-10 h-10 stroke-[1.5]" /> },
      { name: "Royal", icon: <Crown className="w-10 h-10 stroke-[1.5]" /> },
      { name: "Essence", icon: <Dna className="w-10 h-10 stroke-[1.5]" /> },
      { name: "Lunar", icon: <MoonStar className="w-10 h-10 stroke-[1.5]" /> },
      { name: "Atlas", icon: <Compass className="w-10 h-10 stroke-[1.5]" /> },
    ]
  }
];

export default function SponsorsPage() {
  return (
    <MouseParallaxContainer className="relative w-full min-h-screen bg-[#020712] overflow-x-hidden pt-24 pb-12 selection:bg-amber-500/30">
      
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div
          data-parallax="-15"
          data-parallax-scale="1.05"
          className="absolute -inset-8 will-change-transform"
          style={{ transform: "translate3d(0px, 0px, 0) scale(1.05)" }}
        >
          <Image
            src="/backdrop.png"
            alt="Space Background"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center opacity-80"
          />
          {/* Subtle gradient overlay to ensure text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#020712]/50 via-transparent to-[#020712]/90" />
        </div>
      </div>

      {/* Main Content */}
      <div data-parallax="5" className="relative z-10 w-full max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 flex flex-col items-center">
        
        {/* Header Section */}
        <div className="text-center mb-0 mt-4 w-full pt-6 pb-2 rounded-3xl">
          <div className="flex items-center justify-center gap-3 mb-3">
            <span className="w-1.5 h-1.5 rotate-45 bg-[#fbbf24] shadow-[0_0_8px_#fbbf24]" />
            <h2 className="text-[#fbbf24] font-medium tracking-[0.25em] text-xs md:text-sm uppercase">
              Innovision 2026
            </h2>
            <span className="w-1.5 h-1.5 rotate-45 bg-[#fbbf24] shadow-[0_0_8px_#fbbf24]" />
          </div>
          
          {/* Custom Styled Title mirroring the user's design */}
          <div className="flex flex-col items-center justify-center mb-2 relative w-full max-w-4xl mx-auto px-4 hover:scale-105 transition-transform duration-700 cursor-default">
            
            {/* Title Text with Celestial Texture */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-[0.1em] font-bold uppercase font-serif drop-shadow-[0_8px_24px_rgba(0,0,0,0.9)] py-2">
              <span className="bg-[url('/celestial-text-bg-inverted.png')] bg-cover bg-center bg-clip-text text-transparent filter drop-shadow-[0_0_20px_rgba(255,255,255,0.25)]">
                SPONSORS
              </span>
            </h1>
            
          </div>
        </div>

        {/* Sponsor Categories */}
        <div className="w-full flex flex-col gap-10 sm:gap-14">
          {sponsorCategories.map((category) => (
            <div key={category.id} className="w-full flex flex-col">
              
              {/* Category Header */}
              <div className="flex items-center justify-center gap-4 sm:gap-8 mb-8 sm:mb-12 group w-full">
                <div className="hidden sm:block flex-1 h-px bg-gradient-to-r from-transparent via-[#fbbf24]/30 to-[#fbbf24]/60 relative">
                  <span className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rotate-45 bg-[#fbbf24]" />
                </div>
                
                <div className="flex items-center gap-3 sm:gap-4 px-2 sm:px-4 text-center">
                  <span className="sm:hidden w-1.5 h-1.5 rotate-45 bg-[#fbbf24] shadow-[0_0_8px_#fbbf24]" />
                  <h3 className="text-[#fef3c7] font-serif tracking-[0.25em] text-lg sm:text-2xl md:text-3xl font-black uppercase group-hover:text-[#fbbf24] transition-colors duration-300 drop-shadow-[0_0_12px_rgba(251,191,36,0.3)]">
                    {category.title}
                  </h3>
                  <span className="sm:hidden w-1.5 h-1.5 rotate-45 bg-[#fbbf24] shadow-[0_0_8px_#fbbf24]" />
                </div>
                
                <div className="hidden sm:block flex-1 h-px bg-gradient-to-l from-transparent via-[#fbbf24]/30 to-[#fbbf24]/60 relative">
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rotate-45 bg-[#fbbf24]" />
                </div>
              </div>

              {/* Sponsor Grid */}
              <div className="flex flex-wrap justify-center gap-6 sm:gap-8">
                {category.sponsors.map((sponsor, idx) => (
                  <div 
                    key={idx}
                    className="group relative flex flex-col justify-center items-center rounded-2xl p-5 sm:p-6 transition-all duration-500 hover:-translate-y-2 aspect-square cursor-pointer w-[calc(50%-12px)] sm:w-[calc(33.333%-22px)] lg:w-[calc(25%-24px)]"
                  >
                    {/* Dark Cosmic Background & Gold Border */}
                    <div className="absolute inset-0 rounded-2xl border border-[#fbbf24]/30 bg-[#020712]/80 backdrop-blur-md shadow-[0_0_15px_rgba(251,191,36,0.1)] transition-all duration-500 group-hover:border-[#fbbf24]/70 group-hover:shadow-[0_0_30px_rgba(251,191,36,0.25)] group-hover:bg-[#03091e]/90 overflow-hidden">
                      {/* Subtle Constellation Decoration */}
                      <div className="absolute inset-0 bg-[url('/celestial-text-bg.png')] bg-cover bg-center opacity-10 mix-blend-screen pointer-events-none group-hover:opacity-30 transition-opacity duration-500" />
                      
                      {/* Corner Accents */}
                      <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-[#fbbf24]/50 rounded-tl-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-[#fbbf24]/50 rounded-tr-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-[#fbbf24]/50 rounded-bl-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-[#fbbf24]/50 rounded-br-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>

                    {/* Icon / Image Placeholder */}
                    <div className="relative z-10 w-full flex-1 mb-4 rounded-xl overflow-hidden bg-black/40 border border-white/5 shadow-inner flex items-center justify-center">
                      <div className="text-[#fbbf24]/80 group-hover:text-[#fbbf24] transition-colors duration-500 group-hover:scale-110 transform">
                        {sponsor.icon}
                      </div>
                    </div>

                    {/* Sponsor Info */}
                    <div className="relative z-10 flex flex-col items-center text-center w-full mt-2">
                      <h3 className="text-[#fef3c7] font-serif text-sm md:text-base tracking-[0.2em] uppercase font-semibold group-hover:text-[#fbbf24] transition-colors duration-300">
                        {sponsor.name}
                      </h3>
                      <p className="text-[10px] md:text-xs text-slate-400 tracking-[0.3em] uppercase mt-1">
                        PARTNER
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
            </div>
          ))}
        </div>

      </div>
    </MouseParallaxContainer>
  );
}

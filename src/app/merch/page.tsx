"use client";

import Image from "next/image";
import ProductCard from "@/components/merch/ProductCard";

const products = [
  {
    id: "odyssey-tee",
    name: "Odyssey Tee",
    subtitle: "Oversized Fit | Off-White",
    price: 799,
    image: "/merch/odyssey-tee.jpg",
  },
  {
    id: "nova-hoodie",
    name: "Nova Hoodie",
    subtitle: "Embroidered | Navy",
    price: 1299,
    image: "/merch/nova-hoodie.jpg",
  },
  {
    id: "star-map-tee",
    name: "Star Map Tee",
    subtitle: "Premium Fit | Black",
    price: 799,
    image: "/merch/star-map-tee.jpg",
  },
  {
    id: "orbit-cap",
    name: "Orbit Cap",
    subtitle: "Embroidered | Navy",
    price: 499,
    image: "/merch/orbit-cap.jpg",
  },
];

export default function MerchPage() {
  return (
    <div className="w-full flex flex-col min-h-screen bg-[#020712] overflow-x-hidden pt-32 pb-24 relative">
      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <Image
          src="/bg.png"
          alt="Space Background"
          fill
          priority
          unoptimized
          className="object-cover object-center opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#020712]/40 via-transparent to-[#020712]/90" />
      </div>

      <main className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl flex flex-col items-center">
        {/* Hero Section */}
        <div className="text-center mb-16 sm:mb-24 flex flex-col items-center animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-amber-300/80 text-xs sm:text-sm font-serif drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]">✦</span>
            <h2 className="text-xs sm:text-sm md:text-base font-bold tracking-[0.4em] sm:tracking-[0.5em] uppercase text-amber-200/90 font-serif filter drop-shadow-[0_0_10px_rgba(251,191,36,0.5)]">
              INNOVISION 2026, NIT ROURKELA
            </h2>
            <span className="text-amber-300/80 text-xs sm:text-sm font-serif drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]">✦</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-bold tracking-[0.1em] uppercase font-serif text-[#fef3c7] drop-shadow-[0_4px_20px_rgba(0,0,0,0.8)] mb-4">
            <span className="bg-[url('/celestial-text-bg-inverted.png')] bg-cover bg-center bg-clip-text text-transparent filter drop-shadow-[0_0_20px_rgba(251,191,36,0.4)]">
              COSMIC COLLECTION
            </span>
          </h1>

          <div className="flex items-center justify-center gap-12 sm:gap-24 mt-4 w-full max-w-3xl">
            <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#fbbf24]/15 to-transparent" />
            <p className="text-sm sm:text-base md:text-lg tracking-[0.4em] sm:tracking-[0.6em] text-slate-300 font-serif uppercase whitespace-nowrap">
              WEAR THE ODYSSEY
            </p>
            <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#fbbf24]/15 to-transparent" />
          </div>
        </div>

        {/* Product Grid */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-16">
          {products.map((product, index) => (
            <div 
              key={product.id} 
              className="animate-in fade-in slide-in-from-bottom-8 fill-mode-both h-full"
              style={{ animationDelay: `${index * 150}ms`, animationDuration: '800ms' }}
            >
              <ProductCard {...product} />
            </div>
          ))}
        </div>

        {/* Order Now Button */}
        <div className="animate-in fade-in slide-in-from-bottom-8 fill-mode-both w-full flex justify-center" style={{ animationDelay: '800ms', animationDuration: '800ms' }}>
          <button
            onClick={() => { /* Redirect to form to be implemented later */ }}
            className="group relative inline-flex items-center justify-center p-1 sm:p-1.5 rounded-full bg-[#020712]/80 border border-[#fbbf24]/30 backdrop-blur-2xl shadow-[0_12px_35px_rgba(0,0,0,0.9)] hover:border-[#fbbf24]/60 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:scale-105 active:scale-95 cursor-pointer w-full max-w-md"
          >
            {/* Double-Bezel Inner Core */}
            <div className="relative flex items-center justify-center gap-3.5 sm:gap-4.5 rounded-full px-7 sm:px-9 py-4 sm:py-5 bg-[#03091e]/90 border border-[#fbbf24]/20 shadow-[inset_0_1px_2px_rgba(255,255,255,0.2)] overflow-hidden w-full">
              {/* Celestial Constellation Texture Overlay */}
              <div className="absolute inset-0 bg-[url('/celestial-text-bg.png')] bg-cover bg-center opacity-20 mix-blend-screen pointer-events-none group-hover:opacity-35 transition-opacity duration-500" />

              {/* Micro Glint Sweep Effect on Hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />

              {/* Text Label */}
              <div className="relative z-10 flex items-center gap-2">
                <span className="text-[10px] text-[#fbbf24] font-serif drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]">✦</span>
                <span className="text-lg sm:text-xl md:text-2xl font-black tracking-[0.25em] uppercase text-[#fef3c7] font-serif filter drop-shadow-[0_0_10px_rgba(251,191,36,0.5)]">
                  ORDER NOW
                </span>
                <span className="text-[10px] text-[#fbbf24] font-serif drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]">✦</span>
              </div>
            </div>
          </button>
        </div>
      </main>
    </div>
  );
}

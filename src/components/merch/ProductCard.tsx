"use client";

import Image from "next/image";

interface ProductCardProps {
  id: string;
  name: string;
  subtitle: string;
  price: number;
  image: string;
}

export default function ProductCard({ name, subtitle, price, image }: ProductCardProps) {
  return (
    <div className="group relative flex flex-col justify-between items-center rounded-2xl p-6 transition-all duration-500 hover:-translate-y-2 h-full">
      {/* Dark Cosmic Background & Gold Border */}
      <div className="absolute inset-0 rounded-2xl border border-[#fbbf24]/30 bg-[#020712]/80 backdrop-blur-md shadow-[0_0_15px_rgba(251,191,36,0.1)] transition-all duration-500 group-hover:border-[#fbbf24]/70 group-hover:shadow-[0_0_30px_rgba(251,191,36,0.25)] group-hover:bg-[#03091e]/90 overflow-hidden">
        {/* Subtle Constellation Decoration */}
        <div className="absolute inset-0 bg-[url('/celestial-text-bg.png')] bg-cover bg-center opacity-10 mix-blend-screen pointer-events-none group-hover:opacity-30 transition-opacity duration-500" />
        
        {/* Corner Accents */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-[#fbbf24]/50 rounded-tl-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-[#fbbf24]/50 rounded-tr-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-[#fbbf24]/50 rounded-bl-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-[#fbbf24]/50 rounded-br-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>

      {/* Product Image */}
      <div className="relative z-10 w-full aspect-square mb-6 rounded-xl overflow-hidden bg-black/40 border border-white/5 shadow-inner">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />
      </div>

      {/* Product Info */}
      <div className="relative z-10 flex flex-col items-center text-center w-full space-y-1 mb-2">
        <h3 className="text-[#fef3c7] font-serif text-lg tracking-[0.2em] uppercase font-semibold">
          {name}
        </h3>
        <p className="text-xs text-slate-400 tracking-[0.3em] uppercase">
          {subtitle}
        </p>
        <p className="text-[#fbbf24] font-serif text-xl tracking-wider pt-2">
          ₹ {price}
        </p>
      </div>
    </div>
  );
}

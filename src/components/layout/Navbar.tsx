"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Volume2, VolumeX } from "lucide-react";

interface NavbarProps {
  isPlaying?: boolean;
  onToggleAudio?: () => void;
}

export default function Navbar({ isPlaying = false, onToggleAudio }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Events", href: "/events" },
    { name: "Gallery", href: "/gallery" },
    { name: "Merch", href: "/#Merch" },
    { name: "Profile", href: "/profile" },
    { name: "Login", href: "/login" },
  ];

  return (
    <header className="fixed top-5 left-0 right-0 z-50 flex justify-center px-4 pointer-events-auto">
      <nav className="relative w-full max-w-4xl flex items-center justify-between px-6 sm:px-8 py-3 rounded-full backdrop-blur-xl bg-[#020712]/65 border border-[#fbbf24]/25 shadow-[0_10px_35px_rgba(0,0,0,0.7),0_0_15px_rgba(251,191,36,0.1)] transition-all duration-300 hover:border-[#fbbf24]/45 hover:shadow-[0_10px_40px_rgba(0,0,0,0.8),0_0_25px_rgba(251,191,36,0.2)]">
        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-8 lg:gap-10 mx-auto">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="relative text-xs font-semibold tracking-[0.25em] uppercase text-[#e2e8f0] transition-all duration-300 hover:text-[#fbbf24] hover:drop-shadow-[0_0_10px_rgba(251,191,36,0.65)] group py-1.5 font-serif"
            >
              {link.name}
              {/* Gold Glint Underline */}
              <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-gradient-to-r from-[#fbbf24] to-[#2dd4bf] transition-all duration-300 group-hover:w-full rounded-full shadow-[0_0_8px_#fbbf24]" />
            </Link>
          ))}
        </div>

        {/* Audio Toggle Button (Desktop & Mobile) */}
        {onToggleAudio && (
          <button
            onClick={onToggleAudio}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#fbbf24]/30 bg-[#fbbf24]/10 hover:bg-[#fbbf24]/20 text-[#fbbf24] transition-all duration-300 shadow-[0_0_15px_rgba(245,158,11,0.2)] hover:shadow-[0_0_25px_rgba(245,158,11,0.4)] cursor-pointer"
            title={isPlaying ? "Mute Background Music" : "Play Background Music"}
            aria-label="Toggle Music"
          >
            {isPlaying ? (
              <>
                <Volume2 className="w-4 h-4 text-[#fbbf24]" />
                <span className="flex gap-0.5 items-end h-3">
                  <span className="w-0.5 h-3 bg-[#fbbf24] animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-0.5 h-2 bg-[#2dd4bf] animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-0.5 h-3.5 bg-[#fbbf24] animate-bounce" style={{ animationDelay: "300ms" }} />
                </span>
              </>
            ) : (
              <>
                <VolumeX className="w-4 h-4 text-slate-400" />
                <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 hidden sm:inline">
                  Muted
                </span>
              </>
            )}
          </button>
        )}

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden flex items-center justify-center p-2 rounded-full text-[#fbbf24] hover:bg-white/10 transition-colors ml-2"
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed top-20 left-4 right-4 rounded-2xl backdrop-blur-2xl bg-[#020712]/90 border border-[#fbbf24]/30 shadow-[0_15px_40px_rgba(0,0,0,0.8)] p-6 flex flex-col gap-4 animate-in fade-in slide-in-from-top-4 duration-300">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-medium tracking-wider text-[#e5e7eb] hover:text-[#fbbf24] transition-colors py-2 border-b border-white/5"
            >
              {link.name}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}

'use client';

import Link from "next/link";
import Image from "next/image";

// Inline SVGs for social icons to avoid lucide-react export issues
const InstagramIcon = ({ className, strokeWidth = 1.5 }: { className?: string, strokeWidth?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

const LinkedinIcon = ({ className, strokeWidth = 1.5 }: { className?: string, strokeWidth?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect width="4" height="12" x="2" y="9"/>
    <circle cx="4" cy="4" r="2"/>
  </svg>
);

const YoutubeIcon = ({ className, strokeWidth = 1.5 }: { className?: string, strokeWidth?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/>
    <path d="m10 15 5-3-5-3z"/>
  </svg>
);

const MailIcon = ({ className, strokeWidth = 1.5 }: { className?: string, strokeWidth?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="20" height="16" x="2" y="4" rx="2"/>
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
  </svg>
);

const MapPinIcon = ({ className, strokeWidth = 1.5 }: { className?: string, strokeWidth?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
);

export default function Footer() {
  return (
    <footer className="relative w-full z-40 px-2 sm:px-4 md:px-8 pb-6 pt-16 mt-auto flex justify-center overflow-hidden">
      {/* Decorative cosmic background glow for the footer area */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#020712] via-[#030c18]/30 to-transparent" />
      
      {/* Glassmorphism Panel */}
      <div className="relative w-full max-w-[1800px] rounded-[32px] bg-[#030c18]/30 backdrop-blur-xl border-[1.5px] border-[#c8a046]/40 shadow-[0_0_30px_rgba(200,160,70,0.05),inset_0_0_20px_rgba(200,160,70,0.05)] px-6 py-8 md:px-12 lg:px-16 lg:py-10 overflow-hidden flex flex-col gap-10">
        
        {/* Subtle Constellation/Globe Decorations inside the panel */}
        <div className="absolute top-0 right-0 w-[40%] h-full opacity-[0.15] pointer-events-none select-none overflow-hidden">
          {/* Globe wireframe */}
          <svg viewBox="0 0 100 100" className="absolute right-[-5%] top-1/2 -translate-y-1/2 w-[400px] h-[400px] stroke-[#c8a046] fill-none" strokeWidth="0.2">
            <circle cx="50" cy="50" r="48" />
            <ellipse cx="50" cy="50" rx="18" ry="48" />
            <ellipse cx="50" cy="50" rx="32" ry="48" />
            <ellipse cx="50" cy="50" rx="48" ry="18" />
            <ellipse cx="50" cy="50" rx="48" ry="32" />
            <path d="M2 50 L98 50 M50 2 L50 98" />
          </svg>
        </div>

        {/* Top Area: 4 Columns */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          
          {/* Column 1: Brand */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center text-center -mt-6 lg:-mt-10">
            <div className="relative w-full max-w-[750px] h-[190px] -mb-10 sm:-mb-12">
              <Image 
                src="/innovision_transparent.png" 
                alt="INNOVISION" 
                fill 
                className="object-contain object-center drop-shadow-[0_0_15px_rgba(251,191,36,0.35)]"
              />
            </div>
            <div className="flex items-center justify-center gap-4 mb-5 relative z-10">
              <span className="text-amber-300 text-[10px]">✦</span>
              <span className="text-amber-100/90 text-[13px] tracking-[0.45em] font-serif uppercase">NIT ROURKELA</span>
              <span className="text-amber-300 text-[10px]">✦</span>
            </div>
            
            {/* Celestial Divider */}
            <div className="w-full max-w-[360px] h-[1.5px] bg-gradient-to-r from-transparent via-[#c8a046]/60 to-transparent mb-4" />

            <p className="text-amber-50/80 text-[13px] font-serif tracking-[0.15em]">
              Where Ideas Transcend Boundaries.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="lg:col-span-2 flex flex-col items-center">
            <div className="flex flex-col items-center mb-6">
              <h3 className="text-amber-100 font-serif tracking-[0.35em] uppercase text-[13px] mb-3">Quick Links</h3>
              <div className="flex items-center gap-3 w-full justify-center">
                <div className="w-12 h-[1.5px] bg-gradient-to-r from-transparent to-[#c8a046]/60" />
                <span className="text-amber-400 text-[11px]">✦</span>
                <div className="w-12 h-[1.5px] bg-gradient-to-l from-transparent to-[#c8a046]/60" />
              </div>
            </div>
            
            <nav className="flex flex-col gap-4 text-center items-center">
              {['Home', 'About', 'Events', 'Gallery', 'Merch'].map((link) => (
                <Link 
                  key={link} 
                  href={`/${link.toLowerCase() === 'home' ? '' : link.toLowerCase()}`}
                  className="group relative text-amber-50/80 hover:text-amber-200 transition-colors duration-300 text-[11px] font-serif uppercase tracking-[0.3em] flex items-center justify-center gap-2 w-max"
                >
                  <span className="opacity-0 group-hover:opacity-100 text-amber-400 text-[8px] transition-opacity duration-300 absolute -left-6">✦</span>
                  <span className="group-hover:text-amber-300 transition-colors duration-300">{link}</span>
                </Link>
              ))}
            </nav>
          </div>

          {/* Column 3: Connect */}
          <div className="lg:col-span-3 flex flex-col items-center text-center">
            <div className="flex flex-col items-center mb-6">
              <h3 className="text-amber-100 font-serif tracking-[0.35em] uppercase text-[13px] mb-3">Connect</h3>
              <div className="flex items-center gap-3 w-full justify-center">
                <div className="w-12 h-[1.5px] bg-gradient-to-r from-transparent to-[#c8a046]/60" />
                <span className="text-amber-400 text-[11px]">✦</span>
                <div className="w-12 h-[1.5px] bg-gradient-to-l from-transparent to-[#c8a046]/60" />
              </div>
            </div>
            
            <div className="flex gap-5 mb-8">
              {[
                { icon: InstagramIcon, href: '#' },
                { icon: LinkedinIcon, href: '#' },
                { icon: YoutubeIcon, href: '#' },
                { icon: MailIcon, href: 'mailto:innovision@nitrkl.ac.in' },
              ].map((Social, idx) => (
                <a 
                  key={idx}
                  href={Social.href}
                  className="w-10 h-10 rounded-full border border-[#c8a046]/40 flex items-center justify-center text-amber-50/80 hover:text-amber-300 hover:border-amber-300 hover:bg-amber-400/10 hover:-translate-y-1 transition-all duration-300 hover:shadow-[0_0_15px_rgba(251,191,36,0.2)] group relative"
                >
                  <Social.icon className="w-[16px] h-[16px] group-hover:scale-110 transition-transform duration-300" strokeWidth={1.5} />
                </a>
              ))}
            </div>

            <div className="w-[1px] h-8 bg-gradient-to-b from-[#c8a046]/40 to-transparent mb-5 opacity-50 hidden lg:block" />

            <div className="flex flex-col gap-1 text-[10px] tracking-[0.45em] text-amber-50/80 uppercase font-serif">
              <span>Stay Curious</span>
              <span>Stay Connected</span>
            </div>
            <div className="mt-1 text-amber-400 text-[8px]">✦</div>
          </div>

          {/* Column 4: Event Info */}
          <div className="lg:col-span-3 flex flex-col items-center lg:items-end lg:pr-4">
            <div className="flex flex-col items-center mb-6">
              <h3 className="text-amber-100 font-serif tracking-[0.35em] uppercase text-[13px] mb-3">Event Info</h3>
              <div className="flex items-center gap-3 w-full justify-center">
                <div className="w-12 h-[1.5px] bg-gradient-to-r from-transparent to-[#c8a046]/60" />
                <span className="text-amber-400 text-[11px]">✦</span>
                <div className="w-12 h-[1.5px] bg-gradient-to-l from-transparent to-[#c8a046]/60" />
              </div>
            </div>
            
            <div className="flex flex-col gap-6 w-max mx-auto lg:mr-0 lg:ml-auto">
              <div className="flex items-start gap-4">
                <MapPinIcon className="w-5 h-5 text-[#c8a046] shrink-0 mt-0.5" strokeWidth={1.5} />
                <div className="flex flex-col gap-2 text-xs text-amber-50/80 tracking-[0.15em] leading-relaxed text-left">
                  <span className="font-serif uppercase tracking-[0.25em] text-amber-100">INNOVISION 2026</span>
                  <span className="tracking-[0.2em]">NIT ROURKELA</span>
                  <span className="text-amber-50/60 lowercase tracking-[0.1em]" style={{fontVariant: 'small-caps'}}>Rourkela, Odisha, India</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <MailIcon className="w-5 h-5 text-[#c8a046] shrink-0" strokeWidth={1.5} />
                <a href="mailto:innovision@nitrkl.ac.in" className="text-xs text-amber-50/80 tracking-[0.15em] hover:text-amber-300 transition-colors text-left">
                  innovision@nitrkl.ac.in
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Section Divider */}
        <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#c8a046]/30 to-transparent mt-0 mb-0" />

        {/* Bottom Bar */}
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-5 md:gap-0 px-2 lg:px-4">
          <div className="text-[10px] sm:text-[11px] text-amber-50/70 tracking-[0.3em] uppercase font-serif">
            © 2026 INNOVISION — NIT ROURKELA
          </div>
          
          {/* Moon Phases */}
          <div className="flex items-center gap-5 text-amber-100/50">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="opacity-50 -scale-x-100"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c1.06 0 2.08-.16 3.03-.46C10.74 20.35 7.5 16.53 7.5 12s3.24-8.35 7.53-9.54C14.08 2.16 13.06 2 12 2z"/></svg>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="opacity-70"><path d="M12 2v20c5.52 0 10-4.48 10-10S17.52 2 12 2z"/></svg>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-amber-300 drop-shadow-[0_0_12px_rgba(251,191,36,0.8)]"><circle cx="12" cy="12" r="10"/></svg>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="opacity-70 -scale-x-100"><path d="M12 2v20c5.52 0 10-4.48 10-10S17.52 2 12 2z"/></svg>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="opacity-50"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c1.06 0 2.08-.16 3.03-.46C10.74 20.35 7.5 16.53 7.5 12s3.24-8.35 7.53-9.54C14.08 2.16 13.06 2 12 2z"/></svg>
          </div>

          <div className="flex items-center gap-1.5 text-[12px] sm:text-[13px] text-amber-50/80 tracking-[0.1em] font-serif">
            Crafted with <span className="text-red-500 text-[16px] mx-0.5 leading-none mt-0.5 animate-pulse">♥</span> by OpenCode NIT Rourkela
          </div>
        </div>
      </div>
    </footer>
  );
}

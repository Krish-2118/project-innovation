"use client";

import { useEffect, useRef, useState, createContext } from "react";
import Navbar from "@/components/layout/Navbar";
import PaintSplatterIntro from "@/components/intro/PaintSplatterIntro";
import { RocketTransitionProvider } from "@/components/transition/RocketTransitionContext";
import Footer from "@/components/layout/Footer";
import { usePathname } from "next/navigation";

export const AudioContext = createContext({
  isPlaying: false,
  toggleAudio: () => {},
});

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isSubpage = pathname !== "/";

  // Global Ink-Mask & Preloader states - subpages skip preloader immediately
  const [showPreloader, setShowPreloader] = useState(!isSubpage);
  const [isActive, setIsActive] = useState(isSubpage);
  const [removeGif, setRemoveGif] = useState(isSubpage);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Synchronize state on pathname changes so navigation works instantly without refresh
  useEffect(() => {
    if (pathname !== "/") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShowPreloader(false);
      setIsActive(true);
      setRemoveGif(true);
      if (wrapperRef.current) {
        wrapperRef.current.style.maskImage = "none";
        wrapperRef.current.style.webkitMaskImage = "none";
      }
      document.body.style.position = "static";
      document.body.style.overflow = "auto";
    } else {
      try {
        const entered = sessionStorage.getItem("innovision_entered");
        if (entered === "true") {
           
          setShowPreloader(false);
          setIsActive(true);
          setRemoveGif(true);
          if (wrapperRef.current) {
            wrapperRef.current.style.maskImage = "none";
            wrapperRef.current.style.webkitMaskImage = "none";
          }
          document.body.style.position = "static";
          document.body.style.overflow = "auto";
        }
      } catch {
        // Ignore sessionStorage restrictions if private browsing
      }
    }
  }, [pathname]);

  // Global Audio Controller (Kawai Kitsune)
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const audio = new Audio("/kawaii-kitsune-kevin-macleod-main-version-7984-04-02.mp3");
    audio.preload = "none";
    audio.loop = true;
    audio.volume = 0.5;
    audioRef.current = audio;

    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  useEffect(() => {
    // If the user already saw the intro this session, skip it even on the root page
    if (!isSubpage && sessionStorage.getItem("intro_seen") === "true") {
      setTimeout(() => {
        setShowPreloader(false);
        setIsActive(true);
        setRemoveGif(true);
      }, 0);
    }
  }, [isSubpage]);

  const handleStart = () => {
    try {
      sessionStorage.setItem("innovision_entered", "true");
    } catch {
      // Ignore
    }
    setIsActive(true);
    setShowPreloader(false);
    sessionStorage.setItem("intro_seen", "true");
  };

  // 1. Timing mask removal: wait 3s after isActive becomes true
  useEffect(() => {
    if (isActive && !removeGif) {
      const timer = setTimeout(() => setRemoveGif(true), 3000);
      return () => clearTimeout(timer);
    }
  }, [isActive, removeGif]);

  // 2. Applying/clearing mask on the wrapper node & scroll lock
  useEffect(() => {
    if (pathname !== "/" || removeGif) {
      if (wrapperRef.current) {
        wrapperRef.current.style.maskImage = "none";
        wrapperRef.current.style.webkitMaskImage = "none";
      }
      document.body.style.position = "static";
      document.body.style.overflow = "auto";
      return;
    }

    if (pathname === "/" && isActive && !removeGif && wrapperRef.current) {
      wrapperRef.current.style.maskImage = "";
      wrapperRef.current.style.webkitMaskImage = "";
      document.body.style.position = "fixed";
      document.body.style.overflow = "hidden";
    }
  }, [removeGif, isActive, pathname]);

  // 3. Play audio on loop after intro reveal completes
  useEffect(() => {
    if (removeGif && audioRef.current) {
      // Check localStorage for user preference. Default is 'muted' (off)
      const savedPreference = localStorage.getItem("innovision_audio");
      if (savedPreference === "playing") {
        audioRef.current
          .play()
          .then(() => setIsPlaying(true))
          .catch((err) => console.log("Autoplay audio waiting for user gesture:", err));
      }
    }
  }, [removeGif]);

  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      localStorage.setItem("innovision_audio", "muted");
    } else {
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
          localStorage.setItem("innovision_audio", "playing");
        })
        .catch(console.error);
    }
  };

  return (
    <AudioContext.Provider value={{ isPlaying, toggleAudio }}>
      <RocketTransitionProvider>
        {showPreloader && (
          <PaintSplatterIntro onStart={handleStart} showPreloader={showPreloader} />
        )}

        <div
          ref={wrapperRef}
          // Lets page entrance animations wait until the intro has handed over.
          data-revealed={isActive ? "true" : "false"}
          className={`relative min-h-screen w-full bg-[#020712] transition-opacity duration-300 ${
            !isActive
              ? "opacity-0 pointer-events-none"
              : !removeGif
              ? "ink-mask opacity-100"
              : "opacity-100"
          }`}
        >
          {/* Global Persistent Navbar */}
          <Navbar isPlaying={isPlaying} onToggleAudio={toggleAudio} />

          {/* Page Content */}
          {children}

          {/* Global Footer */}
          <Footer />
        </div>
      </RocketTransitionProvider>
    </AudioContext.Provider>
  );
}


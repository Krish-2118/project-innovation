"use client";

import { useEffect, useRef, useState, createContext } from "react";
import Navbar from "@/components/layout/Navbar";
import PaintSplatterIntro from "@/components/intro/PaintSplatterIntro";
import { RocketTransitionProvider } from "@/components/transition/RocketTransitionContext";

export const AudioContext = createContext({
  isPlaying: false,
  toggleAudio: () => {},
});

export default function AppShell({ children }: { children: React.ReactNode }) {
  // Global Ink-Mask & Preloader states
  const [showPreloader, setShowPreloader] = useState(true);
  const [isActive, setIsActive] = useState(false);
  const [removeGif, setRemoveGif] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Global Audio Controller (Kawai Kitsune)
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const audio = new Audio("/kawaii-kitsune-kevin-macleod-main-version-7984-04-02.mp3");
    audio.loop = true;
    audio.volume = 0.5;
    audioRef.current = audio;

    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  const handleStart = () => {
    setIsActive(true);
    setShowPreloader(false);
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
    if (removeGif && wrapperRef.current) {
      wrapperRef.current.style.maskImage = "none";
      wrapperRef.current.style.webkitMaskImage = "none";
      document.body.style.position = "static";
      document.body.style.overflow = "auto";
    }
    if (isActive && !removeGif && wrapperRef.current) {
      wrapperRef.current.style.maskImage = "";
      wrapperRef.current.style.webkitMaskImage = "";
      document.body.style.position = "fixed";
      document.body.style.overflow = "hidden";
    }
  }, [removeGif, isActive]);

  // 3. Play audio on loop after intro reveal completes
  useEffect(() => {
    if (removeGif && audioRef.current) {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => console.log("Autoplay audio waiting for user gesture:", err));
    }
  }, [removeGif]);

  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(console.error);
    }
  };

  return (
    <AudioContext.Provider value={{ isPlaying, toggleAudio }}>
      <RocketTransitionProvider>
        <PaintSplatterIntro onStart={handleStart} showPreloader={showPreloader} />

        <div
          ref={wrapperRef}
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
        </div>
      </RocketTransitionProvider>
    </AudioContext.Provider>
  );
}


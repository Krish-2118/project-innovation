"use client";

import React, { createContext, useContext, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import RocketLaunchCanvas from "./RocketLaunchCanvas";

interface RocketTransitionContextType {
  triggerLaunch: (targetPath?: string) => void;
  isLaunching: boolean;
}

const RocketTransitionContext = createContext<RocketTransitionContextType>({
  triggerLaunch: () => {},
  isLaunching: false,
});

export const useRocketTransition = () => useContext(RocketTransitionContext);

export function RocketTransitionProvider({ children }: { children: React.ReactNode }) {
  const [isLaunching, setIsLaunching] = useState(false);
  const [whiteCover, setWhiteCover] = useState(false);
  const router = useRouter();
  const targetPathRef = useRef<string>("/register");

  const triggerLaunch = useCallback((targetPath: string = "/register") => {
    // ROCKET ANIMATION STANDBY MODE
    // Set ENABLE_ROCKET_ANIMATION to true to re-enable the full 3D rocket launch transition.
    const ENABLE_ROCKET_ANIMATION = false;

    if (!ENABLE_ROCKET_ANIMATION) {
      router.push(targetPath);
      return;
    }

    if (isLaunching) return;
    targetPathRef.current = targetPath;
    setWhiteCover(false);
    setIsLaunching(true);
  }, [isLaunching, router]);

  const handleRocketExit = useCallback(() => {
    // 1. Activate soft atmospheric white transition ONLY when rocket has completely traversed past top of screen
    setWhiteCover(true);

    // 2. Navigate to /register after rocket exits
    setTimeout(() => {
      router.push(targetPathRef.current);
    }, 200);

    // 3. Smoothly fade out white transition on new screen
    setTimeout(() => {
      setWhiteCover(false);
    }, 900);

    // 4. Cleanup launch state
    setTimeout(() => {
      setIsLaunching(false);
    }, 1400);
  }, [router]);

  return (
    <RocketTransitionContext.Provider value={{ triggerLaunch, isLaunching }}>
      {children}
      
      {/* Three.js Rocket Launch Canvas using Rocket.fbx */}
      {isLaunching && <RocketLaunchCanvas onRocketExit={handleRocketExit} />}

      {/* Atmospheric Soft White Screen Wipe Overlay (Reduced extreme glare) */}
      <div
        className={`fixed inset-0 z-[999999] bg-[#020712] pointer-events-none transition-opacity duration-500 ease-in-out ${
          whiteCover ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="absolute inset-0 bg-white/85 backdrop-blur-lg" />
      </div>
    </RocketTransitionContext.Provider>
  );
}



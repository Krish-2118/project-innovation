"use client";

import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Mesh, MathUtils, Texture } from "three";
import { Stars, useTexture } from "@react-three/drei";

interface PlanetProps {
  texture: Texture;
  index: number;
  currentIndex: number;
  total: number;
}

function Planet({ texture, index, currentIndex, total }: PlanetProps) {
  const meshRef = useRef<Mesh>(null);

  // Calculate relative position with wrapping for infinite carousel effect
  let diff = index - currentIndex;
  if (diff > total / 2) diff -= total;
  if (diff < -total / 2) diff += total;

  useFrame(() => {
    if (!meshRef.current) return;
    
    const angle = diff * (2 * Math.PI / total);
    const radius = 16;
    const targetX = Math.sin(angle) * radius;
    const targetZ = Math.cos(angle) * radius - radius;
    let targetY = -1;
    let targetScale = 0.6;
    
    if (diff === 0) {
      targetY = -5.8;
      targetScale = 1.2;
    }

    meshRef.current.position.x = MathUtils.lerp(meshRef.current.position.x, targetX, 0.04);
    meshRef.current.position.y = MathUtils.lerp(meshRef.current.position.y, targetY, 0.04);
    meshRef.current.position.z = MathUtils.lerp(meshRef.current.position.z, targetZ, 0.04);
    
    const scale = MathUtils.lerp(meshRef.current.scale.x, targetScale, 0.04);
    meshRef.current.scale.set(scale, scale, scale);

    meshRef.current.rotation.y += 0.001;
  });

  return (
    <mesh ref={meshRef} rotation={[0.3, 0, 0]}>
      <sphereGeometry args={[4, 64, 64]} />
      <meshStandardMaterial 
        map={texture} 
        roughness={0.7}
        metalness={0.1}
      />
    </mesh>
  );
}

interface SceneProps {
  textures: string[];
  currentIndex: number;
}

function Scene({ textures, currentIndex }: SceneProps) {
  const loadedTextures = useTexture(textures);

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 5, 5]} intensity={3.0} />
      <directionalLight position={[-10, -5, -5]} intensity={0.8} color="#6688ff" />
      
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

      {loadedTextures.map((texture, index) => (
        <Planet 
          key={index} 
          texture={texture} 
          index={index} 
          currentIndex={currentIndex} 
          total={textures.length} 
        />
      ))}
    </>
  );
}

export default function EventGlobe({ textures, currentIndex, className = "w-full h-full" }: SceneProps & { className?: string }) {
  return (
    <div className={className}>
      <Canvas camera={{ position: [0, 0, 8.5], fov: 45 }}>
        <React.Suspense fallback={null}>
          <Scene textures={textures} currentIndex={currentIndex} />
        </React.Suspense>
      </Canvas>
    </div>
  );
}

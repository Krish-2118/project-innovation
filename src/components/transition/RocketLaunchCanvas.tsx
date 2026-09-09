"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

interface RocketLaunchCanvasProps {
  onRocketExit: () => void;
}

export default function RocketLaunchCanvas({ onRocketExit }: RocketLaunchCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const exitCalledRef = useRef(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let width = window.innerWidth;
    let height = window.innerHeight;

    // 1. Three.js Scene & Camera Setup (Optimized WebGL Renderer)
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 100);
    camera.position.set(0, 0, 10);

    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(width, height);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    // 2. Rocket Group Container
    const rocketGroup = new THREE.Group();
    rocketGroup.position.set(0, -15, 0);
    rocketGroup.renderOrder = 500;
    scene.add(rocketGroup);

    const textureLoader = new THREE.TextureLoader();

    // 3. Load ROCKET.png 2.5D Layer Texture
    textureLoader.load("/ROCKET.png", (texture) => {
      texture.colorSpace = THREE.SRGBColorSpace;
      const planeWidth = 2.5;
      const planeHeight = planeWidth / 0.47717;

      const rocketGeo = new THREE.PlaneGeometry(planeWidth, planeHeight);
      const rocketMat = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        depthWrite: false,
        alphaTest: 0.05,
      });

      const rocketMesh = new THREE.Mesh(rocketGeo, rocketMat);
      rocketMesh.renderOrder = 500;
      rocketGroup.add(rocketMesh);
    });

    // 4. Dynamic Thruster Flame Cone at Tail Base
    const flameGeo = new THREE.ConeGeometry(0.4, 2.5, 12);
    const flameMat = new THREE.MeshBasicMaterial({
      color: 0xff8800,
      transparent: true,
      opacity: 0.95,
      depthWrite: false,
    });
    const flameMesh = new THREE.Mesh(flameGeo, flameMat);
    flameMesh.rotation.x = Math.PI;
    flameMesh.position.y = -2.6;
    flameMesh.renderOrder = 490;
    rocketGroup.add(flameMesh);

    // 5. Large Screen-Covering Cloud Pool (40 Particles with Large Expansion)
    const smokeGeo = new THREE.PlaneGeometry(6.0, 6.0);
    const smokeMat = new THREE.MeshBasicMaterial({
      transparent: true,
      opacity: 0.75,
      depthWrite: false,
      alphaTest: 0.05,
    });

    let cloudTexLoaded = false;
    textureLoader.load("/cloud.png", (cloudTex) => {
      cloudTex.colorSpace = THREE.SRGBColorSpace;
      smokeMat.map = cloudTex;
      smokeMat.needsUpdate = true;
      cloudTexLoaded = true;
    });

    interface SmokeParticle {
      mesh: THREE.Mesh;
      scaleSpeed: number;
      growth: number;
      vy: number;
      opacity: number;
      active: boolean;
    }

    const maxParticles = 40;
    const smokePool: SmokeParticle[] = [];

    for (let i = 0; i < maxParticles; i++) {
      const mesh = new THREE.Mesh(smokeGeo, smokeMat);
      mesh.renderOrder = 10;
      mesh.visible = false;
      scene.add(mesh);
      smokePool.push({
        mesh,
        scaleSpeed: 0.2,
        growth: 1.0,
        vy: -0.15,
        opacity: 0,
        active: false,
      });
    }

    const spawnParticleFromPool = (tailY: number) => {
      if (!cloudTexLoaded) return;
      const inactive = smokePool.find((p) => !p.active);
      if (!inactive) return;

      inactive.active = true;
      inactive.growth = 1.0;
      inactive.opacity = 0.8;
      inactive.scaleSpeed = Math.random() * 0.18 + 0.15;
      inactive.vy = -Math.random() * 0.15 - 0.05;

      const offsetX = (Math.random() - 0.5) * 1.5;
      inactive.mesh.position.set(
        rocketGroup.position.x + offsetX,
        tailY,
        rocketGroup.position.z + (Math.random() - 0.5) * 2.0
      );
      inactive.mesh.rotation.z = Math.random() * Math.PI * 2;
      inactive.mesh.scale.set(1, 1, 1);
      inactive.mesh.visible = true;
    };

    // 6. Fast Rocket Ascent Physics & Animation Loop
    let animationFrameId: number;
    let velocityY = 0.16;
    const accelerationY = 0.035;
    let frameCount = 0;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      frameCount++;

      // Rocket Ascent Physics
      velocityY += accelerationY;
      rocketGroup.position.y += velocityY;

      // Pulse Flame Scale
      const flamePulse = 1 + (frameCount % 4) * 0.08;
      flameMesh.scale.set(flamePulse, flamePulse * 1.2, flamePulse);

      // Spawn dense expanding cloud particles behind rocket tail
      if (frameCount % 2 === 0) {
        const tailY = rocketGroup.position.y - 4.2;
        spawnParticleFromPool(tailY);
        spawnParticleFromPool(tailY - 1.0);
      }

      // Update & Expand Smoke Pool Particles to Cover Entire Screen
      for (let i = 0; i < maxParticles; i++) {
        const p = smokePool[i];
        if (!p.active) continue;

        p.growth += p.scaleSpeed;
        p.mesh.scale.set(p.growth, p.growth, 1);
        p.mesh.position.y += p.vy;

        p.opacity -= 0.008;
        if (p.opacity <= 0 || p.growth > 8.0) {
          p.active = false;
          p.mesh.visible = false;
        }
      }

      // Trigger navigation when ROCKET.png has COMPLETELY traversed past top of screen
      if (rocketGroup.position.y > 17.0 && !exitCalledRef.current) {
        exitCalledRef.current = true;
        onRocketExit();
      }

      renderer.render(scene, camera);
    };

    animate();

    // 7. Cleanup & Resize Observer
    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [onRocketExit]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[99999] pointer-events-none select-none overflow-hidden"
    />
  );
}

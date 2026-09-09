"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

interface PlanetsCanvasProps {
  mouseX?: number;
  mouseY?: number;
}

export default function PlanetsCanvas({ mouseX = 0, mouseY = 0 }: PlanetsCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: mouseX, y: mouseY });

  useEffect(() => {
    mouseRef.current.x = mouseX;
    mouseRef.current.y = mouseY;
  }, [mouseX, mouseY]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Setup Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 10;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    container.appendChild(renderer.domElement);

    // 2. Rich Lighting Setup
    const ambientLight = new THREE.AmbientLight(0x0f3b4a, 2.0);
    scene.add(ambientLight);

    const mainSunLight = new THREE.DirectionalLight(0xfbbf24, 4.2);
    mainSunLight.position.set(12, 12, 10);
    scene.add(mainSunLight);

    const cyanRimLight = new THREE.PointLight(0x2dd4bf, 5, 40);
    cyanRimLight.position.set(-10, 6, 6);
    scene.add(cyanRimLight);

    const warmFillLight = new THREE.PointLight(0xf59e0b, 3, 30);
    warmFillLight.position.set(6, -8, 5);
    scene.add(warmFillLight);

    // 3. Texture Loading
    const textureLoader = new THREE.TextureLoader();

    const tealTexture = textureLoader.load("/textures/teal-planet.png");
    tealTexture.colorSpace = THREE.SRGBColorSpace;
    tealTexture.wrapS = THREE.RepeatWrapping;
    tealTexture.wrapT = THREE.ClampToEdgeWrapping;

    const goldTexture = textureLoader.load("/textures/gold-planet.png");
    goldTexture.colorSpace = THREE.SRGBColorSpace;

    // 4. Create Planet 1: Top-Right Artistic Teal Celestial Sphere
    const tealGeo = new THREE.SphereGeometry(1.75, 64, 64);
    const tealMat = new THREE.MeshStandardMaterial({
      map: tealTexture,
      bumpMap: tealTexture,
      bumpScale: 0.04,
      roughness: 0.32,
      metalness: 0.35,
      emissive: 0x064e3b,
      emissiveIntensity: 0.25,
    });
    const tealPlanet = new THREE.Mesh(tealGeo, tealMat);

    const planet1Group = new THREE.Group();
    planet1Group.position.set(4.2, 2.5, -0.5);
    planet1Group.add(tealPlanet);

    // Atmosphere Glow Halo for Teal Planet
    const glowGeo = new THREE.SphereGeometry(1.88, 32, 32);
    const glowMat = new THREE.MeshBasicMaterial({
      color: 0x2dd4bf,
      transparent: true,
      opacity: 0.22,
      side: THREE.BackSide,
    });
    const tealGlow = new THREE.Mesh(glowGeo, glowMat);
    planet1Group.add(tealGlow);
    scene.add(planet1Group);

    // 5. Create Planet 2: Bottom-Left Golden Astrolabe Sphere & Rings
    const goldGeo = new THREE.SphereGeometry(1.4, 64, 64);
    const goldMat = new THREE.MeshStandardMaterial({
      map: goldTexture,
      bumpMap: goldTexture,
      bumpScale: 0.05,
      roughness: 0.28,
      metalness: 0.55,
      emissive: 0x78350f,
      emissiveIntensity: 0.2,
    });
    const goldPlanet = new THREE.Mesh(goldGeo, goldMat);

    // Golden Concentric Rings
    const ringGeo = new THREE.RingGeometry(1.7, 3.0, 64);
    const pos = ringGeo.attributes.position;
    const uv = ringGeo.attributes.uv;
    for (let i = 0; i < pos.count; i++) {
      const vx = pos.getX(i);
      const vy = pos.getY(i);
      const dist = Math.sqrt(vx * vx + vy * vy);
      const u = (dist - 1.7) / (3.0 - 1.7);
      uv.setXY(i, u, 0.5);
    }

    const ringMat = new THREE.MeshStandardMaterial({
      map: goldTexture,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.88,
      roughness: 0.3,
      metalness: 0.6,
    });
    const rings = new THREE.Mesh(ringGeo, ringMat);
    rings.rotation.x = Math.PI / 2.3;
    rings.rotation.y = -Math.PI / 7;

    const planet2Group = new THREE.Group();
    planet2Group.position.set(-4.0, -2.4, -1.0);
    planet2Group.add(goldPlanet);
    planet2Group.add(rings);
    scene.add(planet2Group);

    // Responsive aspect ratio positioning (Keep planets same scale)
    const updatePositionsForScreen = () => {
      const aspect = container.clientWidth / container.clientHeight;
      planet1Group.position.set(aspect * 2.8, 2.3, -0.5);
      planet1Group.scale.set(1.0, 1.0, 1.0);
      planet2Group.position.set(-aspect * 2.6, -2.2, -1.0);
      planet2Group.scale.set(1.0, 1.0, 1.0);
    };
    updatePositionsForScreen();

    // 6. Animation Loop with Mouse Parallax
    let animationFrameId: number;
    const animate = () => {
      // Rotation
      tealPlanet.rotation.y += 0.002;
      tealPlanet.rotation.x += 0.0006;

      goldPlanet.rotation.y += 0.003;
      rings.rotation.z += 0.0004;

      // Parallax camera response (Disabled on mobile devices)
      const isMobile = window.innerWidth < 768;
      const targetCamX = isMobile ? 0 : mouseRef.current.x * 0.9;
      const targetCamY = isMobile ? 0 : mouseRef.current.y * 0.9;

      camera.position.x += (targetCamX - camera.position.x) * 0.05;
      camera.position.y += (targetCamY - camera.position.y) * 0.05;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // 7. Resize Handler
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
      updatePositionsForScreen();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none z-[5] w-full h-full overflow-hidden"
    />
  );
}

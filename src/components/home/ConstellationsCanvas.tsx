"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

interface ConstellationsCanvasProps {
  mouseX?: number;
  mouseY?: number;
}

interface ShootingStarData {
  group: THREE.Group;
  line: THREE.Line;
  headGlow: THREE.Mesh;
  startX: number;
  startY: number;
  startZ: number;
  vx: number;
  vy: number;
  vz: number;
  length: number;
  life: number;
  maxLife: number;
  delay: number;
  colorHex: number;
}

export default function ConstellationsCanvas({
  mouseX = 0,
  mouseY = 0,
}: ConstellationsCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: mouseX, y: mouseY });

  useEffect(() => {
    mouseRef.current.x = mouseX;
    mouseRef.current.y = mouseY;
  }, [mouseX, mouseY]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Setup Scene, Camera & WebGL Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      50,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 15;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    // 2. Helper to Build Constellation Structures
    const constellationsGroup = new THREE.Group();

    const buildConstellation = (
      points: THREE.Vector3[],
      edges: [number, number][],
      lineColor: number,
      starColor: number
    ) => {
      const cGroup = new THREE.Group();

      // Hairline Luminous Lines
      const linePositions: number[] = [];
      edges.forEach(([i, j]) => {
        if (points[i] && points[j]) {
          const p1 = points[i];
          const p2 = points[j];
          linePositions.push(p1.x, p1.y, p1.z, p2.x, p2.y, p2.z);
        }
      });

      const lineGeo = new THREE.BufferGeometry();
      lineGeo.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(linePositions, 3)
      );

      const lineMat = new THREE.LineBasicMaterial({
        color: lineColor,
        transparent: true,
        opacity: 0.35,
        blending: THREE.AdditiveBlending,
      });
      const lines = new THREE.LineSegments(lineGeo, lineMat);
      cGroup.add(lines);

      // Star Nodes with Twinkle Shader Mesh
      const starGeo = new THREE.SphereGeometry(0.065, 12, 12);
      const starMeshes: THREE.Mesh[] = [];

      points.forEach((pt) => {
        const starMat = new THREE.MeshBasicMaterial({
          color: starColor,
          transparent: true,
          opacity: 0.85,
          blending: THREE.AdditiveBlending,
        });
        const starMesh = new THREE.Mesh(starGeo, starMat);
        starMesh.position.copy(pt);
        cGroup.add(starMesh);
        starMeshes.push(starMesh);
      });

      return { group: cGroup, lineMat, starMeshes };
    };

    // --- 8 EXPANSIVE CELESTIAL CONSTELLATIONS DISTRIBUTED ACROSS FULL SCREEN BOUNDS ---

    // 1. Cassiopeia (Extreme Top-Left Corner, z: -20)
    const c1Points = [
      new THREE.Vector3(-31.0, 15.0, -20),
      new THREE.Vector3(-26.0, 18.2, -19.5),
      new THREE.Vector3(-21.0, 14.0, -20.5),
      new THREE.Vector3(-16.0, 17.5, -20.0),
      new THREE.Vector3(-23.5, 10.5, -19.8),
    ];
    const c1Edges: [number, number][] = [
      [0, 1],
      [1, 2],
      [2, 3],
      [2, 4],
      [0, 4],
    ];
    const c1 = buildConstellation(c1Points, c1Edges, 0xffffff, 0xffffff);

    // 2. Orion's Belt & Bow (Far Mid-Left Outer Edge, z: -22)
    const c2Points = [
      new THREE.Vector3(-30.0, 2.5, -22),
      new THREE.Vector3(-26.5, 1.5, -21.8),
      new THREE.Vector3(-23.0, 0.5, -22.2), // Belt
      new THREE.Vector3(-32.0, 9.0, -22.5), // Betelgeuse
      new THREE.Vector3(-21.0, -7.5, -21.5), // Rigel
      new THREE.Vector3(-32.5, -7.0, -22.0), // Saiph
      new THREE.Vector3(-20.5, 7.8, -22.8), // Bellatrix
    ];
    const c2Edges: [number, number][] = [
      [0, 1],
      [1, 2],
      [0, 3],
      [2, 6],
      [3, 6],
      [0, 5],
      [2, 4],
      [5, 4],
    ];
    const c2 = buildConstellation(c2Points, c2Edges, 0xffffff, 0xffffff);

    // 3. Ursa Major / Big Dipper (High Top Sky Arc, z: -26)
    const c3Points = [
      new THREE.Vector3(-12.0, 19.5, -26),
      new THREE.Vector3(-6.5, 21.8, -25.5),
      new THREE.Vector3(-0.5, 19.2, -26.5),
      new THREE.Vector3(3.0, 15.0, -26.0),
      new THREE.Vector3(9.5, 14.0, -25.8),
      new THREE.Vector3(12.8, 18.0, -26.2),
      new THREE.Vector3(6.5, 20.2, -26.8),
    ];
    const c3Edges: [number, number][] = [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4],
      [4, 5],
      [5, 6],
      [6, 3],
    ];
    const c3 = buildConstellation(c3Points, c3Edges, 0xffffff, 0xffffff);

    // 4. Pegasus Great Square (Extreme Top-Right Corner, z: -20)
    const c4Points = [
      new THREE.Vector3(17.0, 15.5, -20),
      new THREE.Vector3(26.0, 17.0, -19.5),
      new THREE.Vector3(29.0, 9.0, -20.5),
      new THREE.Vector3(18.5, 7.5, -20.0),
      new THREE.Vector3(33.0, 5.5, -21.0),
    ];
    const c4Edges: [number, number][] = [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 0],
      [2, 4],
    ];
    const c4 = buildConstellation(c4Points, c4Edges, 0xffffff, 0xffffff);

    // 5. Cygnus Northern Cross (Far Mid-Right Outer Edge, z: -24)
    const c5Points = [
      new THREE.Vector3(21.0, 1.5, -24),
      new THREE.Vector3(26.5, -2.8, -23.5),
      new THREE.Vector3(32.0, -7.0, -24.5),
      new THREE.Vector3(24.0, 6.0, -24.2),
      new THREE.Vector3(29.0, -11.0, -23.8),
    ];
    const c5Edges: [number, number][] = [
      [0, 1],
      [1, 2],
      [3, 1],
      [1, 4],
    ];
    const c5 = buildConstellation(c5Points, c5Edges, 0xffffff, 0xffffff);

    // 6. Taurus V-Shape (Extreme Bottom-Left Corner, z: -26)
    const c6Points = [
      new THREE.Vector3(-31.0, -11.5, -26),
      new THREE.Vector3(-25.5, -14.5, -25.5),
      new THREE.Vector3(-21.0, -18.5, -26.5),
      new THREE.Vector3(-16.0, -13.8, -26.0),
      new THREE.Vector3(-28.0, -19.0, -25.8),
    ];
    const c6Edges: [number, number][] = [
      [0, 1],
      [1, 2],
      [2, 3],
      [1, 4],
    ];
    const c6 = buildConstellation(c6Points, c6Edges, 0xffffff, 0xffffff);

    // 7. Lyra Harp & Vega Star (Extreme Bottom-Right Corner, z: -28)
    const c7Points = [
      new THREE.Vector3(16.0, -14.5, -28),
      new THREE.Vector3(22.0, -12.0, -27.5),
      new THREE.Vector3(25.0, -17.5, -28.5),
      new THREE.Vector3(19.0, -19.5, -28.0),
      new THREE.Vector3(13.0, -20.5, -27.8),
    ];
    const c7Edges: [number, number][] = [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 0],
      [0, 4],
    ];
    const c7 = buildConstellation(c7Points, c7Edges, 0xffffff, 0xffffff);

    // 8. Draco Serpent Arc (Far High-Right Arc, z: -24)
    const c8Points = [
      new THREE.Vector3(11.0, 18.0, -24),
      new THREE.Vector3(16.5, 21.0, -23.5),
      new THREE.Vector3(22.0, 19.0, -24.5),
      new THREE.Vector3(27.0, 22.5, -24.0),
      new THREE.Vector3(31.0, 18.0, -24.2),
    ];
    const c8Edges: [number, number][] = [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4],
    ];
    const c8 = buildConstellation(c8Points, c8Edges, 0xffffff, 0xffffff);

    constellationsGroup.add(c1.group);
    constellationsGroup.add(c2.group);
    constellationsGroup.add(c3.group);
    constellationsGroup.add(c4.group);
    constellationsGroup.add(c5.group);
    constellationsGroup.add(c6.group);
    constellationsGroup.add(c7.group);
    constellationsGroup.add(c8.group);
    scene.add(constellationsGroup);

    // 3. DYNAMIC SHOOTING STARS ALL OVER THE PAGE (16 Active Meteors)
    const shootingStarsGroup = new THREE.Group();
    scene.add(shootingStarsGroup);

    const shootingStars: ShootingStarData[] = [];
    const shootingStarCount = 16;
    const starColors = [0xffffff, 0xf8fafc, 0xf1f5f9, 0xe2e8f0];

    const resetShootingStar = (s: ShootingStarData) => {
      // Spawn all across top and upper sides of the entire screen
      s.startX = (Math.random() - 0.5) * 45;
      s.startY = Math.random() * 18 + 6;
      s.startZ = -Math.random() * 15 - 10; // Pushed far back z: -10 to -25
      s.length = Math.random() * 3.5 + 2.0;

      const speed = Math.random() * 0.22 + 0.12;
      const angle = Math.PI / 4 + (Math.random() - 0.5) * 0.4; // 35 deg to 55 deg sweep
      s.vx = Math.cos(angle) * speed;
      s.vy = -Math.sin(angle) * speed;
      s.vz = (Math.random() - 0.5) * 0.02;

      s.life = 0;
      s.maxLife = Math.floor(Math.random() * 55 + 45);
      s.delay = Math.floor(Math.random() * 120);

      s.group.position.set(s.startX, s.startY, s.startZ);
      s.group.visible = false;
    };

    for (let i = 0; i < shootingStarCount; i++) {
      const sGroup = new THREE.Group();
      const colorHex = starColors[i % starColors.length];

      // Luminous Trailing Streak Line
      const positions = new Float32Array(6);
      const lineGeo = new THREE.BufferGeometry();
      lineGeo.setAttribute(
        "position",
        new THREE.BufferAttribute(positions, 3)
      );

      const lineMat = new THREE.LineBasicMaterial({
        color: colorHex,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
      });
      const line = new THREE.Line(lineGeo, lineMat);
      sGroup.add(line);

      // Glowing Meteor Head
      const headGeo = new THREE.SphereGeometry(0.09, 12, 12);
      const headMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
      });
      const headGlow = new THREE.Mesh(headGeo, headMat);
      sGroup.add(headGlow);

      shootingStarsGroup.add(sGroup);

      const starData: ShootingStarData = {
        group: sGroup,
        line,
        headGlow,
        startX: 0,
        startY: 0,
        startZ: -15,
        vx: 0.15,
        vy: -0.15,
        vz: 0,
        length: 3,
        life: 0,
        maxLife: 60,
        delay: i * 20,
        colorHex,
      };
      resetShootingStar(starData);
      shootingStars.push(starData);
    }

    // 4. Background Cosmic Stardust Field (350 Micro-Particles scattered in z: -10 to -35)
    const particleCount = 350;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 55;
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 35;
      particlePositions[i * 3 + 2] = -Math.random() * 25 - 10;
    }
    particleGeo.setAttribute(
      "position",
      new THREE.BufferAttribute(particlePositions, 3)
    );

    const particleMat = new THREE.PointsMaterial({
      color: 0x93c5fd,
      size: 0.07,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending,
    });
    const stardust = new THREE.Points(particleGeo, particleMat);
    scene.add(stardust);

    // 5. Animation Loop with Micro-Animations & Deep Z Parallax
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      const time = clock.getElapsedTime();

      // Constellation Twinkle Pulse
      c1.lineMat.opacity = (Math.sin(time * 2.2) + 1) * 0.5 * 0.3 + 0.22;
      c2.lineMat.opacity = (Math.sin(time * 1.8 + 1.2) + 1) * 0.5 * 0.3 + 0.22;
      c3.lineMat.opacity = (Math.sin(time * 2.5 + 2.5) + 1) * 0.5 * 0.3 + 0.18;
      c4.lineMat.opacity = (Math.sin(time * 2.0 + 0.8) + 1) * 0.5 * 0.3 + 0.22;
      c5.lineMat.opacity = (Math.sin(time * 2.4 + 3.1) + 1) * 0.5 * 0.3 + 0.2;
      c6.lineMat.opacity = (Math.sin(time * 1.9 + 2.0) + 1) * 0.5 * 0.3 + 0.22;
      c7.lineMat.opacity = (Math.sin(time * 2.3 + 1.5) + 1) * 0.5 * 0.3 + 0.2;
      c8.lineMat.opacity = (Math.sin(time * 2.1 + 0.5) + 1) * 0.5 * 0.3 + 0.22;

      // Slow Deep Cosmic Drift Rotations
      constellationsGroup.rotation.z = Math.sin(time * 0.04) * 0.02;

      // Shooting Stars Animation Physics Across Full Page
      shootingStars.forEach((star) => {
        if (star.delay > 0) {
          star.delay--;
          return;
        }

        star.group.visible = true;
        star.life++;

        const currentX = star.startX + star.vx * star.life;
        const currentY = star.startY + star.vy * star.life;
        const currentZ = star.startZ + star.vz * star.life;
        star.group.position.set(currentX, currentY, currentZ);

        // Update tail direction vector
        const tailX = -star.vx * star.length;
        const tailY = -star.vy * star.length;
        const tailZ = -star.vz * star.length;

        const posAttr = star.line.geometry.attributes.position as THREE.BufferAttribute;
        posAttr.setXYZ(0, 0, 0, 0);
        posAttr.setXYZ(1, tailX, tailY, tailZ);
        posAttr.needsUpdate = true;

        // Smooth opacity envelope
        let alpha = 1.0;
        const fadeFrames = 12;
        if (star.life < fadeFrames) {
          alpha = star.life / fadeFrames;
        } else if (star.life > star.maxLife - fadeFrames) {
          alpha = (star.maxLife - star.life) / fadeFrames;
        }

        (star.line.material as THREE.LineBasicMaterial).opacity = alpha * 0.9;
        (star.headGlow.material as THREE.MeshBasicMaterial).opacity = alpha * 0.95;

        if (star.life >= star.maxLife) {
          resetShootingStar(star);
        }
      });

      // Ambient Stardust Slow Upward Drift
      const positions = stardust.geometry.attributes.position.array as Float32Array;
      for (let i = 1; i < particleCount * 3; i += 3) {
        positions[i] += 0.004;
        if (positions[i] > 20) {
          positions[i] = -20;
        }
      }
      stardust.geometry.attributes.position.needsUpdate = true;

      // Mouse Parallax Lerp (Pushed deep back: subtle movement creates immense perspective depth)
      const isMobile = window.innerWidth < 768;
      const targetCamX = isMobile ? 0 : mouseRef.current.x * 0.7;
      const targetCamY = isMobile ? 0 : mouseRef.current.y * 0.7;

      camera.position.x += (targetCamX - camera.position.x) * 0.04;
      camera.position.y += (targetCamY - camera.position.y) * 0.04;
      camera.lookAt(0, 0, 0);

      // Deep Parallax Shift
      const pFactor = 0.25;
      constellationsGroup.position.x = -camera.position.x * pFactor;
      constellationsGroup.position.y = -camera.position.y * pFactor;
      shootingStarsGroup.position.x = -camera.position.x * (pFactor * 0.8);
      shootingStarsGroup.position.y = -camera.position.y * (pFactor * 0.8);

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // 6. Resize Handler
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
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
      className="absolute inset-0 pointer-events-none z-[1] w-full h-full overflow-hidden"
    />
  );
}

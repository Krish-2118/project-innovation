"use client";

import React, { useEffect, useRef } from "react";

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  anchorX: number;
  anchorY: number;
  twinkleSpeed: number;
  twinkleOffset: number;
  isStarShape: boolean;
  starColor: string;
}

export default function AboutConstellations() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let nodes: Node[] = [];
    let animationFrameId: number;

    const MAX_NODES = window.innerWidth < 768 ? 45 : 85; // Distributed across the 4 border perimeters
    const LINK = 145; // Distance to connect stars
    
    // Track pointer natively via window so it works even though canvas is pointer-events-none
    const pointer = { x: -1000, y: -1000 };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    // 6 FIXED CELESTIAL GOLDEN STARS PLACED ALONG THE BORDERS OF THE PAGE
    const FIXED_WAYPOINTS = [
      { leftPct: 0.08, topPct: 0.12 }, // Star 1: Top-Left border (above UFO)
      { leftPct: 0.92, topPct: 0.12 }, // Star 2: Top-Right border (above astronaut)
      { leftPct: 0.93, topPct: 0.65 }, // Star 3: Right border lower quadrant (below astronaut)
      { leftPct: 0.72, topPct: 0.92 }, // Star 4: Bottom-Right border
      { leftPct: 0.12, topPct: 0.90 }, // Star 5: Bottom-Left border
      { leftPct: 0.08, topPct: 0.58 }, // Star 6: Left border mid (directly below UFO)
    ];

    // Helper: Generate points scattered naturally across the outer sectors
    const getRandomBorderPoint = () => {
      const zone = Math.floor(Math.random() * 4);
      let x = 0;
      let y = 0;

      if (zone === 0) {
        // Top sector (left or right)
        const isLeft = Math.random() > 0.5;
        x = isLeft ? Math.random() * (width * 0.30) : width * 0.70 + Math.random() * (width * 0.30);
        y = Math.random() * (height * 0.22);
      } else if (zone === 1) {
        // Bottom sector
        x = Math.random() * width;
        y = height * 0.78 + Math.random() * (height * 0.22);
      } else if (zone === 2) {
        // Left sector
        x = Math.random() * (width * 0.25);
        y = height * 0.10 + Math.random() * (height * 0.80);
      } else {
        // Right sector
        x = width * 0.75 + Math.random() * (width * 0.25);
        y = height * 0.10 + Math.random() * (height * 0.80);
      }

      return { x, y };
    };

    const initNodes = () => {
      nodes = [];
      // Fixed nodes: Pinned to the 5 annotated celestial golden star positions along borders
      FIXED_WAYPOINTS.forEach((wp) => {
        const startX = wp.leftPct * width;
        const startY = wp.topPct * height;
        nodes.push({
          x: startX,
          y: startY,
          anchorX: startX,
          anchorY: startY,
          vx: 0,
          vy: 0,
          radius: 3.2,
          twinkleSpeed: 0.002,
          twinkleOffset: 0,
          isStarShape: true,
          starColor: "#fbbf24", // Golden celestial star
        });
      });

      // Remaining nodes: Ambient constellation starfield strictly along borders
      for (let i = FIXED_WAYPOINTS.length; i < MAX_NODES; i++) {
        const pt = getRandomBorderPoint();
        nodes.push({
          x: pt.x,
          y: pt.y,
          anchorX: pt.x,
          anchorY: pt.y,
          vx: (Math.random() - 0.5) * 0.25,
          vy: (Math.random() - 0.5) * 0.25,
          radius: Math.random() * 1.8 + 1.2,
          twinkleSpeed: Math.random() * 0.003 + 0.0015,
          twinkleOffset: Math.random() * Math.PI * 2,
          isStarShape: Math.random() > 0.6,
          starColor: Math.random() > 0.4 ? "#38bdf8" : "#ffffff",
        });
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
    };

    const handleMouseLeave = () => {
      pointer.x = -1000;
      pointer.y = -1000;
    };
    
    window.addEventListener("resize", () => {
      resize();
      initNodes();
    });
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mouseleave", handleMouseLeave, { passive: true });

    resize();
    initNodes();

    const dist = (a: { x: number, y: number }, b: { x: number, y: number }) => {
      return Math.hypot(a.x - b.x, a.y - b.y);
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      // Center text repulsion field parameters
      const cx = width * 0.5;
      const cy = height * 0.48;
      const rx = Math.max(260, width * 0.26);
      const ry = Math.max(190, height * 0.32);
      
      // Draw Links First so they are behind nodes
      ctx.strokeStyle = "#e2e8f0";
      ctx.lineWidth = 1;
      
      const maxConnections = 6;
      const connectionsCount = new Array(nodes.length).fill(0);

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          if (connectionsCount[i] >= maxConnections || connectionsCount[j] >= maxConnections) continue;
          
          const d = dist(nodes[i], nodes[j]);
          if (d < LINK) {
            const midX = (nodes[i].x + nodes[j].x) * 0.5;
            const midY = (nodes[i].y + nodes[j].y) * 0.5;
            const midDistSq = ((midX - cx) / rx) ** 2 + ((midY - cy) / ry) ** 2;
            if (midDistSq < 0.7) continue;

            connectionsCount[i]++;
            connectionsCount[j]++;
            const lineAlpha = midDistSq < 1.0 ? Math.max(0, (midDistSq - 0.7) / 0.3) : 1;
            ctx.globalAlpha = (0.15 + (1 - d / LINK) * 0.35) * lineAlpha;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      const now = Date.now();

      nodes.forEach((node) => {
        // Move the anchor point
        node.anchorX += node.vx;
        node.anchorY += node.vy;

        // Bounce anchors off outer canvas boundaries
        if (node.anchorX < 0) {
          node.anchorX = 0;
          node.vx = Math.abs(node.vx);
        } else if (node.anchorX > width) {
          node.anchorX = width;
          node.vx = -Math.abs(node.vx);
        }

        if (node.anchorY < 0) {
          node.anchorY = 0;
          node.vy = Math.abs(node.vy);
        } else if (node.anchorY > height) {
          node.anchorY = height;
          node.vy = -Math.abs(node.vy);
        }

        // Smooth organic radial repulsion from center text zone (no hard straight lines)
        const ndx = (node.anchorX - cx) / rx;
        const ndy = (node.anchorY - cy) / ry;
        const nDistSq = ndx * ndx + ndy * ndy;

        if (nDistSq < 1.0) {
          const nDist = Math.sqrt(nDistSq) || 0.001;
          const angle = Math.atan2(ndy, ndx);
          const push = (1.0 - nDist) * 1.8;

          node.vx += Math.cos(angle) * push * 0.06;
          node.vy += Math.sin(angle) * push * 0.06;
          node.anchorX += Math.cos(angle) * push * 4;
          node.anchorY += Math.sin(angle) * push * 4;
        }

        // Natural drag to prevent speed accumulation
        node.vx *= 0.99;
        node.vy *= 0.99;

        // The actual star springs smoothly towards its anchor
        node.x += (node.anchorX - node.x) * 0.08;
        node.y += (node.anchorY - node.y) * 0.08;

        // Pointer gravity (pull to mouse)
        const pd = dist(node, pointer);
        if (pd < 140) {
          node.x -= (node.x - pointer.x) * 0.05;
          node.y -= (node.y - pointer.y) * 0.05;
        }

        // Individual Twinkling Pulse Calculation
        const pulse = 0.5 + Math.sin(now * node.twinkleSpeed + node.twinkleOffset) * 0.5;
        const baseTwinkle = 0.3 + pulse * 0.7;

        // Soft clearance fade when passing near text
        const starDistSq = ((node.x - cx) / rx) ** 2 + ((node.y - cy) / ry) ** 2;
        const clearAlpha = starDistSq < 1.0 ? Math.max(0, Math.sqrt(starDistSq) - 0.25) : 1;
        const twinkleOpacity = baseTwinkle * clearAlpha;

        if (twinkleOpacity <= 0.04) return;

        if (node.isStarShape) {
          ctx.save();
          ctx.translate(node.x, node.y);
          ctx.rotate(now * 0.00025 + node.twinkleOffset);

          // 1. Soft Ambient Star Glow
          const glowRadius = node.radius * (3.5 + pulse * 1.8);
          const glowGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, Math.max(0.1, glowRadius));
          glowGrad.addColorStop(0, node.starColor);
          glowGrad.addColorStop(0.5, "rgba(56, 189, 248, 0.25)");
          glowGrad.addColorStop(1, "rgba(255, 255, 255, 0)");

          ctx.fillStyle = glowGrad;
          ctx.globalAlpha = twinkleOpacity * 0.85;
          ctx.beginPath();
          ctx.arc(0, 0, glowRadius, 0, Math.PI * 2);
          ctx.fill();

          // 2. 4-Point Celestial Flare Spikes Shape
          const spikeLen = node.radius * (2.8 + pulse * 2.2);
          const spikeWidth = Math.max(0.5, node.radius * 0.35);

          ctx.fillStyle = node.starColor;
          ctx.globalAlpha = twinkleOpacity;

          // Horizontal Flare Spikes
          ctx.beginPath();
          ctx.moveTo(-spikeLen, 0);
          ctx.lineTo(0, -spikeWidth);
          ctx.lineTo(spikeLen, 0);
          ctx.lineTo(0, spikeWidth);
          ctx.closePath();
          ctx.fill();

          // Vertical Flare Spikes
          ctx.beginPath();
          ctx.moveTo(0, -spikeLen);
          ctx.lineTo(-spikeWidth, 0);
          ctx.lineTo(0, spikeLen);
          ctx.lineTo(spikeWidth, 0);
          ctx.closePath();
          ctx.fill();

          // 3. Bright Core Center
          ctx.fillStyle = "#ffffff";
          ctx.globalAlpha = Math.min(1, twinkleOpacity + 0.2);
          ctx.beginPath();
          ctx.arc(0, 0, node.radius * 0.75, 0, Math.PI * 2);
          ctx.fill();

          ctx.restore();
        } else {
          // Standard Twinkling Star Core
          ctx.fillStyle = "#ffffff";
          ctx.globalAlpha = twinkleOpacity * 0.4;
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.radius * 2.5, 0, Math.PI * 2);
          ctx.fill();

          ctx.globalAlpha = twinkleOpacity;
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      ctx.globalAlpha = 1;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-20 w-full h-full mix-blend-screen"
    />
  );
}

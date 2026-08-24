"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import Image from "next/image";

// ─── Configuration ───────────────────────────────────────────────────────────
const CONFIG = {
  // Tilt
  maxTiltX: 8,         // degrees
  maxTiltY: 12,        // degrees
  tiltDamping: 0.06,   // Lerp alpha — lower = smoother drag

  // Depth parallax offsets (px)
  bgShift: 8,          // background layer shift magnitude
  fgShift: 22,         // foreground (portrait) shift magnitude
  lightShift: 35,      // highlight light shift

  // Particle system
  particleCount: 55,
  particleMinSize: 1,
  particleMaxSize: 3.5,
  particleMinOpacity: 0.15,
  particleMaxOpacity: 0.7,
  particleDriftSpeed: 0.35,
  mouseInfluenceRadius: 160,
  mouseInfluenceStrength: 2.5,

  // Colors
  accentColor: "#D7FF00",
  whiteColor: "#F5F5F0",
};

// ─── Types ───────────────────────────────────────────────────────────────────
interface Particle {
  x: number;
  y: number;
  size: number;
  opacity: number;
  baseOpacity: number;
  vx: number;
  vy: number;
  color: string;
  pulseSpeed: number;
  pulsePhase: number;
}

interface Vec2 {
  x: number;
  y: number;
}

// ─── Utility ─────────────────────────────────────────────────────────────────
function lerp(current: number, target: number, alpha: number): number {
  return current + (target - current) * alpha;
}

function rand(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

function createParticle(width: number, height: number): Particle {
  const isAccent = Math.random() > 0.4;
  return {
    x: Math.random() * width,
    y: Math.random() * height,
    size: rand(CONFIG.particleMinSize, CONFIG.particleMaxSize),
    opacity: rand(CONFIG.particleMinOpacity, CONFIG.particleMaxOpacity),
    baseOpacity: rand(CONFIG.particleMinOpacity, CONFIG.particleMaxOpacity),
    vx: rand(-CONFIG.particleDriftSpeed, CONFIG.particleDriftSpeed),
    vy: rand(-CONFIG.particleDriftSpeed * 0.6, -CONFIG.particleDriftSpeed * 0.15),
    color: isAccent ? CONFIG.accentColor : CONFIG.whiteColor,
    pulseSpeed: rand(0.008, 0.025),
    pulsePhase: Math.random() * Math.PI * 2,
  };
}

// ─── Component ───────────────────────────────────────────────────────────────
export default function HeroPortrait3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);
  const [isReady, setIsReady] = useState(false);

  // Smoothed state (current) vs target
  const mouse = useRef<Vec2>({ x: 0, y: 0 });
  const current = useRef({
    tiltX: 0,
    tiltY: 0,
    shiftX: 0,
    shiftY: 0,
    lightX: 50,
    lightY: 50,
  });
  const target = useRef({
    tiltX: 0,
    tiltY: 0,
    shiftX: 0,
    shiftY: 0,
    lightX: 50,
    lightY: 50,
  });

  const prefersReducedMotion = useRef(false);

  // ─── Mouse handler ──────────────────────────────────────────────────────
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (prefersReducedMotion.current) return;
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    // Normalized -1 to 1 relative to the container
    const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const ny = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    // Store raw mouse for particle system (relative to canvas)
    mouse.current.x = e.clientX - rect.left;
    mouse.current.y = e.clientY - rect.top;

    // Tilt targets
    target.current.tiltX = ny * CONFIG.maxTiltX;
    target.current.tiltY = nx * CONFIG.maxTiltY;

    // Depth shift targets
    target.current.shiftX = nx * CONFIG.fgShift;
    target.current.shiftY = -ny * CONFIG.fgShift;

    // Light highlight position (0–100%)
    target.current.lightX = ((nx + 1) / 2) * 100;
    target.current.lightY = ((-ny + 1) / 2) * 100;
  }, []);

  const handleMouseLeave = useCallback(() => {
    // Reset to center
    target.current.tiltX = 0;
    target.current.tiltY = 0;
    target.current.shiftX = 0;
    target.current.shiftY = 0;
    target.current.lightX = 50;
    target.current.lightY = 50;
  }, []);

  // ─── Gyroscope for mobile ───────────────────────────────────────────────
  const handleOrientation = useCallback((e: DeviceOrientationEvent) => {
    if (prefersReducedMotion.current) return;
    const gamma = e.gamma ?? 0; // left-right tilt (-90 to 90)
    const beta = e.beta ?? 0;   // front-back tilt (-180 to 180)

    const nx = Math.max(-1, Math.min(1, gamma / 30));
    const ny = Math.max(-1, Math.min(1, (beta - 60) / 30));

    target.current.tiltX = ny * CONFIG.maxTiltX;
    target.current.tiltY = nx * CONFIG.maxTiltY;
    target.current.shiftX = nx * CONFIG.fgShift;
    target.current.shiftY = -ny * CONFIG.fgShift;
    target.current.lightX = ((nx + 1) / 2) * 100;
    target.current.lightY = ((-ny + 1) / 2) * 100;
  }, []);

  // ─── Init particles ────────────────────────────────────────────────────
  const initParticles = useCallback((width: number, height: number) => {
    const particles: Particle[] = [];
    for (let i = 0; i < CONFIG.particleCount; i++) {
      particles.push(createParticle(width, height));
    }
    particlesRef.current = particles;
  }, []);

  // ─── Animation loop ────────────────────────────────────────────────────
  useEffect(() => {
    prefersReducedMotion.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    // Set up canvas sizing
    const resizeCanvas = () => {
      const rect = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.scale(dpr, dpr);
      initParticles(rect.width, rect.height);
    };

    resizeCanvas();
    setIsReady(true);

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Event listeners
    const isTouchDevice = "ontouchstart" in window;
    if (isTouchDevice) {
      window.addEventListener("deviceorientation", handleOrientation, true);
    } else {
      container.addEventListener("mousemove", handleMouseMove);
      container.addEventListener("mouseleave", handleMouseLeave);
    }
    window.addEventListener("resize", resizeCanvas);

    let frameTime = 0;

    const animate = () => {
      frameTime++;
      const c = current.current;
      const t = target.current;
      const d = CONFIG.tiltDamping;

      // ── Lerp all values ──
      c.tiltX = lerp(c.tiltX, t.tiltX, d);
      c.tiltY = lerp(c.tiltY, t.tiltY, d);
      c.shiftX = lerp(c.shiftX, t.shiftX, d);
      c.shiftY = lerp(c.shiftY, t.shiftY, d);
      c.lightX = lerp(c.lightX, t.lightX, d * 1.5);
      c.lightY = lerp(c.lightY, t.lightY, d * 1.5);

      // ── Apply tilt to container ──
      if (!prefersReducedMotion.current) {
        container.style.transform = `perspective(1000px) rotateX(${c.tiltX}deg) rotateY(${c.tiltY}deg)`;
      }

      // ── Apply depth shift to layers ──
      const bgLayer = container.querySelector<HTMLElement>("[data-layer='bg']");
      const fgLayer = container.querySelector<HTMLElement>("[data-layer='fg']");
      const lightLayer = container.querySelector<HTMLElement>("[data-layer='light']");

      if (bgLayer && !prefersReducedMotion.current) {
        const bgFactor = CONFIG.bgShift / CONFIG.fgShift;
        bgLayer.style.transform = `translate(${c.shiftX * bgFactor}px, ${c.shiftY * bgFactor}px) scale(1.12)`;
      }

      if (fgLayer && !prefersReducedMotion.current) {
        fgLayer.style.transform = `translate(${c.shiftX}px, ${c.shiftY}px) scale(1.05)`;
      }

      if (lightLayer && !prefersReducedMotion.current) {
        lightLayer.style.background = `radial-gradient(
          ellipse 60% 50% at ${c.lightX}% ${c.lightY}%,
          rgba(215, 255, 0, 0.10) 0%,
          rgba(215, 255, 0, 0.03) 40%,
          transparent 70%
        )`;
      }

      // ── Draw particles ──
      const rect = container.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;

      ctx.clearRect(0, 0, w, h);

      if (!prefersReducedMotion.current) {
        ctx.globalCompositeOperation = "lighter";

        for (const p of particlesRef.current) {
          // Mouse influence
          const dx = mouse.current.x - p.x;
          const dy = mouse.current.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < CONFIG.mouseInfluenceRadius && dist > 0) {
            const force =
              ((CONFIG.mouseInfluenceRadius - dist) / CONFIG.mouseInfluenceRadius) *
              CONFIG.mouseInfluenceStrength;
            p.vx -= (dx / dist) * force * 0.02;
            p.vy -= (dy / dist) * force * 0.02;
          }

          // Apply velocity with damping
          p.x += p.vx;
          p.y += p.vy;
          p.vx *= 0.995;
          p.vy *= 0.995;

          // Pulse opacity
          p.opacity =
            p.baseOpacity +
            Math.sin(frameTime * p.pulseSpeed + p.pulsePhase) * 0.2;
          p.opacity = Math.max(0.05, Math.min(1, p.opacity));

          // Wrap around edges
          if (p.x < -10) p.x = w + 10;
          if (p.x > w + 10) p.x = -10;
          if (p.y < -10) p.y = h + 10;
          if (p.y > h + 10) p.y = -10;

          // Draw
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.opacity;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = p.size * 4;
          ctx.fill();
        }

        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;
        ctx.globalCompositeOperation = "source-over";
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    // ── Cleanup ──
    return () => {
      cancelAnimationFrame(rafRef.current);
      if (isTouchDevice) {
        window.removeEventListener("deviceorientation", handleOrientation, true);
      } else {
        container.removeEventListener("mousemove", handleMouseMove);
        container.removeEventListener("mouseleave", handleMouseLeave);
      }
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [handleMouseMove, handleMouseLeave, handleOrientation, initParticles]);

  return (
    <div
      ref={containerRef}
      className="portrait-3d-container relative aspect-[3/4] max-h-[72vh] w-full overflow-hidden border border-[#F5F5F0]/15 bg-[#050505]"
      style={{ transformStyle: "preserve-3d", willChange: "transform" }}
    >
      {/* Layer 0: Background ambient glow */}
      <div
        data-layer="bg"
        className="absolute inset-0 will-change-transform"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 30% 40%, rgba(215,255,0,0.06) 0%, transparent 60%)",
        }}
      />

      {/* Layer 1: Portrait image (foreground depth) */}
      <div
        data-layer="fg"
        className="absolute inset-0 will-change-transform"
      >
        <Image
          src="/albin-reji_photo_fianal.png"
          alt="Albin Reji — Full Stack Developer"
          fill
          className={`object-cover object-center transition-opacity duration-700 ${
            isReady ? "opacity-100" : "opacity-0"
          }`}
          priority
          sizes="(max-width: 1024px) 100vw, 42vw"
        />
      </div>

      {/* Layer 2: Dynamic light highlight */}
      <div
        data-layer="light"
        className="absolute inset-0 pointer-events-none will-change-[background]"
      />

      {/* Layer 3: Particle canvas overlay */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 10 }}
      />

      {/* Editorial gradient overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 15,
          background: `
            linear-gradient(to top, #050505 0%, transparent 40%),
            linear-gradient(to right, rgba(5,5,5,0.3) 0%, transparent 30%)
          `,
        }}
      />

      {/* Editorial label */}
      <div
        className="absolute top-4 left-4 font-mono text-[9px] uppercase tracking-[0.25em] text-[#D7FF00] px-2 py-1 bg-[#050505]/80 border border-[#F5F5F0]/15"
        style={{ zIndex: 20 }}
      >
        PORTRAIT // 01
      </div>

      {/* Tech ticker at bottom */}
      <div
        className="absolute bottom-6 left-6 right-6 font-mono text-[10px] uppercase tracking-[0.25em] text-[#F5F5F0]/70 flex items-center justify-between"
        style={{ zIndex: 20 }}
      >
        <span>JAVA &bull; SPRING &bull; REACT</span>
        <span className="text-[#D7FF00] font-bold">2025/2026</span>
      </div>
    </div>
  );
}

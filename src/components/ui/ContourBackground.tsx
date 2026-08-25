"use client";

import { useEffect, useRef } from "react";

export default function ContourBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const context: CanvasRenderingContext2D = ctx;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const SCALE_DIV = 10000;
    const SPEED_DIV = 3000000;

    // Tuned for ultra-fine aesthetic lines and low subtle opacity:
    const CONFIG = {
      bg: "#050505",
      lineRGB: "215, 255, 0", // Neon lime #D7FF00
      lineAlpha: 0.16,        // Low, subtle opacity
      lineWidth: 0.75,        // Fine, razor-thin linework
      noiseScale: 11 / SCALE_DIV, // 11
      timeScale: 30 / SPEED_DIV,  // 30
      stepLength: 6,
      stepsPerSide: 260,
      rowSpacing: 260,
      colSpacing: Math.round(260 * 1.6), // 416
      jitter: 40,
    };

    // 3D Perlin Noise implementation (Ken Perlin improved noise)
    function makePerlin(seed = 2026) {
      const perm = new Uint8Array(256);
      for (let i = 0; i < 256; i++) perm[i] = i;

      let s = seed || 1;
      const rand = () => (s = (s * 16807) % 2147483647) / 2147483647;
      for (let i = 255; i > 0; i--) {
        const j = Math.floor(rand() * (i + 1));
        const tmp = perm[i];
        perm[i] = perm[j];
        perm[j] = tmp;
      }
      const p = new Uint8Array(512);
      for (let i = 0; i < 512; i++) p[i] = perm[i & 255];

      const fade = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);
      const lerp = (a: number, b: number, t: number) => a + t * (b - a);
      const grad = (hash: number, x: number, y: number, z: number) => {
        const h = hash & 15;
        const u = h < 8 ? x : y;
        const v = h < 4 ? y : h === 12 || h === 14 ? x : z;
        return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
      };

      return function noise(x: number, y: number, z: number) {
        const X = Math.floor(x) & 255;
        const Y = Math.floor(y) & 255;
        const Z = Math.floor(z) & 255;
        x -= Math.floor(x);
        y -= Math.floor(y);
        z -= Math.floor(z);
        const u = fade(x);
        const v = fade(y);
        const w = fade(z);
        const A = p[X] + Y;
        const AA = p[A] + Z;
        const AB = p[A + 1] + Z;
        const B = p[X + 1] + Y;
        const BA = p[B] + Z;
        const BB = p[B + 1] + Z;
        return lerp(
          lerp(
            lerp(grad(p[AA], x, y, z), grad(p[BA], x - 1, y, z), u),
            lerp(grad(p[AB], x, y - 1, z), grad(p[BB], x - 1, y - 1, z), u),
            v
          ),
          lerp(
            lerp(
              grad(p[AA + 1], x, y, z - 1),
              grad(p[BA + 1], x - 1, y, z - 1),
              u
            ),
            lerp(
              grad(p[AB + 1], x, y - 1, z - 1),
              grad(p[BB + 1], x - 1, y - 1, z - 1),
              u
            ),
            v
          ),
          w
        );
      };
    }

    const noise3 = makePerlin(2026);

    let W = 0;
    let H = 0;
    interface Seed {
      x: number;
      y: number;
    }
    let seeds: Seed[] = [];

    function heightAt(x: number, y: number, t: number) {
      return noise3(x * CONFIG.noiseScale, y * CONFIG.noiseScale, t);
    }

    function contourDir(x: number, y: number, t: number) {
      const e = 1;
      const gx = (heightAt(x + e, y, t) - heightAt(x - e, y, t)) / (2 * e);
      const gy = (heightAt(x, y + e, t) - heightAt(x, y - e, t)) / (2 * e);
      const dx = -gy;
      const dy = gx;
      const len = Math.hypot(dx, dy) || 1;
      return [dx / len, dy / len];
    }

    function buildSeeds() {
      const s: Seed[] = [];
      for (
        let y = -CONFIG.rowSpacing;
        y < H + CONFIG.rowSpacing;
        y += CONFIG.rowSpacing
      ) {
        s.push({
          x: -30,
          y: y + (Math.random() - 0.5) * CONFIG.jitter,
        });
      }
      for (
        let x = -CONFIG.colSpacing;
        x < W + CONFIG.colSpacing;
        x += CONFIG.colSpacing
      ) {
        s.push({
          x: x + (Math.random() - 0.5) * CONFIG.jitter,
          y: -30,
        });
      }
      return s;
    }

    function resize() {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      seeds = buildSeeds();
    }

    function traceLine(seed: Seed, t: number) {
      const back: [number, number][] = [];
      let x = seed.x;
      let y = seed.y;
      for (let i = 0; i < CONFIG.stepsPerSide; i++) {
        const [dx, dy] = contourDir(x, y, t);
        x -= dx * CONFIG.stepLength;
        y -= dy * CONFIG.stepLength;
        if (x < -60 || x > W + 60 || y < -60 || y > H + 60) break;
        back.push([x, y]);
      }
      back.reverse();

      const fwd: [number, number][] = [[seed.x, seed.y]];
      x = seed.x;
      y = seed.y;
      for (let i = 0; i < CONFIG.stepsPerSide; i++) {
        const [dx, dy] = contourDir(x, y, t);
        x += dx * CONFIG.stepLength;
        y += dy * CONFIG.stepLength;
        if (x < -60 || x > W + 60 || y < -60 || y > H + 60) break;
        fwd.push([x, y]);
      }
      return back.concat(fwd);
    }

    let animationId: number;
    let isVisible = true;
    const startTime = performance.now();

    function render(now: number) {
      if (!isVisible) return;
      const t = reduceMotion ? 0 : (now - startTime) * CONFIG.timeScale;

      context.fillStyle = CONFIG.bg;
      context.fillRect(0, 0, W, H);
      context.lineWidth = CONFIG.lineWidth;
      context.strokeStyle = `rgba(${CONFIG.lineRGB}, ${CONFIG.lineAlpha})`;
      context.lineJoin = "round";
      context.lineCap = "round";

      for (const seed of seeds) {
        const pts = traceLine(seed, t);
        if (pts.length < 2) continue;

        context.beginPath();
        context.moveTo(pts[0][0], pts[0][1]);
        for (let i = 1; i < pts.length; i++) {
          context.lineTo(pts[i][0], pts[i][1]);
        }
        context.stroke();
      }

      if (!reduceMotion) {
        animationId = requestAnimationFrame(render);
      }
    }

    const handleVisibility = () => {
      isVisible = !document.hidden;
      if (isVisible && !reduceMotion) {
        animationId = requestAnimationFrame(render);
      }
    };

    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", handleVisibility);

    resize();
    render(startTime);

    return () => {
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", handleVisibility);
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
      />
    </div>
  );
}

"use client";

import { useEffect, useRef } from "react";

interface Point {
  lat: number; // radians, -PI/2..PI/2
  lon: number; // radians, 0..2PI
}

const ROTATION_PERIOD_MS = 90000; // one full slow spin every 90s
const MERIDIANS = 22;
const POINTS_PER_MERIDIAN = 34;
const PARALLELS = 7;
const POINTS_PER_PARALLEL = 70;

export function ParticleGlobe({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let width = 0;
    let height = 0;
    let points: Point[] = [];
    let animationFrame = 0;
    let startTime = 0;

    function buildPoints() {
      const list: Point[] = [];
      for (let m = 0; m < MERIDIANS; m++) {
        const lon = (m / MERIDIANS) * Math.PI * 2;
        for (let p = 0; p <= POINTS_PER_MERIDIAN; p++) {
          const lat = -Math.PI / 2 + (p / POINTS_PER_MERIDIAN) * Math.PI;
          list.push({ lat, lon });
        }
      }
      for (let r = 1; r < PARALLELS; r++) {
        const lat = -Math.PI / 2 + (r / PARALLELS) * Math.PI;
        for (let p = 0; p < POINTS_PER_PARALLEL; p++) {
          const lon = (p / POINTS_PER_PARALLEL) * Math.PI * 2;
          list.push({ lat, lon });
        }
      }
      return list;
    }

    function resize() {
      const el = canvas!;
      width = el.clientWidth;
      height = el.clientHeight;
      el.width = width * dpr;
      el.height = height * dpr;
      ctx!.setTransform(1, 0, 0, 1, 0, 0);
      ctx!.scale(dpr, dpr);
    }

    function render(rotation: number) {
      ctx!.clearRect(0, 0, width, height);

      const radius = Math.max(width * 0.62, height * 1.95);
      const centerX = width / 2;
      // Push the sphere's center below the canvas so its cap fills the full
      // section height, from just under the header down to the bottom.
      const centerY = height + radius * 0.22;

      for (const pt of points) {
        const lon = pt.lon + rotation;
        const x3 = Math.cos(pt.lat) * Math.cos(lon);
        const y3 = Math.sin(pt.lat);
        const z3 = Math.cos(pt.lat) * Math.sin(lon);

        // Back-face cull (z3 < 0 faces away from viewer) with a soft fade near the terminator.
        const facing = (z3 + 1) / 2; // 0..1
        if (facing < 0.32) continue;

        const screenX = centerX + x3 * radius;
        const screenY = centerY - y3 * radius;
        if (screenY < -10 || screenY > height + 10) continue;

        const depthT = (facing - 0.32) / 0.68;
        const size = 0.6 + depthT * 1.3;
        const alpha = 0.08 + depthT * 0.4;

        ctx!.beginPath();
        ctx!.arc(screenX, screenY, size, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(59, 130, 246, ${alpha})`;
        ctx!.fill();
      }
    }

    function loop(time: number) {
      if (!startTime) startTime = time;
      const rotation = ((time - startTime) / ROTATION_PERIOD_MS) * Math.PI * 2;
      render(rotation);
      animationFrame = requestAnimationFrame(loop);
    }

    points = buildPoints();
    resize();

    if (reduceMotion) {
      render(0);
    } else {
      animationFrame = requestAnimationFrame(loop);
    }

    const onResize = () => {
      resize();
      startTime = 0;
      if (reduceMotion) render(0);
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={className}
      style={{ width: "100%", height: "100%", pointerEvents: "none" }}
    />
  );
}

"use client";

import { useEffect, useRef } from "react";

interface Sphere {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

const SETTLE_DURATION = 1600; // ms of "poured out, falling and bouncing" before zero-gravity float
const GRAVITY = 0.22;
const WALL_DAMPING = 0.72;
const COLLISION_DAMPING = 0.85;
const FLOAT_JITTER = 0.012;
const FLOAT_MAX_SPEED = 0.35;

export function DotField({ className }: { className?: string }) {
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
    let spheres: Sphere[] = [];
    let animationFrame = 0;
    let startTime = 0;

    function makeSpheres() {
      const area = width * height;
      const count = Math.max(24, Math.min(70, Math.round(area / 9000)));
      const list: Sphere[] = [];
      for (let i = 0; i < count; i++) {
        list.push({
          x: Math.random() * width,
          y: -Math.random() * height, // start above the visible area, like poured from a bag
          vx: (Math.random() - 0.5) * 0.6,
          vy: Math.random() * 0.5,
          radius: 2 + Math.random() * 2.5,
        });
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
      spheres = makeSpheres();
    }

    function resolveCollisions() {
      for (let i = 0; i < spheres.length; i++) {
        for (let j = i + 1; j < spheres.length; j++) {
          const a = spheres[i];
          const b = spheres[j];
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 0.001;
          const minDist = a.radius + b.radius;
          if (dist < minDist) {
            const overlap = (minDist - dist) / 2;
            const nx = dx / dist;
            const ny = dy / dist;
            a.x -= nx * overlap;
            a.y -= ny * overlap;
            b.x += nx * overlap;
            b.y += ny * overlap;

            const avx = a.vx;
            const avy = a.vy;
            a.vx = b.vx * COLLISION_DAMPING;
            a.vy = b.vy * COLLISION_DAMPING;
            b.vx = avx * COLLISION_DAMPING;
            b.vy = avy * COLLISION_DAMPING;
          }
        }
      }
    }

    function step(elapsed: number) {
      const falling = elapsed < SETTLE_DURATION;
      const gravity = falling ? GRAVITY : 0;

      for (const s of spheres) {
        if (falling) {
          s.vy += gravity;
        } else {
          // gentle brownian drift so they never fully stop — "floating with no gravity"
          s.vx += (Math.random() - 0.5) * FLOAT_JITTER;
          s.vy += (Math.random() - 0.5) * FLOAT_JITTER;
          const speed = Math.sqrt(s.vx * s.vx + s.vy * s.vy);
          if (speed > FLOAT_MAX_SPEED) {
            s.vx = (s.vx / speed) * FLOAT_MAX_SPEED;
            s.vy = (s.vy / speed) * FLOAT_MAX_SPEED;
          }
        }

        s.x += s.vx;
        s.y += s.vy;

        if (s.x - s.radius < 0) {
          s.x = s.radius;
          s.vx = Math.abs(s.vx) * WALL_DAMPING;
        } else if (s.x + s.radius > width) {
          s.x = width - s.radius;
          s.vx = -Math.abs(s.vx) * WALL_DAMPING;
        }

        if (s.y + s.radius > height) {
          s.y = height - s.radius;
          s.vy = -Math.abs(s.vy) * WALL_DAMPING;
        } else if (s.y - s.radius < 0 && !falling) {
          s.y = s.radius;
          s.vy = Math.abs(s.vy) * WALL_DAMPING;
        }
      }

      resolveCollisions();
    }

    function render() {
      ctx!.clearRect(0, 0, width, height);
      for (const s of spheres) {
        const gradient = ctx!.createRadialGradient(
          s.x - s.radius * 0.35,
          s.y - s.radius * 0.35,
          0,
          s.x,
          s.y,
          s.radius
        );
        gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
        gradient.addColorStop(0.45, "rgba(191, 219, 254, 1)");
        gradient.addColorStop(1, "rgba(59, 130, 246, 1)");

        ctx!.save();
        ctx!.shadowColor = "rgba(37, 99, 235, 0.45)";
        ctx!.shadowBlur = s.radius * 3;
        ctx!.beginPath();
        ctx!.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx!.fillStyle = gradient;
        ctx!.fill();
        ctx!.restore();

        ctx!.lineWidth = 1;
        ctx!.strokeStyle = "rgba(37, 99, 235, 0.7)";
        ctx!.stroke();
      }
    }

    function loop(time: number) {
      if (!startTime) startTime = time;
      step(time - startTime);
      render();
      animationFrame = requestAnimationFrame(loop);
    }

    resize();

    if (reduceMotion) {
      // Render a single settled-looking frame, no ongoing animation or physics.
      render();
    } else {
      animationFrame = requestAnimationFrame(loop);
    }

    const onResize = () => {
      resize();
      startTime = 0;
      if (reduceMotion) render();
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

"use client";

import { useEffect, useRef } from "react";

interface Dot {
  x: number;
  y: number;
  baseY: number;
  phase: number;
  radius: number;
}

export function DotField({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let width = 0;
    let height = 0;
    let dots: Dot[] = [];
    let animationFrame = 0;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    function resize() {
      const el = canvas!;
      width = el.clientWidth;
      height = el.clientHeight;
      el.width = width * dpr;
      el.height = height * dpr;
      ctx!.scale(dpr, dpr);

      const spacing = width < 640 ? 42 : 34;
      const cols = Math.ceil(width / spacing) + 1;
      const rows = Math.ceil(height / spacing) + 1;
      dots = [];
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          dots.push({
            x: i * spacing,
            y: j * spacing,
            baseY: j * spacing,
            phase: Math.random() * Math.PI * 2,
            radius: 1 + Math.random() * 0.6,
          });
        }
      }
    }

    function draw(time: number) {
      ctx!.clearRect(0, 0, width, height);
      for (const dot of dots) {
        const offset = reduceMotion ? 0 : Math.sin(time / 2200 + dot.phase) * 5;
        const y = dot.baseY + offset;
        const opacity = reduceMotion ? 0.18 : 0.12 + 0.1 * Math.sin(time / 2200 + dot.phase);
        ctx!.beginPath();
        ctx!.arc(dot.x, y, dot.radius, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(47, 123, 246, ${opacity})`;
        ctx!.fill();
      }
      if (!reduceMotion) {
        animationFrame = requestAnimationFrame(draw);
      }
    }

    resize();
    draw(0);

    const onResize = () => {
      ctx!.setTransform(1, 0, 0, 1, 0, 0);
      resize();
      if (reduceMotion) draw(0);
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
      style={{ width: "100%", height: "100%" }}
    />
  );
}

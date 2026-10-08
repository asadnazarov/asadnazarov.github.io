"use client";

import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

/**
 * Fixed, page-wide backdrop built from live layers instead of an image:
 * drifting aurora blobs, a parallax dot lattice, a pointer spotlight and film grain.
 * Each layer moves at its own scroll speed so the page has depth.
 */
export function AmbientBackground() {
  const spotRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const auroraY = useTransform(scrollYProgress, [0, 1], ["0%", "-35%"]);
  const gridY = useTransform(scrollYProgress, [0, 1], ["0px", "-600px"]);

  useEffect(() => {
    const el = spotRef.current;
    if (!el || window.matchMedia("(pointer: coarse)").matches) return;
    let frame = 0;
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        el.style.setProperty("--x", `${e.clientX}px`);
        el.style.setProperty("--y", `${e.clientY}px`);
        el.style.opacity = "1";
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-background">
      <motion.div style={{ y: auroraY }} className="absolute inset-0 h-[160%]">
        <div className="aurora-blob aurora-a" />
        <div className="aurora-blob aurora-b" />
        <div className="aurora-blob aurora-c" />
      </motion.div>

      <motion.div
        style={{ y: gridY }}
        className="absolute inset-x-0 top-0 h-[calc(100%+600px)] opacity-60 [background-image:radial-gradient(rgba(47,123,246,0.22)_1px,transparent_1.2px)] [background-size:28px_28px] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_30%,black,transparent)]"
      />

      <div
        ref={spotRef}
        className="absolute inset-0 opacity-0 transition-opacity duration-700"
        style={{
          background:
            "radial-gradient(520px circle at var(--x, 50%) var(--y, 30%), rgba(47,123,246,0.10), transparent 60%)",
        }}
      />

      <div className="absolute inset-0 hidden opacity-[0.035] md:block" style={{ backgroundImage: GRAIN }} />
    </div>
  );
}

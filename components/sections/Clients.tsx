"use client";

import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { CLIENTS } from "@/lib/clients";
import { FLAGS } from "@/components/ui/Flags";

const REVOLUTION_MS = 48000; // one calm, constant lap for every logo
const TAU = Math.PI * 2;

/**
 * All clients ride one tilted 3D ring around the headline number. Every logo moves
 * at the same steady pace; the front of the ring passes in front of the number,
 * the back passes behind it. Scroll only tilts the ring — it never changes speed.
 * The ring can be spun by dragging; the spin eases back to the steady pace.
 */
export function Clients() {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const labelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const trackRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const tilt = useTransform(scrollYProgress, [0, 1], [0.2, 0.42]);
  const numberY = useTransform(scrollYProgress, [0, 1], [40, -40]);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const n = CLIENTS.length;

    let width = stage.clientWidth;
    const ro = new ResizeObserver(() => (width = stage.clientWidth));
    ro.observe(stage);

    let angle = 0;
    let extra = 0; // drag-imparted angular velocity (rad/s), decays to 0
    let dragging = false;
    let lastX = 0;
    let lastT = 0;

    const onDown = (e: PointerEvent) => {
      dragging = true;
      lastX = e.clientX;
      lastT = performance.now();
      stage.setPointerCapture(e.pointerId);
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging) return;
      const now = performance.now();
      const dx = e.clientX - lastX;
      const rx = Math.max(width * 0.42, 1);
      angle += dx / rx;
      extra = (dx / rx) / Math.max((now - lastT) / 1000, 0.008);
      lastX = e.clientX;
      lastT = now;
    };
    const onUp = () => (dragging = false);
    stage.addEventListener("pointerdown", onDown);
    stage.addEventListener("pointermove", onMove);
    stage.addEventListener("pointerup", onUp);
    stage.addEventListener("pointercancel", onUp);

    let visible = true;
    const io = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting));
    io.observe(stage);

    let frame = 0;
    let last = performance.now();
    const loop = (now: number) => {
      frame = requestAnimationFrame(loop);
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      if (!visible || document.hidden) return;

      if (!dragging) {
        if (!reduceMotion) angle += (TAU / (REVOLUTION_MS / 1000)) * dt;
        angle += extra * dt;
        extra *= Math.pow(0.04, dt); // ease the fling back to the steady pace
      }

      const mobile = width < 640;
      const rx = mobile ? width / 2 - 34 : Math.min(width * 0.44, 520);
      const ry = rx * tilt.get() * (mobile ? 1.15 : 1);
      if (trackRef.current) {
        trackRef.current.style.width = `${rx * 2}px`;
        trackRef.current.style.height = `${ry * 2}px`;
      }

      // Only the single logo nearest the front shows its name, so labels never collide.
      let front = 0;
      let frontDepth = -1;
      for (let i = 0; i < n; i++) {
        const d = (Math.cos(angle + (i / n) * TAU) + 1) / 2;
        if (d > frontDepth) (frontDepth = d), (front = i);
      }

      for (let i = 0; i < n; i++) {
        const el = itemRefs.current[i];
        if (!el) continue;
        const a = angle + (i / n) * TAU;
        const depth = (Math.cos(a) + 1) / 2; // 1 = front, 0 = back
        const x = Math.sin(a) * rx;
        const y = Math.cos(a) * ry;
        const scale = 0.5 + 0.5 * depth;
        el.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) scale(${scale})`;
        el.style.opacity = String(0.25 + 0.75 * depth);
        el.style.zIndex = String(depth > 0.5 ? 20 + Math.round(depth * 10) : Math.round(depth * 10));
        const label = labelRefs.current[i];
        if (label) label.style.opacity = i === front ? String(Math.max(0, (depth - 0.9) / 0.1)) : "0";
      }
    };
    frame = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
      io.disconnect();
      stage.removeEventListener("pointerdown", onDown);
      stage.removeEventListener("pointermove", onMove);
      stage.removeEventListener("pointerup", onUp);
      stage.removeEventListener("pointercancel", onUp);
    };
  }, [tilt]);

  return (
    <section ref={sectionRef} className="relative py-16 md:py-28 overflow-hidden">
      <div
        ref={stageRef}
        className="relative mx-auto h-[300px] md:h-[500px] max-w-6xl cursor-grab select-none touch-pan-y active:cursor-grabbing"
      >
        {/* Ring track */}
        <div
          ref={trackRef}
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-[50%] border border-accent/20 shadow-[0_0_40px_rgba(47,123,246,0.12)_inset]"
        />
        <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 h-64 w-64 md:h-96 md:w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(47,123,246,0.18),transparent_65%)]" />

        {/* Headline number sits between the back and the front of the ring */}
        <motion.div
          style={{ y: numberY }}
          className="pointer-events-none absolute left-1/2 top-1/2 z-[15] w-[70%] max-w-md -translate-x-1/2 -translate-y-1/2 text-center"
        >
          <div className="font-display text-7xl md:text-[9rem] leading-none text-accent drop-shadow-[0_10px_40px_rgba(47,123,246,0.35)]">
            {CLIENTS.length}
          </div>
        </motion.div>

        {CLIENTS.map((client, i) => {
          const Flag = FLAGS[client.country];
          return (
            <div
              key={client.name}
              ref={(el) => {
                itemRefs.current[i] = el;
              }}
              className="absolute left-1/2 top-1/2 flex flex-col items-center will-change-transform"
              style={{ opacity: 0 }}
            >
              <div className="h-14 w-14 md:h-24 md:w-24 overflow-hidden rounded-full border-2 border-white bg-white shadow-[0_12px_30px_-8px_rgba(15,23,42,0.35)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={client.src} alt={client.name} draggable={false} className="h-full w-full object-cover" />
              </div>
              <div
                ref={(el) => {
                  labelRefs.current[i] = el;
                }}
                className="mt-2 flex items-center gap-1 whitespace-nowrap rounded-full bg-white/90 px-2.5 py-0.5 text-[11px] md:text-sm font-bold shadow-sm"
                style={{ opacity: 0 }}
              >
                <Flag className="h-2.5 w-4 rounded-[1px]" />
                {client.name}
              </div>
            </div>
          );
        })}
      </div>
      <p className="mx-auto mt-4 max-w-md px-6 text-center font-display text-lg md:text-2xl leading-snug">
        {t.clients.countLabel}
      </p>
      <p className="mt-3 text-center text-xs uppercase tracking-[0.25em] text-muted/70">↔ {t.clients.dragHint}</p>
    </section>
  );
}

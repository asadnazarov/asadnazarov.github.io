"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useSpring, useTransform, type MotionValue } from "framer-motion";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { NavButton } from "@/components/ui/Button";
import { DotField } from "@/components/motion/DotField";

const ICONS = [
  // magnifier
  <path key="search" d="M11 4a7 7 0 105.196 11.696l4.554 4.554a1 1 0 001.414-1.414l-4.554-4.554A7 7 0 0011 4zm-5 7a5 5 0 1110 0 5 5 0 01-10 0z" />,
  // wrench
  <path key="wrench" d="M21.7 6.3a1 1 0 00-1.6-.3l-2.9 2.9-1.6-.4-.4-1.6 2.9-2.9a1 1 0 00-.3-1.6A6 6 0 007 8.9a1 1 0 00-.3.9L2.3 14.2a2.5 2.5 0 003.5 3.5l4.4-4.4a1 1 0 00.9-.3A6 6 0 0021.7 6.3z" />,
  // rocket
  <path key="rocket" d="M12 2c3 2 5 6 4.5 10.5L19 15l-2 2-2.5 2.5L12 22c-1-2-2-4-2-6 0 0-4-1-6-4.5C6.5 8 10 6 12 2zm-1.5 12a1.5 1.5 0 103 0 1.5 1.5 0 00-3 0z" />,
];

function StepNumber({ n, progress }: { n: number; progress: MotionValue<number> }) {
  // Numbers drift against the scroll direction for a parallax layer inside each card.
  const x = useTransform(progress, [0, 1], [60 + n * 30, -60 - n * 30]);
  return (
    <motion.div
      style={{ x }}
      aria-hidden
      className="pointer-events-none absolute -right-4 -top-10 font-display text-[9rem] md:text-[12rem] leading-none text-transparent [-webkit-text-stroke:1.5px_rgba(47,123,246,0.18)]"
    >
      {String(n + 1).padStart(2, "0")}
    </motion.div>
  );
}

/**
 * Vertical scroll drives a horizontal track: the section pins to the viewport
 * and its height is sized so the track exactly finishes as the pin releases.
 */
export function Process() {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const measure = () => setDistance(Math.max(0, track.scrollWidth - window.innerWidth));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(track);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const eased = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.4 });
  const x = useTransform(eased, (v) => -v * distance);
  const bar = useTransform(eased, [0, 1], ["0%", "100%"]);
  // The progress line only exists while the section is pinned — otherwise it reads as a stray rule mid-page.
  const barOpacity = useTransform(scrollYProgress, (v) => Math.min(v * 25, (1 - v) * 25, 1));

  return (
    <section
      id="process"
      ref={sectionRef}
      className="relative"
      style={{ height: distance ? `calc(100svh + ${distance}px)` : undefined }}
    >
      <div className="sticky top-0 flex h-[100svh] flex-col justify-start pt-28 md:justify-center md:pt-0 overflow-hidden">
        <DotField className="absolute inset-0 -z-10 opacity-60 [mask-image:linear-gradient(transparent,black_20%,black_80%,transparent)]" />

        <motion.div style={{ opacity: barOpacity }} className="absolute left-6 right-6 top-20 md:top-24 mx-auto max-w-6xl">
          <div className="h-px w-full bg-surface-border">
            <motion.div style={{ width: bar }} className="h-px bg-accent shadow-[0_0_12px_var(--accent)]" />
          </div>
        </motion.div>

        <motion.div ref={trackRef} style={{ x }} className="flex w-max items-stretch gap-6 md:gap-10 px-6 md:px-[8vw] will-change-transform">
          <div className="flex w-[85vw] md:w-[38vw] shrink-0 flex-col justify-start md:justify-center">
            <SectionHeading eyebrow={t.process.eyebrow} heading={t.process.heading} subhead={t.process.subhead} />
            <div className="mt-8 hidden md:flex items-center gap-3 text-sm text-muted">
              <span className="inline-block h-px w-10 bg-accent" />
              01 — 0{t.process.steps.length}
            </div>
          </div>

          {t.process.steps.map((step, i) => (
            <div
              key={step.title}
              className="group relative w-[85vw] md:w-[30rem] shrink-0 overflow-hidden rounded-[2rem] border border-surface-border bg-white/95 md:bg-white/75 p-7 md:p-10 shadow-[0_30px_80px_-20px_rgba(15,23,42,0.18)] md:backdrop-blur-xl transition-colors duration-500 hover:border-accent/40"
            >
              <StepNumber n={i} progress={eased} />
              <div className="absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(47,123,246,0.16),transparent_65%)] transition-opacity duration-500 group-hover:opacity-100 opacity-60" />
              <div className="relative">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent text-white shadow-lg shadow-accent/30">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
                    {ICONS[i]}
                  </svg>
                </div>
                <div className="font-display text-2xl md:text-3xl mb-2">{step.title}</div>
                <p className="text-accent font-medium mb-6">{step.tagline}</p>
                <ul className="space-y-3">
                  {step.bullets.map((bullet) => (
                    <li key={bullet} className="flex gap-3 text-sm md:text-base text-muted leading-relaxed">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}

          <div className="flex w-[85vw] md:w-[34vw] shrink-0 flex-col items-start justify-center gap-6 pr-6">
            <p className="font-display text-2xl md:text-4xl leading-tight">{t.process.ctaText}</p>
            <NavButton href="/consultation/" className="!px-8 !py-4 text-base">
              {t.process.ctaButton} →
            </NavButton>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

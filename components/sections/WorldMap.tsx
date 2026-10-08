"use client";

import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { CLIENTS, COUNTRY_PINS, clientsIn } from "@/lib/clients";
import { stageAt } from "@/lib/worldMapRoute";
import { FLAGS } from "@/components/ui/Flags";
import { cn } from "@/lib/utils";

const WorldMapCanvas = dynamic(() => import("@/components/motion/WorldMapCanvas"), { ssr: false });

function plural(n: number, [one, few, many]: [string, string, string]) {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return few;
  return many;
}

const EASE = [0.16, 1, 0.3, 1] as const;

export function WorldMap() {
  const { t } = useLanguage();
  const stageRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: stageRef, offset: ["start start", "end end"] });
  const [stage, setStage] = useState(-1);
  useMotionValueEvent(scrollYProgress, "change", (v) => setStage(stageAt(v)));

  // Function form on purpose: range-mapped opacity gets offloaded to a native
  // ScrollTimeline, which mis-maps this section's offsets.
  const introOpacity = useTransform(scrollYProgress, (v) => 1 - Math.min(Math.max(v / 0.07, 0), 1));
  const introY = useTransform(scrollYProgress, [0, 0.07], [0, -40]);
  const railFill = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  const pin = stage >= 0 && stage < COUNTRY_PINS.length ? COUNTRY_PINS[stage] : null;
  const pinClients = pin ? clientsIn(pin.code) : [];
  const summary = stage === COUNTRY_PINS.length;

  return (
    <section id="projects" className="relative">
      {/* Dusk: a long eased gradient so the light page sinks into night instead of meeting it at an edge. */}
      <div aria-hidden className="dusk-in pointer-events-none h-[45vh] md:h-[55vh]" />
      <div ref={stageRef} data-dark-stage className="relative h-[520vh] bg-[#040b1f]">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <WorldMapCanvas progress={scrollYProgress} className="absolute inset-0" />

        {/* Blend the dark stage into the light page above and below. */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[#040b1f] to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#040b1f] to-transparent" />

        {/* Intro title */}
        <motion.div
          data-map-intro
          style={{ opacity: introOpacity, y: introY }}
          className="pointer-events-none absolute inset-x-0 top-24 md:top-32 px-6 text-center"
        >
          <div className="text-sm font-semibold uppercase tracking-[0.3em] text-[#7fb0ff] mb-4">{t.worldMap.eyebrow}</div>
          <h2 className="font-display text-3xl md:text-6xl leading-tight tracking-tight text-white text-balance">
            {t.worldMap.heading}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base md:text-lg text-white/60">{t.worldMap.subhead}</p>
          <div className="mt-10 inline-flex items-center gap-2 text-xs uppercase tracking-widest text-white/40">
            <span className="relative flex h-5 w-3 justify-center rounded-full border border-white/30">
              <span className="mt-1 h-1.5 w-0.5 animate-bounce rounded-full bg-white/60" />
            </span>
            {t.worldMap.scrollHint}
          </div>
        </motion.div>

        {/* Country card */}
        <div className="pointer-events-none absolute inset-x-0 bottom-8 md:bottom-14 px-4 md:px-12">
          <AnimatePresence mode="wait">
            {pin && (
              <motion.div
                key={pin.code}
                initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -20, filter: "blur(8px)" }}
                transition={{ duration: 0.55, ease: EASE }}
                className="max-w-md rounded-3xl border border-white/10 bg-[#0b1736]/90 md:bg-white/[0.06] p-5 md:p-6 text-white shadow-[0_20px_80px_rgba(20,80,255,0.25)] md:backdrop-blur-xl"
              >
                <div className="flex items-center gap-3">
                  {(() => {
                    const Flag = FLAGS[pin.code];
                    return <Flag className="h-5 w-8 rounded-[3px] shadow" />;
                  })()}
                  <div className="font-display text-xl md:text-2xl">{t.worldMap.countries[pin.code]}</div>
                  {stage === 0 && (
                    <span className="rounded-full bg-[#3b86ff]/25 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-[#9cc2ff]">
                      {t.worldMap.homeLabel}
                    </span>
                  )}
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="font-display text-5xl md:text-6xl text-[#5c9bff]">{pinClients.length}</span>
                  <span className="text-white/60">{plural(pinClients.length, t.worldMap.projectForms)}</span>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {pinClients.map((c, i) => (
                    <motion.div
                      key={c.name}
                      initial={{ opacity: 0, scale: 0.6 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.15 + i * 0.04, duration: 0.4, ease: EASE }}
                      title={c.name}
                      className="h-10 w-10 md:h-11 md:w-11 overflow-hidden rounded-full border border-white/20 bg-white"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={c.src} alt={c.name} className="h-full w-full object-cover" />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
            {summary && (
              <motion.div
                key="summary"
                initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.6, ease: EASE }}
                className="mx-auto max-w-2xl text-center text-white"
              >
                <div className="flex items-end justify-center gap-6 md:gap-10">
                  <div>
                    <div className="font-display text-6xl md:text-8xl text-[#5c9bff]">{CLIENTS.length}</div>
                    <div className="mt-1 text-white/60">{plural(CLIENTS.length, t.worldMap.projectForms)}</div>
                  </div>
                  <div className="mb-6 h-14 w-px bg-white/20" />
                  <div>
                    <div className="font-display text-6xl md:text-8xl text-white">{COUNTRY_PINS.length}</div>
                    <div className="mt-1 text-white/60">{t.worldMap.totalCountriesLabel}</div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Route rail */}
        <div className="pointer-events-none absolute right-10 top-1/2 hidden -translate-y-1/2 md:block">
          <div className="relative flex flex-col items-center gap-6">
            <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-white/10" />
            <motion.div
              style={{ height: railFill }}
              className="absolute left-1/2 top-0 w-px -translate-x-1/2 bg-gradient-to-b from-[#3b86ff] to-[#9cc2ff]"
            />
            {COUNTRY_PINS.map((p, i) => {
              const Flag = FLAGS[p.code];
              const reached = stage >= i;
              return (
                <div
                  key={p.code}
                  className={cn(
                    "relative flex h-8 w-8 items-center justify-center rounded-full border transition-all duration-500",
                    reached
                      ? "border-[#3b86ff] bg-[#0b1a3d] shadow-[0_0_20px_rgba(59,134,255,0.7)]"
                      : "border-white/15 bg-[#040b1f] opacity-50"
                  )}
                >
                  <Flag className="h-2.5 w-4 rounded-[1px]" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
      </div>
      {/* Dawn: night lifts back into the light page. */}
      <div aria-hidden className="dusk-out pointer-events-none h-[45vh] md:h-[55vh]" />
    </section>
  );
}

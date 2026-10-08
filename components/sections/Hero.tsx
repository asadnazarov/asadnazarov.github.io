"use client";

import { useEffect, useRef, useState } from "react";
import { animate, motion, useScroll, useTransform } from "framer-motion";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { NavButton } from "@/components/ui/Button";
import { ParticleGlobe } from "@/components/motion/ParticleGlobe";

const EASE = [0.16, 1, 0.3, 1] as const;

/** Each letter rises out of a clipped line, word by word. */
function SplitReveal({
  text,
  delay = 0,
  className,
  shimmer = false,
}: {
  text: string;
  delay?: number;
  className?: string;
  shimmer?: boolean;
}) {
  let index = 0;
  return (
    <span className={className} aria-label={text}>
      {text.split(" ").map((word, w) => (
        <span key={w} aria-hidden className="inline-block whitespace-nowrap overflow-hidden pb-[0.12em] -mb-[0.12em] align-bottom">
          {Array.from(word).map((ch) => {
            const i = index++;
            return (
              <motion.span
                key={i}
                // Per-letter light wave instead of background-clip:text — iOS Safari renders
                // clipped gradient text invisible when its letters are transformed.
                className={shimmer ? "inline-block shimmer-letter" : "inline-block"}
                style={shimmer ? { animationDelay: `${1.6 + i * 0.07}s` } : undefined}
                initial={{ y: "110%", rotate: 8 }}
                animate={{ y: "0%", rotate: 0 }}
                transition={{ duration: 0.9, delay: delay + i * 0.025, ease: EASE }}
              >
                {ch}
              </motion.span>
            );
          })}
          {" "}
        </span>
      ))}
    </span>
  );
}

const longestWord = (text: string) => Math.max(...text.split(" ").map((w) => w.length));

function CountUp({ value }: { value: string }) {
  const match = value.match(/^(\d+)(.*)$/);
  const target = match ? Number(match[1]) : 0;
  const suffix = match ? match[2] : value;
  const [n, setN] = useState(0);
  useEffect(() => {
    const controls = animate(0, target, { duration: 1.8, delay: 0.6, ease: EASE, onUpdate: (v) => setN(Math.round(v)) });
    return () => controls.stop();
  }, [target]);
  return (
    <>
      {match ? n : ""}
      {suffix}
    </>
  );
}

export function Hero() {
  const { t } = useLanguage();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "35%"]);
  // Function form keeps opacity off the native ScrollTimeline path (see WorldMap).
  const contentOpacity = useTransform(scrollYProgress, (v) => 1 - Math.min(Math.max(v / 0.75, 0), 1));
  const globeScale = useTransform(scrollYProgress, [0, 1], [1, 1.25]);
  const globeY = useTransform(scrollYProgress, [0, 1], ["0%", "-12%"]);

  return (
    <section ref={ref} id="top" className="relative z-0 overflow-hidden pt-28 pb-24 md:pt-40 md:pb-36">
      <motion.div
        style={{ scale: globeScale, y: globeY }}
        className="absolute inset-0 -z-10 [mask-image:linear-gradient(black_60%,transparent)]"
      >
        <ParticleGlobe className="absolute inset-0" />
        <div
          aria-hidden
          className="pointer-events-none absolute -top-40 left-1/2 h-[600px] w-[900px] -translate-x-1/2 rounded-full opacity-70"
          style={{ background: "radial-gradient(circle, var(--accent-soft) 0%, transparent 70%)" }}
        />
      </motion.div>

      <motion.div style={{ y: contentY, opacity: contentOpacity }} className="relative mx-auto max-w-5xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 8, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="inline-flex items-center gap-2 rounded-full border border-surface-border bg-white/70 px-4 py-1.5 text-xs uppercase tracking-widest text-muted mb-8 shadow-sm md:backdrop-blur-md"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
          </span>
          {t.hero.overline}
        </motion.div>

        {/* Mobile size scales with the screen and the longest word, so every word fits on one line. */}
        <h1
          style={{ ["--n" as string]: longestWord(`${t.hero.headline} ${t.hero.headlineAccent}`) }}
          className="font-display text-[clamp(1.2rem,calc((100vw_-_48px)/(var(--n)*0.78)),2rem)] sm:text-5xl md:text-6xl lg:text-7xl leading-[1.15] tracking-tight"
        >
          <SplitReveal key={t.hero.headline} text={t.hero.headline} />
          <br />
          <SplitReveal
            key={t.hero.headlineAccent}
            text={t.hero.headlineAccent}
            delay={0.25}
            className="text-accent"
            shimmer
          />
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.8, delay: 0.7, ease: EASE }}
          className="mx-auto mt-6 max-w-2xl text-lg text-muted leading-relaxed"
        >
          {t.hero.subhead}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.85, ease: EASE }}
          className="mt-10 flex flex-col items-center gap-6"
        >
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 rounded-full border border-surface-border bg-white/85 md:bg-white/60 px-6 py-3 md:backdrop-blur-md shadow-[var(--surface-shadow)]">
            <div>
              <span className="font-display text-3xl text-accent tabular-nums">
                <CountUp value={t.hero.statProjectsValue} />
              </span>
              <span className="ml-2 text-sm text-muted">{t.hero.statProjectsLabel}</span>
            </div>
            <span className="hidden sm:block h-6 w-px bg-surface-border" />
            <span className="font-medium text-foreground">{t.hero.statCountries}</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1, ease: EASE }}
          className="mt-10"
        >
          <NavButton href="/consultation/" className="group relative overflow-hidden !px-8 !py-4 text-base">
            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            <span className="relative">{t.hero.cta}</span>
            <span className="relative transition-transform duration-300 group-hover:translate-x-1">→</span>
          </NavButton>
        </motion.div>
      </motion.div>
    </section>
  );
}

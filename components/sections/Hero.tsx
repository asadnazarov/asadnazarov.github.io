"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { NavButton } from "@/components/ui/Button";
import { DotField } from "@/components/motion/DotField";

export function Hero() {
  const { t } = useLanguage();

  return (
    <section id="top" className="relative z-0 overflow-hidden pt-28 pb-24 md:pt-40 md:pb-32">
      <div className="absolute inset-0 -z-10">
        <DotField className="absolute inset-0" />
        <div
          aria-hidden
          className="pointer-events-none absolute -top-40 left-1/2 h-[600px] w-[900px] -translate-x-1/2 rounded-full opacity-60 blur-[120px]"
          style={{ background: "radial-gradient(circle, var(--accent-soft) 0%, transparent 70%)" }}
        />
      </div>

      <div className="relative mx-auto max-w-5xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 rounded-full border border-surface-border bg-surface px-4 py-1.5 text-xs uppercase tracking-widest text-muted mb-8 shadow-sm"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          {t.hero.overline}
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.05] tracking-tight text-balance"
        >
          {t.hero.headline} <span className="text-accent">{t.hero.headlineAccent}</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto mt-6 max-w-2xl text-lg text-muted leading-relaxed"
        >
          {t.hero.subhead}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 flex flex-col items-center gap-6"
        >
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            <div>
              <span className="font-display text-3xl text-accent">{t.hero.statProjectsValue}</span>
              <span className="ml-2 text-sm text-muted">{t.hero.statProjectsLabel}</span>
            </div>
            <span className="hidden sm:block h-6 w-px bg-surface-border" />
            <span className="font-medium text-foreground">{t.hero.statCountries}</span>
          </div>
          <div className="text-sm text-muted">{t.hero.founderLine}</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10"
        >
          <NavButton href="/consultation/">{t.hero.cta}</NavButton>
        </motion.div>
      </div>
    </section>
  );
}

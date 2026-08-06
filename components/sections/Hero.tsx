"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { ButtonLink } from "@/components/ui/Button";

export function Hero() {
  const { t } = useLanguage();

  return (
    <section id="top" className="relative overflow-hidden pt-28 pb-24 md:pt-40 md:pb-32">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-[600px] w-[900px] -translate-x-1/2 rounded-full opacity-20 blur-[120px]"
        style={{ background: "radial-gradient(circle, var(--accent) 0%, transparent 70%)" }}
      />

      <div className="relative mx-auto max-w-5xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 rounded-full border border-surface-border px-4 py-1.5 text-xs uppercase tracking-widest text-muted mb-8"
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
          {t.hero.headline}{" "}
          <span className="text-accent">{t.hero.headlineAccent}</span>
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
          className="mt-10"
        >
          <ButtonLink href="#consultation">{t.hero.cta}</ButtonLink>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.55 }}
          className="mt-20 grid grid-cols-3 gap-6 border-t border-surface-border pt-10"
        >
          {[
            { value: t.hero.stat1Value, label: t.hero.stat1Label },
            { value: t.hero.stat2Value, label: t.hero.stat2Label },
            { value: t.hero.stat3Value, label: t.hero.stat3Label },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="font-display text-2xl md:text-4xl text-accent">{stat.value}</div>
              <div className="mt-1 text-xs md:text-sm text-muted leading-snug">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FadeIn } from "@/components/motion/FadeIn";

function Word({ word, progress, range }: { word: string; progress: MotionValue<number>; range: [number, number] }) {
  // Function form keeps opacity off the native ScrollTimeline path (see WorldMap).
  const opacity = useTransform(progress, (v) => 0.15 + 0.85 * Math.min(Math.max((v - range[0]) / (range[1] - range[0]), 0), 1));
  return (
    <motion.span style={{ opacity }} className="inline">
      {word}{" "}
    </motion.span>
  );
}

/** Words light up one after another as the paragraph scrolls through the viewport. */
function ScrollRevealText({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 55%"] });
  const words = text.split(" ");
  return (
    <p ref={ref} className={className}>
      {words.map((word, i) => (
        <Word key={i} word={word} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]} />
      ))}
    </p>
  );
}

export function About() {
  const { t } = useLanguage();

  return (
    <section id="about" className="py-24 md:py-36">
      <div className="mx-auto max-w-6xl px-6">
        <FadeIn>
          <SectionHeading heading={t.about.heading} />
        </FadeIn>

        <div className="mt-14 grid gap-12 lg:grid-cols-[auto_1.4fr_1fr] lg:items-start">
          <FadeIn className="flex justify-center lg:block">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/asad-hq.jpg"
              alt="Асад Назаров"
              className="h-28 w-28 lg:h-32 lg:w-32 rounded-full object-cover shadow-md shadow-accent/20"
            />
          </FadeIn>

          <div className="space-y-5">
            <FadeIn>
              <p className="font-display text-xl md:text-2xl">{t.about.subheading}</p>
            </FadeIn>
            {t.about.paragraphs.map((paragraph, i) => (
              <ScrollRevealText key={i} text={paragraph} className="text-foreground leading-relaxed text-base md:text-lg" />
            ))}
          </div>

          <ul className="space-y-4 border-l border-surface-border pl-6">
            {t.about.credentials.map((item, i) => (
              <FadeIn key={item} as="li" delay={i * 0.12} className="flex gap-3 text-sm md:text-base leading-relaxed">
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-accent shadow-[0_0_10px_var(--accent)]" />
                <span>{item}</span>
              </FadeIn>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

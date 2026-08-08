"use client";

import { useLanguage } from "@/lib/i18n/LanguageContext";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { NavButton } from "@/components/ui/Button";
import { FadeIn } from "@/components/motion/FadeIn";
import { DotField } from "@/components/motion/DotField";

const ICONS = [
  // magnifier
  <path key="search" d="M11 4a7 7 0 105.196 11.696l4.554 4.554a1 1 0 001.414-1.414l-4.554-4.554A7 7 0 0011 4zm-5 7a5 5 0 1110 0 5 5 0 01-10 0z" />,
  // wrench
  <path key="wrench" d="M21.7 6.3a1 1 0 00-1.6-.3l-2.9 2.9-1.6-.4-.4-1.6 2.9-2.9a1 1 0 00-.3-1.6A6 6 0 007 8.9a1 1 0 00-.3.9L2.3 14.2a2.5 2.5 0 003.5 3.5l4.4-4.4a1 1 0 00.9-.3A6 6 0 0021.7 6.3z" />,
  // rocket
  <path key="rocket" d="M12 2c3 2 5 6 4.5 10.5L19 15l-2 2-2.5 2.5L12 22c-1-2-2-4-2-6 0 0-4-1-6-4.5C6.5 8 10 6 12 2zm-1.5 12a1.5 1.5 0 103 0 1.5 1.5 0 00-3 0z" />,
];

export function Process() {
  const { t } = useLanguage();

  return (
    <section id="process" className="relative py-24 md:py-32 bg-background-soft overflow-hidden">
      <DotField className="absolute inset-0 -z-10 opacity-70" />

      <div className="relative mx-auto max-w-6xl px-6">
        <FadeIn>
          <SectionHeading
            eyebrow={t.process.eyebrow}
            heading={t.process.heading}
            subhead={t.process.subhead}
            align="center"
          />
        </FadeIn>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {t.process.steps.map((step, i) => (
            <FadeIn key={step.title} delay={i * 0.1}>
              <Card className="h-full">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-accent-soft text-accent">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                    {ICONS[i]}
                  </svg>
                </div>
                <div className="font-display text-xl mb-1">{step.title}</div>
                <p className="text-sm text-accent font-medium mb-4">{step.tagline}</p>
                <ul className="space-y-2.5">
                  {step.bullets.map((bullet) => (
                    <li key={bullet} className="flex gap-2.5 text-sm text-muted leading-relaxed">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={0.2} className="mt-14 flex flex-col items-center gap-6 text-center">
          <p className="text-lg font-medium">{t.process.ctaText}</p>
          <NavButton href="/consultation/">{t.process.ctaButton}</NavButton>
        </FadeIn>
      </div>
    </section>
  );
}

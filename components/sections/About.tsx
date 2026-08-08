"use client";

import { useLanguage } from "@/lib/i18n/LanguageContext";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FadeIn } from "@/components/motion/FadeIn";

export function About() {
  const { t } = useLanguage();

  return (
    <section id="about" className="py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <FadeIn>
          <SectionHeading heading={t.about.heading} />
        </FadeIn>

        <div className="mt-14 grid gap-12 lg:grid-cols-[1.4fr_1fr]">
          <FadeIn delay={0.1} className="space-y-5">
            {t.about.paragraphs.map((paragraph, i) => (
              <p key={i} className="text-muted leading-relaxed text-base md:text-lg">
                {paragraph}
              </p>
            ))}
          </FadeIn>

          <FadeIn delay={0.2}>
            <ul className="space-y-4 border-l border-surface-border pl-6">
              {t.about.credentials.map((item) => (
                <li key={item} className="flex gap-3 text-sm md:text-base leading-relaxed">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

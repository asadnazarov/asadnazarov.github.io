"use client";

import { useLanguage } from "@/lib/i18n/LanguageContext";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { FadeIn } from "@/components/motion/FadeIn";

export function CaseStudies() {
  const { t } = useLanguage();

  return (
    <section id="cases" className="py-24 md:py-32 bg-surface/30">
      <div className="mx-auto max-w-6xl px-6">
        <FadeIn>
          <SectionHeading heading={t.cases.heading} subhead={t.cases.subhead} />
        </FadeIn>

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {t.cases.items.map((item, i) => (
            <FadeIn key={item.industry} delay={i * 0.08}>
              <Card className="h-full flex flex-col">
                <div className="text-xs uppercase tracking-widest text-muted mb-3">{item.industry}</div>
                <dl className="space-y-3 text-sm md:text-base leading-relaxed">
                  <div>
                    <dt className="text-muted mb-1">{t.cases.labels.challenge}</dt>
                    <dd>{item.challenge}</dd>
                  </div>
                  <div>
                    <dt className="text-muted mb-1">{t.cases.labels.solution}</dt>
                    <dd>{item.solution}</dd>
                  </div>
                  <div className="pt-3 border-t border-surface-border">
                    <dt className="text-muted mb-1">{t.cases.labels.result}</dt>
                    <dd className="text-accent font-medium">{item.result}</dd>
                  </div>
                </dl>
              </Card>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

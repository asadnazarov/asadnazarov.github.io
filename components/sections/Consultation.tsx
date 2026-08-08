"use client";

import { useLanguage } from "@/lib/i18n/LanguageContext";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { FadeIn } from "@/components/motion/FadeIn";
import { ConsultationForm } from "@/components/forms/ConsultationForm";

export function Consultation() {
  const { t } = useLanguage();

  return (
    <section id="consultation" className="py-24 md:py-32 bg-surface/30">
      <div className="mx-auto max-w-6xl px-6">
        <FadeIn>
          <SectionHeading heading={t.consultation.heading} subhead={t.consultation.subhead} />
        </FadeIn>

        <div className="mt-14 grid gap-10 lg:grid-cols-2">
          <FadeIn delay={0.1} className="space-y-8">
            <div className="flex items-baseline gap-3">
              <span className="font-display text-5xl text-accent">{t.consultation.price}</span>
              <span className="text-sm text-muted">{t.consultation.priceNote}</span>
            </div>

            <div className="space-y-4">
              {t.consultation.outcomes.map((outcome, i) => (
                <Card key={outcome.title} className="p-5">
                  <div className="flex gap-4">
                    <span className="font-display text-accent text-sm shrink-0">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <div className="font-medium mb-1">{outcome.title}</div>
                      <p className="text-sm text-muted leading-relaxed">{outcome.description}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <div>
              <div className="text-xs uppercase tracking-widest text-muted mb-4">
                {t.consultation.processHeading}
              </div>
              <ol className="space-y-3">
                {t.consultation.processSteps.map((step, i) => (
                  <li key={step} className="flex gap-3 text-sm leading-relaxed">
                    <span className="font-display text-accent shrink-0">{i + 1}.</span>
                    <span className="text-muted">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
            <Card className="p-6 md:p-8">
              <ConsultationForm />
            </Card>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { Card } from "@/components/ui/Card";
import { FadeIn } from "@/components/motion/FadeIn";
import { ConsultationForm } from "@/components/forms/ConsultationForm";
import { SITE_NAME } from "@/lib/constants";

export function ConsultationPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background-soft">
      <header className="mx-auto flex max-w-3xl items-center justify-between px-6 py-6">
        <Link
          href="/"
          prefetch={false}
          className="inline-flex items-center gap-2 text-sm font-medium text-muted hover:text-foreground transition-colors"
        >
          <span aria-hidden>←</span> {t.consultationPage.backLabel}
        </Link>
        <LanguageSwitcher />
      </header>

      <main className="mx-auto max-w-3xl px-6 pb-24">
        <FadeIn className="text-center mb-10">
          <div className="text-sm font-semibold uppercase tracking-widest text-accent mb-3">
            {t.consultationPage.eyebrow}
          </div>
          <h1 className="font-display text-3xl md:text-5xl leading-tight tracking-tight">
            {t.consultationPage.heading}
          </h1>
          <p className="mt-4 text-lg text-muted leading-relaxed max-w-xl mx-auto">
            {t.consultationPage.subhead}
          </p>
        </FadeIn>

        <FadeIn delay={0.1} className="mb-8 rounded-2xl border border-accent/30 bg-accent-soft px-6 py-4">
          <div className="flex flex-wrap items-center justify-center gap-3 text-center">
            <div className="font-display text-2xl text-accent">{t.consultationPage.priceLabel}</div>
            <span className="hidden sm:block h-6 w-px bg-accent/30" />
            <div className="inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-background px-3 py-1 text-sm font-medium text-accent">
              <svg aria-hidden viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v5l3.5 2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {t.consultationPage.priceDuration}
            </div>
          </div>
          <p className="mt-2 text-sm text-muted text-center">{t.consultationPage.priceNote}</p>

          <details className="group mt-4 rounded-xl border border-accent/20 bg-background">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-sm font-semibold text-foreground marker:content-none">
              <span>{t.consultationPage.valueSubheading}</span>
              <svg
                aria-hidden
                viewBox="0 0 24 24"
                className="h-4 w-4 shrink-0 text-accent transition-transform duration-200 group-open:rotate-180"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </summary>
            <div className="px-4 pb-4 pt-1 text-left">
              <div className="space-y-3 text-sm text-muted leading-relaxed">
                {t.consultationPage.valueIntro.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
              <div className="mt-5 space-y-5">
                {t.consultationPage.valueItems.map((item, i) => (
                  <div key={item.title} className="flex gap-3">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent font-display text-xs">
                      {i + 1}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-foreground mb-1">{item.title}</div>
                      <div className="space-y-1.5 text-sm text-muted leading-relaxed">
                        {item.body.map((paragraph) => (
                          <p key={paragraph}>{paragraph}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </details>
        </FadeIn>

        <FadeIn delay={0.2}>
          <Card className="p-6 md:p-10">
            <ConsultationForm />
          </Card>
        </FadeIn>

        <p className="mt-10 text-center text-xs text-muted">{SITE_NAME}</p>
      </main>
    </div>
  );
}

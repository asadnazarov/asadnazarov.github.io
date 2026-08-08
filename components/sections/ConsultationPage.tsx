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

        <FadeIn delay={0.1} className="mb-8 rounded-2xl border border-accent/30 bg-accent-soft px-6 py-4 text-center">
          <div className="font-display text-2xl text-accent">{t.consultationPage.priceLabel}</div>
          <p className="mt-1 text-sm text-muted">{t.consultationPage.priceNote}</p>
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

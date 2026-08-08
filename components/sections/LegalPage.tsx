"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { FadeIn } from "@/components/motion/FadeIn";

export function LegalPage({ variant }: { variant: "privacy" | "terms" }) {
  const { t } = useLanguage();

  const title = variant === "privacy" ? t.legal.privacyTitle : t.legal.termsTitle;
  const body = variant === "privacy" ? t.legal.privacyBody : t.legal.termsBody;

  return (
    <div className="min-h-screen bg-background">
      <header className="mx-auto flex max-w-2xl items-center justify-between px-6 py-6">
        <Link
          href="/"
          prefetch={false}
          className="inline-flex items-center gap-2 text-sm font-medium text-muted hover:text-foreground transition-colors"
        >
          <span aria-hidden>←</span> {t.legal.backLabel}
        </Link>
        <LanguageSwitcher />
      </header>

      <main className="mx-auto max-w-2xl px-6 pb-24">
        <FadeIn>
          <h1 className="font-display text-3xl md:text-4xl leading-tight tracking-tight mb-8">{title}</h1>
          <div className="space-y-4">
            {body.map((paragraph, i) => (
              <p key={i} className="text-muted leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        </FadeIn>
      </main>
    </div>
  );
}

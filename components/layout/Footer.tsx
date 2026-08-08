"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { SITE_NAME, SOCIALS } from "@/lib/constants";

export function Footer() {
  const { t } = useLanguage();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-surface-border">
      <div className="mx-auto max-w-6xl px-6 py-16 grid gap-12 md:grid-cols-3">
        <div>
          <div className="font-display text-sm tracking-widest uppercase mb-4">{SITE_NAME}</div>
          <p className="text-muted text-sm leading-relaxed max-w-xs">{t.footer.tagline}</p>
        </div>

        <div>
          <div className="text-xs uppercase tracking-widest text-muted mb-4">{t.footer.contactHeading}</div>
          <div className="flex flex-col gap-2 text-sm">
            <a href={`mailto:${t.footer.email}`} className="hover:text-accent transition-colors">
              {t.footer.email}
            </a>
            <a href={SOCIALS.telegram} target="_blank" rel="noreferrer" className="hover:text-accent transition-colors">
              {t.footer.telegram}
            </a>
          </div>
        </div>

        <div>
          <div className="text-xs uppercase tracking-widest text-muted mb-4">{t.footer.socialsHeading}</div>
          <div className="flex flex-col gap-2 text-sm">
            <a href={SOCIALS.linkedin} target="_blank" rel="noreferrer" className="hover:text-accent transition-colors">
              LinkedIn
            </a>
            <a href={SOCIALS.instagram} target="_blank" rel="noreferrer" className="hover:text-accent transition-colors">
              Instagram
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-surface-border">
        <div className="mx-auto max-w-6xl px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted">
          <span>
            © {year} {SITE_NAME}. {t.footer.rights}
          </span>
          <div className="flex items-center gap-6">
            <Link href="/privacy/" prefetch={false} className="hover:text-accent transition-colors">
              {t.footer.privacy}
            </Link>
            <Link href="/terms/" prefetch={false} className="hover:text-accent transition-colors">
              {t.footer.terms}
            </Link>
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </footer>
  );
}

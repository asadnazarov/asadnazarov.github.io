"use client";

import { useLanguage } from "@/lib/i18n/LanguageContext";
import type { Locale } from "@/types";
import { cn } from "@/lib/utils";

const LOCALES: { value: Locale; label: string }[] = [
  { value: "ru", label: "RU" },
  { value: "uz", label: "UZ" },
];

export function LanguageSwitcher() {
  const { locale, setLocale } = useLanguage();

  return (
    <div className="flex items-center rounded-full border border-surface-border p-1 text-xs font-medium">
      {LOCALES.map(({ value, label }) => (
        <button
          key={value}
          type="button"
          onClick={() => setLocale(value)}
          aria-pressed={locale === value}
          className={cn(
            "rounded-full px-3 py-1.5 transition-colors duration-200",
            locale === value ? "bg-accent text-accent-foreground" : "text-muted hover:text-foreground"
          )}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

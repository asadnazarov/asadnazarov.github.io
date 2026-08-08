"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { NavButton } from "@/components/ui/Button";
import { SITE_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function Header() {
  const { t } = useLanguage();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-colors duration-300",
        scrolled ? "bg-background/80 backdrop-blur-md border-b border-surface-border" : "bg-transparent"
      )}
    >
      <div className="mx-auto max-w-6xl px-6 h-16 md:h-20 flex items-center justify-between">
        <a href="#top" className="font-display text-sm tracking-widest uppercase">
          {SITE_NAME}
        </a>

        <nav className="hidden md:flex items-center gap-8 text-sm text-muted">
          {t.nav.items.map((item) => (
            <a key={item.href} href={item.href} className="hover:text-foreground transition-colors">
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <NavButton
            href="/consultation/"
            className="hidden sm:inline-flex !px-4 !py-2"
          >
            {t.nav.cta}
          </NavButton>
        </div>
      </div>
    </header>
  );
}

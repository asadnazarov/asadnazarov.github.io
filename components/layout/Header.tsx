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
  const [overDark, setOverDark] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 8);
      // Switch to a dark glass while the night-time map stage is under the header.
      const map = document.getElementById("projects")?.getBoundingClientRect();
      setOverDark(!!map && map.top <= 40 && map.bottom >= 40);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-colors duration-300",
        overDark
          ? "bg-[#040b1f]/60 backdrop-blur-md border-b border-white/10 text-white"
          : scrolled
            ? "bg-background/80 backdrop-blur-md border-b border-surface-border"
            : "bg-transparent"
      )}
    >
      <div className="mx-auto max-w-6xl px-6 h-16 md:h-20 flex items-center justify-between">
        <a href="#top" className="font-display text-sm tracking-widest uppercase">
          {SITE_NAME}
        </a>

        <nav className={cn("hidden md:flex items-center gap-8 text-sm", overDark ? "text-white/60" : "text-muted")}>
          {t.nav.items.map((item) => (
            <a key={item.href} href={item.href} className={cn("transition-colors", overDark ? "hover:text-white" : "hover:text-foreground")}>
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

"use client";

import { useLanguage } from "@/lib/i18n/LanguageContext";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { FadeIn } from "@/components/motion/FadeIn";

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function Testimonials() {
  const { t } = useLanguage();

  return (
    <section id="testimonials" className="py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <FadeIn>
          <SectionHeading heading={t.testimonials.heading} />
        </FadeIn>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {t.testimonials.items.map((item, i) => (
            <FadeIn key={item.name} delay={i * 0.08}>
              <Card className="h-full flex flex-col">
                <p className="text-sm md:text-base leading-relaxed flex-1">&ldquo;{item.quote}&rdquo;</p>
                <div className="mt-6 flex items-center gap-3 pt-4 border-t border-surface-border">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent font-display text-xs">
                    {initials(item.name)}
                  </div>
                  <div>
                    <div className="text-sm font-medium">{item.name}</div>
                    <div className="text-xs text-muted">{item.role}</div>
                  </div>
                </div>
              </Card>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

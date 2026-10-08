"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useSpring, useTransform, type MotionValue } from "framer-motion";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FadeIn } from "@/components/motion/FadeIn";
import type { Testimonial } from "@/types";

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function useIsDesktop() {
  const [desktop, setDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const sync = () => setDesktop(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  return desktop;
}

interface FanCardProps {
  item: Testimonial;
  index: number;
  count: number;
  progress: MotionValue<number>;
  fan: boolean;
}

function FanCard({ item, index, count, progress, fan }: FanCardProps) {
  const fromCenter = (count - 1) / 2 - index;
  // Cards start stacked in the middle, fanned like a hand of cards, then deal out into the row.
  const x = useTransform(progress, [0, 1], [fan ? `${fromCenter * 104}%` : "0%", "0%"]);
  const rotate = useTransform(progress, [0, 1], [fan ? -fromCenter * 7 : 0, 0]);
  const y = useTransform(progress, [0, 1], [fan ? Math.abs(fromCenter) * 30 : 40, 0]);
  const opacity = useTransform(progress, [0, 0.3], [fan ? 1 : 0, 1]);

  return (
    <motion.div style={{ x, rotate, y, opacity, zIndex: count - Math.abs(Math.round(fromCenter)) }} className="relative">
      <div className="group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-surface-border bg-white/95 md:bg-white/80 p-7 md:p-8 shadow-[0_25px_60px_-20px_rgba(15,23,42,0.2)] md:backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:border-accent/40">
        <div aria-hidden className="absolute right-5 top-3 font-display text-[6rem] leading-[0.8] text-accent/10">
          &rdquo;
        </div>
        <div className="mb-4 flex gap-0.5 text-accent">
          {Array.from({ length: 5 }, (_, s) => (
            <svg key={s} viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor" aria-hidden>
              <path d="M10 1.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L10 14.9l-5.2 2.7 1-5.8L1.5 7.7l5.9-.9L10 1.5z" />
            </svg>
          ))}
        </div>
        <p className="relative flex-1 text-sm md:text-base leading-relaxed">&ldquo;{item.quote}&rdquo;</p>
        <div className="mt-6 flex items-center gap-3 border-t border-surface-border pt-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-accent to-[#7fb0ff] font-display text-xs text-white shadow-md shadow-accent/30">
            {initials(item.name)}
          </div>
          <div>
            <div className="text-sm font-semibold">{item.name}</div>
            <div className="text-xs text-muted">{item.role}</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function Testimonials() {
  const { t } = useLanguage();
  const gridRef = useRef<HTMLDivElement>(null);
  const fan = useIsDesktop();
  const { scrollYProgress } = useScroll({ target: gridRef, offset: ["start 95%", "start 35%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 26 });
  const items = t.testimonials.items;

  return (
    <section id="testimonials" className="py-24 md:py-36">
      <div className="mx-auto max-w-6xl px-6">
        <FadeIn>
          <SectionHeading
            eyebrow={t.testimonials.eyebrow}
            heading={t.testimonials.heading}
            subhead={t.testimonials.subhead}
            align="center"
          />
        </FadeIn>

        <div ref={gridRef} className="mt-16 grid gap-6 md:grid-cols-3">
          {items.map((item, i) => (
            <FanCard key={item.name} item={item} index={i} count={items.length} progress={progress} fan={fan} />
          ))}
        </div>
      </div>
    </section>
  );
}

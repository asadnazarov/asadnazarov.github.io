"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { LayoutGroup, motion, useInView } from "framer-motion";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { CLIENTS, clientsIn, type CountryCode } from "@/lib/clients";
import { FLAGS } from "@/components/ui/Flags";
import { cn } from "@/lib/utils";

const CYCLE_MS = 3200;
const RESUME_AFTER_MS = 12000;
const EASE = [0.16, 1, 0.3, 1] as const;

// Tabs: everyone first, then countries by number of clients.
const COUNTRIES: CountryCode[] = (["UZ", "GB", "US", "MD"] as CountryCode[]).sort(
  (a, b) => clientsIn(b).length - clientsIn(a).length
);
type Filter = CountryCode | "ALL";
const FILTERS: Filter[] = ["ALL", ...COUNTRIES];

/**
 * A case wall: every client is always visible with its logo, name and country.
 * Country tabs cycle on their own — the chosen country's cards shuffle to the
 * front and light up, so a visitor sees the geography without waiting for anything.
 */
export function Clients() {
  const { t } = useLanguage();
  const wallRef = useRef<HTMLDivElement>(null);
  const inView = useInView(wallRef, { margin: "-15% 0px" });
  const [filter, setFilter] = useState<Filter>("ALL");
  const [manual, setManual] = useState(false); // a visitor picked a tab — hold it for a while

  useEffect(() => {
    if (manual || !inView || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setTimeout(() => {
      setFilter((f) => FILTERS[(FILTERS.indexOf(f) + 1) % FILTERS.length]);
    }, CYCLE_MS);
    return () => window.clearTimeout(id);
  }, [filter, inView, manual]);

  useEffect(() => {
    if (!manual) return;
    const id = window.setTimeout(() => setManual(false), RESUME_AFTER_MS);
    return () => window.clearTimeout(id);
  }, [manual, filter]);

  const choose = (f: Filter) => {
    setFilter(f);
    setManual(true);
  };

  // Selected country's clients move to the front; everyone else keeps their order.
  const ordered = useMemo(
    () => (filter === "ALL" ? CLIENTS : [...clientsIn(filter), ...CLIENTS.filter((c) => c.country !== filter)]),
    [filter]
  );
  const auto = !manual;

  return (
    <section className="relative py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: EASE }}
          className="flex flex-col items-center gap-3 text-center md:flex-row md:items-end md:justify-center md:gap-6 md:text-left"
        >
          <span className="font-display text-7xl md:text-8xl leading-none text-accent">{CLIENTS.length}</span>
          <span className="max-w-xs font-display text-xl md:text-2xl leading-snug md:pb-2">{t.clients.countLabel}</span>
        </motion.div>

        {/* Country tabs */}
        <div className="mt-10 -mx-4 overflow-x-auto px-4 [scrollbar-width:none] md:mx-0 md:px-0">
          <div className="mx-auto flex w-max gap-2 md:gap-3">
            {FILTERS.map((f) => {
              const active = f === filter;
              const count = f === "ALL" ? CLIENTS.length : clientsIn(f).length;
              const Flag = f === "ALL" ? null : FLAGS[f];
              return (
                <button
                  key={f}
                  type="button"
                  onClick={() => choose(f)}
                  aria-pressed={active}
                  className={cn(
                    "relative flex items-center gap-2 overflow-hidden rounded-full border px-4 py-2 text-sm font-semibold transition-colors duration-300",
                    active
                      ? "border-accent bg-accent text-white shadow-[0_8px_24px_-6px_rgba(47,123,246,0.6)]"
                      : "border-surface-border bg-white text-foreground hover:border-accent/40"
                  )}
                >
                  {Flag && <Flag className="h-3 w-[18px] rounded-[2px]" />}
                  <span className="whitespace-nowrap">{f === "ALL" ? t.clients.allLabel : t.worldMap.countries[f]}</span>
                  <span
                    className={cn(
                      "rounded-full px-1.5 text-xs tabular-nums",
                      active ? "bg-white/25" : "bg-accent-soft text-accent"
                    )}
                  >
                    {count}
                  </span>
                  {/* Auto-cycle timer */}
                  {active && auto && inView && (
                    <span
                      key={filter}
                      aria-hidden
                      className="tab-timer absolute bottom-0 left-0 h-[2px] bg-white/80"
                      style={{ animationDuration: `${CYCLE_MS}ms` }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Case wall */}
        <LayoutGroup>
          <div ref={wallRef} className="mt-8 grid grid-cols-3 gap-2.5 sm:grid-cols-4 md:gap-4 lg:grid-cols-5">
            {ordered.map((client, i) => {
              const Flag = FLAGS[client.country];
              const lit = filter === "ALL" || client.country === filter;
              return (
                <motion.div
                  key={client.name}
                  layout
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ layout: { duration: 0.7, ease: EASE }, duration: 0.6, delay: (i % 5) * 0.06, ease: EASE }}
                  className={cn(
                    "group relative flex flex-col items-center overflow-hidden rounded-2xl border bg-white px-2 pb-3 pt-4 md:rounded-3xl md:px-4 md:pb-5 md:pt-6 text-center transition-[opacity,box-shadow,border-color,filter] duration-500",
                    lit
                      ? "border-surface-border shadow-[0_14px_40px_-18px_rgba(15,23,42,0.35)]"
                      : "border-transparent opacity-35 grayscale",
                    lit && filter !== "ALL" && "border-accent/50 shadow-[0_18px_50px_-16px_rgba(47,123,246,0.55)]"
                  )}
                >
                  <span aria-hidden className="card-sheen pointer-events-none absolute inset-0" />
                  <div className="h-12 w-12 md:h-20 md:w-20 overflow-hidden rounded-full border border-surface-border bg-white transition-transform duration-500 group-hover:scale-110">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={client.src} alt={client.name} loading="lazy" className="h-full w-full object-cover" />
                  </div>
                  <div className="mt-2.5 md:mt-4 w-full truncate text-[10px] md:text-sm font-bold tracking-tight">
                    {client.name}
                  </div>
                  <div className="mt-1 flex items-center gap-1 text-[9px] md:text-xs text-muted">
                    <Flag className="h-2 w-3 md:h-2.5 md:w-4 rounded-[1px]" />
                    <span className="truncate">{t.worldMap.countries[client.country]}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </LayoutGroup>
      </div>
    </section>
  );
}

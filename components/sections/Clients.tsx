"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { CLIENTS, type Client } from "@/lib/clients";
import { FLAGS } from "@/components/ui/Flags";

const SPEED_PX_PER_S = 55; // identical for both rows, on every screen
const EASE = [0.16, 1, 0.3, 1] as const;

// Each client appears in exactly one row, so no logo ever meets its own twin.
const ROW_A = CLIENTS.filter((_, i) => i % 2 === 0);
const ROW_B = CLIENTS.filter((_, i) => i % 2 === 1);
// Copies per track: the animated half (two sets) is always wider than any screen.
const COPIES = 4;

function LogoChip({ client }: { client: Client }) {
  const Flag = FLAGS[client.country];
  return (
    <div className="mr-4 md:mr-6 flex shrink-0 items-center gap-3 rounded-full border border-surface-border bg-white py-2 pl-2 pr-5 shadow-[var(--surface-shadow)]">
      <div className="h-11 w-11 md:h-14 md:w-14 overflow-hidden rounded-full border border-surface-border bg-white">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={client.src} alt={client.name} loading="lazy" className="h-full w-full object-cover" />
      </div>
      <div className="flex items-center gap-1.5 whitespace-nowrap text-xs md:text-sm font-bold tracking-tight">
        <Flag className="h-2.5 w-4 shrink-0 rounded-[1px]" />
        {client.name}
      </div>
    </div>
  );
}

/**
 * A pure CSS marquee: runs on the compositor at a constant pace and ignores scrolling.
 * Duration is derived from the measured width so px/second is the same for every row,
 * even though the rows hold a different number of logos.
 */
function MarqueeRow({ items, reverse }: { items: Client[]; reverse?: boolean }) {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const setDuration = () => {
      const half = track.scrollWidth / 2;
      track.style.animationDuration = `${half / SPEED_PX_PER_S}s`;
    };
    setDuration();
    const ro = new ResizeObserver(setDuration);
    ro.observe(track);

    // CSS animations advance on wall-clock time even in a hidden tab; pause so the
    // row doesn't "teleport" when the visitor comes back.
    const syncPlayState = () => {
      track.style.animationPlayState = document.hidden ? "paused" : "running";
    };
    document.addEventListener("visibilitychange", syncPlayState);
    return () => {
      ro.disconnect();
      document.removeEventListener("visibilitychange", syncPlayState);
    };
  }, []);

  return (
    <div
      ref={trackRef}
      // Trailing margins (not gap) keep the two copies exactly equal, so -50% loops seamlessly.
      className={`marquee-track flex w-max py-2 ${reverse ? "marquee-reverse" : ""}`}
    >
      {Array.from({ length: COPIES }, (_, copy) =>
        items.map((client) => <LogoChip key={`${copy}-${client.name}`} client={client} />)
      )}
    </div>
  );
}

export function Clients() {
  const { t } = useLanguage();

  return (
    <section className="relative py-16 md:py-24">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, ease: EASE }}
        className="mx-auto mb-10 flex max-w-6xl flex-col items-center gap-3 px-6 text-center md:mb-14 md:flex-row md:items-end md:justify-center md:gap-6 md:text-left"
      >
        <span className="font-display text-7xl md:text-8xl leading-none text-accent">{CLIENTS.length}</span>
        <span className="max-w-xs font-display text-xl md:text-2xl leading-snug md:pb-2">{t.clients.countLabel}</span>
      </motion.div>

      <div className="flex flex-col gap-4 md:gap-6 overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_8%,black_92%,transparent)]">
        <MarqueeRow items={ROW_A} />
        <MarqueeRow items={ROW_B} reverse />
      </div>
    </section>
  );
}

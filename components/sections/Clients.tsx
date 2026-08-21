"use client";

import { FlagGB, FlagMD, FlagUS, FlagUZ } from "@/components/ui/Flags";
import { useEffect, useRef, type ComponentType } from "react";

interface ClientLogo {
  src: string;
  name: string;
  Flag?: ComponentType<{ className?: string }>;
}

const CLIENTS: ClientLogo[] = [
  { src: "/images/clients/agiron.png", name: "AGIRON", Flag: FlagUZ },
  { src: "/images/clients/art-house.png", name: "ART HOUSE", Flag: FlagUZ },
  { src: "/images/clients/avtotest7.jpg", name: "AVTOTEST7", Flag: FlagUZ },
  { src: "/images/clients/donzar.png", name: "DONZAR", Flag: FlagUZ },
  { src: "/images/clients/easy-tag.jpg", name: "EASY TAG", Flag: FlagGB },
  { src: "/images/clients/enjen-digital.png", name: "ENJEN DIGITAL", Flag: FlagUS },
  { src: "/images/clients/nbuild-group.png", name: "NBUILD GROUP", Flag: FlagUZ },
  { src: "/images/clients/prava-on.png", name: "PRAVA-ON", Flag: FlagUZ },
  { src: "/images/clients/refind-commerce.webp", name: "REFIND COMMERCE", Flag: FlagGB },
  { src: "/images/clients/ria-marketing.png", name: "RIA MARKETING", Flag: FlagUZ },
  { src: "/images/clients/sargu-trans.jpg", name: "SARGU TRANS", Flag: FlagMD },
  { src: "/images/clients/soro.png", name: "SORO", Flag: FlagUZ },
];

const LOOP = [...CLIENTS, ...CLIENTS];

export function Clients() {
  const trackRef = useRef<HTMLDivElement>(null);

  // CSS animations keep advancing on wall-clock time even while the tab/screen is hidden.
  // Without pausing, coming back from a backgrounded tab or locked phone screen makes the
  // track "teleport" to wherever it should be by now, which reads as a jarring glitch.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const syncPlayState = () => {
      track.style.animationPlayState = document.hidden ? "paused" : "running";
    };
    syncPlayState();
    document.addEventListener("visibilitychange", syncPlayState);
    return () => document.removeEventListener("visibilitychange", syncPlayState);
  }, []);

  return (
    <section className="py-16 overflow-hidden">
      <div ref={trackRef} className="marquee-track flex w-max items-start gap-20 px-6">
        {LOOP.map((client, i) => (
          <div key={`${client.name}-${i}`} className="flex w-28 shrink-0 flex-col items-center gap-2.5">
            <div className="h-20 w-20 overflow-hidden rounded-full border border-surface-border shadow-[var(--surface-shadow)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={client.src} alt={client.name} className="h-full w-full object-cover" />
            </div>
            <div className="flex items-center gap-1 text-center text-[13px] font-bold tracking-tight text-foreground whitespace-nowrap">
              {client.Flag && <client.Flag className="h-2.5 w-4 shrink-0 rounded-[1px]" />}
              {client.name}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

"use client";

import { FlagGB, FlagMD, FlagUS } from "@/components/ui/Flags";
import type { ComponentType } from "react";

interface ClientLogo {
  src: string;
  name: string;
  Flag?: ComponentType<{ className?: string }>;
}

const CLIENTS: ClientLogo[] = [
  { src: "/images/clients/agiron.png", name: "AGIRON" },
  { src: "/images/clients/avtotest7.jpg", name: "AVTOTEST7" },
  { src: "/images/clients/donzar.png", name: "DONZAR" },
  { src: "/images/clients/easy-tag.jpg", name: "EASY TAG", Flag: FlagGB },
  { src: "/images/clients/enjen-digital.png", name: "ENJEN DIGITAL", Flag: FlagUS },
  { src: "/images/clients/prava-on.png", name: "PRAVA-ON" },
  { src: "/images/clients/refind-commerce.webp", name: "REFIND COMMERCE", Flag: FlagGB },
  { src: "/images/clients/ria-marketing.png", name: "RIA MARKETING" },
  { src: "/images/clients/sargu-trans.jpg", name: "SARGU TRANS", Flag: FlagMD },
  { src: "/images/clients/soro.png", name: "SORO" },
];

const LOOP = [...CLIENTS, ...CLIENTS];

export function Clients() {
  return (
    <section className="py-16 border-t border-b border-surface-border overflow-hidden">
      <div className="marquee-track flex w-max items-start gap-10 px-6">
        {LOOP.map((client, i) => (
          <div key={`${client.name}-${i}`} className="flex w-20 shrink-0 flex-col items-center gap-2.5">
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

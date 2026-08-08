"use client";

interface ClientLogo {
  src: string;
  name: string;
  flag?: string;
}

const CLIENTS: ClientLogo[] = [
  { src: "/images/clients/agiron.png", name: "AGIRON" },
  { src: "/images/clients/avtotest7.jpg", name: "AVTOTEST7" },
  { src: "/images/clients/donzar.png", name: "DONZAR" },
  { src: "/images/clients/easy-tag.jpg", name: "EASY TAG", flag: "🇬🇧" },
  { src: "/images/clients/enjen-digital.png", name: "ENJEN DIGITAL", flag: "🇺🇸" },
  { src: "/images/clients/prava-on.png", name: "PRAVA-ON" },
  { src: "/images/clients/refind-commerce.webp", name: "REFIND COMMERCE", flag: "🇬🇧" },
  { src: "/images/clients/ria-marketing.png", name: "RIA MARKETING" },
  { src: "/images/clients/sargu-trans.jpg", name: "SARGU TRANS", flag: "🇲🇩" },
  { src: "/images/clients/soro.png", name: "SORO" },
];

const LOOP = [...CLIENTS, ...CLIENTS];

export function Clients() {
  return (
    <section className="py-16 border-t border-b border-surface-border overflow-hidden">
      <div className="marquee-track flex w-max items-start gap-10 px-6">
        {LOOP.map((client, i) => (
          <div key={`${client.name}-${i}`} className="client-logo flex w-20 shrink-0 flex-col items-center gap-2">
            <div className="flex h-20 w-20 items-center justify-center rounded-full border border-surface-border bg-white p-3 shadow-[var(--surface-shadow)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={client.src} alt={client.name} className="max-h-full max-w-full object-contain" />
            </div>
            <div className="text-center text-xs font-medium text-muted whitespace-nowrap">
              {client.flag && <span className="mr-1">{client.flag}</span>}
              {client.name}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

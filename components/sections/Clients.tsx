"use client";

import { useEffect, useRef } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  type MotionValue,
} from "framer-motion";
import { CLIENTS, type Client } from "@/lib/clients";
import { FLAGS } from "@/components/ui/Flags";

const COPIES = 4;
const ROW_A = CLIENTS.filter((_, i) => i % 2 === 0);
const ROW_B = CLIENTS.filter((_, i) => i % 2 === 1).reverse();

function LogoChip({ client }: { client: Client }) {
  const Flag = FLAGS[client.country];
  return (
    <div className="group flex shrink-0 items-center gap-3 rounded-full border border-surface-border bg-white/70 py-2 pl-2 pr-5 shadow-[var(--surface-shadow)] backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-accent/50 hover:shadow-[0_10px_40px_rgba(47,123,246,0.25)]">
      <div className="h-11 w-11 md:h-14 md:w-14 overflow-hidden rounded-full border border-surface-border bg-white">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={client.src}
          alt={client.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>
      <div className="flex items-center gap-1.5 whitespace-nowrap text-xs md:text-sm font-bold tracking-tight">
        <Flag className="h-2.5 w-4 shrink-0 rounded-[1px]" />
        {client.name}
      </div>
    </div>
  );
}

interface RowProps {
  items: Client[];
  speed: number; // px per second at rest
  direction: 1 | -1;
  boost: MotionValue<number>;
  skew: MotionValue<number>;
}

function MarqueeRow({ items, speed, direction, boost, skew }: RowProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const setWidth = useRef(0);
  const dir = useRef<number>(direction);
  const x = useMotionValue(0);
  const rowSkew = useTransform(skew, (s) => s * direction);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const measure = () => (setWidth.current = track.scrollWidth / COPIES);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(track);
    return () => ro.disconnect();
  }, []);

  useAnimationFrame((_, delta) => {
    const w = setWidth.current;
    if (!w || document.hidden) return;
    const b = boost.get();
    // Scrolling up flips the rows; scrolling fast throws them forward.
    if (b < -0.05) dir.current = -direction;
    else if (b > 0.05) dir.current = direction;
    const step = dir.current * speed * (1 + Math.abs(b)) * (Math.min(delta, 64) / 1000);
    const next = (((x.get() - step) % w) - w) % w;
    x.set(next);
  });

  return (
    <motion.div ref={trackRef} style={{ x, skewX: rowSkew }} className="flex w-max gap-4 md:gap-6 py-2 will-change-transform">
      {Array.from({ length: COPIES }, (_, copy) =>
        items.map((client) => <LogoChip key={`${copy}-${client.name}`} client={client} />)
      )}
    </motion.div>
  );
}

export function Clients() {
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(velocity, { damping: 50, stiffness: 300 });
  const boost = useTransform(smoothVelocity, [-1500, 0, 1500], [-6, 0, 6], { clamp: false });
  const skew = useTransform(smoothVelocity, [-2500, 0, 2500], [6, 0, -6]);

  return (
    <section className="relative py-16 md:py-24 overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_8%,black_92%,transparent)]">
      <div className="flex flex-col gap-4 md:gap-6">
        <MarqueeRow items={ROW_A} speed={55} direction={1} boost={boost} skew={skew} />
        <MarqueeRow items={ROW_B} speed={65} direction={-1} boost={boost} skew={skew} />
      </div>
    </section>
  );
}

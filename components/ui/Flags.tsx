import type { ReactElement } from "react";

interface FlagProps {
  className?: string;
}

export function FlagGB({ className }: FlagProps) {
  return (
    <svg viewBox="0 0 60 40" className={className} aria-hidden>
      <rect width="60" height="40" fill="#012169" />
      <path d="M0,0 60,40 M60,0 0,40" stroke="#fff" strokeWidth="8" />
      <path d="M0,0 60,40 M60,0 0,40" stroke="#C8102E" strokeWidth="3" />
      <path d="M30,0 30,40 M0,20 60,20" stroke="#fff" strokeWidth="13" />
      <path d="M30,0 30,40 M0,20 60,20" stroke="#C8102E" strokeWidth="8" />
    </svg>
  );
}

export function FlagUS({ className }: FlagProps) {
  const stripeH = 40 / 13;
  const redStripeIndices = [0, 2, 4, 6, 8, 10, 12];
  const cantonW = 26;
  const cantonH = stripeH * 7;

  const stars: ReactElement[] = [];
  const rows = 4;
  const cols = 5;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const offsetX = r % 2 === 0 ? 0 : cantonW / (cols * 2);
      const cx = (cantonW / cols) * (c + 0.5) - offsetX / 2 + offsetX;
      const cy = (cantonH / rows) * (r + 0.5);
      stars.push(<circle key={`${r}-${c}`} cx={cx} cy={cy} r="0.9" fill="#fff" />);
    }
  }

  return (
    <svg viewBox="0 0 60 40" className={className} aria-hidden>
      <rect width="60" height="40" fill="#fff" />
      {redStripeIndices.map((k) => (
        <rect key={k} y={k * stripeH} width="60" height={stripeH} fill="#B22234" />
      ))}
      <rect width={cantonW} height={cantonH} fill="#3C3B6E" />
      {stars}
    </svg>
  );
}

export function FlagUZ({ className }: FlagProps) {
  const stars = Array.from({ length: 8 }, (_, i) => {
    const angle = -90 + i * 12.5;
    const rad = (angle * Math.PI) / 180;
    const cx = 9 + 5 * Math.cos(rad);
    const cy = 6 + 5 * Math.sin(rad);
    return <circle key={i} cx={cx} cy={cy} r="0.6" fill="#fff" />;
  });

  return (
    <svg viewBox="0 0 60 40" className={className} aria-hidden>
      <rect width="60" height="40" fill="#1EB53A" />
      <rect y="0" width="60" height="12" fill="#0099B5" />
      <rect y="12" width="60" height="2" fill="#CE1126" />
      <rect y="14" width="60" height="12" fill="#fff" />
      <rect y="26" width="60" height="2" fill="#CE1126" />
      <circle cx="8.5" cy="6" r="4.2" fill="#fff" />
      <circle cx="10" cy="6" r="3.6" fill="#0099B5" />
      {stars}
    </svg>
  );
}

export function FlagMD({ className }: FlagProps) {
  return (
    <svg viewBox="0 0 60 40" className={className} aria-hidden>
      <rect width="20" height="40" fill="#003DA5" />
      <rect x="20" width="20" height="40" fill="#FFD200" />
      <rect x="40" width="20" height="40" fill="#CE1126" />
      <circle cx="30" cy="20" r="6" fill="#7B3F00" opacity="0.85" />
    </svg>
  );
}

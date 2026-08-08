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
  return (
    <svg viewBox="0 0 60 40" className={className} aria-hidden>
      <rect width="60" height="40" fill="#fff" />
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <rect key={i} y={(i * 40) / 13} width="60" height={40 / 13} fill="#B22234" />
      ))}
      <rect width="26" height="21.5" fill="#3C3B6E" />
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

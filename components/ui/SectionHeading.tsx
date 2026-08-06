interface SectionHeadingProps {
  number: string;
  eyebrow: string;
  heading: string;
  subhead?: string;
  align?: "left" | "center";
}

export function SectionHeading({ number, eyebrow, heading, subhead, align = "left" }: SectionHeadingProps) {
  return (
    <div className={align === "center" ? "text-center mx-auto max-w-2xl" : ""}>
      <div className={`flex items-center gap-3 text-sm text-muted mb-4 ${align === "center" ? "justify-center" : ""}`}>
        <span className="font-display text-accent">{number}</span>
        <span className="h-px w-8 bg-surface-border" />
        <span className="uppercase tracking-widest">{eyebrow}</span>
      </div>
      <h2 className="font-display text-3xl md:text-4xl lg:text-5xl leading-tight tracking-tight">
        {heading}
      </h2>
      {subhead && <p className="mt-4 text-muted text-lg leading-relaxed">{subhead}</p>}
    </div>
  );
}

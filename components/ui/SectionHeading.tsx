interface SectionHeadingProps {
  heading: string;
  subhead?: string;
  align?: "left" | "center";
}

export function SectionHeading({ heading, subhead, align = "left" }: SectionHeadingProps) {
  return (
    <div className={align === "center" ? "text-center mx-auto max-w-2xl" : ""}>
      <h2 className="font-display text-3xl md:text-4xl lg:text-5xl leading-tight tracking-tight">
        {heading}
      </h2>
      {subhead && <p className="mt-4 text-muted text-lg leading-relaxed">{subhead}</p>}
    </div>
  );
}

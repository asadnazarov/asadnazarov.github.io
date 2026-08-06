import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function Card({ className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-surface-border bg-surface p-6 md:p-8 transition-colors duration-300 hover:border-accent/30",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

import type { ButtonHTMLAttributes, AnchorHTMLAttributes, ReactNode } from "react";
import Link, { type LinkProps } from "next/link";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-50 disabled:pointer-events-none";

const variants: Record<Variant, string> = {
  primary: "bg-accent text-accent-foreground shadow-md shadow-accent/20 hover:brightness-110 hover:scale-[1.02] active:scale-[0.98]",
  secondary:
    "bg-transparent text-foreground border border-surface-border hover:border-accent/50 hover:bg-background-soft",
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  children: ReactNode;
}

export function Button({ variant = "primary", className, children, ...props }: ButtonProps) {
  return (
    <button className={cn(base, variants[variant], className)} {...props}>
      {children}
    </button>
  );
}

interface ButtonLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: Variant;
  children: ReactNode;
}

export function ButtonLink({ variant = "primary", className, children, ...props }: ButtonLinkProps) {
  return (
    <a className={cn(base, variants[variant], className)} {...props}>
      {children}
    </a>
  );
}

interface NavButtonProps extends LinkProps {
  variant?: Variant;
  className?: string;
  children: ReactNode;
}

export function NavButton({ variant = "primary", className, children, prefetch = false, ...props }: NavButtonProps) {
  return (
    <Link className={cn(base, variants[variant], className)} prefetch={prefetch} {...props}>
      {children}
    </Link>
  );
}

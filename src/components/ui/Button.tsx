import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant = "light" | "dark" | "outline-light" | "outline-dark";

const variants: Record<Variant, string> = {
  light: "bg-paper text-ink",
  dark: "bg-ink text-paper",
  "outline-light": "text-paper ring-1 ring-inset ring-paper/30",
  "outline-dark": "text-ink ring-1 ring-inset ring-ink/25",
};

const fill: Record<Variant, string> = {
  light: "bg-mint",
  dark: "bg-brand",
  "outline-light": "bg-paper",
  "outline-dark": "bg-ink",
};

const hoverText: Record<Variant, string> = {
  light: "group-hover:text-ink",
  dark: "group-hover:text-paper",
  "outline-light": "group-hover:text-ink",
  "outline-dark": "group-hover:text-paper",
};

export function Arrow({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={`size-4 ${className}`}>
      <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

type Props = { variant?: Variant; children: ReactNode; className?: string } & (
  | ({ href: string } & Omit<ComponentProps<typeof Link>, "href" | "className" | "children">)
  | ({ href?: undefined } & Omit<ComponentProps<"button">, "className" | "children">)
);

/** Pill button with a liquid fill that rises on hover and a sliding arrow. */
export function Button({ variant = "dark", children, className = "", ...rest }: Props) {
  const inner = (
    <>
      <span
        aria-hidden
        className={`absolute inset-0 translate-y-full rounded-[inherit] transition-transform duration-700 ease-(--ease-expo) group-hover:translate-y-0 ${fill[variant]}`}
      />
      <span className={`relative z-10 flex items-center gap-3 transition-colors duration-500 ${hoverText[variant]}`}>
        {children}
        <span className="relative flex size-4 overflow-hidden">
          <Arrow className="absolute transition-transform duration-500 ease-(--ease-expo) group-hover:translate-x-5" />
          <Arrow className="absolute -translate-x-5 transition-transform duration-500 ease-(--ease-expo) group-hover:translate-x-0" />
        </span>
      </span>
    </>
  );
  const cls = `group relative inline-flex items-center overflow-hidden rounded-full px-7 py-4 text-sm font-medium tracking-tight ${variants[variant]} ${className}`;

  if (rest.href !== undefined) {
    const { href, ...linkProps } = rest;
    return (
      <Link href={href} className={cls} {...linkProps}>
        {inner}
      </Link>
    );
  }
  return (
    <button className={cls} {...(rest as ComponentProps<"button">)}>
      {inner}
    </button>
  );
}

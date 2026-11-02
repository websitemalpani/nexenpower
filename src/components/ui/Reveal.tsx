"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from "@/lib/gsap";

type Props = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  /** Animate direct children with a stagger instead of the wrapper. */
  stagger?: number;
  y?: number;
  delay?: number;
  start?: string;
};

/** Fade-and-rise on scroll. Wrapper or children ([data-reveal]) are hidden pre-JS via CSS. */
export function Reveal({ children, as: Tag = "div", className, stagger, y = 40, delay = 0, start = "top 88%" }: Props) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const targets = stagger ? Array.from(el.children) : [el];
      if (prefersReducedMotion()) {
        gsap.set(targets, { opacity: 1 });
        return;
      }
      gsap.set(targets, { opacity: 0, y });
      ScrollTrigger.create({
        trigger: el,
        start,
        once: true,
        onEnter: () =>
          gsap.to(targets, { opacity: 1, y: 0, duration: 1.2, delay, stagger: stagger ?? 0, ease: "expo.out" }),
      });
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} className={className} data-reveal={stagger ? undefined : ""} data-reveal-children={stagger ? "" : undefined}>
      {children}
    </Tag>
  );
}

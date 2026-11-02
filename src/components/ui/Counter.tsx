"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { onIntroReady } from "@/lib/intro";

type Props = { value: number; suffix?: string; className?: string; immediate?: boolean; delay?: number };

/** Counts up to `value` once visible. Server-renders the final value for SEO / no-JS. */
export function Counter({ value, suffix = "", className, immediate, delay = 0 }: Props) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    const obj = { v: 0 };
    el.textContent = `0${suffix}`;
    const run = () =>
      gsap.to(obj, {
        v: value,
        duration: 2.2,
        delay,
        ease: "power3.out",
        onUpdate: () => (el.textContent = `${Math.round(obj.v)}${suffix}`),
      });
    if (immediate) return onIntroReady(run);
    const st = ScrollTrigger.create({ trigger: el, start: "top 92%", once: true, onEnter: run });
    return () => st.kill();
  });

  return (
    <span ref={ref} className={className}>
      {value}
      {suffix}
    </span>
  );
}

"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from "@/lib/gsap";

const WORDS = ["Solar", "Wind", "Hybrid", "Battery Storage", "Utility-scale", "Pan-India"];

/** Endless ticker whose speed and direction respond to scroll velocity. */
export function Marquee() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const rows = gsap.utils.toArray<HTMLElement>("[data-marquee-row]");
      const loops = rows.map((row) =>
        // Start deep into the repeat so a negative timeScale (scrolling up) never hits time 0.
        gsap.to(row, { xPercent: -50, duration: 38, ease: "none", repeat: -1 }).totalTime(38 * 500),
      );
      let timeout: ReturnType<typeof setTimeout>;
      const st = ScrollTrigger.create({
        trigger: root.current,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => {
          const v = gsap.utils.clamp(-6, 6, self.getVelocity() / 250);
          loops.forEach((l) => gsap.to(l, { timeScale: (self.direction || 1) * (1 + Math.abs(v)), duration: 0.3, overwrite: true }));
          clearTimeout(timeout);
          timeout = setTimeout(() => loops.forEach((l) => gsap.to(l, { timeScale: self.direction || 1, duration: 0.8 })), 120);
        },
      });
      return () => {
        clearTimeout(timeout);
        st.kill();
      };
    },
    { scope: root },
  );

  const row = (
    <>
      {WORDS.map((w) => (
        <span key={w} className="flex shrink-0 items-center gap-[0.4em] pr-[0.4em]">
          <span>{w}</span>
          <svg viewBox="0 0 24 24" className="size-[0.45em] text-mint" aria-hidden>
            <path d="M12 0l2.6 9.4L24 12l-9.4 2.6L12 24l-2.6-9.4L0 12l9.4-2.6z" fill="currentColor" />
          </svg>
        </span>
      ))}
    </>
  );

  return (
    <div ref={root} aria-hidden className="overflow-hidden border-y border-paper/10 bg-ink py-6 text-paper md:py-9">
      <div data-marquee-row className="flex w-max text-[clamp(2.2rem,5vw,4.75rem)] leading-none font-semibold tracking-[-0.04em]">
        {row}
        {row}
      </div>
    </div>
  );
}

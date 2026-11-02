"use client";

import { useRef } from "react";
import { journey } from "@/content/site";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { SplitReveal } from "@/components/ui/SplitReveal";

/** Milestones from the Malpani Group to a multi-gigawatt platform; the line charges as you scroll. */
export function Journey({ index = "04" }: { index?: string }) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const mm = gsap.matchMedia();
      mm.add({ desktop: "(min-width: 768px)", mobile: "(max-width: 767px)" }, (ctx) => {
        const { desktop } = ctx.conditions as { desktop: boolean };
        gsap.fromTo(
          "[data-journey-line]",
          desktop ? { scaleX: 0 } : { scaleY: 0 },
          {
            ...(desktop ? { scaleX: 1 } : { scaleY: 1 }),
            ease: "none",
            scrollTrigger: { trigger: "[data-journey-list]", start: "top 75%", end: desktop ? "bottom 60%" : "bottom 70%", scrub: true },
          },
        );
        gsap.utils.toArray<HTMLElement>("[data-journey-item]").forEach((item) => {
          gsap.fromTo(
            item,
            { opacity: 0.15, y: 30 },
            { opacity: 1, y: 0, duration: 1, ease: "expo.out", scrollTrigger: { trigger: item, start: desktop ? "top 70%" : "top 80%", toggleActions: "play none none reverse" } },
          );
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-labelledby="journey-title" className="relative overflow-hidden bg-night text-paper">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 right-[-10%] size-[60vw] rounded-full bg-[radial-gradient(circle,rgba(11,147,147,.22),transparent_65%)]"
      />
      <div className="container-x relative py-24 md:py-36">
        <div className="grid gap-8 md:grid-cols-12">
          <SectionLabel index={index} className="text-mint md:col-span-3">
            Our journey
          </SectionLabel>
          <SplitReveal
            id="journey-title"
            text="A century of enterprise. Twenty-five years of renewable operations."
            accent={["century", "renewable"]}
            className="display type-h2 text-balance md:col-span-9 [&_.accent]:text-mint"
          />
        </div>

        <div data-journey-list className="relative mt-20 pl-8 md:mt-28 md:pt-12 md:pl-0">
          <div aria-hidden className="absolute top-0 bottom-0 left-0 w-px bg-paper/10 md:top-0 md:right-0 md:bottom-auto md:h-px md:w-auto">
            <div data-journey-line className="absolute inset-0 origin-top bg-gradient-to-b from-brand via-teal to-mint md:origin-left md:bg-gradient-to-r" />
          </div>
          <ol className="grid gap-12 md:grid-cols-5 md:gap-6">
          {journey.map((m, i) => (
            <li key={m.title} data-journey-item className="relative">
              <span
                aria-hidden
                className="absolute top-1.5 -left-8 size-2.5 -translate-x-1/2 rounded-full bg-mint shadow-[0_0_0_6px_rgba(95,227,200,.12)] md:-top-12 md:left-0 md:-translate-y-1/2 md:translate-x-0"
              />
              <p className={`type-stat font-semibold tracking-[-0.04em] ${i === journey.length - 1 ? "text-gradient" : ""}`}>
                {m.mark}
              </p>
              <h3 className="mt-4 text-lg font-medium">{m.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-paper/60">{m.text}</p>
            </li>
          ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

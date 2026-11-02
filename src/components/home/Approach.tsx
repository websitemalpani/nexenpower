"use client";

import { useRef } from "react";
import { approach } from "@/content/site";
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { SplitReveal } from "@/components/ui/SplitReveal";
import { Reveal } from "@/components/ui/Reveal";

/** Sticky statement on the left; numbered pillars light up as they cross the viewport centre. */
export function Approach() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const items = gsap.utils.toArray<HTMLElement>("[data-approach-item]");
      if (prefersReducedMotion()) {
        items.forEach((el) => el.classList.add("is-active"));
        return;
      }
      items.forEach((item) => {
        ScrollTrigger.create({
          trigger: item,
          start: "top 62%",
          end: "bottom 38%",
          toggleClass: "is-active",
        });
        gsap.fromTo(
          item.querySelector("[data-line]"),
          { scaleX: 0 },
          { scaleX: 1, ease: "none", scrollTrigger: { trigger: item, start: "top 75%", end: "top 35%", scrub: true } },
        );
      });
    },
    { scope: root },
  );

  return (
    <section id="approach" ref={root} aria-labelledby="approach-title" className="relative bg-paper text-ink">
      <div className="container-x grid gap-16 py-24 md:py-36 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-32">
            <SectionLabel index="03" className="text-brand">
              {approach.label}
            </SectionLabel>
            <SplitReveal
              id="approach-title"
              text={approach.title}
              accent={["Strategic", "Execution"]}
              className="display mt-8 type-h2 text-balance [&_.accent]:text-brand"
            />
            <Reveal className="mt-8 space-y-5 text-ink/70">
              <p className="text-lg text-ink">{approach.lead}</p>
              <p className="leading-relaxed">{approach.body}</p>
            </Reveal>
          </div>
        </div>

        <ol className="lg:col-span-6 lg:col-start-7">
          {approach.items.map((item, i) => (
            <li
              key={item.title}
              data-approach-item
              className="group relative py-10 opacity-35 transition-opacity duration-700 first:pt-0 md:py-14 [&.is-active]:opacity-100"
            >
              <div className="relative mb-8 h-px bg-ink/15">
                <div data-line className="absolute inset-0 origin-left bg-brand" />
              </div>
              <div className="flex gap-6 md:gap-10">
                <span className="font-mono text-sm text-brand">0{i + 1}</span>
                <div>
                  <h3 className="type-h3 font-semibold tracking-[-0.035em]">{item.title}</h3>
                  <p className="mt-4 max-w-lg leading-relaxed text-ink/70 md:text-lg">{item.text}</p>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

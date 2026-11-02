"use client";

import Image from "next/image";
import { useRef } from "react";
import { sustainability } from "@/content/pages";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { SplitReveal } from "@/components/ui/SplitReveal";

/** Four sustainability pillars as photo cards — photos wipe open, then settle from a zoom. */
export function Sustainability({ index }: { index: string }) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.utils.toArray<HTMLElement>("[data-pillar]").forEach((card, i) => {
        gsap
          .timeline({ scrollTrigger: { trigger: card, start: "top 85%", once: true }, delay: (i % 2) * 0.12 })
          .from(card, { opacity: 0, y: 60, duration: 1.2, ease: "expo.out" })
          .fromTo(card.querySelector("[data-pillar-photo]"), { clipPath: "inset(0 0 100% 0)" }, { clipPath: "inset(0 0 0% 0)", duration: 1.3, ease: "expo.inOut" }, 0)
          .fromTo(card.querySelector("img"), { scale: 1.3 }, { scale: 1, duration: 1.8, ease: "expo.out" }, 0.1);
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-labelledby="about-sustainability" className="bg-paper text-ink">
      <div className="container-x py-24 md:py-36">
        <div className="grid gap-8 md:grid-cols-12">
          <SectionLabel index={index} className="text-brand md:col-span-3">
            {sustainability.label}
          </SectionLabel>
          <div className="md:col-span-9">
            <SplitReveal
              id="about-sustainability"
              text="Four commitments that guide how we grow."
              accent={["how", "we", "grow."]}
              className="display type-h2 text-balance [&_.accent]:text-brand"
            />
            <p className="mt-6 max-w-2xl text-ink/65 md:text-lg">{sustainability.lead}</p>
          </div>
        </div>

        <ul className="mt-16 grid gap-5 md:mt-24 md:grid-cols-2">
          {sustainability.pillars.map((p, i) => (
            <li key={p.title} data-pillar className="group overflow-hidden rounded-4xl bg-sand">
              <div data-pillar-photo className="relative aspect-16/10 overflow-hidden">
                <Image
                  src={p.image.src}
                  alt={p.image.alt}
                  fill
                  sizes="(min-width: 768px) 46vw, 100vw"
                  className="object-cover transition-transform duration-1400 ease-(--ease-expo) group-hover:scale-105"
                />
                <span className="absolute top-5 left-5 rounded-full bg-paper/85 px-3 py-1 font-mono text-[0.65rem] tracking-widest text-brand backdrop-blur">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <div className="p-8 md:p-10">
                <h3 className="type-h3 font-semibold tracking-tight">{p.title}</h3>
                <p className="mt-3 max-w-md leading-relaxed text-ink/65">{p.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

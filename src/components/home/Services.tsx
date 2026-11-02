"use client";

import Link from "next/link";
import { useRef } from "react";
import { services } from "@/content/site";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { SplitReveal } from "@/components/ui/SplitReveal";
import { ServiceArt } from "@/components/illustrations/ServiceArt";
import { Arrow } from "@/components/ui/Button";

/**
 * Desktop: the section pins and the three service panels travel horizontally.
 * Tablet / mobile: a natural vertical stack.
 */
export function Services() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const progress = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px)", () => {
        const el = track.current!;
        const distance = () => el.scrollWidth - window.innerWidth;
        const tween = gsap.to(el, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => progress.current && (progress.current.style.transform = `scaleX(${self.progress})`),
          },
        });
        if (prefersReducedMotion()) return;
        // Parallax the artwork inside each panel against the track movement.
        gsap.utils.toArray<HTMLElement>("[data-art]").forEach((art) => {
          gsap.fromTo(
            art,
            { xPercent: 12 },
            {
              xPercent: -12,
              ease: "none",
              scrollTrigger: { trigger: art.parentElement, containerAnimation: tween, start: "left right", end: "right left", scrub: true },
            },
          );
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section id="services" ref={root} aria-labelledby="services-title" className="relative overflow-hidden bg-ink text-paper lg:h-svh">
      <div className="grain pointer-events-none absolute inset-0 overflow-hidden" aria-hidden />
      <div ref={track} className="relative flex h-full flex-col pb-20 lg:w-max lg:pb-0 lg:flex-row lg:items-stretch">
        {/* Intro panel */}
        <div className="container-x flex shrink-0 flex-col justify-center py-24 lg:w-[44vw] lg:max-w-none lg:py-0 lg:pr-0">
          <SectionLabel index="02" className="text-mint">
            {services.label}
          </SectionLabel>
          <SplitReveal
            id="services-title"
            text={services.title}
            accent={["Endless", "Possibilities"]}
            className="display mt-8 type-h2 [&_.accent]:text-mint"
          />
          <p className="mt-8 max-w-sm text-paper/60">
            Development, construction and long-term operations across the full renewable stack — from sun and wind to stored power on demand.
          </p>
          <p className="eyebrow mt-12 hidden items-center gap-3 text-paper/40 lg:flex">
            Scroll to explore
            <svg viewBox="0 0 24 24" className="size-4" fill="none" aria-hidden>
              <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </p>
        </div>

        {services.items.map((s, i) => (
          <article
            key={s.kind}
            className="relative shrink-0 px-[clamp(1.25rem,4vw,3.5rem)] pb-6 lg:flex lg:h-full lg:w-[78vw] lg:items-center lg:px-[3vw] lg:pb-0"
          >
            <div className="relative grid overflow-hidden rounded-[2rem] border border-paper/10 bg-gradient-to-br from-forest to-night lg:h-[78svh] lg:grid-cols-2">
              <div className="relative order-2 flex flex-col justify-between gap-10 p-8 md:p-12 lg:order-1">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm text-mint">0{i + 1}</span>
                  <span className="font-mono text-xs text-paper/40">/ 0{services.items.length}</span>
                </div>
                <div>
                  <h3 className="type-h3 font-semibold tracking-[-0.04em]">{s.title}</h3>
                  <p className="mt-6 max-w-md text-base leading-relaxed text-paper/65 md:text-lg">{s.text}</p>
                  <ul className="mt-8 flex flex-wrap gap-2" aria-label="Focus areas">
                    {s.tags.map((t) => (
                      <li key={t} className="rounded-full border border-paper/15 px-4 py-1.5 text-xs text-paper/75">
                        {t}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/contact"
                    className="group/link mt-10 inline-flex items-center gap-3 text-sm font-medium text-mint"
                  >
                    Discuss a project
                    <span className="sr-only">: {s.title}</span>
                    <Arrow className="transition-transform duration-500 group-hover/link:translate-x-1" />
                  </Link>
                </div>
              </div>
              <div className="relative order-1 aspect-square overflow-hidden lg:order-2 lg:aspect-auto">
                <div data-art className="absolute inset-[-6%]">
                  <ServiceArt kind={s.kind} />
                </div>
              </div>
            </div>
          </article>
        ))}
        <div aria-hidden className="hidden shrink-0 lg:block lg:w-[6vw]" />
      </div>

      <div aria-hidden className="absolute inset-x-0 bottom-6 hidden lg:block">
        <div className="container-x">
          <div className="h-px bg-paper/10">
            <div ref={progress} className="h-px origin-left scale-x-0 bg-mint" />
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import Image from "next/image";
import { useRef, type ReactNode } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { onIntroReady } from "@/lib/intro";
import { SplitReveal } from "@/components/ui/SplitReveal";
import type { Photo } from "@/content/pages";

type Props = {
  label: string;
  title: string;
  accent?: string[];
  lead?: string;
  visual?: ReactNode;
  /** Full-bleed background photograph behind a dark scrim. */
  image?: Photo;
  children?: ReactNode;
};

/** Inner-page hero: dark stage, oversized title, optional visual on the right or photo behind. */
export function PageHero({ label, title, accent, lead, visual, image, children }: Props) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.set("[data-ph-fade]", { opacity: 0, y: 24 });
      const off = onIntroReady(() =>
        gsap.to("[data-ph-fade]", { opacity: 1, y: 0, duration: 1.3, stagger: 0.1, delay: 0.5, ease: "expo.out" }),
      );
      gsap.fromTo(
        "[data-ph-photo]",
        { scale: 1.12 },
        { scale: 1, yPercent: 10, ease: "none", scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true } },
      );
      gsap.to("[data-ph-inner]", {
        yPercent: 12,
        opacity: 0.3,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
      });
      return off;
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-labelledby="page-title" className="relative overflow-hidden bg-ink text-paper">
      {image && (
        <div aria-hidden className="absolute inset-0">
          <div data-ph-photo className="absolute inset-0 origin-top">
            <Image src={image.src} alt="" fill priority sizes="100vw" className="object-cover" />
          </div>
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,18,13,.55)_0%,rgba(4,18,13,.35)_40%,rgba(4,18,13,.92)_100%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(4,18,13,.75)_0%,transparent_70%)]" />
        </div>
      )}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_60%_at_80%_40%,rgba(11,147,147,.28),transparent_70%),radial-gradient(50%_50%_at_10%_100%,rgba(3,107,65,.35),transparent_70%)]"
      />
      <div className="grain pointer-events-none absolute inset-0 overflow-hidden" aria-hidden />
      <div data-ph-inner className="container-x relative grid min-h-[88svh] items-end gap-10 pt-36 pb-16 md:pb-24 lg:grid-cols-12">
        <div className="relative z-10 lg:col-span-8">
          <p data-ph-fade className="eyebrow mb-8 flex items-center gap-3 text-mint">
            <span className="h-px w-10 bg-mint/60" aria-hidden />
            {label}
          </p>
          <SplitReveal
            as="h1"
            id="page-title"
            immediate
            delay={0.25}
            text={title}
            accent={accent}
            className="display type-h1 text-balance [&_.accent]:text-mint"
          />
          {lead && (
            <p data-ph-fade className="mt-10 max-w-2xl text-lg leading-relaxed text-paper/70 md:text-xl">
              {lead}
            </p>
          )}
          {children}
        </div>
        {visual && <div className="relative h-[42vh] lg:col-span-4 lg:h-[64vh]">{visual}</div>}
      </div>
    </section>
  );
}

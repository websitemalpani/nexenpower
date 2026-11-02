"use client";

import Link from "next/link";
import { useRef } from "react";
import { contactCopy, site } from "@/content/site";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { SplitReveal } from "@/components/ui/SplitReveal";
import { Magnetic } from "@/components/ui/Magnetic";
import { Arrow } from "@/components/ui/Button";

export function CallToAction() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.fromTo(
        "[data-cta-glow]",
        { scale: 0.6, opacity: 0 },
        { scale: 1, opacity: 1, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "center center", scrub: true } },
      );
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-labelledby="cta-title" className="relative overflow-hidden bg-ink text-paper">
      <div
        data-cta-glow
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-1/2 size-[110vmax] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(11,147,147,.35)_0%,rgba(3,107,65,.18)_30%,transparent_60%)]"
      />
      <div className="grain pointer-events-none absolute inset-0 overflow-hidden" aria-hidden />
      <div className="container-x relative flex flex-col items-center py-16 text-center md:py-24">
        <p className="eyebrow text-mint">Partnerships · Investment · Collaboration</p>
        <SplitReveal
          id="cta-title"
          text={contactCopy.title}
          accent={["Renewable", "Future"]}
          className="display mt-5 max-w-[20ch] type-h2 [&_.accent]:text-mint"
        />
        <p className="mt-5 max-w-lg text-sm text-paper/65 md:text-base">{contactCopy.text}</p>

        <Magnetic strength={0.3} className="mt-8">
          <Link
            href="/contact"
            className="group relative flex items-center gap-3 overflow-hidden rounded-full bg-mint px-7 py-3.5 text-ink"
          >
            <span aria-hidden className="absolute inset-0 scale-0 rounded-full bg-paper transition-transform duration-700 ease-(--ease-expo) group-hover:scale-100" />
            <span className="relative flex items-center gap-2 text-sm font-semibold">
              Start a conversation
              <Arrow className="size-4 transition-transform duration-500 group-hover:translate-x-1" />
            </span>
          </Link>
        </Magnetic>

        <a href={`mailto:${site.contact.email}`} className="mt-6 text-sm text-paper/60 underline-offset-8 transition-colors hover:text-mint hover:underline">
          {site.contact.email}
        </a>
      </div>
    </section>
  );
}

"use client";

import Image from "next/image";
import { useRef } from "react";
import { about } from "@/content/site";
import { photos } from "@/content/pages";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { SplitReveal } from "@/components/ui/SplitReveal";
import { ScrubText } from "@/components/ui/ScrubText";

const rows = [
  {
    label: "Vision",
    kicker: "Where we’re going",
    text: about.vision,
    accent: ["leading", "renewable"],
    chips: ["Operational excellence", "Strategic partnerships", "Sustainable impact"],
    photo: photos.fieldSunrise,
  },
  {
    label: "Mission",
    kicker: "How we’ll get there",
    text: about.mission,
    accent: ["proven", "capabilities,"],
    chips: ["Proven capabilities", "Capital-efficient growth", "Lasting value"],
    photo: photos.solarSunset,
  },
] as const;

/** Vision and mission as two editorial rows: big serif word + photo on one side, the statement lighting up on the other. */
export function VisionMission() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.utils.toArray<HTMLElement>("[data-vm-row]").forEach((row) => {
        const photo = row.querySelector("[data-vm-photo]");
        gsap
          .timeline({ scrollTrigger: { trigger: row, start: "top 78%", once: true } })
          .fromTo(row.querySelector("[data-vm-rule]"), { scaleX: 0 }, { scaleX: 1, duration: 1.4, ease: "expo.inOut" })
          .fromTo(photo, { clipPath: "inset(0 0 100% 0 round 1.5rem)" }, { clipPath: "inset(0 0 0% 0 round 1.5rem)", duration: 1.4, ease: "expo.inOut" }, 0.2)
          .from(row.querySelectorAll("[data-vm-chip]"), { opacity: 0, y: 14, scale: 0.92, duration: 0.7, stagger: 0.07, ease: "back.out(2)" }, 0.9);
        gsap.fromTo(photo!.querySelector("img"), { scale: 1.25, yPercent: -4 }, { scale: 1.05, yPercent: 4, ease: "none", scrollTrigger: { trigger: row, start: "top bottom", end: "bottom top", scrub: true } });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-label="Vision and mission" className="relative overflow-hidden bg-ink text-paper">
      <div aria-hidden className="pointer-events-none absolute -top-1/3 -right-1/4 size-[70vmax] rounded-full bg-[radial-gradient(circle,rgba(11,147,147,.14),transparent_60%)]" />
      <div className="container-x relative py-20 md:py-32">
        {rows.map((r, i) => (
          <article key={r.label} data-vm-row className="relative py-14 md:py-20">
            <span aria-hidden data-vm-rule className="absolute inset-x-0 top-0 h-px origin-left bg-linear-to-r from-mint/60 via-paper/15 to-transparent" />

            <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
              <div className="lg:col-span-4">
                <p className="eyebrow flex items-center gap-3 text-paper/50">
                  <span className="text-mint">{String(i + 1).padStart(2, "0")}</span>
                  <span className="h-px w-8 bg-paper/25" />
                  {r.kicker}
                </p>
                <SplitReveal as="h2" text={r.label} accent={[r.label]} className="type-h1 mt-6 [&_.accent]:text-mint" />
                <div data-vm-photo className="relative mt-8 aspect-[4/3] max-w-sm overflow-hidden rounded-3xl bg-night">
                  <Image src={r.photo.src} alt={r.photo.alt} fill sizes="(min-width: 1024px) 28vw, 90vw" className="object-cover" />
                  <div aria-hidden className="absolute inset-0 bg-linear-to-t from-ink/50 to-transparent" />
                </div>
              </div>

              <div className="flex flex-col justify-end lg:col-span-8">
                <ScrubText text={r.text} accent={[...r.accent]} className="text-[clamp(1.5rem,2.6vw,2.5rem)] leading-[1.18] font-medium tracking-[-0.025em] [&_.accent]:text-mint" />
                <ul className="mt-10 flex flex-wrap gap-2">
                  {r.chips.map((chip) => (
                    <li
                      key={chip}
                      data-vm-chip
                      className="rounded-full border border-mint/25 bg-mint/[.06] px-4 py-2 text-sm text-mint transition-colors duration-500 hover:bg-mint hover:text-ink"
                    >
                      {chip}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

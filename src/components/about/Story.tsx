"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { about, stats } from "@/content/site";
import { photos } from "@/content/pages";
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { ScrubText } from "@/components/ui/ScrubText";
import { Reveal } from "@/components/ui/Reveal";
import { Counter } from "@/components/ui/Counter";
import { Button } from "@/components/ui/Button";

// The four story paragraphs, framed as chapters (same order as about.story).
const chapters = [
  { tag: "Roots", title: "A century-old family, 25 years in renewables", photo: photos.windSunset },
  { tag: "2024", title: "An independent power producer is born", photo: photos.solarAerial },
  { tag: "Today", title: "Operational expertise, built for growth", photo: photos.solarTechnician },
  { tag: "Next", title: "Hybrid, storage and what comes next", photo: photos.hybrid },
];

export function Story() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  useGSAP(
    () => {
      // Whichever chapter crosses the middle of the screen becomes active.
      gsap.utils.toArray<HTMLElement>("[data-chapter]").forEach((el, i) => {
        ScrollTrigger.create({ trigger: el, start: "top 55%", end: "bottom 55%", onToggle: (self) => self.isActive && setActive(i) });
      });
      if (prefersReducedMotion()) return;
      gsap.fromTo("[data-story-rail]", { scaleY: 0 }, { scaleY: 1, ease: "none", scrollTrigger: { trigger: "[data-chapters]", start: "top 55%", end: "bottom 55%", scrub: true } });
      gsap.from("[data-story-stat]", { opacity: 0, y: 30, duration: 1, stagger: 0.1, ease: "expo.out", scrollTrigger: { trigger: "[data-story-stats]", start: "top 88%", once: true } });
      gsap.fromTo("[data-story-close] img", { scale: 1.25 }, { scale: 1, ease: "none", scrollTrigger: { trigger: "[data-story-close]", start: "top bottom", end: "bottom top", scrub: true } });
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-labelledby="story-title" className="bg-paper text-ink">
      <div className="container-x pb-24 md:pb-36">
        <div className="border-t border-ink/15 pt-16 md:pt-24">
          <SectionLabel index="02" className="text-brand">
            <span id="story-title">Our Story</span>
          </SectionLabel>
          <ScrubText as="p" text={about.storyHook} accent={["moment"]} className="display mt-10 max-w-[18ch] type-h2 [&_.accent]:text-brand" />
        </div>

        {/* Stat strip */}
        <dl data-story-stats className="mt-14 grid grid-cols-3 divide-x divide-ink/10 rounded-3xl bg-sand md:mt-20">
          {stats.map((s) => (
            <div key={s.label} data-story-stat className="p-5 md:p-8">
              <dt className="text-xs text-ink/55 md:text-sm">{s.label}</dt>
              <dd className="type-stat mt-3 font-semibold tracking-[-0.04em] tabular-nums">
                <Counter value={s.value} suffix={s.suffix} />
                <span className="ml-1.5 text-[0.45em] font-medium tracking-tight text-brand">{s.unit}</span>
              </dd>
            </div>
          ))}
        </dl>

        {/* Chapters */}
        <div className="mt-20 grid gap-10 md:mt-28 lg:grid-cols-12 lg:gap-16">
          <div className="hidden lg:col-span-5 lg:block">
            <div className="sticky top-28">
              <div className="relative aspect-[4/5] overflow-hidden rounded-4xl bg-ink">
                {chapters.map((c, i) => (
                  <Image
                    key={c.tag}
                    src={c.photo.src}
                    alt={c.photo.alt}
                    fill
                    sizes="40vw"
                    className={`object-cover transition-[opacity,transform] duration-1000 ease-(--ease-expo) ${i === active ? "scale-100 opacity-100" : "scale-110 opacity-0"}`}
                  />
                ))}
                <div aria-hidden className="absolute inset-0 bg-linear-to-t from-ink/85 via-transparent to-ink/20" />
                <div className="absolute inset-x-0 top-0 flex items-center justify-between p-6 text-paper">
                  <span className="eyebrow text-mint">Chapter</span>
                  <span className="font-mono text-sm tabular-nums">
                    {String(active + 1).padStart(2, "0")} <span className="text-paper/40">/ {String(chapters.length).padStart(2, "0")}</span>
                  </span>
                </div>
                <div className="absolute inset-x-0 bottom-0 p-6 text-paper md:p-8">
                  <p key={active} className="animate-[fadeUp_.8s_var(--ease-expo)_both] text-3xl font-semibold tracking-tight md:text-4xl">
                    {chapters[active].tag}
                  </p>
                  <div className="mt-5 flex gap-1.5">
                    {chapters.map((c, i) => (
                      <span key={c.tag} className="h-1 flex-1 overflow-hidden rounded-full bg-paper/20">
                        <span className={`block h-full origin-left rounded-full bg-mint transition-transform duration-700 ${i <= active ? "scale-x-100" : "scale-x-0"}`} />
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <ol data-chapters className="relative lg:col-span-7">
            <span aria-hidden className="absolute top-2 bottom-2 left-[11px] w-px bg-ink/10" />
            <span aria-hidden data-story-rail className="absolute top-2 bottom-2 left-[11px] w-px origin-top bg-linear-to-b from-brand via-teal to-mint" />
            {chapters.map((c, i) => (
              <li
                key={c.tag}
                data-chapter
                className={`relative pb-16 pl-12 transition-opacity duration-700 last:pb-0 md:pb-24 ${i === active ? "opacity-100" : "lg:opacity-35"}`}
              >
                <span
                  aria-hidden
                  className={`absolute top-1 left-0 flex size-6 items-center justify-center rounded-full border-2 bg-paper transition-colors duration-500 ${i <= active ? "border-brand" : "border-ink/20"}`}
                >
                  <span className={`size-2 rounded-full transition-colors duration-500 ${i <= active ? "bg-brand" : "bg-transparent"}`} />
                </span>
                <p className="eyebrow text-brand">
                  {String(i + 1).padStart(2, "0")} · {c.tag}
                </p>
                <h3 className="type-h3 mt-3 font-semibold tracking-tight">{c.title}</h3>
                {/* Photo inline on smaller screens, where there's no sticky panel */}
                <div className="relative mt-6 aspect-video overflow-hidden rounded-3xl lg:hidden">
                  <Image src={c.photo.src} alt={c.photo.alt} fill sizes="100vw" className="object-cover" />
                </div>
                <p className="mt-5 text-lg leading-relaxed text-ink/70 md:text-xl">{about.story[i]}</p>
              </li>
            ))}
          </ol>
        </div>

        {/* Closing statement */}
        <Reveal className="mt-20 md:mt-28">
          <div data-story-close className="relative overflow-hidden rounded-4xl bg-ink text-paper">
            <Image src={photos.windHorizon.src} alt="" fill sizes="100vw" className="object-cover opacity-40" />
            <div aria-hidden className="absolute inset-0 bg-linear-to-r from-ink via-ink/80 to-ink/20" />
            <div className="relative grid gap-8 p-8 md:p-14 lg:grid-cols-12 lg:items-end">
              <div className="lg:col-span-8">
                <p className="type-lead font-medium tracking-[-0.025em]">{about.storyClose[0]}</p>
                <p className="accent mt-5 type-lead text-mint">{about.storyClose[1]}</p>
              </div>
              <div className="lg:col-span-4 lg:flex lg:justify-end">
                <Button href="/contact" variant="light">
                  Partner with us
                </Button>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

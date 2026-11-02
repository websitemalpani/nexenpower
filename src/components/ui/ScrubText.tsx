"use client";

import { useRef, type ElementType } from "react";
import SplitType from "split-type";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";

type Props = { text: string; as?: ElementType; className?: string; accent?: string[] };

const clean = (s: string) => s.toLowerCase().replace(/[^\p{L}\p{N}]/gu, "");

/** Words light up one by one as the paragraph scrolls through the viewport. */
export function ScrubText({ text, as: Tag = "p", className, accent = [] }: Props) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const split = new SplitType(el, { types: "words", wordClass: "word" });
      const accents = new Set(accent.map(clean));
      split.words?.forEach((w) => accents.has(clean(w.textContent ?? "")) && w.classList.add("accent"));
      el.classList.add("is-split");
      if (prefersReducedMotion()) return () => split.revert();

      gsap.fromTo(
        split.words ?? [],
        { opacity: 0.14 },
        {
          opacity: 1,
          ease: "none",
          stagger: 0.1,
          scrollTrigger: { trigger: el, start: "top 80%", end: "bottom 45%", scrub: true },
        },
      );
      return () => split.revert();
    },
    { scope: ref, dependencies: [text] },
  );

  return (
    <Tag ref={ref} data-split className={className}>
      {text}
    </Tag>
  );
}

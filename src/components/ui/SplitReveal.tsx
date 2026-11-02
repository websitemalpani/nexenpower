"use client";

import { useRef, type ElementType } from "react";
import SplitType from "split-type";
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { onIntroReady } from "@/lib/intro";

type Props = {
  text: string;
  id?: string;
  as?: ElementType;
  className?: string;
  /** Words (case-insensitive, punctuation ignored) rendered in the italic serif accent. */
  accent?: string[];
  delay?: number;
  stagger?: number;
  /** Play on mount (after the preloader) instead of on scroll. */
  immediate?: boolean;
  /** Words also resolve from a soft blur — for cinematic, above-the-fold titles. */
  blur?: boolean;
  start?: string;
};

const clean = (s: string) => s.toLowerCase().replace(/[^\p{L}\p{N}$]/gu, "");

/**
 * Line-masked word reveal powered by SplitType + GSAP. Re-splits on resize so
 * line breaks stay correct, preserving the played state.
 */
export function SplitReveal({
  text,
  id,
  as: Tag = "h2",
  className,
  accent = [],
  delay = 0,
  stagger = 0.06,
  immediate = false,
  blur = false,
  start = "top 85%",
}: Props) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const accents = new Set(accent.map(clean));
      let split: SplitType | null = null;
      let played = false;
      let tween: gsap.core.Tween | null = null;

      const doSplit = () => {
        split?.revert();
        split = new SplitType(el, { types: "lines,words", lineClass: "split-line", wordClass: "word" });
        split.words?.forEach((w) => {
          if (accents.has(clean(w.textContent ?? ""))) w.classList.add("accent");
        });
        el.classList.add("is-split");
        if (played || prefersReducedMotion()) gsap.set(split.words ?? [], { yPercent: 0, opacity: 1, filter: "none" });
        else gsap.set(split.words ?? [], blur ? { yPercent: 120, opacity: 0, filter: "blur(14px)" } : { yPercent: 120, opacity: 1 });
      };

      const play = () => {
        if (played || !split) return;
        played = true;
        tween = gsap.to(split.words ?? [], {
          yPercent: 0,
          ...(blur && { opacity: 1, filter: "blur(0px)", clearProps: "filter" }),
          duration: blur ? 1.7 : 1.3,
          stagger,
          delay,
          ease: "expo.out",
        });
      };

      doSplit();

      let trigger: ScrollTrigger | undefined;
      let off: (() => void) | undefined;
      if (prefersReducedMotion()) played = true;
      else if (immediate) off = onIntroReady(play);
      else trigger = ScrollTrigger.create({ trigger: el, start, once: true, onEnter: play });

      let width = el.offsetWidth;
      const ro = new ResizeObserver(() => {
        if (Math.abs(el.offsetWidth - width) < 2) return;
        width = el.offsetWidth;
        tween?.progress(1);
        doSplit();
      });
      ro.observe(el);

      return () => {
        ro.disconnect();
        off?.();
        trigger?.kill();
        tween?.kill();
        split?.revert();
      };
    },
    { scope: ref, dependencies: [text] },
  );

  return (
    <Tag ref={ref} id={id} data-split className={className}>
      {text}
    </Tag>
  );
}

"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import type { Photo } from "@/content/pages";

type Props = {
  photo: Photo;
  sizes: string;
  className?: string;
  /** Travel distance as a percentage of the frame height. */
  amount?: number;
  priority?: boolean;
};

/** Photo that drifts inside its rounded frame as the frame scrolls through the viewport. */
export function ParallaxImage({ photo, sizes, className = "", amount = 10, priority }: Props) {
  const frame = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.fromTo(
        "[data-px]",
        { yPercent: -amount },
        { yPercent: amount, ease: "none", scrollTrigger: { trigger: frame.current, start: "top bottom", end: "bottom top", scrub: true } },
      );
    },
    { scope: frame },
  );

  return (
    <div ref={frame} className={`relative overflow-hidden ${className}`}>
      <div data-px className="absolute -inset-y-[14%] inset-x-0">
        <Image src={photo.src} alt={photo.alt} fill sizes={sizes} priority={priority} className="object-cover" />
      </div>
    </div>
  );
}

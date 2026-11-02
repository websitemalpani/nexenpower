"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { footerNav, site, telHref } from "@/content/site";
import { BackToTopBadge } from "@/components/ui/BackToTop";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";

export function Footer() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.fromTo(
        "[data-footer-mark]",
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, ease: "expo.out", scrollTrigger: { trigger: "[data-footer-mark]", start: "top 95%" } },
      );
    },
    { scope: ref },
  );

  return (
    <footer ref={ref} className="relative overflow-hidden bg-ink text-paper">
      <div className="container-x grid gap-12 pt-24 pb-10 md:grid-cols-12 md:pt-32">
        <div className="md:col-span-12 lg:col-span-4">
          <p className="max-w-sm text-2xl leading-tight font-medium tracking-tight text-balance md:text-3xl">
            Building what India’s energy transition <span className="accent text-mint">needs.</span>
          </p>
          <div className="mt-10 flex items-center gap-4">
            <span className="flex size-14 items-center justify-center rounded-2xl bg-paper p-2">
              <Image src="/images/brand/malpani-group.webp" alt="Malpani Group" width={400} height={593} className="h-full w-auto" />
            </span>
            <p className="text-sm text-paper/60">
              Backed by the <span className="text-paper">Malpani Group</span>
              <br />a century-old family enterprise.
            </p>
          </div>
        </div>

        {footerNav.map((group, i) => (
          <nav key={group.title} aria-label={`Footer — ${group.title}`} className={`md:col-span-3 lg:col-span-2 ${i === 0 ? "lg:col-start-6" : ""}`}>
            <p className="eyebrow mb-5 text-paper/40">{group.title}</p>
            <ul className="space-y-2.5">
              {group.links.map((n) => (
                <li key={n.href}>
                  <Link href={n.href} className="text-paper/80 transition-colors hover:text-mint">
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}

        <address className="not-italic md:col-span-6 lg:col-span-3">
          <p className="eyebrow mb-5 text-paper/40">Head office</p>
          <a href={site.contact.mapUrl} target="_blank" rel="noopener noreferrer" className="block leading-relaxed text-paper/80 transition-colors hover:text-mint">
            {site.contact.address.map((l) => (
              <span key={l} className="block">
                {l}
              </span>
            ))}
          </a>
          <a href={`mailto:${site.contact.email}`} className="mt-5 block text-lg text-paper transition-colors hover:text-mint">
            {site.contact.email}
          </a>
          <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-paper/60">
            {site.contact.phones.map((p) => (
              <a key={p} href={telHref(p)} className="transition-colors hover:text-mint">
                {p}
              </a>
            ))}
          </p>
        </address>
      </div>

      <div className="container-x">
        <div data-footer-mark className="flex flex-col items-start gap-4 border-t border-paper/10 py-8 sm:flex-row sm:items-center sm:justify-between">
          <Link href="/" aria-label={`${site.name} — home`} className="block w-32 opacity-90 transition-opacity hover:opacity-100 md:w-36">
            <Image src="/images/brand/nexen-logo-light.webp" alt={site.name} width={800} height={291} className="h-auto w-full" />
          </Link>
          <p className="eyebrow text-paper/40 sm:flex-1 sm:text-center">{site.tagline}</p>
          <BackToTopBadge />
        </div>
      </div>

      <div className="container-x border-t border-paper/10 py-6 text-xs text-paper/50">
        <p>
          © {process.env.NEXT_PUBLIC_BUILD_YEAR} {site.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

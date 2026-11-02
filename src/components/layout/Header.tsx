"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { nav, site } from "@/content/site";
import { useLenis } from "@/components/providers/SmoothScroll";

export function Header() {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const lenis = useLenis();
  const menuButton = useRef<HTMLButtonElement>(null);
  const lastY = useRef(0);

  // Hide on scroll down, reveal on scroll up.
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      setHidden(y > 200 && y > lastY.current + 2);
      if (y < lastY.current - 2) setHidden(false);
      lastY.current = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the menu when the route changes (adjust state during render, not in an effect).
  const [prevPath, setPrevPath] = useState(pathname);
  if (prevPath !== pathname) {
    setPrevPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (open) lenis?.stop();
    else lenis?.start();
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        menuButton.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, lenis]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : !href.includes("#") && pathname.startsWith(href));

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-transform duration-700 ease-(--ease-expo) ${
          hidden && !open ? "-translate-y-[120%]" : "translate-y-0"
        }`}
      >
        <div className="container-x pt-4 md:pt-5">
          <div
            className={`flex items-center justify-between rounded-full py-2 pr-2 pl-5 text-paper transition-[background-color,box-shadow,backdrop-filter] duration-500 ${
              scrolled || open ? "bg-ink/70 shadow-[0_10px_40px_-10px_rgba(0,0,0,.4)] backdrop-blur-xl" : "bg-transparent"
            }`}
          >
            <Link href="/" aria-label={`${site.name} — home`} className="relative z-10 block w-[118px] md:w-[132px]">
              <Image src="/images/brand/nexen-logo-light.webp" alt={site.name} width={800} height={291} priority className="h-auto w-full" />
            </Link>

            <nav aria-label="Primary" className="hidden lg:block">
              <ul className="flex items-center gap-1">
                {nav.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="group relative block overflow-hidden rounded-full px-3 py-2 text-sm text-paper/80 transition-colors hover:text-paper xl:px-4"
                      aria-current={isActive(item.href) ? "page" : undefined}
                    >
                      <span className="block transition-transform duration-500 ease-(--ease-expo) group-hover:-translate-y-full">{item.label}</span>
                      <span aria-hidden className="absolute inset-x-3 top-full block xl:inset-x-4 transition-transform duration-500 ease-(--ease-expo) group-hover:-translate-y-full">
                        {item.label}
                      </span>
                      {isActive(item.href) && <span aria-hidden className="absolute bottom-1 left-1/2 size-1 -translate-x-1/2 rounded-full bg-mint" />}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="flex items-center gap-2">
              <Link
                href="/contact"
                className="hidden rounded-full bg-paper px-5 py-2.5 text-sm font-medium text-ink transition-colors duration-300 hover:bg-mint sm:inline-flex"
              >
                Get in touch
              </Link>
              <button
                ref={menuButton}
                type="button"
                onClick={() => setOpen((o) => !o)}
                aria-expanded={open}
                aria-controls="mobile-menu"
                aria-label={open ? "Close menu" : "Open menu"}
                className="relative flex size-11 items-center justify-center rounded-full bg-paper/10 lg:hidden"
              >
                <span className={`absolute h-px w-5 bg-paper transition-transform duration-500 ${open ? "rotate-45" : "-translate-y-1"}`} />
                <span className={`absolute h-px w-5 bg-paper transition-transform duration-500 ${open ? "-rotate-45" : "translate-y-1"}`} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            className="fixed inset-0 z-40 flex flex-col justify-between gap-10 overflow-y-auto bg-ink px-6 pt-28 pb-10 text-paper lg:hidden"
            data-lenis-prevent
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          >
            <nav aria-label="Mobile">
              <ul className="space-y-1">
                {nav.map((item, i) => (
                  <li key={item.href} className="overflow-hidden">
                    <motion.div
                      initial={{ y: "110%" }}
                      animate={{ y: 0 }}
                      exit={{ y: "110%" }}
                      transition={{ duration: 0.8, delay: 0.15 + i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <Link
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className="flex items-baseline gap-4 py-1 text-[clamp(2rem,9vw,4rem)] font-semibold tracking-[-0.04em]"
                      >
                        <span className="font-mono text-xs text-mint">0{i + 1}</span>
                        {item.label}
                      </Link>
                    </motion.div>
                  </li>
                ))}
              </ul>
            </nav>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.5 } }}
              exit={{ opacity: 0 }}
              className="space-y-2 text-sm text-paper/60"
            >
              <a href={`mailto:${site.contact.email}`} className="block text-paper">
                {site.contact.email}
              </a>
              <p>{site.contact.address.join(", ")}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

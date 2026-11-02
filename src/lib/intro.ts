"use client";

// Tiny signal: the preloader calls markIntroReady() when it lifts, and
// above-the-fold animations wait for it via onIntroReady().
let ready = false;
const listeners = new Set<() => void>();

export function markIntroReady() {
  if (ready) return;
  ready = true;
  // Defer so listeners run outside whatever GSAP context fired this (e.g. a
  // timeline callback) — otherwise their selector strings resolve inside that scope.
  queueMicrotask(() => {
    listeners.forEach((fn) => fn());
    listeners.clear();
  });
}

export function onIntroReady(fn: () => void) {
  if (ready) {
    fn();
    return () => {};
  }
  listeners.add(fn);
  return () => listeners.delete(fn);
}

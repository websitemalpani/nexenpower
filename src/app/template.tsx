"use client";

import { useEffect, useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";

// The first mount is covered by the preloader; only client-side navigations get the curtain.
let hasMounted = false;

export default function Template({ children }: { children: ReactNode }) {
  const [curtain] = useState(() => hasMounted);
  const reduce = useReducedMotion();

  useEffect(() => {
    hasMounted = true;
  }, []);

  return (
    <>
      {curtain && !reduce && (
        <motion.div
          aria-hidden
          className="pointer-events-none fixed inset-0 z-[90] flex items-center justify-center bg-ink"
          initial={{ clipPath: "inset(0 0 0% 0)" }}
          animate={{ clipPath: "inset(0 0 100% 0)" }}
          transition={{ duration: 0.95, ease: [0.76, 0, 0.24, 1], delay: 0.1 }}
        >
          <motion.span
            className="block h-px w-40 origin-left bg-gradient-to-r from-brand via-teal to-mint"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </motion.div>
      )}
      {children}
    </>
  );
}

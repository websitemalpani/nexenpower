"use client";

import dynamic from "next/dynamic";

const BrandMark = dynamic(() => import("@/components/three/BrandMark"), { ssr: false });

export function BrandMarkStage() {
  return (
    <div className="absolute inset-0">
      <div aria-hidden className="absolute inset-[15%] rounded-full bg-[radial-gradient(circle,rgba(95,227,200,.25),transparent_65%)] blur-2xl" />
      <BrandMark />
    </div>
  );
}

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Baked in at build time (Cache Components disallows reading the clock during prerender).
  env: { NEXT_PUBLIC_BUILD_YEAR: String(new Date().getFullYear()) },
  images: { formats: ["image/avif", "image/webp"] },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;

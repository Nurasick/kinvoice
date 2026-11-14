import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // cacheComponents intentionally off: all data is per-request and keyed by secret tokens.
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

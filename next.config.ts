import type { NextConfig } from "next";

if (!process.env.DATABASE_URL || !process.env.DATABASE_URL.startsWith('postgres')) {
  process.env.DATABASE_URL = 'postgresql://build:build@localhost:5432/build?schema=public';
}

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'plus.unsplash.com' },
    ],
  },
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

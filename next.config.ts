import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  webpack: (config, { dev }) => {
    if (dev) {
      // Disable webpack disk cache in development to prevent 404 CSS chunk corruption on Windows
      config.cache = false;
    }
    return config;
  },
};

export default nextConfig;

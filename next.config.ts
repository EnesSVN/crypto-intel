import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "assets.coingecko.com" }],
  },
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: ["react", "@tanstack/react-query", "lucide-react"],
  },
};

export default nextConfig;

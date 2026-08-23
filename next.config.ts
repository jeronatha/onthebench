import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: { unoptimized: true },
  outputFileTracingRoot: path.join(__dirname),
  eslint: { ignoreDuringBuilds: true },
  async rewrites() {
    return [{ source: "/favicon.ico", destination: "/icon.svg" }];
  },
};

export default nextConfig;

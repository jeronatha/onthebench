import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: { unoptimized: true },
  outputFileTracingRoot: path.join(__dirname),
  eslint: { ignoreDuringBuilds: true },
};

export default nextConfig;

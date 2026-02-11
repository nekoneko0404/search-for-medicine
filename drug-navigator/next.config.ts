import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/drug-navigator',
  images: {
    unoptimized: true,
  }
};

export default nextConfig;

import type { NextConfig } from "next";

// next.config.ts
const nextConfig: NextConfig = {
  output: 'export', // ここで'export'を指定
  basePath: '/okuri_pakkun',
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  }
};

export default nextConfig;

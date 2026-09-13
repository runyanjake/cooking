import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  // satori loads its layout engine as WebAssembly, which shouldn't go through the bundler
  serverExternalPackages: ['satori'],
};

export default nextConfig;

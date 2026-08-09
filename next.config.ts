import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  compress: true,
  poweredByHeader: false,
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  experimental: {
    // Keep Turbopack's persistent cache across restarts and production builds.
    // Avoid Windows EPERM failures when Next starts the default worker pool.
    cpus: 1,
    turbopackFileSystemCacheForDev: true,
    turbopackFileSystemCacheForBuild: true,
    optimizePackageImports: [
      'lucide-react',
      'framer-motion',
      'three',
      '@radix-ui/react-icons',
      'react-icons',
    ],
  },
};

export default nextConfig;

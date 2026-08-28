import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/admin',
        destination: 'http://127.0.0.1:3001',
      },
      {
        source: '/admin/:path*',
        destination: 'http://127.0.0.1:3001/:path*',
      },
    ];
  },
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: 'platform-lookaside.fbsbx.com' },
    ],
  },

  typescript: {
    ignoreBuildErrors: true,
  },

  experimental: {
    // Helps on environments where spawning extra Node processes is restricted.
    workerThreads: true,
    cpus: 1,
  },

  async redirects() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'www.bioforig.com', // redirect FROM this
          },
        ],
        destination: 'https://bioforig.com/:path*', // TO this
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

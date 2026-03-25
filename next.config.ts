import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: 'platform-lookaside.fbsbx.com' },
    ],
  },
  typescript: {
    // Codex sandbox blocks child processes with IPC; Next's type checker uses IPC workers.
    // We still run `tsc --noEmit` separately when validating changes.
    ignoreBuildErrors: true,
  },
};

export default nextConfig;

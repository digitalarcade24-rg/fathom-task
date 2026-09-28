import path from "node:path"

import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // This app lives in a workspace; pin the trace root so Next doesn't walk up
  // and find an unrelated lockfile in the parent directory.
  outputFileTracingRoot: path.join(import.meta.dirname, "../../"),
  eslint: {
    // Lint runs as its own step in CI; don't fail the Vercel build on style.
    ignoreDuringBuilds: true,
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
        ],
      },
    ]
  },
}

export default nextConfig

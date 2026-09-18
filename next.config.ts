import type { NextConfig } from "next";

// Safe, widely-compatible security headers. A strict Content-Security-Policy is
// deliberately NOT set here: it must be tested against the deployed site, the
// SQL demo's external Lambda call, and fonts before turning on, or it silently
// breaks them.
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" },
];

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;

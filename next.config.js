/** @type {import('next').NextConfig} */
const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-eval';
  style-src 'self' 'unsafe-inline';
  font-src 'self' fonts.gstatic.com;
  media-src 'self';
  style-src-elem 'self' 'unsafe-inline' fonts.googleapis.com;
  frame-src 'self';
  script-src-elem 'self' 'unsafe-inline' va.vercel-scripts.com;
  img-src 'self' data: https://ad-manager-beta.vercel.app/;
  connect-src 'self' vitals.vercel-insights.com;
  object-src 'none';
  base-uri 'none';
`;
const securityHeaders = [
  {
    key: "X-DNS-Prefetch-Control",
    value: "on",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "X-XSS-Protection",
    value: "1; mode=block",
  },
  {
    key: "Content-Security-Policy",
    value: ContentSecurityPolicy.replace(/\s{2,}/g, " ").trim(),
  },
];
const nextConfig = {
  reactStrictMode: true,
  async headers() {
    return [
      {
        // Apply these headers to all routes in your application.
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

module.exports = nextConfig;

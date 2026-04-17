/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
        ],
      },
    ]
  },
  async redirects() {
    return [
      { source: '/terms', destination: '/terms-and-conditions', permanent: true },
      { source: '/gambling', destination: '/verticals#gambling', permanent: true },
      { source: '/payments', destination: '/verticals#payments', permanent: true },
      { source: '/ai', destination: '/verticals#ai', permanent: true },
      // Friendly shortcuts — match how people actually type the framework name
      { source: '/mica', destination: '/frameworks/mica', permanent: true },
      { source: '/psd2', destination: '/frameworks/psd2', permanent: true },
      { source: '/dora', destination: '/frameworks/dora', permanent: true },
      { source: '/ai-act', destination: '/frameworks/eu-ai-act', permanent: true },
      { source: '/eu-ai-act', destination: '/frameworks/eu-ai-act', permanent: true },
      // Regulator shortcuts
      { source: '/ukgc', destination: '/regulators/ukgc', permanent: true },
      { source: '/mga', destination: '/regulators/mga', permanent: true },
      { source: '/fca', destination: '/regulators/fca', permanent: true },
      { source: '/eba', destination: '/regulators/eba', permanent: true },
      { source: '/mas', destination: '/regulators/mas', permanent: true },
      { source: '/sga', destination: '/regulators/sga', permanent: true },
    ]
  },
}

export default nextConfig

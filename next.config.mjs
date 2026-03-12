/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  async redirects() {
    return [
      {
        source: '/terms',
        destination: '/terms-and-conditions',
        permanent: true, // 301 redirect
      },
    ]
  },
}

export default nextConfig

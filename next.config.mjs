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
        permanent: true,
      },
      {
        source: '/gambling',
        destination: '/verticals#gambling',
        permanent: true,
      },
      {
        source: '/payments',
        destination: '/verticals#payments',
        permanent: true,
      },
      {
        source: '/ai',
        destination: '/verticals#ai',
        permanent: true,
      },
    ]
  },
}

export default nextConfig

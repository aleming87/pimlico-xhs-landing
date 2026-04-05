export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/login',
          '/offboarding',
          '/onboarding/',
          '/quick-survey',
          '/xhs-monitoring-survey',
          '/contact/thank-you',
        ],
      },
    ],
    sitemap: 'https://pimlicosolutions.com/sitemap.xml',
    host: 'https://pimlicosolutions.com',
  }
}

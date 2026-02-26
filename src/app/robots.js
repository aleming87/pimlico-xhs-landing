export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/login', '/terms-and-conditions', '/xhs-monitoring-survey', '/quick-survey'],
    },
    sitemap: 'https://pimlicosolutions.com/sitemap.xml',
  };
}

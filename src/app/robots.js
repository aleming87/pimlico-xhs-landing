export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/login', '/terms-and-conditions'],
    },
    sitemap: 'https://pimlicosolutions.com/sitemap.xml',
  };
}

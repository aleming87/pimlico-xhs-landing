const ALLOWED_ORIGINS = [
  'https://xhsdata.ai',
  'https://www.xhsdata.ai',
]

function corsHeaders(request) {
  const origin = request.headers.get('origin') || ''
  const isAllowed =
    ALLOWED_ORIGINS.includes(origin) || origin.endsWith('.xhsdata.ai')

  return {
    'Access-Control-Allow-Origin': isAllowed ? origin : ALLOWED_ORIGINS[0],
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
  }
}

// Handle preflight requests
export async function OPTIONS(request) {
  return new Response(null, {
    status: 204,
    headers: corsHeaders(request),
  })
}

// Return news/insights articles as JSON
export async function GET(request) {
  // TODO: Replace with real data source (CMS, database, etc.)
  const articles = [
    {
      id: '1',
      title: 'Sample News Article',
      summary: 'This is a placeholder. Connect to your CMS or database to serve real articles.',
      url: 'https://www.pimlicosolutions.com',
      publishedAt: new Date().toISOString(),
    },
  ]

  return Response.json(
    { articles },
    {
      status: 200,
      headers: corsHeaders(request),
    },
  )
}

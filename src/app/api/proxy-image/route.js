export async function GET(request) {
  const url = request.nextUrl.searchParams.get('url');
  if (!url) {
    return new Response('Missing url parameter', { status: 400 });
  }

  try {
    // Validate URL
    let parsedUrl;
    try { parsedUrl = new URL(url); } catch { return new Response('Invalid URL', { status: 400 }); }
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      return new Response('Only http/https URLs allowed', { status: 400 });
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000); // 15s timeout

    const response = await fetch(url, {
      headers: {
        'Accept': 'image/*,*/*',
        'User-Agent': 'Mozilla/5.0 (compatible; PimlicoProxy/1.0)',
      },
      signal: controller.signal,
      redirect: 'follow',
    });

    clearTimeout(timeout);

    if (!response.ok) {
      return new Response(`Failed to fetch image: ${response.status} ${response.statusText}`, { status: response.status });
    }

    const buffer = await response.arrayBuffer();
    const contentType = response.headers.get('content-type') || 'image/png';

    return new Response(buffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400, s-maxage=86400',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (e) {
    const msg = e.name === 'AbortError' ? 'Image fetch timed out' : e.message;
    return new Response('Image proxy error: ' + msg, { status: 500 });
  }
}

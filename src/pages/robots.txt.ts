import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ site }) => {
  const baseUrl = site ?? new URL('https://www.blgeomatics.co.za');
  const sitemapUrl = new URL('/sitemap-index.xml', baseUrl);

  return new Response(`User-agent: *
Allow: /

Sitemap: ${sitemapUrl}
`, {
    headers: {
      'content-type': 'text/plain; charset=utf-8',
    },
  });
};

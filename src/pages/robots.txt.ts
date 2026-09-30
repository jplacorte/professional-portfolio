import type { APIRoute } from 'astro';

// Generated at build time so the sitemap URL always matches SITE.url.
export const GET: APIRoute = ({ site }) => {
  const lines = ['User-agent: *', 'Allow: /', 'Disallow: /api/', '', `Sitemap: ${new URL('sitemap-index.xml', site)}`];
  return new Response(`${lines.join('\n')}\n`, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};

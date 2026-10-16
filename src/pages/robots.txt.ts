import { site } from '@/config/site';

export const prerender = false;

export function GET() {
  const disallow = site.indexable ? '' : 'Disallow: /';
  const body = `User-agent: *
${disallow}
Allow: /

Sitemap: ${new URL('/sitemap-index.xml', site.url).href}
`;
  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' }
  });
}

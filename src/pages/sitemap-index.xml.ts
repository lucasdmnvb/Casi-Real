import { site } from '@/config/site';
import { loadProducts } from '@/lib/products';

export const prerender = false;

const NOINDEX_PATHS = ['/bolsa/', '/regalo/', '/pedido-imaginario/', '/404/'];

const staticRoutes = [
  '/',
  '/productos/',
  '/categorias/trabajo/',
  '/categorias/vida-cotidiana/',
  '/categorias/relaciones/',
  '/categorias/aventuras/',
  '/ideas/inventos-imposibles/',
  '/ideas/regalos-imposibles/',
  '/regalos-imposibles/',
  '/como-funciona/',
  '/sobre-nosotros/',
  '/privacidad/',
  '/terminos/'
];

export async function GET() {
  const products = await loadProducts();
  const productRoutes = products.map((p) => `/productos/${p.id}/`);
  const all = Array.from(new Set([...staticRoutes, ...productRoutes])).filter((r) => !NOINDEX_PATHS.includes(r));

  const origin = site.url.replace(/\/$/, '');
  const now = new Date().toISOString();
  const urls = all.map((path) => {
    const p = products.find((x) => `/productos/${x.id}/` === path);
    const lastmod = p ? new Date(p.data.publishedDate).toISOString() : now;
    return `  <url>
    <loc>${origin}${path}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${path === '/' ? '1.0' : '0.8'}</priority>
  </url>`;
  });

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>
`;

  return new Response(body, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' }
  });
}

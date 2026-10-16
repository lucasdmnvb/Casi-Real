# CASI REAL — Plan de implementación

## Arquitectura actual (verificada)
- **Framework:** Astro 4.16.19 (SSG, `output: static`, sin adapter). Vite 5.4.21, Node 24.
- **Datos:** content collection `products` (20 archivos `src/content/products/*.md`), esquema Zod en `src/content.config.ts`.
- **Rutas:** página de producto dinámica `src/pages/productos/[slug].astro` (generada en build con `getStaticPaths`). Catálogo, 4 categorías, regalos, bolsa, pedido, páginas editoriales, `robots.txt.ts` y `sitemap-index.xml.ts` como endpoints. **Build: 37 páginas**.
- **Componentes:** `header.astro`, `footer.astro`, `category-page.astro`, `analytics.astro` y helpers `.ts` (`seo-head.ts`, `product-card.ts`) que devuelven `HTMLString`.
- **Bolsa:** `src/lib/cart.ts` + `localStorage` (`casi-real:bag:v1`), sincronizada por `public/scripts/bag-ui.js`.
- **Regalos:** `src/lib/gifts.ts` (query params `p/v/to/from/note`) + `/regalo/` (destino) + `/regalos-imposibles/` (constructor con los 20 productos).
- **Analítica:** `src/lib/analytics.ts` (eventos tipados) + `src/components/analytics.astro`.
- **SEO:** `seo-head.ts`, `lang="es-CL"`, `og:locale es_CL`, sitemap y robots dinámicos.
- **Tests:** vitest (23 tests: cart, gifts, products, content validation sobre los 20 productos).
- **Estado git:** limpio salvo cambios de esta iteración. Build: 37 páginas OK. Tests: 23/23 OK.

## Defectos confirmados (histórico)
1. **P0 — Enlaces `/productos/undefined/`.** `src/components/product-card.ts` leía `data.id` (inexistente en el frontmatter) en vez de `product.id`. Rompía TODAS las tarjetas.
2. **P0 — `style="border-top:4px solid ${c.accent}"`** literal en `src/pages/index.astro` (string, no template).
3. Sitemap/robots con `site.url` por defecto `https://example.invalid`.
4. `lang="es"` / `og:locale es_ES` en vez de `es-CL`.
5. Páginas de producto duplicadas (mantenimiento frágil).
6. `product-card.ts` escapaba mal `&`.

## Fases
- **F1 (P0):** arreglar `product-card.ts` y el bug de `${c.accent}`. ✅
- **F2:** design system (`global.css`) — tokens, tipografía, componentes. ✅
- **F3:** centralizar páginas de producto en `src/pages/productos/[slug].astro` + componentes. ✅
- **F4:** rediseño de homepage. ✅
- **F5:** ampliar catálogo a 20 inventos + SVG. ✅
- **F6:** catálogo con búsqueda/filtro/orden + botón "Sorpréndeme". ✅
- **F7:** regalos (sugerencias dinámicas, remitente, WhatsApp). ✅
- **F8:** analítica (eventos centralizados) + `SITE_URL`. ✅
- **F9:** SEO (`es-CL`, sitemap dinámico sin duplicados, breadcrumbs). ✅
- **F10:** tests + documentación + build final. ✅

## Archivos clave modificados
`src/components/product-card.ts`, `src/pages/index.astro`, `src/styles/global.css`, `src/config/site.ts`, `src/lib/*`, `src/pages/productos/[slug].astro`, `src/pages/productos/index.astro`, `src/pages/regalos-imposibles/index.astro`, `src/pages/regalo/index.astro`, `src/pages/sitemap-index.xml.ts`, `src/content/products/*.md`, `public/images/products/*.svg`, `tests/content.test.ts`, docs.

## Validación
`npm run build` → 37 páginas, cero enlaces `undefined`. `npm test` → 23/23. Grep de `dist/` buscando `undefined|[object Object]|/productos//` → 0. Sitemap: 33 URLs (13 estáticas + 20 productos), sin duplicados.

## Criterios de aceptación
Cero enlaces internos `/undefined/`; build y tests en verde; catálogo ampliado y documentado; regalos compartibles sin backend; sin structured data de comercio real. ✅

## Pendiente (manual, no automatizable)
- Desplegar en Vercel/Cloudflare Pages desde el panel (no hay credenciales/MCP disponibles).
- Definir `SITE_URL` con el hostname definitivo e indexar en Search Console tras revisar canonicals.

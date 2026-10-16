# CHANGELOG — CASI REAL

## [1.1.0] — Transformación a calidad de producción

Reescritura y ampliación del MVP siguiendo el plan de implementación (F1–F10). Sin
dependencias nuevas de pago ni backend. Deploy estático compatible con Vercel y
Cloudflare Pages.

### Corregido
- **P0:** las tarjetas de producto enlazaban a `/productos/undefined/` (`product-card.ts`
  leía `data.id` en vez de `product.id`). Ahora todas las tarjetas resuelven a su slug.
- **P0:** `${c.accent}` se imprimía literal en el home (string, no template).
- Escapado HTML de `&` corregido en `product-card.ts`.
- Sitemap duplicaba las rutas de los 8 productos originales.
- `site.url` por defecto pasó de `https://example.invalid` a `https://casi-real.vercel.app`.

### Añadido
- **Design system** en `src/styles/global.css`: tokens, tipografía, componentes, estilos de
  impresión y `prefers-reduced-motion`.
- **Página de producto dinámica** `src/pages/productos/[slug].astro` (reemplaza 8 archivos
  duplicados): configurador, características, efectos secundarios, especificaciones, FAQ,
  relacionados y JSON-LD.
- **Catálogo** con búsqueda, filtro por categoría, orden y botón *Sorpréndeme*.
- **12 inventos nuevos** (20 en total) con sus ilustraciones SVG locales:
  traductor-de-indirectas, silenciador-de-reuniones, cargador-de-paciencia,
  boton-de-fin-de-semana, detector-de-spoilers, atajo-de-trafico, corrector-de-decisiones,
  modo-avion-social, congelador-de-momentos, filtro-de-recuerdos-vergonzosos,
  extensor-de-vacaciones, promesa-de-ascenso.
- Campos `sideEffects` e `idealFor` en el esquema de contenido y en los 20 productos.
- **Regalos:** constructor con los 20 productos, remitente opcional y compartir por WhatsApp
  además de copiar/enlace nativo/imprimir.
- **Analítica:** eventos tipados en `src/lib/analytics.ts` y delegación de clics de tarjeta
  en `src/components/analytics.astro`. Sin `PUBLIC_GA4_ID`, no carga scripts de terceros.
- **SEO:** `lang="es-CL"`, `og:locale es_CL`, sitemap sin duplicados e índice de productos
  completo.
- `README.md` completo.
- Tests de contenido ahora descubren y validan los 20 productos automáticamente.

### Cambiado
- `src/pages/index.astro`, `header.astro`, `footer.astro` y las 4 páginas de categoría
  reescritos (nuevas clases, accesibilidad y menú móvil).
- `PUBLIC_INDEXABLE` por defecto indexable salvo que se ponga explícitamente `false`.
- Eliminado `debug-ids.mjs` (script de depuración).

### Verificación
- `npm run build` → **37 páginas**, sin enlaces `undefined`.
- `npm test` → **23/23** en verde.
- Grep de `dist/` (`undefined|[object Object]|/productos//`) → 0 coincidencias.
- Sitemap → 33 URLs (13 estáticas + 20 productos), sin duplicados.

### Limitaciones conocidas
- `npm run check` (`astro check`) da falsos positivos `ts(2307)` al resolver imports `.astro`
  en este entorno; el build resuelve todo correctamente.
- El despliegue a Vercel/Cloudflare Pages es manual (sin credenciales/MCP en el entorno).

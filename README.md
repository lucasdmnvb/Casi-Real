# CASI REAL

> Una tienda ficticia de inventos imposibles. Productos inventados. Diversión real.

CASI REAL es un sitio estático que presenta **inventos que no existen** como si fueran
productos reales: se exploran, se personalizan y se regalan, pero nunca se venden. No hay
carrito real, ni pagos, ni envíos, ni datos de cliente. Los "créditos imaginarios" son un
detalle temático, no un precio.

## Índice

- [Qué es](#qué-es)
- [Stack](#stack)
- [Empezar](#empezar)
- [Scripts](#scripts)
- [Estructura](#estructura)
- [Catálogo y contenido](#catálogo-y-contenido)
- [Variables de entorno](#variables-de-entorno)
- [Despliegue](#despliegue)
- [SEO](#seo)
- [Analítica](#analítica)
- [Tests](#tests)
- [Aviso de ficción](#aviso-de-ficción)

## Qué es

20 inventos imposibles (traductor de indirectas, cancelador de reuniones, pausador de tiempo,
etc.) organizados en 4 categorías. Cada uno tiene su página de producto con configurador
determinista, características absurdamente útiles, efectos secundarios ficticios,
especificaciones, FAQ y productos relacionados.

Funciones principales:

- **Catálogo** con búsqueda, filtro por categoría, orden y botón *Sorpréndeme* (todo en cliente).
- **Configurador** por producto: eliges una versión y recibes un resultado escrito a mano.
- **Bolsa imaginaria** en `localStorage` y **pedido imaginario** simulado (sin pago).
- **Regalos imposibles**: elige un invento, añade dedicatoria y remitente, y comparte por
  enlace, WhatsApp o certificado imprimible.
- **Sin backend**: 100% HTML estático.

## Stack

- [Astro](https://astro.build) 4.16 (`output: static`, sin adapter).
- TypeScript estricto.
- CSS nativo (sin frameworks).
- JavaScript de cliente en vanilla TS.
- [Vitest](https://vitest.dev) para tests.

## Empezar

```bash
npm install
npm run dev        # servidor de desarrollo en http://localhost:4321
```

## Scripts

| Comando | Descripción |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build estático en `dist/` |
| `npm run preview` | Previsualiza el build |
| `npm run check` | `astro check` (ver notas de limitación) |
| `npm test` | Ejecuta los tests de Vitest |

## Estructura

```
src/
  components/       header, footer, category-page, analytics (.astro) y helpers .ts
  config/           site.ts, categories.ts
  content/
    products/       20 inventos (.md) + content.config.ts (esquema Zod)
  lib/              products, cart, gifts, analytics
  pages/
    productos/[slug].astro   página de producto generada en build
    productos/index.astro    catálogo con filtros
    categorias/              4 páginas de categoría
    regalos-imposibles/      constructor de regalos
    regalo/                  vista del regalo (noindex)
    bolsa/  pedido-imaginario/  noindex
    sitemap-index.xml.ts  robots.txt.ts
  styles/global.css
public/
  images/products/*.svg     ilustraciones locales (sin hotlinks)
  scripts/bag-ui.js
tests/                       cart, gifts, products, content
```

## Catálogo y contenido

Cada producto vive en `src/content/products/<slug>.md` y se valida contra el esquema Zod de
`src/content.config.ts`. Campos destacados: `title`, `category`, `shortDescription`,
`seoTitle`, `seoDescription`, `imaginaryCredits`, `image`, `imageAlt`, `eyebrow`, `hook`,
`benefits`, `sideEffects`, `idealFor`, `specs`, `configurator` (prompt + 3 opciones),
`faq`, `related`, `featured`, `publishedDate`, `fictional: true`.

Para añadir un invento: crea el `.md`, añade su SVG en `public/images/products/`, y referencia
slugs existentes en `related`. El sitemap y las rutas se generan solos en el build.

> Nota de YAML: cualquier valor con `: ` (dos puntos y espacio) debe ir entre comillas.

## Variables de entorno

Copia `.env.example` a `.env`. Todas son opcionales; hay valores por defecto sensatos.

| Variable | Por defecto | Uso |
|---|---|---|
| `SITE_URL` | `https://casi-real.vercel.app` | Origen canónico (canonicals, sitemap, OG) |
| `PUBLIC_INDEXABLE` | `true` | Pon `false` para `noindex` + `Disallow: /` |
| `PUBLIC_GA4_ID` | vacío | GA4 opcional; sin valor, la analítica no hace nada |

## Despliegue

El proyecto es estático y se despliega en cualquier hosting de archivos:

- **Vercel:** conecta el repositorio y publica. Framework preset *Astro*, build `npm run build`,
  output `dist`. Producción: <https://casi-real.vercel.app/>.
- **Cloudflare Pages:** preset *Astro*, build `npm run build`, output `dist`.

Define `SITE_URL` con el hostname definitivo antes de indexar.

## SEO

- Canonicals absolutos, `og:*`, Twitter card y `og:locale=es_CL`.
- `lang="es-CL"`, breadcrumbs y JSON-LD de `BreadcrumbList` y `WebPage`.
- Sitemap generado en `src/pages/sitemap-index.xml.ts` (excluye rutas `noindex`).
- `robots.txt` generado en `src/pages/robots.txt.ts`.
- Sin structured data de comercio real (`Offer`, `aggregateRating`, stock, envíos).

> Limitación conocida: `npm run check` (`astro check`) reporta falsos `ts(2307)` al resolver
> imports `.astro` en este entorno. `npm run build` resuelve todo correctamente.

## Analítica

Los eventos se centralizan en `src/lib/analytics.ts` (tipados). `src/components/analytics.astro`
delega los clics de tarjeta. Sin `PUBLIC_GA4_ID`, `track()` es un no-op: el sitio no carga
ningún script de terceros por defecto.

Eventos: `product_view`, `product_card_click`, `select_variant`, `bag_add`, `catalog_search`,
`category_filter`, `random_product_click`, `related_product_click`, `gift_created`,
`gift_shared`, `imaginary_checkout_complete`.

## Tests

```bash
npm test
```

Cubren carrito, regalos, utilidades de producto y validación de contenido (incluida la
existencia de arte SVG, referencias `related` resueltas y campos requeridos para todos
los productos).

## Aviso de ficción

Todos los productos, especificaciones y resultados son inventados con fines de humor y
entretenimiento. Nada de este sitio se vende, fabrica o envía. "CASI REAL" es un experimento
creativo; la disponibilidad de la marca o el dominio no está verificada.

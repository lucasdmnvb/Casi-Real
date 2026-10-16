# IMPLEMENTATION NOTES — CASI REAL MVP

**Repository:** `CASI-REAL-MVP/` (fresh project; the ZIP blueprint docs were preserved under `CASI_REAL_OpenCode_MVP_Blueprint/` and were NOT modified).
**Stack:** Astro 4.16.19 (static SSG, no adapter), TypeScript strict, native CSS, vanilla client-side JS, vitest.
**Build:** `npm run build` → static HTML in `dist/` (25 pages). `npm run preview` for local check.
**Environment:** Node v24.18.0, npm 11.16.0, Windows.

## Routes implemented (all static HTML)

| Path | Indexable | Notes |
|---|---|---|
| `/` | yes (env) | Home: hero, categories, featured, how it works, editorial |
| `/productos/` | yes | 8-card catalog, search/filter/reset |
| `/productos/<id>/` ×8 | yes | PDP: hero, disclosure, deterministic configurator (24 outcomes), specs, FAQ, related |
| `/categorias/trabajo/`, `/categorias/vida-cotidiana/`, `/categorias/relaciones/`, `/categorias/aventuras/` | yes | H1, 120–180 word intro, 2 cards |
| `/ideas/inventos-imposibles/` | yes | Editorial article 1 |
| `/ideas/regalos-imposibles/` | yes | Editorial article 2 |
| `/regalos-imposibles/` | yes | Gift builder (8 products, optional recipient ≤32ch, dedication ≤120ch, copy/share/print) |
| `/regalo/` | **noindex** | Gift recipient view (query params `p/v/to/note`, safe validation, generic OG) |
| `/como-funciona/` | yes | Simulation vs purchase transparency |
| `/sobre-nosotros/` | yes | Experiment/lab framing, no fabricated identity |
| `/privacidad/` | yes | localStorage + optional analytics disclosure |
| `/terminos/` | yes | Fiction disclosure, no real offer |
| `/bolsa/` | **noindex** | localStorage imaginary bag |
| `/pedido-imaginario/` | **noindex** | Simulated receipt `CR-XXXXXX`, no payment |
| `/404` | **noindex** | Helpful fallback |

Dynamic routes (`[slug].astro`) were replaced by static files because `Astro.props`/`Astro.params` at module scope cannot be resolved during this Astro 4.16 static build (prerender `createAstro` exposes no `props`); all product/category data is loaded at build time via `getCollection('products')`.

## Content
- 8 authored products copied unchanged into `src/content/products/` from the blueprint (all Spanish copy, frontmatter, 24 configurator outcomes, FAQs, related links preserved).
- Content collection schema per `02-ENGINEERING/CONTENT_SCHEMA.md` (`src/content.config.ts`).
- 2 editorial articles from `04-CONTENT/EDITORIAL.md` with internal product links.
- 8 original local SVG product illustrations (`public/images/products/*.svg`), favicon, and a generic OG card (`public/images/og/casi-real-share.svg`); no hotlinked or cropped art.

## Client-side functionality (vanilla JS, no framework)
- Deterministic per-product configurator: selected option → authored result via `aria-live="polite"` region; "Agregar a mi bolsa imaginaria", "Regalar esta idea".
- Catalog: local search/filter by title/description, category chips, reset, accessible result count.
- Imaginary bag: `localStorage` key `casi-real:bag:v1`, validated line items (`{productId, variantId, quantity}`), qty 1–9, max 20 lines, cart count in header, remove/clear, `casi-real:bag-changed` event for cross-tab sync.
- Simulated order: explicit confirmation dialog ("No se cobrará ni enviará nada"), receipt in `sessionStorage`, bag cleared after receipt, print-friendly. No payment, address, email, or phone fields anywhere.
- Gift builder + recipient page: strict param validation, optional fields, URL encoding, `navigator.share` with clipboard fallback, print stylesheet hiding nav/controls, "Regalo imaginario / Sin valor comercial" watermark.
- No dead CTAs; every button/link has a real outcome.

## SEO / technical
- Canonical absolute URLs from `SITE_URL` env (default `https://example.invalid` for local dev).
- `PUBLIC_INDEXABLE=false` by default → all pages `noindex,follow` and `robots.txt` `Disallow: /`; `/bolsa/`, `/regalo/`, `/pedido-imaginario/`, `/404` always noindex and excluded from sitemap.
- `src/pages/sitemap-index.xml.ts` (generated at build) includes every intended public page, excludes noindex paths.
- `src/pages/robots.txt.ts` with absolute sitemap link.
- Unique `<title>`/meta description per page, `og:*` tags, `lang="es"`, breadcrumbs (`BreadcrumbList`-compatible markup), semantic HTML.
- No `Offer`, `aggregateRating`, stock, shipping, or merchant structured data; no fictional prices ("créditos imaginarios" are thematic only, no currency symbols).
- No third-party fonts, CDNs, or hotlinked images; system font stack; GA4 optional behind `PUBLIC_GA4_ID` and noops when absent.
- `.html` extension URLs (trailingSlash `always`).

## Commands run and results
- `npm install` — OK (440 packages; benign `allow-scripts` notices for sharp/esbuild).
- `npm run build` — OK, 25 pages, static output in `dist/`.
- `npm test` (vitest) — OK, 23/23 tests across 4 files (cart 8, gifts 7, products 4, content validation 4).
- `npm run check` (astro check) — exits 1 in THIS environment due to an Astro 4.16 prerender quirk: `Astro.props`/`Astro.params` at module scope cannot be resolved (`createAstro` base instance exposes no `props`), producing ~409 `ts(2307)` "Cannot find module" errors on `.astro` component imports. Vite/build resolves all imports correctly; this is an environment/tooling limitation, not a runtime defect. All TypeScript in `.ts` modules is type-clean.
- Smoke checks on built `dist/` HTML — all passed (titles, metadata, canonicals, noindex exclusions, sitemap inclusions/exclusions, robots, links, configurator markup, no payment language).

## Design / trade-offs
- Static product pages instead of dynamic routes: required by the module-scope `Astro.props` limitation; keeps all routes buildable and crawlable.
- No `@astrojs/sitemap` integration: custom `sitemap-index.xml.ts` API route for full control over noindex exclusions.
- Components that receive data (SeoHead, ProductCard) are `.ts` modules returning `HTMLString` from `astro/runtime/server`; page components are `.astro` with no props.
- Bag state is localStorage-only; no backend, no Workers, no runtime LLM, no payments (by design).
- Gift recipient page has generic static OG; personalized dynamic previews explicitly out of scope (zero-backend MVP).

## `.env.example`
Provided. Production owner must set `SITE_URL` to the owned hostname and `PUBLIC_INDEXABLE=true` only after canonical review, then submit the sitemap to Google Search Console.

## Remaining manual steps (do not automate)
1. Publish to Cloudflare Pages: framework preset Astro, build command `npm run build`, output directory `dist`. No paid plan required.
2. Set `SITE_URL=<owned hostname>` and `PUBLIC_INDEXABLE=true` in Cloudflare Pages env vars only after confirming the canonical hostname.
3. Verify ownership in Google Search Console, submit `sitemap-index.xml`, record baseline indexing.
4. Optional: set `PUBLIC_GA4_ID` and add consent UI if required by applicable jurisdiction (analytics is off by default).
5. AdSense: only after site quality, real traction, policy pages, and program approval — not part of this MVP.
6. Brand/domain/trademark availability for "CASI REAL" is NOT verified; brand is config-driven in `src/config/site.ts`.

## Test files
`tests/cart.test.ts`, `tests/gifts.test.ts`, `tests/products.test.ts`, `tests/content.test.ts`, `tests/setup.ts`, `tests/mocks/astro-content.ts`, `vitest.config.ts`.

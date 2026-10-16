import { HTMLString } from 'astro/runtime/server/index';
import type { Product } from '@/lib/products';

export function escapeHtml(value: unknown): string {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function productCard({
  product,
  categoryColor = 'var(--accent)',
  source = 'grid'
}: {
  product: Product;
  categoryColor?: string;
  source?: string;
}): HTMLString {
  const { data } = product;
  const id = product.id;
  const catColor = {
    trabajo: 'var(--cat-trabajo)',
    'vida-cotidiana': 'var(--cat-vida-cotidiana)',
    relaciones: 'var(--cat-relaciones)',
    aventuras: 'var(--cat-aventuras)'
  }[data.category] ?? categoryColor;
  const href = `/productos/${encodeURIComponent(id)}/`;
  return new HTMLString(`
<article class="card" data-id="${escapeHtml(id)}" data-cat="${escapeHtml(data.category)}" data-title="${escapeHtml(data.title)}" data-desc="${escapeHtml(data.shortDescription)}" data-featured="${data.featured ? '1' : '0'}" data-source="${escapeHtml(source)}">
  <a class="card-media" href="${href}" style="--cat-color: ${catColor};" aria-label="${escapeHtml(data.title)}" data-card-link data-product="${escapeHtml(id)}" data-category="${escapeHtml(data.category)}">
    <img src="${escapeHtml(data.image)}" alt="${escapeHtml(data.imageAlt)}" width="640" height="420" loading="lazy" decoding="async" />
    <span class="tag ficticio" style="position:absolute; top:0.85rem; left:0.85rem;">Ficticio</span>
  </a>
  <div class="card-body">
    <p class="card-eyebrow">${escapeHtml(data.eyebrow)}</p>
    <h3 class="card-title"><a href="${href}" data-card-link data-product="${escapeHtml(id)}" data-category="${escapeHtml(data.category)}">${escapeHtml(data.title)}</a></h3>
    <p class="card-hook">${escapeHtml(data.hook)}</p>
  </div>
  <div class="card-footer">
    <span class="card-credits">${data.imaginaryCredits.toLocaleString('es-CL')} créditos imaginarios</span>
    <a href="${href}" class="btn btn-ghost btn-sm" data-card-link data-product="${escapeHtml(id)}" data-category="${escapeHtml(data.category)}">Ver</a>
  </div>
</article>
`.trim());
}

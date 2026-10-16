import { HTMLString } from 'astro/runtime/server/index';
import type { Product } from '@/lib/products';

export function productCard({
  product,
  categoryColor = 'var(--accent)'
}: {
  product: Product;
  categoryColor?: string;
}): HTMLString {
  const { data } = product;
  const catColor = {
    trabajo: 'var(--cat-trabajo)',
    'vida-cotidiana': 'var(--cat-vida-cotidiana)',
    relaciones: 'var(--cat-relaciones)',
    aventuras: 'var(--cat-aventuras)'
  }[data.category] ?? categoryColor;
  const esc = (s: string) => String(s).replace(/"/g, '&quot;').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return new HTMLString(`
<article class="card" data-id="${esc(data.id)}" data-cat="${esc(data.category)}" data-title="${esc(data.title)}" data-desc="${esc(data.shortDescription)}">
  <div class="card-media" style="--cat-color: ${catColor};">
    <img src="${esc(data.image)}" alt="${esc(data.imageAlt)}" width="600" height="600" loading="lazy" decoding="async" />
    <span class="tag ficticio" style="position:absolute; top:0.8rem; left:0.8rem; border-color: ${catColor}; color: ${catColor};">Ficticio</span>
  </div>
  <div class="card-body">
    <p class="card-eyebrow">${esc(data.eyebrow)}</p>
    <h3 class="card-title"><a href="/productos/${esc(data.id)}/">${esc(data.title)}</a></h3>
    <p class="card-hook">${esc(data.hook)}</p>
  </div>
  <div class="card-footer">
    <span class="card-credits">${data.imaginaryCredits.toLocaleString('es-ES')} cr\u00e9ditos imaginarios</span>
    <a href="/productos/${esc(data.id)}/" class="btn btn-ghost btn-sm">Ver</a>
  </div>
</article>
`.trim());
}

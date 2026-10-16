import type { CollectionEntry } from 'astro:content';
import { getCollection } from 'astro:content';
import { site } from '@/config/site';
import { categories, categoryBySlug } from '@/config/categories';

export type Product = Omit<CollectionEntry<'products'>, 'id'> & { id: string };

export function productPath(id: string): string {
  return `/productos/${encodeURIComponent(id)}/`;
}

export async function loadProducts(): Promise<Product[]> {
  return (await getCollection('products'))
    .map((p) => ({ ...p, id: p.id.replace(/\.md$/, '') }))
    .sort((a, b) => a.data.title.localeCompare(b.data.title, 'es'));
}

export function getProductById(products: Product[], id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function productsByCategory(products: Product[], slug: string): Product[] {
  return products.filter((p) => p.data.category === slug);
}

export function validateRelatedIds(products: Product[]): string[] {
  const ids = new Set(products.map((p) => p.id));
  const problems: string[] = [];
  for (const p of products) {
    if (p.data.related.includes(p.id)) {
      problems.push(`${p.id}: related references itself`);
    }
    for (const rel of p.data.related) {
      if (!ids.has(rel)) {
        problems.push(`${p.id}: related id "${rel}" does not exist`);
      }
    }
  }
  return problems;
}

/**
 * Related products priority:
 * 1) explicit curated relationships, 2) shared category, 3) any other published product.
 * Never includes the current product and never duplicates.
 */
export function relatedProducts(products: Product[], current: Product, limit = 3): Product[] {
  const out: Product[] = [];
  const seen = new Set<string>([current.id]);
  const push = (p: Product | undefined) => {
    if (!p || seen.has(p.id)) return;
    seen.add(p.id);
    out.push(p);
  };
  const byId = new Map(products.map((p) => [p.id, p]));
  for (const id of current.data.related) push(byId.get(id));
  for (const p of products) if (p.data.category === current.data.category) push(p);
  for (const p of products) push(p);
  return out.slice(0, limit);
}

export function optionFor(product: Product, variantId: string) {
  return product.data.configurator.options.find((o) => o.id === variantId);
}

export function creditsSum(items: { productId: string; quantity: number }[], products: Product[]): number {
  return items.reduce((sum, item) => {
    const p = getProductById(products, item.productId);
    return p ? sum + p.data.imaginaryCredits * item.quantity : sum;
  }, 0);
}

export function categoryName(slug: string): string {
  const c = categoryBySlug(slug);
  return c ? c.name : slug;
}

export function canonical(urlPath: string): string {
  return site.url.replace(/\/$/, '') + urlPath;
}

export { site, categories };

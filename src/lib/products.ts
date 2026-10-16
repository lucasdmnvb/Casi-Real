import type { CollectionEntry } from 'astro:content';
import { getCollection } from 'astro:content';
import { site } from '@/config/site';
import { categories, categoryBySlug } from '@/config/categories';

export type Product = Omit<CollectionEntry<'products'>, 'id'> & { id: string };

export async function loadProducts(): Promise<Product[]> {
  return (await getCollection('products')).map((p) => ({ ...p, id: p.id.replace(/\.md$/, '') }));
}

export function getProductById(
  products: Product[],
  id: string
): Product | undefined {
  return products.find((p) => p.id === id);
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

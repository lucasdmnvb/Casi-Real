import { describe, expect, it } from 'vitest';
import { optionFor, creditsSum, validateRelatedIds, type Product } from '@/lib/products';

const product = (id: string): Product => ({
  id,
  slug: id,
  body: '',
  collection: 'products',
  data: {
    title: 'Producto de prueba',
    category: 'trabajo',
    shortDescription: 'Descripción corta de prueba para el invento.',
    seoTitle: 'Título SEO',
    seoDescription: 'Meta description de prueba con suficiente longitud.',
    badge: 'Prueba',
    imaginaryCredits: 100,
    image: '/images/products/test.svg',
    imageAlt: 'Objeto ficticio de prueba',
    eyebrow: 'Prueba',
    hook: 'Gancho de prueba',
    benefits: ['Uno', 'Dos', 'Tres'],
    specs: [{ label: 'A', value: '1' }, { label: 'B', value: '2' }, { label: 'C', value: '3' }],
    configurator: {
      prompt: 'Pregunta',
      options: [
        { id: 'uno', label: 'Uno', result: 'Resultado uno' },
        { id: 'dos', label: 'Dos', result: 'Resultado dos' },
        { id: 'tres', label: 'Tres', result: 'Resultado tres' }
      ]
    },
    faq: [{ q: 'Q', a: 'A' }, { q: 'Q2', a: 'A2' }, { q: 'Q3', a: 'A3' }],
    related: [],
    featured: false,
    publishedDate: new Date('2026-10-16'),
    fictional: true
  },
  render: () => Promise.resolve({} as never)
}) as Product;

describe('products', () => {
  it('returns the exact authored result for a known variant', () => {
    const p = product('clon-personal');
    const o = optionFor(p, 'uno');
    expect(o).toBeDefined();
    expect(o!.result).toContain('Resultado uno');
    expect(optionFor(p, 'dos')!.result).toContain('Resultado dos');
  });

  it('rejects unknown variant ids', () => {
    const p = product('clon-personal');
    expect(optionFor(p, 'no-existe')).toBeUndefined();
  });

  it('sums imaginary credits across line items', () => {
    const p = product('clon-personal'); // 1290 credits
    expect(creditsSum([{ productId: 'clon-personal', quantity: 2 }], [p])).toBe(200);
    expect(creditsSum([{ productId: 'no-existe', quantity: 5 }], [p])).toBe(0);
  });

  it('validates related references', () => {
    const p = product('clon-personal');
    expect(validateRelatedIds([p])).toEqual([]);
    const bad = product('clon-personal');
    bad.data.related = ['no-existe', 'clon-personal'];
    const problems = validateRelatedIds([bad]);
    expect(problems.length).toBeGreaterThan(0);
  });
});

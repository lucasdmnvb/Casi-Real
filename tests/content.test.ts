import { describe, expect, it } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { z } from 'zod';
import matter from 'gray-matter';

const dir = join(__dirname, '..', 'src', 'content', 'products');

const Product = z.object({
  title: z.string().min(4),
  category: z.enum(['trabajo', 'vida-cotidiana', 'relaciones', 'aventuras']),
  shortDescription: z.string().min(25),
  seoTitle: z.string().min(12),
  seoDescription: z.string().min(60),
  badge: z.string(),
  imaginaryCredits: z.number().int().positive(),
  image: z.string(),
  imageAlt: z.string().min(15),
  eyebrow: z.string(),
  hook: z.string(),
  benefits: z.array(z.string()).min(3),
  specs: z.array(z.object({ label: z.string(), value: z.string() })).min(3),
  configurator: z.object({
    prompt: z.string(),
    options: z.array(z.object({
      id: z.string().regex(/^[a-z0-9-]+$/),
      label: z.string(),
      result: z.string()
    })).min(2)
  }),
  faq: z.array(z.object({ q: z.string(), a: z.string() })).min(3),
  related: z.array(z.string()).min(2),
  featured: z.boolean(),
  publishedDate: z.coerce.date(),
  fictional: z.literal(true)
});

const files = ['borrador-de-conversaciones', 'cancelador-de-reuniones', 'clima-de-bolsillo', 'clon-personal', 'pausador-de-tiempo', 'recuperador-de-sueno', 'teletransportador-de-vacaciones', 'traductor-de-pensamientos'];

describe('content validation', () => {
  it('loads all 8 authored products with valid frontmatter', () => {
    const products = files.map((f) => {
      const raw = readFileSync(join(dir, `${f}.md`), 'utf8');
      const { data } = matter(raw);
      return Product.parse(data);
    });
    expect(products).toHaveLength(8);
    const ids = products.map((p) => p.title);
    expect(new Set(ids).size).toBe(8);
  });

  it('every product has 3 options with unique ids and authored results', () => {
    for (const f of files) {
      const raw = readFileSync(join(dir, `${f}.md`), 'utf8');
      const { data } = matter(raw);
      const parsed = Product.parse(data);
      const optionIds = parsed.configurator.options.map((o) => o.id);
      expect(new Set(optionIds).size).toBe(optionIds.length);
      for (const o of parsed.configurator.options) {
        expect(o.result.length).toBeGreaterThan(0);
      }
    }
  });

  it('every related reference resolves and no product references itself', () => {
    const byId = new Map<string, string>();
    for (const f of files) {
      const raw = readFileSync(join(dir, `${f}.md`), 'utf8');
      const { data } = matter(raw);
      const parsed = Product.parse(data);
      byId.set(f, parsed.title);
    }
    for (const f of files) {
      const raw = readFileSync(join(dir, `${f}.md`), 'utf8');
      const { data } = matter(raw);
      const parsed = Product.parse(data);
      expect(parsed.related).not.toContain(f);
      for (const rel of parsed.related) {
        expect(byId.has(rel)).toBe(true);
      }
    }
  });

  it('every product has local SVG artwork and an imageAlt', () => {
    for (const f of files) {
      expect(existsSync(join(__dirname, '..', 'public', 'images', 'products', `${f}.svg`))).toBe(true);
      const raw = readFileSync(join(dir, `${f}.md`), 'utf8');
      const { data } = matter(raw);
      expect(data.imageAlt.length).toBeGreaterThan(14);
    }
  });
});

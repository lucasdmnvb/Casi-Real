import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

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
  specs: z
    .array(
      z.object({ label: z.string(), value: z.string() })
    )
    .min(3),
  configurator: z.object({
    prompt: z.string(),
    options: z
      .array(
        z.object({
          id: z.string().regex(/^[a-z0-9-]+$/),
          label: z.string(),
          result: z.string()
        })
      )
      .min(2)
  }),
  faq: z.array(z.object({ q: z.string(), a: z.string() })).min(3),
  related: z.array(z.string()).min(2),
  featured: z.boolean(),
  publishedDate: z.coerce.date(),
  fictional: z.literal(true)
});

export const collections = {
  products: defineCollection({
    loader: glob({ pattern: '**/*.md', base: './src/content/products' }),
    schema: Product
  })
};

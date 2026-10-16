import { getCollection } from 'astro:content';
const products = await getCollection('products');
console.log(products.map((p) => ({ id: p.id, slug: p.slug, data: { title: p.data.title, category: p.data.category } })));

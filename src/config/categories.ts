import type { CollectionEntry } from 'astro:content';

export const categories = [
  {
    slug: 'trabajo',
    name: 'Trabajo',
    heading: 'Inventos imposibles para sobrevivir al trabajo',
    intro:
      'Reuniones que podrían ser un mensaje, lunes que no respetan el descanso y agendas que se solapan solas. Esta sección reúne inventos ficticios pensados para los problemas de oficina demasiado reales. Ninguno se fabrica, ninguno se envía.',
    accent: '#215F54',
    products: ['cancelador-de-reuniones', 'clon-personal']
  },
  {
    slug: 'vida-cotidiana',
    name: 'Vida cotidiana',
    heading: 'Pequeños milagros para días demasiado normales',
    intro:
      'El clima que no consulta el calendario, las horas de sueño que desaparecen y las mañanas que empiezan demasiado pronto. Objetos imaginarios para el ritmo ordinario del día a día.',
    accent: '#B86830',
    products: ['clima-de-bolsillo', 'recuperador-de-sueno']
  },
  {
    slug: 'relaciones',
    name: 'Relaciones',
    heading: 'Tecnología imposible para conversaciones muy humanas',
    intro:
      'Mensajes enviados al grupo equivocado, palabras que se torcen al salir y audios que duran demasiado. Invenciones ficticias para lo que se dice y lo que queda por decir.',
    accent: '#73548B',
    products: ['borrador-de-conversaciones', 'traductor-de-pensamientos']
  },
  {
    slug: 'aventuras',
    name: 'Aventuras',
    heading: 'Viajar más lejos de lo que permite la física',
    intro:
      'Aeropuertos que se saltan, domingos que se acaban y destinos que no aparecen en ningún mapa. Ideas de viaje imposible para quien necesita desaparecer un rato.',
    accent: '#315D95',
    products: ['pausador-de-tiempo', 'teletransportador-de-vacaciones']
  }
] as const;

export type Category = (typeof categories)[number];

export function categoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export function productCategory(product: CollectionEntry<'products'>): Category | undefined {
  return categoryBySlug(product.data.category);
}

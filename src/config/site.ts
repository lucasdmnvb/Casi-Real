export const site = {
  name: 'CASI REAL',
  tagline: 'Lo imposible, en exhibición.',
  transparency: 'Una tienda ficticia. Productos inventados. Diversión real.',
  shortDescription:
    'Explora inventos imposibles como si fueran productos reales. Personaliza objetos absurdos, arma un pedido imaginario y regálale una idea a alguien.',
  url: ((import.meta.env.SITE_URL as string | undefined) || 'https://casi-real.vercel.app').replace(/\/$/, ''),
  indexable: (import.meta.env.PUBLIC_INDEXABLE as string | undefined) !== 'false',
  ga4Id: (import.meta.env.PUBLIC_GA4_ID as string | undefined) || '',
  ogImage: '/images/og/casi-real-share.svg',
  favicon: '/images/favicon.svg',
  lang: 'es-CL',
  locale: 'es_CL',
  defaultMetadata: {
    title: 'CASI REAL | Tienda ficticia de inventos imposibles',
    description:
      'Explora inventos imposibles como si fueran productos reales. Personaliza objetos absurdos, arma un pedido imaginario y regálale una idea a alguien.',
    lang: 'es-CL',
    type: 'website'
  },
  localStorageKeys: {
    bag: 'casi-real:bag:v1'
  },
  cartMaxLines: 20,
  cartMaxQty: 9,
  giftNoteMaxChars: 120,
  giftRecipientMaxChars: 32
} as const;

export const isIndexable = site.indexable;

export type SEOMeta = {
  title: string;
  description: string;
  url: string;
  type?: 'website' | 'article';
  image?: string;
  noindex?: boolean;
  publishedTime?: string;
  modifiedTime?: string;
};

export function seoMeta(meta: SEOMeta): SEOMeta {
  return {
    type: 'website',
    noindex: false,
    ...meta
  };
}

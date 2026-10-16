import { HTMLString } from 'astro/runtime/server/index';

const indexable = (import.meta.env.PUBLIC_INDEXABLE as string | undefined) === 'true';

export function seoHead({
  title,
  description,
  url,
  image = '',
  noindex = !indexable,
  type = 'website',
  publishedTime,
  modifiedTime
}: {
  title: string;
  description: string;
  url: string;
  image?: string;
  noindex?: boolean;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
}): HTMLString {
  const parts: string[] = [
    `<title>${escapeHtml(title)}</title>`,
    `<meta name="description" content="${escapeHtml(description)}" />`,
    `<link rel="canonical" href="${escapeHtml(url)}" />`,
    `<meta property="og:title" content="${escapeHtml(title)}" />`,
    `<meta property="og:description" content="${escapeHtml(description)}" />`,
    `<meta property="og:type" content="${type}" />`,
    `<meta property="og:url" content="${escapeHtml(url)}" />`,
    `<meta property="og:locale" content="es_ES" />`
  ];
  if (image) parts.push(`<meta property="og:image" content="${escapeHtml(image)}" />`);
  parts.push(noindex ? '<meta name="robots" content="noindex,follow" />' : '<meta name="robots" content="index,follow" />');
  if (publishedTime) parts.push(`<meta property="article:published_time" content="${escapeHtml(publishedTime)}" />`);
  if (modifiedTime) parts.push(`<meta property="article:modified_time" content="${escapeHtml(modifiedTime)}" />`);
  return new HTMLString(parts.join('\n    '));
}

function escapeHtml(s: string): string {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

import { HTMLString } from 'astro/runtime/server/index';
import { site } from '@/config/site';

export function seoHead({
  title,
  description,
  url,
  image = '',
  noindex = !site.indexable,
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
  const absImage = image ? new URL(image, site.url).href : '';
  const parts: string[] = [
    `<title>${escapeHtml(title)}</title>`,
    `<meta name="description" content="${escapeHtml(description)}" />`,
    `<link rel="canonical" href="${escapeHtml(url)}" />`,
    `<meta name="robots" content="${noindex ? 'noindex,follow' : 'index,follow'}" />`,
    `<meta property="og:site_name" content="${escapeHtml(site.name)}" />`,
    `<meta property="og:title" content="${escapeHtml(title)}" />`,
    `<meta property="og:description" content="${escapeHtml(description)}" />`,
    `<meta property="og:type" content="${type}" />`,
    `<meta property="og:url" content="${escapeHtml(url)}" />`,
    `<meta property="og:locale" content="${escapeHtml(site.locale)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escapeHtml(title)}" />`,
    `<meta name="twitter:description" content="${escapeHtml(description)}" />`
  ];
  if (absImage) {
    parts.push(`<meta property="og:image" content="${escapeHtml(absImage)}" />`);
    parts.push(`<meta name="twitter:image" content="${escapeHtml(absImage)}" />`);
  }
  if (publishedTime) parts.push(`<meta property="article:published_time" content="${escapeHtml(publishedTime)}" />`);
  if (modifiedTime) parts.push(`<meta property="article:modified_time" content="${escapeHtml(modifiedTime)}" />`);
  return new HTMLString(parts.join('\n    '));
}

export function jsonLd(data: Record<string, unknown>): HTMLString {
  return new HTMLString(
    `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`
  );
}

export function escapeHtml(s: string): string {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

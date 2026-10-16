export type AnalyticsParams = Record<string, string | number | boolean>;
export type AnalyticsEvent =
  | 'product_view'
  | 'product_card_click'
  | 'gift_created'
  | 'gift_shared'
  | 'random_product_click'
  | 'related_product_click'
  | 'bag_add'
  | 'imaginary_checkout_complete'
  | 'catalog_search'
  | 'category_filter'
  | 'select_variant';

declare global {
  interface Window {
    causiRealTrack?: (event: AnalyticsEvent, params?: AnalyticsParams) => void;
    gtag?: (...args: unknown[]) => void;
  }
}

export function track(event: AnalyticsEvent, params?: AnalyticsParams): void {
  if (typeof window === 'undefined') return;
  const ga4Id = (import.meta.env.PUBLIC_GA4_ID as string | undefined) ?? '';
  if (!ga4Id) return;
  window.gtag?.('event', event, params);
}

export function initAnalytics(): void {
  if (typeof window === 'undefined') return;
  window.causiRealTrack = track;
  const ga4Id = (import.meta.env.PUBLIC_GA4_ID as string | undefined) ?? '';
  if (!ga4Id) return;
  if (document.getElementById('ga4-src')) return;
  const s = document.createElement('script');
  s.id = 'ga4-src';
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(ga4Id)}`;
  document.head.appendChild(s);
  const inline = document.createElement('script');
  inline.textContent = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${ga4Id}');`;
  document.head.appendChild(inline);
}

/** Public-safe: only emits coarse, non-personal parameters. */
export function analyticsReady(): boolean {
  return typeof window !== 'undefined' && typeof window.causiRealTrack === 'function';
}

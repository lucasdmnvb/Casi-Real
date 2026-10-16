export function track(eventName: string, params?: Record<string, string | number | boolean>): void {
  const ga4Id = (import.meta.env.PUBLIC_GA4_ID as string | undefined) ?? '';
  if (!ga4Id || typeof window === 'undefined') return;
  if (!(window as any).gtag) return;
  (window as any).gtag?.('event', eventName, params);
}

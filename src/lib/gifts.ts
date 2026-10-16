import { site } from '@/config/site';

export type GiftData = {
  productId: string;
  variantId: string;
  to?: string;
  from?: string;
  note?: string;
};

export function sanitizeGiftInput(raw: unknown): GiftData | null {
  if (!raw || typeof raw !== 'object') return null;
  const r = raw as Record<string, unknown>;
  const productId = typeof r.productId === 'string' ? r.productId : '';
  const variantId = typeof r.variantId === 'string' ? r.variantId : '';
  if (!/^[a-z0-9-]+$/.test(productId) || !/^[a-z0-9-]+$/.test(variantId)) return null;
  const to = typeof r.to === 'string' ? r.to.trim().slice(0, site.giftRecipientMaxChars) : '';
  const from = typeof r.from === 'string' ? r.from.trim().slice(0, site.giftRecipientMaxChars) : '';
  const note = typeof r.note === 'string' ? r.note.trim().slice(0, site.giftNoteMaxChars) : '';
  return {
    productId,
    variantId,
    ...(to ? { to } : {}),
    ...(from ? { from } : {}),
    ...(note ? { note } : {})
  };
}

export function buildGiftUrl(data: GiftData, base = window.location.origin): string {
  const params = new URLSearchParams({ p: data.productId, v: data.variantId });
  if (data.to) params.set('to', data.to);
  if (data.from) params.set('from', data.from);
  if (data.note) params.set('note', data.note);
  return `${base}/regalo/?${params.toString()}`;
}

export function parseGiftQuery(search: string): GiftData | null {
  try {
    const url = new URL(search, 'https://example.invalid');
    return sanitizeGiftInput({
      productId: url.searchParams.get('p') ?? '',
      variantId: url.searchParams.get('v') ?? '',
      to: url.searchParams.get('to') ?? '',
      from: url.searchParams.get('from') ?? '',
      note: url.searchParams.get('note') ?? ''
    });
  } catch {
    return null;
  }
}

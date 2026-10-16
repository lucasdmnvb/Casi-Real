import { site } from '@/config/site';

export type BagItem = { productId: string; variantId: string; quantity: number };

const KEY = site.localStorageKeys.bag;

export function loadBag(): BagItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(
        (i):
          i is BagItem =>
            i &&
            typeof i.productId === 'string' &&
            typeof i.variantId === 'string' &&
            Number.isInteger(i.quantity) &&
            i.quantity >= 1 &&
            i.quantity <= site.cartMaxQty
      )
      .slice(0, site.cartMaxLines);
  } catch {
    return [];
  }
}

export function dispatchBagChanged(): void {
  if (typeof window === 'undefined') return;
  try {
    window.dispatchEvent(new CustomEvent('casi-real:bag-changed'));
  } catch {
    // listeners not ready
  }
}

export function saveBag(items: BagItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(items.slice(0, site.cartMaxLines)));
    dispatchBagChanged();
  } catch {
    // storage unavailable: bag lives only this session
  }
}

export function addItem(items: BagItem[], productId: string, variantId: string): BagItem[] {
  const next = [...items];
  const existing = next.find((i) => i.productId === productId && i.variantId === variantId);
  if (existing) {
    existing.quantity = Math.min(existing.quantity + 1, site.cartMaxQty);
  } else if (next.length < site.cartMaxLines) {
    next.push({ productId, variantId, quantity: 1 });
  }
  saveBag(next);
  return next;
}

export function setQuantity(items: BagItem[], productId: string, variantId: string, quantity: number): BagItem[] {
  const next = items.map((i) =>
    i.productId === productId && i.variantId === variantId
      ? { ...i, quantity: Math.min(Math.max(quantity, 1), site.cartMaxQty) }
      : i
  );
  saveBag(next);
  return next;
}

export function removeItem(items: BagItem[], productId: string, variantId: string): BagItem[] {
  const next = items.filter((i) => !(i.productId === productId && i.variantId === variantId));
  saveBag(next);
  return next;
}

export function clearBag(): void {
  saveBag([]);
}

export function cartCount(items: BagItem[]): number {
  return items.reduce((sum, i) => sum + i.quantity, 0);
}

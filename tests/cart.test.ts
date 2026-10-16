import { describe, expect, it, beforeEach } from 'vitest';
import {
  loadBag,
  saveBag,
  addItem,
  setQuantity,
  removeItem,
  clearBag,
  cartCount,
  type BagItem
} from '@/lib/cart';

const win = global as unknown as { window: unknown };
const store: Record<string, string> = {};

beforeEach(() => {
  Object.keys(store).forEach((k) => delete store[k]);
  (win.window as Record<string, unknown>).localStorage = {
    getItem: (k: string) => (k in store ? store[k] : null),
    setItem: (k: string, v: string) => {
      store[k] = String(v);
    },
    removeItem: (k: string) => {
      delete store[k];
    },
    clear: () => {
      Object.keys(store).forEach((k) => delete store[k]);
    }
  };
});

describe('imaginary bag', () => {
  it('starts empty', () => {
    expect(loadBag()).toEqual([]);
    expect(cartCount(loadBag())).toBe(0);
  });

  it('adds an item and updates the count', () => {
    const bag = addItem([], 'clon-personal', 'reuniones');
    expect(bag).toEqual([{ productId: 'clon-personal', variantId: 'reuniones', quantity: 1 }]);
    expect(cartCount(bag)).toBe(1);
    expect(loadBag()).toEqual(bag);
  });

  it('increments quantity for the same product and variant', () => {
    let bag = addItem([], 'clon-personal', 'reuniones');
    bag = addItem(bag, 'clon-personal', 'reuniones');
    expect(bag[0].quantity).toBe(2);
    expect(cartCount(bag)).toBe(2);
  });

  it('caps quantity at 9', () => {
    let bag = [] as BagItem[];
    for (let i = 0; i < 15; i++) bag = addItem(bag, 'clon-personal', 'reuniones');
    expect(bag[0].quantity).toBe(9);
    expect(cartCount(bag)).toBe(9);
  });

  it('caps lines at 20', () => {
    let bag = [] as BagItem[];
    for (let i = 0; i < 25; i++) bag = addItem(bag, `p-${i}`, 'v');
    expect(bag.length).toBe(20);
  });

  it('sets quantity within bounds', () => {
    let bag = addItem([], 'clon-personal', 'reuniones');
    bag = setQuantity(bag, 'clon-personal', 'reuniones', 5);
    expect(bag[0].quantity).toBe(5);
    bag = setQuantity(bag, 'clon-personal', 'reuniones', 0);
    expect(bag[0].quantity).toBe(1);
    bag = setQuantity(bag, 'clon-personal', 'reuniones', 100);
    expect(bag[0].quantity).toBe(9);
  });

  it('removes items and clears the bag', () => {
    let bag = addItem([], 'clon-personal', 'reuniones');
    bag = addItem(bag, 'cancelador-de-reuniones', 'alineamiento');
    bag = removeItem(bag, 'clon-personal', 'reuniones');
    expect(bag).toEqual([{ productId: 'cancelador-de-reuniones', variantId: 'alineamiento', quantity: 1 }]);
    clearBag();
    expect(loadBag()).toEqual([]);
  });

  it('ignores corrupt localStorage entries', () => {
    store['casi-real:bag:v1'] = 'not json';
    expect(loadBag()).toEqual([]);
  });
});

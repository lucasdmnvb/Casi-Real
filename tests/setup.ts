const store: Record<string, string> = {};
const win = {
  localStorage: {
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
  },
  dispatchEvent: () => true,
  location: { origin: 'https://ejemplo.com' },
  addEventListener: () => {},
  removeEventListener: () => {}
};
(global as unknown as { window?: unknown }).window = win;

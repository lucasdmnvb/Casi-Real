import { describe, expect, it } from 'vitest';
import { sanitizeGiftInput, buildGiftUrl, parseGiftQuery } from '@/lib/gifts';

describe('gift builder', () => {
  it('accepts valid minimal input', () => {
    const g = sanitizeGiftInput({ productId: 'clon-personal', variantId: 'reuniones' });
    expect(g).toEqual({ productId: 'clon-personal', variantId: 'reuniones' });
  });

  it('rejects invalid ids and empty values', () => {
    expect(sanitizeGiftInput({ productId: 'no pe', variantId: 'reuniones' })).toBeNull();
    expect(sanitizeGiftInput({ productId: 'NOPE', variantId: 'reuniones' })).toBeNull();
    expect(sanitizeGiftInput({ productId: 'clon-personal', variantId: 'no!pe' })).toBeNull();
    expect(sanitizeGiftInput({ productId: '', variantId: 'reuniones' })).toBeNull();
    expect(sanitizeGiftInput({ productId: 'clon-personal', variantId: '' })).toBeNull();
  });

  it('accepts valid slug-style ids', () => {
    expect(sanitizeGiftInput({ productId: 'nope', variantId: 'reuniones' })).toEqual({
      productId: 'nope',
      variantId: 'reuniones'
    });
    expect(sanitizeGiftInput({ productId: 'clon-personal', variantId: 'reuniones' })).toEqual({
      productId: 'clon-personal',
      variantId: 'reuniones'
    });
  });

  it('truncates recipient and note to the allowed lengths', () => {
    const g = sanitizeGiftInput({
      productId: 'clon-personal',
      variantId: 'reuniones',
      to: 'A'.repeat(50),
      note: 'B'.repeat(200)
    });
    expect(g.to).toHaveLength(32);
    expect(g.note).toHaveLength(120);
  });

  it('builds and parses a gift URL with accents', () => {
    const url = buildGiftUrl({ productId: 'clon-personal', variantId: 'reuniones', to: 'María', note: '¡Feliz día!' }, 'https://ejemplo.com');
    expect(url).toContain('to=Mar%C3%ADa');
    expect(url).toContain('note=%C2%A1Feliz+d%C3%ADa%21');
    const parsed = parseGiftQuery(new URL(url).search);
    expect(parsed).toMatchObject({ productId: 'clon-personal', variantId: 'reuniones', to: 'María', note: '¡Feliz día!' });
  });

  it('rejects malformed gift URLs', () => {
    expect(parseGiftQuery('?p=no pe&v=reuniones')).toBeNull();
    expect(parseGiftQuery('?p=clon-personal&v=no!pe')).toBeNull();
    expect(parseGiftQuery('?p=clon-personal')).toBeNull();
    expect(parseGiftQuery('')).toBeNull();
    expect(parseGiftQuery('?otro=1')).toBeNull();
  });

  it('accepts valid gift URLs', () => {
    expect(parseGiftQuery('?p=clon-personal&v=reuniones')).toEqual({
      productId: 'clon-personal',
      variantId: 'reuniones'
    });
  });
});

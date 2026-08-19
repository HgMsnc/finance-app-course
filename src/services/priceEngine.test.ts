import { describe, expect, it } from 'vitest';
import { getQuote, resolveSeed, synthesizeTicker } from './priceEngine';

describe('priceEngine', () => {
  it('returns an identical quote for the same known ticker and date', () => {
    const date = new Date(Date.UTC(2026, 5, 15));
    const a = getQuote('AAPL', date);
    const b = getQuote('AAPL', date);
    expect(a).toEqual(b);
  });

  it('is case-insensitive and trims whitespace', () => {
    const date = new Date(Date.UTC(2026, 5, 15));
    expect(getQuote('aapl', date)).toEqual(getQuote('AAPL', date));
    expect(getQuote(' AAPL ', date)).toEqual(getQuote('AAPL', date));
  });

  it('deterministically synthesizes the same profile for an unknown ticker every time', () => {
    const first = synthesizeTicker('ZZZQ');
    const second = synthesizeTicker('ZZZQ');
    expect(first).toEqual(second);
    expect(first.basePrice).toBeGreaterThanOrEqual(5);
    expect(first.basePrice).toBeLessThanOrEqual(500);
  });

  it('resolves known tickers from the seed table and falls back for unknown ones', () => {
    expect(resolveSeed('AAPL').name).toBe('Apple Inc.');
    expect(resolveSeed('ZZZQ').name).toBe('ZZZQ Holdings Inc.');
  });

  it('produces a different (but still bounded) price on a different calendar date', () => {
    const day1 = getQuote('NVDA', new Date(Date.UTC(2026, 0, 1)));
    const day2 = getQuote('NVDA', new Date(Date.UTC(2026, 6, 1)));
    expect(day1.currentPrice).not.toBe(day2.currentPrice);
    expect(day1.currentPrice).toBeGreaterThan(0);
    expect(day2.currentPrice).toBeGreaterThan(0);
  });

  it('computes dayChange as currentPrice minus closingPrice', () => {
    const quote = getQuote('MSFT', new Date(Date.UTC(2026, 5, 15)));
    expect(quote.dayChange).toBeCloseTo(quote.currentPrice - quote.closingPrice, 2);
  });
});

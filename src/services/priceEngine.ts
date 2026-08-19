import { KNOWN_TICKERS, SECTORS, type SeedTicker } from '../constants/tickers';
import { addDaysISO, daysSinceEpoch, toISODate } from '../utils/dateUtils';
import type { StockQuote } from '../types';

function hashString(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed: number): () => number {
  let state = seed | 0;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

/** Deterministically synthesizes a stable price/sector/name profile for a ticker not in the seed table. */
export function synthesizeTicker(tickerInput: string): SeedTicker {
  const ticker = tickerInput.toUpperCase().trim();
  const rand = mulberry32(hashString(`${ticker}|profile`));
  const basePrice = round2(5 + rand() * 495);
  const sector = SECTORS[Math.floor(rand() * SECTORS.length)];
  const volatility = 0.01 + rand() * 0.03;
  return {
    ticker,
    name: `${ticker} Holdings Inc.`,
    sector,
    basePrice,
    volatility,
  };
}

export function resolveSeed(tickerInput: string): SeedTicker {
  const ticker = tickerInput.toUpperCase().trim();
  return KNOWN_TICKERS[ticker] ?? synthesizeTicker(ticker);
}

// Drift is measured from a fixed recent anchor, not the Unix epoch — anchoring at 1970 would mean
// ~20,000+ days of compounding by 2026, blowing every ticker's price out to the floor or ceiling.
const DRIFT_ANCHOR_ISO = '2024-01-01';

function priceForDate(seed: SeedTicker, isoDate: string): number {
  const dailyRand = mulberry32(hashString(`${seed.ticker}|${isoDate}`));
  const trendRand = mulberry32(hashString(`${seed.ticker}|trend`));
  const driftBias = trendRand() - 0.5; // fixed per-ticker long-term direction, in [-0.5, 0.5)
  const driftPerDay = driftBias * 0.0004;
  const daysSinceAnchor = daysSinceEpoch(isoDate) - daysSinceEpoch(DRIFT_ANCHOR_ISO);
  const cumulativeDrift = clamp(1 + driftPerDay * daysSinceAnchor, 0.5, 2);
  const noise = 1 + (dailyRand() - 0.5) * 2 * seed.volatility;
  return Math.max(0.5, round2(seed.basePrice * cumulativeDrift * noise));
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/** Returns a deterministic quote for `ticker` as of `asOf` (defaults to now). Same ticker + calendar date always resolves to the same quote. */
export function getQuote(tickerInput: string, asOf: Date = new Date()): StockQuote {
  const seed = resolveSeed(tickerInput);
  const asOfIso = toISODate(asOf);
  const previousCloseIso = addDaysISO(asOfIso, -1);

  const currentPrice = priceForDate(seed, asOfIso);
  const closingPrice = priceForDate(seed, previousCloseIso);
  const dayChange = round2(currentPrice - closingPrice);
  const dayChangePercent = closingPrice === 0 ? 0 : round2((dayChange / closingPrice) * 100);

  return {
    ticker: seed.ticker,
    name: seed.name,
    currentPrice,
    closingPrice,
    dayChange,
    dayChangePercent,
    sector: seed.sector,
    lastUpdated: asOfIso,
  };
}

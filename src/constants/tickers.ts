export interface SeedTicker {
  ticker: string;
  name: string;
  sector: string;
  basePrice: number;
  volatility: number; // fraction, e.g. 0.02 = 2% typical daily noise
}

export const SECTORS = [
  'Technology',
  'Communication Services',
  'Consumer Discretionary',
  'Consumer Staples',
  'Healthcare',
  'Financials',
  'Energy',
  'Industrials',
  'Real Estate',
  'Diversified / ETF',
] as const;

export const KNOWN_TICKERS: Record<string, SeedTicker> = {
  AAPL: { ticker: 'AAPL', name: 'Apple Inc.', sector: 'Technology', basePrice: 227.5, volatility: 0.018 },
  MSFT: { ticker: 'MSFT', name: 'Microsoft Corporation', sector: 'Technology', basePrice: 430.2, volatility: 0.016 },
  GOOGL: { ticker: 'GOOGL', name: 'Alphabet Inc.', sector: 'Communication Services', basePrice: 172.8, volatility: 0.02 },
  AMZN: { ticker: 'AMZN', name: 'Amazon.com, Inc.', sector: 'Consumer Discretionary', basePrice: 186.4, volatility: 0.022 },
  NVDA: { ticker: 'NVDA', name: 'NVIDIA Corporation', sector: 'Technology', basePrice: 128.9, volatility: 0.032 },
  META: { ticker: 'META', name: 'Meta Platforms, Inc.', sector: 'Communication Services', basePrice: 512.3, volatility: 0.024 },
  TSLA: { ticker: 'TSLA', name: 'Tesla, Inc.', sector: 'Consumer Discretionary', basePrice: 241.6, volatility: 0.038 },
  JNJ: { ticker: 'JNJ', name: 'Johnson & Johnson', sector: 'Healthcare', basePrice: 154.7, volatility: 0.011 },
  PFE: { ticker: 'PFE', name: 'Pfizer Inc.', sector: 'Healthcare', basePrice: 27.9, volatility: 0.017 },
  JPM: { ticker: 'JPM', name: 'JPMorgan Chase & Co.', sector: 'Financials', basePrice: 214.3, volatility: 0.015 },
  V: { ticker: 'V', name: 'Visa Inc.', sector: 'Financials', basePrice: 279.1, volatility: 0.013 },
  XOM: { ticker: 'XOM', name: 'Exxon Mobil Corporation', sector: 'Energy', basePrice: 117.5, volatility: 0.019 },
  CVX: { ticker: 'CVX', name: 'Chevron Corporation', sector: 'Energy', basePrice: 158.2, volatility: 0.017 },
  VOO: { ticker: 'VOO', name: 'Vanguard S&P 500 ETF', sector: 'Diversified / ETF', basePrice: 512.8, volatility: 0.009 },
  SPY: { ticker: 'SPY', name: 'SPDR S&P 500 ETF Trust', sector: 'Diversified / ETF', basePrice: 559.4, volatility: 0.009 },
  KO: { ticker: 'KO', name: 'The Coca-Cola Company', sector: 'Consumer Staples', basePrice: 63.8, volatility: 0.01 },
  PG: { ticker: 'PG', name: 'Procter & Gamble Co.', sector: 'Consumer Staples', basePrice: 168.4, volatility: 0.01 },
  DIS: { ticker: 'DIS', name: 'The Walt Disney Company', sector: 'Communication Services', basePrice: 94.6, volatility: 0.021 },
};

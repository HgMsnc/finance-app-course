import type { Theme } from '../../utils/theme';

// SVG presentation attributes (fill, stroke) don't resolve CSS var() the way inline `style` does,
// so recharts color props need real hex values per theme rather than the --color-* tokens directly.
// Mirrors the light/dark palettes in src/index.css.
const CHART_PALETTES: Record<Theme, string[]> = {
  light: [
    '#4f46e5',
    '#06b6d4',
    '#f59e0b',
    '#ec4899',
    '#10b981',
    '#8b5cf6',
    '#f97316',
    '#64748b',
    '#0ea5e9',
    '#eab308',
    '#14b8a6',
    '#a855f7',
    '#ef4444',
  ],
  dark: [
    '#818cf8',
    '#22d3ee',
    '#fbbf24',
    '#f472b6',
    '#34d399',
    '#a78bfa',
    '#fb923c',
    '#94a3b8',
    '#38bdf8',
    '#facc15',
    '#2dd4bf',
    '#c084fc',
    '#f87171',
  ],
};

const POSITIVE_COLORS: Record<Theme, string> = { light: '#16a34a', dark: '#4ade80' };
const NEGATIVE_COLORS: Record<Theme, string> = { light: '#dc2626', dark: '#f87171' };
const GRID_COLORS: Record<Theme, string> = { light: '#e2e8f0', dark: '#263244' };
const MUTED_TEXT_COLORS: Record<Theme, string> = { light: '#64748b', dark: '#93a0b4' };

export interface ChartPalette {
  chartColors: string[];
  colorForIndex: (index: number) => string;
  positive: string;
  negative: string;
  grid: string;
  mutedText: string;
}

export function getChartPalette(theme: Theme): ChartPalette {
  const chartColors = CHART_PALETTES[theme];
  return {
    chartColors,
    colorForIndex: (index: number) => chartColors[index % chartColors.length],
    positive: POSITIVE_COLORS[theme],
    negative: NEGATIVE_COLORS[theme],
    grid: GRID_COLORS[theme],
    mutedText: MUTED_TEXT_COLORS[theme],
  };
}

// Tooltip is a real HTML div rendered via inline `style`, where var() resolves normally.
export const TOOLTIP_STYLE = {
  contentStyle: {
    backgroundColor: 'var(--color-surface)',
    borderColor: 'var(--color-border)',
    color: 'var(--color-ink)',
  },
  labelStyle: { color: 'var(--color-ink)' },
  itemStyle: { color: 'var(--color-ink)' },
};

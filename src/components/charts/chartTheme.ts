// Mirrors the --color-chart-* tokens in src/index.css.
export const CHART_COLORS = [
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
];

export function colorForIndex(index: number): string {
  return CHART_COLORS[index % CHART_COLORS.length];
}

export const POSITIVE_COLOR = '#16a34a';
export const NEGATIVE_COLOR = '#dc2626';
export const GRID_COLOR = '#e2e8f0';
export const MUTED_TEXT_COLOR = '#64748b';

import {
  Area,
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { getChartPalette, TOOLTIP_STYLE } from './chartTheme';
import { useTheme } from '../../hooks/useTheme';

export interface CashflowDatum {
  month: string; // YYYY-MM
  income: number;
  expenses: number;
}

function formatMonthLabel(month: string): string {
  const [y, m] = month.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, 1)).toLocaleDateString('en-US', { month: 'short', year: '2-digit', timeZone: 'UTC' });
}

export function CashflowChart({
  data,
  valueFormatter = (v: number) => v.toLocaleString(),
}: {
  data: CashflowDatum[];
  valueFormatter?: (value: number) => string;
}) {
  const chartData = data.map((d) => ({ ...d, label: formatMonthLabel(d.month) }));
  const { theme } = useTheme();
  const palette = getChartPalette(theme);

  return (
    <ResponsiveContainer width="100%" height={280}>
      <ComposedChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid stroke={palette.grid} vertical={false} />
        <XAxis dataKey="label" tick={{ fontSize: 12, fill: palette.mutedText }} axisLine={{ stroke: palette.grid }} tickLine={false} />
        <YAxis tick={{ fontSize: 12, fill: palette.mutedText }} axisLine={false} tickLine={false} width={56} />
        <Tooltip formatter={(value) => valueFormatter(Number(value))} {...TOOLTIP_STYLE} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Bar dataKey="income" name="Income" fill={palette.positive} radius={[4, 4, 0, 0]} barSize={22} />
        <Area dataKey="expenses" name="Expenses" fill={palette.negative} fillOpacity={0.15} stroke={palette.negative} strokeWidth={2} />
      </ComposedChart>
    </ResponsiveContainer>
  );
}

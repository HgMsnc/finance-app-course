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
import { GRID_COLOR, MUTED_TEXT_COLOR, NEGATIVE_COLOR, POSITIVE_COLOR } from './chartTheme';

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

  return (
    <ResponsiveContainer width="100%" height={280}>
      <ComposedChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid stroke={GRID_COLOR} vertical={false} />
        <XAxis dataKey="label" tick={{ fontSize: 12, fill: MUTED_TEXT_COLOR }} axisLine={{ stroke: GRID_COLOR }} tickLine={false} />
        <YAxis tick={{ fontSize: 12, fill: MUTED_TEXT_COLOR }} axisLine={false} tickLine={false} width={56} />
        <Tooltip formatter={(value) => valueFormatter(Number(value))} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Bar dataKey="income" name="Income" fill={POSITIVE_COLOR} radius={[4, 4, 0, 0]} barSize={22} />
        <Area dataKey="expenses" name="Expenses" fill={NEGATIVE_COLOR} fillOpacity={0.15} stroke={NEGATIVE_COLOR} strokeWidth={2} />
      </ComposedChart>
    </ResponsiveContainer>
  );
}

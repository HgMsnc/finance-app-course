import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { getChartPalette, TOOLTIP_STYLE } from './chartTheme';
import { useTheme } from '../../hooks/useTheme';

export interface DonutDatum {
  name: string;
  value: number;
}

export function DonutChart({
  data,
  valueFormatter = (v: number) => v.toLocaleString(),
  emptyLabel = 'No data yet',
}: {
  data: DonutDatum[];
  valueFormatter?: (value: number) => string;
  emptyLabel?: string;
}) {
  const { theme } = useTheme();

  if (data.length === 0) {
    return <div className="flex h-64 items-center justify-center text-sm text-ink-muted">{emptyLabel}</div>;
  }

  const palette = getChartPalette(theme);

  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" innerRadius={60} outerRadius={95} paddingAngle={2}>
          {data.map((entry, index) => (
            <Cell key={entry.name} fill={palette.colorForIndex(index)} stroke="none" />
          ))}
        </Pie>
        <Tooltip formatter={(value) => valueFormatter(Number(value))} {...TOOLTIP_STYLE} />
        <Legend verticalAlign="bottom" height={48} wrapperStyle={{ fontSize: 12 }} />
      </PieChart>
    </ResponsiveContainer>
  );
}

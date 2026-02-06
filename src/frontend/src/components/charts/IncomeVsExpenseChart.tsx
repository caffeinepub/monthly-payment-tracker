import { useGetMonthlyTotals } from '../../hooks/useTransactions';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface IncomeVsExpenseChartProps {
  month: number;
  year: number;
  compact?: boolean;
}

export default function IncomeVsExpenseChart({ month, year, compact = false }: IncomeVsExpenseChartProps) {
  const { data: totals, isLoading } = useGetMonthlyTotals(year, month);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center" style={{ height: compact ? 200 : 300 }}>
        <div className="h-6 w-6 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  const received = totals ? Number(totals.totalReceived) / 100 : 0;
  const sent = totals ? Number(totals.totalSent) / 100 : 0;

  const data = [
    {
      name: 'Income',
      amount: received,
      fill: 'oklch(0.646 0.222 41.116)',
    },
    {
      name: 'Expenses',
      amount: sent,
      fill: 'oklch(0.577 0.245 27.325)',
    },
  ];

  return (
    <div>
      {!compact && (
        <h3 className="text-lg font-semibold mb-4 text-center">Income vs Expenses</h3>
      )}
      <ResponsiveContainer width="100%" height={compact ? 200 : 300}>
        <BarChart data={data} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip
            formatter={(value: number) => value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            contentStyle={{
              backgroundColor: 'oklch(var(--card))',
              border: '1px solid oklch(var(--border))',
              borderRadius: '8px',
            }}
          />
          <Legend />
          <Bar dataKey="amount" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

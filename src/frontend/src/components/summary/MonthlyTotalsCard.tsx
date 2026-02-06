import { useGetMonthlyTotals } from '../../hooks/useTransactions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface MonthlyTotalsCardProps {
  month: number;
  year: number;
}

export default function MonthlyTotalsCard({ month, year }: MonthlyTotalsCardProps) {
  const { data: totals, isLoading } = useGetMonthlyTotals(year, month);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="flex items-center justify-center">
            <div className="h-6 w-6 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const received = totals ? Number(totals.totalReceived) / 100 : 0;
  const sent = totals ? Number(totals.totalSent) / 100 : 0;
  const balance = totals ? Number(totals.balance) / 100 : 0;
  const isPositive = balance >= 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-medium flex items-center gap-2">
          <Wallet className="w-5 h-5 text-emerald-600" />
          Monthly Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Income */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Received</p>
              <p className="text-lg font-bold text-emerald-700 dark:text-emerald-400">
                {received.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Expenses */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <TrendingDown className="w-5 h-5 text-red-700 dark:text-red-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Sent</p>
              <p className="text-lg font-bold text-red-700 dark:text-red-400">
                {sent.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Balance */}
        <div className={`p-4 rounded-xl ${
          isPositive 
            ? 'bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800'
            : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
        }`}>
          <p className="text-sm text-muted-foreground mb-1">Balance</p>
          <p className={`text-2xl font-bold ${
            isPositive 
              ? 'text-emerald-700 dark:text-emerald-400'
              : 'text-red-700 dark:text-red-400'
          }`}>
            {isPositive ? '+' : ''}{balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

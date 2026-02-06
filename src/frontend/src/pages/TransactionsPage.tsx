import { useState } from 'react';
import { useSelectedMonth } from '../hooks/useSelectedMonth';
import MonthPicker from '../components/month/MonthPicker';
import TransactionForm from '../components/transactions/TransactionForm';
import TransactionList from '../components/transactions/TransactionList';
import MonthlyTotalsCard from '../components/summary/MonthlyTotalsCard';
import ManualEntryDisclosure from '../components/disclosures/ManualEntryDisclosure';
import IncomeVsExpenseChart from '../components/charts/IncomeVsExpenseChart';
import { Card } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function TransactionsPage() {
  const { selectedMonth, selectedYear } = useSelectedMonth();
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="container mx-auto px-4 py-6 max-w-2xl space-y-6">
      {/* Month Picker */}
      <MonthPicker />

      {/* Manual Entry Disclosure */}
      <ManualEntryDisclosure />

      {/* Monthly Totals */}
      <MonthlyTotalsCard month={selectedMonth} year={selectedYear} />

      {/* Chart Preview */}
      <Card className="p-4">
        <IncomeVsExpenseChart month={selectedMonth} year={selectedYear} compact />
      </Card>

      {/* Add Transaction Button */}
      {!showForm && (
        <Button
          onClick={() => setShowForm(true)}
          className="w-full h-14 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-lg font-semibold"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Transaction
        </Button>
      )}

      {/* Transaction Form */}
      {showForm && (
        <Card className="p-6">
          <TransactionForm onSuccess={() => setShowForm(false)} onCancel={() => setShowForm(false)} />
        </Card>
      )}

      {/* Transaction List */}
      <TransactionList month={selectedMonth} year={selectedYear} />
    </div>
  );
}

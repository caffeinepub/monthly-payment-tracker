import { useSelectedMonth } from '../../hooks/useSelectedMonth';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function MonthPicker() {
  const { selectedMonth, selectedYear, setSelectedMonth, setSelectedYear } = useSelectedMonth();

  const handlePrevMonth = () => {
    if (selectedMonth === 1) {
      setSelectedMonth(12);
      setSelectedYear(selectedYear - 1);
    } else {
      setSelectedMonth(selectedMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonth === 12) {
      setSelectedMonth(1);
      setSelectedYear(selectedYear + 1);
    } else {
      setSelectedMonth(selectedMonth + 1);
    }
  };

  const monthName = new Date(selectedYear, selectedMonth - 1).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="flex items-center justify-between bg-card border border-border rounded-2xl p-4">
      <Button variant="ghost" size="icon" onClick={handlePrevMonth} className="rounded-xl">
        <ChevronLeft className="w-5 h-5" />
      </Button>
      <div className="text-center">
        <p className="text-lg font-bold text-foreground">{monthName}</p>
      </div>
      <Button variant="ghost" size="icon" onClick={handleNextMonth} className="rounded-xl">
        <ChevronRight className="w-5 h-5" />
      </Button>
    </div>
  );
}

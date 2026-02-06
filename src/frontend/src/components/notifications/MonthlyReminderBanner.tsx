import { useMonthlyReminder } from '../../hooks/useMonthlyReminder';
import { Button } from '@/components/ui/button';
import { X, TrendingUp } from 'lucide-react';

interface MonthlyReminderBannerProps {
  onViewSummary: () => void;
}

export default function MonthlyReminderBanner({ onViewSummary }: MonthlyReminderBannerProps) {
  const { shouldShowReminder, dismissReminder } = useMonthlyReminder();

  if (!shouldShowReminder) {
    return null;
  }

  const handleViewSummary = () => {
    dismissReminder();
    onViewSummary();
  };

  return (
    <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm sm:text-base">New month started!</p>
              <p className="text-xs sm:text-sm text-white/90">Check your previous month's summary</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <Button
              onClick={handleViewSummary}
              size="sm"
              className="bg-white text-emerald-700 hover:bg-white/90 font-semibold"
            >
              View
            </Button>
            <Button
              onClick={dismissReminder}
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20 flex-shrink-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { Home, BarChart3, Settings, LogOut } from 'lucide-react';
import TransactionsPage from '../../pages/TransactionsPage';
import SummaryPage from '../../pages/SummaryPage';
import SettingsPage from '../../pages/SettingsPage';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import MonthlyReminderBanner from '../notifications/MonthlyReminderBanner';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

type Page = 'transactions' | 'summary' | 'settings';

export default function AppLayout() {
  const [currentPage, setCurrentPage] = useState<Page>('transactions');
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const { clear } = useInternetIdentity();
  const queryClient = useQueryClient();

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
    setShowLogoutDialog(false);
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Monthly Reminder Banner */}
      <MonthlyReminderBanner onViewSummary={() => setCurrentPage('summary')} />

      {/* Header */}
      <header className="flex-shrink-0 border-b border-border bg-card">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
              <img 
                src="/assets/generated/app-icon.dim_512x512.png" 
                alt="App" 
                className="w-8 h-8 rounded-lg"
              />
            </div>
            <h1 className="text-lg font-bold text-foreground hidden sm:block">Payment Tracker</h1>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowLogoutDialog(true)}
            className="text-muted-foreground hover:text-foreground"
          >
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {currentPage === 'transactions' && <TransactionsPage />}
        {currentPage === 'summary' && <SummaryPage />}
        {currentPage === 'settings' && <SettingsPage />}
      </main>

      {/* Bottom Navigation */}
      <nav className="flex-shrink-0 border-t border-border bg-card">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-around h-16">
            <NavButton
              icon={<Home className="w-5 h-5" />}
              label="Transactions"
              active={currentPage === 'transactions'}
              onClick={() => setCurrentPage('transactions')}
            />
            <NavButton
              icon={<BarChart3 className="w-5 h-5" />}
              label="Summary"
              active={currentPage === 'summary'}
              onClick={() => setCurrentPage('summary')}
            />
            <NavButton
              icon={<Settings className="w-5 h-5" />}
              label="Settings"
              active={currentPage === 'settings'}
              onClick={() => setCurrentPage('settings')}
            />
          </div>
        </div>
      </nav>

      {/* Logout Confirmation Dialog */}
      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Log out?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to log out? You'll need to sign in again to access your data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleLogout} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Log out
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function NavButton({ icon, label, active, onClick }: { icon: React.ReactNode; label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-xl transition-colors ${
        active
          ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20'
          : 'text-muted-foreground hover:text-foreground'
      }`}
    >
      {icon}
      <span className="text-xs font-medium">{label}</span>
    </button>
  );
}

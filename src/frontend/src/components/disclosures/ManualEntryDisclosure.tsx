import { Info } from 'lucide-react';

export default function ManualEntryDisclosure() {
  return (
    <div className="flex items-start gap-3 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
      <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <p className="text-sm text-blue-900 dark:text-blue-100">
          <strong>Manual Entry Only:</strong> This app does not connect to bank accounts. All transactions are entered manually by you for safety and simplicity.
        </p>
      </div>
    </div>
  );
}

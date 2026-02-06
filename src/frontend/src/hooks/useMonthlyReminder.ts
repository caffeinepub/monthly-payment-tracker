import { useState, useEffect, useCallback } from 'react';
import { useInternetIdentity } from './useInternetIdentity';

const REMINDER_ENABLED_KEY = 'monthlyReminderEnabled';
const LAST_ACKNOWLEDGED_KEY = 'lastAcknowledgedMonth';

export function useMonthlyReminder() {
  const { identity } = useInternetIdentity();
  const principal = identity?.getPrincipal().toString();

  const getStorageKey = (key: string) => principal ? `${key}_${principal}` : key;

  const [reminderEnabled, setReminderEnabled] = useState(() => {
    const stored = localStorage.getItem(getStorageKey(REMINDER_ENABLED_KEY));
    return stored === null ? true : stored === 'true';
  });

  const [lastAcknowledged, setLastAcknowledged] = useState<string | null>(() => {
    return localStorage.getItem(getStorageKey(LAST_ACKNOWLEDGED_KEY));
  });

  const toggleReminder = useCallback(() => {
    setReminderEnabled((prev) => {
      const newValue = !prev;
      localStorage.setItem(getStorageKey(REMINDER_ENABLED_KEY), String(newValue));
      return newValue;
    });
  }, [principal]);

  const acknowledgeMonth = useCallback((year: number, month: number) => {
    const key = `${year}-${month}`;
    setLastAcknowledged(key);
    localStorage.setItem(getStorageKey(LAST_ACKNOWLEDGED_KEY), key);
  }, [principal]);

  const dismissReminder = useCallback(() => {
    const now = new Date();
    const currentKey = `${now.getFullYear()}-${now.getMonth() + 1}`;
    acknowledgeMonth(now.getFullYear(), now.getMonth() + 1);
  }, [acknowledgeMonth]);

  const shouldShowReminder = useCallback(() => {
    if (!reminderEnabled) return false;

    const now = new Date();
    const currentKey = `${now.getFullYear()}-${now.getMonth() + 1}`;

    // Show reminder if we haven't acknowledged this month yet
    return lastAcknowledged !== currentKey;
  }, [reminderEnabled, lastAcknowledged]);

  return {
    reminderEnabled,
    toggleReminder,
    acknowledgeMonth,
    dismissReminder,
    shouldShowReminder: shouldShowReminder(),
  };
}

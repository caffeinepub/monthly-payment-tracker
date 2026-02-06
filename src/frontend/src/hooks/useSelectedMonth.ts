import { useState, useEffect } from 'react';

const STORAGE_KEY = 'selectedMonth';

export function useSelectedMonth() {
  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed.month;
    }
    return now.getMonth() + 1;
  });

  const [selectedYear, setSelectedYear] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed.year;
    }
    return now.getFullYear();
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ month: selectedMonth, year: selectedYear }));
  }, [selectedMonth, selectedYear]);

  return {
    selectedMonth,
    selectedYear,
    setSelectedMonth,
    setSelectedYear,
  };
}

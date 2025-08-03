import { useState, useEffect } from 'react';
import { dataStore, type Earning, type Expense } from '@/lib/dataStore';

export const useDataStore = () => {
  const [, forceUpdate] = useState({});

  useEffect(() => {
    const unsubscribe = dataStore.subscribe(() => {
      forceUpdate({});
    });

    return unsubscribe;
  }, []);

  return {
    // Earnings
    earnings: dataStore.getEarnings(),
    addEarning: (earning: Earning) => dataStore.addEarning(earning),
    updateEarning: (earning: Earning) => dataStore.updateEarning(earning),
    deleteEarning: (id: string) => dataStore.deleteEarning(id),

    // Expenses
    expenses: dataStore.getExpenses(),
    addExpense: (expense: Expense) => dataStore.addExpense(expense),
    updateExpense: (expense: Expense) => dataStore.updateExpense(expense),
    deleteExpense: (id: string) => dataStore.deleteExpense(id),

    // Analytics
    todayEarnings: dataStore.getTodayEarnings(),
    todayExpenses: dataStore.getTodayExpenses(),
    weeklyEarnings: dataStore.getWeeklyEarnings(),
    weeklyExpenses: dataStore.getWeeklyExpenses(),
    weeklyData: dataStore.getWeeklyData(),
    weeklyHourlyRate: dataStore.getWeeklyHourlyRate(),
    totalTrips: dataStore.getTotalTrips(),
    totalHours: dataStore.getTotalHours(),
    expenseBreakdown: dataStore.getExpenseBreakdown(),
    dailyHoursData: dataStore.getDailyHoursData(),
  };
};
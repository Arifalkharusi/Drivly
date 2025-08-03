// Shared data store for earnings and expenses
export interface Earning {
  id: string;
  amount: number;
  platform: string;
  trips: number;
  hours: number;
  date: string;
}

export interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: Date;
  type: "manual" | "mileage";
  miles?: number;
  costPerMile?: number;
}

// Simple in-memory store (in a real app, this would be in a database or context)
class DataStore {
  private earnings: Earning[] = [
    {
      id: "1",
      amount: 145.5,
      platform: "Uber",
      trips: 8,
      hours: 6.5,
      date: "2024-01-15",
    },
    {
      id: "2",
      amount: 123.75,
      platform: "Bolt",
      trips: 6,
      hours: 5.0,
      date: "2024-01-15",
    },
    {
      id: "3",
      amount: 167.25,
      platform: "Uber",
      trips: 10,
      hours: 7.5,
      date: "2024-01-14",
    },
    {
      id: "4",
      amount: 89.0,
      platform: "Bolt",
      trips: 5,
      hours: 4.0,
      date: "2024-01-14",
    },
    {
      id: "5",
      amount: 200.0,
      platform: "Lyft",
      trips: 12,
      hours: 8.0,
      date: "2024-01-13",
    },
  ];

  private expenses: Expense[] = [
    {
      id: "1",
      amount: 45.2,
      category: "Fuel",
      description: "Gas station fill-up",
      date: new Date(),
      type: "manual",
    },
    {
      id: "2",
      amount: 24.5,
      category: "Mileage",
      description: "Business miles",
      date: new Date(Date.now() - 2 * 60 * 60 * 1000),
      type: "mileage",
      miles: 45,
      costPerMile: 0.545,
    },
  ];

  private listeners: (() => void)[] = [];

  // Earnings methods
  getEarnings(): Earning[] {
    return [...this.earnings];
  }

  addEarning(earning: Earning): void {
    this.earnings = [earning, ...this.earnings];
    this.notifyListeners();
  }

  updateEarning(earning: Earning): void {
    this.earnings = this.earnings.map(e => e.id === earning.id ? earning : e);
    this.notifyListeners();
  }

  deleteEarning(id: string): void {
    this.earnings = this.earnings.filter(e => e.id !== id);
    this.notifyListeners();
  }

  // Expenses methods
  getExpenses(): Expense[] {
    return [...this.expenses];
  }

  addExpense(expense: Expense): void {
    this.expenses = [expense, ...this.expenses];
    this.notifyListeners();
  }

  updateExpense(expense: Expense): void {
    this.expenses = this.expenses.map(e => e.id === expense.id ? expense : e);
    this.notifyListeners();
  }

  deleteExpense(id: string): void {
    this.expenses = this.expenses.filter(e => e.id !== id);
    this.notifyListeners();
  }

  // Analytics methods for dashboard
  getTodayEarnings(): number {
    const today = new Date().toISOString().split('T')[0];
    return this.earnings
      .filter(e => e.date === today)
      .reduce((sum, e) => sum + e.amount, 0);
  }

  getTodayExpenses(): number {
    const today = new Date().toDateString();
    return this.expenses
      .filter(e => e.date.toDateString() === today)
      .reduce((sum, e) => sum + e.amount, 0);
  }

  getWeeklyEarnings(): number {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const weekAgoStr = weekAgo.toISOString().split('T')[0];
    
    return this.earnings
      .filter(e => e.date >= weekAgoStr)
      .reduce((sum, e) => sum + e.amount, 0);
  }

  getWeeklyExpenses(): number {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    return this.expenses
      .filter(e => e.date >= weekAgo)
      .reduce((sum, e) => sum + e.amount, 0);
  }

  getWeeklyData(): Array<{day: string, earnings: number, expenses: number}> {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const today = new Date();
    const weekData = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const dayName = days[date.getDay() === 0 ? 6 : date.getDay() - 1]; // Adjust for Monday start

      const dayEarnings = this.earnings
        .filter(e => e.date === dateStr)
        .reduce((sum, e) => sum + e.amount, 0);

      const dayExpenses = this.expenses
        .filter(e => e.date.toISOString().split('T')[0] === dateStr)
        .reduce((sum, e) => sum + e.amount, 0);

      weekData.push({
        day: dayName,
        earnings: dayEarnings,
        expenses: dayExpenses
      });
    }

    return weekData;
  }

  getDailyHoursData(): Array<{day: string, hours: number, earnings: number}> {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const today = new Date();
    const hoursData = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const dayName = days[date.getDay() === 0 ? 6 : date.getDay() - 1]; // Adjust for Monday start

      const dayHours = this.earnings
        .filter(e => e.date === dateStr)
        .reduce((sum, e) => sum + e.hours, 0);

      const dayEarnings = this.earnings
        .filter(e => e.date === dateStr)
        .reduce((sum, e) => sum + e.amount, 0);

      hoursData.push({
        day: dayName,
        hours: dayHours,
        earnings: dayEarnings
      });
    }

    return hoursData;
  }
  getTotalTrips(): number {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const weekAgoStr = weekAgo.toISOString().split('T')[0];
    
    return this.earnings
      .filter(e => e.date >= weekAgoStr)
      .reduce((sum, e) => sum + e.trips, 0);
  }

  getTotalHours(): number {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const weekAgoStr = weekAgo.toISOString().split('T')[0];
    
    return this.earnings
      .filter(e => e.date >= weekAgoStr)
      .reduce((sum, e) => sum + e.hours, 0);
  }

  getExpenseBreakdown(): Array<{name: string, value: number, color: string}> {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    const weeklyExpenses = this.expenses.filter(e => e.date >= weekAgo);
    const breakdown: Record<string, number> = {};
    
    weeklyExpenses.forEach(expense => {
      breakdown[expense.category] = (breakdown[expense.category] || 0) + expense.amount;
    });

    const colors = ['#1E3C72', '#00B4DB', '#43CEA2', '#EF473A'];
    return Object.entries(breakdown).map(([name, value], index) => ({
      name,
      value,
      color: colors[index % colors.length]
    }));
  }

  // Listener methods for reactive updates
  subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener());
  }
}

export const dataStore = new DataStore();
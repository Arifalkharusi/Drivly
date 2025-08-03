import { useState } from "react";
import { useDataStore } from "@/hooks/useDataStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import GradientCard from "@/components/GradientCard";
import MobileNavigation from "@/components/MobileNavigation";
import { 
  PoundSterling, 
  Plus, 
  TrendingUp, 
  TrendingDown, 
  Edit3, 
  Trash2,
  Car,
  Fuel,
  Wrench,
  Receipt,
  Calendar,
  Clock,
  Activity,
  Filter,
  Search
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Earning, Expense } from "@/lib/dataStore";

const Finance = () => {
  const { toast } = useToast();
  const {
    earnings,
    expenses,
    addEarning,
    addExpense,
    updateEarning,
    updateExpense,
    deleteEarning,
    deleteExpense,
    todayEarnings,
    todayExpenses,
    weeklyEarnings,
    weeklyExpenses,
  } = useDataStore();

  const [isEarningDialogOpen, setIsEarningDialogOpen] = useState(false);
  const [isExpenseDialogOpen, setIsExpenseDialogOpen] = useState(false);
  const [editingEarning, setEditingEarning] = useState<Earning | null>(null);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  
  // Filter states
  const [earningsFilter, setEarningsFilter] = useState({
    platform: "all-platforms",
    dateFrom: "",
    dateTo: "",
    search: "",
  });
  
  const [expensesFilter, setExpensesFilter] = useState({
    category: "all-categories",
    dateFrom: "",
    dateTo: "",
    search: "",
  });

  const [earningForm, setEarningForm] = useState({
    amount: "",
    platform: "",
    trips: "",
    hours: "",
    date: new Date().toISOString().split('T')[0],
  });

  const [expenseForm, setExpenseForm] = useState({
    amount: "",
    category: "",
    description: "",
    date: new Date(),
    type: "manual" as "manual" | "mileage",
    miles: "",
    costPerMile: "0.45",
  });

  const netIncome = weeklyEarnings - weeklyExpenses;
  const todayNet = todayEarnings - todayExpenses;

  // Filter functions
  const filteredEarnings = earnings.filter(earning => {
    const matchesPlatform = !earningsFilter.platform || earningsFilter.platform === "all-platforms" || earning.platform === earningsFilter.platform;
    const matchesDateFrom = !earningsFilter.dateFrom || earning.date >= earningsFilter.dateFrom;
    const matchesDateTo = !earningsFilter.dateTo || earning.date <= earningsFilter.dateTo;
    const matchesSearch = !earningsFilter.search || 
      earning.platform.toLowerCase().includes(earningsFilter.search.toLowerCase());
    
    return matchesPlatform && matchesDateFrom && matchesDateTo && matchesSearch;
  });

  const filteredExpenses = expenses.filter(expense => {
    const matchesCategory = !expensesFilter.category || expensesFilter.category === "all-categories" || expense.category === expensesFilter.category;
    const expenseDate = expense.date.toISOString().split('T')[0];
    const matchesDateFrom = !expensesFilter.dateFrom || expenseDate >= expensesFilter.dateFrom;
    const matchesDateTo = !expensesFilter.dateTo || expenseDate <= expensesFilter.dateTo;
    const matchesSearch = !expensesFilter.search || 
      expense.category.toLowerCase().includes(expensesFilter.search.toLowerCase()) ||
      expense.description.toLowerCase().includes(expensesFilter.search.toLowerCase());
    
    return matchesCategory && matchesDateFrom && matchesDateTo && matchesSearch;
  });

  // Get unique platforms and categories for filter dropdowns
  const uniquePlatforms = [...new Set(earnings.map(e => e.platform))];
  const uniqueCategories = [...new Set(expenses.map(e => e.category))];
  const handleAddEarning = () => {
    if (!earningForm.amount || !earningForm.platform) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const earning: Earning = {
      id: editingEarning?.id || Date.now().toString(),
      amount: parseFloat(earningForm.amount),
      platform: earningForm.platform,
      trips: parseInt(earningForm.trips) || 0,
      hours: parseFloat(earningForm.hours) || 0,
      date: earningForm.date,
    };

    if (editingEarning) {
      updateEarning(earning);
      toast({
        title: "Earning Updated",
        description: `Updated earning of £${earning.amount} from ${earning.platform}`,
      });
    } else {
      addEarning(earning);
      toast({
        title: "Earning Added",
        description: `Added earning of £${earning.amount} from ${earning.platform}`,
      });
    }

    resetEarningForm();
  };

  const handleAddExpense = () => {
    if (!expenseForm.amount || !expenseForm.category) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const expense: Expense = {
      id: editingExpense?.id || Date.now().toString(),
      amount: parseFloat(expenseForm.amount),
      category: expenseForm.category,
      description: expenseForm.description,
      date: expenseForm.date,
      type: expenseForm.type,
      miles: expenseForm.miles ? parseFloat(expenseForm.miles) : undefined,
      costPerMile: expenseForm.costPerMile ? parseFloat(expenseForm.costPerMile) : undefined,
    };

    if (editingExpense) {
      updateExpense(expense);
      toast({
        title: "Expense Updated",
        description: `Updated expense of £${expense.amount}`,
      });
    } else {
      addExpense(expense);
      toast({
        title: "Expense Added",
        description: `Added expense of £${expense.amount}`,
      });
    }

    resetExpenseForm();
  };

  const resetEarningForm = () => {
    setEarningForm({
      amount: "",
      platform: "",
      trips: "",
      hours: "",
      date: new Date().toISOString().split('T')[0],
    });
    setEditingEarning(null);
    setIsEarningDialogOpen(false);
  };

  const resetExpenseForm = () => {
    setExpenseForm({
      amount: "",
      category: "",
      description: "",
      date: new Date(),
      type: "manual",
      miles: "",
      costPerMile: "0.45",
    });
    setEditingExpense(null);
    setIsExpenseDialogOpen(false);
  };

  const handleEditEarning = (earning: Earning) => {
    setEditingEarning(earning);
    setEarningForm({
      amount: earning.amount.toString(),
      platform: earning.platform,
      trips: earning.trips.toString(),
      hours: earning.hours.toString(),
      date: earning.date,
    });
    setIsEarningDialogOpen(true);
  };

  const handleEditExpense = (expense: Expense) => {
    setEditingExpense(expense);
    setExpenseForm({
      amount: expense.amount.toString(),
      category: expense.category,
      description: expense.description,
      date: expense.date,
      type: expense.type,
      miles: expense.miles?.toString() || "",
      costPerMile: expense.costPerMile?.toString() || "0.45",
    });
    setIsExpenseDialogOpen(true);
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case "fuel":
        return <Fuel className="w-4 h-4" />;
      case "maintenance":
        return <Wrench className="w-4 h-4" />;
      case "insurance":
        return <Receipt className="w-4 h-4" />;
      default:
        return <Car className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-background pb-20">
      {/* Modern Header with Glass Effect */}
      <div className="relative bg-gradient-primary text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)`,
            backgroundSize: '20px 20px'
          }} />
        </div>
        
        <div className="relative p-4 sm:p-6 pb-6 sm:pb-8">
          <div className="flex justify-between items-start sm:items-center mb-6">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-accent rounded-2xl flex items-center justify-center shadow-lg">
                    <PoundSterling className="w-6 h-6 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-success rounded-full animate-pulse" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">Finance Hub</h1>
                  <p className="text-white/80 text-sm flex items-center gap-1">
                    <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
                    Live tracking active
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Modern Overview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {/* Today's Net */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />
              <div className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 hover:bg-white/15 transition-all duration-300">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center">
                    <Activity className="w-5 h-5 text-white" />
                  </div>
                  <Badge className="bg-blue-500/20 text-blue-100 border-blue-400/30 text-xs">
                    +8.2%
                  </Badge>
                </div>
                <p className="text-white/80 text-sm mb-1">Today's Net</p>
                <p className="text-2xl font-bold text-white">£{todayNet.toFixed(2)}</p>
                <div className="w-full h-1 bg-white/20 rounded-full mt-3 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full w-3/4 animate-pulse" />
                </div>
              </div>
            </div>

            {/* Weekly Earnings */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-emerald-400/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />
              <div className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 hover:bg-white/15 transition-all duration-300">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-600 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <Badge className="bg-green-500/20 text-green-100 border-green-400/30 text-xs">
                    +12.4%
                  </Badge>
                </div>
                <p className="text-white/80 text-sm mb-1">Weekly Earnings</p>
                <p className="text-2xl font-bold text-white">£{weeklyEarnings.toFixed(2)}</p>
                <div className="w-full h-1 bg-white/20 rounded-full mt-3 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-green-400 to-emerald-600 rounded-full w-4/5 animate-pulse" />
                </div>
              </div>
            </div>

            {/* Weekly Expenses */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-red-400/20 to-pink-400/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />
              <div className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 hover:bg-white/15 transition-all duration-300">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-red-400 to-pink-600 rounded-xl flex items-center justify-center">
                    <TrendingDown className="w-5 h-5 text-white" />
                  </div>
                  <Badge className="bg-red-500/20 text-red-100 border-red-400/30 text-xs">
                    -5.1%
                  </Badge>
                </div>
                <p className="text-white/80 text-sm mb-1">Weekly Expenses</p>
                <p className="text-2xl font-bold text-white">£{weeklyExpenses.toFixed(2)}</p>
                <div className="w-full h-1 bg-white/20 rounded-full mt-3 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-red-400 to-pink-600 rounded-full w-2/5 animate-pulse" />
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats Bar */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4">
            <div className="grid grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-white/60 text-xs mb-1">Total Trips</p>
                <p className="text-lg font-bold text-white">156</p>
              </div>
              <div>
                <p className="text-white/60 text-xs mb-1">Hours</p>
                <p className="text-lg font-bold text-white">89.5h</p>
              </div>
              <div>
                <p className="text-white/60 text-xs mb-1">Avg/Hour</p>
                <p className="text-lg font-bold text-white">£{(weeklyEarnings / 89.5).toFixed(2)}</p>
              </div>
              <div>
                <p className="text-white/60 text-xs mb-1">Net Income</p>
                <p className="text-lg font-bold text-success">£{netIncome.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 mt-4 sm:mt-6">
        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <Button
            onClick={() => setIsEarningDialogOpen(true)}
            className="h-12 sm:h-14 bg-gradient-success hover:opacity-90 text-white font-medium rounded-xl shadow-soft"
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            Add Earning
          </Button>
          <Button
            onClick={() => setIsExpenseDialogOpen(true)}
            variant="outline"
            className="h-12 sm:h-14 border-2 font-medium rounded-xl hover:bg-accent/10"
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            Add Expense
          </Button>
        </div>

        {/* Tabs for Earnings and Expenses */}
        <Tabs defaultValue="earnings" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4 sm:mb-6">
            <TabsTrigger value="earnings" className="text-sm sm:text-base">Earnings</TabsTrigger>
            <TabsTrigger value="expenses" className="text-sm sm:text-base">Expenses</TabsTrigger>
          </TabsList>

          <TabsContent value="earnings" className="space-y-3 sm:space-y-4">
            {/* Earnings Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Filter className="w-4 h-4" />
                  Filter Earnings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="search-earnings">Search</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="search-earnings"
                        placeholder="Search platform..."
                        value={earningsFilter.search}
                        onChange={(e) => setEarningsFilter({...earningsFilter, search: e.target.value})}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Platform</Label>
                    <Select 
                      value={earningsFilter.platform} 
                      onValueChange={(value) => setEarningsFilter({...earningsFilter, platform: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All platforms" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all-platforms">All platforms</SelectItem>
                        {uniquePlatforms.map(platform => (
                          <SelectItem key={platform} value={platform}>{platform}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="date-from-earnings">From Date</Label>
                    <Input
                      id="date-from-earnings"
                      type="date"
                      value={earningsFilter.dateFrom}
                      onChange={(e) => setEarningsFilter({...earningsFilter, dateFrom: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="date-to-earnings">To Date</Label>
                    <Input
                      id="date-to-earnings"
                      type="date"
                      value={earningsFilter.dateTo}
                      onChange={(e) => setEarningsFilter({...earningsFilter, dateTo: e.target.value})}
                    />
                  </div>
                </div>
                
                <Button 
                  variant="outline" 
                  onClick={() => setEarningsFilter({ platform: "all-platforms", dateFrom: "", dateTo: "", search: "" })}
                  className="w-full sm:w-auto"
                >
                  Clear Filters
                </Button>
              </CardContent>
            </Card>

            {filteredEarnings.length === 0 ? (
              <GradientCard className="text-center py-8">
                <TrendingUp className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold mb-2 text-primary">
                  {earnings.length === 0 ? "No earnings yet" : "No earnings match your filters"}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {earnings.length === 0 
                    ? "Start tracking your earnings to see them here" 
                    : "Try adjusting your filter criteria"
                  }
                </p>
                {earnings.length === 0 && (
                <Button onClick={() => setIsEarningDialogOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add First Earning
                </Button>
                )}
              </GradientCard>
            ) : (
              filteredEarnings.map((earning) => (
                <GradientCard key={earning.id} className="hover:shadow-soft transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-success rounded-xl flex items-center justify-center flex-shrink-0">
                        <Car className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm sm:text-base text-primary truncate">{earning.platform}</h3>
                        <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground mt-1">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(earning.date).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <Activity className="w-3 h-3" />
                            {earning.trips} trips
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {earning.hours}h
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="text-right">
                        <p className="font-bold text-lg sm:text-xl text-success">£{earning.amount.toFixed(2)}</p>
                        <p className="text-xs text-muted-foreground">
                          £{(earning.amount / earning.hours || 0).toFixed(2)}/hr
                        </p>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditEarning(earning)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit3 className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            deleteEarning(earning.id);
                            toast({
                              title: "Earning Deleted",
                              description: "Earning has been removed",
                            });
                          }}
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </GradientCard>
              ))
            )}
          </TabsContent>

          <TabsContent value="expenses" className="space-y-3 sm:space-y-4">
            {/* Expenses Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Filter className="w-4 h-4" />
                  Filter Expenses
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="search-expenses">Search</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="search-expenses"
                        placeholder="Search category or description..."
                        value={expensesFilter.search}
                        onChange={(e) => setExpensesFilter({...expensesFilter, search: e.target.value})}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Select 
                      value={expensesFilter.category} 
                      onValueChange={(value) => setExpensesFilter({...expensesFilter, category: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All categories" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all-categories">All categories</SelectItem>
                        {uniqueCategories.map(category => (
                          <SelectItem key={category} value={category}>{category}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="date-from-expenses">From Date</Label>
                    <Input
                      id="date-from-expenses"
                      type="date"
                      value={expensesFilter.dateFrom}
                      onChange={(e) => setExpensesFilter({...expensesFilter, dateFrom: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="date-to-expenses">To Date</Label>
                    <Input
                      id="date-to-expenses"
                      type="date"
                      value={expensesFilter.dateTo}
                      onChange={(e) => setExpensesFilter({...expensesFilter, dateTo: e.target.value})}
                    />
                  </div>
                </div>
                
                <Button 
                  variant="outline" 
                  onClick={() => setExpensesFilter({ category: "all-categories", dateFrom: "", dateTo: "", search: "" })}
                  className="w-full sm:w-auto"
                >
                  Clear Filters
                </Button>
              </CardContent>
            </Card>

            {filteredExpenses.length === 0 ? (
              <GradientCard className="text-center py-8">
                <TrendingDown className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold mb-2 text-primary">
                  {expenses.length === 0 ? "No expenses yet" : "No expenses match your filters"}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {expenses.length === 0 
                    ? "Start tracking your expenses to see them here" 
                    : "Try adjusting your filter criteria"
                  }
                </p>
                {expenses.length === 0 && (
                <Button onClick={() => setIsExpenseDialogOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add First Expense
                </Button>
                )}
              </GradientCard>
            ) : (
              filteredExpenses.map((expense) => (
                <GradientCard key={expense.id} className="hover:shadow-soft transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-destructive rounded-xl flex items-center justify-center flex-shrink-0">
                        {getCategoryIcon(expense.category)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm sm:text-base text-primary truncate">{expense.category}</h3>
                        <p className="text-xs sm:text-sm text-muted-foreground truncate">{expense.description}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                          <Calendar className="w-3 h-3" />
                          {expense.date.toLocaleDateString()}
                          {expense.type === "mileage" && expense.miles && (
                            <>
                              <span>•</span>
                              <span>{expense.miles} miles</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="text-right">
                        <p className="font-bold text-lg sm:text-xl text-destructive">£{expense.amount.toFixed(2)}</p>
                        <Badge variant="outline" className="text-xs">
                          {expense.type}
                        </Badge>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditExpense(expense)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit3 className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            deleteExpense(expense.id);
                            toast({
                              title: "Expense Deleted",
                              description: "Expense has been removed",
                            });
                          }}
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </GradientCard>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Add/Edit Earning Dialog */}
      <Dialog open={isEarningDialogOpen} onOpenChange={setIsEarningDialogOpen}>
        <DialogContent className="rounded-2xl max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader className="pb-4">
            <DialogTitle className="text-lg sm:text-xl">
              {editingEarning ? "Edit Earning" : "Add New Earning"}
            </DialogTitle>
            <DialogDescription className="text-sm sm:text-base">
              {editingEarning ? "Update your earning details" : "Record your latest earning"}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <Label htmlFor="amount" className="text-sm font-medium">Amount (£)</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={earningForm.amount}
                  onChange={(e) => setEarningForm({...earningForm, amount: e.target.value})}
                  className="rounded-xl h-12 text-base"
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="platform" className="text-sm font-medium">Platform</Label>
                <Select value={earningForm.platform} onValueChange={(value) => setEarningForm({...earningForm, platform: value})}>
                  <SelectTrigger className="rounded-xl h-12">
                    <SelectValue placeholder="Select platform" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Uber">Uber</SelectItem>
                    <SelectItem value="Bolt">Bolt</SelectItem>
                    <SelectItem value="Lyft">Lyft</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <Label htmlFor="trips" className="text-sm font-medium">Number of Trips</Label>
                <Input
                  id="trips"
                  type="number"
                  placeholder="0"
                  value={earningForm.trips}
                  onChange={(e) => setEarningForm({...earningForm, trips: e.target.value})}
                  className="rounded-xl h-12 text-base"
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="hours" className="text-sm font-medium">Hours Worked</Label>
                <Input
                  id="hours"
                  type="number"
                  step="0.1"
                  placeholder="0.0"
                  value={earningForm.hours}
                  onChange={(e) => setEarningForm({...earningForm, hours: e.target.value})}
                  className="rounded-xl h-12 text-base"
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="date" className="text-sm font-medium">Date</Label>
              <Input
                id="date"
                type="date"
                value={earningForm.date}
                onChange={(e) => setEarningForm({...earningForm, date: e.target.value})}
                className="rounded-xl h-12 text-base"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button 
                variant="outline" 
                onClick={resetEarningForm}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleAddEarning}
                className="flex-1"
              >
                {editingEarning ? "Update" : "Add"} Earning
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add/Edit Expense Dialog */}
      <Dialog open={isExpenseDialogOpen} onOpenChange={setIsExpenseDialogOpen}>
        <DialogContent className="rounded-2xl max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader className="pb-4">
            <DialogTitle className="text-lg sm:text-xl">
              {editingExpense ? "Edit Expense" : "Add New Expense"}
            </DialogTitle>
            <DialogDescription className="text-sm sm:text-base">
              {editingExpense ? "Update your expense details" : "Record your latest expense"}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <Label htmlFor="expense-amount" className="text-sm font-medium">Amount (£)</Label>
                <Input
                  id="expense-amount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={expenseForm.amount}
                  onChange={(e) => setExpenseForm({...expenseForm, amount: e.target.value})}
                  className="rounded-xl h-12 text-base"
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="category" className="text-sm font-medium">Category</Label>
                <Select value={expenseForm.category} onValueChange={(value) => setExpenseForm({...expenseForm, category: value})}>
                  <SelectTrigger className="rounded-xl h-12">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Fuel">Fuel</SelectItem>
                    <SelectItem value="Maintenance">Maintenance</SelectItem>
                    <SelectItem value="Insurance">Insurance</SelectItem>
                    <SelectItem value="Mileage">Mileage</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="description" className="text-sm font-medium">Description</Label>
              <Input
                id="description"
                placeholder="Brief description"
                value={expenseForm.description}
                onChange={(e) => setExpenseForm({...expenseForm, description: e.target.value})}
                className="rounded-xl h-12 text-base"
              />
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-medium">Expense Type</Label>
              <Select value={expenseForm.type} onValueChange={(value: "manual" | "mileage") => setExpenseForm({...expenseForm, type: value})}>
                <SelectTrigger className="rounded-xl h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="manual">Manual Entry</SelectItem>
                  <SelectItem value="mileage">Mileage Based</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {expenseForm.type === "mileage" && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <Label htmlFor="miles" className="text-sm font-medium">Miles</Label>
                  <Input
                    id="miles"
                    type="number"
                    step="0.1"
                    placeholder="0.0"
                    value={expenseForm.miles}
                    onChange={(e) => setExpenseForm({...expenseForm, miles: e.target.value})}
                    className="rounded-xl h-12 text-base"
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="cost-per-mile" className="text-sm font-medium">Cost per Mile (£)</Label>
                  <Input
                    id="cost-per-mile"
                    type="number"
                    step="0.01"
                    value={expenseForm.costPerMile}
                    onChange={(e) => setExpenseForm({...expenseForm, costPerMile: e.target.value})}
                    className="rounded-xl h-12 text-base"
                  />
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <Button 
                variant="outline" 
                onClick={resetExpenseForm}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleAddExpense}
                className="flex-1"
              >
                {editingExpense ? "Update" : "Add"} Expense
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <MobileNavigation />
    </div>
  );
};

export default Finance;
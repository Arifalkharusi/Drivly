import { useState } from "react";
import { useDataStore } from "@/hooks/useDataStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import GradientCard from "@/components/GradientCard";
import MobileNavigation from "@/components/MobileNavigation";
import {
  Plus,
  Car,
  Clock,
  Users,
  TrendingUp,
  Calendar as CalendarIcon,
  Trash2,
  Edit3,
  Fuel,
  Wrench,
  Receipt,
  Calculator,
} from "lucide-react";
import { PoundSterling } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import type { DateRange } from "react-day-picker";
import type { Earning, Expense } from "@/lib/dataStore";

const Finance = () => {
  const { toast } = useToast();
  const { 
    earnings, 
    addEarning, 
    updateEarning, 
    deleteEarning,
    expenses, 
    addExpense, 
    updateExpense, 
    deleteExpense 
  } = useDataStore();

  const [activeTab, setActiveTab] = useState("earnings");
  const [customPlatforms, setCustomPlatforms] = useState<string[]>(["Lyft"]);
  const [customCategories, setCustomCategories] = useState<string[]>(["Parking", "Tolls"]);
  
  // Filter states
  const [selectedPlatform, setSelectedPlatform] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  
  // Earnings state
  const [isEarningsDialogOpen, setIsEarningsDialogOpen] = useState(false);
  const [isEarningsDeleteDialogOpen, setIsEarningsDeleteDialogOpen] = useState(false);
  const [earningToDelete, setEarningToDelete] = useState<string | null>(null);
  const [editingEarning, setEditingEarning] = useState<Earning | null>(null);
  const [earningsFormData, setEarningsFormData] = useState({
    amount: "",
    platform: "",
    customPlatform: "",
    trips: "",
    hours: "",
    date: new Date().toISOString().split("T")[0],
  });

  // Expenses state
  const [isExpensesDialogOpen, setIsExpensesDialogOpen] = useState(false);
  const [isExpensesDeleteDialogOpen, setIsExpensesDeleteDialogOpen] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState<string | null>(null);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [expenseType, setExpenseType] = useState<"manual" | "mileage">("manual");
  const [newExpense, setNewExpense] = useState({
    amount: "",
    category: "",
    customCategory: "",
    description: "",
    miles: "",
    costPerMile: "0.45",
  });
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(new Date().setDate(new Date().getDate() - 30)),
    to: new Date(),
  });

  const defaultPlatforms = ["Uber", "Bolt"];
  const allPlatforms = [...defaultPlatforms, ...customPlatforms];
  const defaultCategories = ["Fuel", "Maintenance", "Insurance", "Other"];
  const allCategories = [...defaultCategories, ...customCategories];

  // Filter data by date range
  const filteredEarnings = earnings.filter((earning) => {
    if (!dateRange?.from || !dateRange?.to) return true;
    const earningDate = new Date(earning.date);
    return earningDate >= dateRange.from && earningDate <= dateRange.to;
  });

  const filteredExpenses = expenses.filter((expense) => {
    if (!dateRange?.from || !dateRange?.to) return true;
    const expenseDate = new Date(expense.date);
    return expenseDate >= dateRange.from && expenseDate <= dateRange.to;
  });

  // Apply platform/category filters
  const platformFilteredEarnings = selectedPlatform === "all" 
    ? filteredEarnings 
    : filteredEarnings.filter(earning => earning.platform === selectedPlatform);

  const categoryFilteredExpenses = selectedCategory === "all"
    ? filteredExpenses
    : filteredExpenses.filter(expense => expense.category === selectedCategory);

  // Get unique platforms and categories from data
  const availablePlatforms = [...new Set(earnings.map(e => e.platform))];
  const availableCategories = [...new Set(expenses.map(e => e.category))];
  const totalEarnings = filteredEarnings.reduce((sum, earning) => sum + earning.amount, 0);
  const totalExpenses = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  // Earnings functions
  const handleSaveEarning = () => {
    if (!earningsFormData.amount || !earningsFormData.platform || !earningsFormData.trips || !earningsFormData.hours) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    let selectedPlatform = earningsFormData.platform;
    if (earningsFormData.platform === "custom" && earningsFormData.customPlatform) {
      selectedPlatform = earningsFormData.customPlatform;
      if (!customPlatforms.includes(earningsFormData.customPlatform)) {
        setCustomPlatforms([...customPlatforms, earningsFormData.customPlatform]);
      }
    }

    const earningData = {
      id: editingEarning?.id || Date.now().toString(),
      amount: parseFloat(earningsFormData.amount),
      platform: selectedPlatform,
      trips: parseInt(earningsFormData.trips),
      hours: parseFloat(earningsFormData.hours),
      date: earningsFormData.date,
    };

    if (editingEarning) {
      updateEarning(earningData);
    } else {
      addEarning(earningData);
    }

    setEarningsFormData({
      amount: "",
      platform: "",
      customPlatform: "",
      trips: "",
      hours: "",
      date: new Date().toISOString().split("T")[0],
    });
    setEditingEarning(null);
    setIsEarningsDialogOpen(false);

    toast({
      title: "Success",
      description: editingEarning ? "Earning updated successfully" : "Earning added successfully",
    });
  };

  const openEarningsEditDialog = (earning?: Earning) => {
    if (earning) {
      setEditingEarning(earning);
      setEarningsFormData({
        amount: earning.amount.toString(),
        platform: earning.platform,
        customPlatform: "",
        trips: earning.trips.toString(),
        hours: earning.hours.toString(),
        date: earning.date,
      });
    } else {
      setEditingEarning(null);
      setEarningsFormData({
        amount: "",
        platform: "",
        customPlatform: "",
        trips: "",
        hours: "",
        date: new Date().toISOString().split("T")[0],
      });
    }
    setIsEarningsDialogOpen(true);
  };

  const handleDeleteEarning = () => {
    if (earningToDelete) {
      deleteEarning(earningToDelete);
      setEarningToDelete(null);
      setIsEarningsDeleteDialogOpen(false);
      toast({
        title: "Success",
        description: "Earning deleted successfully",
      });
    }
  };

  // Expenses functions
  const handleSaveExpense = () => {
    if (expenseType === "manual" && newExpense.amount && newExpense.category) {
      let selectedCategory = newExpense.category;
      if (newExpense.category === "custom" && newExpense.customCategory) {
        selectedCategory = newExpense.customCategory;
        if (!customCategories.includes(newExpense.customCategory)) {
          setCustomCategories([...customCategories, newExpense.customCategory]);
        }
      }

      const expense = {
        id: editingExpense?.id || Date.now().toString(),
        amount: parseFloat(newExpense.amount),
        category: selectedCategory,
        description: newExpense.description || "Manual expense",
        date: selectedDate,
        type: "manual" as const,
      };

      if (editingExpense) {
        updateExpense(expense);
      } else {
        addExpense(expense);
      }
    } else if (expenseType === "mileage" && newExpense.miles && newExpense.costPerMile) {
      const calculatedAmount = parseFloat(newExpense.miles) * parseFloat(newExpense.costPerMile);
      const expense = {
        id: editingExpense?.id || Date.now().toString(),
        amount: calculatedAmount,
        category: "Mileage",
        description: newExpense.description || "Business mileage",
        date: selectedDate,
        type: "mileage" as const,
        miles: parseFloat(newExpense.miles),
        costPerMile: parseFloat(newExpense.costPerMile),
      };

      if (editingExpense) {
        updateExpense(expense);
      } else {
        addExpense(expense);
      }
    }

    setNewExpense({
      amount: "",
      category: "",
      customCategory: "",
      description: "",
      miles: "",
      costPerMile: "0.45",
    });
    setSelectedDate(new Date());
    setEditingExpense(null);
    setIsExpensesDialogOpen(false);
  };

  const openExpensesEditDialog = (expense?: Expense) => {
    if (expense) {
      setEditingExpense(expense);
      setExpenseType(expense.type);
      setSelectedDate(expense.date);

      if (expense.type === "manual") {
        setNewExpense({
          amount: expense.amount.toString(),
          category: expense.category,
          customCategory: "",
          description: expense.description,
          miles: "",
          costPerMile: "0.45",
        });
      } else if (expense.type === "mileage") {
        setNewExpense({
          amount: "",
          category: "",
          customCategory: "",
          description: expense.description,
          miles: expense.miles?.toString() || "",
          costPerMile: expense.costPerMile?.toString() || "0.45",
        });
      }
    } else {
      setEditingExpense(null);
      setExpenseType("manual");
      setSelectedDate(new Date());
      setNewExpense({
        amount: "",
        category: "",
        customCategory: "",
        description: "",
        miles: "",
        costPerMile: "0.45",
      });
    }
    setIsExpensesDialogOpen(true);
  };

  const handleDeleteExpense = () => {
    if (expenseToDelete) {
      deleteExpense(expenseToDelete);
      setExpenseToDelete(null);
      setIsExpensesDeleteDialogOpen(false);
    }
  };

  // Helper functions
  const getPlatformColor = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "uber":
        return "bg-black text-white";
      case "bolt":
        return "bg-green-500 text-white";
      default:
        return "bg-primary text-primary-foreground";
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "uber":
      case "bolt":
      case "lyft":
        return <Car className="w-4 h-4" />;
      default:
        return <PoundSterling className="w-4 h-4" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case "fuel":
        return <Fuel className="w-4 h-4" />;
      case "maintenance":
        return <Wrench className="w-4 h-4" />;
      case "mileage":
        return <Car className="w-4 h-4" />;
      default:
        return <Receipt className="w-4 h-4" />;
    }
  };


  return (
    <div className="min-h-screen bg-gradient-background pb-20">
      {/* Header */}
      <div className="bg-gradient-primary text-white p-4 sm:p-6 pb-6 sm:pb-8">
        <div className="flex justify-between items-start sm:items-center mb-4 sm:mb-6">
          <div className="flex-1 min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold text-white truncate">Finance</h1>
            <p className="text-white/90 text-sm sm:text-base mt-1">Track your earnings and expenses</p>
          </div>
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-full flex items-center justify-center ml-3 flex-shrink-0">
            <PoundSterling className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
        </div>

        {/* Finance Overview */}
        <GradientCard variant="card" className="bg-white/10 backdrop-blur-sm border-white/20">
          <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-4">
            <div className="text-center">
              <p className="text-white/80 text-xs sm:text-sm">Earnings</p>
              <p className="text-lg sm:text-xl font-bold text-success">£{totalEarnings.toFixed(2)}</p>
            </div>
            <div className="text-center">
              <p className="text-white/80 text-xs sm:text-sm">Expenses</p>
              <p className="text-lg sm:text-xl font-bold text-destructive">£{totalExpenses.toFixed(2)}</p>
            </div>
            <div className="text-center">
              <p className="text-white/80 text-xs sm:text-sm">Net</p>
              <p className="text-lg sm:text-xl font-bold text-white">£{(totalEarnings - totalExpenses).toFixed(2)}</p>
            </div>
          </div>
        </GradientCard>
      </div>

      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 mt-4 sm:mt-6">
        {/* Date Filter */}
        <GradientCard>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
            <h3 className="font-semibold text-base sm:text-lg text-primary">Filter by Date Range</h3>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "justify-start text-left font-normal w-full sm:w-auto text-sm",
                    !dateRange?.from && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange?.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "MMM dd")} - {format(dateRange.to, "MMM dd, y")}
                      </>
                    ) : (
                      format(dateRange.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Pick a date range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange?.from}
                  selected={dateRange}
                  onSelect={setDateRange}
                  numberOfMonths={1}
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
        </GradientCard>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="earnings" className="text-sm">
              Earnings
            </TabsTrigger>
            <TabsTrigger value="expenses" className="text-sm">
              Expenses
            </TabsTrigger>
          </TabsList>

          {/* Earnings Tab */}
          <TabsContent value="earnings" className="space-y-4">
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <h3 className="font-semibold text-lg text-primary">Your Earnings</h3>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                    <SelectTrigger className="w-full sm:w-40">
                      <SelectValue placeholder="All Platforms" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Platforms</SelectItem>
                      {availablePlatforms.map((platform) => (
                        <SelectItem key={platform} value={platform}>
                          {platform}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Dialog open={isEarningsDialogOpen} onOpenChange={setIsEarningsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button onClick={() => openEarningsEditDialog()}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Earning
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="rounded-2xl max-w-md max-h-[90vh] overflow-y-auto">
                      <DialogHeader className="pb-4">
                        <DialogTitle className="text-lg sm:text-xl">
                          {editingEarning ? "Edit Earning" : "Add New Earning"}
                        </DialogTitle>
                        <DialogDescription className="text-sm sm:text-base">
                          {editingEarning ? "Update earning details" : "Record earnings for a shift"}
                        </DialogDescription>
                      </DialogHeader>

                      <div className="space-y-6">
                        <div className="space-y-3">
                          <Label htmlFor="platform" className="text-sm font-medium">Platform</Label>
                          <Select
                            value={earningsFormData.platform}
                            onValueChange={(value) => setEarningsFormData({ ...earningsFormData, platform: value })}
                          >
                            <SelectTrigger className="rounded-xl h-12 text-base">
                              <SelectValue placeholder="Select platform" />
                            </SelectTrigger>
                            <SelectContent className="bg-background border shadow-lg max-h-60">
                              {allPlatforms.map((platform) => (
                                <SelectItem key={platform} value={platform} className="text-base py-3">
                                  {platform}
                                </SelectItem>
                              ))}
                              <SelectItem value="custom" className="text-base py-3">Add Custom Platform</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {earningsFormData.platform === "custom" && (
                          <div className="space-y-3">
                            <Label htmlFor="customPlatform" className="text-sm font-medium">Custom Platform Name</Label>
                            <Input
                              id="customPlatform"
                              value={earningsFormData.customPlatform}
                              onChange={(e) => setEarningsFormData({ ...earningsFormData, customPlatform: e.target.value })}
                              placeholder="e.g., Local Taxi Company"
                              className="rounded-xl h-12 text-base"
                            />
                          </div>
                        )}

                        <div className="space-y-3">
                          <Label htmlFor="amount" className="text-sm font-medium">Total Earning (£)</Label>
                          <Input
                            id="amount"
                            type="number"
                            step="0.01"
                            value={earningsFormData.amount}
                            onChange={(e) => setEarningsFormData({ ...earningsFormData, amount: e.target.value })}
                            placeholder="0.00"
                            className="rounded-xl h-12 text-base"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                          <div className="space-y-3">
                            <Label htmlFor="trips" className="text-sm font-medium">Number of Trips</Label>
                            <Input
                              id="trips"
                              type="number"
                              value={earningsFormData.trips}
                              onChange={(e) => setEarningsFormData({ ...earningsFormData, trips: e.target.value })}
                              placeholder="0"
                              className="rounded-xl h-12 text-base"
                            />
                          </div>
                          <div className="space-y-3">
                            <Label htmlFor="hours" className="text-sm font-medium">Hours Worked</Label>
                            <Input
                              id="hours"
                              type="number"
                              step="0.5"
                              value={earningsFormData.hours}
                              onChange={(e) => setEarningsFormData({ ...earningsFormData, hours: e.target.value })}
                              placeholder="0.0"
                              className="rounded-xl h-12 text-base"
                            />
                          </div>
                        </div>

                        <div className="space-y-3">
                          <Label htmlFor="date" className="text-sm font-medium">Date</Label>
                          <Input
                            id="date"
                            type="date"
                            value={earningsFormData.date}
                            onChange={(e) => setEarningsFormData({ ...earningsFormData, date: e.target.value })}
                            className="rounded-xl h-12 text-base"
                          />
                        </div>

                        <Button
                          onClick={handleSaveEarning}
                          variant="default"
                          className="w-full rounded-xl h-12 text-base font-medium mt-6"
                        >
                          {editingEarning ? "Update Earning" : "Add Earning"}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              {platformFilteredEarnings.length === 0 ? (
                <GradientCard className="text-center py-8">
                  <Car className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-semibold mb-2 text-primary">
                    {selectedPlatform === "all" ? "No earnings yet" : `No earnings for ${selectedPlatform}`}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {selectedPlatform === "all" 
                      ? "Start tracking your platform earnings" 
                      : `No earnings found for ${selectedPlatform} in the selected date range`
                    }
                  </p>
                </GradientCard>
              ) : (
                <div className="space-y-4">
                  {platformFilteredEarnings.map((earning) => (
                    <GradientCard key={earning.id} className="hover:shadow-soft transition-shadow p-3 sm:p-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                              earning.platform === "Uber" ? "bg-gradient-to-br from-black to-gray-800 text-white" :
                              earning.platform === "Bolt" ? "bg-gradient-to-br from-green-500 to-green-600 text-white" :
                              earning.platform === "Lyft" ? "bg-gradient-to-br from-pink-500 to-pink-600 text-white" :
                              "bg-gradient-to-br from-primary to-primary/80 text-white"
                            }`}>
                              <div className="w-4 h-4">{getPlatformIcon(earning.platform)}</div>
                            </div>
                            <div>
                              <h3 className="font-semibold text-sm text-primary">{earning.platform}</h3>
                              <p className="text-xs text-muted-foreground flex items-center gap-1">
                                <CalendarIcon className="w-3 h-3" />
                                {new Date(earning.date).toLocaleDateString()}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openEarningsEditDialog(earning)}
                              className="h-8 w-8 p-0 hover:bg-muted/50 rounded-lg"
                            >
                              <Edit3 className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setEarningToDelete(earning.id);
                                setIsEarningsDeleteDialogOpen(true);
                              }}
                              className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive rounded-lg"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>

                        <div className="bg-muted/20 rounded-xl p-3">
                          <div className="flex items-baseline justify-between mb-2">
                            <span className="text-xl font-bold text-success">£{earning.amount.toFixed(2)}</span>
                            <div className="text-right">
                              <div className="flex items-center gap-1 text-xs text-success">
                                <TrendingUp className="w-3 h-3" />
                                £{(earning.amount / earning.hours).toFixed(2)}/hr
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                          <div className="bg-success/5 border border-success/10 rounded-lg p-2 text-center">
                            <div className="text-xs text-muted-foreground mb-1">Trips</div>
                            <div className="font-bold text-sm text-success">{earning.trips}</div>
                          </div>
                          <div className="bg-accent/5 border border-accent/10 rounded-lg p-2 text-center">
                            <div className="text-xs text-muted-foreground mb-1">Hours</div>
                            <div className="font-bold text-sm text-accent">{earning.hours}h</div>
                          </div>
                          <div className="bg-primary/5 border border-primary/10 rounded-lg p-2 text-center">
                            <div className="text-xs text-muted-foreground mb-1">Per Trip</div>
                            <div className="font-bold text-sm text-primary">£{(earning.amount / earning.trips).toFixed(2)}</div>
                          </div>
                        </div>
                      </div>
                    </GradientCard>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          {/* Expenses Tab */}
          <TabsContent value="expenses" className="space-y-4">
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <h3 className="font-semibold text-lg text-primary">Your Expenses</h3>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-full sm:w-40">
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {availableCategories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Dialog open={isExpensesDialogOpen} onOpenChange={setIsExpensesDialogOpen}>
                    <DialogTrigger asChild>
                      <Button onClick={() => openExpensesEditDialog()}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Expense
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="rounded-2xl max-w-md max-h-[90vh] overflow-y-auto">
                      <DialogHeader className="pb-4">
                        <DialogTitle className="text-lg sm:text-xl">
                          {editingExpense ? "Edit Expense" : "Add New Expense"}
                        </DialogTitle>
                        <DialogDescription className="text-sm sm:text-base">
                          {editingExpense ? "Update expense details" : "Record a business expense or calculate mileage"}
                        </DialogDescription>
                      </DialogHeader>

                      <Tabs value={expenseType} onValueChange={(value) => setExpenseType(value as "manual" | "mileage")} className="w-full">
                        <TabsList className="grid w-full grid-cols-2 mb-6">
                          <TabsTrigger value="manual" className="text-sm">Manual Entry</TabsTrigger>
                          <TabsTrigger value="mileage" className="text-sm">Mileage</TabsTrigger>
                        </TabsList>

                        <TabsContent value="manual" className="space-y-6">
                          <div className="space-y-3">
                            <Label htmlFor="amount" className="text-sm font-medium">Amount (£)</Label>
                            <Input
                              id="amount"
                              type="number"
                              step="0.01"
                              placeholder="0.00"
                              value={newExpense.amount}
                              onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                              className="rounded-xl h-12 text-base"
                            />
                          </div>

                          <div className="space-y-3">
                            <Label htmlFor="category" className="text-sm font-medium">Category</Label>
                            <Select
                              value={newExpense.category}
                              onValueChange={(value) => setNewExpense({ ...newExpense, category: value })}
                            >
                              <SelectTrigger className="rounded-xl h-12 text-base">
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                              <SelectContent className="bg-background border shadow-lg max-h-60">
                                {allCategories.map((category) => (
                                  <SelectItem key={category} value={category} className="text-base py-3">
                                    {category}
                                  </SelectItem>
                                ))}
                                <SelectItem value="custom" className="text-base py-3">Add Custom Category</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          {newExpense.category === "custom" && (
                            <div className="space-y-3">
                              <Label className="text-sm font-medium">Custom Category Name</Label>
                              <Input
                                value={newExpense.customCategory}
                                onChange={(e) => setNewExpense({ ...newExpense, customCategory: e.target.value })}
                                placeholder="e.g., Car Wash, Phone Bill"
                                className="rounded-xl h-12 text-base"
                              />
                            </div>
                          )}

                          <div className="space-y-3">
                            <Label className="text-sm font-medium">Date</Label>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    "w-full justify-start text-left font-normal rounded-xl h-12 text-base",
                                    !selectedDate && "text-muted-foreground"
                                  )}
                                >
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                  mode="single"
                                  selected={selectedDate}
                                  onSelect={(date) => date && setSelectedDate(date)}
                                  initialFocus
                                  className="p-3 pointer-events-auto"
                                />
                              </PopoverContent>
                            </Popover>
                          </div>

                          <div className="space-y-3">
                            <Label className="text-sm font-medium">Description</Label>
                            <Input
                              placeholder="Optional description"
                              value={newExpense.description}
                              onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                              className="rounded-xl h-12 text-base"
                            />
                          </div>
                        </TabsContent>

                        <TabsContent value="mileage" className="space-y-6">
                          <div className="space-y-3">
                            <Label className="text-sm font-medium">Miles Driven</Label>
                            <Input
                              type="number"
                              step="0.1"
                              placeholder="0.0"
                              value={newExpense.miles}
                              onChange={(e) => setNewExpense({ ...newExpense, miles: e.target.value })}
                              className="rounded-xl h-12 text-base"
                            />
                          </div>

                          <div className="space-y-3">
                            <Label className="text-sm font-medium">Cost per Mile (£)</Label>
                            <Input
                              type="number"
                              step="0.001"
                              value={newExpense.costPerMile}
                              onChange={(e) => setNewExpense({ ...newExpense, costPerMile: e.target.value })}
                              className="rounded-xl h-12 text-base"
                            />
                            <p className="text-xs text-muted-foreground">Standard HMRC rate: £0.45/mile</p>
                          </div>

                          {newExpense.miles && newExpense.costPerMile && (
                            <div className="bg-accent p-4 rounded-xl">
                              <div className="flex items-center gap-2 mb-2">
                                <PoundSterling className="w-4 h-4 text-primary" />
                                <span className="text-sm font-medium">Calculated Amount</span>
                              </div>
                              <p className="text-2xl font-bold text-primary">
                                £{(parseFloat(newExpense.miles) * parseFloat(newExpense.costPerMile)).toFixed(2)}
                              </p>
                            </div>
                          )}

                          <div className="space-y-2">
                            <Label>Date</Label>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    "w-full justify-start text-left font-normal rounded-xl",
                                    !selectedDate && "text-muted-foreground"
                                  )}
                                >
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                  mode="single"
                                  selected={selectedDate}
                                  onSelect={(date) => date && setSelectedDate(date)}
                                  initialFocus
                                  className="p-3 pointer-events-auto"
                                />
                              </PopoverContent>
                            </Popover>
                          </div>

                          <div className="space-y-2">
                            <Label>Description</Label>
                            <Input
                              placeholder="Trip purpose"
                              value={newExpense.description}
                              onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                              className="rounded-xl"
                            />
                          </div>
                        </TabsContent>

                        <Button
                          onClick={handleSaveExpense}
                          variant="default"
                          className="w-full rounded-xl h-12 text-base font-medium mt-6"
                        >
                          {editingExpense ? "Update Expense" : "Add Expense"}
                        </Button>
                      </Tabs>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              {filteredExpenses.length === 0 ? (
                <GradientCard className="text-center py-8">
                  <Receipt className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-semibold mb-2 text-primary">No expenses recorded</h3>
                  <p className="text-muted-foreground mb-4">Start tracking your business expenses</p>
                </GradientCard>
              ) : (
                <div className="space-y-4">
                  {filteredExpenses.map((expense) => (
                    <GradientCard key={expense.id} className="hover:shadow-elegant transition-all duration-300 p-3 sm:p-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                              expense.category === "Fuel" ? "bg-gradient-to-br from-destructive to-destructive/80 text-white" :
                              expense.category === "Maintenance" ? "bg-gradient-to-br from-warning to-warning/80 text-white" :
                              expense.category === "Mileage" ? "bg-gradient-to-br from-accent to-accent/80 text-white" :
                              "bg-gradient-to-br from-muted to-muted/80 text-muted-foreground"
                            }`}>
                              <div className="w-4 h-4">{getCategoryIcon(expense.category)}</div>
                            </div>
                            <div>
                              <h3 className="font-semibold text-sm text-primary">{expense.category}</h3>
                              <p className="text-xs text-muted-foreground flex items-center gap-1">
                                <Receipt className="w-3 h-3" />
                                {expense.date.toLocaleDateString()}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openExpensesEditDialog(expense)}
                              className="h-8 w-8 p-0 hover:bg-muted/50 rounded-lg"
                            >
                              <Edit3 className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setExpenseToDelete(expense.id);
                                setIsExpensesDeleteDialogOpen(true);
                              }}
                              className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive rounded-lg"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>

                        <div className="bg-muted/20 rounded-xl p-3">
                          <div className="flex items-baseline justify-between mb-2">
                            <span className="text-xl font-bold text-destructive">-£{expense.amount.toFixed(2)}</span>
                            <div className="text-right">
                              {expense.type === "mileage" && (
                                <span className="text-xs text-accent font-medium">Auto-calculated</span>
                              )}
                            </div>
                          </div>
                          <div className="text-sm text-muted-foreground">{expense.description}</div>
                        </div>

                        {expense.type === "mileage" && expense.miles && expense.costPerMile && (
                          <div className="grid grid-cols-2 gap-2">
                            <div className="bg-accent/5 border border-accent/10 rounded-lg p-2 text-center">
                              <div className="text-xs text-muted-foreground mb-1">Miles</div>
                              <div className="font-bold text-sm text-accent">{expense.miles}</div>
                            </div>
                            <div className="bg-muted/30 rounded-lg p-2 text-center">
                              <div className="text-xs text-muted-foreground mb-1">Rate/Mile</div>
                              <div className="font-bold text-sm">£{expense.costPerMile?.toFixed(3)}</div>
                            </div>
                          </div>
                        )}
                      </div>
                    </GradientCard>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Delete Dialogs */}
      <Dialog open={isEarningsDeleteDialogOpen} onOpenChange={setIsEarningsDeleteDialogOpen}>
        <DialogContent className="rounded-2xl max-w-sm">
          <DialogHeader className="pb-4">
            <DialogTitle className="text-lg">Delete Earning</DialogTitle>
            <DialogDescription className="text-sm">
              Are you sure you want to delete this earning? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={() => setIsEarningsDeleteDialogOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteEarning} className="flex-1">
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isExpensesDeleteDialogOpen} onOpenChange={setIsExpensesDeleteDialogOpen}>
        <DialogContent className="rounded-2xl max-w-sm">
          <DialogHeader className="pb-4">
            <DialogTitle className="text-lg">Delete Expense</DialogTitle>
            <DialogDescription className="text-sm">
              Are you sure you want to delete this expense? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={() => setIsExpensesDeleteDialogOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteExpense} className="flex-1">
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <MobileNavigation />
    </div>
  );
};

export default Finance;
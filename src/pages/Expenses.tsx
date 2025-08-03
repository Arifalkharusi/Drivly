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
  Fuel,
  Wrench,
  Receipt,
  Car,
  Calculator,
  Calendar as CalendarIcon,
  Trash2,
  Edit3,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import type { DateRange } from "react-day-picker";

const Expenses = () => {
  const { expenses, addExpense, updateExpense, deleteExpense } = useDataStore();

  const [customCategories, setCustomCategories] = useState<string[]>([
    "Parking",
    "Tolls",
  ]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState<string | null>(null);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [expenseType, setExpenseType] = useState<"manual" | "mileage">(
    "manual"
  );
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(new Date().setDate(new Date().getDate() - 30)),
    to: new Date(),
  });
  const [newExpense, setNewExpense] = useState({
    amount: "",
    category: "",
    customCategory: "",
    description: "",
    miles: "",
    costPerMile: "0.45", // Standard HMRC rate
  });
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const defaultCategories = ["Fuel", "Maintenance", "Insurance", "Other"];
  const allCategories = [...defaultCategories, ...customCategories];

  // Filter expenses by date range
  const filteredExpenses = expenses.filter((expense) => {
    if (!dateRange?.from || !dateRange?.to) return true;
    const expenseDate = new Date(expense.date);
    return expenseDate >= dateRange.from && expenseDate <= dateRange.to;
  });

  const totalToday = filteredExpenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );

  const handleSaveExpense = () => {
    if (expenseType === "manual" && newExpense.amount && newExpense.category) {
      let selectedCategory = newExpense.category;

      // Handle custom category
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
        type: "manual",
      };

      if (editingExpense) {
        updateExpense(expense);
      } else {
        addExpense(expense);
      }
    } else if (
      expenseType === "mileage" &&
      newExpense.miles &&
      newExpense.costPerMile
    ) {
      const calculatedAmount =
        parseFloat(newExpense.miles) * parseFloat(newExpense.costPerMile);
      const expense = {
        id: editingExpense?.id || Date.now().toString(),
        amount: calculatedAmount,
        category: "Mileage",
        description: newExpense.description || "Business mileage",
        date: selectedDate,
        type: "mileage",
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
      costPerMile: "0.545",
    });
    setSelectedDate(new Date());
    setEditingExpense(null);
    setIsDialogOpen(false);
  };

  const openEditDialog = (expense?: any) => {
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
          costPerMile: "0.545",
        });
      } else if (expense.type === "mileage") {
        setNewExpense({
          amount: "",
          category: "",
          customCategory: "",
          description: expense.description,
          miles: expense.miles?.toString() || "",
          costPerMile: expense.costPerMile?.toString() || "0.545",
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
        costPerMile: "0.545",
      });
    }
    setIsDialogOpen(true);
  };

  const handleDeleteExpense = () => {
    if (expenseToDelete) {
      deleteExpense(expenseToDelete);
      setExpenseToDelete(null);
      setIsDeleteDialogOpen(false);
    }
  };

  const openDeleteDialog = (expenseId: string) => {
    setExpenseToDelete(expenseId);
    setIsDeleteDialogOpen(true);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
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
            <h1 className="text-xl sm:text-2xl font-bold text-white truncate">
              Expenses
            </h1>
            <p className="text-white/90 text-sm sm:text-base mt-1">
              Track your business expenses
            </p>
          </div>
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-full flex items-center justify-center ml-3 flex-shrink-0">
            <Receipt className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
        </div>

        {/* Expense Overview */}
        <GradientCard
          variant="card"
          className="bg-white/10 backdrop-blur-sm border-white/20"
        >
          <div className="flex justify-between items-start sm:items-center mb-3 sm:mb-4 gap-3">
            <h2 className="text-base sm:text-lg font-semibold text-white">
              Expense Overview
            </h2>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  size="sm"
                  variant="ghost"
                  className="bg-white/20 hover:bg-white/30 text-white border-0 h-8 px-2 sm:px-3 text-xs sm:text-sm"
                  onClick={() => openEditDialog()}
                >
                  <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                  Add
                </Button>
              </DialogTrigger>
              <DialogContent className="rounded-2xl max-w-md max-h-[90vh] overflow-y-auto">
                <DialogHeader className="pb-4">
                  <DialogTitle className="text-lg sm:text-xl">
                    {editingExpense ? "Edit Expense" : "Add New Expense"}
                  </DialogTitle>
                  <DialogDescription className="text-sm sm:text-base">
                    {editingExpense
                      ? "Update expense details"
                      : "Record a business expense or calculate mileage"}
                  </DialogDescription>
                </DialogHeader>

                <Tabs
                  value={expenseType}
                  onValueChange={(value) =>
                    setExpenseType(value as "manual" | "mileage")
                  }
                  className="w-full"
                >
                  <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="manual" className="text-sm">
                      Manual Entry
                    </TabsTrigger>
                    <TabsTrigger value="mileage" className="text-sm">
                      Mileage
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="manual" className="space-y-6">
                    <div className="space-y-3">
                      <Label htmlFor="amount" className="text-sm font-medium">
                        Amount ($)
                      </Label>
                      <Input
                        id="amount"
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={newExpense.amount}
                        onChange={(e) =>
                          setNewExpense({
                            ...newExpense,
                            amount: e.target.value,
                          })
                        }
                        className="rounded-xl h-12 text-base"
                      />
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="category" className="text-sm font-medium">
                        Category
                      </Label>
                      <Select
                        value={newExpense.category}
                        onValueChange={(value) =>
                          setNewExpense({ ...newExpense, category: value })
                        }
                      >
                        <SelectTrigger className="rounded-xl h-12 text-base">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent className="bg-background border shadow-lg max-h-60">
                          {allCategories.map((category) => (
                            <SelectItem
                              key={category}
                              value={category}
                              className="text-base py-3"
                            >
                              {category}
                            </SelectItem>
                          ))}
                          <SelectItem value="custom" className="text-base py-3">
                            Add Custom Category
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {newExpense.category === "custom" && (
                      <div className="space-y-3">
                        <Label
                          Amount (£)
                          className="text-sm font-medium"
                        >
                          Custom Category Name
                        </Label>
                        <Input
                          id="customCategory"
                          value={newExpense.customCategory}
                          onChange={(e) =>
                            setNewExpense({
                              ...newExpense,
                              customCategory: e.target.value,
                            })
                          }
                          placeholder="e.g., Car Wash, Phone Bill"
                          className="rounded-xl h-12 text-base"
                        />
                      </div>
                    )}
                          Standard HMRC rate: £0.45/mile
                    <div className="space-y-3">
                      <Label htmlFor="date" className="text-sm font-medium">
                        Date
                      </Label>
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
                            {selectedDate ? (
                              format(selectedDate, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
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
                      <Label
                        htmlFor="description"
                        className="text-sm font-medium"
                      >
                        Description
                      </Label>
                      <Input
                        id="description"
                        placeholder="Optional description"
                        value={newExpense.description}
                        onChange={(e) =>
                          setNewExpense({
                            ...newExpense,
                            description: e.target.value,
                          })
                        }
                        className="rounded-xl h-12 text-base"
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="mileage" className="space-y-6">
                    <div className="space-y-3">
                      <Label htmlFor="miles" className="text-sm font-medium">
                        Miles Driven
                      </Label>
                      <Input
                        id="miles"
                        type="number"
                        step="0.1"
                        placeholder="0.0"
                        value={newExpense.miles}
                        onChange={(e) =>
                          setNewExpense({
                            ...newExpense,
                            miles: e.target.value,
                          })
                        }
                        className="rounded-xl h-12 text-base"
                      />
                    </div>

                    <div className="space-y-3">
                      <Label
                        htmlFor="costPerMile"
                        className="text-sm font-medium"
                      >
                        Cost per Mile (£)
                      </Label>
                      <Input
                        id="costPerMile"
                        type="number"
                        step="0.001"
                        value={newExpense.costPerMile}
                        onChange={(e) =>
                          setNewExpense({
                            ...newExpense,
                            costPerMile: e.target.value,
                          })
                        }
                        className="rounded-xl h-12 text-base"
                      />
                      <p className="text-xs text-muted-foreground">
                        Standard HMRC rate: £0.45/mile
                      </p>
                    </div>

                    {newExpense.miles && newExpense.costPerMile && (
                      <div className="bg-accent p-4 rounded-xl">
                        <div className="flex items-center gap-2 mb-2">
                          <Calculator className="w-4 h-4 text-primary" />
                          <span className="text-sm font-medium">
                            Calculated Amount
                          </span>
                        </div>
                        <p className="text-2xl font-bold text-primary">
                          £
                          {(
                            parseFloat(newExpense.miles) *
                            parseFloat(newExpense.costPerMile)
                          ).toFixed(2)}
                        </p>
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="mileage-date">Date</Label>
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
                            {selectedDate ? (
                              format(selectedDate, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
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
                      <Label htmlFor="mileage-description">Description</Label>
                      <Input
                        id="mileage-description"
                        placeholder="Trip purpose"
                        value={newExpense.description}
                        onChange={(e) =>
                          setNewExpense({
                            ...newExpense,
                            description: e.target.value,
                          })
                        }
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

          <div className="grid grid-cols-3 gap-2 sm:gap-4">
            <div className="text-center">
              <p className="text-white/80 text-xs sm:text-sm">Total</p>
              <p className="text-lg sm:text-xl font-bold text-white">
                ${totalToday.toFixed(2)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-white/80 text-xs sm:text-sm">Categories</p>
              <p className="text-lg sm:text-xl font-bold text-white">
                {new Set(filteredExpenses.map((e) => e.category)).size}
              </p>
            </div>
            <div className="text-center">
              <p className="text-white/80 text-xs sm:text-sm">Entries</p>
              <p className="text-lg sm:text-xl font-bold text-white">
                {filteredExpenses.length}
              </p>
            </div>
          </div>
        </GradientCard>
      </div>

      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 mt-4 sm:mt-6">
        {/* Date Filter */}
        <GradientCard>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
            <h3 className="font-semibold text-base sm:text-lg text-primary">
              Filter by Date Range
            </h3>
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
                        {format(dateRange.from, "MMM dd")} -{" "}
                        {format(dateRange.to, "MMM dd, y")}
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

        {filteredExpenses.length === 0 ? (
          <GradientCard className="text-center py-8">
            <Receipt className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold mb-2 text-primary">
              No expenses recorded
            </h3>
            <p className="text-muted-foreground mb-4">
              Start tracking your business expenses
            </p>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="success"
                  className="rounded-xl"
                  onClick={() => openEditDialog()}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Expense
                </Button>
              </DialogTrigger>
            </Dialog>
          </GradientCard>
        ) : (
          <div className="space-y-4">
            {filteredExpenses.map((expense) => (
              <GradientCard
                key={expense.id}
                className="hover:shadow-elegant transition-all duration-300 animate-fade-in p-4 sm:p-6"
              >
                {/* Mobile-optimized layout */}
                <div className="space-y-4">
                  {/* Top section - Category info and action buttons */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${
                          expense.category === "Fuel"
                            ? "bg-gradient-to-br from-destructive to-destructive/80 text-white"
                            : expense.category === "Maintenance"
                            ? "bg-gradient-to-br from-warning to-warning/80 text-white"
                            : expense.category === "Mileage"
                            ? "bg-gradient-to-br from-accent to-accent/80 text-white"
                            : "bg-gradient-to-br from-muted to-muted/80 text-muted-foreground"
                        }`}
                      >
                        {getCategoryIcon(expense.category)}
                      </div>
                      <div>
                        <h3 className="font-bold text-base text-primary">
                          {expense.category}
                        </h3>
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
                        onClick={() => openEditDialog(expense)}
                        className="h-10 w-10 p-0 hover:bg-muted/50 rounded-xl"
                      >
                        <Edit3 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openDeleteDialog(expense.id)}
                        className="h-10 w-10 p-0 text-muted-foreground hover:text-destructive rounded-xl"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Amount section */}
                  <div className="bg-muted/20 rounded-2xl p-4">
                    <div className="flex items-baseline justify-between mb-2">
                      <div>
                        <span className="text-2xl font-bold text-destructive">
                          -${expense.amount.toFixed(2)}
                        </span>
                      </div>
                      <div className="text-right">
                        {expense.type === "mileage" && (
                          <span className="text-xs text-accent font-medium">
                            Auto-calculated
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="text-sm text-muted-foreground">
                      {expense.description}
                    </div>
                  </div>

                  {/* Details section - Mobile optimized */}
                  {expense.type === "mileage" &&
                    expense.miles &&
                    expense.costPerMile && (
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-accent/5 border border-accent/10 rounded-xl p-3 text-center">
                          <div className="text-xs text-muted-foreground mb-1">
                            Miles
                          </div>
                          <div className="font-bold text-base text-accent">
                            {expense.miles}
                          </div>
                        </div>
                        <div className="bg-muted/30 rounded-xl p-3 text-center">
                          <div className="text-xs text-muted-foreground mb-1">
                            Rate/Mile
                          </div>
                          <div className="font-bold text-base">
                            £{expense.costPerMile?.toFixed(3)}
                          </div>
                        </div>
                      </div>
                    )}
                </div>
              </GradientCard>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="rounded-2xl max-w-sm">
          <DialogHeader className="pb-4">
            <DialogTitle className="text-lg">Delete Expense</DialogTitle>
            <DialogDescription className="text-sm">
              Are you sure you want to delete this expense? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>

          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteExpense}
              className="flex-1"
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <MobileNavigation />
    </div>
  );
};

export default Expenses;
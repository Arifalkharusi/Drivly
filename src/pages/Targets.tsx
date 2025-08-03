import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import GradientCard from "@/components/GradientCard";
import MobileNavigation from "@/components/MobileNavigation";
import { Target, Edit3, TrendingUp, Calendar, Clock, Trash2 } from "lucide-react";

interface TargetData {
  id: string;
  amount: number;
  period: "daily" | "weekly" | "monthly";
  current: number;
  startDate: Date;
}

const Targets = () => {
  const [targets, setTargets] = useState<TargetData[]>([
    {
      id: "1",
      amount: 1500,
      period: "weekly",
      current: 980,
      startDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
    },
    {
      id: "2",
      amount: 250,
      period: "daily",
      current: 247.50,
      startDate: new Date()
    },
    {
      id: "3",
      amount: 6000,
      period: "monthly",
      current: 4250,
      startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
    }
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [targetToDelete, setTargetToDelete] = useState<string | null>(null);
  const [editingTarget, setEditingTarget] = useState<TargetData | null>(null);
  const [newTarget, setNewTarget] = useState({
    amount: "",
    period: "weekly" as "daily" | "weekly" | "monthly"
  });

  const handleSaveTarget = () => {
    if (!newTarget.amount) return;

    const targetData: TargetData = {
      id: editingTarget?.id || Date.now().toString(),
      amount: parseFloat(newTarget.amount),
      period: newTarget.period,
      current: editingTarget?.current || 0,
      startDate: editingTarget?.startDate || new Date()
    };

    if (editingTarget) {
      setTargets(targets.map(t => t.id === editingTarget.id ? targetData : t));
    } else {
      setTargets([...targets, targetData]);
    }

    setNewTarget({ amount: "", period: "weekly" });
    setEditingTarget(null);
    setIsDialogOpen(false);
  };

  const openEditDialog = (target?: TargetData) => {
    if (target) {
      setEditingTarget(target);
      setNewTarget({
        amount: target.amount.toString(),
        period: target.period
      });
    } else {
      setEditingTarget(null);
      setNewTarget({ amount: "", period: "weekly" });
    }
    setIsDialogOpen(true);
  };

  const handleDeleteTarget = () => {
    if (targetToDelete) {
      setTargets(targets.filter(target => target.id !== targetToDelete));
      setTargetToDelete(null);
      setIsDeleteDialogOpen(false);
    }
  };

  const openDeleteDialog = (targetId: string) => {
    setTargetToDelete(targetId);
    setIsDeleteDialogOpen(true);
  };

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const getRemainingTime = (period: string, startDate: Date) => {
    const now = new Date();
    let endDate: Date;

    switch (period) {
      case "daily":
        endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 1);
        break;
      case "weekly":
        endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 7);
        break;
      case "monthly":
        endDate = new Date(startDate);
        endDate.setMonth(startDate.getMonth() + 1);
        break;
      default:
        return "Unknown";
    }

    const diffMs = endDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return "Expired";
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "1 day left";
    return `${diffDays} days left`;
  };

  const getPeriodIcon = (period: string) => {
    switch (period) {
      case "daily":
        return <Clock className="w-4 h-4" />;
      case "weekly":
        return <Calendar className="w-4 h-4" />;
      case "monthly":
        return <TrendingUp className="w-4 h-4" />;
      default:
        return <Target className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-background pb-20">
      {/* Header */}
      <div className="bg-gradient-primary text-white p-4 sm:p-6 pb-6 sm:pb-8">
        <div className="flex justify-between items-start sm:items-center mb-4 sm:mb-6">
          <div className="flex-1 min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold text-white truncate">Income Targets</h1>
            <p className="text-white/90 text-sm sm:text-base mt-1">Set and track your earning goals</p>
          </div>
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-full flex items-center justify-center ml-3 flex-shrink-0">
            <Target className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
        </div>

        {/* Today's Overview */}
        <GradientCard variant="card" className="bg-white/10 backdrop-blur-sm border-white/20">
          <div className="flex justify-between items-start sm:items-center mb-3 sm:mb-4 gap-3">
            <h2 className="text-base sm:text-lg font-semibold text-white">Target Overview</h2>
            <Button 
              size="sm" 
              variant="ghost"
              className="bg-white/20 hover:bg-white/30 text-white border-0 h-8 px-2 sm:px-3 text-xs sm:text-sm"
              onClick={() => openEditDialog()}
            >
              <Target className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
              New
            </Button>
          </div>
          
          <div className="grid grid-cols-3 gap-2 sm:gap-4">
            <div className="text-center">
              <p className="text-white/80 text-xs sm:text-sm">Active</p>
              <p className="text-lg sm:text-xl font-bold text-white">{targets.length}</p>
            </div>
            <div className="text-center">
              <p className="text-white/80 text-xs sm:text-sm">Completed</p>
              <p className="text-lg sm:text-xl font-bold text-success">
                {targets.filter(t => getProgressPercentage(t.current, t.amount) >= 100).length}
              </p>
            </div>
            <div className="text-center">
              <p className="text-white/80 text-xs sm:text-sm">In Progress</p>
              <p className="text-lg sm:text-xl font-bold text-warning">
                {targets.filter(t => getProgressPercentage(t.current, t.amount) < 100).length}
              </p>
            </div>
          </div>
        </GradientCard>
      </div>

      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 mt-4 sm:mt-6">
        {targets.length === 0 ? (
          <GradientCard className="text-center py-8">
            <Target className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold mb-2 text-primary">No targets set</h3>
            <p className="text-muted-foreground mb-4">Create your first income target to start tracking progress</p>
            <Button 
              variant="default"
              className="rounded-xl"
              onClick={() => openEditDialog()}
            >
              <Target className="w-4 h-4 mr-2" />
              Set Your First Target
            </Button>
          </GradientCard>
        ) : (
          <div className="space-y-4">
            {targets.map((target) => {
              const progressPercentage = getProgressPercentage(target.current, target.amount);
              const isCompleted = progressPercentage >= 100;
              const remaining = target.amount - target.current;

              return (
                <GradientCard key={target.id} className="hover:shadow-elegant transition-all duration-300 animate-fade-in p-4 sm:p-6">
                  {/* Mobile-optimized layout */}
                  <div className="space-y-4">
                    {/* Top section - Period info and edit button */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${
                          isCompleted 
                            ? "bg-gradient-to-br from-success to-success/80 text-white" 
                            : "bg-gradient-to-br from-primary to-primary/80 text-white"
                        }`}>
                          {getPeriodIcon(target.period)}
                        </div>
                        <div>
                          <h3 className="font-bold text-base capitalize text-primary">{target.period} Target</h3>
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {getRemainingTime(target.period, target.startDate)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditDialog(target)}
                          className="h-10 w-10 p-0 hover:bg-muted/50 rounded-xl"
                        >
                          <Edit3 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openDeleteDialog(target.id)}
                          className="h-10 w-10 p-0 text-muted-foreground hover:text-destructive rounded-xl"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Amount section - Stacked for mobile */}
                    <div className="bg-muted/20 rounded-2xl p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs text-muted-foreground">Progress</span>
                        <span className="text-xs font-medium">{progressPercentage.toFixed(1)}%</span>
                      </div>
                      
                      <div className="flex items-baseline justify-between mb-3">
                        <div>
                          <span className="text-2xl font-bold text-foreground">£{target.current.toFixed(2)}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-base text-muted-foreground">of £{target.amount.toFixed(2)}</span>
                        </div>
                      </div>

                      <Progress 
                        value={progressPercentage} 
                        className="h-2 bg-muted/50"
                      />
                      
                      <div className="flex justify-between items-center mt-2">
                        {!isCompleted ? (
                          <span className="text-xs text-muted-foreground">${remaining.toFixed(2)} remaining</span>
                        ) : (
                          <span className="text-xs text-success font-medium flex items-center gap-1">
                            🎉 Target Achieved!
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Stats section - Mobile optimized grid */}
                    <div className="grid grid-cols-2 gap-3">
                      {target.period === "daily" && (
                        <>
                          <div className="bg-primary/5 border border-primary/10 rounded-xl p-3 text-center">
                            <div className="text-xs text-muted-foreground mb-1">Today's Earnings</div>
                            <div className="font-bold text-base text-primary">£{target.current.toFixed(2)}</div>
                          </div>
                          <div className="bg-muted/30 rounded-xl p-3 text-center">
                            <div className="text-xs text-muted-foreground mb-1">Completion</div>
                            <div className="font-bold text-base">{progressPercentage.toFixed(0)}%</div>
                          </div>
                        </>
                      )}
                      
                      {target.period === "weekly" && (
                        <>
                          <div className="bg-primary/5 border border-primary/10 rounded-xl p-3 text-center">
                            <div className="text-xs text-muted-foreground mb-1">Daily Avg</div>
                            <div className="font-bold text-base text-primary">${(target.current / 7).toFixed(2)}</div>
                          </div>
                          <div className="bg-muted/30 rounded-xl p-3 text-center">
                            <div className="text-xs text-muted-foreground mb-1">Daily Needed</div>
                            <div className="font-bold text-base">
                              ${remaining > 0 ? (remaining / Math.max(1, Math.ceil((new Date(target.startDate.getTime() + 7 * 24 * 60 * 60 * 1000).getTime() - new Date().getTime()) / (24 * 60 * 60 * 1000)))).toFixed(2) : "0.00"}
                            </div>
                          </div>
                        </>
                      )}
                      
                      {target.period === "monthly" && (
                        <>
                          <div className="bg-primary/5 border border-primary/10 rounded-xl p-3 text-center">
                            <div className="text-xs text-muted-foreground mb-1">Weekly Avg</div>
                            <div className="font-bold text-base text-primary">${(target.current / 4).toFixed(2)}</div>
                          </div>
                          <div className="bg-muted/30 rounded-xl p-3 text-center">
                            <div className="text-xs text-muted-foreground mb-1">Daily Avg</div>
                            <div className="font-bold text-base">${(target.current / 30).toFixed(2)}</div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </GradientCard>
              );
            })}
          </div>
        )}
      </div>

      {/* Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="rounded-2xl max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader className="pb-4">
            <DialogTitle className="text-lg sm:text-xl">
              {editingTarget ? "Edit Target" : "Set New Target"}
            </DialogTitle>
            <DialogDescription className="text-sm sm:text-base">
              {editingTarget 
                ? "Update your income target"
                : "Set a new income goal to track your progress"
              }
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="target-amount" className="text-sm font-medium">Target Amount ($)</Label>
              <Input
                id="target-amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={newTarget.amount}
                onChange={(e) => setNewTarget({...newTarget, amount: e.target.value})}
                className="rounded-xl h-12 text-base"
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="target-period" className="text-sm font-medium">Time Period</Label>
              <Select 
                value={newTarget.period} 
                onValueChange={(value: "daily" | "weekly" | "monthly") => 
                  setNewTarget({...newTarget, period: value})
                }
              >
                <SelectTrigger className="rounded-xl h-12 text-base">
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  <SelectItem value="daily" className="text-base py-3">Daily</SelectItem>
                  <SelectItem value="weekly" className="text-base py-3">Weekly</SelectItem>
                  <SelectItem value="monthly" className="text-base py-3">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button 
              onClick={handleSaveTarget}
              variant="default"
              className="w-full rounded-xl h-12 text-base font-medium mt-6"
              disabled={!newTarget.amount}
            >
              {editingTarget ? "Update Target" : "Create Target"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="rounded-2xl max-w-sm">
          <DialogHeader className="pb-4">
            <DialogTitle className="text-lg">Delete Target</DialogTitle>
            <DialogDescription className="text-sm">
              Are you sure you want to delete this target? This action cannot be undone.
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
              onClick={handleDeleteTarget}
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

export default Targets;
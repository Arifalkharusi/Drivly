import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import GradientCard from "@/components/GradientCard";
import MobileNavigation from "@/components/MobileNavigation";
import { Target, Edit3, TrendingUp, Calendar, Clock } from "lucide-react";

interface TargetData {
  id: string;
  type: "daily" | "weekly" | "monthly";
  amount: number;
  current: number;
  enabled: boolean;
  startDate: Date;
}

const Targets = () => {
  const [targets, setTargets] = useState<TargetData[]>([
    {
      id: "daily",
      type: "daily",
      amount: 200,
      current: 147.50,
      enabled: true,
      startDate: new Date()
    },
    {
      id: "weekly",
      type: "weekly",
      amount: 1200,
      current: 850,
      enabled: true,
      startDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
    },
    {
      id: "monthly",
      type: "monthly",
      amount: 5000,
      current: 3250,
      enabled: false,
      startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
    }
  ]);

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingTarget, setEditingTarget] = useState<TargetData | null>(null);
  const [editAmount, setEditAmount] = useState("");

  const handleToggleTarget = (targetId: string) => {
    setTargets(targets.map(target => 
      target.id === targetId 
        ? { ...target, enabled: !target.enabled }
        : target
    ));
  };

  const handleEditTarget = (target: TargetData) => {
    setEditingTarget(target);
    setEditAmount(target.amount.toString());
    setIsEditDialogOpen(true);
  };

  const handleSaveTarget = () => {
    if (!editingTarget || !editAmount) return;

    setTargets(targets.map(target =>
      target.id === editingTarget.id
        ? { ...target, amount: parseFloat(editAmount) }
        : target
    ));

    setEditingTarget(null);
    setEditAmount("");
    setIsEditDialogOpen(false);
  };

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const getRemainingTime = (type: string, startDate: Date) => {
    const now = new Date();
    let endDate: Date;

    switch (type) {
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

  const getPeriodIcon = (type: string) => {
    switch (type) {
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

  const getTargetColor = (type: string) => {
    switch (type) {
      case "daily":
        return "from-blue-500 to-blue-600";
      case "weekly":
        return "from-green-500 to-green-600";
      case "monthly":
        return "from-purple-500 to-purple-600";
      default:
        return "from-primary to-primary/80";
    }
  };

  const enabledTargets = targets.filter(t => t.enabled);
  const completedTargets = enabledTargets.filter(t => getProgressPercentage(t.current, t.amount) >= 100);

  return (
    <div className="min-h-screen bg-gradient-background pb-20">
      {/* Header */}
      <div className="bg-gradient-primary text-white p-4 sm:p-6 pb-6 sm:pb-8">
        <div className="flex justify-between items-start sm:items-center mb-4 sm:mb-6">
          <div className="flex-1 min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold text-white truncate">Income Targets</h1>
            <p className="text-white/90 text-sm sm:text-base mt-1">Manage your earning goals</p>
          </div>
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-full flex items-center justify-center ml-3 flex-shrink-0">
            <Target className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
        </div>

        {/* Target Overview */}
        <GradientCard variant="card" className="bg-white/10 backdrop-blur-sm border-white/20">
          <div className="flex justify-between items-start sm:items-center mb-3 sm:mb-4 gap-3">
            <h2 className="text-base sm:text-lg font-semibold text-white">Target Overview</h2>
          </div>
          
          <div className="grid grid-cols-3 gap-2 sm:gap-4">
            <div className="text-center">
              <p className="text-white/80 text-xs sm:text-sm">Active</p>
              <p className="text-lg sm:text-xl font-bold text-white">{enabledTargets.length}</p>
            </div>
            <div className="text-center">
              <p className="text-white/80 text-xs sm:text-sm">Completed</p>
              <p className="text-lg sm:text-xl font-bold text-success">{completedTargets.length}</p>
            </div>
            <div className="text-center">
              <p className="text-white/80 text-xs sm:text-sm">In Progress</p>
              <p className="text-lg sm:text-xl font-bold text-warning">
                {enabledTargets.length - completedTargets.length}
              </p>
            </div>
          </div>
        </GradientCard>
      </div>

      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 mt-4 sm:mt-6">
        <div className="space-y-4">
          {targets.map((target) => {
            const progressPercentage = getProgressPercentage(target.current, target.amount);
            const isCompleted = progressPercentage >= 100;
            const remaining = target.amount - target.current;

            return (
              <GradientCard key={target.id} className={`hover:shadow-elegant transition-all duration-300 animate-fade-in p-4 sm:p-6 ${!target.enabled ? 'opacity-60' : ''}`}>
                <div className="space-y-4">
                  {/* Top section - Period info and controls */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${
                        target.enabled 
                          ? isCompleted 
                            ? "bg-gradient-to-br from-success to-success/80 text-white" 
                            : `bg-gradient-to-br ${getTargetColor(target.type)} text-white`
                          : "bg-gradient-to-br from-muted to-muted/80 text-muted-foreground"
                      }`}>
                        {getPeriodIcon(target.type)}
                      </div>
                      <div>
                        <h3 className="font-bold text-base capitalize text-primary">{target.type} Target</h3>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {target.enabled ? getRemainingTime(target.type, target.startDate) : 'Disabled'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={target.enabled}
                        onCheckedChange={() => handleToggleTarget(target.id)}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditTarget(target)}
                        className="h-10 w-10 p-0 hover:bg-muted/50 rounded-xl"
                      >
                        <Edit3 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {target.enabled && (
                    <>
                      {/* Amount section */}
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
                            <span className="text-xs text-muted-foreground">£{remaining.toFixed(2)} remaining</span>
                          ) : (
                            <span className="text-xs text-success font-medium flex items-center gap-1">
                              🎉 Target Achieved!
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Stats section */}
                      <div className="grid grid-cols-2 gap-3">
                        {target.type === "daily" && (
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
                        
                        {target.type === "weekly" && (
                          <>
                            <div className="bg-primary/5 border border-primary/10 rounded-xl p-3 text-center">
                              <div className="text-xs text-muted-foreground mb-1">Daily Avg</div>
                              <div className="font-bold text-base text-primary">£{(target.current / 7).toFixed(2)}</div>
                            </div>
                            <div className="bg-muted/30 rounded-xl p-3 text-center">
                              <div className="text-xs text-muted-foreground mb-1">Daily Needed</div>
                              <div className="font-bold text-base">
                                £{remaining > 0 ? (remaining / Math.max(1, Math.ceil((new Date(target.startDate.getTime() + 7 * 24 * 60 * 60 * 1000).getTime() - new Date().getTime()) / (24 * 60 * 60 * 1000)))).toFixed(2) : "0.00"}
                              </div>
                            </div>
                          </>
                        )}
                        
                        {target.type === "monthly" && (
                          <>
                            <div className="bg-primary/5 border border-primary/10 rounded-xl p-3 text-center">
                              <div className="text-xs text-muted-foreground mb-1">Weekly Avg</div>
                              <div className="font-bold text-base text-primary">£{(target.current / 4).toFixed(2)}</div>
                            </div>
                            <div className="bg-muted/30 rounded-xl p-3 text-center">
                              <div className="text-xs text-muted-foreground mb-1">Daily Avg</div>
                              <div className="font-bold text-base">£{(target.current / 30).toFixed(2)}</div>
                            </div>
                          </>
                        )}
                      </div>
                    </>
                  )}

                  {!target.enabled && (
                    <div className="bg-muted/20 rounded-2xl p-4 text-center">
                      <p className="text-muted-foreground">Target is currently disabled</p>
                      <p className="text-sm text-muted-foreground mt-1">Toggle the switch above to enable</p>
                    </div>
                  )}
                </div>
              </GradientCard>
            );
          })}
        </div>
      </div>

      {/* Edit Target Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="rounded-2xl max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader className="pb-4">
            <DialogTitle className="text-lg sm:text-xl">
              Edit {editingTarget?.type} Target
            </DialogTitle>
            <DialogDescription className="text-sm sm:text-base">
              Update your {editingTarget?.type} earning goal
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="target-amount" className="text-sm font-medium">Target Amount (£)</Label>
              <Input
                id="target-amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={editAmount}
                onChange={(e) => setEditAmount(e.target.value)}
                className="rounded-xl h-12 text-base"
              />
            </div>

            <div className="bg-muted/20 rounded-xl p-4">
              <h4 className="font-medium mb-2">Current Progress</h4>
              <p className="text-sm text-muted-foreground">
                You've earned £{editingTarget?.current.toFixed(2)} towards your {editingTarget?.type} target
              </p>
            </div>

            <div className="flex gap-3 pt-4">
              <Button 
                variant="outline" 
                onClick={() => setIsEditDialogOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSaveTarget}
                className="flex-1"
                disabled={!editAmount}
              >
                Update Target
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <MobileNavigation />
    </div>
  );
};

export default Targets;
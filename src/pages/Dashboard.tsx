import { useDataStore } from "@/hooks/useDataStore";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import GradientCard from "@/components/GradientCard";
import MobileNavigation from "@/components/MobileNavigation";
import { TrendingUp, TrendingDown, Target, DollarSign, BarChart3, Activity } from "lucide-react";
import { PoundSterling } from "lucide-react";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const Dashboard = () => {
  const {
    todayEarnings,
    todayExpenses,
    weeklyEarnings,
    weeklyExpenses,
    weeklyData,
    weeklyHourlyRate,
    totalTrips,
    totalHours,
    expenseBreakdown,
    dailyHoursData
  } = useDataStore();

  const weeklyTarget = 1500;
  const weeklyProgress = weeklyEarnings;

  const progressPercentage = (weeklyProgress / weeklyTarget) * 100;
  const netIncome = weeklyEarnings - weeklyExpenses;

  const COLORS = ['#1E3C72', '#00B4DB', '#43CEA2', '#EF473A'];

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
                    <BarChart3 className="w-6 h-6 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-success rounded-full animate-pulse" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">Analytics Dashboard</h1>
                  <p className="text-white/80 text-sm flex items-center gap-1">
                    <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
                    Real-time insights
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Modern Overview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {/* Weekly Net Income */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />
              <div className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 hover:bg-white/15 transition-all duration-300">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <Badge className="bg-blue-500/20 text-blue-100 border-blue-400/30 text-xs">
                    +12.4%
                  </Badge>
                </div>
                <p className="text-white/80 text-sm mb-1">Weekly Net</p>
                <p className="text-2xl font-bold text-white">£{netIncome.toFixed(2)}</p>
                <div className="w-full h-1 bg-white/20 rounded-full mt-3 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full w-4/5 animate-pulse" />
                </div>
              </div>
            </div>

            {/* Total Trips */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-emerald-400/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />
              <div className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 hover:bg-white/15 transition-all duration-300">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-600 rounded-xl flex items-center justify-center">
                    <Activity className="w-5 h-5 text-white" />
                  </div>
                  <Badge className="bg-green-500/20 text-green-100 border-green-400/30 text-xs">
                    +8.7%
                  </Badge>
                </div>
                <p className="text-white/80 text-sm mb-1">Total Trips</p>
                <p className="text-2xl font-bold text-white">{totalTrips}</p>
                <div className="w-full h-1 bg-white/20 rounded-full mt-3 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-green-400 to-emerald-600 rounded-full w-3/4 animate-pulse" />
                </div>
              </div>
            </div>

            {/* Hours Worked */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />
              <div className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 hover:bg-white/15 transition-all duration-300">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-600 rounded-xl flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-white" />
                  </div>
                  <Badge className="bg-purple-500/20 text-purple-100 border-purple-400/30 text-xs">
                    +15.2%
                  </Badge>
                </div>
                <p className="text-white/80 text-sm mb-1">Hours Worked</p>
                <p className="text-2xl font-bold text-white">{totalHours.toFixed(1)}h</p>
                <div className="w-full h-1 bg-white/20 rounded-full mt-3 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-purple-400 to-pink-600 rounded-full w-2/3 animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-6 space-y-6 mt-6">
        {/* Modern Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column - Main Charts */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Weekly Target Progress - Enhanced */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300" />
              <div className="relative bg-gradient-card backdrop-blur-sm border border-white/20 rounded-3xl p-6 hover:shadow-elegant transition-all duration-300">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-lg">
                      <Target className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-xl text-primary">Weekly Target</h3>
                      <p className="text-sm text-muted-foreground">Track your progress</p>
                    </div>
                  </div>
                  <Badge className="bg-primary/10 text-primary border-primary/20 px-3 py-1">
                    {progressPercentage.toFixed(1)}%
                  </Badge>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-3xl font-bold text-primary">£{weeklyProgress.toFixed(2)}</p>
                      <p className="text-muted-foreground">of £{weeklyTarget} target</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-muted-foreground">£{(weeklyTarget - weeklyProgress).toFixed(2)}</p>
                      <p className="text-sm text-muted-foreground">remaining</p>
                    </div>
                  </div>
                  
                  <div className="relative">
                    <Progress value={progressPercentage} className="h-4 bg-muted/30" />
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full" />
                  </div>
                </div>
              </div>
            </div>

            {/* Weekly Overview Chart - Enhanced */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-success/10 to-destructive/10 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300" />
              <div className="relative bg-gradient-card backdrop-blur-sm border border-white/20 rounded-3xl p-6 hover:shadow-elegant transition-all duration-300">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-accent rounded-2xl flex items-center justify-center shadow-lg">
                      <Activity className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-xl text-primary">Weekly Performance</h3>
                      <p className="text-sm text-muted-foreground">Earnings vs Expenses</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Badge className="bg-success/10 text-success border-success/20">
                      Earnings
                    </Badge>
                    <Badge className="bg-destructive/10 text-destructive border-destructive/20">
                      Expenses
                    </Badge>
                  </div>
                </div>
                
                <div className="h-64 md:h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={weeklyData}>
                      <defs>
                        <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#43CEA2" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#43CEA2" stopOpacity={0.1}/>
                        </linearGradient>
                        <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#EF473A" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#EF473A" stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                      <XAxis 
                        dataKey="day" 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                        interval={0}
                      />
                      <YAxis 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                        width={50}
                      />
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: 'none',
                          borderRadius: '16px',
                          boxShadow: 'var(--shadow-card)',
                          fontSize: '14px',
                          color: 'hsl(var(--card-foreground))'
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="earnings"
                        stroke="#43CEA2"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorEarnings)"
                      />
                      <Area
                        type="monotone"
                        dataKey="expenses"
                        stroke="#EF473A"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorExpenses)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column - Stats & Insights */}
          <div className="space-y-6">
            
            {/* Quick Stats Cards */}
            <div className="grid grid-cols-1 gap-4">
              
              {/* Today's Performance */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-2xl blur-lg group-hover:blur-xl transition-all duration-300" />
                <div className="relative bg-gradient-card backdrop-blur-sm border border-white/20 rounded-2xl p-5 hover:shadow-soft transition-all duration-300">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-primary">Today's Net</h4>
                      <p className="text-xs text-muted-foreground">Current performance</p>
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-primary">£{(todayEarnings - todayExpenses).toFixed(2)}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge className="bg-success/10 text-success text-xs">+12%</Badge>
                    <span className="text-xs text-muted-foreground">vs yesterday</span>
                  </div>
                </div>
              </div>

              {/* Hourly Rate */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-2xl blur-lg group-hover:blur-xl transition-all duration-300" />
                <div className="relative bg-gradient-card backdrop-blur-sm border border-white/20 rounded-2xl p-5 hover:shadow-soft transition-all duration-300">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                      <PoundSterling className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-primary">Hourly Rate</h4>
                      <p className="text-xs text-muted-foreground">Weekly average</p>
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-primary">£{weeklyHourlyRate.toFixed(2)}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge className="bg-success/10 text-success text-xs">+8%</Badge>
                    <span className="text-xs text-muted-foreground">vs last week</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Daily Hours Chart */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl blur-lg group-hover:blur-xl transition-all duration-300" />
              <div className="relative bg-gradient-card backdrop-blur-sm border border-white/20 rounded-2xl p-5 hover:shadow-soft transition-all duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-primary">Daily Hours</h4>
                    <p className="text-xs text-muted-foreground">This week</p>
                  </div>
                </div>
                
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dailyHoursData}>
                      <XAxis 
                        dataKey="day" 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                        interval={0}
                      />
                      <YAxis 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                        width={25}
                      />
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: 'none',
                          borderRadius: '12px',
                          boxShadow: 'var(--shadow-card)',
                          fontSize: '12px',
                          color: 'hsl(var(--card-foreground))'
                        }}
                        formatter={(value, name) => [
                          name === 'hours' ? `${value}h` : `£${value}`,
                          name === 'hours' ? 'Hours Worked' : 'Earnings'
                        ]}
                      />
                      <Bar 
                        dataKey="hours" 
                        fill="url(#barGradient)" 
                        radius={[6, 6, 0, 0]}
                      />
                      <defs>
                        <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#00B4DB" />
                          <stop offset="100%" stopColor="#0083B0" />
                        </linearGradient>
                      </defs>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Expense Breakdown */}
            {expenseBreakdown.length > 0 && (
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-2xl blur-lg group-hover:blur-xl transition-all duration-300" />
                <div className="relative bg-gradient-card backdrop-blur-sm border border-white/20 rounded-2xl p-5 hover:shadow-soft transition-all duration-300">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
                      <TrendingDown className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-primary">Expenses</h4>
                      <p className="text-xs text-muted-foreground">Weekly breakdown</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-center mb-4">
                    <div className="h-32 w-32">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={expenseBreakdown}
                            cx="50%"
                            cy="50%"
                            innerRadius={25}
                            outerRadius={60}
                            paddingAngle={2}
                            dataKey="value"
                          >
                            {expenseBreakdown.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    {expenseBreakdown.map((item, index) => (
                      <div key={item.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                          />
                          <span className="text-sm text-muted-foreground">{item.name}</span>
                        </div>
                        <span className="text-sm font-medium">£{item.value.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
      
      <MobileNavigation />
    </div>
  );
};

export default Dashboard;
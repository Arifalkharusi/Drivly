import { useDataStore } from "@/hooks/useDataStore";
import { Progress } from "@/components/ui/progress";
import GradientCard from "@/components/GradientCard";
import MobileNavigation from "@/components/MobileNavigation";
import { TrendingUp, TrendingDown, Target, DollarSign, BarChart3, Activity } from "lucide-react";
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
      {/* Header */}
      <div className="bg-gradient-primary text-white p-4 sm:p-6 pb-6 sm:pb-8">
        <div className="flex justify-between items-start sm:items-center mb-4 sm:mb-6">
          <div className="flex-1 min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold text-white truncate">Analytics Dashboard</h1>
            <p className="text-white/90 text-sm sm:text-base mt-1">Track your performance insights</p>
          </div>
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-full flex items-center justify-center ml-3 flex-shrink-0">
            <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
        </div>

        {/* This Week's Summary */}
        <GradientCard variant="card" className="bg-white/10 backdrop-blur-sm border-white/20">
          <div className="flex justify-between items-start sm:items-center mb-4 sm:mb-6">
            <div className="flex-1 min-w-0">
              <h2 className="text-lg sm:text-xl font-bold text-white">This Week's Performance</h2>
              <p className="text-white/70 text-xs sm:text-sm mt-1">
                Monday - {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-2xl flex items-center justify-center ml-3 flex-shrink-0">
              <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="bg-white/10 rounded-xl p-3 sm:p-4">
              <div className="flex items-center gap-2 sm:gap-3 mb-2">
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-success/20 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-success" />
                </div>
                <span className="text-white/80 text-xs sm:text-sm font-medium">Weekly Net</span>
              </div>
              <p className="text-xl sm:text-2xl font-bold text-white">${netIncome.toFixed(2)}</p>
              <p className="text-success text-xs">+12% vs last week</p>
            </div>
            
            <div className="bg-white/10 rounded-xl p-3 sm:p-4">
              <div className="flex items-center gap-2 sm:gap-3 mb-2">
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                  <Activity className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                </div>
                <span className="text-white/80 text-xs sm:text-sm font-medium">Total Trips</span>
              </div>
              <p className="text-xl sm:text-2xl font-bold text-white">{totalTrips}</p>
              <p className="text-white/60 text-xs">{totalHours.toFixed(1)} hours active</p>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            <div className="text-center">
              <p className="text-white/60 text-xs mb-1">Earnings</p>
              <p className="text-sm sm:text-lg font-semibold text-white">£{weeklyProgress.toFixed(2)}</p>
            </div>
            <div className="text-center">
              <p className="text-white/60 text-xs mb-1">Avg/Day</p>
              <p className="text-sm sm:text-lg font-semibold text-white">£{(weeklyProgress / 7).toFixed(2)}</p>
            </div>
            <div className="text-center">
              <p className="text-white/60 text-xs mb-1">Per Hour</p>
              <p className="text-sm sm:text-lg font-semibold text-white">£{weeklyHourlyRate.toFixed(2)}/h</p>
            </div>
          </div>
        </GradientCard>
      </div>

      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 mt-4 sm:mt-6">{/* Removed date filter - everything measures this week */}
        {/* Weekly Target Progress */}
        <GradientCard>
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-base sm:text-lg text-primary">Weekly Target</h3>
              <Target className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-xs sm:text-sm">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium">£{weeklyProgress} / £{weeklyTarget}</span>
              </div>
              <Progress value={progressPercentage} className="h-2.5 sm:h-3" />
              <p className="text-xs sm:text-sm text-muted-foreground">
                {progressPercentage.toFixed(1)}% complete • £{weeklyTarget - weeklyProgress} to go
              </p>
            </div>
          </div>
        </GradientCard>

        {/* Weekly Earnings vs Expenses Chart */}
        <GradientCard>
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-base sm:text-lg text-primary">Weekly Overview</h3>
              <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
            </div>
            
            <div className="h-40 sm:h-48 md:h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weeklyData}>
                  <defs>
                    <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#43CEA2" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#43CEA2" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#EF473A" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#EF473A" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
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
                    width={35}
                  />
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: 'none',
                      borderRadius: '12px',
                      boxShadow: 'var(--shadow-card)',
                      fontSize: '12px',
                      color: 'hsl(var(--card-foreground))'
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="earnings"
                    stroke="#43CEA2"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorEarnings)"
                  />
                  <Area
                    type="monotone"
                    dataKey="expenses"
                    stroke="#EF473A"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorExpenses)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </GradientCard>

        {/* Peak Hours This Week */}
        <GradientCard>
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-base sm:text-lg text-primary">Daily Hours This Week</h3>
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
            </div>
            
            <div className="h-32 sm:h-40 md:h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailyHoursData}>
                  <XAxis 
                    dataKey="day" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 9, fill: 'hsl(var(--muted-foreground))' }}
                    interval={0}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                    width={30}
                  />
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
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
                      name === 'hours' ? `${value}h` : `$${value}`,
                      name === 'hours' ? 'Hours Worked' : 'Earnings'
                    ]}
                  />
                  <Bar 
                    dataKey="hours" 
                    fill="#00B4DB" 
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </GradientCard>

        {/* Stats Cards and Expense Breakdown */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <GradientCard className="bg-gradient-secondary">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-success" />
                <span className="text-xs sm:text-sm font-medium">This Week</span>
              </div>
              <p className="text-xl sm:text-2xl font-bold">£{weeklyProgress}</p>
              <p className="text-xs sm:text-sm text-muted-foreground">+12% vs last week</p>
            </div>
          </GradientCard>

          <GradientCard className="bg-gradient-secondary">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <TrendingDown className="w-4 h-4 sm:w-5 sm:h-5 text-warning" />
                <span className="text-xs sm:text-sm font-medium">Expenses</span>
              </div>
              <p className="text-xl sm:text-2xl font-bold">£{weeklyExpenses.toFixed(2)}</p>
              <p className="text-xs sm:text-sm text-muted-foreground">-8% vs last week</p>
            </div>
          </GradientCard>
        </div>

        {/* Weekly Expense Breakdown */}
        <GradientCard>
          <div className="space-y-3 sm:space-y-4">
            <h3 className="font-semibold text-base sm:text-lg text-primary">Weekly Expense Breakdown</h3>
            
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="h-32 w-32 sm:h-40 sm:w-40 mx-auto sm:mx-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={expenseBreakdown}
                      cx="50%"
                      cy="50%"
                      innerRadius={30}
                      outerRadius={55}
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
              
              <div className="flex-1 space-y-2 sm:ml-4">
                {expenseBreakdown.map((item, index) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-xs sm:text-sm">{item.name}</span>
                    </div>
                    <span className="text-xs sm:text-sm font-medium">£{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </GradientCard>
      </div>

      <MobileNavigation />
    </div>
  );
};

export default Dashboard;
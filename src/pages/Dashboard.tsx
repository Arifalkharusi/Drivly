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

          {/* Performance Summary Bar */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4">
            <div className="grid grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-white/60 text-xs mb-1">Weekly Earnings</p>
                <p className="text-lg font-bold text-white">£{weeklyEarnings.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-white/60 text-xs mb-1">Avg/Day</p>
                <p className="text-lg font-bold text-white">£{(weeklyEarnings / 7).toFixed(2)}</p>
              </div>
              <div>
                <p className="text-white/60 text-xs mb-1">Per Hour</p>
                <p className="text-lg font-bold text-white">£{weeklyHourlyRate.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-white/60 text-xs mb-1">Target Progress</p>
                <p className="text-lg font-bold text-success">{progressPercentage.toFixed(1)}%</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 mt-4 sm:mt-6">
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
              <p className="text-xl sm:text-2xl font-bold">${weeklyProgress}</p>
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
            </div>
          </div>
        </GradientCard>
      </div>
      <MobileNavigation />
    </div>
  );
};

export default Dashboard;
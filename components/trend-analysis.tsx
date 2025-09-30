"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from "recharts"
import { TrendingUp, TrendingDown, Activity, Calendar, AlertTriangle, Download, RefreshCw } from "lucide-react"

// Generate historical data for the last 12 months
const generateHistoricalData = () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const baseData = [
    { hmpi: 45, lead: 0.008, mercury: 0.0008, cadmium: 0.002, arsenic: 0.007, chromium: 0.025 },
    { hmpi: 52, lead: 0.012, mercury: 0.0012, cadmium: 0.0025, arsenic: 0.009, chromium: 0.032 },
    { hmpi: 48, lead: 0.009, mercury: 0.0009, cadmium: 0.0022, arsenic: 0.008, chromium: 0.028 },
    { hmpi: 67, lead: 0.018, mercury: 0.0015, cadmium: 0.0035, arsenic: 0.012, chromium: 0.045 },
    { hmpi: 72, lead: 0.025, mercury: 0.0018, cadmium: 0.004, arsenic: 0.015, chromium: 0.055 },
    { hmpi: 79, lead: 0.032, mercury: 0.0022, cadmium: 0.0045, arsenic: 0.018, chromium: 0.068 },
    { hmpi: 85, lead: 0.045, mercury: 0.0028, cadmium: 0.005, arsenic: 0.022, chromium: 0.078 },
    { hmpi: 92, lead: 0.055, mercury: 0.0032, cadmium: 0.0058, arsenic: 0.025, chromium: 0.089 },
    { hmpi: 88, lead: 0.048, mercury: 0.0029, cadmium: 0.0052, arsenic: 0.023, chromium: 0.082 },
    { hmpi: 95, lead: 0.068, mercury: 0.0038, cadmium: 0.0065, arsenic: 0.028, chromium: 0.098 },
    { hmpi: 102, lead: 0.082, mercury: 0.0045, cadmium: 0.0078, arsenic: 0.032, chromium: 0.115 },
    { hmpi: 108, lead: 0.095, mercury: 0.0052, cadmium: 0.0085, arsenic: 0.035, chromium: 0.128 }
  ]

  return baseData.map((data, index) => ({
    month: months[index],
    ...data,
    temperature: 22 + Math.random() * 15,
    rainfall: Math.random() * 200,
    industrialActivity: 60 + Math.random() * 40
  }))
}

const seasonalData = [
  { season: 'Winter', avgHMPI: 65, samples: 156, alerts: 12 },
  { season: 'Spring', avgHMPI: 78, samples: 142, alerts: 28 },
  { season: 'Summer', avgHMPI: 95, samples: 189, alerts: 45 },
  { season: 'Monsoon', avgHMPI: 72, samples: 134, alerts: 18 }
]

export function TrendAnalysis() {
  const [timeRange, setTimeRange] = useState("12months")
  const [selectedMetal, setSelectedMetal] = useState("hmpi")
  const [historicalData, setHistoricalData] = useState(generateHistoricalData())
  const [isLoading, setIsLoading] = useState(false)

  const currentHMPI = historicalData[historicalData.length - 1]?.hmpi || 0
  const previousHMPI = historicalData[historicalData.length - 2]?.hmpi || 0
  const trend = currentHMPI - previousHMPI
  const trendPercentage = previousHMPI > 0 ? ((trend / previousHMPI) * 100) : 0

  const refreshData = async () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setHistoricalData(generateHistoricalData())
      setIsLoading(false)
    }, 1000)
  }

  const getMetalTrend = (metalKey: string) => {
    const current = historicalData[historicalData.length - 1]?.[metalKey as keyof typeof historicalData[0]] || 0
    const previous = historicalData[historicalData.length - 2]?.[metalKey as keyof typeof historicalData[0]] || 0
    return { current: Number(current), change: Number(current) - Number(previous) }
  }

  const metalTrends = [
    { name: 'Lead', key: 'lead', color: '#ef4444', limit: 0.01 },
    { name: 'Mercury', key: 'mercury', color: '#8b5cf6', limit: 0.001 },
    { name: 'Cadmium', key: 'cadmium', color: '#f59e0b', limit: 0.003 },
    { name: 'Arsenic', key: 'arsenic', color: '#10b981', limit: 0.01 },
    { name: 'Chromium', key: 'chromium', color: '#3b82f6', limit: 0.05 }
  ]

  return (
    <Card className="bg-card/80 backdrop-blur-sm border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Trend Analysis
            </CardTitle>
            <CardDescription>
              Historical pollution trends and seasonal patterns
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3months">3 Months</SelectItem>
                <SelectItem value="6months">6 Months</SelectItem>
                <SelectItem value="12months">12 Months</SelectItem>
                <SelectItem value="2years">2 Years</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" onClick={refreshData} disabled={isLoading}>
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="metals">Metals</TabsTrigger>
            <TabsTrigger value="seasonal">Seasonal</TabsTrigger>
            <TabsTrigger value="correlation">Correlation</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6 mt-6">
            {/* HMPI Trend Summary */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold">{currentHMPI.toFixed(1)}</div>
                <div className="text-sm text-muted-foreground">Current HMPI</div>
                <div className="flex items-center justify-center gap-1 mt-1">
                  {trend > 0 ? (
                    <TrendingUp className="h-3 w-3 text-red-500" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-green-500" />
                  )}
                  <span className={`text-xs ${trend > 0 ? 'text-red-500' : 'text-green-500'}`}>
                    {Math.abs(trendPercentage).toFixed(1)}%
                  </span>
                </div>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold">{Math.max(...historicalData.map(d => d.hmpi)).toFixed(1)}</div>
                <div className="text-sm text-muted-foreground">Peak HMPI</div>
                <div className="text-xs text-muted-foreground mt-1">Last 12 months</div>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold">{(historicalData.reduce((sum, d) => sum + d.hmpi, 0) / historicalData.length).toFixed(1)}</div>
                <div className="text-sm text-muted-foreground">Average HMPI</div>
                <div className="text-xs text-muted-foreground mt-1">12-month avg</div>
              </div>
            </div>

            {/* HMPI Trend Chart */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium">HMPI Trend Over Time</h4>
                <Badge variant={trend > 0 ? "destructive" : "default"}>
                  {trend > 0 ? "Increasing" : "Decreasing"} Pollution
                </Badge>
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={historicalData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--border))" />
                    <XAxis 
                      dataKey="month" 
                      tick={{ fontSize: 12, fill: 'rgb(var(--muted-foreground))' }}
                    />
                    <YAxis 
                      tick={{ fontSize: 12, fill: 'rgb(var(--muted-foreground))' }}
                      label={{ value: 'HMPI', angle: -90, position: 'insideLeft' }}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'rgb(var(--background))',
                        border: '1px solid rgb(var(--border))',
                        borderRadius: '6px'
                      }}
                      formatter={(value: any) => [value.toFixed(2), 'HMPI']}
                    />
                    <Area
                      type="monotone"
                      dataKey="hmpi"
                      stroke="#ef4444"
                      fill="#ef4444"
                      fillOpacity={0.3}
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Key Insights */}
            <div className="bg-muted/50 rounded-lg p-4">
              <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Key Insights
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-1.5" />
                    <div>
                      <p className="font-medium">Rising Pollution Trend</p>
                      <p className="text-xs text-muted-foreground">
                        HMPI increased by {trendPercentage.toFixed(1)}% over the last month
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-1.5" />
                    <div>
                      <p className="font-medium">Seasonal Variation</p>
                      <p className="text-xs text-muted-foreground">
                        Summer months show 35% higher pollution levels
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5" />
                    <div>
                      <p className="font-medium">Critical Threshold</p>
                      <p className="text-xs text-muted-foreground">
                        HMPI exceeded safe limits in 8 out of 12 months
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5" />
                    <div>
                      <p className="font-medium">Improvement Potential</p>
                      <p className="text-xs text-muted-foreground">
                        Monsoon period shows natural pollution reduction
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="metals" className="space-y-6 mt-6">
            {/* Metal Trends */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium">Individual Metal Trends</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {metalTrends.map((metal) => {
                  const trend = getMetalTrend(metal.key)
                  const isAboveLimit = trend.current > metal.limit
                  const percentOfLimit = (trend.current / metal.limit) * 100
                  
                  return (
                    <div key={metal.key} className="p-4 bg-muted/50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="text-sm font-medium">{metal.name}</h5>
                        <Badge variant={isAboveLimit ? "destructive" : "outline"} className="text-xs">
                          {percentOfLimit.toFixed(0)}% of limit
                        </Badge>
                      </div>
                      <div className="text-lg font-bold" style={{ color: metal.color }}>
                        {trend.current.toFixed(4)} mg/L
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        {trend.change > 0 ? (
                          <TrendingUp className="h-3 w-3 text-red-500" />
                        ) : (
                          <TrendingDown className="h-3 w-3 text-green-500" />
                        )}
                        <span className={`text-xs ${trend.change > 0 ? 'text-red-500' : 'text-green-500'}`}>
                          {Math.abs(trend.change).toFixed(4)} mg/L
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Limit: {metal.limit} mg/L
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Multi-Metal Trend Chart */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium">Comparative Metal Trends</h4>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={historicalData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--border))" />
                    <XAxis 
                      dataKey="month"
                      tick={{ fontSize: 12, fill: 'rgb(var(--muted-foreground))' }}
                    />
                    <YAxis 
                      tick={{ fontSize: 12, fill: 'rgb(var(--muted-foreground))' }}
                      label={{ value: 'Concentration (mg/L)', angle: -90, position: 'insideLeft' }}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'rgb(var(--background))',
                        border: '1px solid rgb(var(--border))',
                        borderRadius: '6px'
                      }}
                    />
                    {metalTrends.map((metal) => (
                      <Line
                        key={metal.key}
                        type="monotone"
                        dataKey={metal.key}
                        stroke={metal.color}
                        strokeWidth={2}
                        dot={{ r: 3 }}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="seasonal" className="space-y-6 mt-6">
            {/* Seasonal Analysis */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium">Seasonal Pollution Patterns</h4>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={seasonalData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--border))" />
                    <XAxis 
                      dataKey="season"
                      tick={{ fontSize: 12, fill: 'rgb(var(--muted-foreground))' }}
                    />
                    <YAxis 
                      tick={{ fontSize: 12, fill: 'rgb(var(--muted-foreground))' }}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'rgb(var(--background))',
                        border: '1px solid rgb(var(--border))',
                        borderRadius: '6px'
                      }}
                    />
                    <Bar dataKey="avgHMPI" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Seasonal Insights */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {seasonalData.map((season) => (
                <div key={season.season} className="p-4 bg-muted/50 rounded-lg text-center">
                  <h5 className="text-sm font-medium">{season.season}</h5>
                  <div className="text-2xl font-bold mt-2">{season.avgHMPI}</div>
                  <div className="text-xs text-muted-foreground">Avg HMPI</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {season.samples} samples • {season.alerts} alerts
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="correlation" className="space-y-6 mt-6">
            {/* Environmental Correlation */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium">Environmental Factor Correlation</h4>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={historicalData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--border))" />
                    <XAxis 
                      dataKey="month"
                      tick={{ fontSize: 12, fill: 'rgb(var(--muted-foreground))' }}
                    />
                    <YAxis 
                      yAxisId="left"
                      tick={{ fontSize: 12, fill: 'rgb(var(--muted-foreground))' }}
                      label={{ value: 'HMPI', angle: -90, position: 'insideLeft' }}
                    />
                    <YAxis 
                      yAxisId="right" 
                      orientation="right"
                      tick={{ fontSize: 12, fill: 'rgb(var(--muted-foreground))' }}
                      label={{ value: 'Temperature (°C)', angle: 90, position: 'insideRight' }}
                    />
                    <Tooltip />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="hmpi"
                      stroke="#ef4444"
                      strokeWidth={2}
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="temperature"
                      stroke="#f59e0b"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Correlation Factors */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-muted/50 rounded-lg">
                <h5 className="text-sm font-medium mb-2">Temperature Impact</h5>
                <div className="text-lg font-bold text-orange-500">+0.74</div>
                <div className="text-xs text-muted-foreground">
                  Strong positive correlation with HMPI
                </div>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <h5 className="text-sm font-medium mb-2">Rainfall Effect</h5>
                <div className="text-lg font-bold text-blue-500">-0.62</div>
                <div className="text-xs text-muted-foreground">
                  Moderate negative correlation (dilution effect)
                </div>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <h5 className="text-sm font-medium mb-2">Industrial Activity</h5>
                <div className="text-lg font-bold text-red-500">+0.89</div>
                <div className="text-xs text-muted-foreground">
                  Very strong positive correlation
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-4 border-t">
          <Button className="flex-1">
            <Download className="h-4 w-4 mr-2" />
            Export Trend Report
          </Button>
          <Button variant="outline" className="flex-1">
            <Calendar className="h-4 w-4 mr-2" />
            Schedule Analysis
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
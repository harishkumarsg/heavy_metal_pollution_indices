"use client"

import { useState, useEffect, memo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from "recharts"
import { 
  MapPin, 
  Clock, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Download, 
  Share2, 
  Bell, 
  Calendar,
  Droplets,
  Thermometer,
  Wind,
  Eye,
  X
} from "lucide-react"

interface SiteDetailsProps {
  site: {
    id: string
    name: string
    location: string
    coordinates: [number, number]
    hmpi: number
    status: 'excellent' | 'good' | 'moderate' | 'poor'
    lastUpdate: Date
  }
  onClose: () => void
}

export const SiteDetails = memo(function SiteDetails({ site, onClose }: SiteDetailsProps) {
  const [historicalData, setHistoricalData] = useState<any[]>([])
  const [metalData, setMetalData] = useState<any[]>([])
  const [environmentalData, setEnvironmentalData] = useState<any>({})
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate data loading
    setTimeout(() => {
      // Generate historical HMPI data (last 30 days)
      const historical = Array.from({ length: 30 }, (_, i) => {
        const date = new Date()
        date.setDate(date.getDate() - (29 - i))
        return {
          date: date.toISOString().split('T')[0],
          hmpi: 1.5 + Math.random() * 2.5,
          ph: 6.8 + Math.random() * 1.4,
          temperature: 22 + Math.random() * 8,
          turbidity: 5 + Math.random() * 15
        }
      })
      
      // Generate metal concentration data
      const metals = [
        { name: 'Lead (Pb)', current: 0.012, limit: 0.010, unit: 'mg/L', trend: 5.2 },
        { name: 'Cadmium (Cd)', current: 0.003, limit: 0.005, unit: 'mg/L', trend: -2.1 },
        { name: 'Mercury (Hg)', current: 0.001, limit: 0.001, unit: 'mg/L', trend: 8.7 },
        { name: 'Arsenic (As)', current: 0.008, limit: 0.010, unit: 'mg/L', trend: 1.3 },
        { name: 'Chromium (Cr)', current: 0.045, limit: 0.050, unit: 'mg/L', trend: -0.5 }
      ]
      
      // Environmental conditions
      const environmental = {
        temperature: 26.5,
        humidity: 68,
        windSpeed: 12.3,
        pressure: 1013.2,
        precipitation: 2.1,
        visibility: 15.2
      }
      
      setHistoricalData(historical)
      setMetalData(metals)
      setEnvironmentalData(environmental)
      setIsLoading(false)
    }, 1000)
  }, [site.id])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-green-600 bg-green-50 border-green-200'
      case 'good': return 'text-blue-600 bg-blue-50 border-blue-200'
      case 'moderate': return 'text-orange-600 bg-orange-50 border-orange-200'
      case 'poor': return 'text-red-600 bg-red-50 border-red-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getMetalStatus = (current: number, limit: number) => {
    const ratio = current / limit
    if (ratio > 1) return { status: 'Exceeds', color: 'destructive' }
    if (ratio > 0.8) return { status: 'High', color: 'secondary' }
    if (ratio > 0.5) return { status: 'Moderate', color: 'outline' }
    return { status: 'Low', color: 'outline' }
  }

  if (isLoading) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="h-6 bg-gray-200 rounded animate-pulse w-48" />
              <div className="h-4 bg-gray-200 rounded animate-pulse w-32" />
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="h-32 bg-gray-200 rounded animate-pulse" />
            <div className="grid grid-cols-3 gap-4">
              <div className="h-24 bg-gray-200 rounded animate-pulse" />
              <div className="h-24 bg-gray-200 rounded animate-pulse" />
              <div className="h-24 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <CardTitle className="text-xl">{site.name}</CardTitle>
              <Badge className={getStatusColor(site.status)}>
                {site.status}
              </Badge>
            </div>
            <CardDescription className="flex items-center gap-4">
              <span>{site.location}</span>
              <span>•</span>
              <span>HMPI: {site.hmpi.toFixed(2)}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Updated {site.lastUpdate.toLocaleTimeString()}
              </span>
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Bell className="h-4 w-4 mr-2" />
              Alerts
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="metals">Metal Analysis</TabsTrigger>
            <TabsTrigger value="environment">Environment</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6 mt-6">
            {/* Current Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium">HMPI Level</CardTitle>
                    <Activity className="h-4 w-4 text-muted-foreground" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{site.hmpi.toFixed(2)}</div>
                  <Progress value={(site.hmpi / 5) * 100} className="mt-2" />
                  <div className="flex items-center gap-1 mt-2">
                    <TrendingUp className="h-3 w-3 text-green-500" />
                    <span className="text-xs text-muted-foreground">
                      2.3% improvement this week
                    </span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium">Risk Level</CardTitle>
                    <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold capitalize">{site.status}</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {site.status === 'poor' ? 'Requires attention' :
                     site.status === 'moderate' ? 'Monitor closely' :
                     site.status === 'good' ? 'Acceptable levels' : 'Optimal conditions'}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium">Data Quality</CardTitle>
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">98.5%</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Last 24 hours
                  </div>
                  <div className="flex items-center gap-1 mt-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span className="text-xs text-muted-foreground">
                      Real-time monitoring active
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Quick Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <div className="text-sm font-medium">Temperature</div>
                <div className="flex items-center gap-2">
                  <Thermometer className="h-4 w-4 text-orange-500" />
                  <span className="text-lg font-semibold">{environmentalData.temperature}°C</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="text-sm font-medium">pH Level</div>
                <div className="flex items-center gap-2">
                  <Droplets className="h-4 w-4 text-blue-500" />
                  <span className="text-lg font-semibold">
                    {historicalData[historicalData.length - 1]?.ph.toFixed(1)}
                  </span>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="text-sm font-medium">Wind Speed</div>
                <div className="flex items-center gap-2">
                  <Wind className="h-4 w-4 text-gray-500" />
                  <span className="text-lg font-semibold">{environmentalData.windSpeed} km/h</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="text-sm font-medium">Visibility</div>
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-green-500" />
                  <span className="text-lg font-semibold">{environmentalData.visibility} km</span>
                </div>
              </div>
            </div>
            
            {/* Recent Alerts */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Alerts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3 p-3 border rounded">
                  <AlertTriangle className="h-4 w-4 text-orange-500 mt-0.5" />
                  <div className="flex-1">
                    <div className="text-sm font-medium">Lead levels approaching threshold</div>
                    <div className="text-xs text-muted-foreground">
                      Current: 0.012 mg/L (Limit: 0.010 mg/L) • 2 hours ago
                    </div>
                  </div>
                  <Badge variant="secondary">Active</Badge>
                </div>
                
                <div className="flex items-start gap-3 p-3 border rounded">
                  <TrendingUp className="h-4 w-4 text-green-500 mt-0.5" />
                  <div className="flex-1">
                    <div className="text-sm font-medium">Water quality improvement detected</div>
                    <div className="text-xs text-muted-foreground">
                      HMPI decreased from 2.8 to 2.1 • 1 day ago
                    </div>
                  </div>
                  <Badge variant="outline">Resolved</Badge>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="trends" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>HMPI Trend (30 Days)</CardTitle>
                <CardDescription>
                  Historical Heavy Metal Pollution Index values
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={historicalData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip 
                      labelFormatter={(value) => new Date(value).toLocaleDateString()}
                      formatter={(value: any) => [value.toFixed(2), 'HMPI']}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="hmpi" 
                      stroke="#8884d8" 
                      strokeWidth={2}
                      dot={{ r: 3 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>pH Levels</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <AreaChart data={historicalData.slice(-14)}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="date" 
                        tick={{ fontSize: 10 }}
                        tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      />
                      <YAxis domain={[6, 8]} tick={{ fontSize: 10 }} />
                      <Tooltip 
                        labelFormatter={(value) => new Date(value).toLocaleDateString()}
                        formatter={(value: any) => [value.toFixed(1), 'pH']}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="ph" 
                        stroke="#82ca9d" 
                        fill="#82ca9d" 
                        fillOpacity={0.3}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Temperature</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <AreaChart data={historicalData.slice(-14)}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="date" 
                        tick={{ fontSize: 10 }}
                        tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      />
                      <YAxis tick={{ fontSize: 10 }} />
                      <Tooltip 
                        labelFormatter={(value) => new Date(value).toLocaleDateString()}
                        formatter={(value: any) => [value.toFixed(1) + '°C', 'Temperature']}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="temperature" 
                        stroke="#ff7c7c" 
                        fill="#ff7c7c" 
                        fillOpacity={0.3}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="metals" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Metal Concentration Analysis</CardTitle>
                <CardDescription>
                  Current levels compared to safety limits
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {metalData.map((metal, index) => {
                    const metalStatus = getMetalStatus(metal.current, metal.limit)
                    const percentage = (metal.current / metal.limit) * 100
                    
                    return (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="text-sm font-medium">{metal.name}</div>
                            <Badge variant={metalStatus.color as any} className="text-xs">
                              {metalStatus.status}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <span>{metal.current.toFixed(3)} {metal.unit}</span>
                            <span className="text-muted-foreground">/</span>
                            <span className="text-muted-foreground">{metal.limit.toFixed(3)} {metal.unit}</span>
                            <div className="flex items-center gap-1">
                              {metal.trend > 0 ? (
                                <TrendingUp className="h-3 w-3 text-red-500" />
                              ) : (
                                <TrendingDown className="h-3 w-3 text-green-500" />
                              )}
                              <span className="text-xs">{Math.abs(metal.trend).toFixed(1)}%</span>
                            </div>
                          </div>
                        </div>
                        <Progress 
                          value={Math.min(percentage, 100)} 
                          className="h-2"
                        />
                        <div className="text-xs text-muted-foreground">
                          {percentage.toFixed(1)}% of safety limit
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Metal Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={metalData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fontSize: 10 }}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip 
                      formatter={(value: any, name: string) => [
                        `${value.toFixed(3)} mg/L`,
                        name === 'current' ? 'Current Level' : 'Safety Limit'
                      ]}
                    />
                    <Bar dataKey="current" fill="#8884d8" name="current" />
                    <Bar dataKey="limit" fill="#82ca9d" name="limit" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="environment" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Thermometer className="h-4 w-4" />
                    Temperature
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{environmentalData.temperature}°C</div>
                  <div className="text-sm text-muted-foreground">Optimal range: 20-30°C</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Droplets className="h-4 w-4" />
                    Humidity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{environmentalData.humidity}%</div>
                  <div className="text-sm text-muted-foreground">Normal levels</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Wind className="h-4 w-4" />
                    Wind Speed
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{environmentalData.windSpeed} km/h</div>
                  <div className="text-sm text-muted-foreground">Light breeze</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Activity className="h-4 w-4" />
                    Pressure
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{environmentalData.pressure} hPa</div>
                  <div className="text-sm text-muted-foreground">Standard pressure</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Precipitation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{environmentalData.precipitation} mm</div>
                  <div className="text-sm text-muted-foreground">Last 24 hours</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    Visibility
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{environmentalData.visibility} km</div>
                  <div className="text-sm text-muted-foreground">Clear conditions</div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Environmental Impact Assessment</CardTitle>
                <CardDescription>
                  How environmental factors may affect pollution levels
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Wind Dispersion Effect</div>
                    <Progress value={75} className="h-2" />
                    <div className="text-xs text-muted-foreground">
                      Moderate wind helps disperse pollutants
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Temperature Impact</div>
                    <Progress value={60} className="h-2" />
                    <div className="text-xs text-muted-foreground">
                      Current temperature may increase reaction rates
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Precipitation Dilution</div>
                    <Progress value={40} className="h-2" />
                    <div className="text-xs text-muted-foreground">
                      Low precipitation provides minimal dilution
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Atmospheric Pressure</div>
                    <Progress value={85} className="h-2" />
                    <div className="text-xs text-muted-foreground">
                      Normal pressure conditions
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
})
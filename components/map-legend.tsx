"use client"

import { useState, useEffect, memo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Info, AlertTriangle, CheckCircle, Clock, TrendingUp, Activity, Zap, Shield } from "lucide-react"

export const MapLegend = memo(function MapLegend() {
  const [realTimeData, setRealTimeData] = useState({
    totalSites: 42,
    activeSites: 38,
    alertCount: 3,
    avgHMPI: 2.1,
    lastUpdate: new Date()
  })

  const [isConnected, setIsConnected] = useState(true)

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setRealTimeData(prev => ({
        ...prev,
        activeSites: 35 + Math.floor(Math.random() * 8),
        alertCount: Math.floor(Math.random() * 6),
        avgHMPI: 1.5 + Math.random() * 2,
        lastUpdate: new Date()
      }))
    }, 3000)

    // Simulate connection status
    const connectionInterval = setInterval(() => {
      setIsConnected(prev => Math.random() > 0.1 ? true : prev)
    }, 10000)

    return () => {
      clearInterval(interval)
      clearInterval(connectionInterval)
    }
  }, [])

  const statusItems = [
    {
      status: "Excellent",
      color: "#10b981",
      icon: CheckCircle,
      range: "HMPI: 0-1",
      description: "Very low pollution",
      count: 12
    },
    {
      status: "Good", 
      color: "#3b82f6",
      icon: Info,
      range: "HMPI: 1-2",
      description: "Low pollution",
      count: 18
    },
    {
      status: "Moderate",
      color: "#f59e0b", 
      icon: Clock,
      range: "HMPI: 2-3",
      description: "Moderate pollution",
      count: 9
    },
    {
      status: "Poor",
      color: "#ef4444",
      icon: AlertTriangle,
      range: "HMPI: 3+",
      description: "High pollution",
      count: 3
    }
  ]

  const metalTypes = [
    { name: "Lead (Pb)", symbol: "Pb", status: "elevated", trend: "up" },
    { name: "Cadmium (Cd)", symbol: "Cd", status: "normal", trend: "stable" },
    { name: "Mercury (Hg)", symbol: "Hg", status: "high", trend: "down" },
    { name: "Arsenic (As)", symbol: "As", status: "normal", trend: "up" },
    { name: "Chromium (Cr)", symbol: "Cr", status: "elevated", trend: "stable" }
  ]

  return (
    <Card className="bg-card/80 backdrop-blur-sm border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Monitoring Dashboard
          <div className="flex items-center gap-1 ml-auto">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-xs text-muted-foreground">
              {isConnected ? 'Live' : 'Offline'}
            </span>
          </div>
        </CardTitle>
        <CardDescription>
          Real-time pollution monitoring and analysis
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="legend" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="legend">Legend</TabsTrigger>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="metals">Metals</TabsTrigger>
          </TabsList>
          
          <TabsContent value="legend" className="space-y-3 mt-4">
            <div className="text-sm font-medium mb-2">HMPI Classification</div>
            {statusItems.map((item) => {
              const Icon = item.icon
              return (
                <div key={item.status} className="flex items-center gap-3">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <Icon className="h-4 w-4" style={{ color: item.color }} />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">
                        {item.status}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {item.count} sites
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-muted-foreground">
                        {item.range}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {item.description}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </TabsContent>
          
          <TabsContent value="overview" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium">Active Sites</span>
                </div>
                <div className="text-2xl font-bold">
                  {realTimeData.activeSites}/{realTimeData.totalSites}
                </div>
                <Progress value={(realTimeData.activeSites / realTimeData.totalSites) * 100} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-orange-500" />
                  <span className="text-sm font-medium">Alerts</span>
                </div>
                <div className="text-2xl font-bold text-orange-500">
                  {realTimeData.alertCount}
                </div>
                <div className="text-xs text-muted-foreground">
                  Active warnings
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium">Average HMPI</span>
              </div>
              <div className="text-2xl font-bold">
                {realTimeData.avgHMPI.toFixed(2)}
              </div>
              <Progress value={(realTimeData.avgHMPI / 5) * 100} className="h-2" />
            </div>
            
            <div className="text-xs text-muted-foreground text-center pt-2 border-t">
              Last updated: {realTimeData.lastUpdate.toLocaleTimeString()}
            </div>
          </TabsContent>
          
          <TabsContent value="metals" className="space-y-3 mt-4">
            <div className="text-sm font-medium mb-2">Metal Concentrations</div>
            {metalTypes.map((metal) => (
              <div key={metal.symbol} className="flex items-center justify-between p-2 rounded border">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${
                    metal.status === 'high' ? 'bg-red-500' :
                    metal.status === 'elevated' ? 'bg-orange-500' : 'bg-green-500'
                  }`} />
                  <div>
                    <div className="text-sm font-medium">{metal.symbol}</div>
                    <div className="text-xs text-muted-foreground">{metal.name}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={
                    metal.status === 'high' ? 'destructive' :
                    metal.status === 'elevated' ? 'secondary' : 'outline'
                  } className="text-xs">
                    {metal.status}
                  </Badge>
                  <TrendingUp className={`h-3 w-3 ${
                    metal.trend === 'up' ? 'text-red-500' :
                    metal.trend === 'down' ? 'text-green-500' : 'text-gray-500'
                  } ${metal.trend === 'down' ? 'rotate-180' : ''}`} />
                </div>
              </div>
            ))}
            
            <Button variant="outline" className="w-full mt-4" size="sm">
              <Zap className="h-4 w-4 mr-2" />
              View Detailed Analysis
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
})

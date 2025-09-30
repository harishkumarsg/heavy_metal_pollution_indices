"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Settings, Filter, RefreshCw, Download, AlertTriangle, TrendingUp, Activity } from "lucide-react"

export function MapControls() {
  const [showHeatmap, setShowHeatmap] = useState(true)
  const [showSites, setShowSites] = useState(true)
  const [showZones, setShowZones] = useState(true)
  const [opacity, setOpacity] = useState([70])
  const [timeRange, setTimeRange] = useState("24h")
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [refreshInterval, setRefreshInterval] = useState(5)
  const [selectedMetals, setSelectedMetals] = useState<string[]>(['all'])
  const [statusFilter, setStatusFilter] = useState<string[]>(['critical', 'moderate', 'safe'])
  const [hmpiRange, setHmpiRange] = useState([0, 100])
  const [alertsOnly, setAlertsOnly] = useState(false)
  const [lastRefresh, setLastRefresh] = useState(new Date())

  // Simulate real-time refresh counter
  useEffect(() => {
    if (!autoRefresh) return
    
    const interval = setInterval(() => {
      setLastRefresh(new Date())
    }, refreshInterval * 1000)

    return () => clearInterval(interval)
  }, [autoRefresh, refreshInterval])

  return (
    <Card className="bg-card/80 backdrop-blur-sm border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Map Controls
          {autoRefresh && (
            <Badge variant="outline" className="text-xs animate-pulse">
              <Activity className="h-3 w-3 mr-1" />
              Live
            </Badge>
          )}
        </CardTitle>
        <CardDescription>Customize display and real-time filtering</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="display" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="display">Display</TabsTrigger>
            <TabsTrigger value="filters">Filters</TabsTrigger>
            <TabsTrigger value="realtime">Real-time</TabsTrigger>
          </TabsList>

          {/* Display Settings */}
          <TabsContent value="display" className="space-y-4">
            {/* Layer Controls */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium">Map Layers</h4>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="heatmap" className="text-sm flex items-center gap-2">
                    <div className="w-3 h-3 bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 rounded"></div>
                    Pollution Heatmap
                  </Label>
                  <Switch id="heatmap" checked={showHeatmap} onCheckedChange={setShowHeatmap} />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="sites" className="text-sm flex items-center gap-2">
                    <div className="w-3 h-3 bg-primary rounded-full"></div>
                    Monitoring Sites
                  </Label>
                  <Switch id="sites" checked={showSites} onCheckedChange={setShowSites} />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="zones" className="text-sm flex items-center gap-2">
                    <AlertTriangle className="h-3 w-3" />
                    Safety Zones
                  </Label>
                  <Switch id="zones" checked={showZones} onCheckedChange={setShowZones} />
                </div>
              </div>
            </div>

            {/* Opacity Control */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Heatmap Intensity</Label>
              <Slider 
                value={opacity} 
                onValueChange={setOpacity} 
                max={100} 
                step={5} 
                className="w-full" 
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Transparent</span>
                <span className="font-medium">{opacity[0]}%</span>
                <span>Opaque</span>
              </div>
            </div>
          </TabsContent>

          {/* Advanced Filters */}
          <TabsContent value="filters" className="space-y-4">
            {/* Status Filter */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Pollution Status</Label>
              <div className="space-y-2">
                {[
                  { id: 'critical', label: 'Critical (> 75)', color: 'bg-red-500', count: 3 },
                  { id: 'moderate', label: 'Moderate (50-75)', color: 'bg-yellow-500', count: 4 },
                  { id: 'safe', label: 'Safe (< 50)', color: 'bg-green-500', count: 1 }
                ].map((status) => (
                  <div key={status.id} className="flex items-center gap-2">
                    <Checkbox 
                      id={status.id}
                      checked={statusFilter.includes(status.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setStatusFilter([...statusFilter, status.id])
                        } else {
                          setStatusFilter(statusFilter.filter(s => s !== status.id))
                        }
                      }}
                    />
                    <Label htmlFor={status.id} className="text-sm flex items-center gap-2 flex-1">
                      <div className={`w-3 h-3 ${status.color} rounded-full`}></div>
                      <span className="flex-1">{status.label}</span>
                      <Badge variant="outline" className="text-xs">{status.count}</Badge>
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* HMPI Range Filter */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">HMPI Range</Label>
              <Slider 
                value={hmpiRange} 
                onValueChange={setHmpiRange} 
                max={100} 
                step={1}
                className="w-full" 
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{hmpiRange[0]}</span>
                <span className="font-medium">{hmpiRange[0]} - {hmpiRange[1]}</span>
                <span>{hmpiRange[1]}</span>
              </div>
            </div>

            {/* Metal Type Filter */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Heavy Metals</Label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {['Lead', 'Mercury', 'Cadmium', 'Arsenic', 'Chromium', 'Copper'].map((metal) => (
                  <div key={metal} className="flex items-center gap-2">
                    <Checkbox 
                      id={metal.toLowerCase()}
                      checked={selectedMetals.includes(metal.toLowerCase()) || selectedMetals.includes('all')}
                      onCheckedChange={(checked) => {
                        if (checked && !selectedMetals.includes('all')) {
                          setSelectedMetals([...selectedMetals.filter(m => m !== 'all'), metal.toLowerCase()])
                        } else {
                          setSelectedMetals(selectedMetals.filter(m => m !== metal.toLowerCase()))
                        }
                      }}
                    />
                    <Label htmlFor={metal.toLowerCase()} className="text-xs">{metal}</Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Special Filters */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Checkbox 
                  id="alerts-only"
                  checked={alertsOnly}
                  onCheckedChange={(checked) => setAlertsOnly(checked === true)}
                />
                <Label htmlFor="alerts-only" className="text-sm flex items-center gap-2">
                  <AlertTriangle className="h-3 w-3 text-red-500" />
                  Active Alerts Only
                </Label>
              </div>
            </div>
          </TabsContent>

          {/* Real-time Settings */}
          <TabsContent value="realtime" className="space-y-4">
            {/* Auto Refresh */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="auto-refresh" className="text-sm font-medium flex items-center gap-2">
                  <RefreshCw className={`h-3 w-3 ${autoRefresh ? 'animate-spin' : ''}`} />
                  Auto Refresh
                </Label>
                <Switch 
                  id="auto-refresh" 
                  checked={autoRefresh} 
                  onCheckedChange={setAutoRefresh} 
                />
              </div>
              
              {autoRefresh && (
                <div className="space-y-2">
                  <Label className="text-sm">Refresh Interval</Label>
                  <Select value={refreshInterval.toString()} onValueChange={(value) => setRefreshInterval(Number(value))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 second</SelectItem>
                      <SelectItem value="5">5 seconds</SelectItem>
                      <SelectItem value="10">10 seconds</SelectItem>
                      <SelectItem value="30">30 seconds</SelectItem>
                      <SelectItem value="60">1 minute</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            {/* Time Range */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Data Time Range</Label>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5m">Last 5 minutes</SelectItem>
                  <SelectItem value="1h">Last Hour</SelectItem>
                  <SelectItem value="24h">Last 24 Hours</SelectItem>
                  <SelectItem value="7d">Last 7 Days</SelectItem>
                  <SelectItem value="30d">Last 30 Days</SelectItem>
                  <SelectItem value="all">All Time</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Connection Status */}
            <div className="bg-muted/50 rounded-lg p-3 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">Connection Status</span>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-green-600">Connected</span>
                </div>
              </div>
              <div className="text-xs text-muted-foreground">
                Last update: {lastRefresh.toLocaleTimeString()}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="mt-6 space-y-2">
          <Button className="w-full" variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Apply All Filters
          </Button>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" size="sm" className="bg-transparent">
              <RefreshCw className="h-4 w-4 mr-1" />
              Refresh
            </Button>
            <Button variant="outline" size="sm" className="bg-transparent">
              Reset
            </Button>
          </div>
          <Button variant="outline" size="sm" className="w-full bg-transparent">
            <Download className="h-4 w-4 mr-2" />
            Export Filtered Data
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

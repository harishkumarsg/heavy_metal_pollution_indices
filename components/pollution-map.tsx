"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, Maximize2, RefreshCw, Layers, ZoomIn, ZoomOut, Search, Filter, AlertTriangle, TrendingUp, Download, MoreVertical } from "lucide-react"
import { SiteDetails } from "./site-details"
import { RealMap } from "./real-map"

// Enhanced pollution data points with more comprehensive information
const pollutionSites = [
  {
    id: 1,
    name: "Delhi Yamuna",
    location: "Yamuna River, Delhi",
    lat: 28.6139,
    lng: 77.209,
    hmpi: 85.2,
    status: "critical",
    lastUpdated: "2 min ago",
    metals: ["Lead", "Mercury", "Cadmium"],
    trend: "increasing",
    temperature: 24.5,
    pH: 7.2,
    conductivity: 1250,
    samples: 156,
    alerts: 3,
    reportCount: 24
  },
  {
    id: 2,
    name: "Mumbai Mithi River",
    location: "Mithi River, Mumbai",
    lat: 19.076,
    lng: 72.8777,
    hmpi: 64.7,
    status: "moderate",
    lastUpdated: "5 min ago",
    metals: ["Mercury", "Arsenic"],
    trend: "stable",
    temperature: 28.1,
    pH: 6.8,
    conductivity: 980,
    samples: 89,
    alerts: 1,
    reportCount: 12
  },
  {
    id: 3,
    name: "Kolkata Hooghly",
    location: "Hooghly River, Kolkata",
    lat: 22.5726,
    lng: 88.3639,
    hmpi: 78.1,
    status: "critical",
    lastUpdated: "8 min ago",
    metals: ["Lead", "Chromium"],
    trend: "increasing",
    temperature: 26.8,
    pH: 7.5,
    conductivity: 1420,
    samples: 142,
    alerts: 2,
    reportCount: 18
  },
  {
    id: 4,
    name: "Chennai Marina",
    location: "Marina Beach, Chennai",
    lat: 13.0827,
    lng: 80.2707,
    hmpi: 42.1,
    status: "safe",
    lastUpdated: "12 min ago",
    metals: [],
    trend: "stable",
    temperature: 29.2,
    pH: 7.8,
    conductivity: 650,
    samples: 67,
    alerts: 0,
    reportCount: 5
  },
  {
    id: 5,
    name: "Bangalore Bellandur",
    location: "Bellandur Lake, Bangalore",
    lat: 12.9716,
    lng: 77.5946,
    hmpi: 52.3,
    status: "moderate",
    lastUpdated: "15 min ago",
    metals: ["Copper"],
    trend: "decreasing",
    temperature: 22.7,
    pH: 6.9,
    conductivity: 820,
    samples: 78,
    alerts: 0,
    reportCount: 8
  },
  {
    id: 6,
    name: "Hyderabad Hussain Sagar",
    location: "Hussain Sagar Lake, Hyderabad",
    lat: 17.385,
    lng: 78.4867,
    hmpi: 68.9,
    status: "moderate",
    lastUpdated: "18 min ago",
    metals: ["Lead", "Zinc"],
    trend: "stable",
    temperature: 25.4,
    pH: 7.1,
    conductivity: 1100,
    samples: 95,
    alerts: 1,
    reportCount: 11
  },
  {
    id: 7,
    name: "Pune Mula-Mutha",
    location: "Mula-Mutha River, Pune",
    lat: 18.5204,
    lng: 73.8567,
    hmpi: 59.3,
    status: "moderate",
    lastUpdated: "22 min ago",
    metals: ["Copper", "Zinc"],
    trend: "stable",
    temperature: 26.1,
    pH: 7.0,
    conductivity: 890,
    samples: 72,
    alerts: 0,
    reportCount: 9
  },
  {
    id: 8,
    name: "Ahmedabad Sabarmati",
    location: "Sabarmati River, Ahmedabad",
    lat: 23.0225,
    lng: 72.5714,
    hmpi: 71.2,
    status: "moderate",
    lastUpdated: "25 min ago",
    metals: ["Lead", "Mercury"],
    trend: "increasing",
    temperature: 27.8,
    pH: 6.7,
    conductivity: 1050,
    samples: 83,
    alerts: 1,
    reportCount: 13
  }
]

export function PollutionMap() {
  const [selectedSite, setSelectedSite] = useState<(typeof pollutionSites)[0] | null>(null)
  const [showSiteDetails, setShowSiteDetails] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [zoomLevel, setZoomLevel] = useState(1)
  const [mapView, setMapView] = useState<'satellite' | 'terrain' | 'political'>('terrain')
  const [showHeatmap, setShowHeatmap] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [lastUpdate, setLastUpdate] = useState(new Date())
  const [isConnected, setIsConnected] = useState(true)
  const [realtimeData, setRealtimeData] = useState(pollutionSites)
  const [notifications, setNotifications] = useState<Array<{id: string, message: string, type: 'alert' | 'update' | 'info', timestamp: Date}>>([])

  // Simulate real-time WebSocket connection
  useEffect(() => {
    const simulateWebSocket = () => {
      // Simulate connection status changes
      const connectionInterval = setInterval(() => {
        setIsConnected(prev => {
          // Occasionally simulate connection issues
          if (Math.random() < 0.05) { // 5% chance of disconnection
            setTimeout(() => setIsConnected(true), 2000) // Reconnect after 2 seconds
            return false
          }
          return true
        })
      }, 10000)

      // Simulate real-time data updates
      const dataInterval = setInterval(() => {
        setRealtimeData(prevSites => {
          return prevSites.map(site => {
            // Random chance for each site to update
            if (Math.random() < 0.3) { // 30% chance per update cycle
              const hmpiChange = (Math.random() - 0.5) * 2 // -1 to +1 change
              const newHmpi = Math.max(0, Math.min(100, site.hmpi + hmpiChange))
              
              // Determine new status based on HMPI
              let newStatus = site.status
              if (newHmpi > 75) newStatus = 'critical'
              else if (newHmpi > 50) newStatus = 'moderate'
              else newStatus = 'safe'

              // Check if status changed to create notification
              if (newStatus !== site.status && newStatus === 'critical') {
                const notification = {
                  id: `${site.id}-${Date.now()}`,
                  message: `${site.name} status changed to CRITICAL (HMPI: ${newHmpi.toFixed(1)})`,
                  type: 'alert' as const,
                  timestamp: new Date()
                }
                setNotifications(prev => [notification, ...prev.slice(0, 4)]) // Keep last 5
              }

              return {
                ...site,
                hmpi: Number(newHmpi.toFixed(1)),
                status: newStatus,
                lastUpdated: 'Just now',
                temperature: Number((site.temperature + (Math.random() - 0.5) * 1).toFixed(1)),
                pH: Number((site.pH + (Math.random() - 0.5) * 0.2).toFixed(1)),
                conductivity: Math.round(site.conductivity + (Math.random() - 0.5) * 50),
                trend: hmpiChange > 0.5 ? 'increasing' : hmpiChange < -0.5 ? 'decreasing' : 'stable'
              }
            }
            return {
              ...site,
              lastUpdated: site.lastUpdated === 'Just now' ? '1 min ago' : 
                          site.lastUpdated === '1 min ago' ? '2 min ago' :
                          site.lastUpdated === '2 min ago' ? '3 min ago' : site.lastUpdated
            }
          })
        })
        setLastUpdate(new Date())
      }, 5000) // Update every 5 seconds for demo

      return () => {
        clearInterval(connectionInterval)
        clearInterval(dataInterval)
      }
    }

    const cleanup = simulateWebSocket()
    return cleanup
  }, [])

  // Filter sites based on search query using real-time data
  const filteredSites = realtimeData.filter(site =>
    site.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    site.location.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case "critical":
        return "bg-red-500"
      case "moderate":
        return "bg-yellow-500"
      case "safe":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "critical":
        return <Badge variant="destructive">Critical</Badge>
      case "moderate":
        return (
          <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">
            Moderate
          </Badge>
        )
      case "safe":
        return (
          <Badge variant="default" className="bg-green-500/10 text-green-600 border-green-500/20">
            Safe
          </Badge>
        )
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "increasing":
        return <TrendingUp className="h-3 w-3 text-red-500" />
      case "decreasing":
        return <TrendingUp className="h-3 w-3 text-green-500 rotate-180" />
      case "stable":
        return <div className="h-3 w-3 bg-yellow-500 rounded-full" />
      default:
        return null
    }
  }

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case "increasing":
        return "text-red-500"
      case "decreasing":
        return "text-green-500"
      case "stable":
        return "text-yellow-500"
      default:
        return "text-gray-500"
    }
  }

  const refreshData = async () => {
    setIsLoading(true)
    // Simulate data refresh with random slight variations
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setLastUpdate(new Date())
    setIsLoading(false)
  }

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.2, 3))
  }

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.2, 0.5))
  }

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  const exportMapData = () => {
    // Simulate data export
    const dataStr = JSON.stringify(filteredSites, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'pollution-map-data.json'
    link.click()
  }

  return (
    <>
    <Card className={`bg-card/80 backdrop-blur-sm border-border transition-all duration-300 ${
      isFullscreen ? 'fixed inset-4 z-50' : ''
    }`}>
      <CardHeader>
        <div className="flex flex-col space-y-4">
          {/* Title Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <MapPin className="h-5 w-5 flex-shrink-0" />
              <CardTitle className="flex items-center gap-2 flex-wrap">
                Live Pollution Map
                <Badge variant={isConnected ? "default" : "destructive"} className="text-xs">
                  <div className={`w-2 h-2 rounded-full mr-1 ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                  {isConnected ? 'Connected' : 'Reconnecting...'}
                </Badge>
                {notifications.length > 0 && (
                  <Badge variant="destructive" className="text-xs">
                    {notifications.length} Alert{notifications.length !== 1 ? 's' : ''}
                  </Badge>
                )}
              </CardTitle>
            </div>
            
            {/* Quick Actions - Right Side */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <Button variant="outline" size="sm" onClick={refreshData} disabled={isLoading}>
                <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
                <span className="hidden sm:ml-2 sm:inline">Refresh</span>
              </Button>
              <Button variant="outline" size="sm" onClick={exportMapData}>
                <Download className="h-4 w-4" />
                <span className="hidden sm:ml-2 sm:inline">Export</span>
              </Button>
              <Button variant="outline" size="sm" onClick={toggleFullscreen}>
                <Maximize2 className="h-4 w-4" />
                <span className="hidden sm:ml-2 sm:inline">{isFullscreen ? 'Exit' : 'Full'}</span>
              </Button>
            </div>
          </div>
          
          {/* Controls Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardDescription className="text-sm">
              Real-time heavy metal pollution monitoring • {filteredSites.length} active sites • Last update: {lastUpdate.toLocaleTimeString()}
            </CardDescription>
            
            <div className="flex items-center gap-2 flex-wrap">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search sites..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 w-40 h-8 text-sm"
                />
              </div>
              
              {/* Map View Selector */}
              <Tabs value={mapView} onValueChange={(value: any) => setMapView(value)} className="w-auto">
                <TabsList className="grid w-full grid-cols-3 h-8">
                  <TabsTrigger value="terrain" className="text-xs">Terrain</TabsTrigger>
                  <TabsTrigger value="satellite" className="text-xs">Satellite</TabsTrigger>
                  <TabsTrigger value="political" className="text-xs">Political</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
        </div>

        {/* Real-time Notifications Panel */}
        {notifications.length > 0 && (
          <div className="bg-destructive/10 border-l-4 border-destructive px-4 py-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-destructive" />
                <span className="text-sm font-medium">Recent Alerts</span>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setNotifications([])}
                className="h-6 px-2 text-xs"
              >
                Clear All
              </Button>
            </div>
            <div className="mt-2 space-y-1">
              {notifications.slice(0, 3).map(notification => (
                <div key={notification.id} className="text-xs text-muted-foreground flex items-center justify-between">
                  <span>{notification.message}</span>
                  <span>{notification.timestamp.toLocaleTimeString()}</span>
                </div>
              ))}
              {notifications.length > 3 && (
                <div className="text-xs text-muted-foreground">
                  +{notifications.length - 3} more alerts...
                </div>
              )}
            </div>
          </div>
        )}
      </CardHeader>
      <CardContent>
        {/* Real Interactive Map */}
        <div className={`relative ${isFullscreen ? 'h-[calc(100vh-200px)]' : 'h-[500px]'} rounded-lg overflow-hidden transition-all duration-300`}>
          <RealMap
            sites={filteredSites}
            onSiteClick={(site) => {
              setSelectedSite(site)
              setShowSiteDetails(true)
            }}
            mapView={mapView}
            showHeatmap={showHeatmap}
            zoomLevel={zoomLevel}
          />
          
          {/* Map Controls Overlay */}
          <div className="absolute top-4 right-4 flex flex-col gap-2 z-[1000]">
            {/* Layer Toggle */}
            <Button 
              variant="outline" 
              size="sm" 
              className="bg-background/90 backdrop-blur-sm hover:bg-background shadow-lg"
              onClick={() => setShowHeatmap(!showHeatmap)}
            >
              <Layers className="h-4 w-4" />
            </Button>
            
            {/* Zoom Controls */}
            <div className="flex flex-col bg-background/90 backdrop-blur-sm rounded border shadow-lg">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-lg font-bold hover:bg-muted"
                onClick={handleZoomIn}
                disabled={zoomLevel >= 2}
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
              <div className="h-px bg-border" />
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-lg font-bold hover:bg-muted"
                onClick={handleZoomOut}
                disabled={zoomLevel <= 0.5}
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Status Bar */}
          <div className="absolute top-4 left-4 flex flex-col gap-2 z-[1000]">
            {/* Live indicator */}
            <div className="flex items-center gap-2 bg-background/90 backdrop-blur-sm px-3 py-1 rounded-full border">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-medium">Live</span>
              <span className="text-xs text-muted-foreground">
                {lastUpdate.toLocaleTimeString()}
              </span>
            </div>

            {/* Quick Stats */}
            <div className="bg-background/90 backdrop-blur-sm px-3 py-2 rounded-lg border text-xs">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span>{filteredSites.filter(s => s.status === 'critical').length} Critical</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span>{filteredSites.filter(s => s.status === 'moderate').length} Moderate</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>{filteredSites.filter(s => s.status === 'safe').length} Safe</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Site Details Panel */}
        {selectedSite && (
          <div className="mt-6 p-4 bg-muted/50 rounded-lg border">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="font-semibold text-lg">{selectedSite.name}</h4>
                <p className="text-sm text-muted-foreground">{selectedSite.location}</p>
                <p className="text-xs text-muted-foreground">
                  {selectedSite.lat.toFixed(4)}°N, {selectedSite.lng.toFixed(4)}°E
                </p>
              </div>
              <div className="flex items-center gap-2">
                {getStatusBadge(selectedSite.status)}
                <Button variant="ghost" size="sm" onClick={() => setSelectedSite(null)}>
                  ×
                </Button>
              </div>
            </div>

            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">HMPI Score</div>
                    <div className="text-2xl font-bold flex items-center gap-2">
                      {selectedSite.hmpi}
                      {getTrendIcon(selectedSite.trend)}
                    </div>
                    <Progress value={selectedSite.hmpi} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">Status</div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(selectedSite.status)}
                      <span className={`text-sm ${getTrendColor(selectedSite.trend)}`}>
                        {selectedSite.trend}
                      </span>
                    </div>
                  </div>
                </div>

                {selectedSite.metals.length > 0 && (
                  <div>
                    <div className="text-sm text-muted-foreground mb-2">Detected Heavy Metals</div>
                    <div className="flex flex-wrap gap-2">
                      {selectedSite.metals.map((metal) => (
                        <Badge key={metal} variant="destructive" className="text-xs">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          {metal}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="details" className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Temperature:</span>
                    <div className="font-medium">{selectedSite.temperature}°C</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">pH Level:</span>
                    <div className="font-medium">{selectedSite.pH}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Conductivity:</span>
                    <div className="font-medium">{selectedSite.conductivity} μS/cm</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Samples:</span>
                    <div className="font-medium">{selectedSite.samples}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Active Alerts:</span>
                    <div className="font-medium text-red-500">{selectedSite.alerts}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Reports:</span>
                    <div className="font-medium">{selectedSite.reportCount}</div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="history" className="space-y-4">
                <div className="text-sm text-muted-foreground">
                  Historical data and trends for {selectedSite.name}
                </div>
                <div className="h-32 bg-muted/30 rounded flex items-center justify-center text-sm text-muted-foreground">
                  Historical chart would be rendered here
                </div>
              </TabsContent>
            </Tabs>

            <div className="mt-4 flex gap-2">
              <Button size="sm" variant="outline" className="bg-transparent">
                <AlertTriangle className="h-4 w-4 mr-2" />
                View Alerts
              </Button>
              <Button size="sm" variant="outline" className="bg-transparent">
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </Button>
              <Button size="sm" variant="outline" className="bg-transparent">
                <MoreVertical className="h-4 w-4 mr-2" />
                More Actions
              </Button>
            </div>
          </div>
        )}

        {/* Enhanced Quick Stats */}
        <div className="mt-6 grid grid-cols-4 gap-4 text-center">
          <div className="p-3 bg-red-500/10 rounded-lg border border-red-500/20">
            <div className="text-lg font-bold text-red-500">
              {filteredSites.filter(s => s.status === 'critical').length}
            </div>
            <div className="text-xs text-muted-foreground">Critical Sites</div>
            <div className="text-xs text-red-500 mt-1">
              {filteredSites.reduce((acc, s) => s.status === 'critical' ? acc + s.alerts : acc, 0)} Active Alerts
            </div>
          </div>
          
          <div className="p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
            <div className="text-lg font-bold text-yellow-500">
              {filteredSites.filter(s => s.status === 'moderate').length}
            </div>
            <div className="text-xs text-muted-foreground">Moderate Sites</div>
            <div className="text-xs text-yellow-600 mt-1">
              Monitoring Required
            </div>
          </div>
          
          <div className="p-3 bg-green-500/10 rounded-lg border border-green-500/20">
            <div className="text-lg font-bold text-green-500">
              {filteredSites.filter(s => s.status === 'safe').length}
            </div>
            <div className="text-xs text-muted-foreground">Safe Sites</div>
            <div className="text-xs text-green-600 mt-1">
              Within Limits
            </div>
          </div>

          <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
            <div className="text-lg font-bold text-blue-500">
              {filteredSites.reduce((acc, s) => acc + s.samples, 0)}
            </div>
            <div className="text-xs text-muted-foreground">Total Samples</div>
            <div className="text-xs text-blue-600 mt-1">
              Last 30 Days
            </div>
          </div>
        </div>

        {/* Enhanced Map Footer */}
        <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground border-t pt-3">
          <div className="flex items-center gap-4">
            <span>Zoom: {Math.round(zoomLevel * 100)}%</span>
            <span>View: {mapView}</span>
            <span>Heatmap: {showHeatmap ? 'On' : 'Off'}</span>
            <span>Sites: {filteredSites.length}</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
              <span>{isConnected ? 'Live updates active' : 'Reconnecting...'}</span>
            </div>
            <span>Updated: {lastUpdate.toLocaleTimeString()}</span>
            {notifications.length > 0 && (
              <span className="text-destructive font-medium">
                {notifications.length} active alert{notifications.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>

    {/* Site Details Modal */}
    {showSiteDetails && selectedSite && (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div className="max-w-6xl w-full max-h-[90vh] overflow-y-auto">
          <SiteDetails 
            site={{
              id: selectedSite.id.toString(),
              name: selectedSite.name,
              location: selectedSite.location,
              coordinates: [selectedSite.lat, selectedSite.lng],
              hmpi: selectedSite.hmpi / 20, // Convert back to 0-5 scale for SiteDetails
              status: selectedSite.status === 'critical' ? 'poor' : 
                     selectedSite.status === 'moderate' ? 'moderate' :
                     selectedSite.status === 'safe' ? 'excellent' : 'good',
              lastUpdate: new Date()
            }}
            onClose={() => {
              setShowSiteDetails(false)
              setSelectedSite(null)
            }}
          />
        </div>
      </div>
    )}
    </>
  )
}

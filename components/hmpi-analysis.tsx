"use client"

import { useState, useMemo, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"
import { Calculator, AlertTriangle, CheckCircle, TrendingUp, MapPin, Calendar, Zap } from "lucide-react"
import { useRealTimeData, useLocationData } from "@/contexts/real-time-data-context"

// Metal safety limits (WHO standards in μg/L)
const METAL_LIMITS = {
  'Lead': 10,
  'Mercury': 6,
  'Cadmium': 3,
  'Arsenic': 10,
  'Zinc': 5000,
  'Copper': 2000,
  'Chromium': 50,
  'Nickel': 70
}

export function HMPIAnalysis() {
  const [selectedLocation, setSelectedLocation] = useState("Delhi Yamuna")
  const { state } = useRealTimeData()
  const { data: locationData, isStale, lastUpdate } = useLocationData(selectedLocation)
  
  // Generate historical trend data for the selected location
  const historicalTrend = useMemo(() => {
    if (!state.historicalData.length) return []
    
    return state.historicalData
      .filter(data => data.location === selectedLocation)
      .slice(-20) // Last 20 readings
      .map(data => ({
        time: data.timestamp.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        hmpi: data.hmpi,
        timestamp: data.timestamp.getTime()
      }))
      .sort((a, b) => a.timestamp - b.timestamp)
  }, [state.historicalData, selectedLocation])
  
  // Calculate radar chart data from real-time metal readings
  const radarData = useMemo(() => {
    if (!locationData) return []
    
    return locationData.metals.map(metal => {
      const limit = METAL_LIMITS[metal.metal as keyof typeof METAL_LIMITS] || 100
      const ratio = (metal.value / limit) * 100
      
      return {
        metal: metal.metal,
        value: Math.min(ratio, 500), // Cap at 500%
        limit: 100,
        status: metal.status
      }
    })
  }, [locationData])
  
  // Determine overall status based on real-time HMPI
  const getStatus = (hmpi: number) => {
    if (hmpi >= 100) return 'Critical'
    if (hmpi >= 50) return 'Moderate'
    return 'Safe'
  }
  
  const currentStatus = locationData ? getStatus(locationData.hmpi) : 'Unknown'
  
  // Auto-select first location when data becomes available
  useEffect(() => {
    if (state.currentData.length > 0 && !state.currentData.find(d => d.location === selectedLocation)) {
      setSelectedLocation(state.currentData[0].location)
    }
  }, [state.currentData, selectedLocation])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Critical":
        return "text-red-500"
      case "Moderate":
        return "text-yellow-500"
      case "Safe":
        return "text-green-500"
      default:
        return "text-muted-foreground"
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Critical":
        return <Badge variant="destructive">Critical</Badge>
      case "Moderate":
        return (
          <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">
            Moderate
          </Badge>
        )
      case "Safe":
        return (
          <Badge variant="default" className="bg-green-500/10 text-green-600 border-green-500/20">
            Safe
          </Badge>
        )
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  return (
    <Card className="bg-card/80 backdrop-blur-sm border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              HMPI Computation
            </CardTitle>
            <CardDescription>Heavy Metal Pollution Index analysis and breakdown</CardDescription>
          </div>
          <Select value={selectedLocation} onValueChange={setSelectedLocation}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {state.currentData && state.currentData.length > 0 ? (
                state.currentData.map((data) => (
                  <SelectItem key={data.location} value={data.location}>
                    {data.location}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="loading">Loading locations...</SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Location Overview */}
        {locationData && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
            <div className="space-y-1">
              <p className="text-sm font-medium">Location</p>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {selectedLocation}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">HMPI Score</p>
              <div className="flex items-center gap-2">
                <span className={`text-2xl font-bold ${getStatusColor(currentStatus)}`}>
                  {locationData.hmpi.toFixed(1)}
                </span>
                {getStatusBadge(currentStatus)}
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">Last Updated</p>
              <div className="flex items-center gap-2">
                <Calendar className="h-3 w-3" />
                <span className={`text-xs ${isStale ? 'text-red-500' : 'text-muted-foreground'}`}>
                  {locationData.timestamp.toLocaleTimeString()}
                </span>
                {isStale && <Zap className="h-3 w-3 text-red-500" />}
              </div>
            </div>
          </div>
        )}

        {/* HMPI Formula Explanation */}
        <div className="bg-background border border-border rounded-lg p-4">
          <h4 className="text-sm font-medium mb-2">HMPI Calculation Formula</h4>
          <div className="text-xs font-mono bg-muted/50 rounded p-2 mb-2">HMPI = Σ(Ci/Si) × Wi</div>
          <div className="text-xs text-muted-foreground space-y-1">
            <p>• Ci = Concentration of metal i in sample</p>
            <p>• Si = Standard limit for metal i (WHO/BIS/CGWB)</p>
            <p>• Wi = Weight factor based on toxicity</p>
            <p>• HMPI &lt; 50: Safe | 50-75: Moderate | &gt; 75: Critical</p>
          </div>
        </div>

        {/* Metal Breakdown */}
        {locationData && (
          <div className="space-y-4">
            <h4 className="text-sm font-medium">Heavy Metal Breakdown</h4>
            {locationData.metals.map((metal) => {
              const limit = METAL_LIMITS[metal.metal as keyof typeof METAL_LIMITS] || 100
              const ratio = metal.value / limit
              
              return (
                <div key={metal.metal} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{metal.metal}</span>
                      {metal.status === 'critical' && <AlertTriangle className="h-4 w-4 text-red-500" />}
                      {metal.status === 'warning' && <AlertTriangle className="h-4 w-4 text-yellow-500" />}
                      {metal.status === 'normal' && <CheckCircle className="h-4 w-4 text-green-500" />}
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">{metal.value.toFixed(2)} {metal.unit}</div>
                      <div className="text-xs text-muted-foreground">Limit: {limit} {metal.unit}</div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Progress value={Math.min(ratio * 100, 100)} className="h-2" />
                    <div className="flex justify-between text-xs">
                      <span className={ratio > 1 ? "text-red-500" : "text-green-500"}>
                        {ratio.toFixed(1)}x limit
                      </span>
                      <span className="text-muted-foreground">{ratio > 1 ? "Exceeds" : "Within"} safe limits</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Radar Chart */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium">Pollution Profile</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="rgb(var(--border))" />
                <PolarAngleAxis dataKey="metal" tick={{ fontSize: 12, fill: "rgb(var(--muted-foreground))" }} />
                <PolarRadiusAxis
                  angle={90}
                  domain={[0, 100]}
                  tick={{ fontSize: 10, fill: "rgb(var(--muted-foreground))" }}
                />
                <Radar
                  name="Pollution Level"
                  dataKey="value"
                  stroke="rgb(var(--primary))"
                  fill="rgb(var(--primary))"
                  fillOpacity={0.1}
                  strokeWidth={2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Action Recommendations */}
        <div className="bg-muted/50 rounded-lg p-4">
          <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Action-Oriented Insights
          </h4>
          <div className="space-y-2 text-sm">
            {currentStatus === "Critical" && (
              <>
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-destructive mt-0.5" />
                  <div>
                    <p className="font-medium text-destructive">Immediate Action Required</p>
                    <p className="text-xs text-muted-foreground">
                      Water unsafe for drinking and cooking. Industrial discharge suspected.
                    </p>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground ml-6">
                  • Restrict public access to water source • Investigate upstream industrial activities • Implement
                  emergency water treatment measures
                </div>
              </>
            )}
            {currentStatus === "Moderate" && (
              <>
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-yellow-600">Caution Advised</p>
                    <p className="text-xs text-muted-foreground">
                      Safe for agriculture, treatment recommended for drinking.
                    </p>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground ml-6">
                  • Install water filtration systems • Monitor pollution sources regularly • Safe for irrigation with
                  proper management
                </div>
              </>
            )}
            {currentStatus === "Safe" && (
              <>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-green-600">Water Quality Good</p>
                    <p className="text-xs text-muted-foreground">Safe for drinking, cooking, and agricultural use.</p>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground ml-6">
                  • Continue regular monitoring • Maintain current pollution control measures • Suitable for all
                  domestic and agricultural purposes
                </div>
              </>
            )}
          </div>
        </div>

        {/* Computation Actions */}
        <div className="flex gap-2">
          <Button className="flex-1">
            <Calculator className="h-4 w-4 mr-2" />
            Recalculate HMPI
          </Button>
          <Button variant="outline" className="flex-1 bg-transparent">
            Export Analysis
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

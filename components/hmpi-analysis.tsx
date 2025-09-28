"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts"
import { Calculator, AlertTriangle, CheckCircle, TrendingUp, MapPin, Calendar } from "lucide-react"

const locationData = [
  {
    location: "Delhi Yamuna",
    coordinates: "28.6139, 77.2090",
    hmpi: 85.2,
    status: "Critical",
    metals: {
      lead: { value: 0.85, limit: 0.01, ratio: 85 },
      mercury: { value: 0.012, limit: 0.001, ratio: 12 },
      cadmium: { value: 0.025, limit: 0.003, ratio: 8.3 },
      arsenic: { value: 0.045, limit: 0.01, ratio: 4.5 },
      chromium: { value: 0.15, limit: 0.05, ratio: 3 },
    },
    lastUpdated: "2025-01-28",
  },
  {
    location: "Mumbai Mithi River",
    coordinates: "19.0760, 72.8777",
    hmpi: 64.7,
    status: "Moderate",
    metals: {
      lead: { value: 0.032, limit: 0.01, ratio: 3.2 },
      mercury: { value: 0.008, limit: 0.001, ratio: 8 },
      cadmium: { value: 0.015, limit: 0.003, ratio: 5 },
      arsenic: { value: 0.028, limit: 0.01, ratio: 2.8 },
      chromium: { value: 0.089, limit: 0.05, ratio: 1.78 },
    },
    lastUpdated: "2025-01-27",
  },
  {
    location: "Chennai Marina",
    coordinates: "13.0827, 80.2707",
    hmpi: 42.1,
    status: "Safe",
    metals: {
      lead: { value: 0.008, limit: 0.01, ratio: 0.8 },
      mercury: { value: 0.0005, limit: 0.001, ratio: 0.5 },
      cadmium: { value: 0.002, limit: 0.003, ratio: 0.67 },
      arsenic: { value: 0.006, limit: 0.01, ratio: 0.6 },
      chromium: { value: 0.025, limit: 0.05, ratio: 0.5 },
    },
    lastUpdated: "2025-01-26",
  },
]

const radarData = [
  { metal: "Lead", value: 85, limit: 100 },
  { metal: "Mercury", value: 12, limit: 100 },
  { metal: "Cadmium", value: 8.3, limit: 100 },
  { metal: "Arsenic", value: 4.5, limit: 100 },
  { metal: "Chromium", value: 3, limit: 100 },
]

export function HMPIAnalysis() {
  const [selectedLocation, setSelectedLocation] = useState("Delhi Yamuna")
  const currentData = locationData.find((loc) => loc.location === selectedLocation) || locationData[0]

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
              {locationData.map((location) => (
                <SelectItem key={location.location} value={location.location}>
                  {location.location}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Location Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
          <div className="space-y-1">
            <p className="text-sm font-medium">Location</p>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {currentData.coordinates}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium">HMPI Score</p>
            <div className="flex items-center gap-2">
              <span className={`text-2xl font-bold ${getStatusColor(currentData.status)}`}>{currentData.hmpi}</span>
              {getStatusBadge(currentData.status)}
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium">Last Updated</p>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {currentData.lastUpdated}
            </p>
          </div>
        </div>

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
        <div className="space-y-4">
          <h4 className="text-sm font-medium">Heavy Metal Breakdown</h4>
          {Object.entries(currentData.metals).map(([metal, data]) => (
            <div key={metal} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium capitalize">{metal}</span>
                  {data.ratio > 1 && <AlertTriangle className="h-4 w-4 text-destructive" />}
                  {data.ratio <= 1 && <CheckCircle className="h-4 w-4 text-green-500" />}
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">{data.value} mg/L</div>
                  <div className="text-xs text-muted-foreground">Limit: {data.limit} mg/L</div>
                </div>
              </div>
              <div className="space-y-1">
                <Progress value={Math.min(data.ratio * 10, 100)} className="h-2" />
                <div className="flex justify-between text-xs">
                  <span className={data.ratio > 1 ? "text-destructive" : "text-green-500"}>
                    {data.ratio.toFixed(1)}x limit
                  </span>
                  <span className="text-muted-foreground">{data.ratio > 1 ? "Exceeds" : "Within"} safe limits</span>
                </div>
              </div>
            </div>
          ))}
        </div>

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
            {currentData.status === "Critical" && (
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
            {currentData.status === "Moderate" && (
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
            {currentData.status === "Safe" && (
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

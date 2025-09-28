"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Maximize2, RefreshCw, Layers } from "lucide-react"

// Mock pollution data points
const pollutionSites = [
  {
    id: 1,
    name: "Delhi Yamuna",
    lat: 28.6139,
    lng: 77.209,
    hmpi: 85.2,
    status: "critical",
    lastUpdated: "2 min ago",
    metals: ["Lead", "Mercury", "Cadmium"],
  },
  {
    id: 2,
    name: "Mumbai Mithi River",
    lat: 19.076,
    lng: 72.8777,
    hmpi: 64.7,
    status: "moderate",
    lastUpdated: "5 min ago",
    metals: ["Mercury", "Arsenic"],
  },
  {
    id: 3,
    name: "Kolkata Hooghly",
    lat: 22.5726,
    lng: 88.3639,
    hmpi: 78.1,
    status: "critical",
    lastUpdated: "8 min ago",
    metals: ["Lead", "Chromium"],
  },
  {
    id: 4,
    name: "Chennai Marina",
    lat: 13.0827,
    lng: 80.2707,
    hmpi: 42.1,
    status: "safe",
    lastUpdated: "12 min ago",
    metals: [],
  },
  {
    id: 5,
    name: "Bangalore Bellandur",
    lat: 12.9716,
    lng: 77.5946,
    hmpi: 52.3,
    status: "moderate",
    lastUpdated: "15 min ago",
    metals: ["Copper"],
  },
  {
    id: 6,
    name: "Hyderabad Hussain Sagar",
    lat: 17.385,
    lng: 78.4867,
    hmpi: 68.9,
    status: "moderate",
    lastUpdated: "18 min ago",
    metals: ["Lead", "Zinc"],
  },
]

export function PollutionMap() {
  const [selectedSite, setSelectedSite] = useState<(typeof pollutionSites)[0] | null>(null)
  const [isLoading, setIsLoading] = useState(false)

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

  const refreshData = async () => {
    setIsLoading(true)
    // Simulate data refresh
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsLoading(false)
  }

  return (
    <Card className="bg-card/80 backdrop-blur-sm border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Live Pollution Map
            </CardTitle>
            <CardDescription>Real-time heavy metal pollution monitoring across India</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={refreshData} disabled={isLoading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button variant="outline" size="sm">
              <Maximize2 className="h-4 w-4 mr-2" />
              Fullscreen
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Map Container */}
        <div className="relative h-96 bg-slate-900 rounded-lg overflow-hidden">
          {/* Simulated Map Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900">
            {/* India outline simulation */}
            <svg
              viewBox="0 0 400 300"
              className="absolute inset-0 w-full h-full opacity-20"
              fill="none"
              stroke="rgb(var(--border))"
              strokeWidth="1"
            >
              {/* Simplified India outline */}
              <path d="M80 50 L120 40 L160 45 L200 50 L240 60 L280 80 L300 120 L290 160 L270 200 L240 220 L200 230 L160 225 L120 210 L90 180 L70 140 L75 100 Z" />
              {/* State boundaries */}
              <path d="M120 80 L180 85 L220 90" />
              <path d="M100 120 L200 125 L260 130" />
              <path d="M90 160 L190 165 L250 170" />
            </svg>

            {/* Pollution Sites */}
            {pollutionSites.map((site) => (
              <div
                key={site.id}
                className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: `${((site.lng - 68) / (97 - 68)) * 100}%`,
                  top: `${((35 - site.lat) / (35 - 8)) * 100}%`,
                }}
                onClick={() => setSelectedSite(site)}
              >
                {/* Pulsing circle for critical sites */}
                {site.status === "critical" && (
                  <div className="absolute inset-0 w-6 h-6 bg-red-500/30 rounded-full animate-ping"></div>
                )}

                {/* Main marker */}
                <div
                  className={`w-4 h-4 rounded-full border-2 border-white shadow-lg ${getStatusColor(
                    site.status,
                  )} hover:scale-125 transition-transform`}
                ></div>

                {/* Site label */}
                <div className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-background/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-medium whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity">
                  {site.name}
                  <div className="text-xs text-muted-foreground">HMPI: {site.hmpi}</div>
                </div>
              </div>
            ))}

            {/* Heatmap overlay simulation */}
            <div className="absolute inset-0 opacity-30">
              {/* Critical zone around Delhi */}
              <div
                className="absolute w-20 h-20 bg-red-500/40 rounded-full blur-xl"
                style={{ left: "45%", top: "25%" }}
              ></div>
              {/* Moderate zone around Mumbai */}
              <div
                className="absolute w-16 h-16 bg-yellow-500/40 rounded-full blur-xl"
                style={{ left: "25%", top: "45%" }}
              ></div>
              {/* Critical zone around Kolkata */}
              <div
                className="absolute w-18 h-18 bg-red-500/40 rounded-full blur-xl"
                style={{ left: "70%", top: "35%" }}
              ></div>
            </div>
          </div>

          {/* Map Controls */}
          <div className="absolute top-4 right-4 flex flex-col gap-2">
            <Button variant="outline" size="sm" className="bg-background/80 backdrop-blur-sm">
              <Layers className="h-4 w-4" />
            </Button>
            <div className="flex flex-col bg-background/80 backdrop-blur-sm rounded">
              <Button variant="ghost" size="sm" className="text-lg font-bold">
                +
              </Button>
              <Button variant="ghost" size="sm" className="text-lg font-bold">
                −
              </Button>
            </div>
          </div>

          {/* Live indicator */}
          <div className="absolute top-4 left-4 flex items-center gap-2 bg-background/80 backdrop-blur-sm px-3 py-1 rounded-full">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs font-medium">Live</span>
          </div>
        </div>

        {/* Site Details Panel */}
        {selectedSite && (
          <div className="mt-4 p-4 bg-muted/50 rounded-lg">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="font-medium">{selectedSite.name}</h4>
                <p className="text-sm text-muted-foreground">
                  {selectedSite.lat.toFixed(4)}, {selectedSite.lng.toFixed(4)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {getStatusBadge(selectedSite.status)}
                <Button variant="ghost" size="sm" onClick={() => setSelectedSite(null)}>
                  ×
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">HMPI Score:</span>
                <div className="font-bold text-lg">{selectedSite.hmpi}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Last Updated:</span>
                <div className="font-medium">{selectedSite.lastUpdated}</div>
              </div>
            </div>

            {selectedSite.metals.length > 0 && (
              <div className="mt-3">
                <span className="text-sm text-muted-foreground">Detected Metals:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {selectedSite.metals.map((metal) => (
                    <Badge key={metal} variant="outline" className="text-xs">
                      {metal}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-3 flex gap-2">
              <Button size="sm" variant="outline" className="bg-transparent">
                View Details
              </Button>
              <Button size="sm" variant="outline" className="bg-transparent">
                Generate Report
              </Button>
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className="mt-4 grid grid-cols-3 gap-4 text-center">
          <div className="p-3 bg-red-500/10 rounded-lg">
            <div className="text-lg font-bold text-red-500">2</div>
            <div className="text-xs text-muted-foreground">Critical Sites</div>
          </div>
          <div className="p-3 bg-yellow-500/10 rounded-lg">
            <div className="text-lg font-bold text-yellow-500">3</div>
            <div className="text-xs text-muted-foreground">Moderate Sites</div>
          </div>
          <div className="p-3 bg-green-500/10 rounded-lg">
            <div className="text-lg font-bold text-green-500">1</div>
            <div className="text-xs text-muted-foreground">Safe Sites</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

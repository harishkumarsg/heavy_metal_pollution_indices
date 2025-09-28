"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Info, AlertTriangle, CheckCircle, Clock } from "lucide-react"

export function MapLegend() {
  return (
    <Card className="bg-card/80 backdrop-blur-sm border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Info className="h-5 w-5" />
          Map Legend
        </CardTitle>
        <CardDescription>Understanding pollution indicators and zones</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Pollution Levels */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Pollution Levels</h4>
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 bg-red-500 rounded-full"></div>
              <div className="flex-1">
                <div className="text-sm font-medium">Critical (HMPI &gt; 75)</div>
                <div className="text-xs text-muted-foreground">Immediate action required</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
              <div className="flex-1">
                <div className="text-sm font-medium">Moderate (HMPI 50-75)</div>
                <div className="text-xs text-muted-foreground">Treatment recommended</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <div className="text-sm font-medium">Safe (HMPI &lt; 50)</div>
                <div className="text-xs text-muted-foreground">Within acceptable limits</div>
              </div>
            </div>
          </div>
        </div>

        {/* Zone Classifications */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Safety Zones</h4>
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              <div className="flex-1">
                <div className="text-sm font-medium">Restricted Zone</div>
                <div className="text-xs text-muted-foreground">No water usage</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
              <div className="flex-1">
                <div className="text-sm font-medium">Caution Zone</div>
                <div className="text-xs text-muted-foreground">Limited usage only</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <div className="flex-1">
                <div className="text-sm font-medium">Safe Zone</div>
                <div className="text-xs text-muted-foreground">All uses permitted</div>
              </div>
            </div>
          </div>
        </div>

        {/* Data Freshness */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Data Freshness</h4>
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <div className="text-sm">Live (&lt; 5 min)</div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <div className="text-sm">Recent (5-60 min)</div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
              <div className="text-sm">Stale (&gt; 1 hour)</div>
            </div>
          </div>
        </div>

        {/* Standards Reference */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Standards</h4>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span>WHO Guidelines</span>
              <Badge variant="outline" className="text-xs">
                Primary
              </Badge>
            </div>
            <div className="flex justify-between">
              <span>BIS Standards</span>
              <Badge variant="outline" className="text-xs">
                National
              </Badge>
            </div>
            <div className="flex justify-between">
              <span>CGWB Limits</span>
              <Badge variant="outline" className="text-xs">
                Regional
              </Badge>
            </div>
          </div>
        </div>

        {/* Update Status */}
        <div className="bg-muted/50 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Last Update</span>
          </div>
          <div className="text-xs text-muted-foreground">
            <p>Map data: 2 minutes ago</p>
            <p>HMPI calculations: Real-time</p>
            <p>Weather data: 15 minutes ago</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

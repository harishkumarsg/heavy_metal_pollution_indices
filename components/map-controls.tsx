"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Settings, Filter } from "lucide-react"

export function MapControls() {
  const [showHeatmap, setShowHeatmap] = useState(true)
  const [showSites, setShowSites] = useState(true)
  const [showZones, setShowZones] = useState(true)
  const [opacity, setOpacity] = useState([70])
  const [timeRange, setTimeRange] = useState("24h")

  return (
    <Card className="bg-card/80 backdrop-blur-sm border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Map Controls
        </CardTitle>
        <CardDescription>Customize map display and filters</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Layer Controls */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium">Map Layers</h4>

          <div className="flex items-center justify-between">
            <Label htmlFor="heatmap" className="text-sm">
              Pollution Heatmap
            </Label>
            <Switch id="heatmap" checked={showHeatmap} onCheckedChange={setShowHeatmap} />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="sites" className="text-sm">
              Monitoring Sites
            </Label>
            <Switch id="sites" checked={showSites} onCheckedChange={setShowSites} />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="zones" className="text-sm">
              Safety Zones
            </Label>
            <Switch id="zones" checked={showZones} onCheckedChange={setShowZones} />
          </div>
        </div>

        {/* Opacity Control */}
        <div className="space-y-2">
          <Label className="text-sm">Heatmap Opacity</Label>
          <Slider value={opacity} onValueChange={setOpacity} max={100} step={10} className="w-full" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0%</span>
            <span>{opacity[0]}%</span>
            <span>100%</span>
          </div>
        </div>

        {/* Time Range Filter */}
        <div className="space-y-2">
          <Label className="text-sm">Time Range</Label>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1h">Last Hour</SelectItem>
              <SelectItem value="24h">Last 24 Hours</SelectItem>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Pollution Level Filter */}
        <div className="space-y-2">
          <Label className="text-sm">Show Pollution Levels</Label>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <input type="checkbox" id="critical" defaultChecked className="rounded" />
              <Label htmlFor="critical" className="text-sm flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                Critical (&gt; 75)
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="moderate" defaultChecked className="rounded" />
              <Label htmlFor="moderate" className="text-sm flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                Moderate (50-75)
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="safe" defaultChecked className="rounded" />
              <Label htmlFor="safe" className="text-sm flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                Safe (&lt; 50)
              </Label>
            </div>
          </div>
        </div>

        {/* Metal Type Filter */}
        <div className="space-y-2">
          <Label className="text-sm">Filter by Metal</Label>
          <Select defaultValue="all">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Metals</SelectItem>
              <SelectItem value="lead">Lead (Pb)</SelectItem>
              <SelectItem value="mercury">Mercury (Hg)</SelectItem>
              <SelectItem value="cadmium">Cadmium (Cd)</SelectItem>
              <SelectItem value="arsenic">Arsenic (As)</SelectItem>
              <SelectItem value="chromium">Chromium (Cr)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Quick Actions */}
        <div className="space-y-2">
          <Button className="w-full bg-transparent" variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Apply Filters
          </Button>
          <Button className="w-full bg-transparent" variant="outline">
            Reset to Default
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

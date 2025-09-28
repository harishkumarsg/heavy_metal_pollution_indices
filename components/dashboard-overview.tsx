"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts"
import { AlertTriangle, CheckCircle, TrendingUp, Droplets, MapPin, Users, FileText } from "lucide-react"

const pollutionData = [
  { location: "Delhi", hmpi: 85, status: "Critical" },
  { location: "Mumbai", hmpi: 65, status: "Moderate" },
  { location: "Kolkata", hmpi: 78, status: "High" },
  { location: "Chennai", hmpi: 45, status: "Safe" },
  { location: "Bangalore", hmpi: 52, status: "Safe" },
  { location: "Hyderabad", hmpi: 68, status: "Moderate" },
]

const trendData = [
  { month: "Jan", hmpi: 65, forecast: 68 },
  { month: "Feb", hmpi: 72, forecast: 75 },
  { month: "Mar", hmpi: 68, forecast: 71 },
  { month: "Apr", hmpi: 75, forecast: 78 },
  { month: "May", hmpi: 82, forecast: 85 },
  { month: "Jun", hmpi: 78, forecast: 81 },
]

export function DashboardOverview() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Environmental Dashboard</h1>
          <p className="text-muted-foreground">Real-time heavy metal pollution monitoring and analysis</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            Last updated: 2 min ago
          </Badge>
          <Button size="sm">
            <FileText className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-card/80 backdrop-blur-sm border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Monitoring Sites</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,247</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">+12%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card/80 backdrop-blur-sm border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">23</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-red-500">+3</span> in last 24h
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card/80 backdrop-blur-sm border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Safe Zones</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">892</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">+5%</span> improvement
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card/80 backdrop-blur-sm border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Data Contributors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-blue-500">+8</span> new this week
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* HMPI by Location */}
        <Card className="bg-card/80 backdrop-blur-sm border-border">
          <CardHeader>
            <CardTitle>HMPI by Major Cities</CardTitle>
            <CardDescription>Current heavy metal pollution indices across monitoring locations</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={pollutionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--border))" />
                <XAxis dataKey="location" stroke="rgb(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="rgb(var(--muted-foreground))" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgb(var(--card))",
                    border: "1px solid rgb(var(--border))",
                    borderRadius: "6px",
                  }}
                />
                <Bar dataKey="hmpi" fill="rgb(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Trend Analysis */}
        <Card className="bg-card/80 backdrop-blur-sm border-border">
          <CardHeader>
            <CardTitle>Pollution Trends & AI Forecast</CardTitle>
            <CardDescription>Historical data with AI-powered future predictions</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--border))" />
                <XAxis dataKey="month" stroke="rgb(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="rgb(var(--muted-foreground))" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgb(var(--card))",
                    border: "1px solid rgb(var(--border))",
                    borderRadius: "6px",
                  }}
                />
                <Line type="monotone" dataKey="hmpi" stroke="rgb(var(--primary))" strokeWidth={2} name="Actual HMPI" />
                <Line
                  type="monotone"
                  dataKey="forecast"
                  stroke="rgb(var(--accent))"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  name="AI Forecast"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Water Health Score */}
        <Card className="bg-card/80 backdrop-blur-sm border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Droplets className="h-5 w-5 text-primary" />
              Water Health Score
            </CardTitle>
            <CardDescription>Simplified pollution index for public awareness</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary">72</div>
              <p className="text-sm text-muted-foreground">National Average</p>
            </div>
            <Progress value={72} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Poor</span>
              <span>Excellent</span>
            </div>
          </CardContent>
        </Card>

        {/* Recent Alerts */}
        <Card className="bg-card/80 backdrop-blur-sm border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Recent Alerts
            </CardTitle>
            <CardDescription>Latest pollution threshold breaches</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-2 rounded-lg bg-destructive/10">
              <div>
                <p className="text-sm font-medium">Delhi - Yamuna River</p>
                <p className="text-xs text-muted-foreground">Lead: 0.8 mg/L</p>
              </div>
              <Badge variant="destructive" className="text-xs">
                Critical
              </Badge>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-yellow-500/10">
              <div>
                <p className="text-sm font-medium">Mumbai - Mithi River</p>
                <p className="text-xs text-muted-foreground">Mercury: 0.3 mg/L</p>
              </div>
              <Badge variant="outline" className="text-xs">
                Warning
              </Badge>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-destructive/10">
              <div>
                <p className="text-sm font-medium">Kolkata - Hooghly</p>
                <p className="text-xs text-muted-foreground">Cadmium: 0.15 mg/L</p>
              </div>
              <Badge variant="destructive" className="text-xs">
                Critical
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="bg-card/80 backdrop-blur-sm border-border">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start bg-transparent" variant="outline">
              <TrendingUp className="h-4 w-4 mr-2" />
              Upload New Data
            </Button>
            <Button className="w-full justify-start bg-transparent" variant="outline">
              <MapPin className="h-4 w-4 mr-2" />
              View Live Map
            </Button>
            <Button className="w-full justify-start bg-transparent" variant="outline">
              <FileText className="h-4 w-4 mr-2" />
              Generate Report
            </Button>
            <Button className="w-full justify-start bg-transparent" variant="outline">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Configure Alerts
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

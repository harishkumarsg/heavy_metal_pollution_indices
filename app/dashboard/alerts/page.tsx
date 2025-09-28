"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertTriangle, Bell, CheckCircle, Clock, Mail, MessageSquare, Settings, Smartphone } from "lucide-react"

const activeAlerts = [
  {
    id: 1,
    title: "Critical HMPI Level Detected",
    description: "Site A47 shows HMPI value of 8.2 (Critical threshold: 6.0)",
    severity: "critical",
    location: "Mumbai, Maharashtra",
    timestamp: "2024-12-15 14:30",
    status: "active",
  },
  {
    id: 2,
    title: "Lead Concentration Spike",
    description: "Lead levels exceeded WHO standards by 150% at monitoring station B23",
    severity: "high",
    location: "Delhi, NCR",
    timestamp: "2024-12-15 12:15",
    status: "acknowledged",
  },
  {
    id: 3,
    title: "Mercury Detection Alert",
    description: "Unusual mercury levels detected in groundwater samples",
    severity: "medium",
    location: "Kolkata, West Bengal",
    timestamp: "2024-12-15 09:45",
    status: "investigating",
  },
]

const alertHistory = [
  {
    id: 4,
    title: "Cadmium Threshold Exceeded",
    description: "Resolved after industrial source identification and containment",
    severity: "high",
    location: "Chennai, Tamil Nadu",
    timestamp: "2024-12-14 16:20",
    status: "resolved",
    resolvedAt: "2024-12-15 08:30",
  },
  {
    id: 5,
    title: "Arsenic Level Warning",
    description: "False positive due to sensor calibration error",
    severity: "medium",
    location: "Bangalore, Karnataka",
    timestamp: "2024-12-13 11:10",
    status: "false-positive",
    resolvedAt: "2024-12-13 15:45",
  },
]

const notificationSettings = [
  {
    id: "email",
    name: "Email Notifications",
    description: "Receive alerts via email",
    icon: Mail,
    enabled: true,
  },
  {
    id: "sms",
    name: "SMS Alerts",
    description: "Critical alerts via SMS",
    icon: Smartphone,
    enabled: true,
  },
  {
    id: "push",
    name: "Push Notifications",
    description: "Browser push notifications",
    icon: Bell,
    enabled: false,
  },
  {
    id: "slack",
    name: "Slack Integration",
    description: "Team notifications via Slack",
    icon: MessageSquare,
    enabled: false,
  },
]

export default function AlertsPage() {
  const [settings, setSettings] = useState(notificationSettings)

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "destructive"
      case "high":
        return "default"
      case "medium":
        return "secondary"
      default:
        return "outline"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "destructive"
      case "acknowledged":
        return "default"
      case "investigating":
        return "secondary"
      case "resolved":
        return "outline"
      case "false-positive":
        return "outline"
      default:
        return "outline"
    }
  }

  return (
    <div className="flex h-screen bg-background">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Smart Alerts System</h1>
                <p className="text-muted-foreground mt-2">
                  Real-time monitoring and intelligent notifications for pollution events
                </p>
              </div>
              <Button variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                Configure Thresholds
              </Button>
            </div>

            {/* Alert Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Active Alerts</p>
                      <p className="text-2xl font-bold text-destructive">3</p>
                    </div>
                    <AlertTriangle className="h-8 w-8 text-destructive" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">This Week</p>
                      <p className="text-2xl font-bold">12</p>
                    </div>
                    <Clock className="h-8 w-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Resolved</p>
                      <p className="text-2xl font-bold text-green-600">8</p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Response Time</p>
                      <p className="text-2xl font-bold">12m</p>
                    </div>
                    <Bell className="h-8 w-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="active" className="space-y-6">
              <TabsList>
                <TabsTrigger value="active">Active Alerts</TabsTrigger>
                <TabsTrigger value="history">Alert History</TabsTrigger>
                <TabsTrigger value="settings">Notification Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="active" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Active Alerts</CardTitle>
                    <CardDescription>Current pollution alerts requiring attention</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {activeAlerts.map((alert) => (
                        <div key={alert.id} className="flex items-start justify-between p-4 border rounded-lg">
                          <div className="flex items-start gap-4">
                            <AlertTriangle className="h-5 w-5 text-destructive mt-1" />
                            <div className="flex-1">
                              <h4 className="font-medium">{alert.title}</h4>
                              <p className="text-sm text-muted-foreground mt-1">{alert.description}</p>
                              <div className="flex items-center gap-4 mt-2">
                                <span className="text-xs text-muted-foreground">{alert.location}</span>
                                <span className="text-xs text-muted-foreground">{alert.timestamp}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={getSeverityColor(alert.severity)}>{alert.severity}</Badge>
                            <Badge variant={getStatusColor(alert.status)}>{alert.status}</Badge>
                            <Button variant="outline" size="sm">
                              Acknowledge
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="history" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Alert History</CardTitle>
                    <CardDescription>Previously resolved and closed alerts</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {alertHistory.map((alert) => (
                        <div
                          key={alert.id}
                          className="flex items-start justify-between p-4 border rounded-lg opacity-75"
                        >
                          <div className="flex items-start gap-4">
                            <CheckCircle className="h-5 w-5 text-green-600 mt-1" />
                            <div className="flex-1">
                              <h4 className="font-medium">{alert.title}</h4>
                              <p className="text-sm text-muted-foreground mt-1">{alert.description}</p>
                              <div className="flex items-center gap-4 mt-2">
                                <span className="text-xs text-muted-foreground">{alert.location}</span>
                                <span className="text-xs text-muted-foreground">Resolved: {alert.resolvedAt}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={getSeverityColor(alert.severity)}>{alert.severity}</Badge>
                            <Badge variant={getStatusColor(alert.status)}>{alert.status}</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="settings" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Notification Preferences</CardTitle>
                    <CardDescription>Configure how and when you receive alerts</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      {settings.map((setting) => (
                        <div key={setting.id} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <setting.icon className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <Label className="font-medium">{setting.name}</Label>
                              <p className="text-sm text-muted-foreground">{setting.description}</p>
                            </div>
                          </div>
                          <Switch
                            checked={setting.enabled}
                            onCheckedChange={(checked) => {
                              setSettings(settings.map((s) => (s.id === setting.id ? { ...s, enabled: checked } : s)))
                            }}
                          />
                        </div>
                      ))}
                    </div>

                    <div className="border-t pt-6">
                      <h4 className="font-medium mb-4">Alert Thresholds</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="critical-threshold">Critical HMPI Threshold</Label>
                          <Input id="critical-threshold" type="number" placeholder="6.0" className="mt-1" />
                        </div>
                        <div>
                          <Label htmlFor="high-threshold">High Risk Threshold</Label>
                          <Input id="high-threshold" type="number" placeholder="4.0" className="mt-1" />
                        </div>
                      </div>
                    </div>

                    <Button className="w-full">Save Notification Settings</Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  )
}

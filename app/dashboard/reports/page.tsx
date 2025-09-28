"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { CalendarIcon, Download, FileText, CheckCircle, Clock } from "lucide-react"
import { format } from "date-fns"

const reportTemplates = [
  {
    id: "comprehensive",
    name: "Comprehensive HMPI Report",
    description: "Complete analysis with all metrics, trends, and recommendations",
    duration: "5-10 min",
    format: ["PDF", "Excel"],
  },
  {
    id: "executive",
    name: "Executive Summary",
    description: "High-level overview for decision makers",
    duration: "2-3 min",
    format: ["PDF"],
  },
  {
    id: "technical",
    name: "Technical Analysis",
    description: "Detailed scientific data and methodology",
    duration: "3-5 min",
    format: ["PDF", "Excel", "CSV"],
  },
  {
    id: "compliance",
    name: "Regulatory Compliance",
    description: "Standards comparison and compliance status",
    duration: "2-4 min",
    format: ["PDF"],
  },
]

const recentReports = [
  {
    id: 1,
    name: "Monthly HMPI Analysis - December 2024",
    type: "Comprehensive",
    status: "completed",
    createdAt: "2024-12-15",
    downloadUrl: "#",
  },
  {
    id: 2,
    name: "Emergency Alert Report - Site A47",
    type: "Technical",
    status: "completed",
    createdAt: "2024-12-14",
    downloadUrl: "#",
  },
  {
    id: 3,
    name: "Quarterly Compliance Review",
    type: "Compliance",
    status: "processing",
    createdAt: "2024-12-13",
    downloadUrl: "#",
  },
]

export default function ReportsPage() {
  const [selectedTemplate, setSelectedTemplate] = useState("")
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  })
  const [selectedFormat, setSelectedFormat] = useState("")

  return (
    <div className="flex h-screen bg-background">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Reports & Documentation</h1>
              <p className="text-muted-foreground mt-2">Generate comprehensive reports and export data for analysis</p>
            </div>

            {/* Report Generation */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Generate New Report
                    </CardTitle>
                    <CardDescription>Create custom reports based on your data and requirements</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <label className="text-sm font-medium mb-3 block">Report Template</label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {reportTemplates.map((template) => (
                          <Card
                            key={template.id}
                            className={cn(
                              "cursor-pointer transition-colors hover:bg-accent",
                              selectedTemplate === template.id && "ring-2 ring-primary",
                            )}
                            onClick={() => setSelectedTemplate(template.id)}
                          >
                            <CardContent className="p-4">
                              <h4 className="font-medium">{template.name}</h4>
                              <p className="text-sm text-muted-foreground mt-1">{template.description}</p>
                              <div className="flex items-center justify-between mt-3">
                                <Badge variant="secondary" className="text-xs">
                                  <Clock className="h-3 w-3 mr-1" />
                                  {template.duration}
                                </Badge>
                                <div className="flex gap-1">
                                  {template.format.map((fmt) => (
                                    <Badge key={fmt} variant="outline" className="text-xs">
                                      {fmt}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Date Range</label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !dateRange.from && "text-muted-foreground",
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {dateRange.from ? (
                                dateRange.to ? (
                                  <>
                                    {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
                                  </>
                                ) : (
                                  format(dateRange.from, "LLL dd, y")
                                )
                              ) : (
                                <span>Pick a date range</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              initialFocus
                              mode="range"
                              defaultMonth={dateRange.from}
                              selected={dateRange}
                              onSelect={setDateRange}
                              numberOfMonths={2}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block">Export Format</label>
                        <Select value={selectedFormat} onValueChange={setSelectedFormat}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select format" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pdf">PDF Document</SelectItem>
                            <SelectItem value="excel">Excel Spreadsheet</SelectItem>
                            <SelectItem value="csv">CSV Data</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <Button className="w-full" size="lg">
                      <Download className="h-4 w-4 mr-2" />
                      Generate Report
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Stats</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Reports Generated</span>
                      <span className="font-semibold">247</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">This Month</span>
                      <span className="font-semibold">18</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Avg. Generation Time</span>
                      <span className="font-semibold">3.2 min</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Success Rate</span>
                      <span className="font-semibold text-green-600">99.2%</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Recent Reports */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Reports</CardTitle>
                <CardDescription>Your recently generated reports and their status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentReports.map((report) => (
                    <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <FileText className="h-8 w-8 text-muted-foreground" />
                        <div>
                          <h4 className="font-medium">{report.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {report.type} • Created {report.createdAt}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant={report.status === "completed" ? "default" : "secondary"} className="capitalize">
                          {report.status === "completed" && <CheckCircle className="h-3 w-3 mr-1" />}
                          {report.status === "processing" && <Clock className="h-3 w-3 mr-1" />}
                          {report.status}
                        </Badge>
                        {report.status === "completed" && (
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}

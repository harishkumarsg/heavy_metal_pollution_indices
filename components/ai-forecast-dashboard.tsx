"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
} from "recharts"
import { Brain, TrendingUp, AlertTriangle, Calendar, RefreshCw } from "lucide-react"

const forecastData = [
  { month: "Jan", actual: 65, predicted: 68, confidence: 85 },
  { month: "Feb", actual: 72, predicted: 75, confidence: 82 },
  { month: "Mar", actual: 68, predicted: 71, confidence: 88 },
  { month: "Apr", actual: 75, predicted: 78, confidence: 84 },
  { month: "May", actual: 82, predicted: 85, confidence: 79 },
  { month: "Jun", actual: null, predicted: 88, confidence: 76 },
  { month: "Jul", actual: null, predicted: 92, confidence: 73 },
  { month: "Aug", actual: null, predicted: 89, confidence: 70 },
  { month: "Sep", actual: null, predicted: 85, confidence: 68 },
  { month: "Oct", actual: null, predicted: 81, confidence: 65 },
]

const riskFactors = [
  { factor: "Industrial Discharge", impact: 85, trend: "increasing" },
  { factor: "Monsoon Runoff", impact: 72, trend: "seasonal" },
  { factor: "Agricultural Runoff", impact: 68, trend: "stable" },
  { factor: "Urban Waste", impact: 55, trend: "increasing" },
  { factor: "Mining Activities", impact: 43, trend: "decreasing" },
]

const modelPerformance = [
  { model: "LSTM Neural Network", accuracy: 87.3, lastTrained: "2025-01-25" },
  { model: "Random Forest", accuracy: 82.1, lastTrained: "2025-01-24" },
  { model: "XGBoost", accuracy: 84.7, lastTrained: "2025-01-23" },
  { model: "Linear Regression", accuracy: 76.2, lastTrained: "2025-01-22" },
]

export function AIForecastDashboard() {
  const [selectedLocation, setSelectedLocation] = useState("Delhi Yamuna")
  const [forecastPeriod, setForecastPeriod] = useState("6months")
  const [isTraining, setIsTraining] = useState(false)

  const retrainModel = async () => {
    setIsTraining(true)
    // Simulate model retraining
    await new Promise((resolve) => setTimeout(resolve, 3000))
    setIsTraining(false)
  }

  return (
    <Card className="bg-card/80 backdrop-blur-sm border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              AI Pollution Forecasting
            </CardTitle>
            <CardDescription>
              Machine learning predictions based on historical data and environmental factors
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Delhi Yamuna">Delhi Yamuna</SelectItem>
                <SelectItem value="Mumbai Mithi">Mumbai Mithi</SelectItem>
                <SelectItem value="Kolkata Hooghly">Kolkata Hooghly</SelectItem>
                <SelectItem value="Chennai Marina">Chennai Marina</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" onClick={retrainModel} disabled={isTraining}>
              <RefreshCw className={`h-4 w-4 mr-2 ${isTraining ? "animate-spin" : ""}`} />
              {isTraining ? "Training..." : "Retrain"}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="forecast" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="forecast">Pollution Forecast</TabsTrigger>
            <TabsTrigger value="factors">Risk Factors</TabsTrigger>
            <TabsTrigger value="models">Model Performance</TabsTrigger>
          </TabsList>

          <TabsContent value="forecast" className="space-y-6">
            {/* Forecast Controls */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Forecast Period:</span>
              </div>
              <Select value={forecastPeriod} onValueChange={setForecastPeriod}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3months">3 Months</SelectItem>
                  <SelectItem value="6months">6 Months</SelectItem>
                  <SelectItem value="1year">1 Year</SelectItem>
                </SelectContent>
              </Select>
              <Badge variant="outline" className="ml-auto">
                Model Accuracy: 87.3%
              </Badge>
            </div>

            {/* Main Forecast Chart */}
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={forecastData}>
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
                  <Line
                    type="monotone"
                    dataKey="actual"
                    stroke="rgb(var(--primary))"
                    strokeWidth={3}
                    name="Actual HMPI"
                    connectNulls={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="predicted"
                    stroke="rgb(var(--chart-2))"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    name="AI Prediction"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Confidence Interval */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Prediction Confidence</h4>
              <div className="h-20">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={forecastData}>
                    <XAxis dataKey="month" fontSize={10} />
                    <YAxis domain={[0, 100]} fontSize={10} />
                    <Area
                      type="monotone"
                      dataKey="confidence"
                      stroke="rgb(var(--chart-3))"
                      fill="rgb(var(--chart-3))"
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Key Predictions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-red-500/10 rounded-lg border border-red-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                  <span className="text-sm font-medium">Peak Risk Period</span>
                </div>
                <div className="text-lg font-bold text-red-500">July 2025</div>
                <div className="text-xs text-muted-foreground">HMPI predicted to reach 92</div>
              </div>

              <div className="p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm font-medium">Trend Direction</span>
                </div>
                <div className="text-lg font-bold text-yellow-500">Increasing</div>
                <div className="text-xs text-muted-foreground">+15% over next 6 months</div>
              </div>

              <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <Brain className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium">Model Confidence</span>
                </div>
                <div className="text-lg font-bold text-blue-500">76%</div>
                <div className="text-xs text-muted-foreground">Average for forecast period</div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="factors" className="space-y-6">
            <div className="space-y-4">
              <h4 className="text-sm font-medium">Environmental Risk Factors</h4>
              {riskFactors.map((factor, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{factor.factor}</span>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          factor.trend === "increasing"
                            ? "destructive"
                            : factor.trend === "decreasing"
                              ? "default"
                              : "secondary"
                        }
                        className="text-xs"
                      >
                        {factor.trend}
                      </Badge>
                      <span className="text-sm font-medium">{factor.impact}%</span>
                    </div>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${factor.impact}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Factor Impact Chart */}
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={riskFactors} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--border))" />
                  <XAxis type="number" domain={[0, 100]} fontSize={12} />
                  <YAxis dataKey="factor" type="category" width={120} fontSize={10} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgb(var(--card))",
                      border: "1px solid rgb(var(--border))",
                      borderRadius: "6px",
                    }}
                  />
                  <Bar dataKey="impact" fill="rgb(var(--primary))" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="models" className="space-y-6">
            <div className="space-y-4">
              <h4 className="text-sm font-medium">ML Model Performance</h4>
              {modelPerformance.map((model, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <div className="font-medium text-sm">{model.model}</div>
                    <div className="text-xs text-muted-foreground">Last trained: {model.lastTrained}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-lg">{model.accuracy}%</div>
                    <div className="text-xs text-muted-foreground">Accuracy</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Model Training Status */}
            <div className="bg-muted/50 rounded-lg p-4">
              <h4 className="text-sm font-medium mb-3">Training Status</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Data Points Used:</span>
                  <span className="font-medium">12,847</span>
                </div>
                <div className="flex justify-between">
                  <span>Training Duration:</span>
                  <span className="font-medium">2.3 hours</span>
                </div>
                <div className="flex justify-between">
                  <span>Cross-Validation Score:</span>
                  <span className="font-medium">0.873</span>
                </div>
                <div className="flex justify-between">
                  <span>Next Scheduled Training:</span>
                  <span className="font-medium">2025-01-30</span>
                </div>
              </div>
            </div>

            {/* Feature Importance */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium">Feature Importance</h4>
              <div className="space-y-2">
                {[
                  { feature: "Historical HMPI", importance: 0.35 },
                  { feature: "Industrial Activity", importance: 0.28 },
                  { feature: "Weather Patterns", importance: 0.18 },
                  { feature: "Seasonal Factors", importance: 0.12 },
                  { feature: "Population Density", importance: 0.07 },
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <span className="text-sm w-32">{item.feature}</span>
                    <div className="flex-1 bg-secondary rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: `${item.importance * 100}%` }}></div>
                    </div>
                    <span className="text-sm font-medium w-12">{(item.importance * 100).toFixed(0)}%</span>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

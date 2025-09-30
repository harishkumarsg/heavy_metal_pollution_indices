"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Brain, TrendingUp, Calendar, Target, AlertCircle, CheckCircle, Clock, Zap } from "lucide-react"

// Generate prediction data
const generatePredictionData = (days: number, baseValue: number, trend: 'increasing' | 'decreasing' | 'stable') => {
  const data = []
  let currentValue = baseValue
  
  for (let i = 0; i < days; i++) {
    let change = 0
    if (trend === 'increasing') {
      change = Math.random() * 5 + 2
    } else if (trend === 'decreasing') {
      change = -(Math.random() * 3 + 1)
    } else {
      change = (Math.random() - 0.5) * 4
    }
    
    currentValue = Math.max(0, currentValue + change + Math.sin(i * 0.1) * 3)
    
    const confidence = Math.max(60, 95 - (i * 0.5))
    
    data.push({
      date: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      }),
      predicted: Math.round(currentValue * 100) / 100,
      upperBound: Math.round((currentValue + (currentValue * 0.2)) * 100) / 100,
      lowerBound: Math.round((currentValue - (currentValue * 0.15)) * 100) / 100,
      confidence: Math.round(confidence),
      day: i + 1
    })
  }
  
  return data
}

const predictionModels = [
  {
    name: "HMPI Forecast",
    type: "Neural Network",
    accuracy: 92.5,
    confidence: 87,
    timeframe: "30 days",
    status: "active",
    lastUpdate: "2 hours ago",
    predictions: generatePredictionData(30, 85, 'increasing'),
    factors: ["Industrial discharge", "Rainfall patterns", "Temperature", "Seasonal trends"]
  },
  {
    name: "Lead Concentration",
    type: "LSTM Model",
    accuracy: 89.3,
    confidence: 84,
    timeframe: "14 days", 
    status: "active",
    lastUpdate: "1 hour ago",
    predictions: generatePredictionData(14, 45, 'stable'),
    factors: ["Mining activity", "Water flow", "pH levels", "Treatment efficiency"]
  },
  {
    name: "Mercury Levels",
    type: "Random Forest",
    accuracy: 86.7,
    confidence: 79,
    timeframe: "21 days",
    status: "training",
    lastUpdate: "6 hours ago", 
    predictions: generatePredictionData(21, 32, 'decreasing'),
    factors: ["Industrial output", "Wind patterns", "Precipitation", "Remediation efforts"]
  },
  {
    name: "Cadmium Trends",
    type: "Ensemble Model",
    accuracy: 91.2,
    confidence: 88,
    timeframe: "45 days",
    status: "active",
    lastUpdate: "30 minutes ago",
    predictions: generatePredictionData(45, 28, 'increasing'),
    factors: ["Agricultural runoff", "Urban expansion", "Waste management", "Regulatory compliance"]
  }
]

const modelMetrics = [
  { metric: "Mean Absolute Error", value: "±3.2 HMPI units", status: "good" },
  { metric: "Root Mean Square Error", value: "4.7 HMPI units", status: "excellent" },
  { metric: "R² Score", value: "0.923", status: "excellent" },
  { metric: "Prediction Interval Coverage", value: "87%", status: "good" },
  { metric: "False Positive Rate", value: "4.2%", status: "excellent" },
  { metric: "Alert Accuracy", value: "94.8%", status: "excellent" }
]

const scenarioAnalysis = [
  {
    scenario: "Best Case",
    probability: 15,
    description: "Optimal weather, reduced industrial activity, effective remediation",
    hmpiChange: -25,
    timeframe: "3 months",
    color: "text-green-500"
  },
  {
    scenario: "Most Likely", 
    probability: 60,
    description: "Current trends continue, moderate regulatory compliance",
    hmpiChange: +8,
    timeframe: "3 months",
    color: "text-yellow-500"
  },
  {
    scenario: "Worst Case",
    probability: 25,
    description: "Heavy monsoon, increased industrial discharge, system failures",
    hmpiChange: +45,
    timeframe: "3 months", 
    color: "text-red-500"
  }
]

export function PredictiveModel() {
  const [selectedModel, setSelectedModel] = useState("HMPI Forecast")
  const [activeTab, setActiveTab] = useState("predictions")
  const [timeframe, setTimeframe] = useState("30")
  
  const currentModel = predictionModels.find(m => m.name === selectedModel) || predictionModels[0]
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="default" className="bg-green-500/10 text-green-600 border-green-500/20">Active</Badge>
      case "training":
        return <Badge variant="secondary" className="bg-blue-500/10 text-blue-600 border-blue-500/20">Training</Badge>
      case "inactive":
        return <Badge variant="outline">Inactive</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }
  
  const getMetricStatus = (status: string) => {
    switch (status) {
      case "excellent":
        return "text-green-500"
      case "good":
        return "text-blue-500"
      case "warning":
        return "text-yellow-500"
      default:
        return "text-red-500"
    }
  }

  return (
    <Card className="bg-card/80 backdrop-blur-sm border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          Predictive Models
        </CardTitle>
        <CardDescription>
          AI-powered pollution forecasting and trend analysis
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Model Selector */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium">Active Models</h4>
            <Select value={selectedModel} onValueChange={setSelectedModel}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select model" />
              </SelectTrigger>
              <SelectContent>
                {predictionModels.map((model) => (
                  <SelectItem key={model.name} value={model.name}>
                    {model.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Model Overview */}
          <div className="p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h5 className="font-medium text-sm">{currentModel.name}</h5>
                <p className="text-xs text-muted-foreground">{currentModel.type} • Updated {currentModel.lastUpdate}</p>
              </div>
              {getStatusBadge(currentModel.status)}
            </div>
            
            <div className="grid grid-cols-3 gap-3 mt-3">
              <div className="text-center">
                <div className="text-lg font-bold text-green-500">{currentModel.accuracy}%</div>
                <div className="text-xs text-muted-foreground">Accuracy</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-blue-500">{currentModel.confidence}%</div>
                <div className="text-xs text-muted-foreground">Confidence</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-purple-500">{currentModel.timeframe}</div>
                <div className="text-xs text-muted-foreground">Forecast</div>
              </div>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="predictions">Predictions</TabsTrigger>
            <TabsTrigger value="scenarios">Scenarios</TabsTrigger>
            <TabsTrigger value="accuracy">Accuracy</TabsTrigger>
            <TabsTrigger value="factors">Factors</TabsTrigger>
          </TabsList>

          <TabsContent value="predictions" className="space-y-4">
            {/* Prediction Chart */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium">Forecast Timeline</h4>
                <Select value={timeframe} onValueChange={setTimeframe}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">7 days</SelectItem>
                    <SelectItem value="14">14 days</SelectItem>
                    <SelectItem value="30">30 days</SelectItem>
                    <SelectItem value="60">60 days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={currentModel.predictions.slice(0, parseInt(timeframe))}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date"
                      fontSize={10}
                      tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    />
                    <YAxis 
                      fontSize={10}
                      tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--background))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="upperBound"
                      stroke="hsl(var(--primary))"
                      fill="hsl(var(--primary))"
                      fillOpacity={0.1}
                      name="Upper Confidence"
                    />
                    <Area
                      type="monotone"
                      dataKey="lowerBound"
                      stroke="hsl(var(--primary))"
                      fill="hsl(var(--primary))"
                      fillOpacity={0.1}
                      name="Lower Confidence"
                    />
                    <Line
                      type="monotone"
                      dataKey="predicted"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      name="Predicted Value"
                      dot={{ r: 3 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              
              {/* Prediction Summary */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="p-3 bg-blue-500/10 rounded-lg text-center">
                  <div className="text-sm font-bold text-blue-500">
                    {currentModel.predictions[parseInt(timeframe) - 1]?.predicted || "N/A"}
                  </div>
                  <div className="text-xs text-muted-foreground">Final Prediction</div>
                </div>
                <div className="p-3 bg-green-500/10 rounded-lg text-center">
                  <div className="text-sm font-bold text-green-500">
                    ±{Math.round((currentModel.predictions[parseInt(timeframe) - 1]?.upperBound - currentModel.predictions[parseInt(timeframe) - 1]?.predicted) || 0)}
                  </div>
                  <div className="text-xs text-muted-foreground">Uncertainty</div>
                </div>
                <div className="p-3 bg-purple-500/10 rounded-lg text-center">
                  <div className="text-sm font-bold text-purple-500">
                    {currentModel.predictions[parseInt(timeframe) - 1]?.confidence || "N/A"}%
                  </div>
                  <div className="text-xs text-muted-foreground">Confidence</div>
                </div>
                <div className="p-3 bg-orange-500/10 rounded-lg text-center">
                  <TrendingUp className="h-4 w-4 mx-auto text-orange-500 mb-1" />
                  <div className="text-xs text-muted-foreground">Trend: Rising</div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="scenarios" className="space-y-4">
            <div className="space-y-3">
              <h4 className="text-sm font-medium">Scenario Analysis</h4>
              {scenarioAnalysis.map((scenario, index) => (
                <div key={index} className="p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <h5 className="text-sm font-medium">{scenario.scenario}</h5>
                      <Badge variant="outline" className="text-xs">
                        {scenario.probability}% probability
                      </Badge>
                    </div>
                    <div className={`text-sm font-bold ${scenario.color}`}>
                      {scenario.hmpiChange > 0 ? '+' : ''}{scenario.hmpiChange} HMPI
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">{scenario.description}</p>
                  <Progress value={scenario.probability} className="h-1" />
                  <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                    <span>Timeframe: {scenario.timeframe}</span>
                    <span>{scenario.probability}% likelihood</span>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="accuracy" className="space-y-4">
            {/* Model Performance Metrics */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium">Model Performance</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {modelMetrics.map((metric, index) => (
                  <div key={index} className="p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">{metric.metric}</span>
                      <div className="flex items-center gap-1">
                        {metric.status === 'excellent' && <CheckCircle className="h-3 w-3 text-green-500" />}
                        {metric.status === 'good' && <Clock className="h-3 w-3 text-blue-500" />}
                        {metric.status === 'warning' && <AlertCircle className="h-3 w-3 text-yellow-500" />}
                      </div>
                    </div>
                    <div className={`text-lg font-bold ${getMetricStatus(metric.status)}`}>
                      {metric.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Training History */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium">Training History</h4>
              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={[
                    { epoch: 1, accuracy: 0.65, loss: 0.8 },
                    { epoch: 5, accuracy: 0.72, loss: 0.65 },
                    { epoch: 10, accuracy: 0.81, loss: 0.45 },
                    { epoch: 15, accuracy: 0.87, loss: 0.32 },
                    { epoch: 20, accuracy: 0.91, loss: 0.21 },
                    { epoch: 25, accuracy: 0.925, loss: 0.18 }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="epoch" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="accuracy" stroke="#10b981" name="Accuracy" />
                    <Line type="monotone" dataKey="loss" stroke="#f59e0b" name="Loss" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="factors" className="space-y-4">
            {/* Influencing Factors */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium">Key Influencing Factors</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {currentModel.factors.map((factor, index) => {
                  const importance = Math.random() * 40 + 60 // Random importance between 60-100
                  return (
                    <div key={index} className="p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">{factor}</span>
                        <Badge variant="outline" className="text-xs">
                          {Math.round(importance)}% impact
                        </Badge>
                      </div>
                      <Progress value={importance} className="h-1" />
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Factor Correlation Matrix */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium">Factor Correlations</h4>
              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[
                    { factor: "Industrial", positive: 0.8, negative: -0.2 },
                    { factor: "Weather", positive: 0.3, negative: -0.6 },
                    { factor: "Seasonal", positive: 0.5, negative: -0.4 },
                    { factor: "Treatment", positive: 0.1, negative: -0.9 },
                    { factor: "Regulatory", positive: 0.2, negative: -0.7 }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="factor" />
                    <YAxis domain={[-1, 1]} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="positive" fill="#10b981" name="Positive Impact" />
                    <Bar dataKey="negative" fill="#ef4444" name="Negative Impact" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <Button variant="outline" className="w-full">
            <Target className="h-4 w-4 mr-2" />
            Retrain Model
          </Button>
          <Button variant="outline" className="w-full">
            <Calendar className="h-4 w-4 mr-2" />
            Schedule Report
          </Button>
          <Button variant="default" className="w-full">
            <Zap className="h-4 w-4 mr-2" />
            Export Predictions
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
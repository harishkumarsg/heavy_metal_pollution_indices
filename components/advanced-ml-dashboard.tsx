"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Progress } from "@/components/ui/progress"
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, Area, AreaChart
} from "recharts"
import { 
  Brain, Zap, TrendingUp, Target, AlertTriangle, Info, RefreshCw, 
  Settings, BarChart3, Activity, Clock, Award
} from "lucide-react"
import { useRealTimeData } from "@/contexts/real-time-data-context"
import { advancedMLService, ForecastResult, AnomalyResult } from "@/services/advanced-ml"

export function AdvancedMLDashboard() {
  const [selectedModel, setSelectedModel] = useState("ensemble")
  const [forecastHorizon, setForecastHorizon] = useState([7])
  const [confidenceLevel, setConfidenceLevel] = useState([95])
  const [isLoading, setIsLoading] = useState(false)
  
  const { state } = useRealTimeData()
  const [mlResults, setMLResults] = useState<ForecastResult[]>([])
  const [ensembleResult, setEnsembleResult] = useState<ForecastResult | null>(null)
  const [anomalies, setAnomalies] = useState<AnomalyResult[]>([])
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  // Run ML analysis when data changes
  useEffect(() => {
    runMLAnalysis()
  }, [state.historicalData, forecastHorizon[0]])

  const runMLAnalysis = async () => {
    if (!state.historicalData.length) return
    
    setIsLoading(true)
    try {
      // Get forecasts from all models
      const results = await advancedMLService.getAllForecasts(
        state.historicalData, 
        forecastHorizon[0]
      )
      
      // Create ensemble forecast
      const ensemble = advancedMLService.createEnsembleForecast(results)
      
      // Detect anomalies
      const detectedAnomalies = advancedMLService.detectAnomalies(state.historicalData)
      
      setMLResults(results)
      setEnsembleResult(ensemble)
      setAnomalies(detectedAnomalies)
      setLastUpdated(new Date())
      
    } catch (error) {
      console.error('ML Analysis failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Prepare chart data combining historical and predictions
  const chartData = useMemo(() => {
    const historical = state.historicalData.slice(-30).map(d => ({
      date: d.timestamp.toLocaleDateString(),
      actual: d.hmpi,
      type: 'historical'
    }))

    const selectedForecast = selectedModel === 'ensemble' ? ensembleResult : 
      mlResults.find(r => r.model.type.toLowerCase() === selectedModel)

    const predictions = selectedForecast?.predictions.map(p => ({
      date: p.timestamp.toLocaleDateString(),
      predicted: p.value,
      confidence_lower: p.confidence_lower,
      confidence_upper: p.confidence_upper,
      type: 'forecast'
    })) || []

    return [...historical, ...predictions]
  }, [state.historicalData, mlResults, ensembleResult, selectedModel])

  // Model comparison data
  const modelComparison = useMemo(() => {
    return mlResults.map(result => ({
      model: result.model.name,
      accuracy: result.model.accuracy * 100,
      r2: result.metrics.r2 * 100,
      mae: result.metrics.mae,
      rmse: result.metrics.rmse
    }))
  }, [mlResults])

  // Feature importance data
  const featureImportance = useMemo(() => {
    const selectedForecast = selectedModel === 'ensemble' ? ensembleResult : 
      mlResults.find(r => r.model.type.toLowerCase() === selectedModel)
    
    if (!selectedForecast?.predictions.length) return []
    
    const importance = selectedForecast.predictions[0].feature_importance || {}
    return Object.entries(importance).map(([feature, value]) => ({
      feature: feature.replace(/_/g, ' '),
      importance: value * 100
    })).sort((a, b) => b.importance - a.importance)
  }, [mlResults, ensembleResult, selectedModel])

  const getModelBadgeColor = (modelType: string) => {
    switch (modelType.toLowerCase()) {
      case 'lstm': return 'bg-purple-500'
      case 'prophet': return 'bg-blue-500'  
      case 'xgboost': return 'bg-green-500'
      default: return 'bg-orange-500'
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-50'
      case 'high': return 'text-orange-600 bg-orange-50'
      case 'medium': return 'text-yellow-600 bg-yellow-50'
      case 'low': return 'text-blue-600 bg-blue-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Brain className="w-6 h-6 text-purple-500" />
            Advanced ML Forecasting Engine
          </h2>
          <p className="text-muted-foreground">
            LSTM, Prophet, and XGBoost models for pollution prediction
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="bg-green-50">
            <Activity className="w-3 h-3 mr-1" />
            {mlResults.length} Models Active
          </Badge>
          <Button 
            onClick={runMLAnalysis} 
            disabled={isLoading}
            size="sm"
            className="gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'Training...' : 'Retrain Models'}
          </Button>
        </div>
      </div>

      {/* Control Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Settings className="w-5 h-5" />
            ML Configuration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <label className="text-sm font-medium mb-2 block">Model Selection</label>
              <Select value={selectedModel} onValueChange={setSelectedModel}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ensemble">🤖 Ensemble Model</SelectItem>
                  <SelectItem value="lstm">🧠 LSTM Neural Network</SelectItem>
                  <SelectItem value="prophet">📈 Facebook Prophet</SelectItem>
                  <SelectItem value="xgboost">🌳 XGBoost</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">
                Forecast Horizon: {forecastHorizon[0]} days
              </label>
              <Slider
                value={forecastHorizon}
                onValueChange={setForecastHorizon}
                max={30}
                min={3}
                step={1}
                className="mt-2"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Confidence: {confidenceLevel[0]}%
              </label>
              <Slider
                value={confidenceLevel}
                onValueChange={setConfidenceLevel}
                max={99}
                min={80}
                step={5}
                className="mt-2"
              />
            </div>

            <div className="flex flex-col justify-end">
              {lastUpdated && (
                <div className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Updated {lastUpdated.toLocaleTimeString()}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="forecasts" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="forecasts">🔮 Forecasts</TabsTrigger>
          <TabsTrigger value="models">📊 Model Performance</TabsTrigger>
          <TabsTrigger value="features">🎯 Feature Importance</TabsTrigger>
          <TabsTrigger value="anomalies">⚠️ Anomaly Detection</TabsTrigger>
        </TabsList>

        {/* Forecasting Tab */}
        <TabsContent value="forecasts" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Main Forecast Chart */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Pollution Forecast</span>
                  <Badge className={getModelBadgeColor(selectedModel)}>
                    {selectedModel === 'ensemble' ? 'Ensemble' : 
                     mlResults.find(r => r.model.type.toLowerCase() === selectedModel)?.model.name || selectedModel}
                  </Badge>
                </CardTitle>
                <CardDescription>
                  Historical data vs ML predictions with confidence intervals
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--border))" />
                      <XAxis 
                        dataKey="date" 
                        tick={{ fontSize: 11, fill: 'rgb(var(--muted-foreground))' }}
                      />
                      <YAxis 
                        tick={{ fontSize: 11, fill: 'rgb(var(--muted-foreground))' }}
                        label={{ value: 'HMPI', angle: -90, position: 'insideLeft' }}
                      />
                      <Tooltip />
                      
                      {/* Historical data */}
                      <Line
                        type="monotone"
                        dataKey="actual"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        dot={{ r: 3 }}
                        connectNulls={false}
                      />
                      
                      {/* Predictions */}
                      <Line
                        type="monotone"
                        dataKey="predicted"
                        stroke="#ef4444"
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        dot={{ r: 4, fill: '#ef4444' }}
                        connectNulls={false}
                      />

                      {/* Confidence intervals */}
                      <Area
                        type="monotone"
                        dataKey="confidence_upper"
                        stackId="1"
                        stroke="none"
                        fill="#ef444420"
                      />
                      <Area
                        type="monotone"
                        dataKey="confidence_lower"
                        stackId="1"
                        stroke="none"
                        fill="#ef444420"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Model Insights */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Model Insights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {(selectedModel === 'ensemble' ? ensembleResult : 
                  mlResults.find(r => r.model.type.toLowerCase() === selectedModel))?.insights.map((insight, index) => (
                  <div key={index} className="flex items-start gap-2 text-sm">
                    <Info className="w-4 h-4 mt-0.5 text-blue-500 flex-shrink-0" />
                    <span>{insight}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Model Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {mlResults.map(result => (
              <Card key={result.model.type} className="relative">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm">{result.model.name}</CardTitle>
                    {result.model.type === 'XGBoost' && (
                      <Badge variant="secondary" className="text-xs">
                        <Award className="w-3 h-3 mr-1" />
                        Best
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span>Accuracy</span>
                      <span className="font-medium">{(result.model.accuracy * 100).toFixed(1)}%</span>
                    </div>
                    <Progress value={result.model.accuracy * 100} className="h-2" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-muted-foreground">MAE:</span>
                      <span className="ml-1 font-medium">{result.metrics.mae.toFixed(1)}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">R²:</span>
                      <span className="ml-1 font-medium">{result.metrics.r2.toFixed(3)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Model Performance Tab */}
        <TabsContent value="models" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Model Accuracy Comparison</CardTitle>
                <CardDescription>Performance metrics across different ML algorithms</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={modelComparison}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--border))" />
                      <XAxis 
                        dataKey="model" 
                        tick={{ fontSize: 10, fill: 'rgb(var(--muted-foreground))' }}
                      />
                      <YAxis 
                        tick={{ fontSize: 10, fill: 'rgb(var(--muted-foreground))' }}
                      />
                      <Tooltip />
                      <Bar dataKey="accuracy" fill="#3b82f6" radius={[2, 2, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Error Metrics</CardTitle>
                <CardDescription>Lower values indicate better model performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={modelComparison}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--border))" />
                      <XAxis 
                        dataKey="model" 
                        tick={{ fontSize: 10, fill: 'rgb(var(--muted-foreground))' }}
                      />
                      <YAxis 
                        tick={{ fontSize: 10, fill: 'rgb(var(--muted-foreground))' }}
                      />
                      <Tooltip />
                      <Bar dataKey="mae" fill="#ef4444" radius={[2, 2, 0, 0]} />
                      <Bar dataKey="rmse" fill="#f59e0b" radius={[2, 2, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Feature Importance Tab */}
        <TabsContent value="features" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Feature Importance Analysis</CardTitle>
              <CardDescription>
                Factors that most influence pollution predictions in the selected model
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={featureImportance} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--border))" />
                    <XAxis 
                      type="number" 
                      tick={{ fontSize: 11, fill: 'rgb(var(--muted-foreground))' }}
                    />
                    <YAxis 
                      type="category"
                      dataKey="feature" 
                      tick={{ fontSize: 11, fill: 'rgb(var(--muted-foreground))' }}
                      width={120}
                    />
                    <Tooltip />
                    <Bar dataKey="importance" fill="#8b5cf6" radius={[0, 2, 2, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Anomaly Detection Tab */}
        <TabsContent value="anomalies" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Anomaly Detection Results</CardTitle>
              <CardDescription>
                AI-detected unusual patterns in pollution data
              </CardDescription>
            </CardHeader>
            <CardContent>
              {anomalies.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Target className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No anomalies detected in recent data</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {anomalies.slice(0, 10).map((anomaly, index) => (
                    <div 
                      key={index}
                      className={`p-4 rounded-lg border ${getSeverityColor(anomaly.severity)}`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="secondary" className={getSeverityColor(anomaly.severity)}>
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          {anomaly.severity.toUpperCase()}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {anomaly.timestamp.toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm">{anomaly.explanation}</p>
                      <div className="grid grid-cols-3 gap-4 mt-2 text-xs">
                        <div>
                          <span className="text-muted-foreground">Actual:</span>
                          <span className="ml-1 font-medium">{anomaly.actual_value.toFixed(1)}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Expected:</span>
                          <span className="ml-1 font-medium">{anomaly.expected_value.toFixed(1)}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Score:</span>
                          <span className="ml-1 font-medium">{anomaly.anomaly_score.toFixed(2)}σ</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
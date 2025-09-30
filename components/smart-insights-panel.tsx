"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  Lightbulb, Brain, TrendingUp, TrendingDown, AlertTriangle, Shield, 
  Target, Clock, Zap, RefreshCw, FileText, CheckCircle, 
  XCircle, Eye, BarChart3, Activity, Users, MapPin
} from "lucide-react"
import { useRealTimeData } from "@/contexts/real-time-data-context"
import { smartInsightsEngine, DataInsight, InsightsSummary } from "@/services/smart-insights"

export function SmartInsightsPanel() {
  const [insights, setInsights] = useState<DataInsight[]>([])
  const [summary, setSummary] = useState<InsightsSummary | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [lastAnalysis, setLastAnalysis] = useState<Date | null>(null)
  const [selectedInsight, setSelectedInsight] = useState<DataInsight | null>(null)
  
  const { state } = useRealTimeData()

  // Auto-analyze insights when data changes
  useEffect(() => {
    if (state.currentData.length > 0 || state.historicalData.length > 0) {
      analyzeData()
    }
  }, [state.currentData, state.historicalData])

  const analyzeData = async () => {
    setIsAnalyzing(true)
    try {
      const generatedInsights = await smartInsightsEngine.generateInsights(
        state.currentData, 
        state.historicalData
      )
      
      const insightsSummary = smartInsightsEngine.generateSummary(generatedInsights)
      
      setInsights(generatedInsights)
      setSummary(insightsSummary)
      setLastAnalysis(new Date())
      
    } catch (error) {
      console.error('Failed to analyze insights:', error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  // Group insights by type and severity
  const insightsByType = useMemo(() => {
    const grouped = insights.reduce((acc, insight) => {
      if (!acc[insight.type]) acc[insight.type] = []
      acc[insight.type].push(insight)
      return acc
    }, {} as { [key: string]: DataInsight[] })
    
    // Sort each group by severity and confidence
    Object.keys(grouped).forEach(type => {
      grouped[type].sort((a, b) => {
        const severityOrder = { urgent: 4, critical: 3, warning: 2, info: 1 }
        if (severityOrder[a.severity] !== severityOrder[b.severity]) {
          return severityOrder[b.severity] - severityOrder[a.severity]
        }
        return b.confidence - a.confidence
      })
    })
    
    return grouped
  }, [insights])

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'urgent': return <AlertTriangle className="w-4 h-4 text-red-600" />
      case 'critical': return <XCircle className="w-4 h-4 text-red-500" />
      case 'warning': return <AlertTriangle className="w-4 h-4 text-orange-500" />
      case 'info': return <Eye className="w-4 h-4 text-blue-500" />
      default: return <Eye className="w-4 h-4 text-gray-500" />
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200'
      case 'critical': return 'bg-red-50 text-red-700 border-red-200'
      case 'warning': return 'bg-orange-50 text-orange-700 border-orange-200'
      case 'info': return 'bg-blue-50 text-blue-700 border-blue-200'
      default: return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'trend': return <TrendingUp className="w-4 h-4" />
      case 'anomaly': return <Zap className="w-4 h-4" />
      case 'risk': return <Shield className="w-4 h-4" />
      case 'recommendation': return <Lightbulb className="w-4 h-4" />
      case 'correlation': return <BarChart3 className="w-4 h-4" />
      case 'forecast': return <Target className="w-4 h-4" />
      default: return <Brain className="w-4 h-4" />
    }
  }

  const getRiskLevelColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'critical': return 'bg-red-500'
      case 'high': return 'bg-orange-500'
      case 'medium': return 'bg-yellow-500'
      case 'low': return 'bg-green-500'
      default: return 'bg-gray-500'
    }
  }

  const getTrendIcon = (direction: string) => {
    switch (direction) {
      case 'improving': return <TrendingUp className="w-4 h-4 text-green-600" />
      case 'deteriorating': return <TrendingDown className="w-4 h-4 text-red-600" />
      case 'stable': return <Activity className="w-4 h-4 text-blue-600" />
      default: return <Activity className="w-4 h-4 text-gray-600" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Brain className="w-6 h-6 text-purple-500" />
            Smart Data Insights
          </h2>
          <p className="text-muted-foreground">
            AI-powered analysis and recommendations from pollution data
          </p>
        </div>
        <div className="flex items-center gap-3">
          {lastAnalysis && (
            <div className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Last analyzed: {lastAnalysis.toLocaleTimeString()}
            </div>
          )}
          <Button 
            onClick={analyzeData} 
            disabled={isAnalyzing}
            size="sm"
            className="gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isAnalyzing ? 'animate-spin' : ''}`} />
            {isAnalyzing ? 'Analyzing...' : 'Re-analyze'}
          </Button>
        </div>
      </div>

      {/* Summary Dashboard */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Overall Risk Level</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${getRiskLevelColor(summary.risk_level)}`} />
                <span className="text-2xl font-bold capitalize">{summary.risk_level}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Based on {summary.total_insights} insights
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Critical Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                <span className="text-2xl font-bold">{summary.critical_alerts}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Require immediate attention
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Trend Direction</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                {getTrendIcon(summary.trending_direction)}
                <span className="text-2xl font-bold capitalize">{summary.trending_direction}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Environmental conditions
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Improvements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <Lightbulb className="w-5 h-5 text-yellow-500" />
                <span className="text-2xl font-bold">{summary.improvement_opportunities}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Actionable opportunities
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Insights Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Insights List */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="all" className="space-y-4">
            <TabsList className="grid grid-cols-6 w-full">
              <TabsTrigger value="all">All ({insights.length})</TabsTrigger>
              <TabsTrigger value="risk">🚨 Risks ({insightsByType.risk?.length || 0})</TabsTrigger>
              <TabsTrigger value="trend">📈 Trends ({insightsByType.trend?.length || 0})</TabsTrigger>
              <TabsTrigger value="recommendation">💡 Actions ({insightsByType.recommendation?.length || 0})</TabsTrigger>
              <TabsTrigger value="correlation">🔗 Patterns ({insightsByType.correlation?.length || 0})</TabsTrigger>
              <TabsTrigger value="anomaly">⚡ Anomalies ({insightsByType.anomaly?.length || 0})</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              <ScrollArea className="h-96">
                <div className="space-y-3 pr-4">
                  {insights.map((insight, index) => (
                    <Card 
                      key={insight.id} 
                      className={`cursor-pointer transition-all hover:shadow-md border-l-4 ${
                        selectedInsight?.id === insight.id ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                      }`}
                      style={{ borderLeftColor: getSeverityColor(insight.severity).includes('red') ? '#ef4444' : 
                                                getSeverityColor(insight.severity).includes('orange') ? '#f97316' :
                                                getSeverityColor(insight.severity).includes('blue') ? '#3b82f6' : '#6b7280' }}
                      onClick={() => setSelectedInsight(insight)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3 flex-1">
                            <div className="flex items-center gap-2">
                              {getTypeIcon(insight.type)}
                              {getSeverityIcon(insight.severity)}
                            </div>
                            <div className="flex-1">
                              <h3 className="font-medium text-sm leading-tight mb-1">
                                {insight.title}
                              </h3>
                              <p className="text-xs text-muted-foreground line-clamp-2">
                                {insight.description}
                              </p>
                              <div className="flex items-center gap-2 mt-2">
                                <Badge variant="outline" className="text-xs">
                                  {insight.confidence}% confidence
                                </Badge>
                                {insight.location && (
                                  <Badge variant="outline" className="text-xs flex items-center gap-1">
                                    <MapPin className="w-3 h-3" />
                                    {insight.location}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {insight.timestamp.toLocaleTimeString()}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>

            {/* Type-specific tabs */}
            {Object.entries(insightsByType).map(([type, typeInsights]) => (
              <TabsContent key={type} value={type} className="space-y-4">
                <ScrollArea className="h-96">
                  <div className="space-y-3 pr-4">
                    {typeInsights.map((insight) => (
                      <Card 
                        key={insight.id}
                        className={`cursor-pointer transition-all hover:shadow-md ${
                          selectedInsight?.id === insight.id ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                        }`}
                        onClick={() => setSelectedInsight(insight)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-start gap-3 flex-1">
                              <div className="flex items-center gap-2">
                                {getTypeIcon(insight.type)}
                                {getSeverityIcon(insight.severity)}
                              </div>
                              <div className="flex-1">
                                <h3 className="font-medium text-sm leading-tight mb-1">
                                  {insight.title}
                                </h3>
                                <p className="text-xs text-muted-foreground line-clamp-2">
                                  {insight.description}
                                </p>
                              </div>
                            </div>
                            <Badge className={getSeverityColor(insight.severity)} variant="outline">
                              {insight.severity}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>
            ))}
          </Tabs>
        </div>

        {/* Detailed View */}
        <div>
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className="text-lg">Insight Details</CardTitle>
              <CardDescription>
                {selectedInsight ? 'Detailed analysis and recommendations' : 'Select an insight to view details'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedInsight ? (
                <div className="space-y-4">
                  {/* Header */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      {getTypeIcon(selectedInsight.type)}
                      <Badge className={getSeverityColor(selectedInsight.severity)} variant="outline">
                        {selectedInsight.severity}
                      </Badge>
                    </div>
                    <h3 className="font-medium text-sm leading-tight mb-2">
                      {selectedInsight.title}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {selectedInsight.description}
                    </p>
                  </div>

                  {/* Metrics */}
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-muted-foreground">Confidence:</span>
                      <div className="mt-1">
                        <Progress value={selectedInsight.confidence} className="h-2" />
                        <span className="text-xs font-medium">{selectedInsight.confidence}%</span>
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Impact:</span>
                      <Badge 
                        variant="outline" 
                        className={`ml-1 ${
                          selectedInsight.impact === 'critical' ? 'text-red-600' :
                          selectedInsight.impact === 'high' ? 'text-orange-600' :
                          selectedInsight.impact === 'medium' ? 'text-yellow-600' : 'text-green-600'
                        }`}
                      >
                        {selectedInsight.impact}
                      </Badge>
                    </div>
                  </div>

                  {/* Location */}
                  {selectedInsight.location && (
                    <div>
                      <span className="text-xs text-muted-foreground">Location:</span>
                      <div className="flex items-center gap-1 mt-1">
                        <MapPin className="w-3 h-3 text-muted-foreground" />
                        <span className="text-xs font-medium">{selectedInsight.location}</span>
                      </div>
                    </div>
                  )}

                  {/* Recommendations */}
                  {selectedInsight.recommendations && selectedInsight.recommendations.length > 0 && (
                    <div>
                      <h4 className="text-xs font-medium mb-2 flex items-center gap-1">
                        <Lightbulb className="w-3 h-3" />
                        Recommendations:
                      </h4>
                      <ScrollArea className="h-32">
                        <ul className="space-y-1 text-xs">
                          {selectedInsight.recommendations.map((rec, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <CheckCircle className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                              <span>{rec}</span>
                            </li>
                          ))}
                        </ul>
                      </ScrollArea>
                    </div>
                  )}

                  {/* Data Points */}
                  {selectedInsight.data_points && (
                    <div>
                      <h4 className="text-xs font-medium mb-2 flex items-center gap-1">
                        <BarChart3 className="w-3 h-3" />
                        Data Points:
                      </h4>
                      <div className="bg-muted p-2 rounded text-xs">
                        <pre className="whitespace-pre-wrap font-mono">
                          {JSON.stringify(selectedInsight.data_points, null, 2)}
                        </pre>
                      </div>
                    </div>
                  )}

                  {/* Timestamp */}
                  <div className="pt-2 border-t">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      Generated: {selectedInsight.timestamp.toLocaleString()}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Brain className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Click on any insight to view detailed analysis</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Key Factors Summary */}
      {summary && summary.key_factors.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Target className="w-5 h-5" />
              Key Environmental Factors
            </CardTitle>
            <CardDescription>
              Primary factors influencing pollution levels in your monitored areas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {summary.key_factors.map((factor, index) => (
                <div key={index} className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  <span className="text-sm font-medium">{factor}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Brain, AlertTriangle, TrendingUp, TrendingDown, 
  Lightbulb, Shield, Activity, ArrowRight
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useRealTimeData } from "@/contexts/real-time-data-context"
import { smartInsightsEngine, DataInsight } from "@/services/smart-insights"

export function SmartInsightsOverview() {
  const [criticalInsights, setCriticalInsights] = useState<DataInsight[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { state } = useRealTimeData()

  useEffect(() => {
    if (state.currentData.length > 0 && state.historicalData.length > 0) {
      generateQuickInsights()
    }
  }, [state.currentData, state.historicalData])

  const generateQuickInsights = async () => {
    setIsLoading(true)
    try {
      const insights = await smartInsightsEngine.generateInsights(
        state.currentData.slice(0, 3), // Quick analysis with limited data
        state.historicalData.slice(-20) // Last 20 historical points
      )
      
      // Show only critical and urgent insights for overview
      const critical = insights
        .filter(i => i.severity === 'critical' || i.severity === 'urgent' || i.type === 'recommendation')
        .slice(0, 3) // Top 3 most important
        
      setCriticalInsights(critical)
    } catch (error) {
      console.error('Quick insights generation failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'urgent':
      case 'critical':
        return <AlertTriangle className="w-4 h-4 text-red-500" />
      case 'warning':
        return <Shield className="w-4 h-4 text-orange-500" />
      default:
        return <Lightbulb className="w-4 h-4 text-blue-500" />
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'trend':
        return <TrendingUp className="w-4 h-4 text-green-500" />
      case 'recommendation':
        return <Lightbulb className="w-4 h-4 text-purple-500" />
      case 'risk':
        return <Shield className="w-4 h-4 text-red-500" />
      default:
        return <Brain className="w-4 h-4 text-blue-500" />
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-500" />
            AI Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
            <span className="ml-3 text-muted-foreground">Analyzing data...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <Brain className="w-5 h-5 text-purple-500" />
              AI Insights
            </CardTitle>
            <CardDescription>
              Smart analysis of pollution patterns and risks
            </CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => router.push('/dashboard/insights')}
            className="gap-2"
          >
            View All
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {criticalInsights.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            <Activity className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No critical insights at this time</p>
            <p className="text-xs">System monitoring for patterns...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {criticalInsights.map((insight, index) => (
              <div 
                key={insight.id}
                className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer"
                onClick={() => router.push('/dashboard/insights')}
              >
                <div className="flex items-center gap-2 mt-0.5">
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
                    {insight.actionable && (
                      <Badge variant="outline" className="text-xs bg-green-50 text-green-700">
                        Actionable
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {criticalInsights.length > 0 && (
              <div className="pt-2 border-t">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => router.push('/dashboard/insights')}
                  className="w-full gap-2 text-xs"
                >
                  <Brain className="w-3 h-3" />
                  View Full AI Analysis
                  <ArrowRight className="w-3 h-3" />
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
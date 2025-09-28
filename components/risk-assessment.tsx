"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { AlertTriangle, TrendingUp, TrendingDown, Minus } from "lucide-react"

const riskAssessments = [
  {
    location: "Delhi Yamuna",
    currentRisk: "High",
    riskScore: 85,
    trend: "increasing",
    timeframe: "Next 30 days",
    factors: ["Industrial discharge", "Monsoon season"],
    recommendation: "Immediate monitoring required",
  },
  {
    location: "Mumbai Mithi",
    currentRisk: "Medium",
    riskScore: 65,
    trend: "stable",
    timeframe: "Next 30 days",
    factors: ["Urban runoff", "Tidal influence"],
    recommendation: "Continue regular monitoring",
  },
  {
    location: "Chennai Marina",
    currentRisk: "Low",
    riskScore: 35,
    trend: "decreasing",
    timeframe: "Next 30 days",
    factors: ["Coastal dilution", "Reduced industrial activity"],
    recommendation: "Maintain current protocols",
  },
]

export function RiskAssessment() {
  const getRiskColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case "high":
        return "text-red-500"
      case "medium":
        return "text-yellow-500"
      case "low":
        return "text-green-500"
      default:
        return "text-muted-foreground"
    }
  }

  const getRiskBadge = (risk: string) => {
    switch (risk.toLowerCase()) {
      case "high":
        return <Badge variant="destructive">High Risk</Badge>
      case "medium":
        return (
          <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">
            Medium Risk
          </Badge>
        )
      case "low":
        return (
          <Badge variant="default" className="bg-green-500/10 text-green-600 border-green-500/20">
            Low Risk
          </Badge>
        )
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "increasing":
        return <TrendingUp className="h-4 w-4 text-red-500" />
      case "decreasing":
        return <TrendingDown className="h-4 w-4 text-green-500" />
      case "stable":
        return <Minus className="h-4 w-4 text-yellow-500" />
      default:
        return <Minus className="h-4 w-4 text-muted-foreground" />
    }
  }

  return (
    <Card className="bg-card/80 backdrop-blur-sm border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          Risk Assessment
        </CardTitle>
        <CardDescription>AI-powered contamination risk analysis</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {riskAssessments.map((assessment, index) => (
          <div key={index} className="p-3 bg-muted/50 rounded-lg space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-medium text-sm">{assessment.location}</h4>
                <p className="text-xs text-muted-foreground">{assessment.timeframe}</p>
              </div>
              {getRiskBadge(assessment.currentRisk)}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Risk Score</span>
                <div className="flex items-center gap-2">
                  {getTrendIcon(assessment.trend)}
                  <span className="font-medium">{assessment.riskScore}/100</span>
                </div>
              </div>
              <Progress value={assessment.riskScore} className="h-2" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-medium">Key Risk Factors:</span>
              <div className="flex flex-wrap gap-1">
                {assessment.factors.map((factor, i) => (
                  <Badge key={i} variant="outline" className="text-xs">
                    {factor}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="bg-background/50 rounded p-2">
              <span className="text-xs font-medium">Recommendation:</span>
              <p className="text-xs text-muted-foreground mt-1">{assessment.recommendation}</p>
            </div>
          </div>
        ))}

        {/* Overall Risk Summary */}
        <div className="pt-4 border-t border-border">
          <h4 className="text-sm font-medium mb-3">Overall Risk Distribution</h4>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2 bg-red-500/10 rounded">
              <div className="text-lg font-bold text-red-500">1</div>
              <div className="text-xs text-muted-foreground">High Risk</div>
            </div>
            <div className="p-2 bg-yellow-500/10 rounded">
              <div className="text-lg font-bold text-yellow-500">1</div>
              <div className="text-xs text-muted-foreground">Medium Risk</div>
            </div>
            <div className="p-2 bg-green-500/10 rounded">
              <div className="text-lg font-bold text-green-500">1</div>
              <div className="text-xs text-muted-foreground">Low Risk</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

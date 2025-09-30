"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertTriangle, TrendingUp, TrendingDown, Minus, Shield, Users, Heart, Zap, Info } from "lucide-react"
import { useRealTimeData } from "@/contexts/real-time-data-context"

const riskAssessments = [
  {
    location: "Delhi Yamuna",
    currentRisk: "High",
    riskScore: 85,
    trend: "increasing",
    timeframe: "Next 30 days",
    factors: ["Industrial discharge", "Monsoon season"],
    recommendation: "Immediate monitoring required",
    healthImpact: "Critical",
    populationAffected: 2500000,
    immediateActions: ["Water supply cut-off", "Medical screening", "Emergency response team"]
  },
  {
    location: "Mumbai Mithi",
    currentRisk: "Medium",
    riskScore: 65,
    trend: "stable",
    timeframe: "Next 30 days",
    factors: ["Urban runoff", "Tidal influence"],
    recommendation: "Continue regular monitoring",
    healthImpact: "Moderate",
    populationAffected: 850000,
    immediateActions: ["Increased testing", "Public advisory", "Water treatment enhancement"]
  },
  {
    location: "Chennai Marina",
    currentRisk: "Low",
    riskScore: 35,
    trend: "decreasing",
    timeframe: "Next 30 days",
    factors: ["Coastal dilution", "Reduced industrial activity"],
    recommendation: "Maintain current protocols",
    healthImpact: "Low",
    populationAffected: 450000,
    immediateActions: ["Routine monitoring", "Data collection", "Preventive measures"]
  },
]

const riskFactors = [
  {
    category: "Acute Exposure",
    level: "High",
    score: 85,
    color: "text-red-500",
    icon: AlertTriangle,
    description: "Immediate health effects from short-term exposure"
  },
  {
    category: "Chronic Exposure",
    level: "Critical",
    score: 92,
    color: "text-red-600",
    icon: Heart,
    description: "Long-term health effects from prolonged exposure"
  },
  {
    category: "Population Impact",
    level: "Moderate",
    score: 68,
    color: "text-orange-500",
    icon: Users,
    description: "Number of people potentially affected"
  },
  {
    category: "Environmental",
    level: "High",
    score: 79,
    color: "text-yellow-600",
    icon: Zap,
    description: "Ecosystem and environmental damage"
  }
]

const vulnerableGroups = [
  { group: "Children (0-12)", population: 1250, riskMultiplier: 3.2, priority: "Critical" },
  { group: "Pregnant Women", population: 340, riskMultiplier: 2.8, priority: "High" },
  { group: "Elderly (65+)", population: 890, riskMultiplier: 2.1, priority: "High" },
  { group: "Immunocompromised", population: 180, riskMultiplier: 2.5, priority: "High" }
]

export function RiskAssessment() {
  const [activeTab, setActiveTab] = useState("overview")
  const { state } = useRealTimeData()
  
  // Calculate real-time risk assessments for all locations
  const realTimeRiskAssessments = useMemo(() => {
    return state.currentData.map(locationData => {
      let riskScore = 0
      let criticalMetals = 0
      let warningMetals = 0
      
      // Calculate risk based on metal concentrations
      locationData.metals.forEach(metal => {
        if (metal.status === 'critical') {
          riskScore += 30
          criticalMetals++
        } else if (metal.status === 'warning') {
          riskScore += 15
          warningMetals++
        }
      })
      
      // Add HMPI contribution
      riskScore += Math.min(locationData.hmpi * 0.5, 50)
      
      // Determine risk level
      let currentRisk = "Low"
      if (riskScore >= 80) currentRisk = "High"
      else if (riskScore >= 50) currentRisk = "Medium"
      
      // Determine trend based on recent data
      const recentData = state.historicalData
        .filter(data => data.location === locationData.location)
        .slice(-5)
      
      let trend = "stable"
      if (recentData.length >= 2) {
        const avgRecent = recentData.slice(-2).reduce((sum, d) => sum + d.hmpi, 0) / 2
        const avgOlder = recentData.slice(0, 2).reduce((sum, d) => sum + d.hmpi, 0) / 2
        if (avgRecent > avgOlder * 1.1) trend = "increasing"
        else if (avgRecent < avgOlder * 0.9) trend = "decreasing"
      }
      
      return {
        location: locationData.location,
        currentRisk,
        riskScore: Math.round(riskScore),
        trend,
        timeframe: "Next 30 days",
        factors: criticalMetals > 0 ? ["Critical metal levels", "Industrial discharge"] : 
                 warningMetals > 0 ? ["Elevated metal levels", "Urban runoff"] : 
                 ["Regular monitoring", "Environmental factors"],
        recommendation: currentRisk === "High" ? "Immediate action required" :
                       currentRisk === "Medium" ? "Enhanced monitoring needed" :
                       "Continue regular monitoring",
        healthImpact: currentRisk,
        populationAffected: Math.round(Math.random() * 2000000 + 500000), // Simulated
        immediateActions: currentRisk === "High" ? 
          ["Water supply cut-off", "Medical screening", "Emergency response team"] :
          currentRisk === "Medium" ?
          ["Increased testing", "Public advisory", "Water treatment enhancement"] :
          ["Routine monitoring", "Data collection", "Preventive measures"]
      }
    })
  }, [state.currentData, state.historicalData])
  
  const overallRiskScore = Math.round(
    realTimeRiskAssessments.length > 0 ? 
      realTimeRiskAssessments.reduce((sum, assessment) => sum + assessment.riskScore, 0) / realTimeRiskAssessments.length :
      riskFactors.reduce((sum, factor) => sum + factor.score, 0) / riskFactors.length
  )

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

  const getRiskLevel = (score: number) => {
    if (score >= 90) return { level: "Critical", color: "text-red-600", bg: "bg-red-500/10" }
    if (score >= 75) return { level: "High", color: "text-red-500", bg: "bg-red-500/10" }
    if (score >= 50) return { level: "Moderate", color: "text-orange-500", bg: "bg-orange-500/10" }
    return { level: "Low", color: "text-green-500", bg: "bg-green-500/10" }
  }

  const overallRisk = getRiskLevel(overallRiskScore)

  return (
    <Card className="bg-card/80 backdrop-blur-sm border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Risk Assessment
        </CardTitle>
        <CardDescription>
          Comprehensive health and environmental risk analysis
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Risk Score */}
        <div className={`p-4 rounded-lg ${overallRisk.bg} border`}>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium">Overall Risk Level</h4>
            <Badge variant={overallRiskScore >= 80 ? "destructive" : "secondary"} className={overallRisk.color}>
              {overallRisk.level}
            </Badge>
          </div>
          <div className="text-3xl font-bold mb-2">{overallRiskScore}/100</div>
          <Progress value={overallRiskScore} className="h-2 mb-2" />
          <div className="text-xs text-muted-foreground">
            Based on current pollution levels and exposure patterns
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="locations">Locations</TabsTrigger>
            <TabsTrigger value="vulnerable">Vulnerable</TabsTrigger>
            <TabsTrigger value="actions">Actions</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            {/* Risk Categories */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium">Risk Categories</h4>
              {riskFactors.map((factor) => {
                const Icon = factor.icon
                return (
                  <div key={factor.category} className="p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Icon className={`h-4 w-4 ${factor.color}`} />
                        <span className="text-sm font-medium">{factor.category}</span>
                      </div>
                      <Badge variant={factor.score >= 80 ? "destructive" : "secondary"} className="text-xs">
                        {factor.level}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{factor.description}</p>
                    <Progress value={factor.score} className="h-1" />
                    <div className="flex justify-between mt-1">
                      <span className="text-xs text-muted-foreground">{factor.score}/100</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </TabsContent>

          <TabsContent value="locations" className="space-y-4">
            {realTimeRiskAssessments.map((assessment, index) => (
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

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="font-medium">Health Impact:</span>
                    <p className="text-muted-foreground">{assessment.healthImpact}</p>
                  </div>
                  <div>
                    <span className="font-medium">Population Affected:</span>
                    <p className="text-muted-foreground">{assessment.populationAffected.toLocaleString()}</p>
                  </div>
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
          </TabsContent>

          <TabsContent value="vulnerable" className="space-y-4">
            <div className="space-y-3">
              <h4 className="text-sm font-medium">Vulnerable Population Analysis</h4>
              {vulnerableGroups.map((group, index) => (
                <div key={index} className="p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h5 className="text-sm font-medium">{group.group}</h5>
                      <p className="text-xs text-muted-foreground">
                        {group.population.toLocaleString()} individuals • {group.riskMultiplier}x risk factor
                      </p>
                    </div>
                    <Badge 
                      variant={group.priority === "Critical" ? "destructive" : "secondary"}
                      className="text-xs"
                    >
                      {group.priority} Priority
                    </Badge>
                  </div>
                  <Progress value={group.riskMultiplier * 25} className="h-1" />
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="actions" className="space-y-4">
            {/* Emergency Actions */}
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                <h4 className="text-sm font-medium text-red-600">Immediate Actions Required</h4>
              </div>
              <div className="space-y-2 text-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="font-medium mb-1">Public Health Measures:</p>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      <li>• Issue immediate water safety advisory</li>
                      <li>• Establish alternative water distribution points</li>
                      <li>• Begin health screening for high-risk groups</li>
                      <li>• Deploy mobile medical units</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-medium mb-1">Environmental Controls:</p>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      <li>• Investigate and halt pollution sources</li>
                      <li>• Install emergency water treatment systems</li>
                      <li>• Begin environmental remediation planning</li>
                      <li>• Increase monitoring frequency</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <Button variant="destructive" className="w-full">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Trigger Emergency Response
              </Button>
              <Button variant="outline" className="w-full">
                <Info className="h-4 w-4 mr-2" />
                Generate Risk Report
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        {/* Overall Risk Summary */}
        <div className="pt-4 border-t border-border">
          <h4 className="text-sm font-medium mb-3">Risk Distribution Summary</h4>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-3 bg-red-500/10 rounded-lg">
              <div className="text-lg font-bold text-red-500">1</div>
              <div className="text-xs text-muted-foreground">High Risk</div>
            </div>
            <div className="p-3 bg-yellow-500/10 rounded-lg">
              <div className="text-lg font-bold text-yellow-500">1</div>
              <div className="text-xs text-muted-foreground">Medium Risk</div>
            </div>
            <div className="p-3 bg-green-500/10 rounded-lg">
              <div className="text-lg font-bold text-green-500">1</div>
              <div className="text-xs text-muted-foreground">Low Risk</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

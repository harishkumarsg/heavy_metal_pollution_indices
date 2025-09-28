"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Droplets, TrendingDown, TrendingUp } from "lucide-react"

export function WaterHealthScore() {
  const healthScore = 28 // Based on current HMPI calculation
  const previousScore = 35
  const trend = healthScore - previousScore

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500"
    if (score >= 60) return "text-yellow-500"
    if (score >= 40) return "text-orange-500"
    return "text-red-500"
  }

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Excellent"
    if (score >= 60) return "Good"
    if (score >= 40) return "Fair"
    return "Poor"
  }

  const getScoreBadge = (score: number) => {
    if (score >= 80)
      return (
        <Badge variant="default" className="bg-green-500/10 text-green-600 border-green-500/20">
          Excellent
        </Badge>
      )
    if (score >= 60)
      return (
        <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">
          Good
        </Badge>
      )
    if (score >= 40)
      return (
        <Badge variant="secondary" className="bg-orange-500/10 text-orange-600 border-orange-500/20">
          Fair
        </Badge>
      )
    return <Badge variant="destructive">Poor</Badge>
  }

  return (
    <Card className="bg-card/80 backdrop-blur-sm border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Droplets className="h-5 w-5" />
          Water Health Score
        </CardTitle>
        <CardDescription>Simplified pollution index for public awareness</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Main Score Display */}
        <div className="text-center space-y-4">
          <div className="relative">
            <div className={`text-6xl font-bold ${getScoreColor(healthScore)}`}>{healthScore}</div>
            <div className="text-sm text-muted-foreground">out of 100</div>
          </div>

          <div className="space-y-2">
            {getScoreBadge(healthScore)}
            <div className="flex items-center justify-center gap-2 text-sm">
              {trend < 0 ? (
                <>
                  <TrendingDown className="h-4 w-4 text-red-500" />
                  <span className="text-red-500">{Math.abs(trend)} points down</span>
                </>
              ) : (
                <>
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-green-500">{trend} points up</span>
                </>
              )}
              <span className="text-muted-foreground">from last month</span>
            </div>
          </div>
        </div>

        {/* Score Breakdown */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Score Components</h4>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Heavy Metal Levels</span>
              <span className="font-medium">15/40</span>
            </div>
            <Progress value={37.5} className="h-2" />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Water Clarity</span>
              <span className="font-medium">8/20</span>
            </div>
            <Progress value={40} className="h-2" />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>pH Balance</span>
              <span className="font-medium">18/20</span>
            </div>
            <Progress value={90} className="h-2" />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Bacterial Count</span>
              <span className="font-medium">12/20</span>
            </div>
            <Progress value={60} className="h-2" />
          </div>
        </div>

        {/* Health Impact */}
        <div className="bg-muted/50 rounded-lg p-3">
          <h4 className="text-sm font-medium mb-2">Health Impact</h4>
          <div className="text-xs text-muted-foreground space-y-1">
            <p>• High risk of heavy metal poisoning</p>
            <p>• Not suitable for drinking without treatment</p>
            <p>• May cause long-term health issues</p>
            <p>• Immediate filtration recommended</p>
          </div>
        </div>

        {/* Score Scale */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Score Scale</h4>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-green-500">80-100: Excellent</span>
              <span className="text-muted-foreground">Safe for all uses</span>
            </div>
            <div className="flex justify-between">
              <span className="text-yellow-500">60-79: Good</span>
              <span className="text-muted-foreground">Minor treatment needed</span>
            </div>
            <div className="flex justify-between">
              <span className="text-orange-500">40-59: Fair</span>
              <span className="text-muted-foreground">Treatment required</span>
            </div>
            <div className="flex justify-between">
              <span className="text-red-500">0-39: Poor</span>
              <span className="text-muted-foreground">Unsafe without treatment</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

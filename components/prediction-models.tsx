"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Brain, Zap, Target, Clock } from "lucide-react"

const models = [
  {
    name: "LSTM Neural Network",
    type: "Deep Learning",
    accuracy: 87.3,
    status: "active",
    description: "Long Short-Term Memory network for time series prediction",
    strengths: ["Temporal patterns", "Long-term dependencies"],
    lastUpdate: "2 hours ago",
  },
  {
    name: "XGBoost Ensemble",
    type: "Gradient Boosting",
    accuracy: 84.7,
    status: "active",
    description: "Extreme Gradient Boosting for feature-rich predictions",
    strengths: ["Feature importance", "Non-linear relationships"],
    lastUpdate: "6 hours ago",
  },
  {
    name: "Random Forest",
    type: "Ensemble Learning",
    accuracy: 82.1,
    status: "backup",
    description: "Multiple decision trees for robust predictions",
    strengths: ["Interpretability", "Overfitting resistance"],
    lastUpdate: "1 day ago",
  },
]

export function PredictionModels() {
  return (
    <Card className="bg-card/80 backdrop-blur-sm border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          Prediction Models
        </CardTitle>
        <CardDescription>AI models powering pollution forecasts</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {models.map((model, index) => (
          <div key={index} className="p-3 bg-muted/50 rounded-lg space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-medium text-sm">{model.name}</h4>
                <p className="text-xs text-muted-foreground">{model.description}</p>
              </div>
              <Badge variant={model.status === "active" ? "default" : "secondary"} className="text-xs">
                {model.status}
              </Badge>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Accuracy</span>
                <span className="font-medium">{model.accuracy}%</span>
              </div>
              <Progress value={model.accuracy} className="h-2" />
            </div>

            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3 text-muted-foreground" />
                <span className="text-muted-foreground">{model.lastUpdate}</span>
              </div>
              <Badge variant="outline" className="text-xs">
                {model.type}
              </Badge>
            </div>

            <div className="space-y-1">
              <span className="text-xs font-medium">Strengths:</span>
              <div className="flex flex-wrap gap-1">
                {model.strengths.map((strength, i) => (
                  <Badge key={i} variant="outline" className="text-xs">
                    {strength}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        ))}

        <div className="pt-4 border-t border-border">
          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="flex-1 bg-transparent">
              <Target className="h-4 w-4 mr-2" />
              Compare Models
            </Button>
            <Button size="sm" variant="outline" className="flex-1 bg-transparent">
              <Zap className="h-4 w-4 mr-2" />
              Optimize
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

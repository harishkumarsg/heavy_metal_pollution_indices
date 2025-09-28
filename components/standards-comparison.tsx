"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Shield, Globe, Building } from "lucide-react"

const standards = [
  {
    name: "WHO",
    fullName: "World Health Organization",
    icon: Globe,
    color: "text-blue-500",
    limits: {
      lead: 0.01,
      mercury: 0.001,
      cadmium: 0.003,
      arsenic: 0.01,
      chromium: 0.05,
    },
  },
  {
    name: "BIS",
    fullName: "Bureau of Indian Standards",
    icon: Shield,
    color: "text-green-500",
    limits: {
      lead: 0.01,
      mercury: 0.001,
      cadmium: 0.003,
      arsenic: 0.01,
      chromium: 0.05,
    },
  },
  {
    name: "CGWB",
    fullName: "Central Ground Water Board",
    icon: Building,
    color: "text-orange-500",
    limits: {
      lead: 0.01,
      mercury: 0.001,
      cadmium: 0.003,
      arsenic: 0.01,
      chromium: 0.05,
    },
  },
]

const currentValues = {
  lead: 0.85,
  mercury: 0.012,
  cadmium: 0.025,
  arsenic: 0.045,
  chromium: 0.15,
}

export function StandardsComparison() {
  const getComplianceStatus = (value: number, limit: number) => {
    const ratio = value / limit
    if (ratio <= 1) return { status: "compliant", color: "text-green-500", label: "Compliant" }
    if (ratio <= 2) return { status: "warning", color: "text-yellow-500", label: "Warning" }
    return { status: "violation", color: "text-red-500", label: "Violation" }
  }

  return (
    <Card className="bg-card/80 backdrop-blur-sm border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Standards Comparison
        </CardTitle>
        <CardDescription>Multi-standard compliance analysis</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {standards.map((standard) => (
          <div key={standard.name} className="space-y-3">
            <div className="flex items-center gap-2">
              <standard.icon className={`h-4 w-4 ${standard.color}`} />
              <div>
                <h4 className="text-sm font-medium">{standard.name}</h4>
                <p className="text-xs text-muted-foreground">{standard.fullName}</p>
              </div>
            </div>

            <div className="space-y-2">
              {Object.entries(standard.limits).map(([metal, limit]) => {
                const currentValue = currentValues[metal as keyof typeof currentValues]
                const compliance = getComplianceStatus(currentValue, limit)
                const ratio = (currentValue / limit) * 100

                return (
                  <div key={metal} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium capitalize">{metal}</span>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={compliance.status === "compliant" ? "default" : "destructive"}
                          className="text-xs"
                        >
                          {compliance.label}
                        </Badge>
                      </div>
                    </div>
                    <Progress value={Math.min(ratio, 100)} className="h-1" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{currentValue} mg/L</span>
                      <span>Limit: {limit} mg/L</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}

        {/* Overall Compliance Summary */}
        <div className="border-t border-border pt-4">
          <h4 className="text-sm font-medium mb-2">Compliance Summary</h4>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2 bg-green-500/10 rounded">
              <div className="text-lg font-bold text-green-500">0</div>
              <div className="text-xs text-muted-foreground">Compliant</div>
            </div>
            <div className="p-2 bg-yellow-500/10 rounded">
              <div className="text-lg font-bold text-yellow-500">1</div>
              <div className="text-xs text-muted-foreground">Warning</div>
            </div>
            <div className="p-2 bg-red-500/10 rounded">
              <div className="text-lg font-bold text-red-500">4</div>
              <div className="text-xs text-muted-foreground">Violations</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

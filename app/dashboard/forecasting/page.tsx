import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { AIForecastDashboard } from "@/components/ai-forecast-dashboard"
import { PredictionModels } from "@/components/prediction-models"
import { RiskAssessment } from "@/components/risk-assessment"

export default function ForecastingPage() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <div className="flex">
        <DashboardSidebar />
        <main className="flex-1 p-6">
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground">AI Risk Forecasting</h1>
              <p className="text-muted-foreground">
                Machine learning-powered pollution trend prediction and risk assessment
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <AIForecastDashboard />
              </div>
              <div className="space-y-6">
                <PredictionModels />
                <RiskAssessment />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

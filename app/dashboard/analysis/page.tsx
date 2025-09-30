import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { HMPIAnalysis } from "@/components/hmpi-analysis"
import { StandardsComparison } from "@/components/standards-comparison"
import { WaterHealthScore } from "@/components/water-health-score"
import { TrendAnalysis } from "@/components/trend-analysis"
import { RiskAssessment } from "@/components/risk-assessment"
import { MetalCorrelation } from "@/components/metal-correlation"
import { PredictiveModel } from "@/components/predictive-model"
import { RealTimeStatus } from "@/components/real-time-status"

export default function AnalysisPage() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <div className="flex">
        <DashboardSidebar />
        <main className="flex-1 p-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">HMPI Analysis</h1>
                <p className="text-muted-foreground">
                  Advanced Heavy Metal Pollution Index analytics with predictive modeling
                </p>
              </div>
              <RealTimeStatus />
            </div>

            {/* Main Analysis Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
              <div className="xl:col-span-2">
                <HMPIAnalysis />
              </div>
              <div className="space-y-6">
                <WaterHealthScore />
                <StandardsComparison />
              </div>
              <div className="space-y-6">
                <RiskAssessment />
                <PredictiveModel />
              </div>
            </div>

            {/* Advanced Analytics Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <TrendAnalysis />
              <MetalCorrelation />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

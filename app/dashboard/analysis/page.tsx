import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { HMPIAnalysis } from "@/components/hmpi-analysis"
import { StandardsComparison } from "@/components/standards-comparison"
import { WaterHealthScore } from "@/components/water-health-score"

export default function AnalysisPage() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <div className="flex">
        <DashboardSidebar />
        <main className="flex-1 p-6">
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground">HMPI Analysis</h1>
              <p className="text-muted-foreground">
                Heavy Metal Pollution Index computation and multi-standard comparison
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <HMPIAnalysis />
              </div>
              <div className="space-y-6">
                <WaterHealthScore />
                <StandardsComparison />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

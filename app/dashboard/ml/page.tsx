import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { AdvancedMLDashboard } from "@/components/advanced-ml-dashboard"
import { RealTimeStatus } from "@/components/real-time-status"

export default function MLPage() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <div className="flex">
        <DashboardSidebar />
        <main className="flex-1 p-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Machine Learning Laboratory</h1>
                <p className="text-muted-foreground">
                  Advanced AI models for pollution forecasting, anomaly detection, and insights
                </p>
              </div>
              <RealTimeStatus />
            </div>

            <AdvancedMLDashboard />
          </div>
        </main>
      </div>
    </div>
  )
}
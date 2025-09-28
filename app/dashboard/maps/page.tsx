import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { PollutionMap } from "@/components/pollution-map"
import { MapControls } from "@/components/map-controls"
import { MapLegend } from "@/components/map-legend"

export default function MapsPage() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <div className="flex">
        <DashboardSidebar />
        <main className="flex-1 p-6">
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Pollution Maps</h1>
              <p className="text-muted-foreground">
                Interactive geo-spatial visualization of heavy metal pollution indices
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-3">
                <PollutionMap />
              </div>
              <div className="space-y-6">
                <MapControls />
                <MapLegend />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

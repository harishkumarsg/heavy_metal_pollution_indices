import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { DataUploadForm } from "@/components/data-upload-form"
import { UploadHistory } from "@/components/upload-history"

export default function UploadPage() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <div className="flex">
        <DashboardSidebar />
        <main className="flex-1 p-6">
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Data Upload</h1>
              <p className="text-muted-foreground">Upload heavy metal pollution test results with geo-coordinates</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <DataUploadForm />
              <UploadHistory />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

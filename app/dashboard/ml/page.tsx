import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { AdvancedMLDashboard } from "@/components/advanced-ml-dashboard"
import { SmartInsightsPanel } from "@/components/smart-insights-panel"
import { RealTimeStatus } from "@/components/real-time-status"
import { RealTimeMLStatus } from "@/components/real-time-ml-status"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

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
                <h1 className="text-3xl font-bold text-foreground">🧬 AI & ML Laboratory</h1>
                <p className="text-muted-foreground">
                  Advanced machine learning forecasting, smart insights, and intelligent data analysis
                </p>
              </div>
              <RealTimeStatus />
            </div>

            {/* Real-time Status Overview */}
            <RealTimeMLStatus />

            <Tabs defaultValue="forecasting" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="forecasting">🚀 Advanced ML Models</TabsTrigger>
                <TabsTrigger value="insights">💡 AI Insights Engine</TabsTrigger>
                <TabsTrigger value="monitoring">📊 Live Monitoring</TabsTrigger>
              </TabsList>
              
              <TabsContent value="forecasting">
                <AdvancedMLDashboard />
              </TabsContent>
              
              <TabsContent value="insights">
                <SmartInsightsPanel />
              </TabsContent>
              
              <TabsContent value="monitoring">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">🌍 Real-time WAQI Data Stream</h3>
                    <div className="bg-black rounded-lg p-4 font-mono text-green-400 text-sm">
                      <div>✅ Connected to World Air Quality Index API</div>
                      <div>📊 Processing data from 6 major Indian cities:</div>
                      <div className="ml-4 space-y-1">
                        <div>• Delhi - AQI updates every 30s</div>
                        <div>• Mumbai - Heavy metal correlation analysis</div>
                        <div>• Chennai - Seasonal pattern detection</div>
                        <div>• Kolkata - Industrial pollution tracking</div>
                        <div>• Hyderabad - Urban growth impact analysis</div>
                        <div>• Bangalore - Tech hub pollution modeling</div>
                      </div>
                      <div className="mt-2">🤖 ML Models: LSTM + Prophet + XGBoost</div>
                      <div>⚡ Live Predictions: Enabled</div>
                      <div>🔄 Auto-retraining: Every 24 hours</div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">🧠 AI Processing Pipeline</h3>
                    <div className="space-y-3">
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <div className="font-medium text-blue-800">Data Ingestion</div>
                        <div className="text-sm text-blue-600">WAQI API → Real-time Context → ML Pipeline</div>
                      </div>
                      <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                        <div className="font-medium text-purple-800">ML Processing</div>
                        <div className="text-sm text-purple-600">LSTM Neural Networks + Facebook Prophet + XGBoost</div>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                        <div className="font-medium text-green-800">Smart Insights</div>
                        <div className="text-sm text-green-600">Pattern Recognition + Natural Language Generation</div>
                      </div>
                      <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                        <div className="font-medium text-orange-800">Predictions</div>
                        <div className="text-sm text-orange-600">7-day Forecasts + Anomaly Detection + Risk Assessment</div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  )
}
import { LoginForm } from "@/components/login-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Droplets, Shield, BarChart3, MapPin } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-slate-900">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Droplets className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">HMPI Monitor</h1>
                <p className="text-sm text-muted-foreground">Heavy Metal Pollution Indices</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Hero content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl font-bold text-balance leading-tight">
                Advanced Environmental Monitoring for <span className="text-primary">Water Safety</span>
              </h2>
              <p className="text-xl text-muted-foreground text-pretty">
                Real-time heavy metal pollution tracking with AI-powered risk forecasting, interactive maps, and
                comprehensive reporting for authorities, researchers, and citizens.
              </p>
            </div>

            {/* Feature highlights */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-4 rounded-lg bg-card/50 border border-border">
                <Shield className="h-5 w-5 text-accent mt-0.5" />
                <div>
                  <h3 className="font-semibold text-sm">Role-Based Access</h3>
                  <p className="text-xs text-muted-foreground">
                    Secure access for authorities, researchers, and public
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-lg bg-card/50 border border-border">
                <BarChart3 className="h-5 w-5 text-accent mt-0.5" />
                <div>
                  <h3 className="font-semibold text-sm">AI Forecasting</h3>
                  <p className="text-xs text-muted-foreground">Predict contamination trends with ML models</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-lg bg-card/50 border border-border">
                <MapPin className="h-5 w-5 text-accent mt-0.5" />
                <div>
                  <h3 className="font-semibold text-sm">Interactive Maps</h3>
                  <p className="text-xs text-muted-foreground">Geo-spatial pollution heatmaps and zones</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-lg bg-card/50 border border-border">
                <Droplets className="h-5 w-5 text-accent mt-0.5" />
                <div>
                  <h3 className="font-semibold text-sm">HMPI Computation</h3>
                  <p className="text-xs text-muted-foreground">Automated pollution index calculations</p>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="flex gap-8 pt-4">
              <div>
                <div className="text-2xl font-bold text-primary">WHO</div>
                <div className="text-sm text-muted-foreground">Standards</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">BIS</div>
                <div className="text-sm text-muted-foreground">Compliance</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">CGWB</div>
                <div className="text-sm text-muted-foreground">Guidelines</div>
              </div>
            </div>
          </div>

          {/* Right side - Login form */}
          <div className="flex justify-center">
            <Card className="w-full max-w-md bg-card/80 backdrop-blur-sm border-border">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Access HMPI System</CardTitle>
                <CardDescription>Sign in to access environmental monitoring tools</CardDescription>
              </CardHeader>
              <CardContent>
                <LoginForm />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, LineChart, Line, Cell } from "recharts"
import { Network, TrendingUp, BarChart3, Target, Download, RefreshCw, AlertCircle } from "lucide-react"

// Generate correlation data between metals
const generateCorrelationData = (metal1: string, metal2: string, correlation: number) => {
  const data = []
  const baseCorr = correlation
  
  for (let i = 0; i < 50; i++) {
    const x = Math.random() * 100 + 20
    const noise = (Math.random() - 0.5) * 30
    const y = x * baseCorr + noise + Math.random() * 20
    
    data.push({
      x: Math.round(x * 100) / 100,
      y: Math.round(Math.max(0, y) * 100) / 100,
      location: `Site ${i + 1}`,
      date: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toLocaleDateString()
    })
  }
  
  return data
}

const metalPairs = [
  {
    metal1: "Lead (Pb)",
    metal2: "Cadmium (Cd)",
    correlation: 0.87,
    significance: "p < 0.001",
    strength: "Strong Positive",
    rSquared: 0.756,
    samples: 145,
    color: "#ef4444"
  },
  {
    metal1: "Mercury (Hg)",
    metal2: "Arsenic (As)",
    correlation: 0.72,
    significance: "p < 0.01",
    strength: "Moderate Positive", 
    rSquared: 0.518,
    samples: 132,
    color: "#f59e0b"
  },
  {
    metal1: "Zinc (Zn)",
    metal2: "Copper (Cu)",
    correlation: 0.64,
    significance: "p < 0.05",
    strength: "Moderate Positive",
    rSquared: 0.410,
    samples: 167,
    color: "#10b981"
  },
  {
    metal1: "Chromium (Cr)",
    metal2: "Nickel (Ni)",
    correlation: 0.58,
    significance: "p < 0.05",
    strength: "Moderate Positive",
    rSquared: 0.336,
    samples: 154,
    color: "#8b5cf6"
  },
  {
    metal1: "Iron (Fe)",
    metal2: "Manganese (Mn)",
    correlation: -0.43,
    significance: "p < 0.1",
    strength: "Weak Negative",
    rSquared: 0.185,
    samples: 189,
    color: "#06b6d4"
  }
]

const correlationMatrix = [
  { metal: "Pb", Pb: 1.00, Cd: 0.87, Hg: 0.34, As: 0.41, Zn: 0.23, Cu: 0.31, Cr: 0.18, Ni: 0.29 },
  { metal: "Cd", Pb: 0.87, Cd: 1.00, Hg: 0.29, As: 0.38, Zn: 0.41, Cu: 0.33, Cr: 0.22, Ni: 0.31 },
  { metal: "Hg", Pb: 0.34, Cd: 0.29, Hg: 1.00, As: 0.72, Zn: 0.15, Cu: 0.18, Cr: 0.25, Ni: 0.33 },
  { metal: "As", Pb: 0.41, Cd: 0.38, Hg: 0.72, As: 1.00, Zn: 0.22, Cu: 0.19, Cr: 0.31, Ni: 0.28 },
  { metal: "Zn", Pb: 0.23, Cd: 0.41, Hg: 0.15, As: 0.22, Zn: 1.00, Cu: 0.64, Cr: 0.19, Ni: 0.25 },
  { metal: "Cu", Pb: 0.31, Cd: 0.33, Hg: 0.18, As: 0.19, Zn: 0.64, Cu: 1.00, Cr: 0.27, Ni: 0.35 },
  { metal: "Cr", Pb: 0.18, Cd: 0.22, Hg: 0.25, As: 0.31, Zn: 0.19, Cu: 0.27, Cr: 1.00, Ni: 0.58 },
  { metal: "Ni", Pb: 0.29, Cd: 0.31, Hg: 0.33, As: 0.28, Zn: 0.25, Cu: 0.35, Cr: 0.58, Ni: 1.00 }
]

const sourceAnalysis = [
  {
    source: "Industrial Discharge",
    metals: ["Lead", "Cadmium", "Mercury"],
    contribution: 68,
    confidence: 0.92,
    locations: ["Delhi Yamuna", "Mumbai Mithi"],
    description: "Primary source of heavy metal contamination from manufacturing"
  },
  {
    source: "Mining Activities", 
    metals: ["Arsenic", "Chromium", "Nickel"],
    contribution: 45,
    confidence: 0.78,
    locations: ["Odisha Brahmani", "Jharkhand Damodar"],
    description: "Mining operations and mineral processing facilities"
  },
  {
    source: "Agricultural Runoff",
    metals: ["Zinc", "Copper", "Manganese"],
    contribution: 32,
    confidence: 0.65,
    locations: ["Punjab Sutlej", "Haryana Yamuna"],
    description: "Pesticide and fertilizer usage in agricultural areas"
  },
  {
    source: "Urban Waste",
    metals: ["Lead", "Zinc", "Copper"],
    contribution: 28,
    confidence: 0.71,
    locations: ["Chennai Marina", "Kolkata Hooghly"],
    description: "Municipal solid waste and electronic waste disposal"
  }
]

const timeSeriesCorrelation = Array.from({ length: 24 }, (_, i) => ({
  month: new Date(2023, i % 12).toLocaleDateString('en-US', { month: 'short' }),
  pbCd: 0.87 + (Math.random() - 0.5) * 0.1,
  hgAs: 0.72 + (Math.random() - 0.5) * 0.15,
  znCu: 0.64 + (Math.random() - 0.5) * 0.12,
  crNi: 0.58 + (Math.random() - 0.5) * 0.18
}))

export function MetalCorrelation() {
  const [selectedPair, setSelectedPair] = useState("Lead (Pb) - Cadmium (Cd)")
  const [activeTab, setActiveTab] = useState("pairwise")
  const [analysisType, setAnalysisType] = useState("pearson")
  
  const currentPair = metalPairs.find(p => `${p.metal1} - ${p.metal2}` === selectedPair) || metalPairs[0]
  const correlationData = generateCorrelationData(currentPair.metal1, currentPair.metal2, currentPair.correlation)
  
  const getCorrelationStrength = (corr: number) => {
    const abs = Math.abs(corr)
    if (abs >= 0.8) return { strength: "Very Strong", color: "text-red-500" }
    if (abs >= 0.6) return { strength: "Strong", color: "text-orange-500" }
    if (abs >= 0.4) return { strength: "Moderate", color: "text-yellow-500" }
    if (abs >= 0.2) return { strength: "Weak", color: "text-blue-500" }
    return { strength: "Very Weak", color: "text-gray-500" }
  }
  
  const getCorrelationColor = (value: number) => {
    const abs = Math.abs(value)
    if (abs >= 0.8) return "#ef4444"
    if (abs >= 0.6) return "#f59e0b"
    if (abs >= 0.4) return "#eab308"
    if (abs >= 0.2) return "#22c55e"
    return "#6b7280"
  }

  return (
    <Card className="bg-card/80 backdrop-blur-sm border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Network className="h-5 w-5" />
          Metal Correlation Analysis
        </CardTitle>
        <CardDescription>
          Statistical relationships and source analysis between heavy metals
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="pairwise">Pairwise</TabsTrigger>
            <TabsTrigger value="matrix">Matrix</TabsTrigger>
            <TabsTrigger value="sources">Sources</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
          </TabsList>

          <TabsContent value="pairwise" className="space-y-4">
            {/* Pair Selector */}
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium">Metal Pair Analysis</h4>
              <div className="flex gap-2">
                <Select value={analysisType} onValueChange={setAnalysisType}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pearson">Pearson</SelectItem>
                    <SelectItem value="spearman">Spearman</SelectItem>
                    <SelectItem value="kendall">Kendall</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedPair} onValueChange={setSelectedPair}>
                  <SelectTrigger className="w-56">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {metalPairs.map((pair) => (
                      <SelectItem key={`${pair.metal1} - ${pair.metal2}`} value={`${pair.metal1} - ${pair.metal2}`}>
                        {pair.metal1} - {pair.metal2}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Correlation Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="p-3 bg-muted/50 rounded-lg text-center">
                <div className="text-lg font-bold" style={{ color: currentPair.color }}>
                  {currentPair.correlation.toFixed(3)}
                </div>
                <div className="text-xs text-muted-foreground">Correlation</div>
              </div>
              <div className="p-3 bg-muted/50 rounded-lg text-center">
                <div className="text-lg font-bold text-blue-500">
                  {currentPair.rSquared.toFixed(3)}
                </div>
                <div className="text-xs text-muted-foreground">R²</div>
              </div>
              <div className="p-3 bg-muted/50 rounded-lg text-center">
                <div className="text-lg font-bold text-green-500">
                  {currentPair.samples}
                </div>
                <div className="text-xs text-muted-foreground">Samples</div>
              </div>
              <div className="p-3 bg-muted/50 rounded-lg text-center">
                <div className="text-xs font-bold text-purple-500">
                  {currentPair.significance}
                </div>
                <div className="text-xs text-muted-foreground">Significance</div>
              </div>
            </div>

            {/* Scatter Plot */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h5 className="text-sm font-medium">Correlation Scatter Plot</h5>
                <Badge variant="outline" className={getCorrelationStrength(currentPair.correlation).color}>
                  {currentPair.strength}
                </Badge>
              </div>
              
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart data={correlationData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      type="number"
                      dataKey="x"
                      name={currentPair.metal1}
                      unit=" μg/L"
                      tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    />
                    <YAxis 
                      type="number"
                      dataKey="y"
                      name={currentPair.metal2}
                      unit=" μg/L"
                      tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    />
                    <Tooltip 
                      cursor={{ strokeDasharray: '3 3' }}
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--background))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Scatter 
                      name="Measurements"
                      dataKey="y"
                      fill={currentPair.color}
                      fillOpacity={0.7}
                    />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Statistical Summary */}
            <div className="p-3 bg-muted/50 rounded-lg">
              <h5 className="text-sm font-medium mb-2">Statistical Summary</h5>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p><span className="font-medium">Relationship:</span> {currentPair.strength}</p>
                  <p><span className="font-medium">Direction:</span> {currentPair.correlation > 0 ? "Positive" : "Negative"}</p>
                  <p><span className="font-medium">Explained Variance:</span> {(currentPair.rSquared * 100).toFixed(1)}%</p>
                </div>
                <div>
                  <p><span className="font-medium">Statistical Significance:</span> {currentPair.significance}</p>
                  <p><span className="font-medium">Sample Size:</span> {currentPair.samples} measurements</p>
                  <p><span className="font-medium">Analysis Method:</span> {analysisType.charAt(0).toUpperCase() + analysisType.slice(1)}</p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="matrix" className="space-y-4">
            {/* Correlation Matrix Heatmap */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium">Correlation Matrix</h4>
              
              {/* Matrix Grid */}
              <div className="grid grid-cols-9 gap-1 text-xs">
                <div></div> {/* Empty corner */}
                {["Pb", "Cd", "Hg", "As", "Zn", "Cu", "Cr", "Ni"].map(metal => (
                  <div key={metal} className="p-2 text-center font-medium bg-muted/50 rounded">
                    {metal}
                  </div>
                ))}
                
                {correlationMatrix.map(row => (
                  <div key={row.metal} className="contents">
                    <div className="p-2 text-center font-medium bg-muted/50 rounded">
                      {row.metal}
                    </div>
                    {Object.entries(row).filter(([key]) => key !== 'metal').map(([metal, value]) => (
                      <div 
                        key={`${row.metal}-${metal}`}
                        className="p-2 text-center rounded text-white font-medium"
                        style={{ 
                          backgroundColor: getCorrelationColor(value as number),
                          opacity: 0.8 
                        }}
                      >
                        {(value as number).toFixed(2)}
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              {/* Legend */}
              <div className="flex items-center justify-center gap-4 text-xs">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-red-500 rounded"></div>
                  <span>Strong (≥0.8)</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-orange-500 rounded"></div>
                  <span>Moderate (0.4-0.8)</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-green-500 rounded"></div>
                  <span>Weak (0.2-0.4)</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-gray-500 rounded"></div>
                  <span>Very Weak (&lt;0.2)</span>
                </div>
              </div>
            </div>

            {/* Top Correlations */}
            <div className="space-y-3">
              <h5 className="text-sm font-medium">Strongest Correlations</h5>
              <div className="space-y-2">
                {metalPairs
                  .sort((a, b) => Math.abs(b.correlation) - Math.abs(a.correlation))
                  .slice(0, 5)
                  .map((pair, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded"
                        style={{ backgroundColor: pair.color }}
                      />
                      <span className="text-sm">{pair.metal1} - {pair.metal2}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        r = {pair.correlation.toFixed(3)}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{pair.significance}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="sources" className="space-y-4">
            {/* Source Analysis */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium">Contamination Source Analysis</h4>
              {sourceAnalysis.map((source, index) => (
                <div key={index} className="p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h5 className="text-sm font-medium">{source.source}</h5>
                      <p className="text-xs text-muted-foreground">{source.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-blue-500">{source.contribution}%</div>
                      <div className="text-xs text-muted-foreground">Contribution</div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium">Primary Metals:</span>
                      <div className="flex gap-1">
                        {source.metals.map((metal, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {metal}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium">Affected Locations:</span>
                      <div className="flex gap-1">
                        {source.locations.map((location, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {location}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs">Confidence Level: {(source.confidence * 100).toFixed(0)}%</span>
                      <div className="w-24">
                        <div className="w-full bg-gray-200 rounded-full h-1">
                          <div 
                            className="bg-blue-500 h-1 rounded-full"
                            style={{ width: `${source.confidence * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Source Contribution Chart */}
            <div className="space-y-3">
              <h5 className="text-sm font-medium">Source Contribution Distribution</h5>
              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={sourceAnalysis}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="source"
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                      angle={-45}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis 
                      tick={{ fill: 'hsl(var(--muted-foreground))' }}
                      unit="%"
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--background))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar dataKey="contribution" fill="hsl(var(--primary))" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="trends" className="space-y-4">
            {/* Correlation Trends Over Time */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium">Correlation Trends Over Time</h4>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={timeSeriesCorrelation}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="month"
                      tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    />
                    <YAxis 
                      domain={[0, 1]}
                      tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--background))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="pbCd" stroke="#ef4444" name="Pb-Cd" strokeWidth={2} />
                    <Line type="monotone" dataKey="hgAs" stroke="#f59e0b" name="Hg-As" strokeWidth={2} />
                    <Line type="monotone" dataKey="znCu" stroke="#10b981" name="Zn-Cu" strokeWidth={2} />
                    <Line type="monotone" dataKey="crNi" stroke="#8b5cf6" name="Cr-Ni" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Trend Insights */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <h5 className="text-sm font-medium">Strengthening Correlations</h5>
                </div>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Pb-Cd correlation increasing (industrial sources)</li>
                  <li>• Zn-Cu showing seasonal patterns</li>
                  <li>• Stronger relationships during monsoon</li>
                </ul>
              </div>
              
              <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="h-4 w-4 text-yellow-500" />
                  <h5 className="text-sm font-medium">Notable Changes</h5>
                </div>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Hg-As correlation weakening (remediation effects)</li>
                  <li>• Cr-Ni showing irregular patterns</li>
                  <li>• Need increased monitoring frequency</li>
                </ul>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <Button variant="outline" className="w-full">
            <RefreshCw className="h-4 w-4 mr-2" />
            Recalculate
          </Button>
          <Button variant="outline" className="w-full">
            <Target className="h-4 w-4 mr-2" />
            Source Tracking
          </Button>
          <Button variant="default" className="w-full">
            <Download className="h-4 w-4 mr-2" />
            Export Analysis
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
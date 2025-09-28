"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, Download, Eye, Trash2, MapPin, Calendar } from "lucide-react"

const uploadHistory = [
  {
    id: 1,
    filename: "delhi_water_samples_jan2025.csv",
    uploadDate: "2025-01-28",
    records: 245,
    status: "processed",
    location: "Delhi NCR",
    uploader: "Dr. Sarah Chen",
    size: "1.2 MB",
  },
  {
    id: 2,
    filename: "mumbai_industrial_area.csv",
    uploadDate: "2025-01-27",
    records: 156,
    status: "processing",
    location: "Mumbai",
    uploader: "Environmental NGO",
    size: "890 KB",
  },
  {
    id: 3,
    filename: "kolkata_river_monitoring.csv",
    uploadDate: "2025-01-26",
    records: 89,
    status: "processed",
    location: "Kolkata",
    uploader: "WBPCB",
    size: "654 KB",
  },
  {
    id: 4,
    filename: "chennai_coastal_samples.csv",
    uploadDate: "2025-01-25",
    records: 178,
    status: "error",
    location: "Chennai",
    uploader: "Marine Research Lab",
    size: "1.1 MB",
  },
  {
    id: 5,
    filename: "bangalore_lake_survey.csv",
    uploadDate: "2025-01-24",
    records: 203,
    status: "processed",
    location: "Bangalore",
    uploader: "Karnataka EPA",
    size: "1.5 MB",
  },
]

export function UploadHistory() {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "processed":
        return (
          <Badge variant="default" className="text-xs">
            Processed
          </Badge>
        )
      case "processing":
        return (
          <Badge variant="secondary" className="text-xs">
            Processing
          </Badge>
        )
      case "error":
        return (
          <Badge variant="destructive" className="text-xs">
            Error
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="text-xs">
            Unknown
          </Badge>
        )
    }
  }

  return (
    <Card className="bg-card/80 backdrop-blur-sm border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Upload History
        </CardTitle>
        <CardDescription>Recent data uploads and processing status</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {uploadHistory.map((upload) => (
            <div key={upload.id} className="border border-border rounded-lg p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <h4 className="text-sm font-medium">{upload.filename}</h4>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {upload.uploadDate}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {upload.location}
                    </div>
                    <span>{upload.size}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Uploaded by {upload.uploader}</p>
                </div>
                <div className="flex items-center gap-2">{getStatusBadge(upload.status)}</div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <span className="font-medium">{upload.records}</span>
                  <span className="text-muted-foreground"> records processed</span>
                </div>

                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Eye className="h-3 w-3" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Download className="h-3 w-3" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-destructive hover:text-destructive">
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              {upload.status === "error" && (
                <div className="bg-destructive/10 border border-destructive/20 rounded p-2">
                  <p className="text-xs text-destructive">
                    Error: Invalid coordinate format in rows 45-67. Please check latitude/longitude values.
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-border">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              Total uploads this month: <span className="font-medium text-foreground">23</span>
            </span>
            <Button variant="outline" size="sm">
              View All History
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

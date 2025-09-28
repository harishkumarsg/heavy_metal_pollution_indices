"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Upload, FileText, MapPin, CheckCircle, AlertCircle, X } from "lucide-react"

interface UploadedFile {
  name: string
  size: number
  type: string
  status: "uploading" | "processing" | "completed" | "error"
  progress: number
  records?: number
  errors?: string[]
}

export function DataUploadForm() {
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [dragActive, setDragActive] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(Array.from(e.dataTransfer.files))
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(Array.from(e.target.files))
    }
  }

  const handleFiles = (fileList: File[]) => {
    const newFiles: UploadedFile[] = fileList.map((file) => ({
      name: file.name,
      size: file.size,
      type: file.type,
      status: "uploading",
      progress: 0,
    }))

    setFiles((prev) => [...prev, ...newFiles])

    // Simulate file processing
    newFiles.forEach((file, index) => {
      simulateFileProcessing(files.length + index)
    })
  }

  const simulateFileProcessing = (fileIndex: number) => {
    const interval = setInterval(() => {
      setFiles((prev) => {
        const updated = [...prev]
        const file = updated[fileIndex]

        if (file.status === "uploading") {
          file.progress += 10
          if (file.progress >= 100) {
            file.status = "processing"
            file.progress = 0
          }
        } else if (file.status === "processing") {
          file.progress += 15
          if (file.progress >= 100) {
            file.status = "completed"
            file.records = Math.floor(Math.random() * 500) + 50
            clearInterval(interval)
          }
        }

        return updated
      })
    }, 300)
  }

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <Card className="bg-card/80 backdrop-blur-sm border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Upload Test Results
        </CardTitle>
        <CardDescription>Upload CSV files containing heavy metal test results with geo-coordinates</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Upload Area */}
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="space-y-4">
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium">Drop your CSV files here, or click to browse</p>
              <p className="text-xs text-muted-foreground mt-1">
                Supports CSV files up to 10MB. Required columns: location, latitude, longitude, heavy_metal,
                concentration
              </p>
            </div>
            <input
              type="file"
              multiple
              accept=".csv,.xlsx,.xls"
              onChange={handleFileInput}
              className="hidden"
              id="file-upload"
            />
            <Button asChild variant="outline">
              <label htmlFor="file-upload" className="cursor-pointer">
                Select Files
              </label>
            </Button>
          </div>
        </div>

        {/* Sample Data Format */}
        <div className="bg-muted/50 rounded-lg p-4">
          <h4 className="text-sm font-medium mb-2">Required CSV Format:</h4>
          <div className="text-xs font-mono bg-background rounded p-2 overflow-x-auto">
            <div>location,latitude,longitude,heavy_metal,concentration,unit,date_collected</div>
            <div className="text-muted-foreground">"Delhi Yamuna",28.6139,77.2090,"Lead",0.85,"mg/L","2025-01-15"</div>
          </div>
        </div>

        {/* Manual Entry Form */}
        <div className="border-t border-border pt-6">
          <h4 className="text-sm font-medium mb-4">Or Enter Data Manually</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">Location Name</Label>
              <Input id="location" placeholder="e.g., Delhi Yamuna River" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="coordinates">Coordinates</Label>
              <div className="flex gap-2">
                <Input placeholder="Latitude" />
                <Input placeholder="Longitude" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="metal">Heavy Metal</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select metal" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lead">Lead (Pb)</SelectItem>
                  <SelectItem value="mercury">Mercury (Hg)</SelectItem>
                  <SelectItem value="cadmium">Cadmium (Cd)</SelectItem>
                  <SelectItem value="arsenic">Arsenic (As)</SelectItem>
                  <SelectItem value="chromium">Chromium (Cr)</SelectItem>
                  <SelectItem value="copper">Copper (Cu)</SelectItem>
                  <SelectItem value="zinc">Zinc (Zn)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="concentration">Concentration</Label>
              <div className="flex gap-2">
                <Input placeholder="0.85" />
                <Select>
                  <SelectTrigger className="w-20">
                    <SelectValue placeholder="Unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mg/L">mg/L</SelectItem>
                    <SelectItem value="μg/L">μg/L</SelectItem>
                    <SelectItem value="ppm">ppm</SelectItem>
                    <SelectItem value="ppb">ppb</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea id="notes" placeholder="Sample collection method, weather conditions, etc." className="h-20" />
          </div>
          <Button className="mt-4 w-full">
            <MapPin className="h-4 w-4 mr-2" />
            Add Manual Entry
          </Button>
        </div>

        {/* File Processing Status */}
        {files.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium">Processing Files</h4>
            {files.map((file, index) => (
              <div key={index} className="border border-border rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{file.name}</span>
                    <span className="text-xs text-muted-foreground">({formatFileSize(file.size)})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {file.status === "completed" && (
                      <Badge variant="default" className="text-xs">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        {file.records} records
                      </Badge>
                    )}
                    {file.status === "error" && (
                      <Badge variant="destructive" className="text-xs">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        Error
                      </Badge>
                    )}
                    <Button variant="ghost" size="sm" onClick={() => removeFile(index)} className="h-6 w-6 p-0">
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                {file.status !== "completed" && file.status !== "error" && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="capitalize">{file.status}...</span>
                      <span>{file.progress}%</span>
                    </div>
                    <Progress value={file.progress} className="h-1" />
                  </div>
                )}

                {file.errors && (
                  <div className="mt-2 text-xs text-destructive">
                    {file.errors.map((error, i) => (
                      <div key={i}>• {error}</div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

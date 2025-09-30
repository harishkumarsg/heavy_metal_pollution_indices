"use client"

import { useRealTimeData } from "@/contexts/real-time-data-context"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Database, Wifi, AlertCircle, CheckCircle } from "lucide-react"
import { useState, useEffect } from "react"

export function DataSourceIndicator() {
  const { state } = useRealTimeData()

  // Use the tracked data source from context, with fallback detection
  const getDataSource = () => {
    // First, use the tracked source if available
    if (state.dataSource) {
      console.log('📍 DataSourceIndicator: Using tracked source:', state.dataSource)
      return state.dataSource
    }
    
    console.log('📍 DataSourceIndicator: No tracked source, using fallback detection')
    
    // Fallback detection if source not tracked
    if (state.currentData.length > 0) {
      // Check if we have real coordinates (API data has actual lat/lng)
      const hasRealCoordinates = state.currentData.some(d => {
        const data = d as any
        return data.latitude && data.longitude && 
               typeof data.latitude === 'number' && 
               typeof data.longitude === 'number'
      })
      
      // Check for specific API source patterns in location names
      const hasAPILocationData = state.currentData.some(d => 
        d.location && (
          // WAQI patterns
          d.location.toLowerCase().includes('delhi') || 
          d.location.toLowerCase().includes('mumbai') || 
          d.location.toLowerCase().includes('chennai') ||
          d.location.toLowerCase().includes('kolkata') ||
          d.location.toLowerCase().includes('hyderabad') ||
          d.location.toLowerCase().includes('bangalore') ||
          // Other API patterns
          d.location.includes(',') || // Often "City, Country"
          /\b(India|IN)\b/i.test(d.location)
        )
      )
      
      if (hasRealCoordinates && hasAPILocationData) {
        return "WAQI Real Data"
      } else if (hasRealCoordinates) {
        return "Real API Data"
      } else {
        return "Simulated Data"
      }
    }
    
    return "Initializing..."
  }

  const lastSource = getDataSource()

  const getSourceIcon = () => {
    if (state.connectionStatus === 'connected' && lastSource?.includes('API')) {
      return <Database className="h-3 w-3" />
    } else if (state.connectionStatus === 'connected') {
      return <Wifi className="h-3 w-3" />
    } else {
      return <AlertCircle className="h-3 w-3" />
    }
  }

  const getSourceColor = () => {
    if (state.connectionStatus === 'connected' && lastSource?.includes('API')) {
      return 'bg-blue-500/10 text-blue-600 border-blue-500/20'
    } else if (state.connectionStatus === 'connected') {
      return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20'
    } else {
      return 'bg-red-500/10 text-red-600 border-red-500/20'
    }
  }

  const refreshInterval = parseInt(process.env.NEXT_PUBLIC_DATA_REFRESH_INTERVAL || '30000') / 1000

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
      <CardContent className="p-3">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={`${getSourceColor()} flex items-center gap-1`}>
              {getSourceIcon()}
              <span>Data Source</span>
            </Badge>
            <span className="text-muted-foreground">
              {lastSource || 'Initializing...'}
            </span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <CheckCircle className="h-3 w-3" />
            <span>Updates every {refreshInterval}s</span>
          </div>
        </div>
        
        {lastSource?.includes('Simulated') && (
          <div className="mt-2 text-xs text-yellow-600 bg-yellow-500/10 rounded p-2 border border-yellow-500/20">
            ⚠️ Using simulated data. Configure real API keys in .env.local for live data.
          </div>
        )}
        
        {state.connectionStatus === 'disconnected' && (
          <div className="mt-2 text-xs text-red-600 bg-red-500/10 rounded p-2 border border-red-500/20">
            🔴 All API sources failed. Check your internet connection and API keys.
          </div>
        )}
      </CardContent>
    </Card>
  )
}
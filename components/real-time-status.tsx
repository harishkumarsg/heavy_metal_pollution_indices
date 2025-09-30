"use client"

import { useRealTimeData } from "@/contexts/real-time-data-context"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Wifi, WifiOff, RefreshCw, AlertCircle, Clock } from "lucide-react"
import { useState } from "react"

export function RealTimeStatus() {
  const { state, startRealTimeUpdates, stopRealTimeUpdates } = useRealTimeData()
  const [isManualRefresh, setIsManualRefresh] = useState(false)

  const handleRefresh = async () => {
    setIsManualRefresh(true)
    stopRealTimeUpdates()
    setTimeout(() => {
      startRealTimeUpdates()
      setIsManualRefresh(false)
    }, 1000)
  }

  const getStatusColor = () => {
    switch (state.connectionStatus) {
      case 'connected':
        return 'bg-green-500/10 text-green-600 border-green-500/20'
      case 'reconnecting':
        return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20'
      case 'disconnected':
        return 'bg-red-500/10 text-red-600 border-red-500/20'
      default:
        return 'bg-gray-500/10 text-gray-600 border-gray-500/20'
    }
  }

  const getStatusIcon = () => {
    if (isManualRefresh) return <RefreshCw className="h-3 w-3 animate-spin" />
    
    switch (state.connectionStatus) {
      case 'connected':
        return <Wifi className="h-3 w-3" />
      case 'reconnecting':
        return <RefreshCw className="h-3 w-3 animate-spin" />
      case 'disconnected':
        return <WifiOff className="h-3 w-3" />
      default:
        return <AlertCircle className="h-3 w-3" />
    }
  }

  const getStatusText = () => {
    if (isManualRefresh) return 'Refreshing...'
    
    switch (state.connectionStatus) {
      case 'connected':
        return 'Live Data'
      case 'reconnecting':
        return 'Reconnecting...'
      case 'disconnected':
        return 'Offline'
      default:
        return 'Unknown'
    }
  }

  const timeSinceUpdate = state.lastUpdate 
    ? Math.floor((Date.now() - state.lastUpdate.getTime()) / 1000)
    : null

  const formatTimeSince = (seconds: number) => {
    if (seconds < 60) return `${seconds}s ago`
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    return `${hours}h ago`
  }

  return (
    <div className="flex items-center gap-3">
      {/* Connection Status */}
      <Badge variant="outline" className={`${getStatusColor()} flex items-center gap-1.5 px-2 py-1`}>
        {getStatusIcon()}
        <span className="text-xs font-medium">{getStatusText()}</span>
      </Badge>

      {/* Last Update Time */}
      {state.lastUpdate && (
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="h-3 w-3" />
          <span>Updated {timeSinceUpdate !== null ? formatTimeSince(timeSinceUpdate) : 'never'}</span>
        </div>
      )}

      {/* Active Alerts Count */}
      {state.alerts.filter(alert => !alert.acknowledged).length > 0 && (
        <Badge variant="destructive" className="text-xs">
          {state.alerts.filter(alert => !alert.acknowledged).length} alerts
        </Badge>
      )}

      {/* Manual Refresh Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={handleRefresh}
        disabled={isManualRefresh}
        className="h-7 px-2"
      >
        <RefreshCw className={`h-3 w-3 ${isManualRefresh ? 'animate-spin' : ''}`} />
      </Button>
    </div>
  )
}
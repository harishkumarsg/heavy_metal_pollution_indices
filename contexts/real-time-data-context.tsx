"use client"

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { environmentalAPI, WaterQualityReading } from '@/services/environmental-api'

// Types for real-time data
export interface MetalReading {
  metal: string
  value: number
  unit: string
  timestamp: Date
  location: string
  status: 'normal' | 'warning' | 'critical'
}

export interface WaterQualityData {
  location: string
  hmpi: number
  metals: MetalReading[]
  timestamp: Date
  temperature: number
  ph: number
  turbidity: number
  dissolvedOxygen: number
}

export interface RealTimeAlert {
  id: string
  type: 'pollution_spike' | 'system_failure' | 'threshold_exceeded'
  severity: 'low' | 'medium' | 'high' | 'critical'
  message: string
  location: string
  timestamp: Date
  acknowledged: boolean
}

interface RealTimeDataState {
  isConnected: boolean
  lastUpdate: Date | null
  currentData: WaterQualityData[]
  historicalData: WaterQualityData[]
  alerts: RealTimeAlert[]
  connectionStatus: 'connected' | 'disconnected' | 'reconnecting'
  dataSource: string | null
}

interface RealTimeDataContextType {
  state: RealTimeDataState
  startRealTimeUpdates: () => void
  stopRealTimeUpdates: () => void
  acknowledgeAlert: (alertId: string) => void
  getLatestReading: (location: string) => WaterQualityData | undefined
  getMetalTrend: (metal: string, hours: number) => MetalReading[]
}

const RealTimeDataContext = createContext<RealTimeDataContextType | null>(null)

const LOCATIONS = [
  'Delhi Yamuna',
  'Mumbai Mithi', 
  'Chennai Marina',
  'Kolkata Hooghly',
  'Hyderabad Musi',
  'Bangalore Vrishabhavathi'
]

const METALS = [
  { name: 'Lead', symbol: 'Pb', baseValue: 45, threshold: 50 },
  { name: 'Cadmium', symbol: 'Cd', baseValue: 28, threshold: 30 },
  { name: 'Mercury', symbol: 'Hg', baseValue: 15, threshold: 20 },
  { name: 'Arsenic', symbol: 'As', baseValue: 32, threshold: 35 },
  { name: 'Zinc', symbol: 'Zn', baseValue: 75, threshold: 100 },
  { name: 'Copper', symbol: 'Cu', baseValue: 42, threshold: 60 },
  { name: 'Chromium', symbol: 'Cr', baseValue: 38, threshold: 50 },
  { name: 'Nickel', symbol: 'Ni', baseValue: 25, threshold: 30 }
]

// Transform API data to our internal format
const transformAPIDataToInternal = (apiData: WaterQualityReading[]): WaterQualityData[] => {
  return apiData.map(reading => ({
    location: reading.location,
    hmpi: reading.hmpi || 50,
    metals: reading.metals.map(metal => ({
      metal: metal.metal,
      value: metal.value,
      unit: metal.unit,
      timestamp: reading.timestamp,
      location: reading.location,
      status: metal.status
    })),
    timestamp: reading.timestamp,
    temperature: reading.parameters.temperature || 25,
    ph: reading.parameters.ph || 7,
    turbidity: reading.parameters.turbidity || 25,
    dissolvedOxygen: reading.parameters.dissolvedOxygen || 6
  }))
}

// Fallback data generation for when APIs fail
const generateFallbackData = (): WaterQualityData[] => {
  return LOCATIONS.map(location => {
    const metals = METALS.map(metal => {
      const timeVariation = Math.sin(new Date().getHours() * 0.26) * 5
      const randomVariation = (Math.random() - 0.5) * 10
      const value = Math.max(0, metal.baseValue + timeVariation + randomVariation)
      
      let status: 'normal' | 'warning' | 'critical' = 'normal'
      if (value > metal.threshold * 1.5) status = 'critical'
      else if (value > metal.threshold) status = 'warning'
      
      return {
        metal: metal.name,
        value: Math.round(value * 100) / 100,
        unit: 'μg/L',
        timestamp: new Date(),
        location,
        status
      }
    })
    
    const hmpi = Math.round(metals.reduce((sum, metal) => {
      const metalConfig = METALS.find(m => m.name === metal.metal)!
      return sum + (metal.value / metalConfig.threshold * 100)
    }, 0) / metals.length)
    
    return {
      location,
      hmpi: Math.min(hmpi, 500),
      metals,
      timestamp: new Date(),
      temperature: 18 + Math.random() * 15,
      ph: 6.5 + Math.random() * 2,
      turbidity: Math.random() * 50,
      dissolvedOxygen: 4 + Math.random() * 6
    }
  })
}

const generateAlert = (data: WaterQualityData): RealTimeAlert | null => {
  // Check for alerts based on current readings
  for (const metal of data.metals) {
    if (metal.status === 'critical') {
      return {
        id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type: 'threshold_exceeded',
        severity: 'critical',
        message: `Critical ${metal.metal} level detected: ${metal.value} ${metal.unit} at ${data.location}`,
        location: data.location,
        timestamp: new Date(),
        acknowledged: false
      }
    } else if (metal.status === 'warning' && Math.random() < 0.3) { // 30% chance of warning alert
      return {
        id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type: 'pollution_spike',
        severity: 'medium',
        message: `Elevated ${metal.metal} levels: ${metal.value} ${metal.unit} at ${data.location}`,
        location: data.location,
        timestamp: new Date(),
        acknowledged: false
      }
    }
  }
  
  // Random system alerts
  if (Math.random() < 0.01) { // 1% chance
    return {
      id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: 'system_failure',
      severity: 'high',
      message: `Sensor connectivity issues detected at ${data.location}`,
      location: data.location,
      timestamp: new Date(),
      acknowledged: false
    }
  }
  
  return null
}

export function RealTimeDataProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<RealTimeDataState>({
    isConnected: false,
    lastUpdate: null,
    currentData: [],
    historicalData: [],
    alerts: [],
    connectionStatus: 'disconnected',
    dataSource: null
  })
  
  const [updateInterval, setUpdateInterval] = useState<NodeJS.Timeout | null>(null)
  
  const updateData = useCallback(async () => {
    setState(prev => ({ ...prev, connectionStatus: 'reconnecting' }))
    
    try {
      console.log('🔄 Fetching real-time environmental data...')
      const apiResponse = await environmentalAPI.fetchRealTimeData()
      
      if (apiResponse.success && apiResponse.data) {
        const transformedData = transformAPIDataToInternal(apiResponse.data)
        
        // Generate alerts for new data
        const newAlerts: RealTimeAlert[] = []
        transformedData.forEach(data => {
          const alert = generateAlert(data)
          if (alert) newAlerts.push(alert)
        })
        
        setState(prev => ({
          ...prev,
          currentData: transformedData,
          historicalData: [...prev.historicalData.slice(-1000), ...transformedData],
          alerts: [...prev.alerts, ...newAlerts].slice(-50),
          lastUpdate: new Date(),
          isConnected: true,
          connectionStatus: 'connected',
          dataSource: apiResponse.source
        }))
        
        console.log(`✅ Successfully updated data from: ${apiResponse.source}`)
      } else {
        throw new Error(apiResponse.error || 'API returned no data')
      }
    } catch (error) {
      console.warn('⚠️ API fetch failed, using fallback data:', error)
      
      // Use fallback data if enabled
      const enableFallback = process.env.NEXT_PUBLIC_ENABLE_SIMULATION_FALLBACK !== 'false'
      
      if (enableFallback) {
        const fallbackData = generateFallbackData()
        
        setState(prev => ({
          ...prev,
          currentData: fallbackData,
          historicalData: [...prev.historicalData.slice(-1000), ...fallbackData],
          lastUpdate: new Date(),
          isConnected: true,
          connectionStatus: 'connected',
          dataSource: 'Simulated Data (Fallback)'
        }))
        
        console.log('🔄 Using simulated fallback data')
      } else {
        setState(prev => ({
          ...prev,
          isConnected: false,
          connectionStatus: 'disconnected',
          dataSource: 'Disconnected'
        }))
      }
    }
  }, [])
  
  const startRealTimeUpdates = useCallback(() => {
    if (updateInterval) return // Already running
    
    setState(prev => ({ ...prev, connectionStatus: 'reconnecting' }))
    
    // Initial data load
    updateData()
    
    // Set up interval for updates (configurable via env var)
    const refreshInterval = parseInt(process.env.NEXT_PUBLIC_DATA_REFRESH_INTERVAL || '30000')
    const interval = setInterval(updateData, refreshInterval)
    setUpdateInterval(interval)
    
    setState(prev => ({ 
      ...prev, 
      isConnected: true,
      connectionStatus: 'connected'
    }))
  }, [updateData, updateInterval])
  
  const stopRealTimeUpdates = useCallback(() => {
    if (updateInterval) {
      clearInterval(updateInterval)
      setUpdateInterval(null)
    }
    
    setState(prev => ({
      ...prev,
      isConnected: false,
      connectionStatus: 'disconnected'
    }))
  }, [updateInterval])
  
  const acknowledgeAlert = useCallback((alertId: string) => {
    setState(prev => ({
      ...prev,
      alerts: prev.alerts.map(alert => 
        alert.id === alertId ? { ...alert, acknowledged: true } : alert
      )
    }))
  }, [])
  
  const getLatestReading = useCallback((location: string): WaterQualityData | undefined => {
    return state.currentData.find(data => data.location === location)
  }, [state.currentData])
  
  const getMetalTrend = useCallback((metal: string, hours: number): MetalReading[] => {
    const cutoffTime = new Date(Date.now() - hours * 60 * 60 * 1000)
    const readings: MetalReading[] = []
    
    state.historicalData
      .filter(data => data.timestamp >= cutoffTime)
      .forEach(data => {
        const metalReading = data.metals.find(m => m.metal === metal)
        if (metalReading) readings.push(metalReading)
      })
    
    return readings.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
  }, [state.historicalData])
  
  // Auto-start when component mounts
  useEffect(() => {
    startRealTimeUpdates()
    return () => stopRealTimeUpdates()
  }, [startRealTimeUpdates, stopRealTimeUpdates])
  
  // Simulate occasional disconnections
  useEffect(() => {
    if (!state.isConnected) return
    
    const disconnectionChance = setInterval(() => {
      if (Math.random() < 0.02) { // 2% chance every check
        setState(prev => ({ ...prev, connectionStatus: 'reconnecting' }))
        setTimeout(() => {
          setState(prev => ({ ...prev, connectionStatus: 'connected' }))
        }, 2000 + Math.random() * 3000) // Reconnect after 2-5 seconds
      }
    }, 10000) // Check every 10 seconds
    
    return () => clearInterval(disconnectionChance)
  }, [state.isConnected])
  
  const contextValue: RealTimeDataContextType = {
    state,
    startRealTimeUpdates,
    stopRealTimeUpdates,
    acknowledgeAlert,
    getLatestReading,
    getMetalTrend
  }
  
  return (
    <RealTimeDataContext.Provider value={contextValue}>
      {children}
    </RealTimeDataContext.Provider>
  )
}

export function useRealTimeData(): RealTimeDataContextType {
  const context = useContext(RealTimeDataContext)
  if (!context) {
    throw new Error('useRealTimeData must be used within a RealTimeDataProvider')
  }
  return context
}

// Hook for specific location data
export function useLocationData(location: string) {
  const { state, getLatestReading } = useRealTimeData()
  
  const locationData = getLatestReading(location)
  const isStale = locationData && state.lastUpdate 
    ? (Date.now() - state.lastUpdate.getTime()) > 30000 // 30 seconds
    : true
  
  return {
    data: locationData,
    isStale,
    lastUpdate: state.lastUpdate
  }
}

// Hook for metal-specific trends
export function useMetalTrend(metal: string, hours: number = 24) {
  const { getMetalTrend } = useRealTimeData()
  return getMetalTrend(metal, hours)
}
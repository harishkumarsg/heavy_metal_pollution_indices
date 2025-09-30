"use client"

import dynamic from 'next/dynamic'
import { Skeleton } from '@/components/ui/skeleton'

// Dynamically import the map component to avoid SSR issues
const MapComponent = dynamic(
  () => import('./leaflet-map').then((mod) => ({ default: mod.MapComponent })),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center">
        <div className="space-y-3 w-full">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-[400px] w-full rounded-lg" />
        </div>
      </div>
    ),
  }
)

interface RealMapProps {
  sites: Array<{
    id: number
    name: string
    location: string
    lat: number
    lng: number
    hmpi: number
    status: string
    lastUpdated: string
    metals: string[]
    trend: string
  }>
  onSiteClick: (site: any) => void
  mapView: 'satellite' | 'terrain' | 'political'
  showHeatmap: boolean
  zoomLevel: number
}

export function RealMap(props: RealMapProps) {
  return <MapComponent {...props} />
}
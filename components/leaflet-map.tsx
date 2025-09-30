"use client"

import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix for default markers in Leaflet with Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

interface MapComponentProps {
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

export function MapComponent({ sites, onSiteClick, mapView, showHeatmap, zoomLevel }: MapComponentProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)
  const markersRef = useRef<L.Marker[]>([])
  const heatmapRef = useRef<L.LayerGroup | null>(null)

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return

    // Initialize the map
    const map = L.map(mapRef.current, {
      center: [20.5937, 78.9629], // Center of India
      zoom: 5,
      zoomControl: true,
      scrollWheelZoom: true,
      doubleClickZoom: true,
    })

    mapInstanceRef.current = map

    // Add tile layer based on mapView
    const getTileLayer = (view: string) => {
      switch (view) {
        case 'satellite':
          return L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
            attribution: '&copy; <a href="https://www.esri.com/">Esri</a> &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
          })
        case 'terrain':
          return L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
            attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
          })
        case 'political':
        default:
          return L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          })
      }
    }

    const tileLayer = getTileLayer(mapView)
    tileLayer.addTo(map)

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [])

  // Update tile layer when mapView changes
  useEffect(() => {
    if (!mapInstanceRef.current) return

    // Remove existing tile layers
    mapInstanceRef.current.eachLayer((layer) => {
      if (layer instanceof L.TileLayer) {
        mapInstanceRef.current?.removeLayer(layer)
      }
    })

    // Add new tile layer
    const getTileLayer = (view: string) => {
      switch (view) {
        case 'satellite':
          return L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
            attribution: '&copy; <a href="https://www.esri.com/">Esri</a>'
          })
        case 'terrain':
          return L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://opentopomap.org">OpenTopoMap</a>'
          })
        case 'political':
        default:
          return L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          })
      }
    }

    const tileLayer = getTileLayer(mapView)
    tileLayer.addTo(mapInstanceRef.current)
  }, [mapView])

  // Update markers when sites change
  useEffect(() => {
    if (!mapInstanceRef.current) return

    // Clear existing markers
    markersRef.current.forEach(marker => {
      mapInstanceRef.current?.removeLayer(marker)
    })
    markersRef.current = []

    // Add new markers
    sites.forEach(site => {
      const getMarkerColor = (status: string) => {
        switch (status) {
          case 'critical': return '#ef4444' // red
          case 'moderate': return '#f59e0b' // yellow/orange
          case 'safe': return '#10b981' // green
          default: return '#6b7280' // gray
        }
      }

      const color = getMarkerColor(site.status)
      
      // Create custom colored marker
      const markerIcon = L.divIcon({
        className: 'custom-marker',
        html: `
          <div style="
            width: 20px;
            height: 20px;
            background-color: ${color};
            border: 3px solid white;
            border-radius: 50%;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            position: relative;
          ">
            ${site.status === 'critical' ? `
              <div style="
                position: absolute;
                top: -10px;
                left: -10px;
                width: 40px;
                height: 40px;
                background-color: ${color};
                border-radius: 50%;
                opacity: 0.3;
                animation: pulse 2s infinite;
              "></div>
            ` : ''}
          </div>
        `,
        iconSize: [20, 20],
        iconAnchor: [10, 10],
      })

      const marker = L.marker([site.lat, site.lng], { icon: markerIcon })
        .addTo(mapInstanceRef.current!)

      // Create popup content
      const popupContent = `
        <div style="min-width: 200px;">
          <h3 style="margin: 0 0 8px 0; font-size: 14px; font-weight: bold;">${site.name}</h3>
          <p style="margin: 0 0 4px 0; font-size: 12px; color: #666;">${site.location}</p>
          <div style="margin: 8px 0;">
            <span style="
              display: inline-block;
              padding: 2px 8px;
              border-radius: 12px;
              font-size: 11px;
              font-weight: bold;
              color: white;
              background-color: ${color};
              text-transform: uppercase;
            ">${site.status}</span>
          </div>
          <p style="margin: 4px 0; font-size: 12px;"><strong>HMPI:</strong> ${site.hmpi.toFixed(1)}</p>
          <p style="margin: 4px 0; font-size: 12px;"><strong>Metals:</strong> ${site.metals.join(', ')}</p>
          <p style="margin: 4px 0; font-size: 12px;"><strong>Last Updated:</strong> ${site.lastUpdated}</p>
          <button 
            onclick="window.openSiteDetails && window.openSiteDetails(${site.id})"
            style="
              margin-top: 8px;
              padding: 4px 12px;
              background-color: #3b82f6;
              color: white;
              border: none;
              border-radius: 4px;
              font-size: 12px;
              cursor: pointer;
            "
          >
            View Details
          </button>
        </div>
      `

      marker.bindPopup(popupContent)
      
      // Handle click
      marker.on('click', () => {
        onSiteClick(site)
      })

      markersRef.current.push(marker)
    })

    // Add global function for popup buttons
    ;(window as any).openSiteDetails = (siteId: number) => {
      const site = sites.find(s => s.id === siteId)
      if (site) {
        onSiteClick(site)
      }
    }
  }, [sites, onSiteClick])

  // Handle zoom level changes
  useEffect(() => {
    if (!mapInstanceRef.current) return
    
    const targetZoom = Math.round(5 + (zoomLevel - 1) * 3) // Convert 1-2 range to 5-8 zoom levels
    mapInstanceRef.current.setZoom(targetZoom)
  }, [zoomLevel])

  // Handle heatmap toggle
  useEffect(() => {
    if (!mapInstanceRef.current) return

    if (heatmapRef.current) {
      mapInstanceRef.current.removeLayer(heatmapRef.current)
      heatmapRef.current = null
    }

    if (showHeatmap && sites.length > 0) {
      const heatmapLayer = L.layerGroup()
      
      sites.forEach(site => {
        const intensity = site.hmpi / 100 // Normalize to 0-1
        const radius = 50000 + (intensity * 30000) // Base radius + intensity scaling
        
        const circle = L.circle([site.lat, site.lng], {
          radius: radius,
          fillColor: site.status === 'critical' ? '#ef4444' : 
                     site.status === 'moderate' ? '#f59e0b' : '#10b981',
          fillOpacity: 0.2 + (intensity * 0.3),
          stroke: false
        })
        
        heatmapLayer.addLayer(circle)
      })
      
      heatmapLayer.addTo(mapInstanceRef.current)
      heatmapRef.current = heatmapLayer
    }
  }, [showHeatmap, sites])

  return (
    <>
      <style jsx global>{`
        @keyframes pulse {
          0% {
            transform: scale(0.95);
            opacity: 0.5;
          }
          70% {
            transform: scale(1);
            opacity: 0.3;
          }
          100% {
            transform: scale(0.95);
            opacity: 0.5;
          }
        }
      `}</style>
      <div 
        ref={mapRef} 
        className="w-full h-full rounded-lg overflow-hidden"
        style={{ minHeight: '500px' }}
      />
    </>
  )
}
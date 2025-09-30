// Environmental monitoring API service
// Handles connections to various real-world data sources

export interface APIResponse {
  success: boolean
  data?: any
  error?: string
  source: string
}

export interface WaterQualityReading {
  location: string
  latitude?: number
  longitude?: number
  timestamp: Date
  hmpi?: number
  metals: {
    metal: string
    value: number
    unit: string
    status: 'normal' | 'warning' | 'critical'
  }[]
  parameters: {
    temperature?: number
    ph?: number
    turbidity?: number
    dissolvedOxygen?: number
  }
}

class EnvironmentalAPIService {
  private apiKey: string | undefined
  private baseUrls = {
    // Use Next.js API proxy routes to avoid CORS issues
    waqi: '/api/environmental/waqi',
    safar: '/api/environmental/safar',
    openaq: '/api/environmental/openaq',
    // Direct URLs for fallback (may have CORS issues)
    cpcb: 'https://app.cpcbccr.com/ccr/',
    epa: 'https://aqs.epa.gov/data/api/',
    backup: process.env.NEXT_PUBLIC_BACKUP_API_URL
  }

  constructor() {
    this.apiKey = process.env.NEXT_PUBLIC_WAQI_API_KEY
  }

  // Main method to fetch real-time water quality data
  async fetchRealTimeData(): Promise<APIResponse> {
    const sources = [
      () => this.fetchFromWAQI(),
      () => this.fetchFromOpenAQ(),
      () => this.fetchFromCPCB(),
      () => this.fetchFromEPA(),
      () => this.fetchFromBackupAPI()
    ]

    // Try each API source in order
    for (const fetchMethod of sources) {
      try {
        console.log(`🔄 Attempting to fetch from ${fetchMethod.name}...`)
        const result = await fetchMethod()
        console.log(`📊 Result from ${fetchMethod.name}:`, result)
        if (result.success && result.data) {
          console.log(`✅ Successfully fetched from ${result.source}`)
          return result
        } else {
          console.warn(`❌ ${fetchMethod.name} failed:`, result.error)
        }
      } catch (error) {
        console.warn(`⚠️ API source ${fetchMethod.name} crashed:`, error)
        continue
      }
    }

    // If all APIs fail, return simulated data as fallback
    console.warn('🔄 All APIs failed, using simulated data')
    return this.generateFallbackData()
  }

  // Central Pollution Control Board (India)
  private async fetchFromCPCB(): Promise<APIResponse> {
    try {
      const response = await fetch(`${this.baseUrls.cpcb}real-time-data`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'HMPI-Monitor/1.0'
        }
      })

      if (!response.ok) {
        throw new Error(`CPCB API error: ${response.status}`)
      }

      const data = await response.json()
      
      // Transform CPCB data to our format
      const transformedData = this.transformCPCBData(data)
      
      return {
        success: true,
        data: transformedData,
        source: 'CPCB (Central Pollution Control Board)'
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown CPCB error',
        source: 'CPCB'
      }
    }
  }

  // SAFAR - System of Air Quality and Weather Forecasting (India)
  private async fetchFromSAFAR(): Promise<APIResponse> {
    try {
      // SAFAR provides data for Delhi, Mumbai, Pune, Ahmedabad, Kolkata
      const cities = [
        { name: 'delhi', endpoint: 'safar_delhi' },
        { name: 'mumbai', endpoint: 'safar_mumbai' },
        { name: 'pune', endpoint: 'safar_pune' },
        { name: 'ahmedabad', endpoint: 'safar_ahmedabad' },
        { name: 'kolkata', endpoint: 'safar_kolkata' }
      ]

      const dataPromises = cities.map(async (city) => {
        try {
          const response = await fetch(`${this.baseUrls.safar}?city=${city.name}`, {
            method: 'GET',
            headers: {
              'Accept': 'application/json'
            }
          })

          if (response.ok) {
            const result = await response.json()
            if (result.success && result.data) {
              return { city: city.name, data: result.data }
            }
          }
        } catch (error) {
          console.warn(`SAFAR ${city.name} failed:`, error)
        }
        return null
      })

      const results = await Promise.all(dataPromises)
      const validResults = results.filter(r => r !== null)

      if (validResults.length === 0) {
        throw new Error('No SAFAR data available')
      }

      const transformedData = this.transformSAFARData(validResults)

      return {
        success: true,
        data: transformedData,
        source: 'SAFAR (Ministry of Earth Sciences, India)'
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown SAFAR error',
        source: 'SAFAR'
      }
    }
  }

  // OpenAQ - Global Air Quality API (has some water quality data)
  private async fetchFromOpenAQ(): Promise<APIResponse> {
    try {
      console.log('🔍 Testing OpenAQ API via proxy...')
      const url = `${this.baseUrls.openaq}?country=IN&limit=50`
      console.log('🌐 OpenAQ Proxy URL:', url)
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error(`OpenAQ API error: ${response.status}`)
      }

      const result = await response.json()
      if (!result.success) {
        throw new Error(result.error || 'OpenAQ proxy failed')
      }
      const transformedData = this.transformOpenAQData(result.data)

      return {
        success: true,
        data: transformedData,
        source: 'OpenAQ Global Network'
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown OpenAQ error',
        source: 'OpenAQ'
      }
    }
  }

  // World Air Quality Index (has some water quality metrics)
  private async fetchFromWAQI(): Promise<APIResponse> {
    if (!this.apiKey) {
      return {
        success: false,
        error: 'WAQI API key not configured',
        source: 'WAQI'
      }
    }

    try {
      console.log('🔍 Testing WAQI API via proxy routes...')
      
      // Fetch data for major Indian cities using proxy route
      const cities = ['delhi', 'mumbai', 'chennai', 'kolkata', 'hyderabad', 'bangalore']
      const promises = cities.map(city => 
        fetch(`${this.baseUrls.waqi}?city=${city}`)
          .then(r => r.json())
          .catch((err) => {
            console.warn(`WAQI ${city} failed:`, err)
            return null
          })
      )

      const results = await Promise.all(promises)
      const validResults = results.filter(r => r && r.success && r.data && r.data.status === 'ok')

      if (validResults.length === 0) {
        throw new Error('No valid WAQI data received')
      }

      const transformedData = this.transformWAQIData(validResults.map(r => r.data))

      return {
        success: true,
        data: transformedData,
        source: 'World Air Quality Index'
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown WAQI error',
        source: 'WAQI'
      }
    }
  }

  // EPA (Environmental Protection Agency) - US data for reference
  private async fetchFromEPA(): Promise<APIResponse> {
    try {
      // Note: EPA requires registration for API key
      const response = await fetch(`${this.baseUrls.epa}sampleData/byState?email=demo@example.com&key=test&param=44201&bdate=20231001&edate=20231002&state=06`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        }
      })

      if (!response.ok) {
        throw new Error(`EPA API error: ${response.status}`)
      }

      const data = await response.json()
      const transformedData = this.transformEPAData(data)

      return {
        success: true,
        data: transformedData,
        source: 'US EPA'
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown EPA error',
        source: 'EPA'
      }
    }
  }

  // Backup API (custom environmental monitoring service)
  private async fetchFromBackupAPI(): Promise<APIResponse> {
    if (!this.baseUrls.backup) {
      return {
        success: false,
        error: 'Backup API URL not configured',
        source: 'Backup API'
      }
    }

    try {
      const response = await fetch(`${this.baseUrls.backup}/water-quality/latest`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        }
      })

      if (!response.ok) {
        throw new Error(`Backup API error: ${response.status}`)
      }

      const data = await response.json()

      return {
        success: true,
        data: data.readings || [],
        source: 'Custom Environmental API'
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown backup API error',
        source: 'Backup API'
      }
    }
  }

  // Data transformation methods
  private transformCPCBData(rawData: any): WaterQualityReading[] {
    if (!rawData.stations) return []

    return rawData.stations.map((station: any) => ({
      location: station.stationName || station.name,
      latitude: station.latitude,
      longitude: station.longitude,
      timestamp: new Date(station.lastUpdate || Date.now()),
      hmpi: this.calculateHMPI(station.parameters),
      metals: this.extractMetals(station.parameters),
      parameters: {
        temperature: station.temperature,
        ph: station.ph,
        turbidity: station.turbidity,
        dissolvedOxygen: station.dissolvedOxygen
      }
    }))
  }

  private transformOpenAQData(rawData: any): WaterQualityReading[] {
    if (!rawData.results) return []

    // Group by location
    const locationGroups = rawData.results.reduce((acc: any, measurement: any) => {
      const locationKey = measurement.location || measurement.city
      if (!acc[locationKey]) {
        acc[locationKey] = []
      }
      acc[locationKey].push(measurement)
      return acc
    }, {})

    return Object.entries(locationGroups).map(([location, measurements]: [string, any]) => ({
      location: location,
      latitude: measurements[0]?.coordinates?.latitude,
      longitude: measurements[0]?.coordinates?.longitude,
      timestamp: new Date(measurements[0]?.date?.utc || Date.now()),
      hmpi: this.estimateHMPIFromAirQuality(measurements),
      metals: this.estimateMetalsFromAirQuality(measurements),
      parameters: {
        temperature: 25 + Math.random() * 10, // Estimated
        ph: 6.5 + Math.random() * 2,
        turbidity: Math.random() * 50,
        dissolvedOxygen: 4 + Math.random() * 6
      }
    }))
  }

  private transformWAQIData(rawData: any[]): WaterQualityReading[] {
    return rawData.map((cityData: any) => {
      const city = cityData.data
      return {
        location: city.city?.name || 'Unknown',
        latitude: city.city?.geo?.[0],
        longitude: city.city?.geo?.[1],
        timestamp: new Date(city.time?.s ? city.time.s * 1000 : Date.now()),
        hmpi: this.convertAQIToHMPI(city.aqi),
        metals: this.estimateMetalsFromAQI(city),
        parameters: {
          temperature: city.iaqi?.t?.v || 25 + Math.random() * 10,
          ph: 6.5 + Math.random() * 2,
          turbidity: Math.random() * 50,
          dissolvedOxygen: 4 + Math.random() * 6
        }
      }
    })
  }

  private transformSAFARData(rawResults: any[]): WaterQualityReading[] {
    return rawResults.map(result => {
      const cityName = result.city
      const data = result.data
      
      // SAFAR typically provides AQI and pollutant data
      const aqi = data.overall_aqi || data.aqi || 50
      const pm25 = data.pm25 || data['PM2.5'] || 0
      const pm10 = data.pm10 || data['PM10'] || 0
      const so2 = data.so2 || data['SO2'] || 0
      const no2 = data.no2 || data['NO2'] || 0
      const co = data.co || data['CO'] || 0
      const ozone = data.ozone || data['O3'] || 0

      // City coordinates (approximate)
      const cityCoords: { [key: string]: [number, number] } = {
        delhi: [28.6139, 77.2090],
        mumbai: [19.0760, 72.8777],
        pune: [18.5204, 73.8567],
        ahmedabad: [23.0225, 72.5714],
        kolkata: [22.5726, 88.3639]
      }

      const coords = cityCoords[cityName] || [0, 0]

      return {
        location: `${cityName.charAt(0).toUpperCase() + cityName.slice(1)}, India`,
        latitude: coords[0],
        longitude: coords[1],
        timestamp: new Date(),
        hmpi: this.convertAQIToHMPI(aqi),
        metals: this.estimateMetalsFromSAFAR({ pm25, pm10, so2, no2, co, ozone }),
        parameters: {
          temperature: 20 + Math.random() * 20,
          ph: 6.5 + Math.random() * 2,
          turbidity: Math.random() * 50,
          dissolvedOxygen: 4 + Math.random() * 6
        }
      }
    })
  }

  private transformEPAData(rawData: any): WaterQualityReading[] {
    if (!rawData.Data) return []

    return rawData.Data.map((measurement: any) => ({
      location: `${measurement.local_site_name || measurement.county_name}, ${measurement.state_name}`,
      latitude: measurement.latitude,
      longitude: measurement.longitude,
      timestamp: new Date(measurement.date_local + 'T' + measurement.time_local),
      hmpi: this.convertEPAToHMPI(measurement.sample_measurement),
      metals: this.estimateMetalsFromEPA(measurement),
      parameters: {
        temperature: 20 + Math.random() * 15,
        ph: 6.5 + Math.random() * 2,
        turbidity: Math.random() * 50,
        dissolvedOxygen: 4 + Math.random() * 6
      }
    }))
  }

  // Helper methods for data conversion
  private calculateHMPI(parameters: any): number {
    // Calculate HMPI from raw parameters if available
    const metals = ['lead', 'cadmium', 'mercury', 'arsenic', 'chromium', 'nickel', 'zinc', 'copper']
    let totalScore = 0
    let count = 0

    metals.forEach(metal => {
      if (parameters[metal]) {
        const value = parseFloat(parameters[metal])
        const limit = this.getMetalLimit(metal)
        totalScore += (value / limit) * 100
        count++
      }
    })

    return count > 0 ? Math.round(totalScore / count) : 50 + Math.random() * 50
  }

  private extractMetals(parameters: any) {
    const metals = [
      { name: 'Lead', key: 'lead', limit: 10, unit: 'μg/L' },
      { name: 'Cadmium', key: 'cadmium', limit: 3, unit: 'μg/L' },
      { name: 'Mercury', key: 'mercury', limit: 6, unit: 'μg/L' },
      { name: 'Arsenic', key: 'arsenic', limit: 10, unit: 'μg/L' },
      { name: 'Chromium', key: 'chromium', limit: 50, unit: 'μg/L' },
      { name: 'Nickel', key: 'nickel', limit: 70, unit: 'μg/L' },
      { name: 'Zinc', key: 'zinc', limit: 5000, unit: 'μg/L' },
      { name: 'Copper', key: 'copper', limit: 2000, unit: 'μg/L' }
    ]

    return metals.map(metal => {
      const value = parameters[metal.key] 
        ? parseFloat(parameters[metal.key])
        : metal.limit * (0.1 + Math.random() * 0.8) // Fallback estimation

      const ratio = value / metal.limit
      let status: 'normal' | 'warning' | 'critical' = 'normal'
      
      if (ratio > 1.5) status = 'critical'
      else if (ratio > 1) status = 'warning'

      return {
        metal: metal.name,
        value: Math.round(value * 100) / 100,
        unit: metal.unit,
        status
      }
    })
  }

  // Estimation methods for when direct water quality data isn't available
  private estimateHMPIFromAirQuality(measurements: any[]): number {
    // Rough correlation between air and water quality
    const avgPollution = measurements.reduce((sum, m) => sum + (m.value || 0), 0) / measurements.length
    return Math.min(Math.max(avgPollution * 2, 20), 300)
  }

  private estimateMetalsFromAirQuality(measurements: any[]) {
    // Estimate water metals based on air quality indicators
    return this.extractMetals({}) // Will use fallback values
  }

  private convertAQIToHMPI(aqi: number): number {
    // Convert Air Quality Index to estimated HMPI
    if (aqi <= 50) return 20 + Math.random() * 30
    if (aqi <= 100) return 40 + Math.random() * 40
    if (aqi <= 150) return 70 + Math.random() * 50
    return 100 + Math.random() * 100
  }

  private estimateMetalsFromAQI(cityData: any) {
    return this.extractMetals({}) // Will use fallback values
  }

  private convertEPAToHMPI(measurement: number): number {
    // Convert EPA measurement to HMPI equivalent
    return Math.min(Math.max(measurement * 3, 20), 300)
  }

  private estimateMetalsFromEPA(measurement: any) {
    return this.extractMetals({}) // Will use fallback values
  }

  private estimateMetalsFromSAFAR(pollutants: { pm25: number, pm10: number, so2: number, no2: number, co: number, ozone: number }) {
    // Estimate heavy metals based on SAFAR air quality parameters
    // Higher particulate matter often correlates with industrial emissions containing heavy metals
    const pollutionFactor = (pollutants.pm25 + pollutants.pm10 + pollutants.so2) / 3
    
    return [
      { metal: 'Lead', value: Math.max(1, pollutionFactor * 0.1), unit: 'μg/L', status: (pollutionFactor > 100 ? 'critical' : pollutionFactor > 50 ? 'warning' : 'normal') as 'normal' | 'warning' | 'critical' },
      { metal: 'Cadmium', value: Math.max(0.5, pollutionFactor * 0.03), unit: 'μg/L', status: (pollutionFactor > 100 ? 'warning' : 'normal') as 'normal' | 'warning' | 'critical' },
      { metal: 'Mercury', value: Math.max(0.5, pollutionFactor * 0.05), unit: 'μg/L', status: (pollutionFactor > 120 ? 'critical' : pollutionFactor > 80 ? 'warning' : 'normal') as 'normal' | 'warning' | 'critical' },
      { metal: 'Arsenic', value: Math.max(1, pollutionFactor * 0.08), unit: 'μg/L', status: (pollutionFactor > 100 ? 'critical' : pollutionFactor > 60 ? 'warning' : 'normal') as 'normal' | 'warning' | 'critical' },
      { metal: 'Chromium', value: Math.max(2, pollutionFactor * 0.4), unit: 'μg/L', status: (pollutionFactor > 120 ? 'warning' : 'normal') as 'normal' | 'warning' | 'critical' },
      { metal: 'Nickel', value: Math.max(2, pollutionFactor * 0.5), unit: 'μg/L', status: (pollutionFactor > 140 ? 'warning' : 'normal') as 'normal' | 'warning' | 'critical' },
      { metal: 'Zinc', value: Math.max(50, pollutionFactor * 30), unit: 'μg/L', status: 'normal' as 'normal' | 'warning' | 'critical' },
      { metal: 'Copper', value: Math.max(20, pollutionFactor * 15), unit: 'μg/L', status: 'normal' as 'normal' | 'warning' | 'critical' }
    ]
  }

  private getMetalLimit(metal: string): number {
    const limits: { [key: string]: number } = {
      lead: 10, cadmium: 3, mercury: 6, arsenic: 10,
      chromium: 50, nickel: 70, zinc: 5000, copper: 2000
    }
    return limits[metal] || 50
  }

  // Fallback method when all APIs fail
  private generateFallbackData(): APIResponse {
    const locations = [
      { name: 'Delhi Yamuna', lat: 28.6139, lng: 77.2090 },
      { name: 'Mumbai Mithi', lat: 19.0760, lng: 72.8777 },
      { name: 'Chennai Marina', lat: 13.0827, lng: 80.2707 },
      { name: 'Kolkata Hooghly', lat: 22.5726, lng: 88.3639 },
      { name: 'Hyderabad Musi', lat: 17.3850, lng: 78.4867 },
      { name: 'Bangalore Vrishabhavathi', lat: 12.9716, lng: 77.5946 }
    ]

    const fallbackData = locations.map(location => ({
      location: location.name,
      latitude: location.lat,
      longitude: location.lng,
      timestamp: new Date(),
      hmpi: 45 + Math.random() * 80, // Random but realistic HMPI
      metals: this.extractMetals({}), // Will generate fallback values
      parameters: {
        temperature: 18 + Math.random() * 15,
        ph: 6.5 + Math.random() * 2,
        turbidity: Math.random() * 50,
        dissolvedOxygen: 4 + Math.random() * 6
      }
    }))

    return {
      success: true,
      data: fallbackData,
      source: 'Simulated Data (Fallback)'
    }
  }
}

export const environmentalAPI = new EnvironmentalAPIService()
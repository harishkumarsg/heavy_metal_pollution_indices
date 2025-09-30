import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const city = searchParams.get('city') || 'delhi'
  
  try {
    const safar_url = `https://safar.tropmet.res.in/assets/services/data/safar_${city}_aqi_bulletin.json`
    
    const response = await fetch(safar_url, {
      headers: {
        'User-Agent': 'HMPI-Monitor/1.0',
        'Accept': 'application/json',
        'Referer': 'https://safar.tropmet.res.in/'
      }
    })

    if (!response.ok) {
      throw new Error(`SAFAR API error: ${response.status}`)
    }

    const data = await response.json()
    
    return NextResponse.json({
      success: true,
      data: data,
      source: 'SAFAR (Ministry of Earth Sciences, India)',
      city: city
    })

  } catch (error) {
    console.error(`SAFAR Proxy Error for ${city}:`, error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown SAFAR error',
      source: 'SAFAR',
      city: city
    }, { status: 500 })
  }
}
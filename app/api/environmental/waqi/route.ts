import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const city = searchParams.get('city') || 'delhi'
  
  const apiKey = process.env.NEXT_PUBLIC_WAQI_API_KEY
  
  if (!apiKey) {
    return NextResponse.json(
      { error: 'WAQI API key not configured' },
      { status: 500 }
    )
  }

  try {
    const waqi_url = `https://api.waqi.info/feed/${city}/?token=${apiKey}`
    
    const response = await fetch(waqi_url, {
      headers: {
        'User-Agent': 'HMPI-Monitor/1.0',
      }
    })

    if (!response.ok) {
      throw new Error(`WAQI API error: ${response.status}`)
    }

    const data = await response.json()
    
    return NextResponse.json({
      success: true,
      data: data,
      source: 'WAQI (World Air Quality Index)'
    })

  } catch (error) {
    console.error('WAQI Proxy Error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown WAQI error',
      source: 'WAQI'
    }, { status: 500 })
  }
}
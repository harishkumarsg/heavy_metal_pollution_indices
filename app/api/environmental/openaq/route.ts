import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const country = searchParams.get('country') || 'IN'
  const limit = searchParams.get('limit') || '50'
  
  try {
    const openaq_url = `https://api.openaq.org/v2/latest?country=${country}&parameter=pm25,pm10&limit=${limit}`
    
    const response = await fetch(openaq_url, {
      headers: {
        'User-Agent': 'HMPI-Monitor/1.0',
        'Accept': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error(`OpenAQ API error: ${response.status}`)
    }

    const data = await response.json()
    
    return NextResponse.json({
      success: true,
      data: data,
      source: 'OpenAQ Global Network'
    })

  } catch (error) {
    console.error('OpenAQ Proxy Error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown OpenAQ error',
      source: 'OpenAQ'
    }, { status: 500 })
  }
}
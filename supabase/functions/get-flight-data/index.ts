import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { iataCode, date } = await req.json()
    
    const apiKey = Deno.env.get('AERODATABOX_API_KEY')
    if (!apiKey) {
      throw new Error('AERODATABOX_API_KEY not found in environment variables')
    }

    console.log(`Fetching flight data for ${iataCode} on ${date}`)

    const response = await fetch(
      `https://aerodatabox.p.rapidapi.com/flights/airports/iata/${iataCode}/${date}?withLeg=false&direction=Arrival&withCancelled=false&withCodeshared=true&withCargo=false&withPrivate=false&withLocation=false`,
      {
        headers: {
          'X-RapidAPI-Key': apiKey,
          'X-RapidAPI-Host': 'aerodatabox.p.rapidapi.com'
        }
      }
    )

    if (!response.ok) {
      console.error(`Flight API error: ${response.status}`)
      throw new Error(`Flight API error: ${response.status}`)
    }

    const data = await response.json()
    console.log(`Found ${data.arrivals?.length || 0} flights`)
    
    // Transform the data to match our interface
    const transformedData = data.arrivals?.slice(0, 10)?.map((flight: any, index: number) => ({
      id: `flight-${index}`,
      title: `${flight.airline?.name || 'Unknown'} ${flight.number || ''} - ${flight.departure?.airport?.name || 'Unknown'}`,
      type: 'flight',
      time: flight.arrival?.scheduledTime?.local ? 
        new Date(flight.arrival.scheduledTime.local).toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit', 
          hour12: false 
        }) : 'TBD',
      location: `${flight.arrival?.airport?.iata || iataCode} ${flight.arrival?.terminal ? `Terminal ${flight.arrival.terminal}` : ''}`,
      details: `Arrival from ${flight.departure?.airport?.iata || 'Unknown'}`,
      passengers: flight.aircraft?.model ? Math.floor(Math.random() * 200) + 100 : undefined,
      terminal: flight.arrival?.terminal || undefined
    })) || []

    return new Response(
      JSON.stringify({ flights: transformedData }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )
  } catch (error) {
    console.error('Flight data error:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        flights: [] 
      }),
      { 
        status: 500, 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )
  }
})
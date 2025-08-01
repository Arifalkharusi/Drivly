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
    const { from, to, type, date, time } = await req.json()
    
    const appId = Deno.env.get('TRANSPORTAPI_APP_ID')
    const appKey = Deno.env.get('TRANSPORTAPI_APP_KEY')
    
    if (!appId || !appKey) {
      throw new Error('Transport API credentials not found in environment variables')
    }

    console.log(`Fetching ${type} data from ${from} to ${to} on ${date} at ${time}`)

    const response = await fetch(
      `https://transportapi.com/v3/uk/public/journey/from/${encodeURIComponent(from)}/to/${encodeURIComponent(to)}/${date}/${time}.json?app_id=${appId}&app_key=${appKey}&modes=${type}&limit=10`,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )

    if (!response.ok) {
      console.error(`Transport API error: ${response.status}`)
      throw new Error(`Transport API error: ${response.status}`)
    }

    const data = await response.json()
    console.log(`Found ${data.routes?.length || 0} ${type} routes`)
    
    // Transform the data to match our interface
    const transformedData = data.routes?.slice(0, 8)?.map((route: any, index: number) => {
      const firstLeg = route.route_parts?.[0]
      const mode = firstLeg?.mode
      const line = firstLeg?.line_name || firstLeg?.service
      const destination = route.destination || to
      
      return {
        id: `${type}-${index}`,
        title: `${line || 'Service'} - ${destination}`,
        type: mode === 'train' ? 'train' : 'bus',
        time: firstLeg?.departure_time || 'TBD',
        location: firstLeg?.from_point_name || from,
        details: `To ${destination}`,
        passengers: Math.floor(Math.random() * 150) + 50
      }
    }) || []

    return new Response(
      JSON.stringify({ [type]: transformedData }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )
  } catch (error) {
    console.error('Transport data error:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        trains: [],
        buses: []
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
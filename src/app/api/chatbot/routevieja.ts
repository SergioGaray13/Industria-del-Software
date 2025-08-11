//src\app\api\chatbot\route.ts

import OpenAI from 'openai'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Environment variables validation
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const openaiApiKey = process.env.OPENAI_API_KEY

if (!supabaseUrl || !supabaseAnonKey || !openaiApiKey) {
  console.error('Missing environment variables:', { 
    supabaseUrl: !!supabaseUrl, 
    supabaseAnonKey: !!supabaseAnonKey, 
    openaiApiKey: !!openaiApiKey 
  })
}

const supabase = createClient(supabaseUrl!, supabaseAnonKey!)
const openai = new OpenAI({
  apiKey: openaiApiKey!,
})

// Function to detect if user is asking about salons/spaces
function detectSalonQuery(message: string): boolean {
  const salonKeywords = [
    'salon','salón','salones', 'sala', 'salas', 'espacio', 'espacios', 'aula', 'aulas',
    'capacidad', 'personas', 'cupo', 'aforo',
    'equipamiento', 'proyector', 'micrófono', 'audio', 'sonido',
    'disponible', 'disponibilidad', 'reservar', 'alquiler',
    'sesiones', 'horarios', 'programación', 'agenda',
    'responsable', 'encargado', 'contacto'
  ]
  const messageLower = message.toLowerCase()
  return salonKeywords.some(keyword => messageLower.includes(keyword))
}

// Function to detect if user is asking about lugares
function detectLugarQuery(message: string): boolean {
  const lugarKeywords = [
    'lugar', 'lugares', 'sede', 'sedes', 'centro', 'centros', 'edificio', 'edificios',
    'ubicacion', 'ubicación', 'direccion', 'dirección', 'donde', 'lugar',
    'ciudad', 'ciudades', 'municipio', 'municipios', 'departamento', 'departamentos',
    'pais', 'país', 'países', 'localización', 'localizacion',
    'sitio', 'sitios', 'instalacion', 'instalación', 'instalaciones',
    'complejo', 'complejos', 'campus'
  ]
  const messageLower = message.toLowerCase()
  return lugarKeywords.some(keyword => messageLower.includes(keyword))
}

// Function to detect if user is asking about providers
function detectProviderQuery(message: string): boolean {
  const providerKeywords = [
    'proveedor', 'proveedores', 'supplier', 'categoría', 'categorias', 'rating',
    'ubicación', 'location', 'calificación', 'reputación', 'servicio',
    'contacto', 'empresa', 'compañía', 'negocio'
  ]
  const messageLower = message.toLowerCase()
  return providerKeywords.some(keyword => messageLower.includes(keyword))
}

// Function to analyze what specific info the user wants
function analyzeQuery(message: string) {
  const messageLower = message.toLowerCase()
  return {
    // Para salones
    needsCapacity: messageLower.includes('capacidad') || messageLower.includes('personas') || messageLower.includes('cupo'),
    needsEquipment: messageLower.includes('equipamiento') || messageLower.includes('proyector') || messageLower.includes('audio'),
    needsSessions: messageLower.includes('sesiones') || messageLower.includes('horarios') || messageLower.includes('agenda'),
    needsContact: messageLower.includes('responsable') || messageLower.includes('encargado') || messageLower.includes('contacto'),
    // Para lugares
    needsAddress: messageLower.includes('direccion') || messageLower.includes('dirección') || messageLower.includes('donde'),
    needsLocation: messageLower.includes('ciudad') || messageLower.includes('municipio') || messageLower.includes('departamento'),
    needsDescription: messageLower.includes('descripcion') || messageLower.includes('descripción') || messageLower.includes('que es'),
    // General
    isGeneral: !messageLower.includes('capacidad') && !messageLower.includes('equipamiento') &&
               !messageLower.includes('sesiones') && !messageLower.includes('direccion') &&
               !messageLower.includes('ciudad') && !messageLower.includes('descripcion')
  }
}

// Function to get salon information with joins to lugares table - MEJORADA
async function getSalonInfo(query: string) {
  try {
    console.log('🔍 Starting getSalonInfo query...')
    
    // Primero intentamos una consulta básica sin joins para verificar la tabla
    const { data: basicSalones, error: basicError } = await supabase
      .from('salones')
      .select('*')
      .limit(5)

    console.log('📊 Basic salones query result:', { 
      count: basicSalones?.length || 0, 
      error: basicError 
    })

    if (basicError) {
      console.error('❌ Basic salones query failed:', basicError)
      return null
    }

    // Si la consulta básica funciona, intentamos con el join
    const { data: salones, error } = await supabase
      .from('salones')
      .select(`
        id,
        nombre,
        ubicacion,
        capacidad,
        equipamiento,
        responsable,
        descripcion,
        sesiones,
        url_imagen,
        created_at,
        lugar_id,
        lugares:lugar_id (
          id,
          nombre,
          direccion,
          ciudad,
          municipio,
          departamento
        )
      `)
      .order('nombre')

    console.log('🏢 Full salones query result:', { 
      count: salones?.length || 0, 
      error: error,
      sampleRecord: salones?.[0] || null 
    })

    if (error) {
      console.error('❌ Full salones query failed:', error)
      // Si falla el join, devolvemos los datos básicos
      return basicSalones
    }

    return salones
  } catch (error) {
    console.error('💥 Database query exception:', error)
    return null
  }
}

// Function to get lugares information - MEJORADA
async function getLugarInfo(query: string) {
  try {
    console.log('🔍 Starting getLugarInfo query...')
    
    const { data: lugares, error } = await supabase
      .from('lugares')
      .select(`
        id,
        nombre,
        direccion,
        descripcion,
        ciudad,
        municipio,
        departamento,
        pais,
        created_at
      `)
      .order('nombre')

    console.log('🏛️ Lugares query result:', { 
      count: lugares?.length || 0, 
      error: error,
      sampleRecord: lugares?.[0] || null 
    })

    if (error) {
      console.error('❌ Lugares query failed:', error)
      return null
    }

    return lugares
  } catch (error) {
    console.error('💥 Lugares query exception:', error)
    return null
  }
}

// Function to get providers information - MEJORADA
async function getProviderInfo() {
  try {
    console.log('🔍 Starting getProviderInfo query...')
    
    const { data: providers, error } = await supabase
      .from('providers')
      .select(`
        id,
        name,
        category,
        rating,
        location,
        created_at
      `)
      .order('name')

    console.log('🛠️ Providers query result:', { 
      count: providers?.length || 0, 
      error: error,
      sampleRecord: providers?.[0] || null 
    })

    if (error) {
      console.error('❌ Providers query failed:', error)
      return null
    }

    return providers
  } catch (error) {
    console.error('💥 Providers query exception:', error)
    return null
  }
}

// Function to format salon information based on user query
function formatSalonResponse(salones: any[], userQuery: string): string {
  if (!salones || salones.length === 0) {
    return 'Lo siento, no encontré información sobre salones en este momento.'
  }

  console.log('📝 Formatting salon response for', salones.length, 'salones')
  
  const queryAnalysis = analyzeQuery(userQuery)
  let response = '🏢 Información de Salones Disponibles:\n\n'

  salones.forEach((salon) => {
    response += `📍 **${salon.nombre}**\n`
    
    // Ubicación y lugar
    if (salon.ubicacion || salon.lugares) {
      response += `🏠 Ubicación: `
      if (salon.ubicacion) {
        response += salon.ubicacion
      }
      if (salon.lugares) {
        const lugar = salon.lugares
        if (lugar.nombre) response += ` - ${lugar.nombre}`
        if (lugar.ciudad) response += `, ${lugar.ciudad}`
        if (lugar.municipio && lugar.departamento) response += `, ${lugar.municipio}, ${lugar.departamento}`
      }
      response += '\n'
    }
    
    // Capacidad
    if (salon.capacidad) {
      response += `👥 Capacidad: ${salon.capacidad} personas\n`
    }
    
    // Equipamiento (solo si se pregunta específicamente o es consulta general)
    if (salon.equipamiento && salon.equipamiento.length > 0 && (queryAnalysis.needsEquipment || queryAnalysis.isGeneral)) {
      const equipamientoList = Array.isArray(salon.equipamiento) ? salon.equipamiento : [salon.equipamiento]
      response += `🔧 Equipamiento: ${equipamientoList.join(', ')}\n`
    }
    
    // Responsable (solo si se pregunta específicamente)
    if (salon.responsable && queryAnalysis.needsContact) {
      response += `👤 Responsable: ${salon.responsable}\n`
    }
    
    // Sesiones (solo si se pregunta específicamente)
    if (salon.sesiones && queryAnalysis.needsSessions) {
      try {
        const sesionesArray = Array.isArray(salon.sesiones) ? salon.sesiones : JSON.parse(salon.sesiones)
        if (sesionesArray.length > 0) {
          response += `📅 Sesiones programadas:\n`
          sesionesArray.forEach((sesion: any) => {
            response += `   • ${sesion.hora || 'Hora no especificada'}: ${sesion.tema || 'Tema no especificado'}\n`
          })
        }
      } catch (e) {
        console.error('Error parsing sessions:', e)
      }
    }
    
    // Descripción (solo en consultas generales)
    if (salon.descripcion && queryAnalysis.isGeneral) {
      response += `📝 Descripción: ${salon.descripcion}\n`
    }
    
    response += '\n'
  })

  response += '💡 Tip: Puedes preguntarme específicamente sobre capacidad, equipamiento, ubicación, sesiones o responsables de los salones.'
  
  return response
}

// Function to format lugares information based on user query
function formatLugarResponse(lugares: any[], userQuery: string): string {
  if (!lugares || lugares.length === 0) {
    return 'Lo siento, no encontré información sobre lugares en este momento.'
  }

  console.log('📝 Formatting lugares response for', lugares.length, 'lugares')
  
  const queryAnalysis = analyzeQuery(userQuery)
  let response = '🏛️ Información de Lugares Disponibles:\n\n'

  lugares.forEach((lugar) => {
    response += `📍 **${lugar.nombre}**\n`
    
    // Dirección (siempre mostrar si existe)
    if (lugar.direccion && (queryAnalysis.needsAddress || queryAnalysis.isGeneral)) {
      response += `🏠 Dirección: ${lugar.direccion}\n`
    }
    
    // Ubicación geográfica
    if ((lugar.ciudad || lugar.municipio || lugar.departamento || lugar.pais) && 
        (queryAnalysis.needsLocation || queryAnalysis.isGeneral)) {
      response += `🌍 Ubicación: `
      const ubicacionParts = []
      if (lugar.ciudad) ubicacionParts.push(lugar.ciudad)
      if (lugar.municipio && lugar.municipio !== lugar.ciudad) ubicacionParts.push(lugar.municipio)
      if (lugar.departamento) ubicacionParts.push(lugar.departamento)
      if (lugar.pais) ubicacionParts.push(lugar.pais)
      response += ubicacionParts.join(', ') + '\n'
    }
    
    // Descripción (solo si se pregunta específicamente o es consulta general)
    if (lugar.descripcion && (queryAnalysis.needsDescription || queryAnalysis.isGeneral)) {
      response += `📝 Descripción: ${lugar.descripcion}\n`
    }
    
    response += '\n'
  })

  response += '💡 Tip: Puedes preguntarme específicamente sobre direcciones, ciudades, descripción o ubicación de los lugares.'
  
  return response
}

// Function to format providers information
function formatProviderResponse(providers: any[]): string {
  if (!providers || providers.length === 0) {
    return 'Lo siento, no encontré información sobre proveedores en este momento.'
  }

  console.log('📝 Formatting providers response for', providers.length, 'providers')

  let response = '🛠️ Información de Proveedores Disponibles:\n\n'

  providers.forEach((provider) => {
    response += `📍 **${provider.name}**\n`
    if (provider.category) response += `📂 Categoría: ${provider.category}\n`
    if (provider.rating !== null && provider.rating !== undefined) response += `⭐ Calificación: ${provider.rating}\n`
    if (provider.location) response += `🏠 Ubicación: ${provider.location}\n`
    response += '\n'
  })

  response += '💡 Tip: Puedes preguntarme sobre proveedores por categoría, ubicación o calificación.'

  return response
}

// Function to search salons by specific criteria
async function searchSalonsByCapacity(minCapacity: number) {
  try {
    console.log(`🔍 Searching salones with capacity >= ${minCapacity}`)
    
    const { data, error } = await supabase
      .from('salones')
      .select(`
        nombre,
        capacidad,
        ubicacion,
        equipamiento,
        lugares:lugar_id (nombre, ciudad)
      `)
      .gte('capacidad', minCapacity)
      .order('capacidad')

    console.log('📊 Capacity search result:', { 
      count: data?.length || 0, 
      error: error 
    })

    if (error) {
      console.error('❌ Capacity search failed:', error)
      return null
    }
    return data
  } catch (error) {
    console.error('💥 Capacity search exception:', error)
    return null
  }
}

// Function to search lugares by city or department
async function searchLugaresByLocation(location: string) {
  try {
    console.log(`🔍 Searching lugares by location: ${location}`)
    
    const { data, error } = await supabase
      .from('lugares')
      .select('*')
      .or(`ciudad.ilike.%${location}%,municipio.ilike.%${location}%,departamento.ilike.%${location}%`)
      .order('nombre')

    console.log('📊 Location search result:', { 
      count: data?.length || 0, 
      error: error 
    })

    if (error) {
      console.error('❌ Location search failed:', error)
      return null
    }
    return data
  } catch (error) {
    console.error('💥 Location search exception:', error)
    return null
  }
}

export async function POST(req: NextRequest) {
  try {
    console.log('=== 🚀 CHATBOT API STARTED ===')

    // Parse request
    let body
    try {
      body = await req.json()
    } catch (parseError) {
      console.error('❌ JSON parse error:', parseError)
      return NextResponse.json(
        { reply: 'Formato de solicitud inválido.' },
        { status: 400 }
      )
    }

    const { message } = body

    if (!message || typeof message !== 'string' || message.trim() === '') {
      console.error('❌ Invalid message received')
      return NextResponse.json(
        { reply: 'El mensaje es requerido.' },
        { status: 400 }
      )
    }

    console.log('📨 Processing message:', message)

    // Check what type of query this is
    const isSalonQuery = detectSalonQuery(message)
    const isLugarQuery = detectLugarQuery(message)
    const isProviderQuery = detectProviderQuery(message)

    console.log('🔍 Query analysis:', {
      salon: isSalonQuery,
      lugar: isLugarQuery,
      provider: isProviderQuery
    })

    let finalReply: string
    let queryType: string

    if (isSalonQuery) {
      // Handle salon queries with database lookup
      console.log('🏢 Processing salon query...')
      queryType = 'salones'

      // Check if asking for specific capacity
      const capacityMatch = message.match(/(\d+)\s*(personas?|cupos?|asientos?)/i)
      if (capacityMatch) {
        const minCapacity = parseInt(capacityMatch[1])
        console.log(`🔍 Searching salons with capacity >= ${minCapacity}`)

        const salonesData = await searchSalonsByCapacity(minCapacity)
        if (salonesData && salonesData.length > 0) {
          finalReply = formatSalonResponse(salonesData, message)
        } else {
          finalReply = `❌ No encontré salones con capacidad para ${minCapacity} o más personas. ¿Te gustaría ver todos los salones disponibles?`
        }
      } else {
        // General salon query
        const salonesData = await getSalonInfo(message)
        if (salonesData && salonesData.length > 0) {
          finalReply = formatSalonResponse(salonesData, message)
          console.log('✅ Salon data found and formatted')
        } else {
          console.error('❌ No salon data available')
          finalReply = 'Lo siento, no pude acceder a la información de salones en este momento. Puede que no haya salones registrados o haya un problema de conexión. Por favor, intenta más tarde.'
        }
      }
    } else if (isLugarQuery) {
      // Handle lugar queries with database lookup
      console.log('🏛️ Processing lugares query...')
      queryType = 'lugares'

      // Check if asking for specific location
      const locationMatch = message.match(/en\s+([a-záéíóúñ\s]+)|de\s+([a-záéíóúñ\s]+)/i)
      if (locationMatch) {
        const location = (locationMatch[1] || locationMatch[2]).trim()
        console.log(`🔍 Searching lugares in location: ${location}`)

        const lugaresData = await searchLugaresByLocation(location)
        if (lugaresData && lugaresData.length > 0) {
          finalReply = formatLugarResponse(lugaresData, message)
        } else {
          finalReply = `❌ No encontré lugares en "${location}". ¿Te gustaría ver todos los lugares disponibles?`
        }
      } else {
        // General lugares query
        const lugaresData = await getLugarInfo(message)
        if (lugaresData && lugaresData.length > 0) {
          finalReply = formatLugarResponse(lugaresData, message)
          console.log('✅ Lugares data found and formatted')
        } else {
          console.error('❌ No lugares data available')
          finalReply = 'Lo siento, no pude acceder a la información de lugares en este momento. Puede que no haya lugares registrados o haya un problema de conexión. Por favor, intenta más tarde.'
        }
      }
    } else if (isProviderQuery) {
      // Handle providers queries with database lookup
      console.log('🛠️ Processing providers query...')
      queryType = 'providers'

      const providersData = await getProviderInfo()

      if (providersData && providersData.length > 0) {
        finalReply = formatProviderResponse(providersData)
        console.log('✅ Providers data found and formatted')
      } else {
        console.error('❌ No providers data available')
        finalReply = 'Lo siento, no pude acceder a la información de proveedores en este momento. Puede que no haya proveedores registrados o haya un problema de conexión. Por favor, intenta más tarde.'
      }
    } else {
      // Use FAQ search and OpenAI for other queries
      console.log('🤖 Processing general query with FAQ/OpenAI...')
      queryType = 'general'
      let faqResponse = null

      try {
        // Try to get embedding for FAQ search
        const embeddingResponse = await openai.embeddings.create({
          model: 'text-embedding-ada-002',
          input: message.trim(),
        })

        const embedding = embeddingResponse.data[0].embedding

        // Search FAQ
        const { data: faqData, error: faqError } = await supabase.rpc('match_faq', {
          query_embedding: embedding,
          similarity_threshold: 0.75,
          match_limit: 1,
        })

        if (!faqError && faqData && faqData.length > 0) {
          faqResponse = faqData[0].respuesta
          console.log('✅ FAQ response found')
        }
      } catch (embeddingError) {
        console.error('❌ FAQ search failed:', embeddingError)
      }

      if (faqResponse) {
        finalReply = faqResponse
      } else {
        // Fallback to OpenAI
        try {
          const completion = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
              {
                role: 'system',
                content: 'Eres un asistente de soporte que responde con información clara y concisa.',
              },
              {
                role: 'user',
                content: message,
              },
            ],
            max_tokens: 300,
          })

          finalReply = completion.choices[0].message?.content || 'Lo siento, no tengo una respuesta para eso.'
          console.log('✅ OpenAI response generated')
        } catch (openAiError) {
          console.error('❌ OpenAI API error:', openAiError)
          finalReply = 'Lo siento, ocurrió un error al procesar tu solicitud.'
        }
      }
    }

    console.log('💬 Final reply:', finalReply.substring(0, 100) + '...')
    console.log('=== ✅ CHATBOT API END ===')

    return NextResponse.json(
      { reply: finalReply, queryType },
      { status: 200 }
    )
  } catch (error) {
    console.error('💥 Unexpected error in chatbot handler:', error)
    return NextResponse.json(
      { reply: 'Ocurrió un error inesperado.' },
      { status: 500 }
    )
  }
}
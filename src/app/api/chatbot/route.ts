//src\app\api\chatbot\route.ts

import OpenAI from 'openai'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Environment variables validation
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const openaiApiKey = process.env.OPENAI_API_KEY

if (!supabaseUrl || !supabaseAnonKey || !openaiApiKey) {
  // Aquí puedes manejar la falta de variables según convenga (ej. lanzar error o detener)
}

const supabase = createClient(supabaseUrl!, supabaseAnonKey!)
const openai = new OpenAI({
  apiKey: openaiApiKey!,
})

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

function detectProviderQuery(message: string): boolean {
  const providerKeywords = [
    'proveedor', 'proveedores', 'supplier', 'categoría', 'categorias', 'rating',
    'ubicación', 'location', 'calificación', 'reputación', 'servicio',
    'contacto', 'empresa', 'compañía', 'negocio'
  ]
  const messageLower = message.toLowerCase()
  return providerKeywords.some(keyword => messageLower.includes(keyword))
}

function analyzeQuery(message: string) {
  const messageLower = message.toLowerCase()
  return {
    needsCapacity: messageLower.includes('capacidad') || messageLower.includes('personas') || messageLower.includes('cupo'),
    needsEquipment: messageLower.includes('equipamiento') || messageLower.includes('proyector') || messageLower.includes('audio'),
    needsSessions: messageLower.includes('sesiones') || messageLower.includes('horarios') || messageLower.includes('agenda'),
    needsContact: messageLower.includes('responsable') || messageLower.includes('encargado') || messageLower.includes('contacto'),
    needsAddress: messageLower.includes('direccion') || messageLower.includes('dirección') || messageLower.includes('donde'),
    needsLocation: messageLower.includes('ciudad') || messageLower.includes('municipio') || messageLower.includes('departamento'),
    needsDescription: messageLower.includes('descripcion') || messageLower.includes('descripción') || messageLower.includes('que es'),
    isGeneral: !messageLower.includes('capacidad') && !messageLower.includes('equipamiento') &&
               !messageLower.includes('sesiones') && !messageLower.includes('direccion') &&
               !messageLower.includes('ciudad') && !messageLower.includes('descripcion')
  }
}

async function getSalonInfo(query: string) {
  try {
    const { data: basicSalones, error: basicError } = await supabase
      .from('salones')
      .select('*')
      .limit(5)

    if (basicError) {
      return null
    }

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

    if (error) {
      return basicSalones
    }

    return salones
  } catch {
    return null
  }
}

async function getLugarInfo(query: string) {
  try {
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

    if (error) {
      return null
    }

    return lugares
  } catch {
    return null
  }
}

async function getProviderInfo() {
  try {
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

    if (error) {
      return null
    }

    return providers
  } catch {
    return null
  }
}

function formatSalonResponse(salones: any[], userQuery: string): string {
  if (!salones || salones.length === 0) {
    return 'Lo siento, no encontré información sobre salones en este momento.'
  }
  
  const queryAnalysis = analyzeQuery(userQuery)
  let response = '🏢 Información de Salones Disponibles:\n\n'

  salones.forEach((salon) => {
    response += `📍 ${salon.nombre}\n`
    
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
    
    if (salon.capacidad) {
      response += `👥 Capacidad: ${salon.capacidad} personas\n`
    }
    
    if (salon.equipamiento && salon.equipamiento.length > 0 && (queryAnalysis.needsEquipment || queryAnalysis.isGeneral)) {
      const equipamientoList = Array.isArray(salon.equipamiento) ? salon.equipamiento : [salon.equipamiento]
      response += `🔧 Equipamiento: ${equipamientoList.join(', ')}\n`
    }
    
    if (salon.responsable && queryAnalysis.needsContact) {
      response += `👤 Responsable: ${salon.responsable}\n`
    }
    
    if (salon.sesiones && queryAnalysis.needsSessions) {
      try {
        const sesionesArray = Array.isArray(salon.sesiones) ? salon.sesiones : JSON.parse(salon.sesiones)
        if (sesionesArray.length > 0) {
          response += `📅 Sesiones programadas:\n`
          sesionesArray.forEach((sesion: any) => {
            response += `   • ${sesion.hora || 'Hora no especificada'}: ${sesion.tema || 'Tema no especificado'}\n`
          })
        }
      } catch {}
    }
    
    if (salon.descripcion && queryAnalysis.isGeneral) {
      response += `📝 Descripción: ${salon.descripcion}\n`
    }
    
    response += '\n'
  })

  response += '💡 Tip: Puedes preguntarme específicamente sobre capacidad, equipamiento, ubicación, sesiones o responsables de los salones.'
  
  return response
}

function formatLugarResponse(lugares: any[], userQuery: string): string {
  if (!lugares || lugares.length === 0) {
    return 'Lo siento, no encontré información sobre lugares en este momento.'
  }

  const queryAnalysis = analyzeQuery(userQuery)
  let response = '🏛️ Información de Lugares Disponibles:\n\n'

  lugares.forEach((lugar) => {
    response += `📍 ${lugar.nombre}\n`
    
    if (lugar.direccion && (queryAnalysis.needsAddress || queryAnalysis.isGeneral)) {
      response += `🏠 Dirección: ${lugar.direccion}\n`
    }
    
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
    
    if (lugar.descripcion && (queryAnalysis.needsDescription || queryAnalysis.isGeneral)) {
      response += `📝 Descripción: ${lugar.descripcion}\n`
    }
    
    response += '\n'
  })

  response += '💡 Tip: Puedes preguntarme específicamente sobre direcciones, ciudades, descripción o ubicación de los lugares.'
  
  return response
}

function formatProviderResponse(providers: any[]): string {
  if (!providers || providers.length === 0) {
    return 'Lo siento, no encontré información sobre proveedores en este momento.'
  }

  let response = '🛠️ Información de Proveedores Disponibles:\n\n'

  providers.forEach((provider) => {
    response += `📍 ${provider.name}\n`
    if (provider.category) response += `📂 Categoría: ${provider.category}\n`
    if (provider.rating !== null && provider.rating !== undefined) response += `⭐ Calificación: ${provider.rating}\n`
    if (provider.location) response += `🏠 Ubicación: ${provider.location}\n`
    response += '\n'
  })

  response += '💡 Tip: Puedes preguntarme sobre proveedores por categoría, ubicación o calificación.'

  return response
}

async function searchSalonsByCapacity(minCapacity: number) {
  try {
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

    if (error) {
      return null
    }
    return data
  } catch {
    return null
  }
}

async function searchLugaresByLocation(location: string) {
  try {
    const { data, error } = await supabase
      .from('lugares')
      .select('*')
      .or(`ciudad.ilike.%${location}%,municipio.ilike.%${location}%,departamento.ilike.%${location}%`)
      .order('nombre')

    if (error) {
      return null
    }
    return data
  } catch {
    return null
  }
}

export async function POST(req: NextRequest) {
  try {
    let body
    try {
      body = await req.json()
    } catch {
      return NextResponse.json(
        { reply: 'Formato de solicitud inválido.' },
        { status: 400 }
      )
    }

    const { message } = body

    if (!message || typeof message !== 'string' || message.trim() === '') {
      return NextResponse.json(
        { reply: 'El mensaje es requerido.' },
        { status: 400 }
      )
    }

    const isSalonQuery = detectSalonQuery(message)
    const isLugarQuery = detectLugarQuery(message)
    const isProviderQuery = detectProviderQuery(message)

    let finalReply: string
    let queryType: string

    if (isSalonQuery) {
      queryType = 'salones'

      const capacityMatch = message.match(/(\d+)\s*(personas?|cupos?|asientos?)/i)
      if (capacityMatch) {
        const minCapacity = parseInt(capacityMatch[1])

        const salonesData = await searchSalonsByCapacity(minCapacity)
        if (salonesData && salonesData.length > 0) {
          finalReply = formatSalonResponse(salonesData, message)
        } else {
          finalReply = `❌ No encontré salones con capacidad para ${minCapacity} o más personas. ¿Te gustaría ver todos los salones disponibles?`
        }
      } else {
        const salonesData = await getSalonInfo(message)
        if (salonesData && salonesData.length > 0) {
          finalReply = formatSalonResponse(salonesData, message)
        } else {
          finalReply = 'Lo siento, no pude acceder a la información de salones en este momento. Puede que no haya salones registrados o haya un problema de conexión. Por favor, intenta más tarde.'
        }
      }
    } else if (isLugarQuery) {
      queryType = 'lugares'

      const locationMatch = message.match(/en\s+([a-záéíóúñ\s]+)|de\s+([a-záéíóúñ\s]+)/i)
      if (locationMatch) {
        const location = (locationMatch[1] || locationMatch[2]).trim()

        const lugaresData = await searchLugaresByLocation(location)
        if (lugaresData && lugaresData.length > 0) {
          finalReply = formatLugarResponse(lugaresData, message)
        } else {
          finalReply = `❌ No encontré lugares en "${location}". ¿Te gustaría ver todos los lugares disponibles?`
        }
      } else {
        const lugaresData = await getLugarInfo(message)
        if (lugaresData && lugaresData.length > 0) {
          finalReply = formatLugarResponse(lugaresData, message)
        } else {
          finalReply = 'Lo siento, no pude acceder a la información de lugares en este momento. Puede que no haya lugares registrados o haya un problema de conexión. Por favor, intenta más tarde.'
        }
      }
    } else if (isProviderQuery) {
      queryType = 'providers'

      const providersData = await getProviderInfo()

      if (providersData && providersData.length > 0) {
        finalReply = formatProviderResponse(providersData)
      } else {
        finalReply = 'Lo siento, no pude acceder a la información de proveedores en este momento. Puede que no haya proveedores registrados o haya un problema de conexión. Por favor, intenta más tarde.'
      }
    } else {
      queryType = 'general'
      let faqResponse = null

      try {
        const embeddingResponse = await openai.embeddings.create({
          model: 'text-embedding-ada-002',
          input: message.trim(),
        })

        const embedding = embeddingResponse.data[0].embedding

        const { data: faqData, error: faqError } = await supabase.rpc('match_faq', {
          query_embedding: embedding,
          similarity_threshold: 0.75,
          match_limit: 1,
        })

        if (!faqError && faqData && faqData.length > 0) {
          faqResponse = faqData[0].respuesta
        }
      } catch {}

      if (faqResponse) {
        finalReply = faqResponse
      } else {
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
        } catch {
          finalReply = 'Lo siento, ocurrió un error al procesar tu solicitud.'
        }
      }
    }

    return NextResponse.json(
      { reply: finalReply, queryType },
      { status: 200 }
    )
  } catch {
    return NextResponse.json(
      { reply: 'Ocurrió un error inesperado.' },
      { status: 500 }
    )
  }
}

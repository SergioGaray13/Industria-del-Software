import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/database'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Faltan las variables de entorno de Supabase')
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

export async function guardarMensajeDeSoporte(nombre: string, mensaje: string) {
  console.log('Guardando mensaje:', { nombre, mensaje })

  const { data, error } = await supabase
    .from('soporte')  // <--- nombre correcto de tu tabla
    .insert([{ nombre, mensaje }])

  if (error) {
    console.error('Error al guardar en supabase:', error)
    throw error
  }

  return data
}


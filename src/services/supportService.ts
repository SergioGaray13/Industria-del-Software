import { supabase } from '@/lib/supabase'

export async function guardarMensajeDeSoporte(mensaje: string) {
  const { data, error } = await supabase
    .from('soporte')
    .insert([{ mensaje }])

  if (error) throw error
  return data
}
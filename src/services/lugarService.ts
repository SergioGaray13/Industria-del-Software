import { supabase } from '@/lib/supabase'


export async function obtenerLugaresDisponibles() {
  const { data, error } = await supabase
    .from('lugares')
    .select('id, nombre')
    .order('nombre', { ascending: true })
  if (error) throw error
  return data
}

export async function obtenerSalonesPorLugar(lugarId: string) {
  const { data, error } = await supabase
    .from('salones')
    .select('id, nombre')
    .eq('lugar_id', lugarId)
    .order('nombre', { ascending: true })
  if (error) throw error
  return data
}

export async function obtenerLugaresConSalones() {
  const { data, error } = await supabase
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
      imagen,
      sitio_web,
      salones:salones (
        id,
        nombre,
        ubicacion,
        capacidad,
        descripcion,
        url_imagen,
        equipamiento
      )
    `) 
    .order('nombre', { ascending: true })

  if (error) throw error
  return data || []
}


export async function obtenerProveedores() {
  const { data, error } = await supabase
    .from('providers')
    .select('*')
    .order('name', { ascending: true })
  if (error) throw error
  return data
}

export async function obtenerProveedorPorId(id: string) {
  const { data, error } = await supabase
    .from('providers')
    .select('*')
    .eq('id', id)
    .single()
  if (error) throw error
  return data
}
export async function crearProveedor(proveedor: {
  name: string
  category?: string
  rating?: number
  location?: string
  website?: string
  user_id: string
}) {
  const { data, error } = await supabase
    .from('providers')
    .insert([proveedor])
    .select()
    .single()
  if (error) throw error
  return data
}

export async function actualizarProveedor(id: string, updates: Partial<{
  name: string
  category: string
  rating: number
  location: string
  website: string
}>) {
  const { data, error } = await supabase
    .from('providers')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function eliminarProveedor(id: string) {
  const { error } = await supabase
    .from('providers')
    .delete()
    .eq('id', id)
  if (error) throw error
}

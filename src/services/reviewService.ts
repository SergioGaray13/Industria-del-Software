import { supabase } from '@/lib/supabase'

export async function obtenerResenasPorLugar(lugarId: string) {
  const { data, error } = await supabase
    .from('reviews_lugares')
    .select(`
      id,
      user_id,
      comment,
      rating,
      created_at,
      users ( first_name, last_name )
    `)
    .eq('lugar_id', lugarId)

  if (error) throw error

  // Formateamos para mostrar el nombre del usuario
  return data.map((rev: any) => ({
    ...rev,
    user_name: rev.users ? `${rev.users.first_name} ${rev.users.last_name}` : rev.user_id
  }))
}

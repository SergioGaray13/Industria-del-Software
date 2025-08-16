//src\services\mapaService.ts
import { supabase } from '@/lib/supabase';
import { Lugar, Salon } from '@/types/mapa';

export const fetchLugares = async (): Promise<Lugar[]> => {
  const { data, error } = await supabase
    .from('lugares')
    .select('*')
    .order('nombre', { ascending: true });

  if (error) {
    console.error('Error fetching lugares:', error);
    return [];
  }

  return data as Lugar[];
};

export const fetchSalones = async (lugarId?: string): Promise<Salon[]> => {
  let query = supabase
    .from('salones')
    .select('*');

  if (lugarId) {
    query = query.eq('lugar_id', lugarId);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching salones:', error);
    return [];
  }

  const salones = data.map(salon => ({
    ...salon,
    sesiones: typeof salon.sesiones === 'string' ? JSON.parse(salon.sesiones) : salon.sesiones || null
  }));

  return salones as Salon[];
};

import { supabase } from '@/lib/supabase'
import { Event, EventWithDetails, EventCategory, EventAttendee } from '@/types/database'

export class EventService {
  // Obtener todos los eventos
  static async getAllEvents(): Promise<EventWithDetails[]> {
    const { data, error } = await supabase
      .from('events')
      .select(`
        *,
        category:event_categories(*),
        organizer:users(*),
        attendees:event_attendees(count)
      `)
      .eq('status', 'active')
      .order('start_date', { ascending: true })

    if (error) {
      throw new Error(`Error al obtener eventos: ${error.message}`)
    }

    return data?.map(event => ({
      ...event,
      attendees_count: event.attendees?.[0]?.count || 0
    })) || []
  }

  // Obtener evento por ID
  static async getEventById(id: string): Promise<EventWithDetails | null> {
    const { data, error } = await supabase
      .from('events')
      .select(`
        *,
        category:event_categories(*),
        organizer:users(*),
        agenda:event_agenda(*),
        attendees:event_attendees(count)
      `)
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') return null
      throw new Error(`Error al obtener evento: ${error.message}`)
    }

    return {
      ...data,
      attendees_count: data.attendees?.[0]?.count || 0
    }
  }

  // Crear evento
  static async createEvent(eventData: Omit<Event, 'id' | 'created_at' | 'updated_at' | 'current_attendees'>): Promise<Event> {
    const { data, error } = await supabase
      .from('events')
      .insert([eventData])
      .select()
      .single()

    if (error) {
      throw new Error(`Error al crear evento: ${error.message}`)
    }

    return data
  }

  // Registrar asistente
  static async registerAttendee(eventId: string, userId: string): Promise<EventAttendee> {
    const { data, error } = await supabase
      .from('event_attendees')
      .insert([{
        event_id: eventId,
        user_id: userId,
        status: 'registered',
        payment_status: 'pending'
      }])
      .select()
      .single()

    if (error) {
      throw new Error(`Error al registrar asistente: ${error.message}`)
    }

    return data
  }

  // Obtener categorías
  static async getCategories(): Promise<EventCategory[]> {
    const { data, error } = await supabase
      .from('event_categories')
      .select('*')
      .order('name')

    if (error) {
      throw new Error(`Error al obtener categorías: ${error.message}`)
    }

    return data || []
  }

  // Buscar eventos
  static async searchEvents(query: string, categoryId?: string): Promise<EventWithDetails[]> {
    let queryBuilder = supabase
      .from('events')
      .select(`
        *,
        category:event_categories(*),
        organizer:users(*),
        attendees:event_attendees(count)
      `)
      .eq('status', 'active')
      .or(`title.ilike.%${query}%,description.ilike.%${query}%`)

    if (categoryId) {
      queryBuilder = queryBuilder.eq('category_id', categoryId)
    }

    const { data, error } = await queryBuilder
      .order('start_date', { ascending: true })

    if (error) {
      throw new Error(`Error al buscar eventos: ${error.message}`)
    }

    return data?.map(event => ({
      ...event,
      attendees_count: event.attendees?.[0]?.count || 0
    })) || []
  }
}
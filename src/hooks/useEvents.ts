import { useState, useEffect } from 'react'
import { EventService } from '@/services/eventService'
import { EventWithDetails, EventCategory } from '@/types/database'

export const useEvents = () => {
  const [events, setEvents] = useState<EventWithDetails[]>([])
  const [categories, setCategories] = useState<EventCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchEvents = async () => {
    try {
      setLoading(true)
      setError(null)
      const [eventsData, categoriesData] = await Promise.all([
        EventService.getAllEvents(),
        EventService.getCategories()
      ])
      setEvents(eventsData)
      setCategories(categoriesData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }

  const searchEvents = async (query: string, categoryId?: string) => {
    try {
      setLoading(true)
      setError(null)
      const data = await EventService.searchEvents(query, categoryId)
      setEvents(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error en búsqueda')
    } finally {
      setLoading(false)
    }
  }

  const registerForEvent = async (eventId: string, userId: string) => {
    try {
      await EventService.registerAttendee(eventId, userId)
      // Actualizar el evento en la lista local
      setEvents(prev => prev.map(event => 
        event.id === eventId 
          ? { ...event, attendees_count: (event.attendees_count || 0) + 1 }
          : event
      ))
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Error al registrar')
    }
  }

  useEffect(() => {
    fetchEvents()
  }, [])

  return {
    events,
    categories,
    loading,
    error,
    fetchEvents,
    searchEvents,
    registerForEvent
  }
}
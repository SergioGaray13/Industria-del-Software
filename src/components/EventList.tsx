'use client'

import { EventWithDetails } from '@/types/database'
import EventCard from './EventCard'

interface EventListProps {
  events: EventWithDetails[]
  loading?: boolean
  onRegister?: (eventId: string) => void
  onViewDetails?: (eventId: string) => void
}

export default function EventList({ events, loading, onRegister, onViewDetails }: EventListProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="h-48 bg-gray-200 animate-pulse"></div>
            <div className="p-6 space-y-4">
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-6xl mb-4">📅</div>
        <h3 className="text-xl font-medium text-gray-600 mb-2">No hay eventos disponibles</h3>
        <p className="text-gray-500">Intenta ajustar tus filtros de búsqueda</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event) => (
        <EventCard
          key={event.id}
          event={event}
          onRegister={onRegister}
          onViewDetails={onViewDetails}
        />
      ))}
    </div>
  )
}
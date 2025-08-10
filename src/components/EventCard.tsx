'use client'

import { EventWithDetails } from '@/types/database'
import { Calendar, MapPin, Users, DollarSign } from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

interface EventCardProps {
  event: EventWithDetails
  onRegister?: (eventId: string) => void
  onViewDetails?: (eventId: string) => void
}

export default function EventCard({ event, onRegister, onViewDetails }: EventCardProps) {
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd MMM yyyy, HH:mm', { locale: es })
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {event.image_url && (
        <div className="h-48 bg-gray-200 overflow-hidden">
          <img
            src={event.image_url}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
            {event.category?.name || 'General'}
          </span>
          <span className={`text-xs px-2 py-1 rounded ${
            event.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
          }`}>
            {event.status}
          </span>
        </div>

        <h3 className="text-xl font-bold text-gray-800 mb-2">{event.title}</h3>
        
        <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-gray-600">
            <Calendar className="w-4 h-4 mr-2" />
            <span className="text-sm">{formatDate(event.start_date)}</span>
          </div>
          
          {event.location && (
            <div className="flex items-center text-gray-600">
              <MapPin className="w-4 h-4 mr-2" />
              <span className="text-sm">{event.location}</span>
            </div>
          )}
          
          <div className="flex items-center justify-between">
            <div className="flex items-center text-gray-600">
              <Users className="w-4 h-4 mr-2" />
              <span className="text-sm">
                {event.attendees_count || 0} asistentes
                {event.capacity && ` / ${event.capacity}`}
              </span>
            </div>
            
            <div className="flex items-center text-gray-600">
              <DollarSign className="w-4 h-4 mr-1" />
              <span className="text-sm font-semibold">
                {event.is_free ? 'Gratis' : `$${event.price}`}
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => onViewDetails?.(event.id)}
            className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors"
          >
            Ver detalles
          </button>
          
          <button
            onClick={() => onRegister?.(event.id)}
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Registrarse
          </button>
        </div>
      </div>
    </div>
  )
}
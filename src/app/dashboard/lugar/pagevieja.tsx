'use client'

import { useEffect, useState } from 'react'
import { obtenerLugaresConSalones } from '@/services/lugarService'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import ChatBot from '@/components/chatbot/ChatBot'

interface Salon {
  id: string
  nombre: string
  ubicacion: string
  capacidad: number
  descripcion?: string
  url_imagen?: string
  equipamiento?: string[]
}

interface Lugar {
  id: string
  nombre: string
  direccion?: string
  descripcion?: string
  ciudad?: string
  municipio?: string
  departamento?: string
  pais?: string
  sitio_web?: string
  imagen?: string
  salones: Salon[]
}

interface DisponibilidadFilters {
  fechaInicio: string
  fechaFin: string
  adultos: number
  ninos: number
  habitaciones: number
}

export default function LugarPage() {
  const [lugares, setLugares] = useState<Lugar[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showAvailability, setShowAvailability] = useState<{[key: string]: boolean}>({})
  const [filters, setFilters] = useState<DisponibilidadFilters>({
    fechaInicio: new Date().toISOString().split('T')[0],
    fechaFin: new Date(Date.now() + 86400000).toISOString().split('T')[0], // +1 día
    adultos: 2,
    ninos: 0,
    habitaciones: 1
  })
  const router = useRouter()

  useEffect(() => {
    const cargarLugares = async () => {
      try {
        const data = await obtenerLugaresConSalones()
        setLugares(data)
      } catch (error) {
        console.error('Error al cargar lugares:', error)
      } finally {
        setLoading(false)
      }
    }
    cargarLugares()
  }, [])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
    return `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}`
  }

  const toggleAvailability = (lugarId: string) => {
    setShowAvailability(prev => ({
      ...prev,
      [lugarId]: !prev[lugarId]
    }))
  }

  const handleFilterChange = (field: keyof DisponibilidadFilters, value: string | number) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
        <p className="text-orange-700 text-xl font-medium">Cargando lugares...</p>
      </div>
    )
  }

  // Filtrar lugares basado en la búsqueda
  const filteredLugares = lugares.filter((lugar) =>
    lugar.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lugar.descripcion?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lugar.ciudad?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lugar.salones.some(salon => 
      salon.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    )
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 to-orange-200 p-4">
      {/* Encabezado */}
      <div className="flex items-center mb-6">
        <button
          onClick={() => router.back()}
          className="mr-4 p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow"
        >
          <Image src="/back_arrow.webp" alt="Volver" width={24} height={24} className="w-6 h-6" />
        </button>
        <div className="text-2xl font-bold text-orange-600">Lugares y Salones</div>
      </div>

      {/* Barra de búsqueda */}
      <div className="mb-6">
        <div className="flex items-center bg-white rounded-full shadow px-4 py-2">
          <input
            type="text"
            placeholder="Buscar lugares o salones..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow outline-none text-sm text-orange-700"
          />
          <Image src="/buscar.png" alt="Buscar" width={20} height={20} />
        </div>
      </div>

      {/* Contenido principal */}
      <div className="space-y-8">
        {filteredLugares.length > 0 ? (
          filteredLugares.map((lugar) => (
            <div key={lugar.id} className="bg-white rounded-2xl shadow-lg p-6">
              {/* Información del lugar */}
              <div className="mb-6">
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Columna izquierda - Texto */}
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-orange-600 mb-3">{lugar.nombre}</h2>
                    
                    {/* Dirección y ubicación */}
                    {(lugar.direccion || lugar.ciudad) && (
                      <div className="flex items-center mb-2">
                        <div className="w-5 h-5 mr-2">
                          📍
                        </div>
                        <div className="text-sm text-gray-600">
                          {lugar.direccion && <span>{lugar.direccion}</span>}
                          {lugar.ciudad && (
                            <span className="ml-2">
                              {lugar.ciudad}
                              {lugar.municipio && lugar.municipio !== lugar.ciudad && `, ${lugar.municipio}`}
                              {lugar.departamento && `, ${lugar.departamento}`}
                              {lugar.pais && `, ${lugar.pais}`}
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Sitio web */}
                    {lugar.sitio_web && (
                      <div className="flex items-center mb-2">
                        <div className="w-5 h-5 mr-2">
                          🌐
                        </div>
                        <a 
                          href={lugar.sitio_web}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                        >
                          Visitar sitio web
                        </a>
                      </div>
                    )}

                    {/* Descripción del lugar */}
                    {lugar.descripcion && (
                      <p className="text-gray-700 bg-orange-50 p-4 rounded-lg border-l-4 border-orange-300 mt-4">
                        {lugar.descripcion}
                      </p>
                    )}

                    {/* Botón de Ver Disponibilidad */}
                    <div className="mt-4">
                      <button
                        onClick={() => toggleAvailability(lugar.id)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-md"
                      >
                        {showAvailability[lugar.id] ? 'Ocultar Disponibilidad' : 'Ver Disponibilidad'}
                      </button>
                    </div>
                  </div>

                  {/* Columna derecha - Imagen */}
                  {lugar.imagen && (
                    <div className="lg:w-80 flex-shrink-0">
                      <div className="overflow-hidden rounded-xl shadow-md">
                        <Image
                          src={lugar.imagen}
                          alt={lugar.nombre}
                          width={320}
                          height={240}
                          className="w-full h-60 object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Panel de Disponibilidad */}
              {showAvailability[lugar.id] && (
                <div className="mb-6 bg-gray-50 rounded-xl p-6 border-2 border-orange-200">
                  <h3 className="text-xl font-semibold text-orange-600 mb-4">Disponibilidad</h3>
                  <p className="text-sm text-gray-600 mb-4">Precios convertidos a HNL ℹ️</p>
                  
                  {/* Filtros de búsqueda */}
                  <div className="bg-white rounded-lg p-4 shadow-sm border border-orange-200">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Fechas */}
                      <div className="md:col-span-1">
                        <label className="block text-sm font-medium text-gray-700 mb-2">📅 Fechas</label>
                        <div className="flex items-center space-x-2 text-sm">
                          <input
                            type="date"
                            value={filters.fechaInicio}
                            onChange={(e) => handleFilterChange('fechaInicio', e.target.value)}
                            className="border border-gray-300 rounded px-2 py-1 text-xs"
                          />
                          <span>—</span>
                          <input
                            type="date"
                            value={filters.fechaFin}
                            onChange={(e) => handleFilterChange('fechaFin', e.target.value)}
                            className="border border-gray-300 rounded px-2 py-1 text-xs"
                          />
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {formatDate(filters.fechaInicio)} — {formatDate(filters.fechaFin)}
                        </div>
                      </div>

                      {/* Huéspedes */}
                      <div className="md:col-span-1">
                        <label className="block text-sm font-medium text-gray-700 mb-2">👥 Huéspedes</label>
                        <div className="flex items-center space-x-2">
                          <select
                            value={filters.adultos}
                            onChange={(e) => handleFilterChange('adultos', parseInt(e.target.value))}
                            className="border border-gray-300 rounded px-2 py-1 text-xs flex-1"
                          >
                            {[1,2,3,4,5,6,7,8].map(n => (
                              <option key={n} value={n}>{n} adultos</option>
                            ))}
                          </select>
                          <select
                            value={filters.ninos}
                            onChange={(e) => handleFilterChange('ninos', parseInt(e.target.value))}
                            className="border border-gray-300 rounded px-2 py-1 text-xs flex-1"
                          >
                            {[0,1,2,3,4].map(n => (
                              <option key={n} value={n}>{n} niños</option>
                            ))}
                          </select>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {filters.adultos} adultos • {filters.ninos} niños • {filters.habitaciones} habitación
                        </div>
                      </div>

                      {/* Botón de búsqueda */}
                      <div className="md:col-span-1 flex items-end">
                        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-medium transition-colors">
                          Cambiar búsqueda
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Filtros adicionales */}
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Filtrar por:</h4>
                    <div className="flex flex-wrap gap-2">
                      <label className="flex items-center space-x-2 text-sm">
                        <input type="checkbox" className="rounded" />
                        <span>Habitaciones</span>
                      </label>
                      <label className="flex items-center space-x-2 text-sm">
                        <input type="checkbox" className="rounded" />
                        <span>Suites</span>
                      </label>
                    </div>
                  </div>

                  {/* Resultados simulados */}
                  <div className="mt-6">
                    <div className="text-sm text-gray-600 mb-4">
                      Mostrando {lugar.salones.length} opciones disponibles para estas fechas
                    </div>
                  </div>
                </div>
              )}

              {/* Salones del lugar */}
              {lugar.salones.length > 0 ? (
                <div>
                  <h3 className="text-lg font-semibold text-orange-600 mb-4">
                    Salones disponibles ({lugar.salones.length})
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {lugar.salones.map((salon) => (
                      <div
                        key={salon.id}
                        className="bg-gradient-to-br from-orange-50 to-white border border-orange-200 rounded-xl p-4 hover:shadow-md transition-all duration-300 hover:scale-105"
                      >
                        {/* Imagen del salón */}
                        {salon.url_imagen && (
                          <div className="mb-3 overflow-hidden rounded-lg">
                            <Image
                              src={salon.url_imagen}
                              alt={salon.nombre}
                              width={300}
                              height={200}
                              className="w-full h-32 object-cover hover:scale-110 transition-transform duration-300"
                            />
                          </div>
                        )}

                        {/* Información del salón */}
                        <div>
                          <h4 className="font-semibold text-orange-700 mb-1 text-lg">
                            {salon.nombre}
                          </h4>
                          
                          <div className="text-sm text-gray-600 mb-2">
                            <div className="flex items-center mb-1">
                              <span className="mr-1">📍</span>
                              {salon.ubicacion}
                            </div>
                            <div className="flex items-center">
                              <span className="mr-1">👥</span>
                              Capacidad: {salon.capacidad} personas
                            </div>
                          </div>

                          {/* Descripción del salón */}
                          {salon.descripcion && (
                            <p className="text-sm text-gray-700 mb-2 bg-white p-2 rounded-md border">
                              {salon.descripcion}
                            </p>
                          )}

                          {/* Equipamiento */}
                          {salon.equipamiento && salon.equipamiento.length > 0 && (
                            <div className="text-xs">
                              <div className="flex items-center mb-1">
                                <span className="mr-1">🔧</span>
                                <span className="font-medium text-orange-600">Equipamiento:</span>
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {salon.equipamiento.map((equipo, index) => (
                                  <span
                                    key={index}
                                    className="bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-xs border"
                                  >
                                    {equipo}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Precio simulado si se muestra disponibilidad */}
                          {showAvailability[lugar.id] && (
                            <div className="mt-3 pt-3 border-t border-orange-200">
                              <div className="text-lg font-bold text-green-600">
                                L {(Math.random() * 2000 + 1000).toFixed(2)}
                              </div>
                              <div className="text-xs text-gray-500">por noche</div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-gray-400 text-4xl mb-2">🏢</div>
                  <p className="text-gray-500">No hay salones disponibles en este lugar</p>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="text-orange-300 text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-orange-600 mb-2">
              No se encontraron resultados
            </h3>
            <p className="text-gray-600">
              {searchTerm 
                ? `No hay lugares o salones que coincidan con "${searchTerm}"`
                : "No hay lugares disponibles en este momento"
              }
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="mt-4 bg-orange-500 text-white px-6 py-2 rounded-full hover:bg-orange-600 transition-colors"
              >
                Limpiar búsqueda
              </button>
            )}
          </div>
        )}
      </div>

      {/* ChatBot flotante */}
      <ChatBot />
    </div>
  )
}
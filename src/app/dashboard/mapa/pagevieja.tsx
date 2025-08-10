/*'use client';
import dynamic from 'next/dynamic';

const MapaInteractivo = dynamic(() => import('@/components/MapaInteractivo'), {
  ssr: false,
});

export default function MapaPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Mapa Interactivo</h1>
      <MapaInteractivo />
    </div>
  );
}
*/
'use client'
import React, { useState, useRef, useEffect } from 'react';
import { MapPin, Users, Calendar, Clock, Zap, Wifi, Car, Coffee, Utensils, Camera, Music, Mic, Building2, Phone, Globe, ExternalLink } from 'lucide-react';

// Tipos basados en tus tablas reales
interface Lugar {
  id: string;
  nombre: string;
  direccion: string;
  descripcion: string;
  ciudad: string;
  municipio: string;
  departamento: string;
  pais: string;
  imagen: string;
  sitio_web?: string;
}

interface Salon {
  id: string;
  nombre: string;
  ubicacion: string;
  capacidad: number;
  equipamiento: string[];
  responsable: string;
  descripcion: string;
  sesiones?: { hora: string; tema: string }[] | null;
  url_imagen: string;
  lugar_id?: string;
  // Campos adicionales para el mapa (se agregarían a la BD)
  coordenada_x?: number;
  coordenada_y?: number;
  ancho?: number;
  alto?: number;
  estado?: 'disponible' | 'ocupado' | 'reservado' | 'mantenimiento';
}

interface MapaPlanta {
  lugar: Lugar;
  salones: Salon[];
  dimensiones: { ancho: number; alto: number };
}

// Datos de ejemplo basados en tu estructura real
const lugaresReales: Lugar[] = [
  {
    id: "7ae7c7dd-7468-4c54-9ba9-ff75c96e43da",
    nombre: "Casa Bambú",
    direccion: "Aldea Cerro Grande, 3 km antes de Valle de Ángeles, desvío Tres Rosas",
    descripcion: "Alojamiento turístico rodeado de naturaleza",
    ciudad: "Valle de Ángeles",
    municipio: "Valle de Ángeles",
    departamento: "Francisco Morazán",
    pais: "Honduras",
    imagen: "https://txathccgfaqxmckugmsw.supabase.co/storage/v1/object/public/lugares//casabambu.webp",
    sitio_web: "https://casabambuhn.com/"
  },
  {
    id: "0e4cf04c-caac-40e0-bb1f-51e7f2783218",
    nombre: "John Sloan Academy",
    direccion: "El Jicarito",
    descripcion: "Lugar especializado en eventos sociales y corporativos de alto nivel",
    ciudad: "Jicarito",
    municipio: "El Paraíso",
    departamento: "El Paraíso",
    pais: "Honduras",
    imagen: "https://txathccgfaqxmckugmsw.supabase.co/storage/v1/object/public/lugares//JohnSloanAcademy.webp",
    sitio_web: "https://www.instagram.com/johnsloanacademy/"
  },
  {
    id: "f9c7caff-affc-4fe7-be4f-48f590b96621",
    nombre: "Hacienda El Trapiche",
    direccion: "Tegucigalpa",
    descripcion: "Centro de eventos en Tegucigalpa rodeado de naturaleza y tradición",
    ciudad: "Tegucigalpa",
    municipio: "Distrito Central",
    departamento: "Francisco Morazán",
    pais: "Honduras",
    imagen: "https://txathccgfaqxmckugmsw.supabase.co/storage/v1/object/public/lugares/haciendatrapiche.webp",
    sitio_web: "https://haciendaeltrapiche.com"
  }
];

const salonesReales: Salon[] = [
  {
    id: "8f817b1e-cf96-4822-9577-ff33a3af6f17",
    nombre: "Salón Azul",
    ubicacion: "Edificio B",
    capacidad: 50,
    equipamiento: ["Proyector", "Aire acondicionado"],
    responsable: "Carlos López",
    descripcion: "Ideal para talleres y conferencias pequeñas",
    sesiones: [{ hora: "10:00", tema: "Ciberseguridad" }],
    url_imagen: "https://txathccgfaqxmckugmsw.supabase.co/storage/v1/object/public/salones//salon-de-fiestas.webp",
    lugar_id: null,
    coordenada_x: 100,
    coordenada_y: 100,
    ancho: 180,
    alto: 120,
    estado: 'ocupado'
  },
  {
    id: "11685004-860b-473e-b31b-bbc11c367eee",
    nombre: "Zamorano",
    ubicacion: "Universidad Zamorano",
    capacidad: 500,
    equipamiento: ["Sillas", "Proyector", "Aire Acondicioando"],
    responsable: "Sergio Garay",
    descripcion: "Salon modernizado para eventos",
    sesiones: null,
    url_imagen: "https://txathccgfaqxmckugmsw.supabase.co/storage/v1/object/public/salones//zamorano.webp",
    lugar_id: null,
    coordenada_x: 350,
    coordenada_y: 80,
    ancho: 250,
    alto: 200,
    estado: 'disponible'
  },
  {
    id: "e84322c1-e987-4bec-aa93-c1ff59392c61",
    nombre: "Salons de eventos John Sloan Academy",
    ubicacion: "El Jicarito",
    capacidad: 100,
    equipamiento: ["Proyector de gran formato", "Sistema de sonido envolvente", "Micrófonos de solapa", "Streaming profesional", "Iluminación escénica"],
    responsable: "John Sloan Academy - Tel: 555-0321",
    descripcion: "Sala de banquetes en El Jicarito",
    sesiones: null,
    url_imagen: "https://txathccgfaqxmckugmsw.supabase.co/storage/v1/object/public/salones//JohnSloanAcademy.webp",
    lugar_id: "0e4cf04c-caac-40e0-bb1f-51e7f2783218",
    coordenada_x: 120,
    coordenada_y: 300,
    ancho: 200,
    alto: 150,
    estado: 'reservado'
  }
];

const MapaPisoEventos: React.FC = () => {
  const [lugarSeleccionado, setLugarSeleccionado] = useState<string | null>(null);
  const [salonSeleccionado, setSalonSeleccionado] = useState<Salon | null>(null);
  const [vistaActual, setVistaActual] = useState<'lugares' | 'planta'>('lugares');
  const [filtroEstado, setFiltroEstado] = useState<'todos' | 'disponible' | 'ocupado' | 'reservado'>('todos');
  const [escala, setEscala] = useState(1);
  const [mostrarLeyenda, setMostrarLeyenda] = useState(true);

  // Obtener lugar actual
  const lugarActual = lugarSeleccionado ? 
    lugaresReales.find(l => l.id === lugarSeleccionado) : null;

  // Obtener salones del lugar actual
  const salonesFiltrados = salonesReales.filter(salon => {
    if (lugarSeleccionado && salon.lugar_id !== lugarSeleccionado) return false;
    if (filtroEstado === 'todos') return true;
    return salon.estado === filtroEstado;
  });

  // Función para obtener color según estado del salón
  const obtenerColorSalon = (salon: Salon): string => {
    switch (salon.estado) {
      case 'disponible': return '#10b981'; // Verde
      case 'ocupado': return '#f59e0b'; // Amarillo
      case 'reservado': return '#8b5cf6'; // Púrpura
      case 'mantenimiento': return '#ef4444'; // Rojo
      default: return '#6b7280'; // Gris
    }
  };

  // Función para obtener ícono de equipamiento
  const obtenerIconoEquipamiento = (equipo: string): React.ReactNode => {
    const equipoLower = equipo.toLowerCase();
    if (equipoLower.includes('proyector')) return <Camera size={14} />;
    if (equipoLower.includes('sonido') || equipoLower.includes('micrófono')) return <Music size={14} />;
    if (equipoLower.includes('aire') || equipoLower.includes('clima')) return <Zap size={14} />;
    if (equipoLower.includes('wifi') || equipoLower.includes('internet')) return <Wifi size={14} />;
    if (equipoLower.includes('streaming')) return <Globe size={14} />;
    if (equipoLower.includes('iluminación')) return <Zap size={14} />;
    return <MapPin size={14} />;
  };

  // Estadísticas de salones
  const estadisticas = {
    total: salonesFiltrados.length,
    disponibles: salonesFiltrados.filter(s => s.estado === 'disponible').length,
    ocupados: salonesFiltrados.filter(s => s.estado === 'ocupado').length,
    reservados: salonesFiltrados.filter(s => s.estado === 'reservado').length,
    capacidadTotal: salonesFiltrados.reduce((sum, s) => sum + s.capacidad, 0)
  };

  // Controles de zoom
  const aumentarZoom = () => setEscala(prev => Math.min(prev * 1.2, 3));
  const reducirZoom = () => setEscala(prev => Math.max(prev / 1.2, 0.5));
  const resetearVista = () => setEscala(1);

  return (
    <div className="w-full h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm border-b p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-gray-800">
              {vistaActual === 'lugares' ? 'Centros de Eventos' : 
               lugarActual ? lugarActual.nombre : 'Mapa de Piso'}
            </h1>
            {vistaActual === 'planta' && lugarActual && (
              <button
                onClick={() => {
                  setVistaActual('lugares');
                  setLugarSeleccionado(null);
                  setSalonSeleccionado(null);
                }}
                className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 transition text-sm"
              >
                ← Volver a Lugares
              </button>
            )}
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => setMostrarLeyenda(!mostrarLeyenda)}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
              {mostrarLeyenda ? 'Ocultar' : 'Mostrar'} Panel
            </button>
          </div>
        </div>

        {/* Estadísticas (solo en vista de planta) */}
        {vistaActual === 'planta' && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
            <div className="text-center p-2 bg-gray-100 rounded">
              <div className="text-lg font-bold text-gray-700">{estadisticas.total}</div>
              <div className="text-sm text-gray-600">Total Salones</div>
            </div>
            <div className="text-center p-2 bg-green-100 rounded">
              <div className="text-lg font-bold text-green-700">{estadisticas.disponibles}</div>
              <div className="text-sm text-green-600">Disponibles</div>
            </div>
            <div className="text-center p-2 bg-yellow-100 rounded">
              <div className="text-lg font-bold text-yellow-700">{estadisticas.ocupados}</div>
              <div className="text-sm text-yellow-600">En Uso</div>
            </div>
            <div className="text-center p-2 bg-purple-100 rounded">
              <div className="text-lg font-bold text-purple-700">{estadisticas.reservados}</div>
              <div className="text-sm text-purple-600">Reservados</div>
            </div>
            <div className="text-center p-2 bg-blue-100 rounded">
              <div className="text-lg font-bold text-blue-700">{estadisticas.capacidadTotal}</div>
              <div className="text-sm text-blue-600">Capacidad Total</div>
            </div>
          </div>
        )}

        {/* Controles */}
        {vistaActual === 'planta' && (
          <div className="flex items-center gap-4">
            <div className="flex gap-2">
              <label className="text-sm text-gray-600">Filtrar:</label>
              <select
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value as any)}
                className="px-2 py-1 border rounded text-sm"
              >
                <option value="todos">Todos</option>
                <option value="disponible">Disponibles</option>
                <option value="ocupado">En Uso</option>
                <option value="reservado">Reservados</option>
              </select>
            </div>
            
            <div className="flex gap-2">
              <button onClick={reducirZoom} className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300">-</button>
              <span className="px-2 py-1 text-sm">{Math.round(escala * 100)}%</span>
              <button onClick={aumentarZoom} className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300">+</button>
              <button onClick={resetearVista} className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300">Reset</button>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Contenido principal */}
        <div className="flex-1 overflow-auto bg-gray-100">
          {vistaActual === 'lugares' ? (
            // Vista de lugares (lista de centros de eventos)
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {lugaresReales.map((lugar) => (
                  <div key={lugar.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition duration-300">
                    <img
                      src={lugar.imagen}
                      alt={lugar.nombre}
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDQwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMDAgNzVMMjI1IDEyNUgxNzVMMjAwIDc1WiIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4K';
                      }}
                    />
                    <div className="p-4">
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">{lugar.nombre}</h3>
                      <p className="text-sm text-gray-600 mb-2 flex items-center gap-1">
                        <MapPin size={14} />
                        {lugar.direccion}
                      </p>
                      <p className="text-sm text-gray-500 mb-3">{lugar.ciudad}, {lugar.departamento}</p>
                      <p className="text-sm text-gray-700 mb-4">{lugar.descripcion}</p>
                      
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setLugarSeleccionado(lugar.id);
                            setVistaActual('planta');
                          }}
                          className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition text-sm"
                        >
                          Ver Mapa
                        </button>
                        {lugar.sitio_web && (
                          <a
                            href={lugar.sitio_web}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition text-sm"
                          >
                            <ExternalLink size={16} />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            // Vista de planta (mapa de salones)
            <div className="min-w-max min-h-max p-4">
              <svg
                width={800 * escala}
                height={600 * escala}
                viewBox="0 0 800 600"
                className="border bg-white rounded-lg shadow-lg"
              >
                {/* Grid de fondo */}
                <defs>
                  <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#f3f4f6" strokeWidth="1"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />

                {/* Salones */}
                {salonesFiltrados.map((salon) => (
                  <g key={salon.id}>
                    <rect
                      x={salon.coordenada_x || 0}
                      y={salon.coordenada_y || 0}
                      width={salon.ancho || 150}
                      height={salon.alto || 100}
                      fill={obtenerColorSalon(salon)}
                      fillOpacity={0.8}
                      stroke={salonSeleccionado?.id === salon.id ? "#1f2937" : "#374151"}
                      strokeWidth={salonSeleccionado?.id === salon.id ? 3 : 1}
                      rx={6}
                      className="cursor-pointer transition-all duration-200 hover:fill-opacity-90"
                      onClick={() => setSalonSeleccionado(salon)}
                    />
                    
                    <text
                      x={(salon.coordenada_x || 0) + (salon.ancho || 150) / 2}
                      y={(salon.coordenada_y || 0) + (salon.alto || 100) / 2 - 10}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="fill-white text-sm font-semibold pointer-events-none"
                      style={{ fontSize: '14px' }}
                    >
                      {salon.nombre.length > 15 ? salon.nombre.substring(0, 15) + '...' : salon.nombre}
                    </text>
                    
                    <text
                      x={(salon.coordenada_x || 0) + (salon.ancho || 150) / 2}
                      y={(salon.coordenada_y || 0) + (salon.alto || 100) / 2 + 8}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="fill-white text-xs pointer-events-none"
                    >
                      Cap: {salon.capacidad}
                    </text>

                    {/* Indicador de estado */}
                    <circle
                      cx={(salon.coordenada_x || 0) + (salon.ancho || 150) - 15}
                      cy={(salon.coordenada_y || 0) + 15}
                      r={6}
                      fill={obtenerColorSalon(salon)}
                      stroke="white"
                      strokeWidth={2}
                    />
                  </g>
                ))}
              </svg>
            </div>
          )}
        </div>

        {/* Panel lateral */}
        {mostrarLeyenda && (
          <div className="w-80 bg-white border-l p-4 overflow-y-auto">
            {vistaActual === 'lugares' ? (
              // Panel para vista de lugares
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Centros de Eventos</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Selecciona un centro de eventos para ver su mapa de salones.
                </p>
                <div className="space-y-2">
                  {lugaresReales.map((lugar) => (
                    <div key={lugar.id} className="p-3 border rounded-lg hover:bg-gray-50">
                      <div className="font-medium text-gray-800">{lugar.nombre}</div>
                      <div className="text-sm text-gray-600">{lugar.ciudad}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {salonesReales.filter(s => s.lugar_id === lugar.id).length} salones
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              // Panel para vista de planta
              <div>
                {/* Información del lugar actual */}
                {lugarActual && (
                  <div className="mb-6 p-4 border rounded-lg bg-gray-50">
                    <h3 className="font-semibold text-gray-800 mb-2">{lugarActual.nombre}</h3>
                    <p className="text-sm text-gray-600 mb-2">{lugarActual.direccion}</p>
                    <p className="text-xs text-gray-500">{lugarActual.descripcion}</p>
                    {lugarActual.sitio_web && (
                      <a
                        href={lugarActual.sitio_web}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm mt-2"
                      >
                        <Globe size={14} />
                        Sitio web
                      </a>
                    )}
                  </div>
                )}

                {/* Leyenda */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Leyenda</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-green-500 rounded"></div>
                      <span className="text-sm text-gray-700">Disponible</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                      <span className="text-sm text-gray-700">En Uso</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-purple-500 rounded"></div>
                      <span className="text-sm text-gray-700">Reservado</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-red-500 rounded"></div>
                      <span className="text-sm text-gray-700">Mantenimiento</span>
                    </div>
                  </div>
                </div>

                {/* Información del salón seleccionado */}
                {salonSeleccionado && (
                  <div className="border rounded-lg p-4 bg-gray-50 mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">{salonSeleccionado.nombre}</h3>
                    
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Users size={16} />
                        <span>Capacidad: {salonSeleccionado.capacidad} personas</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <MapPin size={16} />
                        <span>{salonSeleccionado.ubicacion}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Phone size={16} />
                        <span>{salonSeleccionado.responsable}</span>
                      </div>

                      {salonSeleccionado.sesiones && salonSeleccionado.sesiones.length > 0 && (
                        <div>
                          <div className="font-medium mb-1">Sesiones programadas:</div>
                          {salonSeleccionado.sesiones.map((sesion, index) => (
                            <div key={index} className="text-xs bg-blue-100 p-2 rounded mb-1">
                              <div className="flex items-center gap-1">
                                <Clock size={12} />
                                {sesion.hora} - {sesion.tema}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {salonSeleccionado.equipamiento && salonSeleccionado.equipamiento.length > 0 && (
                        <div className="mt-3">
                          <div className="font-medium mb-2">Equipamiento:</div>
                          <div className="flex flex-wrap gap-1">
                            {salonSeleccionado.equipamiento.map((equipo, index) => (
                              <div key={index} className="flex items-center gap-1 bg-blue-100 px-2 py-1 rounded text-xs">
                                {obtenerIconoEquipamiento(equipo)}
                                <span>{equipo}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <p className="text-sm text-gray-700 italic mt-2">{salonSeleccionado.descripcion}</p>

                      {/* Botones de acción */}
                      <div className="flex gap-2 mt-4">
                        {salonSeleccionado.estado === 'disponible' && (
                          <button className="px-3 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600">
                            Reservar
                          </button>
                        )}
                        <button className="px-3 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600">
                          Ver Detalles
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Lista de salones */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    Salones {lugarActual ? `en ${lugarActual.nombre}` : ''}
                  </h3>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {salonesFiltrados.map((salon) => (
                      <div
                        key={salon.id}
                        className={`p-3 rounded cursor-pointer transition-colors ${
                          salonSeleccionado?.id === salon.id ? 'bg-blue-100' : 'hover:bg-gray-100'
                        }`}
                        onClick={() => setSalonSeleccionado(salon)}
                      >
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: obtenerColorSalon(salon) }}
                          ></div>
                          <span className="text-sm font-medium">{salon.nombre}</span>
                        </div>
                        <div className="text-xs text-gray-500 ml-5">
                          {salon.capacidad} personas • {salon.ubicacion}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MapaPisoEventos;
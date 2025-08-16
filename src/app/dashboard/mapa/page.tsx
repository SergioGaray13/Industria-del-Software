//src\app\dashboard\mapa\page.tsx
'use client';
import React, { useState, useEffect } from 'react';
import { MapPin, ExternalLink, Globe } from 'lucide-react';
import { Lugar, Salon, VistaActual, EstadoFiltro } from '@/types/mapa';
import { fetchLugares, fetchSalones } from '@/services/mapaService';
import { obtenerColorSalon, calcularEstadisticas } from '@/utils/mapa';
import { PlaceCard } from '@/components/mapa/PlaceCard';
import { SalonCard } from '@/components/mapa/SalonCard';
import { LegendPanel } from '@/components/mapa/LegendPanel';
import { SalonDetails } from '@/components/mapa/SalonDetails';
import { Controls } from '@/components/mapa/Controls';
import { StatsPanel } from '@/components/mapa/StatsPanel';



export const EventMap: React.FC = () => {
  const [lugares, setLugares] = useState<Lugar[]>([]);
  const [salones, setSalones] = useState<Salon[]>([]);
  const [lugarSeleccionado, setLugarSeleccionado] = useState<string | null>(null);
  const [salonSeleccionado, setSalonSeleccionado] = useState<Salon | null>(null);
  const [vistaActual, setVistaActual] = useState<VistaActual>('lugares');
  const [filtroEstado, setFiltroEstado] = useState<EstadoFiltro>('todos');
  const [escala, setEscala] = useState(1);
  const [mostrarLeyenda, setMostrarLeyenda] = useState(true);
  const [loading, setLoading] = useState(true);

  // Cargar lugares al montar el componente
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const lugaresData = await fetchLugares();
      setLugares(lugaresData);
      setLoading(false);
    };

    loadData();
  }, []);

  // Cargar salones cuando se selecciona un lugar
  useEffect(() => {
    if (lugarSeleccionado) {
      const loadSalones = async () => {
        setLoading(true);
        const salonesData = await fetchSalones(lugarSeleccionado);
        setSalones(salonesData);
        setLoading(false);
      };

      loadSalones();
    } else {
      // Cargar todos los salones si no hay lugar seleccionado
      const loadAllSalones = async () => {
        setLoading(true);
        const salonesData = await fetchSalones();
        setSalones(salonesData);
        setLoading(false);
      };

      loadAllSalones();
    }
  }, [lugarSeleccionado]);

  const lugarActual = lugarSeleccionado ? 
    lugares.find(l => l.id === lugarSeleccionado) : null;

  const salonesFiltrados = salones.filter(salon => {
    if (lugarSeleccionado && salon.lugar_id !== lugarSeleccionado) return false;
    if (filtroEstado === 'todos') return true;
    return salon.estado === filtroEstado;
  });

  const estadisticas = calcularEstadisticas(salonesFiltrados);

  const aumentarZoom = () => setEscala(prev => Math.min(prev * 1.2, 3));
  const reducirZoom = () => setEscala(prev => Math.max(prev / 1.2, 0.5));
  const resetearVista = () => setEscala(1);

  if (loading && vistaActual === 'lugares') {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando centros de eventos...</p>
        </div>
      </div>
    );
  }

  if (loading && vistaActual === 'planta') {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando mapa de salones...</p>
        </div>
      </div>
    );
  }

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
          <StatsPanel 
            total={estadisticas.total}
            disponibles={estadisticas.disponibles}
            ocupados={estadisticas.ocupados}
            reservados={estadisticas.reservados}
            capacidadTotal={estadisticas.capacidadTotal}
          />
        )}

        {/* Controles */}
        {vistaActual === 'planta' && (
          <Controls 
            escala={escala}
            filtroEstado={filtroEstado}
            onZoomIn={aumentarZoom}
            onZoomOut={reducirZoom}
            onReset={resetearVista}
            onFilterChange={setFiltroEstado}
          />
        )}
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Contenido principal */}
        <div className="flex-1 overflow-auto bg-gray-100">
          {vistaActual === 'lugares' ? (
            // Vista de lugares (lista de centros de eventos)
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {lugares.map((lugar) => (
                  <PlaceCard 
                    key={lugar.id}
                    lugar={lugar}
                    onSelect={(id) => {
                      setLugarSeleccionado(id);
                      setVistaActual('planta');
                    }}
                  />
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
                  {lugares.map((lugar) => (
                    <div key={lugar.id} className="p-3 border rounded-lg hover:bg-gray-50">
                      <div className="font-medium text-gray-800">{lugar.nombre}</div>
                      <div className="text-sm text-gray-600">{lugar.ciudad}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {salones.filter(s => s.lugar_id === lugar.id).length} salones
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

                <LegendPanel />

                {/* Información del salón seleccionado */}
                {salonSeleccionado && (
                  <SalonDetails salon={salonSeleccionado} />
                )}

                {/* Lista de salones */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    Salones {lugarActual ? `en ${lugarActual.nombre}` : ''}
                  </h3>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {salonesFiltrados.map((salon) => (
                      <SalonCard
                        key={salon.id}
                        salon={salon}
                        isSelected={salonSeleccionado?.id === salon.id}
                        onClick={() => setSalonSeleccionado(salon)}
                      />
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

export default EventMap;
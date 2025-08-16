import { Salon } from '@/types/mapa';
import { Users, MapPin, Phone, Clock, Globe } from 'lucide-react';
import { obtenerIconoEquipamiento } from '@/utils/mapa';

interface SalonDetailsProps {
  salon: Salon;
}

export const SalonDetails: React.FC<SalonDetailsProps> = ({ salon }) => {
  return (
    <div className="border rounded-lg p-4 bg-gray-50 mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">{salon.nombre}</h3>
      
      <div className="space-y-2 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <Users size={16} />
          <span>Capacidad: {salon.capacidad} personas</span>
        </div>
        
        <div className="flex items-center gap-2">
          <MapPin size={16} />
          <span>{salon.ubicacion}</span>
        </div>

        <div className="flex items-center gap-2">
          <Phone size={16} />
          <span>{salon.responsable}</span>
        </div>

        {salon.sesiones && salon.sesiones.length > 0 && (
          <div>
            <div className="font-medium mb-1">Sesiones programadas:</div>
            {salon.sesiones.map((sesion, index) => (
              <div key={index} className="text-xs bg-blue-100 p-2 rounded mb-1">
                <div className="flex items-center gap-1">
                  <Clock size={12} />
                  {sesion.hora} - {sesion.tema}
                </div>
              </div>
            ))}
          </div>
        )}

        {salon.equipamiento && salon.equipamiento.length > 0 && (
          <div className="mt-3">
            <div className="font-medium mb-2">Equipamiento:</div>
            <div className="flex flex-wrap gap-1">
              {salon.equipamiento.map((equipo, index) => (
                <div key={index} className="flex items-center gap-1 bg-blue-100 px-2 py-1 rounded text-xs">
                  {obtenerIconoEquipamiento(equipo)}
                  <span>{equipo}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <p className="text-sm text-gray-700 italic mt-2">{salon.descripcion}</p>

        <div className="flex gap-2 mt-4">
          {salon.estado === 'disponible' && (
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
  );
};
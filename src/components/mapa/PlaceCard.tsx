import { Lugar } from '@/types/mapa';
import { MapPin, ExternalLink } from 'lucide-react';

interface PlaceCardProps {
  lugar: Lugar;
  onSelect: (id: string) => void;
}

export const PlaceCard: React.FC<PlaceCardProps> = ({ lugar, onSelect }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition duration-300">
      <img
        src={lugar.imagen}
        alt={lugar.nombre}
        className="w-full h-48 object-cover"
        onError={(e) => {
          e.currentTarget.src = 'data:image/svg+xml;base64,...';
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
            onClick={() => onSelect(lugar.id)}
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
  );
};
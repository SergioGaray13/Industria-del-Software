import { Salon } from '@/types/mapa';
import { Users, MapPin, Phone } from 'lucide-react';
import { obtenerColorSalon } from '@/utils/mapa';

interface SalonCardProps {
  salon: Salon;
  isSelected: boolean;
  onClick: () => void;
}

export const SalonCard: React.FC<SalonCardProps> = ({ salon, isSelected, onClick }) => {
  return (
    <div
      className={`p-3 rounded cursor-pointer transition-colors ${
        isSelected ? 'bg-blue-100' : 'hover:bg-gray-100'
      }`}
      onClick={onClick}
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
  );
};
// src/components/salones/SalonCard.tsx
import React from 'react';
import { Salon } from '@/types/salon';

interface SalonCardProps {
  salon: Salon;
  userRole: string | null; // <-- agregada prop para el rol
  onReservar: (salon: Salon) => void;
  onEditar: (salon: Salon) => void;
  onEliminar: (salonId: string) => void;
}

export const SalonCard: React.FC<SalonCardProps> = ({
  salon,
  userRole,
  onReservar,
  onEditar,
  onEliminar,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition duration-300">
      {salon.url_imagen && (
        <img
          src={salon.url_imagen}
          alt={`Imagen de ${salon.nombre}`}
          className="w-full h-48 object-cover rounded mb-4"
        />
      )}

      <h2 className="text-xl font-semibold text-orange-700 mb-2">{salon.nombre}</h2>
      <p className="text-sm text-gray-600 mb-1">📍 {salon.ubicacion}</p>
      <p className="text-sm text-gray-600 mb-1">👥 Capacidad: {salon.capacidad}</p>
      <p className="text-sm text-gray-600 mb-1">
        🎛️ Equipamiento: {salon.equipamiento?.join(', ')}
      </p>
      <p className="text-sm text-gray-600 mb-1">👤 Responsable: {salon.responsable}</p>
      <p className="text-sm text-gray-600 italic mb-2">📝 {salon.descripcion}</p>
      
      <div className="mb-2">
        <p className="text-sm font-medium text-orange-500">📅 Próximas sesiones:</p>
        <ul className="text-sm text-gray-700 list-disc list-inside">
          {salon.sesiones?.map((s, i) => (
            <li key={i}>
              {s.hora} - {s.tema}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex gap-2 mt-4">
        <button
          onClick={() => onReservar(salon)}
          className="flex-1 bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition"
        >
          Reservar
        </button>

        {/* Solo admin ve estos botones */}
        {userRole === 'admin' && (
          <>
            <button
              onClick={() => onEditar(salon)}
              className="flex-1 bg-yellow-400 py-2 rounded-lg hover:bg-yellow-500 transition"
            >
              Editar
            </button>
            <button
              onClick={() => onEliminar(salon.id)}
              className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition"
            >
              Eliminar
            </button>
          </>
        )}
      </div>
    </div>
  );
};

// src\components\salones\ModalReservarSalon.tsx
import React from 'react';
import { Salon } from '@/types/salon';

interface ModalReservaProps {
  salon: Salon | null;
  fecha: string;
  hora: string;
  mensaje: string;
  onFechaChange: (fecha: string) => void;
  onHoraChange: (hora: string) => void;
  onConfirmar: () => void;
  onCerrar: () => void;
}

export const ModalReserva: React.FC<ModalReservaProps> = ({
  salon,
  fecha,
  hora,
  mensaje,
  onFechaChange,
  onHoraChange,
  onConfirmar,
  onCerrar,
}) => {
  if (!salon) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg animate-fade-in">
        <h2 className="text-xl font-bold text-orange-600 mb-4">
          Reservar {salon.nombre}
        </h2>
        
        <label className="block mb-2 text-sm text-gray-700">Fecha:</label>
        <input
          type="date"
          value={fecha}
          onChange={(e) => onFechaChange(e.target.value)}
          className="w-full border border-orange-300 rounded px-3 py-2 mb-4"
        />
        
        <label className="block mb-2 text-sm text-gray-700">Hora:</label>
        <input
          type="time"
          value={hora}
          onChange={(e) => onHoraChange(e.target.value)}
          className="w-full border border-orange-300 rounded px-3 py-2 mb-4"
        />
        
        {mensaje && <p className="text-sm text-center mb-2">{mensaje}</p>}
        
        <div className="flex justify-between">
          <button
            onClick={onCerrar}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirmar}
            className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition"
          >
            Confirmar reserva
          </button>
        </div>
      </div>
    </div>
  );
};
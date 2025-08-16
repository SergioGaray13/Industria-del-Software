// src\components\salones\ModalEliminarSalon.tsx
import React from 'react';

interface ModalEliminarProps {
  isOpen: boolean;
  loading: boolean;
  mensaje: string;
  onConfirmar: () => void;
  onCerrar: () => void;
}

export const ModalEliminar: React.FC<ModalEliminarProps> = ({
  isOpen,
  loading,
  mensaje,
  onConfirmar,
  onCerrar,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-lg animate-fade-in">
        <h2 className="text-xl font-bold mb-4 text-red-600">Eliminar salón</h2>
        
        {mensaje && (
          <p
            className={`mb-4 text-center ${
              mensaje.startsWith('✅') ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {mensaje}
          </p>
        )}
        
        <p className="mb-6 text-center">
          ¿Está seguro que desea eliminar este salón? Esta acción no se puede deshacer.
        </p>
        
        <div className="flex justify-between">
          <button
            onClick={onCerrar}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            onClick={onConfirmar}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
            disabled={loading}
          >
            {loading ? 'Eliminando...' : 'Eliminar'}
          </button>
        </div>
      </div>
    </div>
  );
};
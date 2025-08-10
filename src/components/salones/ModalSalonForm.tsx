// components/ModalSalonForm.tsx
import React from 'react';
import { FormSalon } from '@/types/salon';

interface ModalSalonFormProps {
  titulo: string;
  form: FormSalon;
  loading: boolean;
  mensaje: string;
  onFormChange: (field: keyof FormSalon, value: any) => void;
  onSubmit: () => void;
  onClose: () => void;
}

export const ModalSalonForm: React.FC<ModalSalonFormProps> = ({
  titulo,
  form,
  loading,
  mensaje,
  onFormChange,
  onSubmit,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg animate-fade-in overflow-auto max-h-[90vh]">
        <h2 className="text-xl font-bold mb-4">{titulo}</h2>

        <label className="block mb-2 text-sm text-gray-700">Nombre*:</label>
        <input
          type="text"
          value={form.nombre}
          onChange={(e) => onFormChange('nombre', e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 mb-3"
          required
          placeholder="Ejemplo: Salón Diamante"
          disabled={loading}
        />

        <label className="block mb-2 text-sm text-gray-700">Ubicación:</label>
        <input
          type="text"
          value={form.ubicacion}
          onChange={(e) => onFormChange('ubicacion', e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 mb-3"
          placeholder="Ejemplo: Av. Principal #123, Tegucigalpa"
          disabled={loading}
        />

        <label className="block mb-2 text-sm text-gray-700">Capacidad:</label>
        <input
          type="number"
          value={form.capacidad}
          onChange={(e) =>
            onFormChange('capacidad', e.target.value === '' ? '' : Number(e.target.value))
          }
          className="w-full border border-gray-300 rounded px-3 py-2 mb-3"
          placeholder="Ejemplo: 150"
          min={0}
          disabled={loading}
        />

        <label className="block mb-2 text-sm text-gray-700">
          Equipamiento (separado por comas):
        </label>
        <input
          type="text"
          value={form.equipamiento}
          onChange={(e) => onFormChange('equipamiento', e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 mb-3"
          placeholder="Ejemplo: sonido, iluminación, aire acondicionado"
          disabled={loading}
        />

        <label className="block mb-2 text-sm text-gray-700">Responsable:</label>
        <input
          type="text"
          value={form.responsable}
          onChange={(e) => onFormChange('responsable', e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 mb-3"
          placeholder="Ejemplo: Juan Pérez"
          disabled={loading}
        />

        <label className="block mb-2 text-sm text-gray-700">Descripción:</label>
        <textarea
          value={form.descripcion}
          onChange={(e) => onFormChange('descripcion', e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
          rows={4}
          placeholder="Ejemplo: Salón amplio con vista panorámica y terraza."
          disabled={loading}
        />

        <label className="block mb-2 text-sm text-gray-700">
          {form.id ? 'Cambiar imagen:' : 'Imagen:'}
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => onFormChange('imagen', e.target.files?.[0] || null)}
          className="w-full mb-4"
          disabled={loading}
        />

        {mensaje && <p className="text-sm text-center mb-2">{mensaje}</p>}

        <div className="flex justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            onClick={onSubmit}
            className={`px-4 py-2 rounded text-white transition ${
              form.id ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-green-600 hover:bg-green-700'
            }`}
            disabled={loading}
          >
            {loading ? 'Guardando...' : form.id ? 'Guardar Cambios' : 'Agregar Salón'}
          </button>
        </div>
      </div>
    </div>
  );
};
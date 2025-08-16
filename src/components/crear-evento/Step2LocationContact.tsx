// src/components/crear-evento/Step2LocationContact.tsx
import InputField from './InputField';
import { FormState } from '@/hooks/useCrearEventoForm';
import { useEffect } from 'react';

interface Place {
  id: string;
  nombre: string;
  direccion: string;
}

interface Location {
  id: string;
  nombre: string;
}

interface Step2Props {
  formState: FormState;
  errors: Record<string, string>;
  updateFormField: (field: keyof FormState, value: any) => void;
  places: Place[];
  locations: Location[];
}

export default function Step2LocationContact({
  formState,
  errors,
  updateFormField,
  places,
  locations,
}: Step2Props) {
  // Función para calcular la diferencia en horas
  const calculateHours = (start: string, end: string): number => {
    if (!start || !end) return 0;

    const startTime = new Date(`2000-01-01T${start}`);
    const endTime = new Date(`2000-01-01T${end}`);
    
    // Si la hora final es menor que la inicial, asumimos que es al día siguiente
    if (endTime < startTime) {
      endTime.setDate(endTime.getDate() + 1);
    }

    const diffMs = endTime.getTime() - startTime.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);
    
    // Redondear a 2 decimales
    return Math.round(diffHours * 100) / 100;
  };

  // Efecto para calcular horas cuando cambian los tiempos
  useEffect(() => {
    if (formState.startTime && formState.endTime) {
      const hoursReserved = calculateHours(formState.startTime, formState.endTime);
      updateFormField('hours_reserved', hoursReserved);
    }
  }, [formState.startTime, formState.endTime, updateFormField]);

  return (
    <div className="space-y-4">
      <InputField label="Lugar" error={errors.placeId} required>
        <select
          value={formState.placeId}
          onChange={(e) => updateFormField('placeId', e.target.value)}
          className="w-full p-3 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
        >
          <option value="">Selecciona un lugar</option>
          {places.map((place) => (
            <option key={place.id} value={place.id}>
              {place.nombre} - {place.direccion}
            </option>
          ))}
        </select>
      </InputField>

      <InputField label="Dirección">
        <input
          type="text"
          value={formState.location}
          readOnly
          className="w-full p-3 border text-black border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
          placeholder="Dirección del lugar seleccionada"
        />
      </InputField>

      <InputField label="Salón">
        <select
          value={formState.locationId}
          onChange={(e) => updateFormField('locationId', e.target.value)}
          disabled={!formState.placeId}
          className="w-full p-3 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-100 transition-all"
        >
          <option value="">Selecciona un salón</option>
          {locations.map((loc) => (
            <option key={loc.id} value={loc.id}>
              {loc.nombre}
            </option>
          ))}
        </select>
      </InputField>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField label="Hora de Inicio">
          <input
            type="time"
            value={formState.startTime}
            onChange={(e) => {
              updateFormField('startTime', e.target.value);
            }}
            className="w-full p-3 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
          />
        </InputField>

        <InputField label="Hora de Fin" error={errors.endTime}>
          <input
            type="time"
            value={formState.endTime}
            onChange={(e) => {
              updateFormField('endTime', e.target.value);
            }}
            className="w-full p-3 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
          />
        </InputField>
      </div>

      {/* Mostrar horas reservadas calculadas */}
      {formState.hours_reserved > 0 && (
        <div className="p-3 bg-blue-50 rounded-lg">
          <p className="text-blue-700 font-medium">
            Horas reservadas: <span className="font-bold">{formState.hours_reserved}</span> horas
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField label="Teléfono de Contacto" error={errors.contactPhone} required>
          <input
            type="tel"
            value={formState.contactPhone}
            onChange={(e) => updateFormField('contactPhone', e.target.value)}
            className="w-full p-3 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
            placeholder="0000-0000"
          />
        </InputField>

        <InputField label="Correo Electrónico" error={errors.contactEmail} required>
          <input
            type="email"
            value={formState.contactEmail}
            onChange={(e) => updateFormField('contactEmail', e.target.value)}
            className="w-full p-3 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
            placeholder="ejemplo@correo.com"
          />
        </InputField>
      </div>
    </div>
  );
}
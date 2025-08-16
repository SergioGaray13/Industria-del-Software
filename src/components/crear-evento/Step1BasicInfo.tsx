// src/components/crear-evento/Step1BasicInfo.tsx
import InputField from './InputField';
import { FormState } from '@/hooks/useCrearEventoForm';

interface Category {
  id: string;
  name: string;
}

interface Provider {
  id: string;
  name: string;
  category: string;
}

interface Step1Props {
  formState: FormState;
  errors: Record<string, string>;
  updateFormField: (field: keyof FormState, value: any) => void;
  categories: Category[];
  providers: Provider[];
}

export default function Step1BasicInfo({
  formState,
  errors,
  updateFormField,
  categories,
  providers,
}: Step1Props) {
  const handleDateChange = (field: 'start_date' | 'end_date', value: string) => {
    // Actualizar el campo modificado
    updateFormField(field, value);

    // Si cambiamos la fecha de inicio, actualizamos date_reserved
    if (field === 'start_date') {
      updateFormField('date_reserved', value);
    }

    // Si cambiamos la fecha final sin tener fecha de inicio,
    // establecemos ambas fechas iguales
    if (field === 'end_date' && !formState.start_date) {
      updateFormField('start_date', value);
      updateFormField('date_reserved', value);
    }
  };

  return (
    <div className="space-y-4">
      <InputField label="Título" error={errors.title} required>
        <input
          type="text"
          value={formState.title}
          onChange={(e) => updateFormField('title', e.target.value)}
          className="w-full p-3 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
          placeholder="Nombre del evento"
        />
      </InputField>

      <InputField label="Descripción">
        <textarea
          value={formState.description}
          onChange={(e) => updateFormField('description', e.target.value)}
          rows={3}
          className="w-full p-3 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all resize-none"
          placeholder="Descripción detallada del evento"
        />
      </InputField>

      <InputField label="Fecha de Inicio" error={errors.start_date} required>
        <input
          type="date"
          value={formState.start_date}
          onChange={(e) => handleDateChange('start_date', e.target.value)}
          className="w-full p-3 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
          min={new Date().toISOString().split('T')[0]}
        />
      </InputField>

      <InputField label="Fecha de Finalización" error={errors.end_date} required>
        <input
          type="date"
          value={formState.end_date}
          onChange={(e) => handleDateChange('end_date', e.target.value)}
          className="w-full p-3 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
          min={formState.start_date || new Date().toISOString().split('T')[0]}
        />
      </InputField>

      {/* Campo oculto para asegurar que date_reserved se incluya en el formulario */}
      <input
        type="hidden"
        name="date_reserved"
        value={formState.date_reserved}
      />

      <InputField label="Categoría" error={errors.categoryId} required>
        <select
          value={formState.categoryId}
          onChange={(e) => updateFormField('categoryId', e.target.value)}
          className="w-full p-3 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
        >
          <option value="">Selecciona una categoría</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </InputField>

      <InputField label="Proveedor" error={errors.providerId} required>
        <select
          value={formState.providerId}
          onChange={(e) => updateFormField('providerId', e.target.value)}
          className="w-full p-3 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
        >
          <option value="">Selecciona un proveedor</option>
          {providers.map((prov) => (
            <option key={prov.id} value={prov.id}>
              {prov.name} ({prov.category})
            </option>
          ))}
        </select>
      </InputField>
    </div>
  );
}
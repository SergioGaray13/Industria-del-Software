import InputField from './InputField';
import { FormState } from '@/hooks/useCrearEventoForm';
interface Catering {
  id: string;
  name: string;
}

interface Menu {
  id: string;
  name: string;
  price?: number;
}

interface ServiceMode {
  id: string;
  name: string;
}

interface Step3Props {
  formState: any;
  updateFormField: (field: keyof FormState, value: any) => void;
  //updateFormField: (field: string, value: any) => void;
  catering: Catering[];
  filteredMenus: Menu[];
  serviceModes: ServiceMode[];
}

export default function Step3AdditionalDetails({
  formState,
  updateFormField,
  catering,
  filteredMenus,
  serviceModes,
}: Step3Props) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Detalles Adicionales</h2>

      <InputField label="Equipo Audiovisual Requerido">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="audiovisual"
            checked={formState.audiovisual}
            onChange={(e) => updateFormField('audiovisual', e.target.checked)}
            className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded mr-2"
          />
          <label htmlFor="audiovisual" className="text-sm text-gray-700">
            Requiere equipo audiovisual (proyector, sonido, micrófonos, etc.)
          </label>
        </div>
      </InputField>

      <InputField label="Número de Invitados">
        <input
          type="number"
          value={formState.attendeesEstimated}
          onChange={(e) => updateFormField('attendeesEstimated', e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
          placeholder="Estimado de personas"
          min="1"
        />
      </InputField>

      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
          <svg
            className="w-5 h-5 mr-2 text-orange-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
            />
          </svg>
          Información de Catering
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <InputField label="Tipo de Catering">
            <select
              value={formState.cateringId}
              onChange={(e) => {
                updateFormField('cateringId', e.target.value);
                updateFormField('menuId', '');
              }}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
            >
              <option value="">Selecciona un tipo de catering</option>
              {catering.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </InputField>

          <InputField label="Escoge el Menú">
            <select
              value={formState.menuId}
              onChange={(e) => updateFormField('menuId', e.target.value)}
              disabled={!formState.cateringId}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-100 transition-all"
            >
              <option value="">Selecciona un menú</option>
              {filteredMenus.map((menu) => (
                <option key={menu.id} value={menu.id}>
                  {menu.name} {menu.price && `- $${menu.price}`}
                </option>
              ))}
            </select>
          </InputField>
        </div>

        <InputField label="Modalidad de Servicio">
          <select
            value={formState.serviceMode}
            onChange={(e) => updateFormField('serviceMode', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
          >
            <option value="">Selecciona modalidad</option>
            {serviceModes.map((mode) => (
              <option key={mode.id} value={mode.id}>
                {mode.name}
              </option>
            ))}
          </select>
        </InputField>

        <InputField label="¿Incluye Personal de Servicio?">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="includesServiceStaff"
              checked={formState.includesServiceStaff}
              onChange={(e) => updateFormField('includesServiceStaff', e.target.checked)}
              className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded mr-2"
            />
            <label htmlFor="includesServiceStaff" className="text-sm text-gray-700">
              El servicio incluye personal (meseros, bartenders, etc.)
            </label>
          </div>
        </InputField>

        <InputField label="Notas sobre Catering">
          <textarea
            value={formState.cateringNotes}
            onChange={(e) => updateFormField('cateringNotes', e.target.value)}
            rows={2}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all resize-none"
            placeholder="Restricciones alimentarias, preferencias especiales..."
          />
        </InputField>
      </div>

      <InputField label="Notas Generales del Evento">
        <textarea
          value={formState.notes}
          onChange={(e) => updateFormField('notes', e.target.value)}
          rows={3}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all resize-none"
          placeholder="Cualquier información adicional importante sobre el evento..."
        />
      </InputField>
    </div>
  );
}

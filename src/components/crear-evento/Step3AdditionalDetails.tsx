import InputField from './InputField';
import { FormState } from '@/hooks/useCrearEventoForm';
import { useEffect, useState } from 'react';

interface Catering {
  id: string;
  name: string;
}

interface Menu {
  id: string;
  name: string;
  price: number;
  catering_id: string;
}

interface ServiceMode {
  id: string;
  name: string;
  additional_cost?: number;
}

interface Salon {
  id: string;
  nombre: string;
  precio_por_hora: number;
}

interface Step3Props {
  formState: FormState;
  updateFormField: (field: keyof FormState, value: any) => void;
  catering: Catering[];
  filteredMenus: Menu[];
  serviceModes: ServiceMode[];
  //selectedSalon: Salon | null;
}

export default function Step3AdditionalDetails({
  formState,
  updateFormField,
  catering,
  filteredMenus,
  serviceModes,
  //selectedSalon,
}: Step3Props) {
  const [estimatedCost, setEstimatedCost] = useState<{
    salonCost: number;
    cateringCost: number;
    serviceStaffCost: number;
    audiovisualCost: number;
    serviceModeCost: number;
    subtotal: number;
    tax: number;
    total: number;
  }>({
    salonCost: 0,
    cateringCost: 0,
    serviceStaffCost: 0,
    audiovisualCost: 0,
    serviceModeCost: 0,
    subtotal: 0,
    tax: 0,
    total: 0,
  });

  // Calcular el costo estimado cuando cambian los inputs relevantes
  useEffect(() => {
    calculateEstimatedCost();
  }, [
    formState.hours_reserved,
    formState.attendeesEstimated,
    formState.menuId,
    formState.includesServiceStaff,
    formState.audiovisual,
    formState.serviceMode,
   //selectedSalon,
    filteredMenus
  ]);

  const calculateEstimatedCost = () => {
    // 1. Costo fijo del salón (250 * horas reservadas)
    const salonCost = 250 * (formState.hours_reserved || 0);

    // 2. Costo del catering (precio del menú * número de invitados)
    const selectedMenu = filteredMenus.find(menu => menu.id === formState.menuId);
    const cateringCost = selectedMenu?.price && formState.attendeesEstimated ?
      selectedMenu.price * parseInt(formState.attendeesEstimated) : 0;

    // 3. Costo adicional por personal de servicio (500 si está marcado)
    const serviceStaffCost = formState.includesServiceStaff ? 500 : 0;

    // 4. Costo adicional por equipo audiovisual (300 si está marcado)
    const audiovisualCost = formState.audiovisual ? 300 : 0;

    // 5. Costo por modalidad de servicio
    const selectedServiceMode = serviceModes.find(mode => mode.id === formState.serviceMode);
    const serviceModeCost = selectedServiceMode?.additional_cost || 0;

    // 6. Subtotal (suma de todos los costos)
    const subtotal = salonCost + cateringCost + serviceStaffCost + audiovisualCost + serviceModeCost;

    // 7. Impuestos (10% del subtotal)
    const tax = subtotal * 0.1;

    // 8. Total (subtotal + impuestos)
    const total = subtotal + tax;

    setEstimatedCost({
      salonCost,
      cateringCost,
      serviceStaffCost,
      audiovisualCost,
      serviceModeCost,
      subtotal,
      tax,
      total,
    });

    // Precio calculado fijo (250 * horas reservadas)
    updateFormField('calculated_price', salonCost);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Detalles Adicionales</h2>

      {/* Resto del formulario... */}
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
            Requiere equipo audiovisual (proyector, sonido, micrófonos, etc.) + ${300}
          </label>
        </div>
      </InputField>

      <InputField label="Número de Invitados">
        <input
          type="number"
          value={formState.attendeesEstimated}
          onChange={(e) => updateFormField('attendeesEstimated', e.target.value)}
          className="w-full text-black p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
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
              className="w-full p-3 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
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
              className="w-full p-3 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-100 transition-all"
            >
              <option value="">Selecciona un menú</option>
              {filteredMenus.map((menu) => (
                <option key={menu.id} value={menu.id}>
                  {menu.name} - ${menu.price.toFixed(2)}
                </option>
              ))}
            </select>
          </InputField>
        </div>

        <InputField label="Modalidad de Servicio">
          <select
            value={formState.serviceMode}
            onChange={(e) => updateFormField('serviceMode', e.target.value)}
            className="w-full p-3 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
          >
            <option value="">Selecciona modalidad</option>
            {serviceModes.map((mode) => (
              <option key={mode.id} value={mode.id}>
                {mode.name} {mode.additional_cost ? `(+$${mode.additional_cost})` : ''}
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
              El servicio incluye personal (meseros, bartenders, etc.) + ${500}
            </label>
          </div>
        </InputField>

        <InputField label="Notas sobre Catering">
          <textarea
            value={formState.cateringNotes}
            onChange={(e) => updateFormField('cateringNotes', e.target.value)}
            rows={2}
            className="w-full p-3 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all resize-none"
            placeholder="Restricciones alimentarias, preferencias especiales..."
          />
        </InputField>
      </div>

      <InputField label="Notas Generales del Evento">
        <textarea
          value={formState.notes}
          onChange={(e) => updateFormField('notes', e.target.value)}
          rows={3}
          className="w-full p-3 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all resize-none"
          placeholder="Cualquier información adicional importante sobre el evento..."
        />
      </InputField>
       {/* Resumen de Costos */}
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h3 className="text-lg font-medium text-orange-800 mb-3">Resumen de Costos Estimados</h3>
        
        <div className="space-y-2">
          {/* Detalle del costo del salón */}
          <div className="flex justify-between">
            <span className="text-gray-700">
              Alquiler de salón: 
              <br />
              <span className="text-sm text-gray-500">
                {formState.hours_reserved || 0} horas × $250.00
              </span>
            </span>
            <span className="font-medium text-black">${estimatedCost.salonCost.toFixed(2)}</span>
          </div>
          
          {/* Detalle del catering */}
          {estimatedCost.cateringCost > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-700">
                Catering:
                <br />
                <span className="text-sm text-gray-500 ">
                  {formState.attendeesEstimated || 0} personas × ${filteredMenus.find(m => m.id === formState.menuId)?.price.toFixed(2) || '0.00'}
                </span>
              </span>
              <span className="font-medium ">${estimatedCost.cateringCost.toFixed(2)}</span>
            </div>
          )}
          
          {/* Costos adicionales */}
          {estimatedCost.serviceStaffCost > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-700">Personal de servicio:</span>
              <span className="font-medium text-black">${estimatedCost.serviceStaffCost.toFixed(2)}</span>
            </div>
          )}
          
          {estimatedCost.audiovisualCost > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-700">Equipo audiovisual:</span>
              <span className="font-medium text-black">${estimatedCost.audiovisualCost.toFixed(2)}</span>
            </div>
          )}

          {estimatedCost.serviceModeCost > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-700">Modalidad de servicio:</span>
              <span className="font-medium text-black">${estimatedCost.serviceModeCost.toFixed(2)}</span>
            </div>
          )}
          
          {/* Subtotal */}
          <div className="border-t pt-2 mt-2 flex justify-between">
            <span className="text-gray-700 font-medium">Subtotal:</span>
            <span className="font-medium text-black">${estimatedCost.subtotal.toFixed(2)}</span>
          </div>
          
          {/* Impuestos */}
          <div className="flex justify-between">
            <span className="text-gray-700">Impuestos y cargos (10%):</span>
            <span className="font-medium text-black">${estimatedCost.tax.toFixed(2)}</span>
          </div>
          
          {/* Total */}
          <div className="border-t pt-2 mt-2 flex justify-between text-lg">
            <span className="text-blue-800 font-bold">Total estimado:</span>
            <span className="text-blue-800 font-bold">${estimatedCost.total.toFixed(2)}</span>
          </div>
        </div>
        
        <p className="text-xs text-gray-500 mt-3">
          * Este es un precio estimado. El precio final deberá ser confirmado por el proveedor.
        </p>
      </div>
    </div>
      
    
  );
}
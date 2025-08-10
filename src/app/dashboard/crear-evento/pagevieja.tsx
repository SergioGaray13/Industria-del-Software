//src\app\dashboard\crear-evento\page.tsx
'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

// Interfaces consolidadas
interface BaseEntity {
  id: string;
  name: string;
}

interface Category extends BaseEntity {}

interface Place {
  id: string;
  nombre: string;
  direccion: string;
}

interface Location {
  id: string;
  nombre: string;
}

interface Catering extends BaseEntity {
  description?: string;
}

interface CateringMenu {
  id: string;
  name: string;
  description?: string;
  price?: number;
  catering_id: string;
}

interface ServiceMode extends BaseEntity {
  description?: string;
}

interface Provider extends BaseEntity {
  category: string;
}

// Formulario state management
interface FormState {
  // Información básica
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  categoryId: string;

  // Ubicación y tiempo
  location: string;
  placeId: string;
  locationId: string;
  startTime: string;
  endTime: string;

  // Contacto
  contactPhone: string;
  contactEmail: string;

  // Detalles adicionales
  audiovisual: boolean;
  attendeesEstimated: string;
  notes: string;

  // Catering
  cateringId: string;
  menuId: string;
  menuDescription: string;

  // Proveedor (selección)
  providerId: string;

  serviceMode: string;
  includesServiceStaff: boolean;
  cateringNotes: string;
}

const initialFormState: FormState = {
  title: '',
  description: '',
  start_date: '',
  end_date: '',
  categoryId: '',
  location: '',
  placeId: '',
  locationId: '',
  startTime: '',
  endTime: '',
  contactPhone: '',
  contactEmail: '',
  audiovisual: false,
  attendeesEstimated: '',
  notes: '',
  cateringId: '',
  menuId: '',
  menuDescription: '',
  providerId: '',
  serviceMode: '',
  includesServiceStaff: false,
  cateringNotes: '',
};

// Custom hooks para lógica reutilizable
const useFormPersistence = (key: string, formData: any) => {
  useEffect(() => {
    const hasData = Object.values(formData).some(value =>
      typeof value === 'boolean' ? false : value
    );

    if (hasData) {
      localStorage.setItem(key, JSON.stringify(formData));
    }
  }, [key, formData]);

  const clearPersistedData = useCallback(() => {
    localStorage.removeItem(key);
  }, [key]);

  return { clearPersistedData };
};

const useSupabaseData = () => {
  const [data, setData] = useState({
    categories: [] as Category[],
    places: [] as Place[],
    catering: [] as Catering[],
    cateringMenus: [] as CateringMenu[],
    serviceModes: [] as ServiceMode[],
    locations: [] as Location[],
    providers: [] as Provider[],
  });

  const [loading, setLoading] = useState(true);

  const fetchAllData = useCallback(async () => {
    try {
      const [
        categoriesRes,
        placesRes,
        cateringRes,
        cateringMenusRes,
        serviceModesRes,
        providersRes,
      ] = await Promise.all([
        supabase.from('categories').select('id, name'),
        supabase.from('lugares').select('id, nombre, direccion'),
        supabase.from('catering').select('id, name, description'),
        supabase.from('catering_menus').select('id, name, description, price, catering_id'),
        supabase.from('service_modes').select('id, name, description'),
        supabase.from('providers').select('id, name, category'),
      ]);

      setData({
        categories: categoriesRes.data || [],
        places: placesRes.data || [],
        catering: cateringRes.data || [],
        cateringMenus: cateringMenusRes.data || [],
        serviceModes: serviceModesRes.data || [],
        locations: [],
        providers: providersRes.data || [],
      });
    } catch (error) {
      console.error('Error cargando datos:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchLocationsByPlace = useCallback(async (placeId: string) => {
    if (!placeId) {
      setData(prev => ({ ...prev, locations: [] }));
      return;
    }

    try {
      const { data: locations } = await supabase
        .from('salones')
        .select('id, nombre')
        .eq('lugar_id', placeId);

      setData(prev => ({ ...prev, locations: locations || [] }));
    } catch (error) {
      console.error('Error cargando ubicaciones:', error);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  return { ...data, loading, fetchLocationsByPlace };
};

// Componentes optimizados
interface InputFieldProps {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}

const InputField = ({ label, error, required = false, children }: InputFieldProps) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {children}
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);

const StepIndicator = ({ currentStep }: { currentStep: number }) => (
  <div className="flex items-center justify-center mb-8">
    {[1, 2, 3].map((step) => (
      <div key={step} className="flex items-center">
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors
            ${step <= currentStep
              ? 'bg-orange-500 text-white shadow-lg'
              : 'bg-gray-200 text-gray-500'
            }`}
        >
          {step}
        </div>
        {step < 3 && (
          <div
            className={`w-16 h-1 mx-2 transition-colors
              ${step < currentStep ? 'bg-orange-500' : 'bg-gray-200'}
            `}
          />
        )}
      </div>
    ))}
  </div>
);

const LoadingSpinner = () => (
  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
);

export default function CrearEventoPage() {
  const router = useRouter();

  // Estados principales
  const [formState, setFormState] = useState<FormState>(initialFormState);
  const [userId, setUserId] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showSuccess, setShowSuccess] = useState(false);

  // Custom hooks
  const supabaseData = useSupabaseData();
  const { clearPersistedData } = useFormPersistence('crear_evento_form', {
    ...formState,
    currentStep
  });

  // Memoized values
  const filteredMenus = useMemo(() =>
    supabaseData.cateringMenus.filter(menu => menu.catering_id === formState.cateringId),
    [supabaseData.cateringMenus, formState.cateringId]
  );

  const selectedPlace = useMemo(() =>
    supabaseData.places.find(place => place.id === formState.placeId),
    [supabaseData.places, formState.placeId]
  );

  // Funciones optimizadas
  const updateFormField = useCallback(<K extends keyof FormState>(
    field: K,
    value: FormState[K]
  ) => {
    setFormState(prev => ({ ...prev, [field]: value }));
  }, []);

  const resetForm = useCallback(() => {
    if (confirm('¿Estás seguro de que quieres limpiar todo el formulario?')) {
      setFormState(initialFormState);
      setCurrentStep(1);
      setErrors({});
      clearPersistedData();
    }
  }, [clearPersistedData]);

  // Validaciones mejoradas
  const validateStep = useCallback((step: number): boolean => {
    const newErrors: Record<string, string> = {};

    const validators = {
      1: () => {
        if (!formState.title.trim()) newErrors.title = 'El título es obligatorio';
        if (!formState.start_date) newErrors.date = 'La fecha de inicio es obligatoria';
        if (!formState.end_date) newErrors.date = 'La fecha de finalización es obligatoria';
        if (!formState.categoryId) newErrors.categoryId = 'Selecciona una categoría';

        if (formState.start_date) {
          const selectedDate = new Date(formState.start_date);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          if (selectedDate < today) {
            newErrors.date = 'La fecha debe ser futura';
          }
        }

        if (!formState.providerId) newErrors.providerId = 'Debes seleccionar un proveedor';
      },
      2: () => {
        if (!formState.placeId) newErrors.placeId = 'Selecciona un lugar';

        if (!formState.contactPhone.trim()) {
          newErrors.contactPhone = 'El teléfono es obligatorio';
        } else if (!/^[0-9\s()+-]{7,}$/.test(formState.contactPhone)) {
          newErrors.contactPhone = 'Formato de teléfono inválido';
        }

        if (!formState.contactEmail.trim()) {
          newErrors.contactEmail = 'El correo es obligatorio';
        } else if (!/\S+@\S+\.\S+/.test(formState.contactEmail)) {
          newErrors.contactEmail = 'Formato de correo inválido';
        }

        if (formState.startTime && formState.endTime && formState.startTime >= formState.endTime) {
          newErrors.endTime = 'La hora de fin debe ser posterior a la de inicio';
        }
      },
      3: () => {
        // Validaciones opcionales para el paso 3 si es necesario
      }
    };

    validators[step as keyof typeof validators]?.();
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formState]);

  // Efectos optimizados
  useEffect(() => {
    const initializeUser = async () => {
      try {
        const { data: userData } = await supabase.auth.getUser();
        const user = userData?.user;

        if (user) {
          setUserId(user.id);
          if (user.email && !formState.contactEmail) {
            updateFormField('contactEmail', user.email);
          }
        }
      } catch (error) {
        console.error('Error cargando información del usuario:', error);
      }
    };

    // Recuperar datos persistidos
    const savedFormData = localStorage.getItem('crear_evento_form');
    if (savedFormData) {
      try {
        const formData = JSON.parse(savedFormData);
        setFormState(formData);
        setCurrentStep(formData.currentStep || 1);
      } catch (error) {
        console.error('Error recuperando datos del formulario:', error);
      }
    }

    initializeUser();
  }, []);

  // Efecto para cargar ubicaciones cuando cambia el lugar
  useEffect(() => {
    supabaseData.fetchLocationsByPlace(formState.placeId);
    if (formState.placeId) {
      updateFormField('locationId', '');
    }
  }, [formState.placeId, supabaseData.fetchLocationsByPlace, updateFormField]);

  // Efecto para actualizar la ubicación cuando cambia el lugar
  useEffect(() => {
    if (selectedPlace?.direccion) {
      updateFormField('location', selectedPlace.direccion);
    }
  }, [selectedPlace, updateFormField]);

  // Navegación entre pasos
  const nextStep = useCallback(() => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 3));
    }
  }, [currentStep, validateStep]);

  const prevStep = useCallback(() => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  }, []);

  console.log("Datos enviados al evento:", {
    title: formState.title.trim(),
    description: formState.description.trim(),
    start_date: formState.start_date,
    end_date: formState.end_date,
    location: formState.location.trim(),
    user_id: userId,
    contact_phone: formState.contactPhone.trim(),
    contact_email: formState.contactEmail.trim(),
    category_id: formState.categoryId || null,
    audiovisual: formState.audiovisual,
    attendees_estimated: formState.attendeesEstimated ? Number(formState.attendeesEstimated) : null,
    notes: formState.notes.trim(),
    location_id: formState.placeId || null,
    start_time: formState.startTime,
    end_time: formState.endTime,
    provider_id: formState.providerId || null,
  });
  
  // Envío del formulario
  const handleSubmit = useCallback(async () => {
    if (!userId) {
      alert('Debes iniciar sesión');
      return;
    }

    if (!validateStep(1) || !validateStep(2)) {
      setCurrentStep(1);
      return;
    }

    setIsLoading(true);

    try {
      // Crear evento principal
      const { data: eventData, error: eventError } = await supabase
        .from('events')
        .insert([{
          title: formState.title.trim(),
          description: formState.description.trim(),
          start_date: formState.start_date,
          end_date: formState.end_date,
          location: formState.location.trim(),
          user_id: userId,
          contact_phone: formState.contactPhone.trim(),
          contact_email: formState.contactEmail.trim(),
          category_id: formState.categoryId || null,
          audiovisual: formState.audiovisual,
          attendees_estimated: formState.attendeesEstimated ? Number(formState.attendeesEstimated) : null,
          notes: formState.notes.trim(),
          location_id: formState.placeId || null,
          start_time: formState.startTime,
          end_time: formState.endTime,
          provider_id: formState.providerId, // Aquí se pasa el proveedor seleccionado
        }])
        .select()
        .single();

      if (eventError) throw eventError;

      // Crear información de catering si existe
      if (formState.cateringId || formState.menuDescription) {
        const { error: cateringError } = await supabase
          .from('eventos_catering')
          .insert([{
            evento_id: eventData.id,
            catering_id: formState.cateringId || null,
            menu_description: formState.menuDescription.trim() || null,
            number_of_guests: formState.attendeesEstimated ? Number(formState.attendeesEstimated) : null,
            service_mode: formState.serviceMode.trim() || null,
            includes_service_staff: formState.includesServiceStaff,
            notes: formState.cateringNotes.trim() || null,
          }]);

        if (cateringError) {
          console.error('Error creando información de catering:', cateringError);
        }
      }

      clearPersistedData();
      setShowSuccess(true);

      setTimeout(() => {
        router.push('/dashboard/eventos');
      }, 2000);

    } catch (error) {
      console.error('Error creando evento:', error);
      alert('Error al crear el evento. Por favor intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  }, [formState, userId, validateStep, clearPersistedData, router]);

  // Actualizar menú al cambiar catering
  useEffect(() => {
    if (formState.cateringId) {
      updateFormField('menuId', '');
      updateFormField('menuDescription', '');
    }
  }, [formState.cateringId, updateFormField]);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Crear Evento</h1>

      <StepIndicator currentStep={currentStep} />

      {showSuccess && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6" role="alert">
          <strong className="font-bold">¡Éxito!</strong> El evento ha sido creado correctamente.
        </div>
      )}

      {/* Paso 1: Información básica */}
      {currentStep === 1 && (
        <div className="space-y-4">
          <InputField label="Título" error={errors.title} required>
            <input
              type="text"
              value={formState.title}
              onChange={(e) => updateFormField('title', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
              placeholder="Nombre del evento"
            />
          </InputField>

          <InputField label="Descripción">
            <textarea
              value={formState.description}
              onChange={(e) => updateFormField('description', e.target.value)}
              rows={3}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all resize-none"
              placeholder="Descripción detallada del evento"
            />
          </InputField>

          <InputField label="Fecha de Inicio" error={errors.date} required>
            <input
              type="date"
              value={formState.start_date}
              onChange={(e) => updateFormField('start_date', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
              min={new Date().toISOString().split('T')[0]}
            />
          </InputField>

          <InputField label="Fecha de Finalización" error={errors.date} required>
            <input
              type="date"
              value={formState.end_date}
              onChange={(e) => updateFormField('end_date', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
              min={new Date().toISOString().split('T')[0]}
            />
          </InputField>

          <InputField label="Categoría" error={errors.categoryId} required>
            <select
              value={formState.categoryId}
              onChange={(e) => updateFormField('categoryId', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
            >
              <option value="">Selecciona una categoría</option>
              {supabaseData.categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </InputField>

          <InputField label="Proveedor" error={errors.providerId} required>
            <select
              value={formState.providerId}
              onChange={(e) => updateFormField('providerId', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
            >
              <option value="">Selecciona un proveedor</option>
              {supabaseData.providers.map((prov) => (
                <option key={prov.id} value={prov.id}>
                  {prov.name} ({prov.category})
                </option>
              ))}
            </select>
          </InputField>
        </div>
      )}

      {/* Paso 2: Ubicación, contacto y horarios */}
      {currentStep === 2 && (
        <div className="space-y-4">
          <InputField label="Lugar" error={errors.placeId} required>
            <select
              value={formState.placeId}
              onChange={(e) => updateFormField('placeId', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
            >
              <option value="">Selecciona un lugar</option>
              {supabaseData.places.map((place) => (
                <option key={place.id} value={place.id}>
                  {place.nombre} - {place.direccion}
                </option>
              ))}
            </select>
          </InputField>

          <InputField label="Dirección" >
            <input
              type="text"
              value={formState.location}
              readOnly
              className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
              placeholder="Dirección del lugar seleccionada"
            />
          </InputField>

          <InputField label="Salón">
                  <select
                    value={formState.locationId}
                    onChange={(e) => updateFormField('locationId', e.target.value)}
                    disabled={!formState.placeId}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-100 transition-all"
                  >
                    <option value="">Selecciona un salón</option>
                    {supabaseData.locations.map((loc) => (
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
                onChange={(e) => updateFormField('startTime', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
              />
            </InputField>

            <InputField label="Hora de Fin" error={errors.endTime}>
              <input
                type="time"
                value={formState.endTime}
                onChange={(e) => updateFormField('endTime', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
              />
            </InputField>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField label="Teléfono de Contacto" error={errors.contactPhone} required>
              <input
                type="tel"
                value={formState.contactPhone}
                onChange={(e) => updateFormField('contactPhone', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                placeholder="+504 0000-0000"
              />
            </InputField>

            <InputField label="Correo Electrónico" error={errors.contactEmail} required>
              <input
                type="email"
                value={formState.contactEmail}
                onChange={(e) => updateFormField('contactEmail', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                placeholder="ejemplo@correo.com"
              />
            </InputField>
          </div>
        </div>
      )}

      {/* Paso 3: Detalles adicionales y catering */}
      {currentStep === 3 && (
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

          {/* Sección Catering */}
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
                  {supabaseData.catering.map((cat) => (
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
                {supabaseData.serviceModes.map((mode) => (
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
      )}

      {/* Botones de navegación */}
      <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
        <div className="flex gap-3">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Anterior
          </button>

          <button
            onClick={resetForm}
            className="px-4 py-2 border border-red-300 rounded-lg text-red-600 hover:bg-red-50 transition-all duration-200 text-sm flex items-center"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Limpiar
          </button>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-500 font-medium">
            Paso {currentStep} de 3
          </div>

          {currentStep < 3 ? (
            <button
              onClick={nextStep}
              className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-all duration-200 flex items-center shadow-md hover:shadow-lg"
            >
              Siguiente
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center shadow-md hover:shadow-lg"
            >
              {isLoading ? (
                <>
                  <LoadingSpinner />
                  <span className="ml-2">Creando...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Crear Evento
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

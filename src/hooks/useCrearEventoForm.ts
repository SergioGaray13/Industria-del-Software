// src/hooks/useCrearEventoForm.ts
'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export interface FormState {
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  categoryId: string;
  providerId: string;
  placeId: string;       
  location: string;      
  locationId: string;    
  startTime: string;
  endTime: string;
  contactPhone: string;
  contactEmail: string;
  audiovisual: boolean;
  attendeesEstimated: string;
  cateringId: string;
  menuId: string;
  serviceMode: string;
  includesServiceStaff: boolean;
  cateringNotes: string;
  notes: string;
  userId: string;
}

const initialFormState: FormState = {
  title: '',
  description: '',
  start_date: '',
  end_date: '',
  categoryId: '',
  providerId: '',
  placeId: '',
  location: '',
  locationId: '',
  startTime: '',
  endTime: '',
  contactPhone: '',
  contactEmail: '',
  audiovisual: false,
  attendeesEstimated: '',
  cateringId: '',
  menuId: '',
  serviceMode: '',
  includesServiceStaff: false,
  cateringNotes: '',
  notes: '',
  userId: '',
};

export function useCrearEventoForm(router: ReturnType<typeof useRouter>) {
  const [formState, setFormState] = useState<FormState>(initialFormState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<any>(null); // 🔥 Agregar estado para usuario

  const [supabaseData, setSupabaseData] = useState({
    categories: [] as any[],
    providers: [] as any[],
    lugares: [] as any[],
    salones: [] as any[],
    catering: [] as any[],
    serviceModes: [] as any[],
    menus: [] as any[],
  });

  // 🔥 Cargar usuario al inicializar el hook
  useEffect(() => {
    async function loadUser() {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error) {
          console.error('Error obteniendo usuario:', error);
          return;
        }

        if (!user) {
          console.warn('No hay usuario autenticado');
          // Opcional: redirigir a login
          // router.push('/login');
          return;
        }

        console.log('Usuario cargado:', user.id); // 🔍 Debug
        setCurrentUser(user);
        
        // Actualizar formState con userId
        setFormState(prev => ({
          ...prev,
          userId: user.id
        }));

      } catch (error) {
        console.error('Error inesperado al cargar usuario:', error);
      }
    }

    loadUser();
  }, []);

  // 🔥 Escuchar cambios en la autenticación
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id); // 🔍 Debug
        
        if (session?.user) {
          setCurrentUser(session.user);
          setFormState(prev => ({
            ...prev,
            userId: session.user.id
          }));
        } else {
          setCurrentUser(null);
          setFormState(prev => ({
            ...prev,
            userId: ''
          }));
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Cargar datos de Supabase
  useEffect(() => {
    async function fetchData() {
      const [
        categoriesRes,
        providersRes,
        lugaresRes,
        salonesRes,
        cateringRes,
        serviceModesRes,
        menusRes,
      ] = await Promise.all([
        supabase.from('categories').select('*'),
        supabase.from('providers').select('*'),
        supabase.from('lugares').select('*'),
        supabase.from('salones').select('*'),
        supabase.from('catering').select('*'),
        supabase.from('service_modes').select('*'),
        supabase.from('catering_menus').select('*'),
      ]);

      setSupabaseData({
        categories: categoriesRes.data ?? [],
        providers: providersRes.data ?? [],
        lugares: lugaresRes.data ?? [],
        salones: salonesRes.data ?? [],
        catering: cateringRes.data ?? [],
        serviceModes: serviceModesRes.data ?? [],
        menus: menusRes.data ?? [],
      });
    }
    fetchData();
  }, []);

  // Menús filtrados por catering seleccionado
  const filteredMenus = useMemo(() => {
    if (!formState.cateringId) return [];
    return supabaseData.menus.filter((menu) => menu.catering_id === formState.cateringId);
  }, [formState.cateringId, supabaseData.menus]);

  // Salones filtrados por lugar seleccionado
  const filteredSalones = useMemo(() => {
    if (!formState.placeId) return [];
    return supabaseData.salones.filter((salon) => salon.lugar_id === formState.placeId);
  }, [formState.placeId, supabaseData.salones]);

  // Actualizar campos
  const updateFormField = useCallback(
    (field: keyof FormState, value: any) => {
      setFormState((prev) => ({
        ...prev,
        [field]: value,
      }));

      // Si cambia lugar, actualiza dirección y limpia salón
      if (field === 'placeId') {
        const lugar = supabaseData.lugares.find((l) => l.id === value);
        setFormState((prev) => ({
          ...prev,
          location: lugar ? lugar.direccion ?? '' : '',
          locationId: '',
        }));
      }
    },
    [supabaseData.lugares]
  );

  // Validaciones por paso
  const validateStep = useCallback(() => {
    const newErrors: Record<string, string> = {};
    
    // 🔥 Validar que hay usuario autenticado
    if (!currentUser) {
      newErrors.auth = 'Debes estar autenticado para crear eventos';
    }
    
    if (currentStep === 1) {
      if (!formState.title) newErrors.title = 'El título es obligatorio';
      if (!formState.start_date) newErrors.start_date = 'La fecha de inicio es obligatoria';
      if (!formState.end_date) newErrors.end_date = 'La fecha de finalización es obligatoria';
      if (!formState.categoryId) newErrors.categoryId = 'Selecciona una categoría';
      if (!formState.providerId) newErrors.providerId = 'Selecciona un proveedor';
    } else if (currentStep === 2) {
      if (!formState.placeId) newErrors.placeId = 'Selecciona un lugar';
      if (!formState.locationId) newErrors.locationId = 'Selecciona un salón';
      if (!formState.startTime) newErrors.startTime = 'Selecciona hora de inicio';
      if (!formState.endTime) newErrors.endTime = 'Selecciona hora de fin';
      if (formState.startTime && formState.endTime && formState.endTime <= formState.startTime) {
        newErrors.endTime = 'La hora de fin debe ser mayor que la de inicio';
      }
      if (!formState.contactPhone) newErrors.contactPhone = 'El teléfono es obligatorio';
      if (!formState.contactEmail) newErrors.contactEmail = 'El correo es obligatorio';
      else if (!/\S+@\S+\.\S+/.test(formState.contactEmail)) newErrors.contactEmail = 'Correo inválido';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [currentStep, formState, currentUser]);

  const nextStep = useCallback(() => {
    if (validateStep()) setCurrentStep((prev) => Math.min(prev + 1, 3));
  }, [validateStep]);

  const prevStep = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  }, []);

  const resetForm = useCallback(() => {
    setFormState({
      ...initialFormState,
      userId: currentUser?.id || '' // 🔥 Mantener userId al resetear
    });
    setErrors({});
    setCurrentStep(1);
    setShowSuccess(false);
  }, [currentUser]);

  // Guardar evento y booking
  const handleSubmit = useCallback(async () => {
    if (!validateStep()) return;
    
    if (!currentUser?.id) {
      alert('Error: No hay usuario autenticado. Por favor, inicia sesión nuevamente.');
      return;
    }
    
    setIsLoading(true);
    try {
      console.log('Creando evento para usuario:', currentUser.id);
      
      // 1️⃣ Crear evento - ahora user_id referencia directamente auth.users
      const { data: eventData, error: eventError } = await supabase
        .from("events")
        .insert([
          {
            title: formState.title,
            description: formState.description,
            start_date: formState.start_date,
            end_date: formState.end_date || null,
            location: formState.location,
            category_id: formState.categoryId,
            location_id: formState.placeId,
            salon_id: formState.locationId,
            start_time: formState.startTime,
            end_time: formState.endTime,
            contact_phone: formState.contactPhone,
            contact_email: formState.contactEmail,
            audiovisual: formState.audiovisual,
            attendees_estimated: formState.attendeesEstimated
              ? Number(formState.attendeesEstimated)
              : null,
            notes: formState.notes,
            user_id: currentUser.id, // ✅ Ahora funcionará correctamente
          },
        ])
        .select("id")
        .single();
        
      if (eventError) {
        console.error('Error al crear evento:', eventError);
        throw eventError;
      }
      
      const eventId = eventData.id;
      console.log('Evento creado con ID:', eventId);
      
      // 2️⃣ Crear booking asociado
      const { error: bookingError } = await supabase
        .from("bookings")
        .insert([
          {
            event_id: eventId,
            provider_id: formState.providerId || null,
            user_id: currentUser.id, // ✅ También funcionará
            status: "pendiente",
            catering_id: formState.cateringId || null,
            menu_id: formState.menuId || null,
            number_of_guests: formState.attendeesEstimated
              ? Number(formState.attendeesEstimated)
              : null,
            includes_service_staff: formState.includesServiceStaff,
            service_mode_id: formState.serviceMode || null,
            notes: formState.cateringNotes || null,
          },
        ]);
        
      if (bookingError) {
        console.error('Error al crear booking:', bookingError);
        throw bookingError;
      }
      
      console.log('Evento y booking creados exitosamente');
      setShowSuccess(true);
      resetForm();
      router.refresh();
    } catch (error: any) {
      console.error('Error completo:', error);
      alert("Error al crear evento: " + error.message);
    } finally {
      setIsLoading(false);
    }
  }, [formState, validateStep, resetForm, router, currentUser]);

  return {
    formState,
    errors,
    currentStep,
    isLoading,
    showSuccess,
    currentUser, // 🔥 Exponer currentUser para debugging
    supabaseData,
    filteredMenus,
    filteredSalones,
    updateFormField,
    nextStep,
    prevStep,
    resetForm,
    validateStep,
    handleSubmit,
  };
}
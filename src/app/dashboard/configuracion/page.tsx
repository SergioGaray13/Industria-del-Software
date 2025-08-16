'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

interface Lugar {
  id: string;
  nombre: string;
  direccion?: string;
  descripcion?: string;
  ciudad?: string;
  municipio?: string;
  departamento?: string;
  pais?: string;
  imagen?: string;
  sitio_web?: string;
  created_at: string;
}

interface Salon {
  id: string;
  nombre: string;
  ubicacion?: string;
  capacidad?: number;
  equipamiento?: string[];
  responsable?: string;
  descripcion?: string;
  url_imagen?: string;
  lugar_id: string;
  coordenada_x?: number;
  coordenada_y?: number;
  ancho?: number;
  alto?: number;
  estado?: string;
  created_at: string;
  precios_por_hora?: number;
}

export default function ConfiguracionPage() {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [lugares, setLugares] = useState<Lugar[]>([]);
  const [salones, setSalones] = useState<Salon[]>([]);
  const [editingLugar, setEditingLugar] = useState<Lugar | null>(null);
  const [editingSalon, setEditingSalon] = useState<Salon | null>(null);
  const [lugarFormData, setLugarFormData] = useState<Partial<Lugar>>({});
  const [salonFormData, setSalonFormData] = useState<Partial<Salon>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [salonErrors, setSalonErrors] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState<'lugares' | 'salones'>('lugares');
  const [filteredSalones, setFilteredSalones] = useState<Salon[]>([]);
  const [selectedLugar, setSelectedLugar] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    checkUserRole();
  }, []);

  useEffect(() => {
    if (userRole && (userRole === 'admin' || userRole === 'proveedor')) {
      fetchLugares();
      fetchSalones();
    }
  }, [userRole]);

  useEffect(() => {
    if (selectedLugar) {
      setFilteredSalones(salones.filter(salon => salon.lugar_id === selectedLugar));
    } else {
      setFilteredSalones(salones);
    }
  }, [selectedLugar, salones]);

  const checkUserRole = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
        return;
      }

      const { data: userData, error } = await supabase
        .from('users')
        .select('role')
        .eq('id', session.user.id)
        .single();

      if (error) throw error;

      if (userData.role !== 'admin' && userData.role !== 'proveedor') {
        router.push('/dashboard');
        return;
      }

      setUserRole(userData.role);
    } catch (error) {
      console.error('Error checking user role:', error);
      router.push('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const fetchLugares = async () => {
    try {
      const { data, error } = await supabase
        .from('lugares')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setLugares(data || []);
    } catch (error) {
      console.error('Error fetching lugares:', error);
    }
  };

  const fetchSalones = async () => {
    try {
      const { data, error } = await supabase
        .from('salones')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setSalones(data || []);
    } catch (error) {
      console.error('Error fetching salones:', error);
    }
  };

  const validateLugar = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!lugarFormData.nombre?.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateSalon = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!salonFormData.nombre?.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    }

    if (!salonFormData.lugar_id) {
      newErrors.lugar_id = 'Debe seleccionar un lugar';
    }

    setSalonErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveLugar = async () => {
    if (!validateLugar()) return;

    try {
      let error;

      if (editingLugar?.id) {
        // Actualizar lugar existente
        const { error: updateError } = await supabase
          .from('lugares')
          .update(lugarFormData)
          .eq('id', editingLugar.id);

        error = updateError;
      } else {
        // Crear nuevo lugar
        const { error: insertError } = await supabase
          .from('lugares')
          .insert(lugarFormData);

        error = insertError;
      }

      if (error) throw error;

      fetchLugares();
      setEditingLugar(null);
      setLugarFormData({});
      alert('Lugar guardado correctamente');
    } catch (error) {
      console.error('Error saving lugar:', error);
      alert('Error al guardar el lugar');
    }
  };

  const handleSaveSalon = async () => {
    if (!validateSalon()) return;

    try {
      let error;

      if (editingSalon?.id) {
        // Actualizar salón existente
        const { error: updateError } = await supabase
          .from('salones')
          .update(salonFormData)
          .eq('id', editingSalon.id);

        error = updateError;
      } else {
        // Crear nuevo salón
        const { error: insertError } = await supabase
          .from('salones')
          .insert(salonFormData);

        error = insertError;
      }

      if (error) throw error;

      fetchSalones();
      setEditingSalon(null);
      setSalonFormData({});
      alert('Salón guardado correctamente');
    } catch (error) {
      console.error('Error saving salón:', error);
      alert('Error al guardar el salón');
    }
  };

  const handleDeleteLugar = async (id: string) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este lugar? Esto también eliminará todos sus salones.')) return;

    try {
      // Primero eliminamos los salones asociados
      const { error: deleteSalonesError } = await supabase
        .from('salones')
        .delete()
        .eq('lugar_id', id);

      if (deleteSalonesError) throw deleteSalonesError;

      // Luego eliminamos el lugar
      const { error: deleteLugarError } = await supabase
        .from('lugares')
        .delete()
        .eq('id', id);

      if (deleteLugarError) throw deleteLugarError;

      fetchLugares();
      fetchSalones();
      alert('Lugar y sus salones eliminados correctamente');
    } catch (error) {
      console.error('Error deleting lugar:', error);
      alert('Error al eliminar el lugar');
    }
  };

  const handleDeleteSalon = async (id: string) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este salón?')) return;

    try {
      const { error } = await supabase
        .from('salones')
        .delete()
        .eq('id', id);

      if (error) throw error;

      fetchSalones();
      alert('Salón eliminado correctamente');
    } catch (error) {
      console.error('Error deleting salón:', error);
      alert('Error al eliminar el salón');
    }
  };

  const handleEditLugar = (lugar: Lugar) => {
    setEditingLugar(lugar);
    setLugarFormData({
      nombre: lugar.nombre,
      direccion: lugar.direccion,
      descripcion: lugar.descripcion,
      ciudad: lugar.ciudad,
      municipio: lugar.municipio,
      departamento: lugar.departamento,
      pais: lugar.pais,
      imagen: lugar.imagen,
      sitio_web: lugar.sitio_web,
    });
  };

  const handleEditSalon = (salon: Salon) => {
    setEditingSalon(salon);
    setSalonFormData({
      nombre: salon.nombre,
      ubicacion: salon.ubicacion,
      capacidad: salon.capacidad,
      equipamiento: salon.equipamiento,
      responsable: salon.responsable,
      descripcion: salon.descripcion,
      url_imagen: salon.url_imagen,
      lugar_id: salon.lugar_id,
      coordenada_x: salon.coordenada_x,
      coordenada_y: salon.coordenada_y,
      ancho: salon.ancho,
      alto: salon.alto,
      estado: salon.estado,
      precios_por_hora: salon.precios_por_hora,
    });
    setSelectedLugar(salon.lugar_id);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-orange-700">Verificando permisos...</p>
        </div>
      </div>
    );
  }

  if (!userRole) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">No tienes permisos para acceder a esta página</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700"
          >
            Volver al Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.push('/dashboard')}
            className="flex items-center gap-2 text-orange-600 hover:text-orange-700 mb-4"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Volver al Dashboard
          </button>
          <h1 className="text-3xl font-bold text-orange-600">Configuración de Lugares y Salones</h1>
          <p className="text-gray-600">Gestiona los lugares y salones disponibles en la plataforma</p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            onClick={() => setActiveTab('lugares')}
            className={`px-4 py-2 font-medium ${activeTab === 'lugares' ? 'text-orange-600 border-b-2 border-orange-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Lugares
          </button>
          <button
            onClick={() => setActiveTab('salones')}
            className={`px-4 py-2 font-medium ${activeTab === 'salones' ? 'text-orange-600 border-b-2 border-orange-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Salones
          </button>
        </div>

        {/* Lugares Tab */}
        {activeTab === 'lugares' && (
          <div className="bg-gradient-to-br from-blue-400/20 via-blue-300/15 to-blue-500/25 backdrop-blur-sm border border-white/30 rounded-xl shadow-lg p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-800">Lista de Lugares</h3>
              <button
                onClick={() => {
                  setEditingLugar({
                    id: '',
                    nombre: '',
                    created_at: new Date().toISOString(),
                  });
                  setLugarFormData({});
                }}
                className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
              >
                Agregar Lugar
              </button>
            </div>

            {lugares.length === 0 && !editingLugar && (
              <div className="text-center py-6 text-gray-500">
                No hay lugares registrados
              </div>
            )}

            {/* Lista de Lugares */}
            <div className="space-y-4">
              {lugares.map((lugar) => (
                <div
                  key={lugar.id}
                  className="p-4 border border-gray-200 rounded-lg bg-white hover:bg-gray-50"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium text-gray-800">{lugar.nombre}</div>
                      <div className="text-sm text-gray-600">
                        {lugar.direccion && <p>Dirección: {lugar.direccion}</p>}
                        {lugar.ciudad && <p>Ciudad: {lugar.ciudad}</p>}
                        {lugar.descripcion && <p>Descripción: {lugar.descripcion}</p>}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditLugar(lugar)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDeleteLugar(lugar.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Formulario de Lugar */}
            {editingLugar && (
              <div className="mt-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
                <h4 className="text-lg font-medium text-gray-800 mb-4">
                  {editingLugar.id ? 'Editar Lugar' : 'Agregar Lugar'}
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Nombre */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre del Lugar*
                    </label>
                    <input
                      type="text"
                      value={lugarFormData.nombre || ''}
                      onChange={(e) =>
                        setLugarFormData({
                          ...lugarFormData,
                          nombre: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 text-black border border-gray-300 rounded-lg"
                      placeholder="Nombre del lugar"
                    />
                    {errors.nombre && (
                      <p className="mt-1 text-sm text-red-600">{errors.nombre}</p>
                    )}
                  </div>

                  {/* Dirección */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Dirección
                    </label>
                    <input
                      type="text"
                      value={lugarFormData.direccion || ''}
                      onChange={(e) =>
                        setLugarFormData({
                          ...lugarFormData,
                          direccion: e.target.value,
                        })
                      }
                      className="w-full text-black px-3 py-2 border border-gray-300 rounded-lg"
                      placeholder="Dirección completa"
                    />
                  </div>

                  {/* Descripción */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Descripción
                    </label>
                    <textarea
                      value={lugarFormData.descripcion || ''}
                      onChange={(e) =>
                        setLugarFormData({
                          ...lugarFormData,
                          descripcion: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 text-black border border-gray-300 rounded-lg"
                      placeholder="Descripción del lugar"
                      rows={3}
                    />
                  </div>

                  {/* Ciudad */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ciudad
                    </label>
                    <input
                      type="text"
                      value={lugarFormData.ciudad || ''}
                      onChange={(e) =>
                        setLugarFormData({
                          ...lugarFormData,
                          ciudad: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 text-black border border-gray-300 rounded-lg"
                      placeholder="Ciudad"
                    />
                  </div>

                  {/* Municipio */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Municipio
                    </label>
                    <input
                      type="text"
                      value={lugarFormData.municipio || ''}
                      onChange={(e) =>
                        setLugarFormData({
                          ...lugarFormData,
                          municipio: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 text-black border border-gray-300 rounded-lg"
                      placeholder="Municipio"
                    />
                  </div>

                  {/* Departamento */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Departamento
                    </label>
                    <input
                      type="text"
                      value={lugarFormData.departamento || ''}
                      onChange={(e) =>
                        setLugarFormData({
                          ...lugarFormData,
                          departamento: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 text-black border border-gray-300 rounded-lg"
                      placeholder="Departamento"
                    />
                  </div>

                  {/* País */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      País
                    </label>
                    <input
                      type="text"
                      value={lugarFormData.pais || ''}
                      onChange={(e) =>
                        setLugarFormData({
                          ...lugarFormData,
                          pais: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 text-black border border-gray-300 rounded-lg"
                      placeholder="País"
                    />
                  </div>

                  {/* Imagen */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      URL de la Imagen
                    </label>
                    <input
                      type="text"
                      value={lugarFormData.imagen || ''}
                      onChange={(e) =>
                        setLugarFormData({
                          ...lugarFormData,
                          imagen: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 text-black border border-gray-300 rounded-lg"
                      placeholder="https://ejemplo.com/imagen.jpg"
                    />
                  </div>

                  {/* Sitio Web */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sitio Web
                    </label>
                    <input
                      type="text"
                      value={lugarFormData.sitio_web || ''}
                      onChange={(e) =>
                        setLugarFormData({
                          ...lugarFormData,
                          sitio_web: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 text-black border border-gray-300 rounded-lg"
                      placeholder="https://ejemplo.com"
                    />
                  </div>
                </div>

                <div className="mt-6 flex justify-end gap-2">
                  <button
                    onClick={() => {
                      setEditingLugar(null);
                      setErrors({});
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSaveLugar}
                    className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                  >
                    Guardar Lugar
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Salones Tab */}
        {activeTab === 'salones' && (
          <div className="bg-gradient-to-br from-blue-400/20 via-blue-300/15 to-blue-500/25 backdrop-blur-sm border border-white/30 rounded-xl shadow-lg p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-800">Lista de Salones</h3>
              <button
                onClick={() => {
                  setEditingSalon({
                    id: '',
                    nombre: '',
                    lugar_id: '',
                    created_at: new Date().toISOString(),
                    estado: 'disponible',
                    coordenada_x: 100,
                    coordenada_y: 100,
                    ancho: 150,
                    alto: 100,
                    precios_por_hora: 0,
                  });
                  setSalonFormData({
                    estado: 'disponible',
                    coordenada_x: 100,
                    coordenada_y: 100,
                    ancho: 150,
                    alto: 100,
                    precios_por_hora: 0,
                  });
                }}
                className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
              >
                Agregar Salón
              </button>
            </div>

            {/* Filtro por lugar */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filtrar por lugar:
              </label>
              <select
                value={selectedLugar || ''}
                onChange={(e) => setSelectedLugar(e.target.value || null)}
                className="w-full md:w-1/3 px-3 text-black py-2 border border-gray-300 rounded-lg"
              >
                <option value="">Todos los lugares</option>
                {lugares.map((lugar) => (
                  <option key={lugar.id} value={lugar.id}>
                    {lugar.nombre}
                  </option>
                ))}
              </select>
            </div>

            {filteredSalones.length === 0 && !editingSalon && (
              <div className="text-center py-6 text-gray-500">
                No hay salones registrados{selectedLugar ? ' en este lugar' : ''}
              </div>
            )}

            {/* Lista de Salones */}
            <div className="space-y-4">
              {filteredSalones.map((salon) => (
                <div
                  key={salon.id}
                  className="p-4 border border-gray-200 rounded-lg bg-white hover:bg-gray-50"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium text-gray-800">{salon.nombre}</div>
                      <div className="text-sm text-gray-600">
                        <p>Lugar: {lugares.find(l => l.id === salon.lugar_id)?.nombre || 'Desconocido'}</p>
                        {salon.capacidad && <p>Capacidad: {salon.capacidad} personas</p>}
                        {salon.ubicacion && <p>Ubicación: {salon.ubicacion}</p>}
                        {salon.estado && <p>Estado: {salon.estado}</p>}
                        {salon.precios_por_hora && <p>Precio por hora: ${salon.precios_por_hora}</p>}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditSalon(salon)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDeleteSalon(salon.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Formulario de Salón */}
            {editingSalon && (
              <div className="mt-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
                <h4 className="text-lg font-medium text-gray-800 mb-4">
                  {editingSalon.id ? 'Editar Salón' : 'Agregar Salón'}
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Nombre */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre del Salón*
                    </label>
                    <input
                      type="text"
                      value={salonFormData.nombre || ''}
                      onChange={(e) =>
                        setSalonFormData({
                          ...salonFormData,
                          nombre: e.target.value,
                        })
                      }
                      className="w-full px-3 text-black py-2 border border-gray-300 rounded-lg"
                      placeholder="Nombre del salón"
                    />
                    {salonErrors.nombre && (
                      <p className="mt-1 text-sm text-red-600">{salonErrors.nombre}</p>
                    )}
                  </div>

                  {/* Lugar */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Lugar*
                    </label>
                    <select
                      value={salonFormData.lugar_id || ''}
                      onChange={(e) =>
                        setSalonFormData({
                          ...salonFormData,
                          lugar_id: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 text-black border border-gray-300 rounded-lg"
                    >
                      <option value="">Seleccione un lugar</option>
                      {lugares.map((lugar) => (
                        <option key={lugar.id} value={lugar.id}>
                          {lugar.nombre}
                        </option>
                      ))}
                    </select>
                    {salonErrors.lugar_id && (
                      <p className="mt-1 text-sm text-red-600">{salonErrors.lugar_id}</p>
                    )}
                  </div>

                   {/* Precio por hora */}
                   <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Precio por hora ($)
                    </label>
                    <input
                      type="number"
                      value={salonFormData.precios_por_hora || ''}
                      onChange={(e) =>
                        setSalonFormData({
                          ...salonFormData,
                          precios_por_hora: e.target.value ? parseFloat(e.target.value) : undefined,
                        })
                      }
                      className="w-full px-3 py-2 text-black border border-gray-300 rounded-lg"
                      placeholder="Ej: 50.00"
                      min="0"
                      step="0.01"
                    />
                    </div>

                  {/* Ubicación */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ubicación
                    </label>
                    <input
                      type="text"
                      value={salonFormData.ubicacion || ''}
                      onChange={(e) =>
                        setSalonFormData({
                          ...salonFormData,
                          ubicacion: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 text-black border border-gray-300 rounded-lg"
                      placeholder="Ej: Planta baja, ala este"
                    />
                  </div>

                  {/* Capacidad */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Capacidad
                    </label>
                    <input
                      type="number"
                      value={salonFormData.capacidad || ''}
                      onChange={(e) =>
                        setSalonFormData({
                          ...salonFormData,
                          capacidad: e.target.value ? parseInt(e.target.value) : undefined,
                        })
                      }
                      className="w-full px-3 py-2 text-black border border-gray-300 rounded-lg"
                      placeholder="Número de personas"
                    />
                  </div>

                  {/* Estado */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Estado
                    </label>
                    <select
                      value={salonFormData.estado || 'disponible'}
                      onChange={(e) =>
                        setSalonFormData({
                          ...salonFormData,
                          estado: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 text-black border border-gray-300 rounded-lg"
                    >
                      <option value="disponible">Disponible</option>
                      <option value="mantenimiento">En mantenimiento</option>
                      <option value="ocupado">Ocupado</option>
                    </select>
                  </div>

                  {/* URL Imagen */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      URL de la Imagen
                    </label>
                    <input
                      type="text"
                      value={salonFormData.url_imagen || ''}
                      onChange={(e) =>
                        setSalonFormData({
                          ...salonFormData,
                          url_imagen: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 text-black border border-gray-300 rounded-lg"
                      placeholder="https://ejemplo.com/imagen.jpg"
                    />
                  </div>

                  {/* Responsable */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Responsable
                    </label>
                    <input
                      type="text"
                      value={salonFormData.responsable || ''}
                      onChange={(e) =>
                        setSalonFormData({
                          ...salonFormData,
                          responsable: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 text-black border border-gray-300 rounded-lg"
                      placeholder="Nombre del responsable"
                    />
                  </div>

                  {/* Equipamiento */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Equipamiento (separado por comas)
                    </label>
                    <input
                      type="text"
                      value={salonFormData.equipamiento?.join(', ') || ''}
                      onChange={(e) =>
                        setSalonFormData({
                          ...salonFormData,
                          equipamiento: e.target.value.split(',').map(item => item.trim()),
                        })
                      }
                      className="w-full px-3 py-2 text-black border border-gray-300 rounded-lg"
                      placeholder="Ej: Proyector, Micrófonos, Sillas"
                    />
                  </div>

                  {/* Descripción */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Descripción
                    </label>
                    <textarea
                      value={salonFormData.descripcion || ''}
                      onChange={(e) =>
                        setSalonFormData({
                          ...salonFormData,
                          descripcion: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 text-black border border-gray-300 rounded-lg"
                      placeholder="Descripción del salón"
                      rows={3}
                    />
                  </div>

                  {/* Coordenadas y dimensiones */}
                  <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Coordenada X
                      </label>
                      <input
                        type="number"
                        value={salonFormData.coordenada_x || 100}
                        onChange={(e) =>
                          setSalonFormData({
                            ...salonFormData,
                            coordenada_x: parseInt(e.target.value),
                          })
                        }
                        className="w-full px-3 py-2 text-black border border-gray-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Coordenada Y
                      </label>
                      <input
                        type="number"
                        value={salonFormData.coordenada_y || 100}
                        onChange={(e) =>
                          setSalonFormData({
                            ...salonFormData,
                            coordenada_y: parseInt(e.target.value),
                          })
                        }
                        className="w-full px-3 py-2 text-black border border-gray-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ancho
                      </label>
                      <input
                        type="number"
                        value={salonFormData.ancho || 150}
                        onChange={(e) =>
                          setSalonFormData({
                            ...salonFormData,
                            ancho: parseInt(e.target.value),
                          })
                        }
                        className="w-full px-3 py-2 text-black border border-gray-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Alto
                      </label>
                      <input
                        type="number"
                        value={salonFormData.alto || 100}
                        onChange={(e) =>
                          setSalonFormData({
                            ...salonFormData,
                            alto: parseInt(e.target.value),
                          })
                        }
                        className="w-full px-3 py-2 text-black border border-gray-300 rounded-lg"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end gap-2">
                  <button
                    onClick={() => {
                      setEditingSalon(null);
                      setSalonErrors({});
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSaveSalon}
                    className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                  >
                    Guardar Salón
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
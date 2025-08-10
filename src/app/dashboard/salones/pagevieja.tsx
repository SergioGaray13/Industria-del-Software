//src\app\dashboard\salones\page.tsx
'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface Salon {
  id: string;
  nombre: string;
  ubicacion: string;
  capacidad: number;
  equipamiento: string[];
  responsable: string;
  descripcion: string;
  sesiones: { hora: string; tema: string }[];
  url_imagen?: string | null;
}

interface FormSalon {
  id?: string;
  nombre: string;
  ubicacion: string;
  capacidad: number | '';
  equipamiento: string;
  responsable: string;
  descripcion: string;
  imagen: File | null;
}

// Función común para subir imagen
async function subirImagen(file: File): Promise<string> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${crypto.randomUUID()}.${fileExt}`;
  const filePath = `salones/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('salones')
    .upload(filePath, file);

  if (uploadError) throw uploadError;

  const { data } = supabase.storage.from('salones').getPublicUrl(filePath);
  return data.publicUrl;
}

// Modal genérico para agregar/editar
function ModalSalonForm({
  titulo,
  form,
  setForm,
  onSubmit,
  loading,
  mensaje,
  onClose,
}: {
  titulo: string;
  form: FormSalon;
  setForm: React.Dispatch<React.SetStateAction<FormSalon>>;
  onSubmit: () => void;
  loading: boolean;
  mensaje: string;
  onClose: () => void;
}) {
  const handleChange = (field: keyof FormSalon, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg animate-fade-in overflow-auto max-h-[90vh]">
        <h2 className="text-xl font-bold mb-4">{titulo}</h2>

        <label className="block mb-2 text-sm text-gray-700">Nombre*:</label>
        <input
          type="text"
          value={form.nombre}
          onChange={(e) => handleChange('nombre', e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 mb-3"
          required
          placeholder="Ejemplo: Salón Diamante"
          disabled={loading}
        />

        <label className="block mb-2 text-sm text-gray-700">Ubicación:</label>
        <input
          type="text"
          value={form.ubicacion}
          onChange={(e) => handleChange('ubicacion', e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 mb-3"
          placeholder="Ejemplo: Av. Principal #123, Tegucigalpa"
          disabled={loading}
        />

        <label className="block mb-2 text-sm text-gray-700">Capacidad:</label>
        <input
          type="number"
          value={form.capacidad}
          onChange={(e) =>
            handleChange('capacidad', e.target.value === '' ? '' : Number(e.target.value))
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
          onChange={(e) => handleChange('equipamiento', e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 mb-3"
          placeholder="Ejemplo: sonido, iluminación, aire acondicionado"
          disabled={loading}
        />

        <label className="block mb-2 text-sm text-gray-700">Responsable:</label>
        <input
          type="text"
          value={form.responsable}
          onChange={(e) => handleChange('responsable', e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 mb-3"
          placeholder="Ejemplo: Juan Pérez"
          disabled={loading}
        />

        <label className="block mb-2 text-sm text-gray-700">Descripción:</label>
        <textarea
          value={form.descripcion}
          onChange={(e) => handleChange('descripcion', e.target.value)}
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
          onChange={(e) => handleChange('imagen', e.target.files?.[0] || null)}
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
}

export default function SalonesPage() {
  const [salones, setSalones] = useState<Salon[]>([]);
  const [selectedSalon, setSelectedSalon] = useState<Salon | null>(null);
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');
  const [mensajeReserva, setMensajeReserva] = useState('');
  const [modalReservarOpen, setModalReservarOpen] = useState(false);

  // Estados modales agregar/editar
  const [modalFormOpen, setModalFormOpen] = useState(false);
  const [formSalon, setFormSalon] = useState<FormSalon>({
    nombre: '',
    ubicacion: '',
    capacidad: '',
    equipamiento: '',
    responsable: '',
    descripcion: '',
    imagen: null,
  });
  const [loadingForm, setLoadingForm] = useState(false);
  const [mensajeForm, setMensajeForm] = useState('');

  // Modal eliminar
  const [modalEliminarOpen, setModalEliminarOpen] = useState(false);
  const [eliminarSalonId, setEliminarSalonId] = useState<string | null>(null);
  const [loadingEliminar, setLoadingEliminar] = useState(false);
  const [mensajeEliminar, setMensajeEliminar] = useState('');

  // Fetch salones
  const fetchSalones = async () => {
    const { data, error } = await supabase.from('salones').select('*');
    if (!error && data) setSalones(data);
  };

  useEffect(() => {
    fetchSalones();
  }, []);

  // Funciones abrir/cerrar modal reservar
  const abrirModalReservar = (salon: Salon) => {
    setSelectedSalon(salon);
    setFecha('');
    setHora('');
    setMensajeReserva('');
    setModalReservarOpen(true);
  };
  const cerrarModalReservar = () => {
    setSelectedSalon(null);
    setFecha('');
    setHora('');
    setMensajeReserva('');
    setModalReservarOpen(false);
  };

  // Reservar
  const reservarSalon = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session || !selectedSalon) return;

    // Validar duplicados
    const { data: existentes } = await supabase
      .from('reservas')
      .select('*')
      .eq('usuario_id', session.user.id)
      .eq('salon_id', selectedSalon.id)
      .eq('fecha', fecha)
      .eq('hora', hora);

    if (existentes && existentes.length > 0) {
      setMensajeReserva('⚠️ Ya tienes una reserva para este salón en esa fecha y hora.');
      return;
    }

    const { error } = await supabase.from('reservas').insert({
      usuario_id: session.user.id,
      salon_id: selectedSalon.id,
      fecha,
      hora,
      estado: 'pendiente',
    });

    if (error) {
      setMensajeReserva('❌ Error al reservar. Intenta de nuevo.');
    } else {
      setMensajeReserva('✅ ¡Reserva realizada con éxito!');
      setTimeout(() => cerrarModalReservar(), 2000);
    }
  };

  // Abrir modal formulario agregar
  const abrirModalAgregar = () => {
    setFormSalon({
      nombre: '',
      ubicacion: '',
      capacidad: '',
      equipamiento: '',
      responsable: '',
      descripcion: '',
      imagen: null,
    });
    setMensajeForm('');
    setModalFormOpen(true);
  };

  // Abrir modal formulario editar
  const abrirModalEditar = (salon: Salon) => {
    setFormSalon({
      id: salon.id,
      nombre: salon.nombre,
      ubicacion: salon.ubicacion,
      capacidad: salon.capacidad,
      equipamiento: salon.equipamiento?.join(', ') || '',
      responsable: salon.responsable,
      descripcion: salon.descripcion,
      imagen: null,
    });
    setMensajeForm('');
    setModalFormOpen(true);
  };

  // Cerrar modal formulario
  const cerrarModalForm = () => {
    setFormSalon({
      nombre: '',
      ubicacion: '',
      capacidad: '',
      equipamiento: '',
      responsable: '',
      descripcion: '',
      imagen: null,
    });
    setMensajeForm('');
    setModalFormOpen(false);
  };

  // Agregar o editar salón
  const guardarSalon = async () => {
    if (!formSalon.nombre) {
      setMensajeForm('El nombre es obligatorio');
      return;
    }
    setLoadingForm(true);
    setMensajeForm('');

    try {
      let urlImagen = null;
      if (formSalon.imagen) {
        urlImagen = await subirImagen(formSalon.imagen);
      }

      if (formSalon.id) {
        // Editar
        const updateData: any = {
          nombre: formSalon.nombre,
          ubicacion: formSalon.ubicacion,
          capacidad: Number(formSalon.capacidad) || 0,
          equipamiento: formSalon.equipamiento
            ? formSalon.equipamiento.split(',').map((e) => e.trim())
            : [],
          responsable: formSalon.responsable,
          descripcion: formSalon.descripcion,
        };
        if (urlImagen) updateData.url_imagen = urlImagen;

        const { error } = await supabase.from('salones').update(updateData).eq('id', formSalon.id);
        if (error) throw error;
        setMensajeForm('✅ Salón editado con éxito');
      } else {
        // Agregar
        const { error } = await supabase.from('salones').insert([
          {
            nombre: formSalon.nombre,
            ubicacion: formSalon.ubicacion,
            capacidad: Number(formSalon.capacidad) || 0,
            equipamiento: formSalon.equipamiento
              ? formSalon.equipamiento.split(',').map((e) => e.trim())
              : [],
            responsable: formSalon.responsable,
            descripcion: formSalon.descripcion,
            url_imagen: urlImagen,
          },
        ]);
        if (error) throw error;
        setMensajeForm('✅ Salón agregado con éxito');
      }

      cerrarModalForm();
      fetchSalones();
    } catch (error: any) {
      setMensajeForm('❌ Error al guardar salón: ' + error.message);
    } finally {
      setLoadingForm(false);
    }
  };

  // Modal eliminar
  const abrirModalEliminar = (salonId: string) => {
    setEliminarSalonId(salonId);
    setMensajeEliminar('');
    setModalEliminarOpen(true);
  };
  const cerrarModalEliminar = () => {
    setEliminarSalonId(null);
    setMensajeEliminar('');
    setModalEliminarOpen(false);
  };
  const eliminarSalon = async () => {
    if (!eliminarSalonId) return;
    setLoadingEliminar(true);
    setMensajeEliminar('');
    try {
      const { error } = await supabase.from('salones').delete().eq('id', eliminarSalonId);
      if (error) throw error;
      setMensajeEliminar('✅ Salón eliminado con éxito');
      setModalEliminarOpen(false);
      fetchSalones();
    } catch (error: any) {
      setMensajeEliminar('❌ Error al eliminar salón: ' + error.message);
    } finally {
      setLoadingEliminar(false);
    }
  };

  return (
    <div className="min-h-screen p-6">
      <div className="mb-6 text-center">
        <button
          onClick={abrirModalAgregar}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          + Agregar nuevo salón
        </button>
      </div>

      {/* Mensajes globales (opcional) */}
      {/* <p className="text-center mb-4">{mensajeGlobal}</p> */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {salones.map((salon) => (
          <div
            key={salon.id}
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition duration-300"
          >
            {salon.url_imagen && (
              <img
                src={salon.url_imagen}
                alt={`Imagen de ${salon.nombre}`}
                className="w-full h-48 object-cover rounded mb-4"
              />
            )}

            <h2 className="text-xl font-semibold text-orange-700 mb-2">{salon.nombre}</h2>
            <p className="text-sm text-gray-600 mb-1">📍 {salon.ubicacion}</p>
            <p className="text-sm text-gray-600 mb-1">👥 Capacidad: {salon.capacidad}</p>
            <p className="text-sm text-gray-600 mb-1">
              🎛️ Equipamiento: {salon.equipamiento?.join(', ')}
            </p>
            <p className="text-sm text-gray-600 mb-1">👤 Responsable: {salon.responsable}</p>
            <p className="text-sm text-gray-600 italic mb-2">📝 {salon.descripcion}</p>
            <div className="mb-2">
              <p className="text-sm font-medium text-orange-500">📅 Próximas sesiones:</p>
              <ul className="text-sm text-gray-700 list-disc list-inside">
                {salon.sesiones?.map((s, i) => (
                  <li key={i}>
                    {s.hora} - {s.tema}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex gap-2 mt-4">
              <button
                onClick={() => abrirModalReservar(salon)}
                className="flex-1 bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition"
              >
                Reservar
              </button>
              <button
                onClick={() => abrirModalEditar(salon)}
                className="flex-1 bg-yellow-400 py-2 rounded-lg hover:bg-yellow-500 transition"
              >
                Editar
              </button>
              <button
                onClick={() => abrirModalEliminar(salon.id)}
                className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal reservar */}
      {modalReservarOpen && selectedSalon && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg animate-fade-in">
            <h2 className="text-xl font-bold text-orange-600 mb-4">
              Reservar {selectedSalon.nombre}
            </h2>
            <label className="block mb-2 text-sm text-gray-700">Fecha:</label>
            <input
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              className="w-full border border-orange-300 rounded px-3 py-2 mb-4"
            />
            <label className="block mb-2 text-sm text-gray-700">Hora:</label>
            <input
              type="time"
              value={hora}
              onChange={(e) => setHora(e.target.value)}
              className="w-full border border-orange-300 rounded px-3 py-2 mb-4"
            />
            {mensajeReserva && <p className="text-sm text-center mb-2">{mensajeReserva}</p>}
            <div className="flex justify-between">
              <button
                onClick={cerrarModalReservar}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
              >
                Cancelar
              </button>
              <button
                onClick={reservarSalon}
                className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition"
              >
                Confirmar reserva
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal agregar/editar */}
      {modalFormOpen && (
        <ModalSalonForm
          titulo={formSalon.id ? 'Editar salón' : 'Agregar nuevo salón'}
          form={formSalon}
          setForm={setFormSalon}
          onSubmit={guardarSalon}
          loading={loadingForm}
          mensaje={mensajeForm}
          onClose={cerrarModalForm}
        />
      )}

      {/* Modal eliminar */}
      {modalEliminarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-lg animate-fade-in">
            <h2 className="text-xl font-bold mb-4 text-red-600">Eliminar salón</h2>
            {mensajeEliminar && (
              <p
                className={`mb-4 text-center ${
                  mensajeEliminar.startsWith('✅') ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {mensajeEliminar}
              </p>
            )}
            <p className="mb-6 text-center">
              ¿Está seguro que desea eliminar este salón? Esta acción no se puede deshacer.
            </p>
            <div className="flex justify-between">
              <button
                onClick={cerrarModalEliminar}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
                disabled={loadingEliminar}
              >
                Cancelar
              </button>
              <button
                onClick={eliminarSalon}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                disabled={loadingEliminar}
              >
                {loadingEliminar ? 'Eliminando...' : 'Eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

interface Reserva {
  id: string;
  fecha: string;
  hora: string;
  estado: string;
  salon: {
    nombre: string;
    ubicacion: string;
  };
}

export default function ReservasPage() {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState('');
  const [reservaAEliminar, setReservaAEliminar] = useState<Reserva | null>(null);
  const router = useRouter();

  const fetchReservas = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) return;

    const { data, error } = await supabase
      .from('reservas')
      .select('id, fecha, hora, estado, salon:salon_id (nombre, ubicacion)')
      .eq('usuario_id', session.user.id)
      .order('fecha', { ascending: true });

    if (!error && data) {
      const reservasConSalonObjeto = data.map((r: any) => ({
        ...r,
        salon: Array.isArray(r.salon) && r.salon.length > 0
          ? r.salon[0]
          : { nombre: '', ubicacion: '' },
      }));

      setReservas(reservasConSalonObjeto);
    } else if (error) {
      console.error('Error cargando reservas:', error);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchReservas();
  }, []);

  const confirmarCancelacion = async () => {
    if (!reservaAEliminar) return;

    const { error } = await supabase.from('reservas').delete().eq('id', reservaAEliminar.id);
    if (!error) {
      setMensaje('✅ Reserva cancelada correctamente.');
      setReservas((prev) => prev.filter((r) => r.id !== reservaAEliminar.id));
    } else {
      setMensaje('❌ Error al cancelar la reserva.');
    }
    setReservaAEliminar(null);
    setTimeout(() => setMensaje(''), 3000);
  };

  return (
    <div className="min-h-screen bg-orange-50 p-6">

      {mensaje && (
        <div className="text-center mb-4 text-sm text-orange-700 font-medium">{mensaje}</div>
      )}

      {loading ? (
        <p className="text-center text-orange-500">Cargando reservas...</p>
      ) : reservas.length === 0 ? (
        <p className="text-center text-gray-500">No tienes reservas registradas.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reservas.map((reserva) => (
            <div
              key={reserva.id}
              className="bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition"
            >
              <h2 className="text-lg font-semibold text-orange-700 mb-1">
                {reserva.salon.nombre}
              </h2>
              <p className="text-sm text-gray-600 mb-1">📍 {reserva.salon.ubicacion}</p>
              <p className="text-sm text-gray-600 mb-1">📅 {reserva.fecha}</p>
              <p className="text-sm text-gray-600 mb-1">🕒 {reserva.hora}</p>
              <p
                className={`text-sm font-medium mt-2 ${
                  reserva.estado === 'confirmada'
                    ? 'text-green-600'
                    : reserva.estado === 'pendiente'
                    ? 'text-yellow-600'
                    : 'text-red-600'
                }`}
              >
                Estado: {reserva.estado}
              </p>

              <button
                onClick={() =>
                  router.push(
                    `/dashboard/crear-evento?reservaId=${reserva.id}&salonNombre=${encodeURIComponent(
                      reserva.salon.nombre
                    )}`
                  )
                }
                className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Crear evento
              </button>

              <button
                onClick={() => setReservaAEliminar(reserva)}
                className="mt-2 w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition"
              >
                Cancelar reserva
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Modal de confirmación */}
      {reservaAEliminar && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg animate-fade-in">
            <h2 className="text-xl font-bold text-red-600 mb-4 text-center">
              ¿Cancelar esta reserva?
            </h2>
            <p className="text-sm text-gray-700 mb-4 text-center">
              Salón: <strong>{reservaAEliminar.salon.nombre}</strong>
              <br />
              Fecha: {reservaAEliminar.fecha} — Hora: {reservaAEliminar.hora}
            </p>
            <div className="flex justify-between">
              <button
                onClick={() => setReservaAEliminar(null)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
              >
                No, volver
              </button>
              <button
                onClick={confirmarCancelacion}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
              >
                Sí, cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

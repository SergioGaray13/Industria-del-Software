//src\app\dashboard\eventos\page.tsx
'use client';

import { useEffect, useState } from 'react';
import LiveChat from '@/components/eventos/LiveChat';
import { supabase } from '@/lib/supabase';

export default function EventosPage() {
  const [eventos, setEventos] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from('users')
        .select('first_name, last_name')
        .eq('id', user.id)
        .single();

      setCurrentUser({
        id: user.id,
        first_name: profile?.first_name || '',
        last_name: profile?.last_name || '',
      });

      // Aquí buscamos los eventos que el usuario creó (user_id)
      const { data: misEventos, error } = await supabase
        .from('events')
        .select('*')
        .eq('user_id', user.id)
        .order('start_date', { ascending: false });

      if (error) {
        console.error('Error al cargar eventos:', error);
      } else {
        setEventos(misEventos || []);
      }
    };

    fetchData();
  }, []);

  // Simula que un evento fue creado para mostrar el modal (puedes dispararlo en el submit de tu formulario)
  const onEventoCreado = () => {
    setModalVisible(true);
    setTimeout(() => setModalVisible(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 to-orange-200 p-4">
      <div className="p-6 max-w-4xl mx-auto bg-white rounded shadow">
        <h1 className="text-2xl font-bold mb-4 text-orange-700">Mis Eventos</h1>

        {modalVisible && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow-lg text-center max-w-sm">
              <h2 className="text-xl font-bold mb-2">✅ Evento creado correctamente</h2>
              <button
                onClick={() => setModalVisible(false)}
                className="mt-2 px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
              >
                Cerrar
              </button>
            </div>
          </div>
        )}

        {eventos.length === 0 ? (
          <p className="text-center text-gray-500">No tienes eventos creados.</p>
        ) : (
          eventos.map(evento => (
            <div key={evento.id} className="border p-4 rounded mb-6">
              <p><strong>{evento.title}</strong></p>
              <p>
                {evento.start_date} {evento.start_time ? `- ${evento.start_time}` : ''} <br />
                {evento.location}
              </p>
              <p className="text-sm text-gray-500 mb-4">{evento.notes}</p>

              {/* Chat solo si quieres */}
              {currentUser && (
                <LiveChat
                  eventId={evento.id}
                  currentUser={currentUser}
                />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

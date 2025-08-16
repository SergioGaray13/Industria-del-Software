//src\app\dashboard\eventos\page.tsx
'use client';

import { useEffect, useState } from 'react';
import LiveChat from '@/components/eventos/LiveChat';
import { supabase } from '@/lib/supabase';

interface Booking {
  id: string;
  status: 'pendiente' | 'confirmado' | 'cancelado';
}

interface Lugar {
  nombre: string;
}

interface Salon {
  nombre: string;
}

interface Evento {
  id: string;
  title: string;
  start_date: string;
  end_date?: string;
  start_time?: string;
  location?: string;
  notes?: string;
  booking?: Booking[];
  lugar?: Lugar;
  salon?: Salon;
  messageCount?: number;
  hasUnreadMessages?: boolean;
  lastMessageTime?: string;
  lastMessageContent?: string;
  status?: 'pendiente' | 'confirmado' | 'cancelado' | string;
  lugar_nombre?: string;
  salon_nombre?: string;
}

export default function EventosPage() {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [chatVisible, setChatVisible] = useState<string | null>(null);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [view, setView] = useState<'mis-eventos' | 'solicitudes'>('mis-eventos');

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoadingEvents(false);
        return;
      }

      const { data: profile } = await supabase
        .from('users')
        .select('first_name, last_name, role')
        .eq('id', user.id)
        .single();

      setCurrentUser({
        id: user.id,
        first_name: profile?.first_name || '',
        last_name: profile?.last_name || '',
        role: profile?.role || 'usuario',
      });
    };

    fetchUser();
  }, []);

  useEffect(() => {
    if (!currentUser) return;

    const fetchData = async () => {
      setLoadingEvents(true);

      let eventosCargados: Evento[] = [];

      if (view === 'solicitudes' && currentUser.role === 'proveedor') {
        try {
          const { data: providerData, error: providerError } = await supabase
            .from('providers')
            .select('id')
            .eq('user_id', currentUser.id)
            .single();

          if (providerError) {
            console.error('Error al obtener provider:', providerError);
            setEventos([]);
            setLoadingEvents(false);
            return;
          }

          if (!providerData) {
            console.error('No se encontró provider para el usuario');
            setEventos([]);
            setLoadingEvents(false);
            return;
          }

          const { data: bookings, error: bookingsError } = await supabase
            .from('bookings')
            .select(`
              id,
              status,
              event_id
            `)
            .eq('provider_id', providerData.id)
            .order('created_at', { ascending: false });

          if (bookingsError) {
            console.error('Error al cargar bookings:', bookingsError);
            setEventos([]);
            setLoadingEvents(false);
            return;
          }

          if (bookings && bookings.length > 0) {
            const eventPromises = bookings.map(async (booking): Promise<Evento | null> => {
              const { data: evento, error: eventoError } = await supabase
                .from('events')
                .select(`
                  id,
                  title,
                  start_date,
                  end_date,
                  notes,
                  location_id,
                  salon_id
                `)
                .eq('id', booking.event_id)
                .single();

              if (eventoError || !evento) {
                console.error('Error al obtener evento:', eventoError);
                return null;
              }

              let lugar_nombre = 'No especificado';
              if (evento.location_id) {
                const { data: lugar } = await supabase
                  .from('lugares')
                  .select('nombre')
                  .eq('id', evento.location_id)
                  .single();
                lugar_nombre = lugar?.nombre || 'No especificado';
              }

              let salon_nombre = 'No especificado';
              if (evento.salon_id) {
                const { data: salon } = await supabase
                  .from('salones')
                  .select('nombre')
                  .eq('id', evento.salon_id)
                  .single();
                salon_nombre = salon?.nombre || 'No especificado';
              }

              return {
                id: evento.id,
                title: evento.title,
                start_date: evento.start_date,
                end_date: evento.end_date,
                notes: evento.notes,
                lugar_nombre,
                salon_nombre,
                status: booking.status,
              };
            });

            const eventosResueltos = await Promise.all(eventPromises);
            eventosCargados = eventosResueltos.filter((evento): evento is Evento => evento !== null);

          }

        } catch (error) {
          console.error('Error general en solicitudes:', error);
        }
      } else {
        try {
          const { data: misEventos, error } = await supabase
            .from('events')
            .select(`
              *,
              bookings(status)
            `)
            .eq('user_id', currentUser.id)
            .order('start_date', { ascending: false });

          if (error) {
            console.error('Error al cargar mis eventos:', error);
          } else if (misEventos) {
            eventosCargados = await Promise.all(
              misEventos.map(async (evento: any): Promise<Evento> => {
                let lugar_nombre = 'No especificado';
                if (evento.location_id) {
                  const { data: lugar } = await supabase
                    .from('lugares')
                    .select('nombre')
                    .eq('id', evento.location_id)
                    .single();
                  lugar_nombre = lugar?.nombre || 'No especificado';
                }

                let salon_nombre = 'No especificado';
                if (evento.salon_id) {
                  const { data: salon } = await supabase
                    .from('salones')
                    .select('nombre')
                    .eq('id', evento.salon_id)
                    .single();
                  salon_nombre = salon?.nombre || 'No especificado';
                }

                const { count: totalMessages } = await supabase
                  .from('messages')
                  .select('*', { count: 'exact', head: true })
                  .eq('event_id', evento.id);

                const { data: lastMessage } = await supabase
                  .from('messages')
                  .select('created_at, content, user_id')
                  .eq('event_id', evento.id)
                  .order('created_at', { ascending: false })
                  .limit(1)
                  .single();

                const { count: unreadCount } = await supabase
                  .from('messages')
                  .select('*', { count: 'exact', head: true })
                  .eq('event_id', evento.id)
                  .neq('user_id', currentUser.id)
                  .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

                const bookingStatus = (evento.bookings && evento.bookings.length > 0)
                  ? evento.bookings[0].status
                  : 'pendiente';

                return {
                  ...evento,
                  status: bookingStatus,
                  lugar_nombre,
                  salon_nombre,
                  messageCount: totalMessages || 0,
                  hasUnreadMessages: (unreadCount || 0) > 0,
                  lastMessageTime: lastMessage?.created_at,
                  lastMessageContent: lastMessage?.content,
                };
              })
            );
          }
        } catch (error) {
          console.error('Error general en mis eventos:', error);
        }
      }

      setEventos(eventosCargados);
      setLoadingEvents(false);
    };

    fetchData();
  }, [view, currentUser]);
  useEffect(() => {
    if (!currentUser) return;

    const subscription = supabase
      .channel('messages-changes')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        (payload) => {
          console.log('🔥 Nuevo mensaje:', payload);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [currentUser]);

  const toggleChat = (eventoId: string) => {
    setChatVisible(chatVisible === eventoId ? null : eventoId);
  };

  const getChatIndicator = (evento: Evento) => {
    if (!evento.messageCount || evento.messageCount === 0) {
      return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-600">💬 Sin mensajes</span>;
    }
    if (evento.hasUnreadMessages) {
      return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-red-100 text-red-600 animate-pulse">💬 {evento.messageCount} mensajes • Nuevos</span>;
    }
    return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-600">💬 {evento.messageCount} mensajes</span>;
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'Sin fecha';
    return new Date(dateStr).toLocaleDateString();
  };

  const eventosFiltrados =
    view === 'mis-eventos'
      ? eventos.filter(e => e.status !== 'pendiente')
      : eventos.filter(e => e.status === 'pendiente');

  if (loadingEvents) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-100 to-orange-200">
        <div className="text-lg text-gray-600 animate-pulse">Cargando eventos...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 to-orange-200 p-4">
      <div className="p-6 max-w-4xl mx-auto bg-white rounded shadow">
        <h1 className="text-2xl font-bold mb-4 text-orange-700">Gestión de Eventos</h1>

        {/* Botones para alternar vista */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setView('mis-eventos')}
            className={`px-4 py-2 rounded ${
              view === 'mis-eventos'
                ? 'bg-orange-500 text-white'
                : 'bg-gray-200 text-gray-800'
            }`}
          >
            Mis eventos
          </button>
          <button
            onClick={() => setView('solicitudes')}
            className={`px-4 py-2 rounded ${
              view === 'solicitudes'
                ? 'bg-orange-500 text-white'
                : 'bg-gray-200 text-gray-800'
            }`}
          >
            Solicitudes
          </button>
        </div>

        {eventosFiltrados.length === 0 ? (
          <p className="text-center text-gray-500">No hay eventos en esta sección.</p>
        ) : (
          eventosFiltrados.map(evento => (
            <div key={evento.id} className="border p-4 rounded mb-6 bg-gray-50">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <p className="text-lg font-semibold">{evento.title}</p>
                  <p className="text-sm text-gray-700 mt-1">
                    <strong>Lugar:</strong> {evento.lugar_nombre} <br />
                    <strong>Salón:</strong> {evento.salon_nombre}
                  </p>
                  <p className="text-sm text-gray-700 mt-1">
                    <strong>Fecha inicio:</strong> {formatDate(evento.start_date)} <br />
                    <strong>Fecha final:</strong> {formatDate(evento.end_date)}
                  </p>
                  <p className="mt-1 text-sm">
                    Estado:{' '}
                    <span
                      className={`font-semibold ${
                        evento.status === 'pendiente'
                          ? 'text-yellow-600'
                          : evento.status === 'confirmado'
                          ? 'text-green-600'
                          : 'text-red-600'
                      }`}
                    >
                      {evento.status}
                    </span>
                  </p>
                  {evento.notes && <p className="text-sm text-gray-500 mt-2">{evento.notes}</p>}
                </div>
                <div className="flex flex-col items-end space-y-2">
                  {getChatIndicator(evento)}
                  {evento.lastMessageTime && (
                    <p className="text-xs text-gray-400">
                      Último mensaje: {new Date(evento.lastMessageTime).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex justify-between items-center">
                <button
                  onClick={() => toggleChat(evento.id)}
                  className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                    chatVisible === evento.id
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {chatVisible === evento.id ? 'Cerrar Chat' : 'Abrir Chat'}
                </button>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-xs text-gray-500">Chat en vivo</span>
                </div>
              </div>
              {chatVisible === evento.id && currentUser && (
                <div className="mt-4 border-t pt-4">
                  <LiveChat eventId={evento.id} currentUser={currentUser} />
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

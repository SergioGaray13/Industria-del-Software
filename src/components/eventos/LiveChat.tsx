'use client';

import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';

interface Message {
  id: string;
  event_id: string;
  user_id: string;
  content: string;
  created_at: string;
  first_name?: string;
  last_name?: string;
}

interface CurrentUser {
  id: string;
  first_name: string;
  last_name: string;
}

interface LiveChatProps {
  eventId: string;
  currentUser: CurrentUser;
}

export default function LiveChat({ eventId, currentUser }: LiveChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const { data: messagesData, error: messagesError } = await supabase
          .from('messages')
          .select('*')
          .eq('event_id', eventId)
          .order('created_at', { ascending: true });

        if (messagesError) {
          setMessages([]);
          return;
        }

        if (messagesData && messagesData.length > 0) {
          const userIds = [...new Set(messagesData.map(m => m.user_id))];

          const { data: usersData } = await supabase
            .from('users')
            .select('id, first_name, last_name')
            .in('id', userIds);

          const mapped = messagesData.map((message: any) => {
            const user = usersData?.find(u => u.id === message.user_id);
            return {
              id: message.id,
              event_id: message.event_id,
              user_id: message.user_id,
              content: message.content,
              created_at: message.created_at,
              first_name: user?.first_name || 'Usuario',
              last_name: user?.last_name || 'Desconocido',
            };
          });

          setMessages(mapped);
          setTimeout(scrollToBottom, 100);
        } else {
          setMessages([]);
        }
      } catch {
        setMessages([]);
      } finally {
        setLoading(false);
      }
    };

    loadMessages();

    const channel = supabase
      .channel(`chat-${eventId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `event_id=eq.${eventId}` },
        async (payload) => {
          let newMsg = payload.new as Message;

          const { data: userProfile } = await supabase
            .from('users')
            .select('first_name, last_name')
            .eq('id', newMsg.user_id)
            .single();

          if (userProfile) {
            newMsg.first_name = userProfile.first_name || 'Usuario';
            newMsg.last_name = userProfile.last_name || 'Desconocido';
          }

          setMessages((prev) => {
            const isDuplicate = prev.some(msg =>
              msg.id === newMsg.id ||
              (msg.content === newMsg.content &&
                msg.user_id === newMsg.user_id &&
                Math.abs(new Date(msg.created_at).getTime() - new Date(newMsg.created_at).getTime()) < 5000)
            );

            if (isDuplicate) return prev;

            if (newMsg.user_id === currentUser.id) {
              const withoutTemp = prev.filter(msg => !msg.id.startsWith('temp-'));
              return [...withoutTemp, newMsg];
            }

            return [...prev, newMsg];
          });

          setTimeout(scrollToBottom, 100);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [eventId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const messageContent = input.trim();
    const tempId = `temp-${Date.now()}`;

    const tempMessage: Message = {
      id: tempId,
      event_id: eventId,
      user_id: currentUser.id,
      content: messageContent,
      created_at: new Date().toISOString(),
      first_name: currentUser.first_name,
      last_name: currentUser.last_name,
    };

    setMessages(prev => [...prev, tempMessage]);
    setInput('');
    setTimeout(scrollToBottom, 100);

    try {
      const { data, error } = await supabase
        .from('messages')
        .insert([{ event_id: eventId, user_id: currentUser.id, content: messageContent }])
        .select();

      if (error) {
        setMessages(prev => prev.filter(msg => msg.id !== tempId));
        setInput(messageContent);
        return;
      }

      if (data && data[0]) {
        const realMessage: Message = {
          ...data[0],
          first_name: currentUser.first_name,
          last_name: currentUser.last_name,
        };

        setMessages(prev =>
          prev.map(msg => (msg.id === tempId ? realMessage : msg))
        );
      }
    } catch {
      setMessages(prev => prev.filter(msg => msg.id !== tempId));
      setInput(messageContent);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col border rounded-lg h-[400px] bg-white shadow-sm">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-gray-500">Cargando mensajes...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col border rounded-lg h-[400px] bg-white shadow-sm">
      {/* Header del chat */}
      <div className="border-b p-3 bg-gray-50 rounded-t-lg">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-gray-700">Chat del Evento</h3>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-xs text-gray-500">{messages.length} mensajes</span>
          </div>
        </div>
      </div>

      {/* Lista de mensajes */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <p className="mb-2">💬</p>
              <p>No hay mensajes aún</p>
              <p className="text-sm">¡Sé el primero en escribir!</p>
            </div>
          </div>
        ) : (
          messages.map((msg) => {
            const isOwn = msg.user_id === currentUser.id;
            const userName = `${msg.first_name} ${msg.last_name}`.trim();
            const messageTime = new Date(msg.created_at).toLocaleTimeString('es-ES', {
              hour: '2-digit',
              minute: '2-digit'
            });

            return (
              <div
                key={msg.id}
                className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    isOwn
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <div className={`text-xs mb-1 ${isOwn ? 'text-orange-100' : 'text-gray-500'}`}>
                    {isOwn ? 'Tú' : userName} • {messageTime}
                  </div>
                  <div className="text-sm leading-relaxed">{msg.content}</div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input para nuevo mensaje */}
      <div className="border-t bg-white rounded-b-lg">
        <div className="flex p-3 space-x-2">
          <input
            type="text"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
            placeholder="Escribe un mensaje..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            maxLength={500}
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim()}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              input.trim()
                ? 'bg-orange-500 text-white hover:bg-orange-600'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Enviar
          </button>
        </div>
        <div className="px-3 pb-2">
          <p className="text-xs text-gray-400">
            Presiona Enter para enviar • {input.length}/500
          </p>
        </div>
      </div>
    </div>
  );
}

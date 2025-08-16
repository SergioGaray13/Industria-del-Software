'use client';

import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export type Notification = {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  related_id: string | null;
  related_type: string | null;
  is_read: boolean;
  created_at: string;
};

export default function NotificationsDropdown() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchNotifications = async () => {
      const session = await supabase.auth.getSession();
      const userId = session.data.session?.user.id;
      if (!userId) return;

      const { data } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .eq('is_read', false)
        .order('created_at', { ascending: false });
      setNotifications(data || []);
    };

    fetchNotifications();

    const channel = supabase
      .channel('notifications-channel')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'notifications' },
        async (payload) => {
          const session = await supabase.auth.getSession();
          const userId = session.data.session?.user.id;
          const newNotification = payload.new as Notification;
          if (newNotification.user_id === userId) {
            setNotifications((prev) => [newNotification, ...prev]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]);

  const markAsRead = async (id: string) => {
    await supabase
      .from('notifications')
      .update({ is_read: true, updated_at: new Date().toISOString() })
      .eq('id', id);
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const goToRelated = (related_type: string | null, related_id: string | null) => {
    if (!related_id) return;
    if (related_type === 'event') {
      router.push(`/dashboard/eventos/${related_id}`);
      setMenuOpen(false);
    }
  };

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button
        className="relative"
        onClick={() => setMenuOpen((open) => !open)}
        aria-haspopup="true"
        aria-expanded={menuOpen}
        aria-label="Abrir notificaciones"
      >
        <Image src="/notifications2.webp" alt="Notificaciones" title="Notificaciones" width={28} height={28} />
        {notifications.length > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {notifications.length}
          </span>
        )}
      </button>

      {menuOpen && (
        <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-auto bg-white rounded-md shadow-lg border border-gray-200 z-50">
          <h3 className="px-4 py-2 font-semibold border-b border-gray-200 text-gray-700">
            Notificaciones
          </h3>
          {notifications.length === 0 ? (
            <p className="p-4 text-center text-gray-500">No tienes notificaciones pendientes.</p>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                className="px-4 py-3 border-b border-gray-100 hover:bg-orange-50 cursor-pointer flex flex-col"
              >
                <div
                  className="font-semibold text-orange-600"
                  onClick={() => goToRelated(notif.related_type, notif.related_id)}
                >
                  {notif.title}
                </div>
                <div className="text-xs text-gray-600 mb-2">{notif.message}</div>
                <div className="flex justify-end">
                  <button
                    onClick={() => markAsRead(notif.id)}
                    className="text-sm text-blue-600 hover:underline focus:outline-none"
                  >
                    Marcar como leído
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

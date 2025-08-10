'use client';
import { createBooking } from '@/services/bookingService';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface ProviderCardProps {
  provider: {
    id: string;
    name: string;
    category: string;
    location: string;
  };
  eventId: string; // ID del evento actual
}

export default function ProviderCard({ provider, eventId }: ProviderCardProps) {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUserId(data?.user?.id || null);
    };
    getUser();
  }, []);

  const handleBooking = async () => {
    if (!userId) return alert('Debes iniciar sesión');
    const { error } = await createBooking(userId, provider.id, eventId);
    if (error) alert('Error al reservar');
    else alert('Reserva realizada con éxito');
  };

  return (
    <div className="border p-4 rounded shadow">
      <h2 className="text-lg font-semibold">{provider.name}</h2>
      <p>{provider.category} - {provider.location}</p>
      <button
        onClick={handleBooking}
        className="mt-2 bg-blue-600 text-white px-4 py-2 rounded"
      >
        Reservar
      </button>
    </div>
  );
}

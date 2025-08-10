import { supabase } from '@/lib/supabase';

export const createBooking = async (userId: string, providerId: string, eventId: string) => {
  const { data, error } = await supabase.from('bookings').insert([
    {
      user_id: userId,
      provider_id: providerId,
      event_id: eventId,
    },
  ]);
  return { data, error };
};

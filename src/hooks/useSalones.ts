// hooks/useSalones.ts
import { useState, useEffect } from 'react';
import { Salon, FormSalon } from '@/types/salon';
import { SalonService } from '@/services/salonService';

export const useSalones = () => {
  const [salones, setSalones] = useState<Salon[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSalones = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await SalonService.fetchSalones();
      setSalones(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const crearSalon = async (formSalon: FormSalon) => {
    try {
      await SalonService.crearSalon(formSalon);
      await fetchSalones(); // Refrescar la lista
    } catch (err: any) {
      throw new Error(err.message);
    }
  };

  const actualizarSalon = async (formSalon: FormSalon) => {
    try {
      await SalonService.actualizarSalon(formSalon);
      await fetchSalones(); // Refrescar la lista
    } catch (err: any) {
      throw new Error(err.message);
    }
  };

  const eliminarSalon = async (salonId: string) => {
    try {
      await SalonService.eliminarSalon(salonId);
      await fetchSalones(); // Refrescar la lista
    } catch (err: any) {
      throw new Error(err.message);
    }
  };

  const crearReserva = async (salonId: string, fecha: string, hora: string) => {
    try {
      await SalonService.crearReserva(salonId, fecha, hora);
    } catch (err: any) {
      throw new Error(err.message);
    }
  };

  useEffect(() => {
    fetchSalones();
  }, []);

  return {
    salones,
    loading,
    error,
    fetchSalones,
    crearSalon,
    actualizarSalon,
    eliminarSalon,
    crearReserva,
  };
};
import { Salon } from '@/types/mapa';
import { Camera, Music, Zap, Wifi, Globe, MapPin } from 'lucide-react';

export const obtenerColorSalon = (salon: Salon): string => {
  switch (salon.estado) {
    case 'disponible': return '#10b981';
    case 'ocupado': return '#f59e0b';
    case 'reservado': return '#8b5cf6';
    case 'mantenimiento': return '#ef4444';
    default: return '#6b7280';
  }
};

export const calcularEstadisticas = (salones: Salon[]) => ({
  total: salones.length,
  disponibles: salones.filter(s => s.estado === 'disponible').length,
  ocupados: salones.filter(s => s.estado === 'ocupado').length,
  reservados: salones.filter(s => s.estado === 'reservado').length,
  capacidadTotal: salones.reduce((sum, s) => sum + s.capacidad, 0)
});

export const obtenerIconoEquipamiento = (equipo: string) => {
  const equipoLower = equipo.toLowerCase();
  if (equipoLower.includes('proyector')) return <Camera size={14} />;
  if (equipoLower.includes('sonido') || equipoLower.includes('micrófono')) return <Music size={14} />;
  if (equipoLower.includes('aire') || equipoLower.includes('clima')) return <Zap size={14} />;
  if (equipoLower.includes('wifi') || equipoLower.includes('internet')) return <Wifi size={14} />;
  if (equipoLower.includes('streaming')) return <Globe size={14} />;
  if (equipoLower.includes('iluminación')) return <Zap size={14} />;
  return <MapPin size={14} />;
};
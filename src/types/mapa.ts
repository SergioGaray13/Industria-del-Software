export interface Lugar {
  id: string;
  nombre: string;
  direccion: string;
  descripcion: string;
  ciudad: string;
  municipio: string;
  departamento: string;
  pais: string;
  imagen: string;
  sitio_web?: string;
  created_at?: string;
}

export interface Salon {
  id: string;
  nombre: string;
  ubicacion: string;
  capacidad: number;
  equipamiento: string[];
  responsable: string;
  descripcion: string;
  sesiones?: { hora: string; tema: string }[] | null;
  url_imagen: string;
  lugar_id?: string | null;
  coordenada_x?: number | null;
  coordenada_y?: number | null;
  ancho?: number | null;
  alto?: number | null;
  estado?: 'disponible' | 'ocupado' | 'reservado' | 'mantenimiento' | null;
  created_at?: string;
}

export type VistaActual = 'lugares' | 'planta';
export type EstadoFiltro = 'todos' | 'disponible' | 'ocupado' | 'reservado';
// types/salon.types.ts
export interface Salon {
  id: string;
  nombre: string;
  ubicacion: string;
  capacidad: number;
  equipamiento: string[];
  responsable: string;
  descripcion: string;
  sesiones: { hora: string; tema: string }[];
  url_imagen?: string | null;
}

export interface FormSalon {
  id?: string;
  nombre: string;
  ubicacion: string;
  capacidad: number | '';
  equipamiento: string;
  responsable: string;
  descripcion: string;
  imagen: File | null;
}
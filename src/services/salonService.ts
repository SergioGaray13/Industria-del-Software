// src\services\salonService.ts
import { supabase } from '@/lib/supabase';
import { Salon, FormSalon } from '@/types/salon';

export class SalonService {
  static async subirImagen(file: File): Promise<string> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;
    const filePath = `salones/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('salones')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from('salones').getPublicUrl(filePath);
    return data.publicUrl;
  }

  static async fetchSalones(): Promise<Salon[]> {
    const { data, error } = await supabase
      .from('salones')
      .select(`
        *,
        salon_sesiones (
          id,
          hora,
          tema
        )
      `);
  
    if (error) throw error;
  
    const salonesConSesiones = data?.map((salon) => ({
      ...salon,
      sesiones: salon.salon_sesiones ?? [],
    })) ?? [];
  
    return salonesConSesiones;
  }
  

  static async crearSalon(formSalon: FormSalon): Promise<void> {
    let urlImagen = null;
    if (formSalon.imagen) {
      urlImagen = await this.subirImagen(formSalon.imagen);
    }

    const { error } = await supabase.from('salones').insert([
      {
        nombre: formSalon.nombre,
        ubicacion: formSalon.ubicacion,
        capacidad: Number(formSalon.capacidad) || 0,
        equipamiento: formSalon.equipamiento
          ? formSalon.equipamiento.split(',').map((e) => e.trim())
          : [],
        responsable: formSalon.responsable,
        descripcion: formSalon.descripcion,
        url_imagen: urlImagen,
      },
    ]);

    if (error) throw error;
  }

  static async actualizarSalon(formSalon: FormSalon): Promise<void> {
    if (!formSalon.id) throw new Error('ID de salón requerido para actualizar');

    let urlImagen = null;
    if (formSalon.imagen) {
      urlImagen = await this.subirImagen(formSalon.imagen);
    }

    const updateData: any = {
      nombre: formSalon.nombre,
      ubicacion: formSalon.ubicacion,
      capacidad: Number(formSalon.capacidad) || 0,
      equipamiento: formSalon.equipamiento
        ? formSalon.equipamiento.split(',').map((e) => e.trim())
        : [],
      responsable: formSalon.responsable,
      descripcion: formSalon.descripcion,
    };

    if (urlImagen) updateData.url_imagen = urlImagen;

    const { error } = await supabase
      .from('salones')
      .update(updateData)
      .eq('id', formSalon.id);

    if (error) throw error;
  }

  static async eliminarSalon(salonId: string): Promise<void> {
    const { error } = await supabase.from('salones').delete().eq('id', salonId);
    if (error) throw error;
  }

  static async crearReserva(
    salonId: string,
    fecha: string,
    hora: string
  ): Promise<void> {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) throw new Error('Usuario no autenticado');

    const { data: existentes } = await supabase
      .from('reservas')
      .select('*')
      .eq('usuario_id', session.user.id)
      .eq('salon_id', salonId)
      .eq('fecha', fecha)
      .eq('hora', hora);

    if (existentes && existentes.length > 0) {
      throw new Error('Ya tienes una reserva para este salón en esa fecha y hora.');
    }

    const { error } = await supabase.from('reservas').insert({
      usuario_id: session.user.id,
      salon_id: salonId,
      fecha,
      hora,
      estado: 'pendiente',
    });

    if (error) throw error;
  }
}

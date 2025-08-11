/*Estructura
src/
├── types/
│   └── salon.ts
├── services/
│   └── salonService.ts
├── components/
│   ├── SalonCard.tsx
│   ├── ModalReservarSalon.tsx
│   ├── ModalSalonForm.tsx
│   └── ModalEliminarSalon.tsx
├── hooks/
│   └── useSalones.ts
└── app/dashboard/salones/
    └── page.tsx*/


// src/app/dashboard/salones/page.tsx (Componente principal refactorizado)
'use client';

import React, { useState } from 'react';
import { SalonCard } from '@/components/salones/SalonCard';
import { ModalReserva } from '@/components/salones/ModalReservarSalon';
import { ModalSalonForm } from '@/components/salones/ModalSalonForm';
import { ModalEliminar } from '@/components/salones/ModalEliminarSalon';
import { useSalones } from '@/hooks/useSalones';
import { Salon, FormSalon } from '@/types/salon';

export default function SalonesPage() {
  const {
    salones,
    loading: salonesLoading,
    crearSalon,
    actualizarSalon,
    eliminarSalon,
    crearReserva,
  } = useSalones();

  // Estados para modal de reserva
  const [selectedSalon, setSelectedSalon] = useState<Salon | null>(null);
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');
  const [mensajeReserva, setMensajeReserva] = useState('');
  const [modalReservarOpen, setModalReservarOpen] = useState(false);

  // Estados para modal de formulario
  const [modalFormOpen, setModalFormOpen] = useState(false);
  const [formSalon, setFormSalon] = useState<FormSalon>({
    nombre: '',
    ubicacion: '',
    capacidad: '',
    equipamiento: '',
    responsable: '',
    descripcion: '',
    imagen: null,
  });
  const [loadingForm, setLoadingForm] = useState(false);
  const [mensajeForm, setMensajeForm] = useState('');

  // Estados para modal de eliminar
  const [modalEliminarOpen, setModalEliminarOpen] = useState(false);
  const [eliminarSalonId, setEliminarSalonId] = useState<string | null>(null);
  const [loadingEliminar, setLoadingEliminar] = useState(false);
  const [mensajeEliminar, setMensajeEliminar] = useState('');

  // Funciones para reserva
  const abrirModalReservar = (salon: Salon) => {
    setSelectedSalon(salon);
    setFecha('');
    setHora('');
    setMensajeReserva('');
    setModalReservarOpen(true);
  };

  const cerrarModalReservar = () => {
    setSelectedSalon(null);
    setFecha('');
    setHora('');
    setMensajeReserva('');
    setModalReservarOpen(false);
  };

  const reservarSalon = async () => {
    if (!selectedSalon) return;

    try {
      await crearReserva(selectedSalon.id, fecha, hora);
      setMensajeReserva('✅ ¡Reserva realizada con éxito!');
      setTimeout(() => cerrarModalReservar(), 2000);
    } catch (error: any) {
      if (error.message.includes('Ya tienes una reserva')) {
        setMensajeReserva('⚠️ ' + error.message);
      } else {
        setMensajeReserva('❌ Error al reservar. Intenta de nuevo.');
      }
    }
  };

  // Funciones para formulario
  const abrirModalAgregar = () => {
    setFormSalon({
      nombre: '',
      ubicacion: '',
      capacidad: '',
      equipamiento: '',
      responsable: '',
      descripcion: '',
      imagen: null,
    });
    setMensajeForm('');
    setModalFormOpen(true);
  };

  const abrirModalEditar = (salon: Salon) => {
    setFormSalon({
      id: salon.id,
      nombre: salon.nombre,
      ubicacion: salon.ubicacion,
      capacidad: salon.capacidad,
      equipamiento: salon.equipamiento?.join(', ') || '',
      responsable: salon.responsable,
      descripcion: salon.descripcion,
      imagen: null,
    });
    setMensajeForm('');
    setModalFormOpen(true);
  };

  const cerrarModalForm = () => {
    setFormSalon({
      nombre: '',
      ubicacion: '',
      capacidad: '',
      equipamiento: '',
      responsable: '',
      descripcion: '',
      imagen: null,
    });
    setMensajeForm('');
    setModalFormOpen(false);
  };

  const handleFormChange = (field: keyof FormSalon, value: any) => {
    setFormSalon((prev) => ({ ...prev, [field]: value }));
  };

  const guardarSalon = async () => {
    if (!formSalon.nombre) {
      setMensajeForm('El nombre es obligatorio');
      return;
    }

    setLoadingForm(true);
    setMensajeForm('');

    try {
      if (formSalon.id) {
        await actualizarSalon(formSalon);
        setMensajeForm('✅ Salón editado con éxito');
      } else {
        await crearSalon(formSalon);
        setMensajeForm('✅ Salón agregado con éxito');
      }
      
      setTimeout(() => cerrarModalForm(), 1500);
    } catch (error: any) {
      setMensajeForm('❌ Error al guardar salón: ' + error.message);
    } finally {
      setLoadingForm(false);
    }
  };

  // Funciones para eliminar
  const abrirModalEliminar = (salonId: string) => {
    setEliminarSalonId(salonId);
    setMensajeEliminar('');
    setModalEliminarOpen(true);
  };

  const cerrarModalEliminar = () => {
    setEliminarSalonId(null);
    setMensajeEliminar('');
    setModalEliminarOpen(false);
  };

  const confirmarEliminarSalon = async () => {
    if (!eliminarSalonId) return;

    setLoadingEliminar(true);
    setMensajeEliminar('');

    try {
      await eliminarSalon(eliminarSalonId);
      setMensajeEliminar('✅ Salón eliminado con éxito');
      setTimeout(() => setModalEliminarOpen(false), 1500);
    } catch (error: any) {
      setMensajeEliminar('❌ Error al eliminar salón: ' + error.message);
    } finally {
      setLoadingEliminar(false);
    }
  };

  return (
    <div className="min-h-screen p-6">
      <div className="mb-6 text-center">
        <button
          onClick={abrirModalAgregar}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          + Agregar nuevo salón
        </button>
      </div>

      {salonesLoading && (
        <div className="text-center">Cargando salones...</div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {salones.map((salon) => (
          <SalonCard
            key={salon.id}
            salon={salon}
            onReservar={abrirModalReservar}
            onEditar={abrirModalEditar}
            onEliminar={abrirModalEliminar}
          />
        ))}
      </div>

      {/* Modales */}
      <ModalReserva
        salon={selectedSalon}
        fecha={fecha}
        hora={hora}
        mensaje={mensajeReserva}
        onFechaChange={setFecha}
        onHoraChange={setHora}
        onConfirmar={reservarSalon}
        onCerrar={cerrarModalReservar}
      />

      {modalFormOpen && (
        <ModalSalonForm
          titulo={formSalon.id ? 'Editar salón' : 'Agregar nuevo salón'}
          form={formSalon}
          loading={loadingForm}
          mensaje={mensajeForm}
          onFormChange={handleFormChange}
          onSubmit={guardarSalon}
          onClose={cerrarModalForm}
        />
      )}

      <ModalEliminar
        isOpen={modalEliminarOpen}
        loading={loadingEliminar}
        mensaje={mensajeEliminar}
        onConfirmar={confirmarEliminarSalon}
        onCerrar={cerrarModalEliminar}
      />
    </div>
  );
}
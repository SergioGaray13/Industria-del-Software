'use client';

import React, { useState, useEffect } from 'react';
import { Provider } from '@/types/providers';

interface ProviderFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Provider, 'id'>, editingId?: string) => Promise<void>;
  editingProvider?: Provider | null;
}

export default function ProviderFormModal({
  isOpen,
  onClose,
  onSubmit,
  editingProvider
}: ProviderFormModalProps) {
  const [form, setForm] = useState<Omit<Provider, 'id'>>({
    name: '',
    category: '',
    rating: null,
    location: '',
    user_id: '',
    email: '',
    phones: '',
    website: '',
    image_url: ''
  });

  useEffect(() => {
    if (editingProvider) {
      setForm({
        name: editingProvider.name || '',
        category: editingProvider.category || '',
        rating: editingProvider.rating,
        location: editingProvider.location || '',
        user_id: editingProvider.user_id || '',
        email: editingProvider.email || '',
        phones: editingProvider.phones || '',
        website: editingProvider.website || '',
        image_url: editingProvider.image_url || ''
      });
    } else {
      setForm({
        name: '',
        category: '',
        rating: null,
        location: '',
        user_id: '',
        email: '',
        phones: '',
        website: '',
        image_url: ''
      });
    }
  }, [editingProvider]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(form, editingProvider?.id);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md w-full max-w-md max-h-[80vh] overflow-y-auto"
      >
        <h2 className="text-lg font-bold text-lime-700 mb-4">
          {editingProvider ? 'Editar proveedor' : 'Nuevo proveedor'}
        </h2>

        <input name="name" value={form.name} onChange={handleChange} placeholder="Nombre" required className="w-full mb-3 p-2 border rounded" />
        <input name="category" value={form.category || ''} onChange={handleChange} placeholder="Categoría" className="w-full mb-3 p-2 border rounded" />
        <input type="number" name="rating" value={form.rating ?? ''} onChange={handleChange} placeholder="Calificación" step="0.1" className="w-full mb-3 p-2 border rounded" />
        <input name="location" value={form.location || ''} onChange={handleChange} placeholder="Ubicación" className="w-full mb-3 p-2 border rounded" />
        <input name="user_id" value={form.user_id || ''} onChange={handleChange} placeholder="User ID" required className="w-full mb-3 p-2 border rounded" />
        <input type="email" name="email" value={form.email || ''} onChange={handleChange} placeholder="Email" className="w-full mb-3 p-2 border rounded" />
        <input name="phones" value={form.phones || ''} onChange={handleChange} placeholder="Teléfonos" className="w-full mb-3 p-2 border rounded" />
        <input name="website" value={form.website || ''} onChange={handleChange} placeholder="Sitio web" className="w-full mb-3 p-2 border rounded" />
        <input name="image_url" value={form.image_url || ''} onChange={handleChange} placeholder="URL de imagen" className="w-full mb-3 p-2 border rounded" />

        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className="bg-gray-300 px-4 py-2 rounded">Cancelar</button>
          <button type="submit" className="bg-lime-600 text-white px-4 py-2 rounded">Guardar</button>
        </div>
      </form>
    </div>
  );
}

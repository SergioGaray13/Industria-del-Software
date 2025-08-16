// src/components/usuarios/UserForm.tsx
'use client';

import { useState, useEffect } from 'react';

import { User } from '@/hooks/useUsers';

interface Props {
  user: User | null;
  onCancel: () => void;
  onSave: (user: Partial<User>) => void;
  actionLoading: boolean;
}

export default function UserForm({ user, onCancel, onSave, actionLoading }: Props) {
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    role: 'usuario' as 'usuario' | 'proveedor' | 'admin',
    is_active: true, // nuevo campo para estado
  });

  useEffect(() => {
    if (user) {
      setForm({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        role: user.role || 'usuario',
        is_active: user.is_active ?? true,
      });
    } else {
      setForm({ first_name: '', last_name: '', role: 'usuario', is_active: true });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type, checked } = target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.first_name.trim() || !form.last_name.trim()) {
      alert('Ingresa nombre y apellido.');
      return;
    }
    onSave({ ...user, ...form });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border-l-4 border-orange-500">
      <form onSubmit={handleSubmit}>
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          {user ? 'Editar Usuario' : 'Agregar Usuario'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nombre *</label>
            <input
              name="first_name"
              value={form.first_name}
              onChange={handleChange}
              disabled={actionLoading}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Apellido *</label>
            <input
              name="last_name"
              value={form.last_name}
              onChange={handleChange}
              disabled={actionLoading}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Rol *</label>
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            disabled={actionLoading}
            className="w-full px-3 py-2 border rounded-lg"
          >
            <option value="usuario">Usuario</option>
            <option value="proveedor">Proveedor</option>
            <option value="admin">Administrador</option>
          </select>
        </div>
        {/* NUEVO: Toggle para activar/desactivar usuario */}
        <div className="mb-4 flex items-center gap-2">
          <input
            type="checkbox"
            name="is_active"
            checked={form.is_active}
            onChange={handleChange}
            disabled={actionLoading}
            id="is_active_toggle"
            className="h-5 w-5"
          />
          <label htmlFor="is_active_toggle" className="text-sm font-medium">Usuario activo</label>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={actionLoading}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Guardar
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={actionLoading}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

//Hook de usuarios
'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export interface User {
  id: string;
  first_name: string;
  last_name: string;
  role: 'usuario' | 'proveedor' | 'admin';
  created_at: string;
}

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Cargar usuarios
  useEffect(() => {
    (async () => {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('id, first_name, last_name, role, created_at');

        if (error) throw error;
        setUsers(data || []);
      } catch (err: any) {
        setError(err.message ?? 'Error inesperado');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Guardar usuario (crear o actualizar)
  async function saveUser(user: Partial<User>) {
    setActionLoading(true);
    try {
      if (user.id) {
        const { error } = await supabase.from('users').update(user).eq('id', user.id);
        if (error) throw error;
        setUsers(prev => prev.map(u => (u.id === user.id ? { ...u, ...user } : u)) as User[]);
      } else {
        alert('La creación de usuarios debe hacerse desde un backend seguro.');
      }
    } catch (err: any) {
      alert('Error: ' + err.message);
    } finally {
      setActionLoading(false);
    }
  }

  // Eliminar usuario
  async function deleteUser(id: string, name: string) {
    if (!confirm(`¿Seguro que quieres eliminar a ${name}?`)) return;
    setActionLoading(true);
    try {
      const { error } = await supabase.from('users').delete().eq('id', id);
      if (error) throw error;
      setUsers(prev => prev.filter(u => u.id !== id));
    } catch (err: any) {
      alert('Error: ' + err.message);
    } finally {
      setActionLoading(false);
    }
  }

  return {
    users,
    loading,
    error,
    actionLoading,
    saveUser,
    deleteUser
  };
}

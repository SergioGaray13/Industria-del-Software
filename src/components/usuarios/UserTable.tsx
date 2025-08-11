// src/components/usuarios/UserTable.tsx
'use client';

import React, { useMemo, useState } from 'react';
import { User } from '@/hooks/useUsers';

type SortField = 'first_name' | 'last_name' | 'role' | 'created_at';
type SortDirection = 'asc' | 'desc';

interface Props {
  users: User[];
  searchTerm: string;
  onEdit: (u: User) => void;
  onDelete: (id: string, name: string) => void;
  actionLoading: boolean;
  toggleActive: (user: User, newState: boolean) => void;
}

export default function UserTable({ users, searchTerm, onEdit, onDelete, actionLoading, toggleActive }: Props) {
  const [sortField, setSortField] = useState<SortField>('created_at');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const filteredUsers = useMemo(() => {
    return [...users]
      .filter(u =>
        `${u.first_name} ${u.last_name} ${u.role}`.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        const valA = sortField === 'created_at'
          ? new Date(a[sortField]).getTime()
          : (a[sortField] || '').toString().toLowerCase();
        const valB = sortField === 'created_at'
          ? new Date(b[sortField]).getTime()
          : (b[sortField] || '').toString().toLowerCase();
        return sortDirection === 'asc'
          ? valA > valB ? 1 : -1
          : valA < valB ? 1 : -1;
      });
  }, [users, searchTerm, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(d => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th onClick={() => handleSort('first_name')} className="px-6 py-3 cursor-pointer">Nombre</th>
            <th onClick={() => handleSort('last_name')} className="px-6 py-3 cursor-pointer">Apellido</th>
            <th onClick={() => handleSort('role')} className="px-6 py-3 cursor-pointer">Rol</th>
            <th className="px-6 py-3">Activo</th>
            <th onClick={() => handleSort('created_at')} className="px-6 py-3 cursor-pointer">Fecha</th>
            <th className="px-6 py-3">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.length > 0 ? filteredUsers.map(u => (
            <tr key={u.id} className="border-b">
              <td className="px-6 py-3">{u.first_name}</td>
              <td className="px-6 py-3">{u.last_name}</td>
              <td className="px-6 py-3">{u.role}</td>
              <td className="px-6 py-3 text-center">
                <label className="inline-flex relative items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={u.is_active}
                    disabled={actionLoading}
                    onChange={() => toggleActive(u, !u.is_active)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-orange-600
                    peer-focus:ring-4 peer-focus:ring-orange-300 dark:peer-focus:ring-orange-800
                    transition-colors"></div>
                  <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full
                    shadow transform peer-checked:translate-x-5 transition-transform"></div>
                </label>
              </td>
              <td className="px-6 py-3">{new Date(u.created_at).toLocaleDateString()}</td>
              <td className="px-6 py-3 flex gap-2">
                <button onClick={() => onEdit(u)} disabled={actionLoading} className="bg-yellow-500 text-white px-3 py-1 rounded">Editar</button>
                <button onClick={() => onDelete(u.id, `${u.first_name} ${u.last_name}`)} disabled={actionLoading} className="bg-red-600 text-white px-3 py-1 rounded">Eliminar</button>
              </td>
            </tr>
          )) : (
            <tr>
              <td colSpan={6} className="text-center py-6">No hay usuarios</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

// src/app/dashboard/usuarios/page.tsx
'use client';

import { useState } from 'react';
import { useUsers, User } from '@/hooks/useUsers';
import UserForm from '@/components/usuarios/UserForm';
import UserSearchBar from '@/components/usuarios/UserSearchBar';
import UserTable from '@/components/usuarios/UserTable';

export default function UsuariosPage() {
  const { users, loading, error, actionLoading, saveUser, deleteUser, toggleActive } = useUsers();
  const [searchTerm, setSearchTerm] = useState('');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  if (loading) return <p className="text-orange-700">Cargando...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="space-y-6">
      <UserSearchBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onAdd={() => {
          setIsAdding(true);
          setEditingUser(null);
        }}
      />

      {(isAdding || editingUser) && (
        <UserForm
          user={editingUser}
          onCancel={() => {
            setIsAdding(false);
            setEditingUser(null);
          }}
          onSave={saveUser}
          actionLoading={actionLoading}
        />
      )}

      <UserTable
        users={users}
        searchTerm={searchTerm}
        onEdit={(u) => {
          setEditingUser(u);
          setIsAdding(false);
        }}
        onDelete={deleteUser}
        actionLoading={actionLoading}
        toggleActive={toggleActive} // PASAMOS la función aquí
      />
    </div>
  );
}

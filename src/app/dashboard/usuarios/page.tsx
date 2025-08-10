// src/app/dashboard/usuarios/page.tsx
'use client';

import { useState } from 'react';
import { useUsers, User } from '@/hooks/useUsers';
import UserForm from '@/components/usuarios/UserForm';
import UserSearchBar from '@/components/usuarios/UserSearchBar';
import UserTable from '@/components/usuarios/UserTable';

export default function UsuariosPage() {
  const { users, loading, error, actionLoading, saveUser, deleteUser } = useUsers();
  const [searchTerm, setSearchTerm] = useState('');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  if (loading) return <p className="text-orange-700">Cargando...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="space-y-6">
      {/* Encabezado específico de la página */}
      <div>
        <h1 className="text-3xl font-bold text-orange-600">Usuarios Registrados</h1>
        <p className="text-sm text-gray-500">Gestión de usuarios del sistema</p>
      </div>

      {/* Barra de búsqueda */}
      <UserSearchBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onAdd={() => {
          setIsAdding(true);
          setEditingUser(null);
        }}
      />

      {/* Formulario de creación/edición */}
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

      {/* Tabla de usuarios */}
      <UserTable
        users={users}
        searchTerm={searchTerm}
        onEdit={(u) => {
          setEditingUser(u);
          setIsAdding(false);
        }}
        onDelete={deleteUser}
        actionLoading={actionLoading}
      />
    </div>
  );
}

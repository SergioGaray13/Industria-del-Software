'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import UserList, { User } from '@/components/usuarios/UserList';

type SortField = 'first_name' | 'last_name' | 'role' | 'created_at';
type SortDirection = 'asc' | 'desc';

export default function UsuariosPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [sortField, setSortField] = useState<SortField>('created_at');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Estados para edición y creación
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    role: 'usuario' as 'usuario' | 'proveedor' | 'admin',
  });

  useEffect(() => {
    async function fetchUsers() {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('id, role, created_at, first_name, last_name');

        if (error) {
          console.error('Error cargando usuarios:', error.message);
          setErrorMessage(error.message);
          setUsers([]);
          return;
        }

        setUsers(data as User[] || []);
      } catch (error: any) {
        console.error('Error inesperado:', error.message ?? error);
        setErrorMessage(error.message ?? 'Error inesperado');
        setUsers([]);
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, []);

  // Función para manejar cambios en el formulario
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Función para eliminar usuario
  const handleDelete = async (userId: string, userName: string) => {
    if (!confirm(¿Seguro que quieres eliminar al usuario ${userName}?)) return;
    
    setActionLoading(true);
    const { error } = await supabase.from('users').delete().eq('id', userId);
    
    if (error) {
      alert('Error al eliminar: ' + error.message);
      setActionLoading(false);
      return;
    }
    
    const newUsers = users.filter((u) => u.id !== userId);
    setUsers(newUsers);
    setActionLoading(false);
  };

  // Función para guardar (crear o editar)
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.first_name.trim() || !form.last_name.trim()) {
      alert('Ingresa nombre y apellido.');
      return;
    }

    setActionLoading(true);

    if (editingUser) {
      // Editar usuario existente
      const { error } = await supabase
        .from('users')
        .update({
          first_name: form.first_name.trim(),
          last_name: form.last_name.trim(),
          role: form.role,
        })
        .eq('id', editingUser.id);

      if (error) {
        alert('Error al actualizar: ' + error.message);
        setActionLoading(false);
        return;
      }

      const updatedUsers = users.map((u) =>
        u.id === editingUser.id
          ? { ...u, ...form }
          : u
      );
      setUsers(updatedUsers);
      setEditingUser(null);
    } else {
      // Crear nuevo usuario (mensaje informativo)
      alert('Crear usuario nuevo debe hacerse vía backend seguro.');
      setActionLoading(false);
      setIsAdding(false);
      return;
    }

    setActionLoading(false);
  };

  // Función para cancelar edición/creación
  const handleCancel = () => {
    setEditingUser(null);
    setIsAdding(false);
    setForm({ first_name: '', last_name: '', role: 'usuario' });
  };

  // Efecto para filtrar y ordenar usuarios
  useEffect(() => {
    let result = [...users];

    // Filtrar por término de búsqueda
    if (searchTerm) {
      result = result.filter(
        (user) =>
          user.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.role?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Ordenar
    result.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortField) {
        case 'first_name':
          aValue = a.first_name || '';
          bValue = b.first_name || '';
          break;
        case 'last_name':
          aValue = a.last_name || '';
          bValue = b.last_name || '';
          break;
        case 'role':
          aValue = a.role || '';
          bValue = b.role || '';
          break;
        case 'created_at':
          aValue = new Date(a.created_at || '');
          bValue = new Date(b.created_at || '');
          break;
        default:
          return 0;
      }

      if (sortField === 'created_at') {
        return sortDirection === 'asc' 
          ? aValue.getTime() - bValue.getTime()
          : bValue.getTime() - aValue.getTime();
      } else {
        const comparison = aValue.localeCompare(bValue);
        return sortDirection === 'asc' ? comparison : -comparison;
      }
    });

    setFilteredUsers(result);
  }, [users, sortField, sortDirection, searchTerm]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Si es el mismo campo, cambiar dirección
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Si es un campo diferente, ordenar ascendente por defecto
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return (
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      );
    }
    
    return sortDirection === 'asc' ? (
      <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
      </svg>
    ) : (
      <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg">
          <p className="text-center text-orange-600 font-semibold">Cargando usuarios...</p>
        </div>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
          <h2 className="text-xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-red-600 mb-4">
            Error al cargar usuarios: {errorMessage}
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded transition duration-200"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Encabezado con el mismo estilo del dashboard */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-orange-600 mb-2">
            Usuarios registrados
          </h1>
          <p className="text-gray-500">
            Gestiona los usuarios de la plataforma ({filteredUsers.length} de {users.length})
          </p>
        </div>

        {/* Barra de búsqueda y filtros */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Buscador */}
            <div className="flex-1 max-w-md">
              <input
                type="text"
                placeholder="Buscar por nombre, apellido o rol..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent"
              />
            </div>

            {/* Botón agregar usuario */}
            <button
              onClick={() => { setIsAdding(true); setEditingUser(null); }}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition duration-200 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Agregar Usuario
            </button>

            {/* Indicador de ordenamiento actual */}
            <div className="text-sm text-gray-500">
              Ordenado por{' '}
              <span className="font-semibold text-orange-600">
                {sortField === 'first_name' && 'Nombre'}
                {sortField === 'last_name' && 'Apellido'}
                {sortField === 'role' && 'Rol'}
                {sortField === 'created_at' && 'Fecha de registro'}
              </span>{' '}
              ({sortDirection === 'asc' ? 'A-Z' : 'Z-A'})
            </div>
          </div>
        </div>

        {/* Formulario de edición/creación */}
        {(isAdding || editingUser) && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border-l-4 border-orange-500">
            <form onSubmit={handleSave}>
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                {editingUser ? 'Editar Usuario' : 'Agregar Nuevo Usuario'}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre *
                  </label>
                  <input
                    name="first_name"
                    type="text"
                    value={form.first_name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent"
                    required
                    disabled={actionLoading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Apellido *
                  </label>
                  <input
                    name="last_name"
                    type="text"
                    value={form.last_name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent"
                    required
                    disabled={actionLoading}
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rol *
                </label>
                <select
                  name="role"
                  value={form.role}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent"
                  disabled={actionLoading}
                >
                  <option value="usuario">Usuario</option>
                  <option value="proveedor">Proveedor</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {actionLoading ? (
                    <>
                      <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 0 1 4 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Guardando...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Guardar
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={actionLoading}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tabla de usuarios con encabezados ordenables */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th 
                    className="px-6 py-4 text-left cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('first_name')}
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-700">Nombre</span>
                      {getSortIcon('first_name')}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-4 text-left cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('last_name')}
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-700">Apellido</span>
                      {getSortIcon('last_name')}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-4 text-left cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('role')}
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-700">Rol</span>
                      {getSortIcon('role')}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-4 text-left cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('created_at')}
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-700">Fecha de Registro</span>
                      {getSortIcon('created_at')}
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left">
                    <span className="font-semibold text-gray-700">Acciones</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {user.first_name || 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {user.last_name || 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className={px-2 py-1 rounded-full text-xs font-medium ${
                          user.role === 'admin' 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-blue-100 text-blue-800'
                        }}>
                          {user.role || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {user.created_at 
                          ? new Date(user.created_at).toLocaleDateString('es-ES', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })
                          : 'N/A'
                        }
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex gap-2">
                          <button
                            onClick={() => { setEditingUser(user); setIsAdding(false); }}
                            disabled={actionLoading}
                            className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-xs font-medium transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Editar
                          </button>
                          <button
                            onClick={() => handleDelete(user.id, ${user.first_name} ${user.last_name})}
                            disabled={actionLoading}
                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs font-medium transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                      {searchTerm ? 'No se encontraron usuarios que coincidan con la búsqueda.' : 'No hay usuarios registrados.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
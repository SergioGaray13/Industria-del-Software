'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

interface UserProfile {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  avatar_url?: string;
  created_at: string;
  role?: string;
}

export default function PerfilPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
  });
  const router = useRouter();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push('/login');
        return;
      }

      const { data: userData, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
      }

      const profileData: UserProfile = {
        id: session.user.id,
        email: session.user.email || '',
        first_name: userData?.first_name || '',
        last_name: userData?.last_name || '',
        phone: userData?.phone || '',
        avatar_url: userData?.avatar_url || '',
        created_at: session.user.created_at || '',
        role: userData?.role || 'user',
      };

      setProfile(profileData);
      setFormData({
        first_name: profileData.first_name || '',
        last_name: profileData.last_name || '',
        phone: profileData.phone || '',
      });
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!profile) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('users')
        .upsert({
          id: profile.id,
          first_name: formData.first_name,
          last_name: formData.last_name,
          phone: formData.phone,
        });

      if (error) {
        console.error('Error saving profile:', error);
        alert('Error al guardar el perfil');
      } else {
        setProfile({ ...profile, ...formData });
        setEditing(false);
        alert('Perfil actualizado correctamente');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al guardar el perfil');
    } finally {
      setSaving(false);
    }
  };

  const getInitials = () => {
    const fn = profile?.first_name || '';
    const ln = profile?.last_name || '';
    return (
      (fn.charAt(0) + ln.charAt(0)).toUpperCase().substring(0, 2) || 'US'
    );
  };

  const getDisplayName = () => {
    const fn = profile?.first_name || '';
    const ln = profile?.last_name || '';
    if (fn || ln) return `${fn} ${ln}`.trim();
    return profile?.email?.split('@')[0] || 'Usuario';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-orange-700">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error al cargar el perfil</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700"
          >
            Volver al Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.push('/dashboard')}
            className="flex items-center gap-2 text-orange-600 hover:text-orange-700 mb-4"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Volver al Dashboard
          </button>
          <h1 className="text-3xl font-bold text-orange-600">Mi Perfil</h1>
        </div>

        {/* Profile Card */}
        <div className="bg-gradient-to-br from-blue-400/20 via-blue-300/15 to-blue-500/25 backdrop-blur-sm border border-white/30 rounded-xl shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="w-24 h-24 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {getInitials()}
              </div>
            </div>

            {/* User Info */}
            <div className="flex-grow">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">{getDisplayName()}</h2>
              <div className="space-y-2 text-gray-600">
                <div className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                    />
                  </svg>
                  <span>{profile.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="capitalize">{profile.role}</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h3a1 1 0 011 1v8a1 1 0 01-1 1H6a1 1 0 01-1-1V8a1 1 0 011-1h2z"
                    />
                  </svg>
                  <span>
                    Miembro desde {new Date(profile.created_at).toLocaleDateString('es-ES')}
                  </span>
                </div>
              </div>
            </div>

            {/* Edit Button */}
            <div className="flex-shrink-0">
              {!editing ? (
                <button
                  onClick={() => setEditing(true)}
                  className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
                >
                  Editar Perfil
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    {saving ? 'Guardando...' : 'Guardar'}
                  </button>
                  <button
                    onClick={() => {
                      setEditing(false);
                      setFormData({
                        first_name: profile.first_name || '',
                        last_name: profile.last_name || '',
                        phone: profile.phone || '',
                      });
                    }}
                    className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Profile Form */}
        <div className="bg-gradient-to-br from-blue-400/20 via-blue-300/15 to-blue-500/25 backdrop-blur-sm border border-white/30 rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Información Personal</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Email (read-only) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Correo Electrónico
              </label>
              <input
                type="email"
                value={profile.email}
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500"
              />
            </div>

            {/* Nombre de Usuario (readonly, concat) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre de Usuario
              </label>
              <input
                type="text"
                value={`${formData.first_name} ${formData.last_name}`.trim()}
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500"
                placeholder="Nombre de usuario"
              />
            </div>

            {/* Nombre Completo (readonly, concat) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre Completo
              </label>
              <input
                type="text"
                value={`${formData.first_name} ${formData.last_name}`.trim()}
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500"
                placeholder="Nombre completo"
              />
            </div>

            {/* Primer Nombre */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Primer Nombre
              </label>
              <input
                type="text"
                value={formData.first_name}
                onChange={(e) =>
                  setFormData({ ...formData, first_name: e.target.value })
                }
                disabled={!editing}
                className={`w-full px-3 py-2 border border-gray-300 rounded-lg ${
                  editing ? 'bg-white' : 'bg-gray-100 text-gray-500'
                }`}
                placeholder="Tu primer nombre"
              />
            </div>

            {/* Primer Apellido */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Primer Apellido
              </label>
              <input
                type="text"
                value={formData.last_name}
                onChange={(e) =>
                  setFormData({ ...formData, last_name: e.target.value })
                }
                disabled={!editing}
                className={`w-full px-3 py-2 border border-gray-300 rounded-lg ${
                  editing ? 'bg-white' : 'bg-gray-100 text-gray-500'
                }`}
                placeholder="Tu primer apellido"
              />
            </div>

            {/* Teléfono */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Teléfono
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                disabled={!editing}
                className={`w-full px-3 py-2 border border-gray-300 rounded-lg ${
                  editing ? 'bg-white' : 'bg-gray-100 text-gray-500'
                }`}
                placeholder="Tu número de teléfono"
              />
            </div>
          </div>

          {editing && (
            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => {
                  setEditing(false);
                  setFormData({
                    first_name: profile.first_name || '',
                    last_name: profile.last_name || '',
                    phone: profile.phone || '',
                  });
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50"
              >
                {saving ? 'Guardando...' : 'Guardar Cambios'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

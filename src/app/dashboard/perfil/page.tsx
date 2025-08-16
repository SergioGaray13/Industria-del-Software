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

interface CreditCard {
  id?: string;
  card_number: string;
  card_holder_name: string;
  expiration_month: number;
  expiration_year: number;
  cvv: string;
  is_default: boolean;
}

export default function PerfilPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editingCard, setEditingCard] = useState<CreditCard | null>(null);
  const [saving, setSaving] = useState(false);
  const [savingCard, setSavingCard] = useState(false);
  const [cards, setCards] = useState<CreditCard[]>([]);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
  });
  const [cardFormData, setCardFormData] = useState<CreditCard>({
    card_number: '',
    card_holder_name: '',
    expiration_month: new Date().getMonth() + 1,
    expiration_year: new Date().getFullYear(),
    cvv: '',
    is_default: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [cardErrors, setCardErrors] = useState<Record<string, string>>({});

  const router = useRouter();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
        return;
      }

      // Obtener datos del usuario
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (userError && userError.code !== 'PGRST116') {
        console.error('Error fetching profile:', userError);
      }

      // Obtener tarjetas de crédito
      const { data: cardsData, error: cardsError } = await supabase
        .from('credit_cards')
        .select('*')
        .eq('user_id', session.user.id);

      if (cardsError) {
        console.error('Error fetching credit cards:', cardsError);
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
      setCards(cardsData || []);
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

  const validateCard = (card: CreditCard): boolean => {
    const newErrors: Record<string, string> = {};

    // Validar número de tarjeta (simplificado)
    if (!card.card_number || !/^\d{16}$/.test(card.card_number.replace(/\s/g, ''))) {
      newErrors.card_number = 'Número de tarjeta inválido (16 dígitos)';
    }

    // Validar nombre del titular
    if (!card.card_holder_name || card.card_holder_name.trim().length < 3) {
      newErrors.card_holder_name = 'Nombre del titular es requerido';
    }

    // Validar fecha de expiración
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    
    if (card.expiration_year < currentYear || 
        (card.expiration_year === currentYear && card.expiration_month < currentMonth)) {
      newErrors.expiration = 'La tarjeta ha expirado';
    }

    // Validar CVV
    if (!card.cvv || !/^\d{3,4}$/.test(card.cvv)) {
      newErrors.cvv = 'CVV inválido (3 o 4 dígitos)';
    }

    setCardErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveCard = async () => {
    if (!profile || !validateCard(cardFormData)) return;
    
    setSavingCard(true);
    try {
      let error;
      
      if (editingCard?.id) {
        // Actualizar tarjeta existente
        const { error: updateError } = await supabase
          .from('credit_cards')
          .update({
            ...cardFormData,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingCard.id);

        error = updateError;
      } else {
        // Crear nueva tarjeta
        const { error: insertError } = await supabase
          .from('credit_cards')
          .insert({
            ...cardFormData,
            user_id: profile.id,
          });

        error = insertError;
      }

      if (error) {
        console.error('Error saving credit card:', error);
        alert('Error al guardar la tarjeta de crédito');
      } else {
        // Si es la tarjeta por defecto, actualizar las demás
        if (cardFormData.is_default) {
          await supabase
            .from('credit_cards')
            .update({ is_default: false })
            .eq('user_id', profile.id)
            .neq('id', editingCard?.id || '');
        }

        fetchProfile(); // Refrescar la lista de tarjetas
        setEditingCard(null);
        setCardFormData({
          card_number: '',
          card_holder_name: '',
          expiration_month: new Date().getMonth() + 1,
          expiration_year: new Date().getFullYear(),
          cvv: '',
          is_default: cards.length === 0, // Si es la primera tarjeta, hacerla por defecto
        });
        alert('Tarjeta guardada correctamente');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al guardar la tarjeta de crédito');
    } finally {
      setSavingCard(false);
    }
  };

  const handleDeleteCard = async (cardId: string) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar esta tarjeta?')) return;
    
    try {
      const { error } = await supabase
        .from('credit_cards')
        .delete()
        .eq('id', cardId);

      if (error) {
        console.error('Error deleting credit card:', error);
        alert('Error al eliminar la tarjeta');
      } else {
        fetchProfile(); // Refrescar la lista de tarjetas
        alert('Tarjeta eliminada correctamente');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al eliminar la tarjeta');
    }
  };

  const formatCardNumber = (number: string): string => {
    return number.replace(/(\d{4})/g, '$1 ').trim();
  };

  const getInitials = () => {
    const fn = profile?.first_name || '';
    const ln = profile?.last_name || '';
    return (fn.charAt(0) + ln.charAt(0)).toUpperCase().substring(0, 2) || 'US';
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
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
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
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                  <span>{profile.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="capitalize">{profile.role}</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h3a1 1 0 011 1v8a1 1 0 01-1 1H6a1 1 0 01-1-1V8a1 1 0 011-1h2z" />
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
        <div className="bg-gradient-to-br from-blue-400/20 via-blue-300/15 to-blue-500/25 backdrop-blur-sm border border-white/30 rounded-xl shadow-lg p-6 mb-6">
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

            {/* Primer Nombre */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Primer Nombre
              </label>
              <input
                type="text"
                value={formData.first_name}
                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
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
                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
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
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
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

        {/* Credit Cards Section */}
        <div className="bg-gradient-to-br from-blue-400/20 via-blue-300/15 to-blue-500/25 backdrop-blur-sm border border-white/30 rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-800">Tarjetas de Crédito</h3>
            <button
              onClick={() => {
                setEditingCard({
                  card_number: '',
                  card_holder_name: '',
                  expiration_month: new Date().getMonth() + 1,
                  expiration_year: new Date().getFullYear(),
                  cvv: '',
                  is_default: cards.length === 0,
                });
              }}
              className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
            >
              Agregar Tarjeta
            </button>
          </div>

          {cards.length === 0 && !editingCard && (
            <div className="text-center py-6 text-gray-500">
              No tienes tarjetas de crédito registradas
            </div>
          )}

          {/* List of Cards */}
          <div className="space-y-4">
            {cards.map((card) => (
              <div
                key={card.id}
                className={`p-4 border rounded-lg ${
                  card.is_default ? 'border-orange-500 bg-orange-50' : 'border-gray-200'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium text-gray-800">
                      {formatCardNumber(card.card_number)}
                    </div>
                    <div className="text-sm text-gray-600">
                      {card.card_holder_name}
                    </div>
                    <div className="text-sm text-gray-600">
                      Expira: {card.expiration_month.toString().padStart(2, '0')}/{card.expiration_year}
                    </div>
                    {card.is_default && (
                      <span className="inline-block mt-1 px-2 py-1 text-xs font-medium bg-orange-100 text-green-800 rounded">
                        Predeterminada
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingCard(card);
                        setCardFormData(card);
                      }}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDeleteCard(card.id!)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Card Form */}
          {editingCard && (
            <div className="mt-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
              <h4 className="text-lg font-medium text-gray-800 mb-4">
                {editingCard.id ? 'Editar Tarjeta' : 'Agregar Tarjeta'}
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Número de Tarjeta */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Número de Tarjeta
                  </label>
                  <input
                    type="text"
                    value={cardFormData.card_number}
                    onChange={(e) =>
                      setCardFormData({
                        ...cardFormData,
                        card_number: e.target.value.replace(/\D/g, '').substring(0, 16),
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="1234 5678 9012 3456"
                  />
                  {cardErrors.card_number && (
                    <p className="mt-1 text-sm text-red-600">{cardErrors.card_number}</p>
                  )}
                </div>

                {/* Nombre del Titular */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre del Titular
                  </label>
                  <input
                    type="text"
                    value={cardFormData.card_holder_name}
                    onChange={(e) =>
                      setCardFormData({
                        ...cardFormData,
                        card_holder_name: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="Como aparece en la tarjeta"
                  />
                  {cardErrors.card_holder_name && (
                    <p className="mt-1 text-sm text-red-600">{cardErrors.card_holder_name}</p>
                  )}
                </div>

                {/* Fecha de Expiración */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mes
                    </label>
                    <select
                      value={cardFormData.expiration_month}
                      onChange={(e) =>
                        setCardFormData({
                          ...cardFormData,
                          expiration_month: parseInt(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    >
                      {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                        <option key={month} value={month}>
                          {month.toString().padStart(2, '0')}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Año
                    </label>
                    <select
                      value={cardFormData.expiration_year}
                      onChange={(e) =>
                        setCardFormData({
                          ...cardFormData,
                          expiration_year: parseInt(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    >
                      {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i).map(
                        (year) => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        )
                      )}
                    </select>
                  </div>
                  {cardErrors.expiration && (
                    <p className="mt-1 text-sm text-red-600 col-span-2">{cardErrors.expiration}</p>
                  )}
                </div>

                {/* CVV */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CVV
                  </label>
                  <input
                    type="text"
                    value={cardFormData.cvv}
                    onChange={(e) =>
                      setCardFormData({
                        ...cardFormData,
                        cvv: e.target.value.replace(/\D/g, '').substring(0, 4),
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="123"
                  />
                  {cardErrors.cvv && (
                    <p className="mt-1 text-sm text-red-600">{cardErrors.cvv}</p>
                  )}
                </div>

                {/* Tarjeta Predeterminada */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is_default"
                    checked={cardFormData.is_default}
                    onChange={(e) =>
                      setCardFormData({
                        ...cardFormData,
                        is_default: e.target.checked,
                      })
                    }
                    className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                  />
                  <label htmlFor="is_default" className="ml-2 block text-sm text-gray-700">
                    Usar como tarjeta predeterminada
                  </label>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-2">
                <button
                  onClick={() => {
                    setEditingCard(null);
                    setCardErrors({});
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSaveCard}
                  disabled={savingCard}
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50"
                >
                  {savingCard ? 'Guardando...' : 'Guardar Tarjeta'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
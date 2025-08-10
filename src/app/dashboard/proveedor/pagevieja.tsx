//src\app\dashboard\proveedor\page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';

type Provider = {
  id: string;
  name: string;
  category: string | null;
  rating: number | null;
  location: string | null;
  user_id: string;
  email: string | null;
  phones: string | null;
  website: string | null;
  image_url: string | null;
};

type Review = {
  id: string;
  provider_id: string;
  user_id: string;
  comment: string;
  rating: number;
  created_at: string;
  users?: {
    first_name?: string;
    last_name?: string;
  }[] | {
    first_name?: string;
    last_name?: string;
  };
  user_name?: string;
};

export default function ProveedoresPage() {
  const router = useRouter();
  const [providers, setProviders] = useState<Provider[]>([]);
  const [allReviews, setAllReviews] = useState<Review[]>([]);
  const [selectedProviderReviews, setSelectedProviderReviews] = useState<Review[]>([]);
  const [reviewCounts, setReviewCounts] = useState<{[key: string]: number}>({});
  const [loading, setLoading] = useState(true);
  const [editingProvider, setEditingProvider] = useState<Provider | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedProviderId, setSelectedProviderId] = useState<string | null>(null);
  const [showReviews, setShowReviews] = useState(false);
  const [reviewsLoading, setReviewsLoading] = useState(false);

  const fetchProviders = async () => {
    const { data, error } = await supabase
      .from('providers')
      .select('id, name, category, rating, location, user_id, email, phones, website, image_url');

    if (!error) {
      setProviders(data || []);
    } else {
      console.error('Error fetching providers:', error);
    }
  };

  const fetchReviewCounts = async () => {
    const { data, error } = await supabase
      .from('reviews')
      .select('provider_id, rating');

    if (!error && data) {
      const counts: {[key: string]: number} = {};
      const ratings: {[key: string]: number[]} = {};
      
      data.forEach(review => {
        const providerId = review.provider_id;
        counts[providerId] = (counts[providerId] || 0) + 1;
        if (!ratings[providerId]) ratings[providerId] = [];
        ratings[providerId].push(review.rating);
      });
      
      setReviewCounts(counts);
      setAllReviews(data as Review[]);
    } else {
      console.error('Error fetching review counts:', error);
    }
  };

  const fetchReviews = async (providerId: string) => {
    setReviewsLoading(true);
    
    const { data, error } = await supabase
      .from('reviews')
      .select(`
        id, 
        provider_id, 
        user_id,
        comment, 
        rating, 
        created_at,
        users!reviews_user_id_fkey (
          first_name,
          last_name
        )
      `)
      .eq('provider_id', providerId)
      .order('created_at', { ascending: false });

    if (!error && data) {
      const transformedReviews = data.map(review => {
        const user = Array.isArray(review.users) ? review.users[0] : review.users;
        
        return {
          ...review,
          user_name: user 
            ? `${user.first_name || ''} ${user.last_name || ''}`.trim()
            : 'Usuario Anónimo'
        };
      });
      setSelectedProviderReviews(transformedReviews);
    } else {
      console.error('Error fetching reviews:', error);
      setSelectedProviderReviews([]);
    }
    setReviewsLoading(false);
  };

  const calculateAverageRating = (providerId: string): string => {
    const providerReviews = allReviews.filter(review => review.provider_id === providerId);
    if (providerReviews.length === 0) return "0.0";
    
    const sum = providerReviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / providerReviews.length).toFixed(1);
  };

  const getAverageRatingAsNumber = (providerId: string): number => {
    const providerReviews = allReviews.filter(review => review.provider_id === providerId);
    if (providerReviews.length === 0) return 0;
    
    const sum = providerReviews.reduce((acc, review) => acc + review.rating, 0);
    return sum / providerReviews.length;
  };

  const getReviewCount = (providerId: string) => {
    return reviewCounts[providerId] || 0;
  };

  useEffect(() => {
    const checkSessionAndLoad = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push('/login');
        return;
      }

      await fetchProviders();
      await fetchReviewCounts();
      setLoading(false);
    };

    checkSessionAndLoad();
  }, [router]);

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('providers').delete().eq('id', id);
    if (!error) await fetchProviders();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const newProvider: Omit<Provider, 'id'> = {
      name: formData.get('name') as string,
      category: formData.get('category') as string,
      rating: Number(formData.get('rating')),
      location: formData.get('location') as string,
      user_id: formData.get('user_id') as string,
      email: formData.get('email') as string,
      phones: formData.get('phones') as string,
      website: formData.get('website') as string,
      image_url: formData.get('image_url') as string,
    };

    if (editingProvider) {
      await supabase
        .from('providers')
        .update(newProvider)
        .eq('id', editingProvider.id);
    } else {
      await supabase.from('providers').insert([
        {
          ...newProvider,
          id: uuidv4(),
        },
      ]);
    }

    setShowForm(false);
    setEditingProvider(null);
    await fetchProviders();
  };

  const handleShowReviews = async (providerId: string) => {
    setSelectedProviderId(providerId);
    await fetchReviews(providerId);
    setShowReviews(true);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={`text-lg ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}>
        ★
      </span>
    ));
  };

  const getSelectedProvider = () => {
    return providers.find(p => p.id === selectedProviderId);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-lime-50 flex items-center justify-center text-lime-600">
        Cargando proveedores...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-lime-100 to-lime-200 p-4 relative">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-lime-700">Proveedores</h1>
        <button
          className="bg-lime-600 text-white px-4 py-2 rounded hover:bg-lime-700 text-sm"
          onClick={() => {
            setEditingProvider(null);
            setShowForm(true);
          }}
        >
          + Agregar
        </button>
      </div>

      {providers.length === 0 ? (
        <p className="text-lime-600">No hay proveedores registrados.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {providers.map((provider) => (
            <div
              key={provider.id}
              className="bg-white rounded-lg shadow p-4 border border-lime-200"
            >
              {provider.image_url && (
                <img
                  src={provider.image_url}
                  alt={provider.name}
                  className="w-full h-40 object-cover rounded mb-2"
                />
              )}
              <h2 className="text-lg font-semibold text-lime-800">{provider.name}</h2>
              {provider.category && (
                <p className="text-sm text-gray-600 mt-1">Categoría: {provider.category}</p>
              )}
              
              <div className="flex items-center mt-2 mb-2">
                <div className="flex">
                  {renderStars(Math.round(getAverageRatingAsNumber(provider.id)))}
                </div>
                <span className="ml-2 text-sm text-gray-600">
                  {calculateAverageRating(provider.id)} ({getReviewCount(provider.id)} reseñas)
                </span>
              </div>

              {provider.location && (
                <p className="text-sm text-gray-600">Ubicación: {provider.location}</p>
              )}
              {provider.email && (
                <p className="text-sm text-gray-600">Email: {provider.email}</p>
              )}
              {provider.phones && (
                <p className="text-sm text-gray-600">Teléfonos: {provider.phones}</p>
              )}
              {provider.website && (
                <p className="text-sm text-blue-600 underline">
                  <a href={provider.website} target="_blank" rel="noopener noreferrer">
                    Sitio web
                  </a>
                </p>
              )}
              
              <div className="mt-4 flex gap-2 flex-wrap">
                <button
                  className="text-sm text-white bg-blue-500 px-3 py-1 rounded hover:bg-blue-600"
                  onClick={() => {
                    setEditingProvider(provider);
                    setShowForm(true);
                  }}
                >
                  Editar
                </button>
                <button
                  className="text-sm text-white bg-red-500 px-3 py-1 rounded hover:bg-red-600"
                  onClick={() => handleDelete(provider.id)}
                >
                  Eliminar
                </button>
                <button
                  className="text-sm text-white bg-green-500 px-3 py-1 rounded hover:bg-green-600"
                  onClick={() => {
                    if (showReviews && selectedProviderId === provider.id) {
                      setShowReviews(false);
                      setSelectedProviderId(null);
                      setSelectedProviderReviews([]);
                    } else {
                      handleShowReviews(provider.id);
                    }
                  }}
                >
                  {showReviews && selectedProviderId === provider.id ? 'Ocultar Reseñas' : `Ver Reseñas (${getReviewCount(provider.id)})`}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Panel de Reseñas - Sidebar derecho */}
      <div className={`fixed top-0 right-0 h-full w-96 bg-white shadow-2xl transform transition-transform duration-300 z-50 ${
        showReviews ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Header del panel */}
          <div className="bg-lime-600 text-white p-4 flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">Reseñas</h3>
              {getSelectedProvider() && (
                <p className="text-sm opacity-90">{getSelectedProvider()?.name}</p>
              )}
            </div>
            <button
              onClick={() => {
                setShowReviews(false);
                setSelectedProviderId(null);
                setSelectedProviderReviews([]);
              }}
              className="text-white hover:bg-lime-700 rounded-full p-1 w-8 h-8 flex items-center justify-center"
            >
              ✕
            </button>
          </div>

          {/* Contenido del panel */}
          <div className="flex-1 overflow-y-auto p-4">
            {reviewsLoading ? (
              <div className="flex items-center justify-center h-32">
                <p className="text-gray-500">Cargando reseñas...</p>
              </div>
            ) : selectedProviderReviews.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-gray-400 text-4xl mb-4">📝</div>
                <p className="text-gray-500 text-lg font-medium">Sin reseñas</p>
                <p className="text-gray-400 text-sm mt-2">
                  Este proveedor aún no tiene reseñas de clientes
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-lime-50 rounded-lg p-4 border border-lime-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl font-bold text-lime-700">
                      {calculateAverageRating(selectedProviderId!)}
                    </span>
                    <div className="flex">
                      {renderStars(Math.round(getAverageRatingAsNumber(selectedProviderId!)))}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    Basado en {selectedProviderReviews.length} reseña{selectedProviderReviews.length !== 1 ? 's' : ''}
                  </p>
                </div>

                {selectedProviderReviews.map((review) => (
                  <div key={review.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-800">{review.user_name}</h4>
                      <div className="flex">
                        {renderStars(review.rating)}
                      </div>
                    </div>
                    <p className="text-gray-700 text-sm mb-2">{review.comment}</p>
                    <p className="text-xs text-gray-500">
                      {formatDate(review.created_at)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de formulario de proveedor */}
      {showForm && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded shadow-md w-full max-w-md max-h-[80vh] overflow-y-auto"
          >
            <h2 className="text-lg font-bold text-lime-700 mb-4">
              {editingProvider ? 'Editar proveedor' : 'Nuevo proveedor'}
            </h2>
            <input
              type="text"
              name="name"
              defaultValue={editingProvider?.name || ''}
              placeholder="Nombre"
              required
              className="w-full mb-3 p-2 border rounded"
            />
            <input
              type="text"
              name="category"
              defaultValue={editingProvider?.category || ''}
              placeholder="Categoría"
              className="w-full mb-3 p-2 border rounded"
            />
            <input
              type="number"
              name="rating"
              defaultValue={editingProvider?.rating?.toString() || ''}
              placeholder="Calificación"
              step="0.1"
              className="w-full mb-3 p-2 border rounded"
            />
            <input
              type="text"
              name="location"
              defaultValue={editingProvider?.location || ''}
              placeholder="Ubicación"
              className="w-full mb-3 p-2 border rounded"
            />
            <input
              type="text"
              name="user_id"
              defaultValue={editingProvider?.user_id || ''}
              placeholder="User ID"
              required
              className="w-full mb-3 p-2 border rounded"
            />
            <input
              type="email"
              name="email"
              defaultValue={editingProvider?.email || ''}
              placeholder="Email"
              className="w-full mb-3 p-2 border rounded"
            />
            <input
              type="text"
              name="phones"
              defaultValue={editingProvider?.phones || ''}
              placeholder="Teléfonos (separados por coma)"
              className="w-full mb-3 p-2 border rounded"
            />
            <input
              type="url"
              name="website"
              defaultValue={editingProvider?.website || ''}
              placeholder="Sitio web (URL)"
              className="w-full mb-3 p-2 border rounded"
            />
            <input
              type="url"
              name="image_url"
              defaultValue={editingProvider?.image_url || ''}
              placeholder="URL de imagen"
              className="w-full mb-3 p-2 border rounded"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingProvider(null);
                }}
                className="bg-gray-300 px-4 py-2 rounded"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="bg-lime-600 text-white px-4 py-2 rounded"
              >
                Guardar
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

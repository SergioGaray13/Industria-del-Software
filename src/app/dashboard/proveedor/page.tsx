// src/app/dashboard/proveedor/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useProviders } from '@/hooks/useProviders';
import ProviderCard from '@/components/providers/ProviderCard';
import ProviderFormModal from '@/components/providers/ProviderFormModal';
import ReviewSidebar from '@/components/providers/ReviewSidebar';
import { Provider, Review } from '@/types/providers';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function ProveedoresPage() {
  const router = useRouter();

  const {
    providers,
    loading,
    addOrUpdateProvider,
    deleteProvider,
    calculateAverageRating,
    getAverageRatingAsNumber,
    getReviewCount,
  } = useProviders();

  // Estados y lógica para rol usuario
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loadingRole, setLoadingRole] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push('/login');
        return;
      }

      const { data: userData, error } = await supabase
        .from('users')
        .select('role')
        .eq('id', session.user.id)
        .single();

      if (error || !userData) {
        setUserRole(null);
      } else {
        setUserRole(userData.role);
      }
      setLoadingRole(false);
    };

    fetchUserRole();
  }, [router]);

  const [editingProvider, setEditingProvider] = useState<Provider | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showReviews, setShowReviews] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);

  const fetchReviews = async (providerId: string) => {
    setReviewsLoading(true);

    const { data } = await supabase
      .from('reviews')
      .select(`
        id, provider_id, user_id, comment, rating, created_at,
        users!reviews_user_id_fkey ( first_name, last_name )
      `)
      .eq('provider_id', providerId)
      .order('created_at', { ascending: false });

    if (data) {
      setReviews(
        data.map((r: Review) => {
          let userName = 'Usuario Anónimo';

          if (Array.isArray(r.users) && r.users.length > 0) {
            userName = `${r.users[0]?.first_name || ''} ${r.users[0]?.last_name || ''}`.trim();
          } else if (r.users && !Array.isArray(r.users)) {
            userName = `${r.users.first_name || ''} ${r.users.last_name || ''}`.trim();
          }

          return {
            ...r,
            user_name: userName || 'Usuario Anónimo',
          };
        })
      );
    }
    setReviewsLoading(false);
  };

  const handleShowReviews = (provider: Provider) => {
    setSelectedProvider(provider);
    fetchReviews(provider.id);
    setShowReviews(true);
  };

  if (loading || loadingRole) {
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
        {/* Solo mostrar botón agregar si es admin */}
        {userRole === 'admin' && (
          <button
            className="bg-lime-600 text-white px-4 py-2 rounded hover:bg-lime-700 text-sm"
            onClick={() => {
              setEditingProvider(null);
              setShowForm(true);
            }}
          >
            + Agregar
          </button>
        )}
      </div>

      {providers.length === 0 ? (
        <p className="text-lime-600">No hay proveedores registrados.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {providers.map((provider) => (
            <ProviderCard
              key={provider.id}
              provider={provider}
              avgRating={getAverageRatingAsNumber(provider.id)}
              reviewCount={getReviewCount(provider.id)}
              userRole={userRole} // <-- Pasamos rol al componente
              onEdit={() => {
                setEditingProvider(provider);
                setShowForm(true);
              }}
              onDelete={() => deleteProvider(provider.id)}
              onToggleReviews={() => {
                if (showReviews && selectedProvider?.id === provider.id) {
                  setShowReviews(false);
                  setSelectedProvider(null);
                  setReviews([]);
                } else {
                  handleShowReviews(provider);
                }
              }}
              showReviews={showReviews && selectedProvider?.id === provider.id}
            />
          ))}
        </div>
      )}

      <ReviewSidebar
        isOpen={showReviews}
        onClose={() => setShowReviews(false)}
        providerName={selectedProvider?.name}
        reviews={reviews}
        avgRating={getAverageRatingAsNumber(selectedProvider?.id || '')}
        loading={reviewsLoading}
      />

      <ProviderFormModal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        onSubmit={addOrUpdateProvider}
        editingProvider={editingProvider}
      />
    </div>
  );
}

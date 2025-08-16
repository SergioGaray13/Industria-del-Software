'use client';

import React from 'react';
import { Provider } from '@/types/providers';

interface ProviderCardProps {
  provider: Provider;
  avgRating: number;
  reviewCount: number;
  onEdit: () => void;
  onDelete: () => void;
  onToggleReviews: () => void;
  showReviews: boolean;
  userRole: string | null; 
}

export default function ProviderCard({
  provider,
  avgRating,
  reviewCount,
  onEdit,
  onDelete,
  onToggleReviews,
  showReviews,
  userRole,
}: ProviderCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-4 border border-lime-200">
      {provider.image_url && (
        <img
          src={provider.image_url}
          alt={provider.name}
          className="w-full h-40 object-cover rounded mb-2"
        />
      )}
      <h2 className="text-lg font-semibold text-lime-800">{provider.name}</h2>
      {provider.category && <p className="text-sm text-gray-600 mt-1">Categoría: {provider.category}</p>}
      <div className="flex items-center mt-2 mb-2">
        <span className="ml-2 text-sm text-gray-600">
          {avgRating.toFixed(1)} ({reviewCount} reseñas)
        </span>
      </div>
      {provider.location && <p className="text-sm text-gray-600">Ubicación: {provider.location}</p>}
      {provider.email && <p className="text-sm text-gray-600">Email: {provider.email}</p>}
      {provider.phones && <p className="text-sm text-gray-600">Teléfonos: {provider.phones}</p>}
      {provider.website && (
        <p className="text-sm text-blue-600 underline">
          <a href={provider.website} target="_blank" rel="noopener noreferrer">
            Sitio web
          </a>
        </p>
      )}
      <div className="mt-4 flex gap-2 flex-wrap">
        {userRole === 'admin' && (
          <>
            <button
              onClick={onEdit}
              className="text-sm text-white bg-blue-500 px-3 py-1 rounded hover:bg-blue-600"
            >
              Editar
            </button>
            <button
              onClick={onDelete}
              className="text-sm text-white bg-red-500 px-3 py-1 rounded hover:bg-red-600"
            >
              Eliminar
            </button>
          </>
        )}
        <button
          onClick={onToggleReviews}
          className="text-sm text-white bg-green-500 px-3 py-1 rounded hover:bg-green-600"
        >
          {showReviews ? 'Ocultar Reseñas' : `Ver Reseñas (${reviewCount})`}
        </button>
      </div>
    </div>
  );
}

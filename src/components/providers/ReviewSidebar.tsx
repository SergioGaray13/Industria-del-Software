'use client';

import React from 'react';
import { Review } from '@/types/providers';

interface ReviewSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  providerName?: string;
  reviews: Review[];
  avgRating: number;
  loading: boolean;
}

export default function ReviewSidebar({
  isOpen,
  onClose,
  providerName,
  reviews,
  avgRating,
  loading
}: ReviewSidebarProps) {
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
      <span key={i} className={`text-lg ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}>★</span>
    ));
  };

  return (
    <div
      className={`fixed top-0 right-0 h-full w-96 bg-white shadow-2xl transform transition-transform duration-300 z-50 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="bg-lime-600 text-white p-4 flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold">Reseñas</h3>
            {providerName && <p className="text-sm opacity-90">{providerName}</p>}
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-lime-700 rounded-full p-1 w-8 h-8 flex items-center justify-center"
          >
            ✕
          </button>
        </div>

        {/* Contenido */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex items-center justify-center h-32 text-gray-500">Cargando reseñas...</div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-400 text-4xl mb-4">📝</div>
              <p className="text-gray-500 text-lg font-medium">Sin reseñas</p>
              <p className="text-gray-400 text-sm mt-2">Este proveedor aún no tiene reseñas</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-lime-50 rounded-lg p-4 border border-lime-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl font-bold text-lime-700">{avgRating.toFixed(1)}</span>
                  <div className="flex">{renderStars(Math.round(avgRating))}</div>
                </div>
                <p className="text-sm text-gray-600">
                  Basado en {reviews.length} reseña{reviews.length !== 1 ? 's' : ''}
                </p>
              </div>

              {reviews.map(review => (
                <div key={review.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-800">{review.user_name}</h4>
                    <div className="flex">{renderStars(review.rating)}</div>
                  </div>
                  <p className="text-gray-700 text-sm mb-2">{review.comment}</p>
                  <p className="text-xs text-gray-500">{formatDate(review.created_at)}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Provider, Review } from '@/types/providers';
import { v4 as uuidv4 } from 'uuid';

export function useProviders() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [allReviews, setAllReviews] = useState<Review[]>([]);
  const [reviewCounts, setReviewCounts] = useState<{ [key: string]: number }>({});
  const [loading, setLoading] = useState(true);

  const fetchProviders = useCallback(async () => {
    const { data, error } = await supabase
      .from('providers')
      .select('id, name, category, rating, location, user_id, email, phones, website, image_url');

    if (!error) setProviders(data || []);
  }, []);

  const fetchReviewCounts = useCallback(async () => {
    const { data, error } = await supabase
      .from('reviews')
      .select('provider_id, rating');

    if (!error && data) {
      const counts: { [key: string]: number } = {};
      data.forEach(r => {
        counts[r.provider_id] = (counts[r.provider_id] || 0) + 1;
      });
      setReviewCounts(counts);
      setAllReviews(data as Review[]);
    }
  }, []);

  const addOrUpdateProvider = async (provider: Omit<Provider, 'id'>, editingId?: string) => {
    if (editingId) {
      await supabase.from('providers').update(provider).eq('id', editingId);
    } else {
      await supabase.from('providers').insert([{ ...provider, id: uuidv4() }]);
    }
    await fetchProviders();
  };

  const deleteProvider = async (id: string) => {
    await supabase.from('providers').delete().eq('id', id);
    await fetchProviders();
  };

  const calculateAverageRating = (providerId: string) => {
    const providerReviews = allReviews.filter(r => r.provider_id === providerId);
    if (providerReviews.length === 0) return '0.0';
    const sum = providerReviews.reduce((acc, r) => acc + r.rating, 0);
    return (sum / providerReviews.length).toFixed(1);
  };

  const getAverageRatingAsNumber = (providerId: string) => {
    const providerReviews = allReviews.filter(r => r.provider_id === providerId);
    if (providerReviews.length === 0) return 0;
    const sum = providerReviews.reduce((acc, r) => acc + r.rating, 0);
    return sum / providerReviews.length;
  };

  const getReviewCount = (providerId: string) => reviewCounts[providerId] || 0;

  useEffect(() => {
    (async () => {
      await fetchProviders();
      await fetchReviewCounts();
      setLoading(false);
    })();
  }, [fetchProviders, fetchReviewCounts]);

  return {
    providers,
    loading,
    addOrUpdateProvider,
    deleteProvider,
    calculateAverageRating,
    getAverageRatingAsNumber,
    getReviewCount,
    fetchProviders
  };
}

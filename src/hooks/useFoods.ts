
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type Food = Database['public']['Tables']['foods']['Row'];

export function useFoods() {
  const [foods, setFoods] = useState<Food[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFoods();
  }, []);

  const fetchFoods = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('foods')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (fetchError) {
        console.error('Error fetching foods:', fetchError);
        setError('Besinler alınamadı');
        return;
      }

      setFoods(data || []);
    } catch (err) {
      console.error('Unexpected error fetching foods:', err);
      setError('Beklenmeyen bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const searchFoods = async (query: string, category?: string) => {
    try {
      setLoading(true);
      setError(null);

      let queryBuilder = supabase
        .from('foods')
        .select('*')
        .eq('is_active', true)
        .ilike('name', `%${query}%`);

      if (category) {
        queryBuilder = queryBuilder.eq('category', category);
      }

      const { data, error: searchError } = await queryBuilder
        .order('name')
        .limit(50);

      if (searchError) {
        console.error('Error searching foods:', searchError);
        setError('Arama yapılamadı');
        return;
      }

      setFoods(data || []);
    } catch (err) {
      console.error('Unexpected error searching foods:', err);
      setError('Beklenmeyen bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return {
    foods,
    loading,
    error,
    searchFoods,
    refetch: fetchFoods
  };
}

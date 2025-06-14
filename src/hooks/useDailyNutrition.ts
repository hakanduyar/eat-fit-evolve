
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

// Define types based on the new schema structure
type DailyNutrition = {
  id: string;
  user_id: string;
  date: string;
  water_intake: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

type DailyNutritionInsert = {
  user_id?: string;
  date?: string;
  water_intake?: number;
  notes?: string;
};

export function useDailyNutrition(date?: string) {
  const { user } = useAuth();
  const [dailyNutrition, setDailyNutrition] = useState<DailyNutrition | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const targetDate = date || new Date().toISOString().split('T')[0];

  useEffect(() => {
    if (!user) {
      setDailyNutrition(null);
      setLoading(false);
      return;
    }

    fetchDailyNutrition();
  }, [user, targetDate]);

  const fetchDailyNutrition = async () => {
    try {
      setLoading(true);
      setError(null);

      // Use raw SQL for now since the types haven't been updated
      const { data, error: fetchError } = await supabase.rpc('get_daily_nutrition', {
        p_user_id: user!.id,
        p_date: targetDate
      });

      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('Error fetching daily nutrition:', fetchError);
        setError('Günlük beslenme verisi alınamadı');
        return;
      }

      setDailyNutrition(data?.[0] || null);
    } catch (err) {
      console.error('Unexpected error fetching daily nutrition:', err);
      setError('Beklenmeyen bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const createOrUpdateDailyNutrition = async (data: Partial<DailyNutritionInsert>) => {
    if (!user) return { error: 'Kullanıcı oturumu bulunamadı' };

    try {
      // Use raw SQL for now
      const { data: result, error: upsertError } = await supabase.rpc('upsert_daily_nutrition', {
        p_user_id: user.id,
        p_date: targetDate,
        p_water_intake: data.water_intake || 0,
        p_notes: data.notes || null
      });

      if (upsertError) {
        console.error('Error upserting daily nutrition:', upsertError);
        return { error: 'Günlük beslenme verisi kaydedilemedi' };
      }

      await fetchDailyNutrition(); // Refresh data
      return { data: result, error: null };
    } catch (err) {
      console.error('Unexpected error upserting daily nutrition:', err);
      return { error: 'Beklenmeyen bir hata oluştu' };
    }
  };

  return {
    dailyNutrition,
    loading,
    error,
    createOrUpdateDailyNutrition,
    refetch: fetchDailyNutrition
  };
}

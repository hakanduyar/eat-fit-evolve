
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type DailyNutrition = Database['public']['Tables']['daily_nutrition']['Row'];
type DailyNutritionInsert = Database['public']['Tables']['daily_nutrition']['Insert'];

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

      const { data, error: fetchError } = await supabase
        .from('daily_nutrition')
        .select('*')
        .eq('user_id', user!.id)
        .eq('date', targetDate)
        .maybeSingle();

      if (fetchError) {
        console.error('Error fetching daily nutrition:', fetchError);
        setError('Günlük beslenme verisi alınamadı');
        return;
      }

      setDailyNutrition(data);
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
      const { data: result, error: upsertError } = await supabase
        .from('daily_nutrition')
        .upsert({
          user_id: user.id,
          date: targetDate,
          ...data
        })
        .select()
        .single();

      if (upsertError) {
        console.error('Error upserting daily nutrition:', upsertError);
        return { error: 'Günlük beslenme verisi kaydedilemedi' };
      }

      setDailyNutrition(result);
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


import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type WaterIntake = Database['public']['Tables']['water_intake']['Row'];
type WaterIntakeInsert = Database['public']['Tables']['water_intake']['Insert'];

export function useWaterIntake(date?: string) {
  const { user } = useAuth();
  const [waterIntakes, setWaterIntakes] = useState<WaterIntake[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const targetDate = date || new Date().toISOString().split('T')[0];

  useEffect(() => {
    if (!user) {
      setWaterIntakes([]);
      setLoading(false);
      return;
    }

    fetchWaterIntake();
  }, [user, targetDate]);

  const fetchWaterIntake = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('water_intake')
        .select('*')
        .eq('user_id', user!.id)
        .eq('date', targetDate)
        .order('time_logged', { ascending: false });

      if (fetchError) {
        console.error('Error fetching water intake:', fetchError);
        setError('Su tüketimi alınamadı');
        return;
      }

      setWaterIntakes(data || []);
    } catch (err) {
      console.error('Unexpected error fetching water intake:', err);
      setError('Beklenmeyen bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const addWaterIntake = async (amount_ml: number) => {
    if (!user) return { error: 'Kullanıcı oturumu bulunamadı' };

    try {
      const { data, error: insertError } = await supabase
        .from('water_intake')
        .insert({
          user_id: user.id,
          amount_ml,
          date: targetDate
        })
        .select()
        .single();

      if (insertError) {
        console.error('Error adding water intake:', insertError);
        return { error: 'Su tüketimi eklenemedi' };
      }

      await fetchWaterIntake(); // Refresh the list
      return { data, error: null };
    } catch (err) {
      console.error('Unexpected error adding water intake:', err);
      return { error: 'Beklenmeyen bir hata oluştu' };
    }
  };

  const getTotalWater = () => {
    return waterIntakes.reduce((total, intake) => total + intake.amount_ml, 0);
  };

  const getGlassCount = () => {
    return Math.floor(getTotalWater() / 250); // 250ml per glass
  };

  return {
    waterIntakes,
    loading,
    error,
    addWaterIntake,
    refetch: fetchWaterIntake,
    getTotalWater,
    getGlassCount
  };
}

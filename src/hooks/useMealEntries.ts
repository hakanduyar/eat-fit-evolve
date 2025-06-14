
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { useDailyNutrition } from './useDailyNutrition';

type MealEntry = Database['public']['Tables']['meal_entries']['Row'];
type MealEntryInsert = Database['public']['Tables']['meal_entries']['Insert'];

export function useMealEntries(date?: string) {
  const { user } = useAuth();
  const { dailyNutrition, createOrUpdateDailyNutrition } = useDailyNutrition(date);
  const [mealEntries, setMealEntries] = useState<MealEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const targetDate = date || new Date().toISOString().split('T')[0];

  useEffect(() => {
    if (!user || !dailyNutrition) {
      setMealEntries([]);
      setLoading(false);
      return;
    }

    fetchMealEntries();
  }, [user, dailyNutrition]);

  const fetchMealEntries = async () => {
    if (!dailyNutrition) return;

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('meal_entries')
        .select('*')
        .eq('daily_nutrition_id', dailyNutrition.id)
        .order('eaten_at', { ascending: true });

      if (fetchError) {
        console.error('Error fetching meal entries:', fetchError);
        setError('Öğün kayıtları alınamadı');
        return;
      }

      setMealEntries(data || []);
    } catch (err) {
      console.error('Unexpected error fetching meal entries:', err);
      setError('Beklenmeyen bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const addMealEntry = async (entryData: Omit<MealEntryInsert, 'daily_nutrition_id'>) => {
    if (!user) return { error: 'Kullanıcı oturumu bulunamadı' };

    // Ensure daily nutrition record exists
    let dailyNutritionId = dailyNutrition?.id;
    if (!dailyNutritionId) {
      const result = await createOrUpdateDailyNutrition({});
      if (result.error) return result;
      dailyNutritionId = result.data!.id;
    }

    try {
      const { data, error: insertError } = await supabase
        .from('meal_entries')
        .insert({
          ...entryData,
          daily_nutrition_id: dailyNutritionId,
          calories: 0, // Will be calculated by trigger
          protein: 0,
          carbs: 0,
          fat: 0,
          fiber: 0
        })
        .select()
        .single();

      if (insertError) {
        console.error('Error adding meal entry:', insertError);
        return { error: 'Öğün kaydı eklenemedi' };
      }

      await fetchMealEntries(); // Refresh the list
      return { data, error: null };
    } catch (err) {
      console.error('Unexpected error adding meal entry:', err);
      return { error: 'Beklenmeyen bir hata oluştu' };
    }
  };

  const getMealsByType = () => {
    return {
      breakfast: mealEntries.filter(entry => entry.meal_type === 'breakfast'),
      lunch: mealEntries.filter(entry => entry.meal_type === 'lunch'),
      dinner: mealEntries.filter(entry => entry.meal_type === 'dinner'),
      snacks: mealEntries.filter(entry => entry.meal_type === 'snacks')
    };
  };

  const getTotalNutrition = () => {
    return mealEntries.reduce(
      (total, entry) => ({
        calories: total.calories + (Number(entry.calories) || 0),
        protein: total.protein + (Number(entry.protein) || 0),
        carbs: total.carbs + (Number(entry.carbs) || 0),
        fat: total.fat + (Number(entry.fat) || 0),
        fiber: total.fiber + (Number(entry.fiber) || 0)
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 }
    );
  };

  return {
    mealEntries,
    loading,
    error,
    addMealEntry,
    getMealsByType,
    getTotalNutrition,
    refetch: fetchMealEntries
  };
}

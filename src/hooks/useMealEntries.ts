
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useDailyNutrition } from './useDailyNutrition';

// Define types based on the new schema structure
type MealEntry = {
  id: string;
  daily_nutrition_id: string;
  food_id: string;
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snacks';
  amount: number;
  unit: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  eaten_at: string;
  created_at: string;
};

type MealEntryInsert = {
  food_id: string;
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snacks';
  amount: number;
  unit: string;
};

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

      // Direct query with proper type handling
      const query = supabase
        .from('meal_entries' as any)
        .select('*')
        .eq('daily_nutrition_id', dailyNutrition.id);

      const { data, error: fetchError } = await query;

      if (fetchError) {
        console.error('Error fetching meal entries:', fetchError);
        setError('Öğün kayıtları alınamadı');
        return;
      }

      // Type assertion for the data array
      setMealEntries((data as MealEntry[]) || []);
    } catch (err) {
      console.error('Unexpected error fetching meal entries:', err);
      setError('Beklenmeyen bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const addMealEntry = async (entryData: MealEntryInsert) => {
    if (!user) return { error: 'Kullanıcı oturumu bulunamadı' };

    // Ensure daily nutrition record exists
    let dailyNutritionId = dailyNutrition?.id;
    if (!dailyNutritionId) {
      const result = await createOrUpdateDailyNutrition({});
      if (result.error) return result;
      // We'll need to refetch to get the ID
      setTimeout(() => fetchMealEntries(), 100);
      return { data: null, error: null };
    }

    try {
      // Get food nutrition data first to calculate values
      const { data: foodData, error: foodError } = await supabase
        .from('foods')
        .select('*')
        .eq('id', entryData.food_id)
        .single();

      if (foodError || !foodData) {
        console.error('Error fetching food data:', foodError);
        return { error: 'Besin verisi bulunamadı' };
      }

      // Calculate nutrition values
      const multiplier = entryData.amount / 100;
      const calculatedEntry = {
        daily_nutrition_id: dailyNutritionId,
        food_id: entryData.food_id,
        meal_type: entryData.meal_type,
        amount: entryData.amount,
        unit: entryData.unit,
        calories: Math.round(Number(foodData.calories_per_100g) * multiplier),
        protein: Number((Number(foodData.protein_per_100g) * multiplier).toFixed(2)),
        carbs: Number((Number(foodData.carbs_per_100g) * multiplier).toFixed(2)),
        fat: Number((Number(foodData.fat_per_100g) * multiplier).toFixed(2)),
        fiber: Number((Number(foodData.fiber_per_100g) * multiplier).toFixed(2))
      };

      const query = supabase
        .from('meal_entries' as any)
        .insert(calculatedEntry)
        .select()
        .single();

      const { data, error: insertError } = await query;

      if (insertError) {
        console.error('Error adding meal entry:', insertError);
        return { error: 'Öğün kaydı eklenemedi' };
      }

      await fetchMealEntries(); // Refresh the list
      return { data: data as MealEntry, error: null };
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

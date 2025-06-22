
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { toast } from 'sonner';

export type MealEntry = Database['public']['Tables']['meal_entries']['Row'] & {
  food?: {
    name: string;
    calories_per_100g: number;
    protein_per_100g: number;
    carbs_per_100g: number;
    fat_per_100g: number;
    fiber_per_100g: number;
  } | null;
};

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snacks';

interface CreateMealEntryData {
  food_id: string;
  amount: number;
  unit: string;
  meal_type: MealType;
  eaten_at?: string;
}

export function useMealEntries(date?: string) {
  const { user } = useAuth();
  const [mealEntries, setMealEntries] = useState<MealEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const targetDate = date || new Date().toISOString().split('T')[0];

  useEffect(() => {
    if (!user) {
      setMealEntries([]);
      setLoading(false);
      return;
    }

    fetchMealEntries();
  }, [user, targetDate]);

  const fetchMealEntries = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      // First get or create daily nutrition for the date
      let { data: dailyNutrition, error: dailyError } = await supabase
        .from('daily_nutrition')
        .select('id')
        .eq('user_id', user.id)
        .eq('date', targetDate)
        .maybeSingle();

      if (dailyError && dailyError.code !== 'PGRST116') {
        console.error('Error fetching daily nutrition:', dailyError);
        setError('Günlük beslenme verisi alınamadı');
        return;
      }

      if (!dailyNutrition) {
        // Create daily nutrition record if it doesn't exist
        const { data: newDaily, error: createError } = await supabase
          .from('daily_nutrition')
          .insert({
            user_id: user.id,
            date: targetDate
          })
          .select('id')
          .single();

        if (createError) {
          console.error('Error creating daily nutrition:', createError);
          setError('Günlük beslenme verisi oluşturulamadı');
          return;
        }

        dailyNutrition = newDaily;
      }

      const { data, error: fetchError } = await supabase
        .from('meal_entries')
        .select(`
          *,
          food:foods(
            name,
            calories_per_100g,
            protein_per_100g,
            carbs_per_100g,
            fat_per_100g,
            fiber_per_100g
          )
        `)
        .eq('daily_nutrition_id', dailyNutrition.id)
        .order('eaten_at', { ascending: false });

      if (fetchError) {
        console.error('Error fetching meal entries:', fetchError);
        setError('Yemek girişleri alınamadı');
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

  const addMealEntry = async (entryData: CreateMealEntryData) => {
    if (!user) return { error: 'Kullanıcı oturumu bulunamadı' };

    try {
      // Get or create daily nutrition record
      let { data: dailyNutrition, error: dailyError } = await supabase
        .from('daily_nutrition')
        .select('id')
        .eq('user_id', user.id)
        .eq('date', targetDate)
        .maybeSingle();

      if (dailyError && dailyError.code !== 'PGRST116') {
        console.error('Error fetching daily nutrition:', dailyError);
        return { error: 'Günlük beslenme verisi alınamadı' };
      }

      if (!dailyNutrition) {
        const { data: newDaily, error: createError } = await supabase
          .from('daily_nutrition')
          .insert({
            user_id: user.id,
            date: targetDate
          })
          .select('id')
          .single();

        if (createError) {
          console.error('Error creating daily nutrition:', createError);
          return { error: 'Günlük beslenme verisi oluşturulamadı' };
        }

        dailyNutrition = newDaily;
      }

      // Get food details to calculate nutrition
      const { data: food, error: foodError } = await supabase
        .from('foods')
        .select('*')
        .eq('id', entryData.food_id)
        .single();

      if (foodError) {
        console.error('Error fetching food:', foodError);
        return { error: 'Gıda bilgisi alınamadı' };
      }

      // Calculate nutrition based on amount
      const multiplier = entryData.amount / 100; // Assuming base is per 100g
      const calories = Math.round(food.calories_per_100g * multiplier);
      const protein = Math.round(Number(food.protein_per_100g) * multiplier);
      const carbs = Math.round(Number(food.carbs_per_100g) * multiplier);
      const fat = Math.round(Number(food.fat_per_100g) * multiplier);
      const fiber = Math.round(Number(food.fiber_per_100g) * multiplier);

      const { data, error: insertError } = await supabase
        .from('meal_entries')
        .insert({
          daily_nutrition_id: dailyNutrition.id,
          food_id: entryData.food_id,
          amount: entryData.amount,
          unit: entryData.unit,
          meal_type: entryData.meal_type,
          calories,
          protein,
          carbs,
          fat,
          fiber,
          eaten_at: entryData.eaten_at || new Date().toISOString()
        })
        .select()
        .single();

      if (insertError) {
        console.error('Error creating meal entry:', insertError);
        toast.error('Yemek girişi oluşturulamadı');
        return { error: 'Yemek girişi oluşturulamadı' };
      }

      toast.success('Yemek başarıyla eklendi');
      await fetchMealEntries();
      return { data, error: null };
    } catch (err) {
      console.error('Unexpected error creating meal entry:', err);
      toast.error('Beklenmeyen bir hata oluştu');
      return { error: 'Beklenmeyen bir hata oluştu' };
    }
  };

  const deleteMealEntry = async (entryId: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('meal_entries')
        .delete()
        .eq('id', entryId);

      if (deleteError) {
        console.error('Error deleting meal entry:', deleteError);
        toast.error('Yemek girişi silinemedi');
        return { error: 'Yemek girişi silinemedi' };
      }

      toast.success('Yemek girişi silindi');
      await fetchMealEntries();
      return { error: null };
    } catch (err) {
      console.error('Unexpected error deleting meal entry:', err);
      toast.error('Beklenmeyen bir hata oluştu');
      return { error: 'Beklenmeyen bir hata oluştu' };
    }
  };

  const getMealsByType = (mealType: MealType) => {
    return mealEntries.filter(entry => entry.meal_type === mealType);
  };

  const getTotalNutrition = () => {
    return mealEntries.reduce(
      (total, entry) => ({
        calories: total.calories + entry.calories,
        protein: total.protein + Number(entry.protein),
        carbs: total.carbs + Number(entry.carbs),
        fat: total.fat + Number(entry.fat),
        fiber: total.fiber + Number(entry.fiber)
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 }
    );
  };

  return {
    mealEntries,
    loading,
    error,
    addMealEntry,
    deleteMealEntry,
    getMealsByType,
    getTotalNutrition,
    refetch: fetchMealEntries
  };
}

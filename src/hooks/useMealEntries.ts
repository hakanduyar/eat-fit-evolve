
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { toast } from 'sonner';

type MealEntry = Database['public']['Tables']['meal_entries']['Row'] & {
  food?: Database['public']['Tables']['foods']['Row'];
};

type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snacks';

interface AddMealEntryData {
  food_id: string;
  meal_type: MealType;
  amount: number;
  unit: string;
}

export function useMealEntries(selectedDate?: string) {
  const { user } = useAuth();
  const [mealEntries, setMealEntries] = useState<MealEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const currentDate = selectedDate || new Date().toISOString().split('T')[0];

  useEffect(() => {
    if (user) {
      fetchMealEntries();
    }
  }, [user, currentDate]);

  const fetchMealEntries = async () => {
    try {
      setLoading(true);
      setError(null);

      // First get or create daily nutrition entry
      let { data: dailyNutrition, error: dailyError } = await supabase
        .from('daily_nutrition')
        .select('*')
        .eq('user_id', user?.id)
        .eq('date', currentDate)
        .maybeSingle();

      if (dailyError && dailyError.code !== 'PGRST116') {
        throw dailyError;
      }

      if (!dailyNutrition) {
        const { data: newDaily, error: createError } = await supabase
          .from('daily_nutrition')
          .insert([{
            user_id: user?.id,
            date: currentDate
          }])
          .select()
          .single();

        if (createError) throw createError;
        dailyNutrition = newDaily;
      }

      // Get meal entries with food details
      const { data: entries, error: entriesError } = await supabase
        .from('meal_entries')
        .select(`
          *,
          food:foods(*)
        `)
        .eq('daily_nutrition_id', dailyNutrition.id)
        .order('eaten_at', { ascending: true });

      if (entriesError) throw entriesError;

      setMealEntries(entries || []);
    } catch (err) {
      console.error('Error fetching meal entries:', err);
      setError('Öğün verileri alınamadı');
    } finally {
      setLoading(false);
    }
  };

  const addMealEntry = async (data: AddMealEntryData) => {
    try {
      if (!user) throw new Error('User not authenticated');

      // Get food details
      const { data: food, error: foodError } = await supabase
        .from('foods')
        .select('*')
        .eq('id', data.food_id)
        .single();

      if (foodError) throw foodError;

      // Get or create daily nutrition entry
      let { data: dailyNutrition, error: dailyError } = await supabase
        .from('daily_nutrition')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', currentDate)
        .maybeSingle();

      if (!dailyNutrition) {
        const { data: newDaily, error: createError } = await supabase
          .from('daily_nutrition')
          .insert([{
            user_id: user.id,
            date: currentDate
          }])
          .select()
          .single();

        if (createError) throw createError;
        dailyNutrition = newDaily;
      }

      // Calculate nutrition values
      const multiplier = data.amount / 100;
      const calories = Math.round(food.calories_per_100g * multiplier);
      const protein = Number((food.protein_per_100g * multiplier).toFixed(2));
      const carbs = Number((food.carbs_per_100g * multiplier).toFixed(2));
      const fat = Number((food.fat_per_100g * multiplier).toFixed(2));
      const fiber = Number((food.fiber_per_100g * multiplier).toFixed(2));

      // Add meal entry
      const { data: newEntry, error: entryError } = await supabase
        .from('meal_entries')
        .insert([{
          daily_nutrition_id: dailyNutrition.id,
          food_id: data.food_id,
          meal_type: data.meal_type,
          amount: data.amount,
          unit: data.unit,
          calories,
          protein,
          carbs,
          fat,
          fiber
        }])
        .select(`
          *,
          food:foods(*)
        `)
        .single();

      if (entryError) throw entryError;

      setMealEntries(prev => [...prev, newEntry]);
      toast.success('Yemek başarıyla eklendi');
      
      return { data: newEntry, error: null };
    } catch (err) {
      console.error('Error adding meal entry:', err);
      const errorMessage = 'Yemek eklenirken hata oluştu';
      toast.error(errorMessage);
      return { data: null, error: errorMessage };
    }
  };

  const deleteMealEntry = async (entryId: string) => {
    try {
      const { error } = await supabase
        .from('meal_entries')
        .delete()
        .eq('id', entryId);

      if (error) throw error;

      setMealEntries(prev => prev.filter(entry => entry.id !== entryId));
      toast.success('Yemek başarıyla silindi');
      
      return { error: null };
    } catch (err) {
      console.error('Error deleting meal entry:', err);
      const errorMessage = 'Yemek silinirken hata oluştu';
      toast.error(errorMessage);
      return { error: errorMessage };
    }
  };

  const getTotalNutrition = () => {
    return mealEntries.reduce((total, entry) => ({
      calories: total.calories + entry.calories,
      protein: total.protein + Number(entry.protein),
      carbs: total.carbs + Number(entry.carbs),
      fat: total.fat + Number(entry.fat),
      fiber: total.fiber + Number(entry.fiber)
    }), {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      fiber: 0
    });
  };

  const getMealsByType = () => {
    return {
      breakfast: mealEntries.filter(entry => entry.meal_type === 'breakfast'),
      lunch: mealEntries.filter(entry => entry.meal_type === 'lunch'),
      dinner: mealEntries.filter(entry => entry.meal_type === 'dinner'),
      snacks: mealEntries.filter(entry => entry.meal_type === 'snacks')
    };
  };

  return {
    mealEntries,
    loading,
    error,
    addMealEntry,
    deleteMealEntry,
    getTotalNutrition,
    getMealsByType,
    refetch: fetchMealEntries
  };
}


import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type Meal = Database['public']['Tables']['meals']['Row'];
type MealInsert = Database['public']['Tables']['meals']['Insert'];

export function useMeals(date?: string) {
  const { user } = useAuth();
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const targetDate = date || new Date().toISOString().split('T')[0];

  useEffect(() => {
    if (!user) {
      setMeals([]);
      setLoading(false);
      return;
    }

    fetchMeals();
  }, [user, targetDate]);

  const fetchMeals = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('meals')
        .select('*')
        .eq('user_id', user!.id)
        .eq('date', targetDate)
        .order('created_at', { ascending: true });

      if (fetchError) {
        console.error('Error fetching meals:', fetchError);
        setError('Öğünler alınamadı');
        return;
      }

      setMeals(data || []);
    } catch (err) {
      console.error('Unexpected error fetching meals:', err);
      setError('Beklenmeyen bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const createMeal = async (mealData: Omit<MealInsert, 'user_id'>) => {
    if (!user) return { error: 'Kullanıcı oturumu bulunamadı' };

    try {
      const { data, error: insertError } = await supabase
        .from('meals')
        .insert({
          ...mealData,
          user_id: user.id,
          date: mealData.date || targetDate
        })
        .select()
        .single();

      if (insertError) {
        console.error('Error creating meal:', insertError);
        return { error: 'Öğün oluşturulamadı' };
      }

      await fetchMeals(); // Refresh the list
      return { data, error: null };
    } catch (err) {
      console.error('Unexpected error creating meal:', err);
      return { error: 'Beklenmeyen bir hata oluştu' };
    }
  };

  const getTotalNutrition = () => {
    return meals.reduce(
      (total, meal) => ({
        calories: total.calories + (meal.total_calories || 0),
        protein: total.protein + (meal.total_protein || 0),
        carbs: total.carbs + (meal.total_carbs || 0),
        fat: total.fat + (meal.total_fat || 0)
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );
  };

  return {
    meals,
    loading,
    error,
    createMeal,
    refetch: fetchMeals,
    getTotalNutrition
  };
}

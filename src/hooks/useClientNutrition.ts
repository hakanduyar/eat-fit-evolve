
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export type ClientNutritionEntry = {
  id: string;
  meal_type: string;
  amount: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  eaten_at: string;
  created_at: string;
  unit: string;
  food: {
    name: string;
  } | null;
};

export type DailyNutritionSummary = {
  date: string;
  total_calories: number;
  total_protein: number;
  total_carbs: number;
  total_fat: number;
  total_fiber: number;
  entries: ClientNutritionEntry[];
};

export function useClientNutrition(clientId?: string) {
  const { profile } = useAuth();
  const [nutritionData, setNutritionData] = useState<DailyNutritionSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!profile || !clientId || profile.role === 'user') {
      setNutritionData([]);
      setLoading(false);
      return;
    }

    fetchClientNutrition();
  }, [profile, clientId]);

  const fetchClientNutrition = async () => {
    if (!profile || !clientId || profile.role === 'user') return;

    try {
      setLoading(true);
      setError(null);

      // First verify that this client is connected to the current dietitian
      const { data: connection, error: connectionError } = await supabase
        .from('client_connections')
        .select('id')
        .eq('client_id', clientId)
        .eq('dietitian_id', profile.id)
        .eq('status', 'active')
        .maybeSingle();

      if (connectionError) {
        console.error('Error checking client connection:', connectionError);
        setError('Danışan bağlantısı kontrol edilemedi');
        return;
      }

      if (!connection) {
        setError('Bu danışana erişim izniniz yok');
        return;
      }

      // Fetch meal entries for the last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data: entries, error: entriesError } = await supabase
        .from('meal_entries')
        .select(`
          *,
          daily_nutrition!inner(
            user_id,
            date
          ),
          foods(name)
        `)
        .eq('daily_nutrition.user_id', clientId)
        .gte('daily_nutrition.date', thirtyDaysAgo.toISOString().split('T')[0])
        .order('eaten_at', { ascending: false });

      if (entriesError) {
        console.error('Error fetching nutrition entries:', entriesError);
        setError('Beslenme verileri alınamadı');
        return;
      }

      // Group entries by date and calculate daily totals
      const groupedData: { [key: string]: DailyNutritionSummary } = {};

      (entries || []).forEach((entry: any) => {
        const date = entry.daily_nutrition.date;
        
        if (!groupedData[date]) {
          groupedData[date] = {
            date,
            total_calories: 0,
            total_protein: 0,
            total_carbs: 0,
            total_fat: 0,
            total_fiber: 0,
            entries: []
          };
        }

        const nutritionEntry: ClientNutritionEntry = {
          id: entry.id,
          meal_type: entry.meal_type,
          amount: entry.amount,
          calories: entry.calories,
          protein: entry.protein,
          carbs: entry.carbs,
          fat: entry.fat,
          fiber: entry.fiber,
          eaten_at: entry.eaten_at,
          created_at: entry.created_at,
          unit: entry.unit,
          food: entry.foods
        };

        groupedData[date].entries.push(nutritionEntry);
        groupedData[date].total_calories += entry.calories;
        groupedData[date].total_protein += entry.protein;
        groupedData[date].total_carbs += entry.carbs;
        groupedData[date].total_fat += entry.fat;
        groupedData[date].total_fiber += entry.fiber;
      });

      // Convert to array and sort by date (newest first)
      const sortedData = Object.values(groupedData)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      setNutritionData(sortedData);
    } catch (err) {
      console.error('Unexpected error fetching client nutrition:', err);
      setError('Beklenmeyen bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return {
    nutritionData,
    loading,
    error,
    refetch: fetchClientNutrition
  };
}

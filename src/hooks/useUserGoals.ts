
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type UserGoals = Database['public']['Tables']['user_goals']['Row'];
type UserGoalsInsert = Database['public']['Tables']['user_goals']['Insert'];
type UserGoalsUpdate = Database['public']['Tables']['user_goals']['Update'];

export function useUserGoals() {
  const { user } = useAuth();
  const [goals, setGoals] = useState<UserGoals | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setGoals(null);
      setLoading(false);
      return;
    }

    fetchUserGoals();
  }, [user]);

  const fetchUserGoals = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('user_goals')
        .select('*')
        .eq('user_id', user!.id)
        .maybeSingle();

      if (fetchError) {
        console.error('Error fetching user goals:', fetchError);
        setError('Hedefler alınamadı');
        return;
      }

      setGoals(data);
    } catch (err) {
      console.error('Unexpected error fetching goals:', err);
      setError('Beklenmeyen bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const createGoals = async (goalsData: Omit<UserGoalsInsert, 'user_id'>) => {
    if (!user) return { error: 'Kullanıcı oturumu bulunamadı' };

    try {
      const { data, error: insertError } = await supabase
        .from('user_goals')
        .insert({
          ...goalsData,
          user_id: user.id
        })
        .select()
        .single();

      if (insertError) {
        console.error('Error creating goals:', insertError);
        return { error: 'Hedefler oluşturulamadı' };
      }

      setGoals(data);
      return { data, error: null };
    } catch (err) {
      console.error('Unexpected error creating goals:', err);
      return { error: 'Beklenmeyen bir hata oluştu' };
    }
  };

  const updateGoals = async (updates: UserGoalsUpdate) => {
    if (!user || !goals) return { error: 'Kullanıcı oturumu veya hedefler bulunamadı' };

    try {
      const { data, error: updateError } = await supabase
        .from('user_goals')
        .update(updates)
        .eq('user_id', user.id)
        .select()
        .single();

      if (updateError) {
        console.error('Error updating goals:', updateError);
        return { error: 'Hedefler güncellenemedi' };
      }

      setGoals(data);
      return { data, error: null };
    } catch (err) {
      console.error('Unexpected error updating goals:', err);
      return { error: 'Beklenmeyen bir hata oluştu' };
    }
  };

  return {
    goals,
    loading,
    error,
    createGoals,
    updateGoals,
    refetch: fetchUserGoals
  };
}

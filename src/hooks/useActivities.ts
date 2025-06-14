
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type Activity = Database['public']['Tables']['activities']['Row'];
type ActivityInsert = Database['public']['Tables']['activities']['Insert'];

export function useActivities(date?: string) {
  const { user } = useAuth();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const targetDate = date || new Date().toISOString().split('T')[0];

  useEffect(() => {
    if (!user) {
      setActivities([]);
      setLoading(false);
      return;
    }

    fetchActivities();
  }, [user, targetDate]);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('activities')
        .select('*')
        .eq('user_id', user!.id)
        .eq('date', targetDate)
        .order('created_at', { ascending: false });

      if (fetchError) {
        console.error('Error fetching activities:', fetchError);
        setError('Aktiviteler alınamadı');
        return;
      }

      setActivities(data || []);
    } catch (err) {
      console.error('Unexpected error fetching activities:', err);
      setError('Beklenmeyen bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const createActivity = async (activityData: Omit<ActivityInsert, 'user_id'>) => {
    if (!user) return { error: 'Kullanıcı oturumu bulunamadı' };

    try {
      const { data, error: insertError } = await supabase
        .from('activities')
        .insert({
          ...activityData,
          user_id: user.id,
          date: activityData.date || targetDate
        })
        .select()
        .single();

      if (insertError) {
        console.error('Error creating activity:', insertError);
        return { error: 'Aktivite oluşturulamadı' };
      }

      await fetchActivities(); // Refresh the list
      return { data, error: null };
    } catch (err) {
      console.error('Unexpected error creating activity:', err);
      return { error: 'Beklenmeyen bir hata oluştu' };
    }
  };

  const getTotalStats = () => {
    return activities.reduce(
      (total, activity) => ({
        duration: total.duration + activity.duration_minutes,
        calories: total.calories + (activity.calories_burned || 0)
      }),
      { duration: 0, calories: 0 }
    );
  };

  return {
    activities,
    loading,
    error,
    createActivity,
    refetch: fetchActivities,
    getTotalStats
  };
}

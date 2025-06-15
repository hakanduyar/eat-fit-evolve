
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { toast } from 'sonner';

type Appointment = Database['public']['Tables']['appointments']['Row'] & {
  client_profile?: {
    full_name: string;
    email: string;
  } | null;
  professional_profile?: {
    full_name: string;
    email: string;
  } | null;
};

interface CreateAppointmentData {
  client_id: string;
  title: string;
  description?: string;
  scheduled_at: string;
  duration_minutes?: number;
}

export function useAppointments() {
  const { user, profile } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchAppointments();
    }
  }, [user]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('appointments')
        .select('*')
        .order('scheduled_at', { ascending: true });

      // Filter based on user role
      if (profile?.role === 'user') {
        query = query.eq('client_id', user?.id);
      } else {
        query = query.eq('professional_id', user?.id);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      // Convert to typed data without profile relationships for now
      const typedData = (data || []).map(item => ({
        ...item,
        client_profile: null,
        professional_profile: null
      })) as Appointment[];
      
      setAppointments(typedData);
    } catch (err) {
      console.error('Error fetching appointments:', err);
      setError('Randevular alınamadı');
    } finally {
      setLoading(false);
    }
  };

  const createAppointment = async (appointmentData: CreateAppointmentData) => {
    try {
      if (!user || profile?.role === 'user') {
        throw new Error('Sadece uzmanlar randevu oluşturabilir');
      }

      const { data, error } = await supabase
        .from('appointments')
        .insert([{
          professional_id: user.id,
          client_id: appointmentData.client_id,
          title: appointmentData.title,
          description: appointmentData.description,
          scheduled_at: appointmentData.scheduled_at,
          duration_minutes: appointmentData.duration_minutes || 60,
          status: 'scheduled'
        }])
        .select()
        .single();

      if (error) throw error;

      const typedData = {
        ...data,
        client_profile: null,
        professional_profile: null
      } as Appointment;
      
      setAppointments(prev => [...prev, typedData]);
      toast.success('Randevu başarıyla oluşturuldu');
      
      return { data: typedData, error: null };
    } catch (err) {
      console.error('Error creating appointment:', err);
      const errorMessage = err instanceof Error ? err.message : 'Randevu oluşturulurken hata oluştu';
      toast.error(errorMessage);
      return { data: null, error: errorMessage };
    }
  };

  const updateAppointment = async (appointmentId: string, updates: Partial<Appointment>) => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .update(updates)
        .eq('id', appointmentId)
        .select()
        .single();

      if (error) throw error;

      const typedData = {
        ...data,
        client_profile: null,
        professional_profile: null
      } as Appointment;
      
      setAppointments(prev => 
        prev.map(appointment => 
          appointment.id === appointmentId ? typedData : appointment
        )
      );
      
      toast.success('Randevu güncellendi');
      return { data: typedData, error: null };
    } catch (err) {
      console.error('Error updating appointment:', err);
      const errorMessage = 'Randevu güncellenirken hata oluştu';
      toast.error(errorMessage);
      return { data: null, error: errorMessage };
    }
  };

  const deleteAppointment = async (appointmentId: string) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .delete()
        .eq('id', appointmentId);

      if (error) throw error;

      setAppointments(prev => prev.filter(appointment => appointment.id !== appointmentId));
      toast.success('Randevu iptal edildi');
      
      return { error: null };
    } catch (err) {
      console.error('Error deleting appointment:', err);
      const errorMessage = 'Randevu iptal edilirken hata oluştu';
      toast.error(errorMessage);
      return { error: errorMessage };
    }
  };

  const getUpcomingAppointments = () => {
    const now = new Date().toISOString();
    return appointments.filter(appointment => 
      appointment.scheduled_at > now && appointment.status === 'scheduled'
    );
  };

  const getTodaysAppointments = () => {
    const today = new Date().toISOString().split('T')[0];
    return appointments.filter(appointment => 
      appointment.scheduled_at.startsWith(today) && appointment.status === 'scheduled'
    );
  };

  return {
    appointments,
    loading,
    error,
    createAppointment,
    updateAppointment,
    deleteAppointment,
    getUpcomingAppointments,
    getTodaysAppointments,
    refetch: fetchAppointments
  };
}

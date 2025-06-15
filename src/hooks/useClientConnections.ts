
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export type ClientConnection = {
  id: string;
  client_id: string;
  dietitian_id: string;
  status: 'pending' | 'active' | 'paused' | 'terminated';
  connection_type: 'nutrition_only' | 'fitness_only' | 'full_support';
  start_date: string | null;
  end_date: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  client_profile?: {
    id: string;
    full_name: string;
    email: string;
    phone: string | null;
  };
  professional_profile?: {
    id: string;
    full_name: string;
    email: string;
    phone: string | null;
  };
};

export function useClientConnections() {
  const { profile } = useAuth();
  const [connections, setConnections] = useState<ClientConnection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!profile) {
      setConnections([]);
      setLoading(false);
      return;
    }

    fetchConnections();
  }, [profile]);

  const fetchConnections = async () => {
    if (!profile) return;

    try {
      setLoading(true);
      setError(null);

      const query = supabase
        .from('client_connections')
        .select(`
          *,
          client_profile:profiles!client_connections_client_id_fkey (
            id,
            full_name,
            email,
            phone
          ),
          professional_profile:profiles!client_connections_dietitian_id_fkey (
            id,
            full_name,
            email,
            phone
          )
        `);

      if (profile.role === 'user') {
        query.eq('client_id', profile.user_id);
      } else {
        query.eq('dietitian_id', profile.user_id);
      }

      const { data, error: fetchError } = await query.order('created_at', { ascending: false });

      if (fetchError) {
        console.error('Error fetching connections:', fetchError);
        setError('Bağlantılar alınamadı');
        return;
      }

      const typedConnections = (data || []).map(item => ({
        ...item,
        status: item.status as 'pending' | 'active' | 'paused' | 'terminated',
        connection_type: item.connection_type as 'nutrition_only' | 'fitness_only' | 'full_support'
      }));

      setConnections(typedConnections);
    } catch (err) {
      console.error('Unexpected error fetching connections:', err);
      setError('Beklenmeyen bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const createConnection = async (
    clientEmail: string, 
    connectionType: ClientConnection['connection_type'],
    professionalType: 'dietitian' | 'trainer',
    notes?: string
  ) => {
    if (!profile || profile.role === 'user') {
      return { error: 'Sadece profesyoneller bağlantı oluşturabilir' };
    }

    try {
      const { data: clientProfile, error: clientError } = await supabase
        .from('profiles')
        .select('id, user_id, full_name, email, role')
        .eq('email', clientEmail.toLowerCase())
        .eq('role', 'user')
        .maybeSingle();

      if (clientError || !clientProfile) {
        return { error: 'Danışan bulunamadı' };
      }

      const { data, error: insertError } = await supabase
        .from('client_connections')
        .insert({
          client_id: clientProfile.user_id,
          dietitian_id: profile.user_id,
          connection_type: connectionType,
          notes,
          status: 'pending'
        })
        .select()
        .single();

      if (insertError) {
        console.error('Error creating connection:', insertError);
        if (insertError.code === '23505') {
          return { error: 'Bu danışan ile zaten bir bağlantı var' };
        }
        return { error: 'Bağlantı oluşturulamadı' };
      }

      await fetchConnections();
      return { data, error: null };
    } catch (err) {
      console.error('Unexpected error creating connection:', err);
      return { error: 'Beklenmeyen bir hata oluştu' };
    }
  };

  const updateConnectionStatus = async (
    connectionId: string, 
    status: ClientConnection['status']
  ) => {
    try {
      const { error: updateError } = await supabase
        .from('client_connections')
        .update({ status })
        .eq('id', connectionId);

      if (updateError) {
        console.error('Error updating connection status:', updateError);
        return { error: 'Bağlantı durumu güncellenemedi' };
      }

      await fetchConnections();
      return { error: null };
    } catch (err) {
      console.error('Unexpected error updating status:', err);
      return { error: 'Beklenmeyen bir hata oluştu' };
    }
  };

  return {
    connections,
    loading,
    error,
    createConnection,
    updateConnectionStatus,
    refetch: fetchConnections
  };
}


import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

export type ClientConnection = Database['public']['Tables']['client_connections']['Row'] & {
  client_profile?: {
    id: string;
    full_name: string;
    email: string;
    phone: string | null;
  } | null;
  professional_profile?: {
    id: string;
    full_name: string;
    email: string;
    phone: string | null;
  } | null;
};

export function useClientConnections() {
  const { user, profile } = useAuth();
  const [connections, setConnections] = useState<ClientConnection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user || !profile) {
      setConnections([]);
      setLoading(false);
      return;
    }

    fetchConnections();
  }, [user, profile]);

  const fetchConnections = async () => {
    if (!user || !profile) return;

    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('client_connections')
        .select(`
          *,
          client_profile:profiles!client_connections_client_id_fkey(
            id,
            full_name,
            email,
            phone
          ),
          professional_profile:profiles!client_connections_dietitian_id_fkey(
            id,
            full_name,
            email,
            phone
          )
        `);

      if (profile.role === 'user') {
        query = query.eq('client_id', user.id);
      } else {
        query = query.eq('dietitian_id', user.id);
      }

      const { data, error: fetchError } = await query.order('created_at', { ascending: false });

      if (fetchError) {
        console.error('Error fetching connections:', fetchError);
        setError('Bağlantılar alınamadı');
        return;
      }

      // Type assertion to handle the complex joined data with null checks
      const typedConnections = (data || []).map(connection => ({
        ...connection,
        client_profile: connection.client_profile && typeof connection.client_profile === 'object' && !Array.isArray(connection.client_profile) && !('error' in connection.client_profile) 
          ? connection.client_profile as { id: string; full_name: string; email: string; phone: string | null; }
          : null,
        professional_profile: connection.professional_profile && typeof connection.professional_profile === 'object' && !Array.isArray(connection.professional_profile) && !('error' in connection.professional_profile)
          ? connection.professional_profile as { id: string; full_name: string; email: string; phone: string | null; }
          : null
      })) as ClientConnection[];

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
    connectionType: 'nutrition_only' | 'fitness_only' | 'full_support',
    notes?: string
  ) => {
    if (!user || !profile || profile.role === 'user') {
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

      // Check if connection already exists
      const { data: existingConnection } = await supabase
        .from('client_connections')
        .select('id')
        .eq('client_id', clientProfile.user_id)
        .eq('dietitian_id', user.id)
        .maybeSingle();

      if (existingConnection) {
        return { error: 'Bu danışan ile zaten bir bağlantı var' };
      }

      const { data, error: insertError } = await supabase
        .from('client_connections')
        .insert({
          client_id: clientProfile.user_id,
          dietitian_id: user.id,
          connection_type: connectionType,
          notes,
          status: 'pending'
        })
        .select()
        .single();

      if (insertError) {
        console.error('Error creating connection:', insertError);
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
    status: 'pending' | 'active' | 'paused' | 'terminated'
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

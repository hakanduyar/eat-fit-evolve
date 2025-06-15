
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export type ClientConnection = {
  id: string;
  dietitian_id: string;
  client_id: string;
  status: 'pending' | 'active' | 'inactive' | 'terminated';
  connection_type: 'nutrition_only' | 'full_support';
  start_date: string;
  end_date: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  client_profile: {
    id: string;
    full_name: string;
    email: string;
    phone: string | null;
  } | null;
};

type ClientConnectionInsert = {
  client_id: string;
  connection_type: 'nutrition_only' | 'full_support';
  notes?: string;
};

export function useClientConnections() {
  const { profile } = useAuth();
  const [connections, setConnections] = useState<ClientConnection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!profile || profile.role === 'user') {
      setConnections([]);
      setLoading(false);
      return;
    }

    fetchConnections();
  }, [profile]);

  const fetchConnections = async () => {
    if (!profile || profile.role === 'user') return;

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('client_connections')
        .select(`
          *,
          client_profile:profiles!client_connections_client_id_fkey (
            id,
            full_name,
            email,
            phone
          )
        `)
        .eq('dietitian_id', profile.id)
        .order('created_at', { ascending: false });

      if (fetchError) {
        console.error('Error fetching client connections:', fetchError);
        setError('Danışan bağlantıları alınamadı');
        return;
      }

      setConnections(data as ClientConnection[] || []);
    } catch (err) {
      console.error('Unexpected error fetching connections:', err);
      setError('Beklenmeyen bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const addClientConnection = async (connectionData: ClientConnectionInsert) => {
    if (!profile || profile.role === 'user') {
      return { error: 'Sadece diyetisyenler danışan ekleyebilir' };
    }

    try {
      const { data, error: insertError } = await supabase
        .from('client_connections')
        .insert({
          dietitian_id: profile.id,
          client_id: connectionData.client_id,
          connection_type: connectionData.connection_type,
          notes: connectionData.notes || null,
          status: 'active'
        })
        .select(`
          *,
          client_profile:profiles!client_connections_client_id_fkey (
            id,
            full_name,
            email,
            phone
          )
        `)
        .single();

      if (insertError) {
        console.error('Error adding client connection:', insertError);
        if (insertError.code === '23505') {
          return { error: 'Bu danışan zaten eklenmiş' };
        }
        return { error: 'Danışan bağlantısı eklenemedi' };
      }

      await fetchConnections(); // Refresh list
      return { data: data as ClientConnection, error: null };
    } catch (err) {
      console.error('Unexpected error adding connection:', err);
      return { error: 'Beklenmeyen bir hata oluştu' };
    }
  };

  const updateConnectionStatus = async (connectionId: string, status: ClientConnection['status']) => {
    if (!profile || profile.role === 'user') {
      return { error: 'İzin yok' };
    }

    try {
      const { error: updateError } = await supabase
        .from('client_connections')
        .update({ status })
        .eq('id', connectionId)
        .eq('dietitian_id', profile.id);

      if (updateError) {
        console.error('Error updating connection status:', updateError);
        return { error: 'Bağlantı durumu güncellenemedi' };
      }

      await fetchConnections(); // Refresh list
      return { error: null };
    } catch (err) {
      console.error('Unexpected error updating status:', err);
      return { error: 'Beklenmeyen bir hata oluştu' };
    }
  };

  const searchUserByEmail = async (email: string) => {
    try {
      const { data, error: searchError } = await supabase
        .from('profiles')
        .select('id, full_name, email, role')
        .eq('email', email.toLowerCase())
        .eq('role', 'user')
        .maybeSingle();

      if (searchError) {
        console.error('Error searching user:', searchError);
        return { data: null, error: 'Kullanıcı aranamadı' };
      }

      return { data, error: null };
    } catch (err) {
      console.error('Unexpected error searching user:', err);
      return { data: null, error: 'Beklenmeyen bir hata oluştu' };
    }
  };

  return {
    connections,
    loading,
    error,
    addClientConnection,
    updateConnectionStatus,
    searchUserByEmail,
    refetch: fetchConnections
  };
}

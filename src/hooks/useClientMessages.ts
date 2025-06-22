
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

export type ClientMessage = Database['public']['Tables']['client_messages']['Row'] & {
  sender_profile?: {
    full_name: string;
    role: string;
  } | null;
};

export function useClientMessages(connectionId?: string) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ClientMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user || !connectionId) {
      setMessages([]);
      setLoading(false);
      return;
    }

    fetchMessages();
    
    // Set up real-time subscription
    const subscription = supabase
      .channel(`messages-${connectionId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'client_messages',
          filter: `connection_id=eq.${connectionId}`
        },
        () => {
          fetchMessages();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user, connectionId]);

  const fetchMessages = async () => {
    if (!user || !connectionId) return;

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('client_messages')
        .select(`
          *,
          sender_profile:profiles!client_messages_sender_id_fkey(
            full_name,
            role
          )
        `)
        .eq('connection_id', connectionId)
        .order('sent_at', { ascending: true });

      if (fetchError) {
        console.error('Error fetching messages:', fetchError);
        setError('Mesajlar alınamadı');
        return;
      }

      setMessages(data || []);
    } catch (err) {
      console.error('Unexpected error fetching messages:', err);
      setError('Beklenmeyen bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (
    recipientId: string,
    message: string,
    messageType: 'text' = 'text'
  ) => {
    if (!user || !connectionId || !message.trim()) {
      return { error: 'Geçersiz mesaj' };
    }

    try {
      const { data, error } = await supabase
        .from('client_messages')
        .insert({
          connection_id: connectionId,
          sender_id: user.id,
          recipient_id: recipientId,
          message: message.trim(),
          message_type: messageType
        })
        .select()
        .single();

      if (error) {
        console.error('Error sending message:', error);
        return { error: 'Mesaj gönderilemedi' };
      }

      return { data, error: null };
    } catch (err) {
      console.error('Unexpected error sending message:', err);
      return { error: 'Beklenmeyen bir hata oluştu' };
    }
  };

  const markAsRead = async (messageId: string) => {
    if (!user) return { error: 'Kullanıcı oturumu bulunamadı' };

    try {
      const { error } = await supabase
        .from('client_messages')
        .update({ read_at: new Date().toISOString() })
        .eq('id', messageId)
        .eq('recipient_id', user.id);

      if (error) {
        console.error('Error marking message as read:', error);
        return { error: 'Mesaj okundu olarak işaretlenemedi' };
      }

      return { error: null };
    } catch (err) {
      console.error('Unexpected error marking message as read:', err);
      return { error: 'Beklenmeyen bir hata oluştu' };
    }
  };

  return {
    messages,
    loading,
    error,
    sendMessage,
    markAsRead,
    refetch: fetchMessages
  };
}

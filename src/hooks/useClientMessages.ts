
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export type ClientMessage = {
  id: string;
  connection_id: string;
  sender_id: string;
  recipient_id: string;
  message: string;
  message_type: 'text';
  sent_at: string;
  read_at: string | null;
  created_at: string;
  sender_profile?: {
    full_name: string;
    role: string;
  };
};

export function useClientMessages(connectionId?: string) {
  const { user } = useAuth(); // Use user instead of profile for auth.uid()
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
  }, [user, connectionId]);

  const fetchMessages = async () => {
    if (!user || !connectionId) return;

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('client_messages')
        .select('*')
        .eq('connection_id', connectionId)
        .order('sent_at', { ascending: true });

      if (fetchError) {
        console.error('Error fetching messages:', fetchError);
        setError('Mesajlar alınamadı');
        return;
      }

      const typedMessages = (data || []).map(item => ({
        ...item,
        message_type: item.message_type as 'text',
        sender_profile: undefined
      })) as ClientMessage[];

      setMessages(typedMessages);
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
    messageType: ClientMessage['message_type'] = 'text'
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

      await fetchMessages();
      return { data, error: null };
    } catch (err) {
      console.error('Unexpected error sending message:', err);
      return { error: 'Beklenmeyen bir hata oluştu' };
    }
  };

  const markAsRead = async (messageId: string) => {
    try {
      const { error } = await supabase
        .from('client_messages')
        .update({ read_at: new Date().toISOString() })
        .eq('id', messageId)
        .eq('recipient_id', user?.id);

      if (error) {
        console.error('Error marking message as read:', error);
        return { error: 'Mesaj okundu olarak işaretlenemedi' };
      }

      await fetchMessages();
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


import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export type Message = {
  id: string;
  content: string;
  sender_id: string;
  thread_id: string;
  sent_at: string;
  read_at: string | null;
  message_type: string;
  sender_profile?: {
    full_name: string;
    role: string;
  };
};

export type MessageThread = {
  id: string;
  client_id: string;
  dietitian_id: string;
  created_at: string;
  updated_at: string;
  client_profile?: {
    full_name: string;
    email: string;
  };
  dietitian_profile?: {
    full_name: string;
    email: string;
  };
  last_message?: Message;
};

export function useMessages(threadId?: string) {
  const { profile } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!profile || !threadId) {
      setMessages([]);
      setLoading(false);
      return;
    }

    fetchMessages();
  }, [profile, threadId]);

  const fetchMessages = async () => {
    if (!profile || !threadId) return;

    try {
      setLoading(true);
      setError(null);

      const { data: messages, error: messagesError } = await supabase
        .from('messages')
        .select(`
          *,
          sender_profile:profiles!messages_sender_id_fkey(
            full_name,
            role
          )
        `)
        .eq('thread_id', threadId)
        .order('sent_at', { ascending: true });

      if (messagesError) {
        console.error('Error fetching messages:', messagesError);
        setError('Mesajlar alınamadı');
        return;
      }

      setMessages(messages || []);
    } catch (err) {
      console.error('Unexpected error fetching messages:', err);
      setError('Beklenmeyen bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (content: string) => {
    if (!profile || !threadId || !content.trim()) {
      return { error: 'Geçersiz mesaj' };
    }

    try {
      const { data, error } = await supabase
        .from('messages')
        .insert({
          thread_id: threadId,
          sender_id: profile.id,
          content: content.trim(),
          message_type: 'text'
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

  return {
    messages,
    loading,
    error,
    sendMessage,
    refetch: fetchMessages
  };
}

export function useMessageThreads() {
  const { profile } = useAuth();
  const [threads, setThreads] = useState<MessageThread[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!profile || profile.role === 'user') {
      setThreads([]);
      setLoading(false);
      return;
    }

    fetchThreads();
  }, [profile]);

  const fetchThreads = async () => {
    if (!profile || profile.role === 'user') return;

    try {
      setLoading(true);
      setError(null);

      const { data: threads, error: threadsError } = await supabase
        .from('message_threads')
        .select(`
          *,
          client_profile:profiles!message_threads_client_id_fkey(
            full_name,
            email
          ),
          dietitian_profile:profiles!message_threads_dietitian_id_fkey(
            full_name,
            email
          )
        `)
        .eq('dietitian_id', profile.id)
        .order('updated_at', { ascending: false });

      if (threadsError) {
        console.error('Error fetching threads:', threadsError);
        setError('Konuşmalar alınamadı');
        return;
      }

      setThreads(threads || []);
    } catch (err) {
      console.error('Unexpected error fetching threads:', err);
      setError('Beklenmeyen bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const createThread = async (clientId: string) => {
    if (!profile || profile.role === 'user') {
      return { error: 'Yetkiniz yok' };
    }

    try {
      // Check if thread already exists
      const { data: existingThread } = await supabase
        .from('message_threads')
        .select('id')
        .eq('client_id', clientId)
        .eq('dietitian_id', profile.id)
        .maybeSingle();

      if (existingThread) {
        return { data: existingThread, error: null };
      }

      const { data, error } = await supabase
        .from('message_threads')
        .insert({
          client_id: clientId,
          dietitian_id: profile.id
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating thread:', error);
        return { error: 'Konuşma oluşturulamadı' };
      }

      await fetchThreads();
      return { data, error: null };
    } catch (err) {
      console.error('Unexpected error creating thread:', err);
      return { error: 'Beklenmeyen bir hata oluştu' };
    }
  };

  return {
    threads,
    loading,
    error,
    createThread,
    refetch: fetchThreads
  };
}

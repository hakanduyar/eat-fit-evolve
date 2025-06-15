
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export type NewClientConnection = {
  id: string;
  client_id: string;
  professional_id: string;
  professional_type: 'dietitian' | 'trainer';
  status: 'pending' | 'active' | 'paused' | 'terminated';
  connection_type: 'nutrition_only' | 'fitness_only' | 'full_support';
  start_date: string | null;
  end_date: string | null;
  notes: string | null;
  created_by: string;
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

export type ClientMessage = {
  id: string;
  connection_id: string;
  sender_id: string;
  recipient_id: string;
  message: string;
  message_type: 'general' | 'progress' | 'concern' | 'achievement' | 'reminder';
  is_read: boolean;
  read_at: string | null;
  created_at: string;
  sender_profile?: {
    full_name: string;
    role: string;
  };
};

export type ClientNote = {
  id: string;
  connection_id: string;
  professional_id: string;
  note_type: 'general' | 'progress' | 'concern' | 'achievement' | 'reminder';
  title: string | null;
  content: string;
  is_private: boolean;
  created_at: string;
  updated_at: string;
};

export function useNewClientConnections() {
  const { profile } = useAuth();
  const [connections, setConnections] = useState<NewClientConnection[]>([]);
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

      // For professionals, get connections where they are the professional
      // For clients, get connections where they are the client
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
          professional_profile:profiles!client_connections_professional_id_fkey (
            id,
            full_name,
            email,
            phone
          )
        `);

      if (profile.role === 'user') {
        query.eq('client_id', profile.user_id);
      } else {
        query.eq('professional_id', profile.user_id);
      }

      const { data, error: fetchError } = await query.order('created_at', { ascending: false });

      if (fetchError) {
        console.error('Error fetching connections:', fetchError);
        setError('Bağlantılar alınamadı');
        return;
      }

      setConnections(data as NewClientConnection[] || []);
    } catch (err) {
      console.error('Unexpected error fetching connections:', err);
      setError('Beklenmeyen bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const createConnection = async (
    clientEmail: string, 
    connectionType: NewClientConnection['connection_type'],
    professionalType: NewClientConnection['professional_type'],
    notes?: string
  ) => {
    if (!profile || profile.role === 'user') {
      return { error: 'Sadece profesyoneller bağlantı oluşturabilir' };
    }

    try {
      // First find the client by email
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
          professional_id: profile.user_id,
          professional_type: professionalType,
          connection_type: connectionType,
          notes,
          created_by: profile.user_id,
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
    status: NewClientConnection['status']
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

export function useClientMessages(connectionId?: string) {
  const { profile } = useAuth();
  const [messages, setMessages] = useState<ClientMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!profile || !connectionId) {
      setMessages([]);
      setLoading(false);
      return;
    }

    fetchMessages();
  }, [profile, connectionId]);

  const fetchMessages = async () => {
    if (!profile || !connectionId) return;

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
        .order('created_at', { ascending: true });

      if (fetchError) {
        console.error('Error fetching messages:', fetchError);
        setError('Mesajlar alınamadı');
        return;
      }

      setMessages(data as ClientMessage[] || []);
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
    messageType: ClientMessage['message_type'] = 'general'
  ) => {
    if (!profile || !connectionId || !message.trim()) {
      return { error: 'Geçersiz mesaj' };
    }

    try {
      const { data, error } = await supabase
        .from('client_messages')
        .insert({
          connection_id: connectionId,
          sender_id: profile.user_id,
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
        .eq('recipient_id', profile?.user_id);

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

export function useClientNotes(connectionId?: string) {
  const { profile } = useAuth();
  const [notes, setNotes] = useState<ClientNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!profile || !connectionId || profile.role === 'user') {
      setNotes([]);
      setLoading(false);
      return;
    }

    fetchNotes();
  }, [profile, connectionId]);

  const fetchNotes = async () => {
    if (!profile || !connectionId || profile.role === 'user') return;

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('client_notes')
        .select('*')
        .eq('connection_id', connectionId)
        .eq('professional_id', profile.user_id)
        .order('created_at', { ascending: false });

      if (fetchError) {
        console.error('Error fetching notes:', fetchError);
        setError('Notlar alınamadı');
        return;
      }

      setNotes(data as ClientNote[] || []);
    } catch (err) {
      console.error('Unexpected error fetching notes:', err);
      setError('Beklenmeyen bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const addNote = async (
    title: string,
    content: string,
    noteType: ClientNote['note_type'] = 'general',
    isPrivate: boolean = true
  ) => {
    if (!profile || !connectionId || profile.role === 'user') {
      return { error: 'İzin yok' };
    }

    try {
      const { data, error } = await supabase
        .from('client_notes')
        .insert({
          connection_id: connectionId,
          professional_id: profile.user_id,
          title: title.trim() || null,
          content: content.trim(),
          note_type: noteType,
          is_private: isPrivate
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding note:', error);
        return { error: 'Not eklenemedi' };
      }

      await fetchNotes();
      return { data, error: null };
    } catch (err) {
      console.error('Unexpected error adding note:', err);
      return { error: 'Beklenmeyen bir hata oluştu' };
    }
  };

  const updateNote = async (
    noteId: string,
    updates: Partial<Pick<ClientNote, 'title' | 'content' | 'note_type' | 'is_private'>>
  ) => {
    if (!profile || profile.role === 'user') {
      return { error: 'İzin yok' };
    }

    try {
      const { error } = await supabase
        .from('client_notes')
        .update(updates)
        .eq('id', noteId)
        .eq('professional_id', profile.user_id);

      if (error) {
        console.error('Error updating note:', error);
        return { error: 'Not güncellenemedi' };
      }

      await fetchNotes();
      return { error: null };
    } catch (err) {
      console.error('Unexpected error updating note:', err);
      return { error: 'Beklenmeyen bir hata oluştu' };
    }
  };

  const deleteNote = async (noteId: string) => {
    if (!profile || profile.role === 'user') {
      return { error: 'İzin yok' };
    }

    try {
      const { error } = await supabase
        .from('client_notes')
        .delete()
        .eq('id', noteId)
        .eq('professional_id', profile.user_id);

      if (error) {
        console.error('Error deleting note:', error);
        return { error: 'Not silinemedi' };
      }

      await fetchNotes();
      return { error: null };
    } catch (err) {
      console.error('Unexpected error deleting note:', err);
      return { error: 'Beklenmeyen bir hata oluştu' };
    }
  };

  return {
    notes,
    loading,
    error,
    addNote,
    updateNote,
    deleteNote,
    refetch: fetchNotes
  };
}


import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export type ClientNote = {
  id: string;
  dietitian_id: string;
  client_id: string;
  note_type: 'general' | 'progress' | 'concern' | 'achievement';
  content: string;
  date: string;
  created_at: string;
};

type ClientNoteInsert = {
  client_id: string;
  note_type: 'general' | 'progress' | 'concern' | 'achievement';
  content: string;
  date?: string;
};

export function useClientNotes(clientId?: string) {
  const { profile } = useAuth();
  const [notes, setNotes] = useState<ClientNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!profile || !clientId) {
      setNotes([]);
      setLoading(false);
      return;
    }

    fetchNotes();
  }, [profile, clientId]);

  const fetchNotes = async () => {
    if (!profile || !clientId) return;

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('client_notes')
        .select('*')
        .eq('client_id', clientId)
        .eq('dietitian_id', profile.id)
        .order('created_at', { ascending: false });

      if (fetchError) {
        console.error('Error fetching client notes:', fetchError);
        setError('Notlar alınamadı');
        return;
      }

      setNotes(data || []);
    } catch (err) {
      console.error('Unexpected error fetching notes:', err);
      setError('Beklenmeyen bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const addNote = async (noteData: ClientNoteInsert) => {
    if (!profile || profile.role === 'user') {
      return { error: 'İzin yok' };
    }

    try {
      const { data, error: insertError } = await supabase
        .from('client_notes')
        .insert({
          dietitian_id: profile.id,
          client_id: noteData.client_id,
          note_type: noteData.note_type,
          content: noteData.content,
          date: noteData.date || new Date().toISOString().split('T')[0]
        })
        .select()
        .single();

      if (insertError) {
        console.error('Error adding note:', insertError);
        return { error: 'Not eklenemedi' };
      }

      await fetchNotes(); // Refresh list
      return { data: data as ClientNote, error: null };
    } catch (err) {
      console.error('Unexpected error adding note:', err);
      return { error: 'Beklenmeyen bir hata oluştu' };
    }
  };

  return {
    notes,
    loading,
    error,
    addNote,
    refetch: fetchNotes
  };
}

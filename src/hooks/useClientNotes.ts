
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export type ClientNote = {
  id: string;
  client_id: string;
  dietitian_id: string;
  note_type: 'general' | 'progress' | 'concern' | 'achievement' | 'reminder';
  content: string;
  date: string;
  created_at: string;
};

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
        .eq('dietitian_id', profile.user_id)
        .order('created_at', { ascending: false });

      if (fetchError) {
        console.error('Error fetching notes:', fetchError);
        setError('Notlar alınamadı');
        return;
      }

      const typedNotes = (data || []).map(note => ({
        ...note,
        note_type: note.note_type as 'general' | 'progress' | 'concern' | 'achievement' | 'reminder'
      }));

      setNotes(typedNotes);
    } catch (err) {
      console.error('Unexpected error fetching notes:', err);
      setError('Beklenmeyen bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const addNote = async (
    clientId: string,
    content: string,
    noteType: ClientNote['note_type'] = 'general'
  ) => {
    if (!profile || profile.role === 'user') {
      return { error: 'İzin yok' };
    }

    try {
      const { data, error } = await supabase
        .from('client_notes')
        .insert({
          client_id: clientId,
          dietitian_id: profile.user_id,
          content: content.trim(),
          note_type: noteType
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
    updates: Partial<Pick<ClientNote, 'content' | 'note_type'>>
  ) => {
    if (!profile || profile.role === 'user') {
      return { error: 'İzin yok' };
    }

    try {
      const { error } = await supabase
        .from('client_notes')
        .update(updates)
        .eq('id', noteId)
        .eq('dietitian_id', profile.user_id);

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
        .eq('dietitian_id', profile.user_id);

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

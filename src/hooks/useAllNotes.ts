// Hook to fetch all user notes across all lessons
import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

export interface NoteWithLesson {
  id: string;
  lesson_id: string;
  note_text: string;
  created_at: string;
  updated_at: string;
  lesson_title: string;
  lesson_day_index: number;
  lesson_topic_slug: string;
}

export function useAllNotes() {
  const { user } = useAuth();
  const [notes, setNotes] = useState<NoteWithLesson[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAllNotes = async () => {
    if (!user || !isSupabaseConfigured()) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Fetch notes with lesson details using a join
      const { data, error: fetchError } = await supabase
        .from('lesson_notes')
        .select(`
          id,
          lesson_id,
          note_text,
          created_at,
          updated_at,
          lessons:lesson_id (
            title,
            day_index,
            topic_slug
          )
        `)
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (fetchError) throw fetchError;

      // Transform data to flatten lesson info
      const transformedNotes: NoteWithLesson[] = (data || []).map((note: any) => ({
        id: note.id,
        lesson_id: note.lesson_id,
        note_text: note.note_text,
        created_at: note.created_at,
        updated_at: note.updated_at,
        lesson_title: note.lessons?.title || 'Unknown Lesson',
        lesson_day_index: note.lessons?.day_index || 0,
        lesson_topic_slug: note.lessons?.topic_slug || '',
      }));

      setNotes(transformedNotes);
    } catch (err) {
      console.error('Error fetching all notes:', err);
      setError('Failed to load notes');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllNotes();
  }, [user]);

  const deleteNote = async (noteId: string) => {
    if (!isSupabaseConfigured()) return false;
    
    try {
      const { error } = await supabase
        .from('lesson_notes')
        .delete()
        .eq('id', noteId);

      if (error) throw error;
      
      // Remove from local state
      setNotes(prev => prev.filter(n => n.id !== noteId));
      return true;
    } catch (err) {
      console.error('Error deleting note:', err);
      return false;
    }
  };

  return { notes, isLoading, error, refetch: fetchAllNotes, deleteNote };
}

import { useEffect, useState } from 'react';
import { Save, Edit2, Trash2, StickyNote } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

interface LessonNotesProps {
  lessonId: string | null;
}

export function LessonNotes({ lessonId }: LessonNotesProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [noteText, setNoteText] = useState('');
  const [existingNoteId, setExistingNoteId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function fetchNote() {
      if (!lessonId || !user) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('lesson_notes')
          .select('*')
          .eq('lesson_id', lessonId)
          .eq('user_id', user.id)
          .maybeSingle();

        if (error && error.code !== 'PGRST116') throw error;
        
        if (data) {
          setNoteText(data.note_text);
          setExistingNoteId(data.id);
        } else {
          setIsEditing(true); // Start in edit mode if no note exists
        }
      } catch (error) {
        console.error('Error fetching note:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchNote();
  }, [lessonId, user]);

  const handleSave = async () => {
    if (!lessonId || !user || !noteText.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter some text for your note.',
        variant: 'destructive',
      });
      return;
    }

    setIsSaving(true);
    try {
      if (existingNoteId) {
        // Update existing note
        const { error } = await supabase
          .from('lesson_notes')
          .update({ note_text: noteText })
          .eq('id', existingNoteId);

        if (error) throw error;
      } else {
        // Insert new note
        const { data, error } = await supabase
          .from('lesson_notes')
          .insert({
            lesson_id: lessonId,
            user_id: user.id,
            note_text: noteText,
          })
          .select()
          .single();

        if (error) throw error;
        setExistingNoteId(data.id);
      }

      toast({
        title: 'Success',
        description: 'Your note has been saved.',
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving note:', error);
      toast({
        title: 'Error',
        description: 'Failed to save your note. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!existingNoteId) return;

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('lesson_notes')
        .delete()
        .eq('id', existingNoteId);

      if (error) throw error;

      setNoteText('');
      setExistingNoteId(null);
      setIsEditing(true);
      toast({
        title: 'Success',
        description: 'Your note has been deleted.',
      });
    } catch (error) {
      console.error('Error deleting note:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete your note. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) {
    return null;
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>My Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-32 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <StickyNote className="h-5 w-5" />
          My Notes
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {isEditing ? (
          <>
            <Textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Write your notes here... (e.g., key takeaways, questions, reminders)"
              className="min-h-[120px] resize-none"
              disabled={isSaving}
            />
            <div className="flex gap-2">
              <Button
                onClick={handleSave}
                disabled={isSaving || !noteText.trim()}
                className="gap-2"
              >
                <Save className="h-4 w-4" />
                Save Note
              </Button>
              {existingNoteId && (
                <Button
                  variant="ghost"
                  onClick={() => {
                    setIsEditing(false);
                    // Reset to original text if canceling
                  }}
                  disabled={isSaving}
                >
                  Cancel
                </Button>
              )}
            </div>
          </>
        ) : (
          <>
            <div className="p-3 rounded-lg bg-muted/50 border border-border">
              <p className="text-sm text-foreground whitespace-pre-wrap">{noteText}</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="gap-2"
              >
                <Edit2 className="h-4 w-4" />
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDelete}
                disabled={isSaving}
                className="gap-2 text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

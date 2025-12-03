// Page to view all user notes in one place
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { StickyNote, Trash2, ExternalLink, Search, Calendar } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { NotificationModal } from '@/components/modals/NotificationModal';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { useAllNotes } from '@/hooks/useAllNotes';
import { useUserProgress } from '@/hooks/useUserProgress';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

const TOTAL_DAYS = 121;

export default function AllNotes() {
  const { notes, isLoading, deleteNote } = useAllNotes();
  const { completedCount } = useUserProgress();
  const { toast } = useToast();
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const percent = Math.round((completedCount / TOTAL_DAYS) * 100);

  // Filter notes by search query
  const filteredNotes = notes.filter(note => 
    note.note_text.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.lesson_title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async (noteId: string) => {
    setDeletingId(noteId);
    const success = await deleteNote(noteId);
    if (success) {
      toast({ title: 'Note deleted', description: 'Your note has been removed.' });
    } else {
      toast({ title: 'Error', description: 'Failed to delete note.', variant: 'destructive' });
    }
    setDeletingId(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar 
        progress={percent} 
        onNotificationClick={() => setNotificationOpen(true)} 
      />
      
      <NotificationModal 
        isOpen={notificationOpen} 
        onClose={() => setNotificationOpen(false)} 
      />

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <StickyNote className="h-6 w-6 text-primary" />
            All My Notes
          </h1>
          <p className="text-muted-foreground mt-1">
            View and manage all your lesson notes in one place
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Notes List */}
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <Card key={i}>
                <CardContent className="p-4">
                  <Skeleton className="h-4 w-1/3 mb-2" />
                  <Skeleton className="h-20 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredNotes.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <StickyNote className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-semibold text-foreground mb-1">
                {searchQuery ? 'No notes found' : 'No notes yet'}
              </h3>
              <p className="text-sm text-muted-foreground">
                {searchQuery 
                  ? 'Try adjusting your search query' 
                  : 'Start adding notes to your lessons to see them here'
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredNotes.map(note => (
              <Card key={note.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-base font-medium">
                        Day {note.lesson_day_index}: {note.lesson_title}
                      </CardTitle>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                        <Calendar className="h-3 w-3" />
                        {format(new Date(note.updated_at), 'MMM d, yyyy')}
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        asChild
                        className="h-8 w-8"
                      >
                        <Link to={`/lesson/${note.lesson_topic_slug}`}>
                          <ExternalLink className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => handleDelete(note.id)}
                        disabled={deletingId === note.id}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-foreground whitespace-pre-wrap bg-muted/50 p-3 rounded-lg border border-border">
                    {note.note_text}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Navigation Links */}
        <div className="flex justify-center gap-4 pt-8 border-t border-border mt-8">
          <Link to="/curriculum" className="text-sm text-muted-foreground hover:text-primary transition-colors">
            View Curriculum
          </Link>
          <Link to="/calendar" className="text-sm text-muted-foreground hover:text-primary transition-colors">
            View Calendar
          </Link>
        </div>
      </main>
    </div>
  );
}

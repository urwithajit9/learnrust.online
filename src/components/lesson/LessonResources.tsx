// Compact, collapsible Learning Resources section
// Updated to be more subtle and space-efficient
import { useEffect, useState } from 'react';
import { ExternalLink, Youtube, ChevronDown, BookOpen } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Skeleton } from '@/components/ui/skeleton';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';

interface LessonResource {
  id: string;
  title: string;
  url: string;
  image_url: string | null;
}

interface LessonResourcesProps {
  lessonId: string | null;
}

export function LessonResources({ lessonId }: LessonResourcesProps) {
  const [resources, setResources] = useState<LessonResource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    async function fetchResources() {
      if (!lessonId) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('lesson_resources')
          .select('*')
          .eq('lesson_id', lessonId)
          .order('created_at', { ascending: true });

        if (error) throw error;
        setResources(data || []);
      } catch (error) {
        console.error('Error fetching resources:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchResources();
  }, [lessonId]);

  if (isLoading) {
    return (
      <div className="border border-border rounded-lg p-3">
        <Skeleton className="h-5 w-40" />
      </div>
    );
  }

  if (resources.length === 0) {
    return null;
  }

  const isYouTube = (url: string) => {
    return url.includes('youtube.com') || url.includes('youtu.be');
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger className="w-full">
        <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-card hover:bg-accent/30 transition-colors">
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-foreground">
              Learning Resources
            </span>
            <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
              {resources.length}
            </span>
          </div>
          <ChevronDown className={cn(
            "h-4 w-4 text-muted-foreground transition-transform",
            isOpen && "rotate-180"
          )} />
        </div>
      </CollapsibleTrigger>
      
      <CollapsibleContent>
        <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
          {resources.map((resource) => (
            <a
              key={resource.id}
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 p-2 rounded-md border border-border bg-card hover:bg-accent/50 hover:border-primary/30 transition-all group"
            >
              {/* Compact icon */}
              <div className="w-8 h-8 bg-muted rounded flex items-center justify-center flex-shrink-0">
                {isYouTube(resource.url) ? (
                  <Youtube className="h-4 w-4 text-red-500" />
                ) : (
                  <ExternalLink className="h-3 w-3 text-muted-foreground" />
                )}
              </div>
              
              {/* Title and domain */}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-foreground group-hover:text-primary transition-colors truncate">
                  {resource.title}
                </p>
                <p className="text-[10px] text-muted-foreground truncate">
                  {new URL(resource.url).hostname}
                </p>
              </div>
              
              <ExternalLink className="h-3 w-3 text-muted-foreground flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

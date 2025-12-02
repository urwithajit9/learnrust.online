import { useEffect, useState } from 'react';
import { ExternalLink, Youtube } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

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
      <Card>
        <CardHeader>
          <CardTitle>Learning Resources</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (resources.length === 0) {
    return null;
  }

  const isYouTube = (url: string) => {
    return url.includes('youtube.com') || url.includes('youtu.be');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ExternalLink className="h-5 w-5" />
          Learning Resources
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {resources.map((resource) => (
            <a
              key={resource.id}
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-3 p-3 rounded-lg border border-border bg-card hover:bg-accent/50 transition-colors group"
            >
              {resource.image_url ? (
                <img
                  src={resource.image_url}
                  alt={resource.title}
                  className="w-16 h-16 object-cover rounded flex-shrink-0"
                />
              ) : (
                <div className="w-16 h-16 bg-muted rounded flex items-center justify-center flex-shrink-0">
                  {isYouTube(resource.url) ? (
                    <Youtube className="h-6 w-6 text-muted-foreground" />
                  ) : (
                    <ExternalLink className="h-6 w-6 text-muted-foreground" />
                  )}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2">
                  {resource.title}
                </h4>
                <p className="text-xs text-muted-foreground mt-1 truncate">
                  {new URL(resource.url).hostname}
                </p>
              </div>
              <ExternalLink className="h-4 w-4 text-muted-foreground flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

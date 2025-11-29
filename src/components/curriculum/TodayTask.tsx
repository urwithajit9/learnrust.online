import { Sparkles, ArrowRight, CheckCircle } from 'lucide-react';
import { CurriculumItem } from '@/data/curriculum';
import { getConceptColor } from '@/styles/conceptColors';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface TodayTaskProps {
  item: CurriculumItem | undefined;
  isCompleted: boolean;
  onToggleComplete: (date: string) => void;
  onViewCurriculum: () => void;
}

export function TodayTask({ item, isCompleted, onToggleComplete, onViewCurriculum }: TodayTaskProps) {
  if (!item) {
    return (
      <div className="p-6 rounded-2xl border border-dashed border-border bg-muted/30 text-center">
        <Sparkles className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
        <h3 className="font-semibold text-foreground mb-1">No task scheduled for today</h3>
        <p className="text-sm text-muted-foreground">Check the curriculum to see all available lessons</p>
      </div>
    );
  }

  const conceptColor = getConceptColor(item.concept);
  const topicParts = item.topic.split(':');
  const title = topicParts[0];
  const description = topicParts.slice(1).join(':').trim();

  return (
    <div className={cn(
      'relative overflow-hidden rounded-2xl border transition-all',
      isCompleted 
        ? 'bg-muted/50 border-border' 
        : 'bg-gradient-to-br from-primary/10 via-card to-accent/5 border-primary/20 shadow-glow'
    )}>
      {/* Decorative elements */}
      {!isCompleted && (
        <>
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-accent/5 rounded-full blur-2xl" />
        </>
      )}

      <div className="relative p-6 sm:p-8">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            {isCompleted ? (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <CheckCircle className="h-6 w-6 text-primary" />
              </div>
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 animate-pulse-soft">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
            )}
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-primary">
                {isCompleted ? 'Completed Today' : "Today's Task"}
              </span>
              <p className="text-sm text-muted-foreground">{item.date} • {item.day}</p>
            </div>
          </div>
          <span className={cn(
            'text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full text-primary-foreground shrink-0',
            conceptColor.bg
          )}>
            {item.concept}
          </span>
        </div>

        <div className="space-y-2 mb-6">
          <h2 className={cn(
            'text-xl sm:text-2xl font-bold',
            isCompleted ? 'text-muted-foreground line-through' : 'text-foreground'
          )}>
            {title}
          </h2>
          {description && (
            <p className={cn(
              'text-base',
              isCompleted ? 'text-muted-foreground/70' : 'text-muted-foreground'
            )}>
              {description}
            </p>
          )}
        </div>

        <div className="flex flex-wrap gap-3">
          <Button
            variant={isCompleted ? 'outline' : 'default'}
            onClick={() => onToggleComplete(item.date)}
            className="gap-2"
          >
            {isCompleted ? (
              <>Mark Incomplete</>
            ) : (
              <>
                <CheckCircle className="h-4 w-4" />
                Mark Complete
              </>
            )}
          </Button>
          <Button
            variant="ghost"
            onClick={onViewCurriculum}
            className="gap-2"
          >
            View Full Curriculum
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="mt-4 pt-4 border-t border-border/50">
          <p className="text-xs text-muted-foreground">
            Phase {item.phase} • ~10 minutes • Daily micro-learning
          </p>
        </div>
      </div>
    </div>
  );
}

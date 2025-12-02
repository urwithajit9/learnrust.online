import { CheckCircle, Circle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CurriculumItem, curriculumData } from '@/data/curriculum';
import { getConceptColor } from '@/styles/conceptColors';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface DayCardProps {
  item: CurriculumItem;
  isCompleted: boolean;
  isToday?: boolean;
  onToggleComplete: (date: string) => void;
}

export function DayCard({ item, isCompleted, isToday, onToggleComplete }: DayCardProps) {
  const dayIndex = item.dayIndex || curriculumData.findIndex(i => i.date === item.date) + 1;
  const conceptColor = getConceptColor(item.concept);
  const topicParts = item.topic.split(':');
  const title = topicParts[0];
  const description = topicParts.slice(1).join(':').trim();
  const lessonSlug = item.topicSlug || `day-${dayIndex}`;

  return (
    <article
      className={cn(
        'relative p-5 rounded-xl border transition-all duration-300 flex flex-col h-full group',
        isCompleted 
          ? 'bg-muted/50 border-border opacity-75' 
          : isToday
            ? 'bg-primary/5 border-primary/30 shadow-glow'
            : 'bg-card border-border shadow-card hover:shadow-lg hover:-translate-y-0.5'
      )}
    >
      {/* Today indicator */}
      {isToday && !isCompleted && (
        <div className="absolute -top-2 left-4 px-2 py-0.5 bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wider rounded-full animate-pulse-soft">
          Today
        </div>
      )}

      {/* Completed indicator */}
      {isCompleted && (
        <div className="absolute top-4 right-4 text-primary animate-scale-in">
          <CheckCircle className="h-6 w-6 fill-primary/10" />
        </div>
      )}

      {/* Header */}
      <header className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold px-2 py-1 rounded-md bg-secondary text-secondary-foreground">
            {item.date}
          </span>
          <span className="text-xs text-muted-foreground font-mono uppercase">
            {item.day}
          </span>
        </div>
        {!isCompleted && (
          <span className={cn(
            'text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full text-primary-foreground',
            conceptColor.bg
          )}>
            {item.concept}
          </span>
        )}
      </header>

      {/* Content */}
      <div className="flex-grow">
        <h3 className={cn(
          'font-semibold mb-1 leading-snug',
          isCompleted ? 'text-muted-foreground line-through' : 'text-foreground'
        )}>
          {title}
        </h3>
        {description && (
          <p className={cn(
            'text-sm leading-relaxed',
            isCompleted ? 'text-muted-foreground/70' : 'text-muted-foreground'
          )}>
            {description}
          </p>
        )}
      </div>

      {/* Footer */}
      <footer className="mt-4 pt-4 border-t border-border flex justify-between items-center">
        <span className="text-xs text-muted-foreground font-medium">
          Phase {item.phase}
        </span>
        <div className="flex items-center gap-2">
          <Link to={`/lesson/${lessonSlug}`}>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 text-xs font-semibold gap-1"
            >
              View
              <ArrowRight className="h-3 w-3" />
            </Button>
          </Link>
          <Button
            variant={isCompleted ? 'outline' : 'default'}
            size="sm"
            onClick={() => onToggleComplete(item.date)}
            className={cn(
              'h-8 text-xs font-semibold transition-all',
              !isCompleted && 'bg-primary hover:bg-primary/90'
            )}
          >
            {isCompleted ? (
              <>
                <Circle className="h-3 w-3 mr-1.5" />
                Undo
              </>
            ) : (
              <>
                <CheckCircle className="h-3 w-3 mr-1.5" />
                Done
              </>
            )}
          </Button>
        </div>
      </footer>
    </article>
  );
}

import { Clock, BookOpen, AlertTriangle, Code2, Lightbulb } from 'lucide-react';
import { DailyLesson, LessonData, isFullLesson } from '@/types/lesson';
import { CodeBlock } from './CodeBlock';
import { ChallengeEditor } from './ChallengeEditor';
import { getConceptColor } from '@/styles/conceptColors';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

interface LessonViewProps {
  lesson: LessonData;
  day: number;
  isLoading?: boolean;
  className?: string;
}

export function LessonView({ lesson, day, isLoading, className }: LessonViewProps) {
  if (isLoading) {
    return <LessonSkeleton />;
  }

  if (!isFullLesson(lesson)) {
    return (
      <div className={cn('p-8 rounded-2xl border border-dashed border-border bg-muted/30 text-center', className)}>
        <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <h2 className="text-2xl font-bold text-foreground mb-2">{lesson.title}</h2>
        <p className="text-muted-foreground">{lesson.theory}</p>
      </div>
    );
  }

  const conceptColor = getConceptColor(lesson.topicSlug);

  return (
    <div className={cn('space-y-8', className)}>
      {/* Header */}
      <header className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-bold">
            Day {day}
          </span>
          <span className={cn(
            'px-3 py-1 rounded-full text-sm font-bold text-primary-foreground',
            conceptColor.bg
          )}>
            {lesson.topicSlug}
          </span>
          <span className="flex items-center gap-1 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            {lesson.estimatedTimeMinutes} min
          </span>
        </div>
        
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
          {lesson.title}
        </h1>
      </header>

      {/* Theory Section */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-lg font-semibold text-foreground">
          <Lightbulb className="h-5 w-5 text-primary" />
          Theory
        </div>
        <div className="p-6 rounded-xl bg-card border border-border">
          <p className="text-foreground leading-relaxed whitespace-pre-wrap">
            {lesson.theory}
          </p>
        </div>
      </section>

      {/* Core Example */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-lg font-semibold text-foreground">
          <Code2 className="h-5 w-5 text-primary" />
          Core Example
        </div>
        <CodeBlock 
          code={lesson.coreExample.code} 
          title="Example Code"
        />
        <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
          <p className="text-sm text-foreground">
            <strong className="text-primary">Explanation:</strong> {lesson.coreExample.explanation}
          </p>
        </div>
      </section>

      {/* Pitfall Example */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-lg font-semibold text-foreground">
          <AlertTriangle className="h-5 w-5 text-destructive" />
          Common Pitfall
        </div>
        <CodeBlock 
          code={lesson.pitfallExample.code} 
          title="What NOT to do"
        />
        <div className="p-4 rounded-xl bg-destructive/5 border border-destructive/20">
          <p className="text-sm text-foreground">
            <strong className="text-destructive">Error Hint:</strong> {lesson.pitfallExample.errorHint}
          </p>
        </div>
      </section>

      {/* Challenge */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-lg font-semibold text-foreground">
          <BookOpen className="h-5 w-5 text-accent" />
          Practice Challenge
        </div>
        <ChallengeEditor 
          template={lesson.challenge.template}
          instructions={lesson.challenge.instructions}
          expectedOutput={lesson.challenge.expectedOutput}
        />
      </section>
    </div>
  );
}

function LessonSkeleton() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="flex gap-3">
          <Skeleton className="h-8 w-20 rounded-full" />
          <Skeleton className="h-8 w-24 rounded-full" />
          <Skeleton className="h-8 w-16 rounded-full" />
        </div>
        <Skeleton className="h-12 w-3/4" />
      </div>
      
      <div className="space-y-4">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-32 w-full rounded-xl" />
      </div>
      
      <div className="space-y-4">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-48 w-full rounded-xl" />
      </div>
    </div>
  );
}

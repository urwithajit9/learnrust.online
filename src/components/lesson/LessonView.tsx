import { Clock, BookOpen, AlertTriangle, Code2, Lightbulb } from 'lucide-react';
import { DailyLesson, LessonData, isFullLesson } from '@/types/lesson';
import { CodeBlock } from './CodeBlock';
import { ChallengeEditor } from './ChallengeEditor';
import { getConceptColor } from '@/styles/conceptColors';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

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
        <div className="theory-content p-6 rounded-xl bg-card border border-border prose prose-sm sm:prose-base max-w-none dark:prose-invert 
          prose-headings:text-foreground prose-headings:font-bold prose-headings:mt-6 prose-headings:mb-3
          prose-h2:text-xl prose-h2:border-b prose-h2:border-border prose-h2:pb-2
          prose-h3:text-lg prose-h3:text-primary
          prose-p:text-foreground prose-p:leading-relaxed prose-p:my-3
          prose-strong:text-foreground prose-strong:font-semibold
          prose-code:text-primary prose-code:bg-primary/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:font-mono prose-code:text-sm prose-code:before:content-none prose-code:after:content-none
          prose-pre:bg-slate-900 prose-pre:text-slate-50 prose-pre:border prose-pre:border-slate-700 prose-pre:rounded-lg prose-pre:shadow-lg prose-pre:my-4 prose-pre:overflow-x-auto
          prose-pre:prose-code:bg-transparent prose-pre:prose-code:text-slate-50 prose-pre:prose-code:p-0
          prose-a:text-primary prose-a:underline prose-a:underline-offset-2 hover:prose-a:text-primary/80
          prose-ul:text-foreground prose-ul:my-3 prose-ul:space-y-1
          prose-ol:text-foreground prose-ol:my-3 prose-ol:space-y-1
          prose-li:text-foreground prose-li:leading-relaxed
          prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:bg-primary/5 prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:italic
          prose-hr:border-border prose-hr:my-6">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {lesson.theory}
          </ReactMarkdown>
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
          task={lesson.challenge.task}
          instructions={lesson.challenge.instructions}
          hint={lesson.challenge.hint}
          toolsUsed={lesson.challenge.tools_used}
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

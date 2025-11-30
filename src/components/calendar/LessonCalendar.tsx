import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, CheckCircle, Circle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useUserSettings } from '@/hooks/useUserSettings';
import { useUserProgress } from '@/hooks/useUserProgress';
import { supabase, getCurrentDay } from '@/lib/supabase';
import { LessonView } from '@/components/lesson/LessonView';
import { DailyLesson, LessonData, LessonPlaceholder, isFullLesson } from '@/types/lesson';
import { getSampleLesson } from '@/data/sampleLesson';
import { cn } from '@/lib/utils';

interface CalendarDay {
  dayIndex: number;
  date: Date;
  isToday: boolean;
  isPast: boolean;
  isFuture: boolean;
}

const DAYS_PER_PAGE = 28;

export function LessonCalendar() {
  const { settings } = useUserSettings();
  const { isCompleted, markComplete, markIncomplete } = useUserProgress();
  const [page, setPage] = useState(0);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<LessonData | null>(null);
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  const [isLoadingLesson, setIsLoadingLesson] = useState(false);

  const startDate = settings?.start_date ? new Date(settings.start_date) : new Date();
  const currentDay = getCurrentDay(startDate);

  const getCalendarDays = (): CalendarDay[] => {
    const days: CalendarDay[] = [];
    const startDayIndex = page * DAYS_PER_PAGE + 1;
    
    for (let i = 0; i < DAYS_PER_PAGE; i++) {
      const dayIndex = startDayIndex + i;
      const date = new Date(startDate);
      date.setDate(date.getDate() + dayIndex - 1);
      
      days.push({
        dayIndex,
        date,
        isToday: dayIndex === currentDay,
        isPast: dayIndex < currentDay,
        isFuture: dayIndex > currentDay,
      });
    }
    return days;
  };

  const calendarDays = getCalendarDays();

  const fetchLesson = async (dayIndex: number) => {
    setIsLoadingLesson(true);
    try {
      const { data, error } = await supabase
        .from('lessons')
        .select('*')
        .eq('day_index', dayIndex)
        .maybeSingle();

      if (data) {
        const lesson: DailyLesson = {
          day: data.day_index,
          title: data.title,
          topicSlug: data.topic_slug,
          estimatedTimeMinutes: data.estimated_time_minutes,
          theory: data.theory,
          coreExample: data.core_example || { code: '', explanation: '' },
          pitfallExample: data.pitfall_example || { code: '', errorHint: '' },
          challenge: data.challenge || { template: '', instructions: '', expectedOutput: '' },
        };
        setSelectedLesson(lesson);
        setSelectedLessonId(data.id);
      } else {
        const sampleLesson = getSampleLesson(dayIndex);
        setSelectedLesson(sampleLesson || {
          title: 'Content Coming Soon...',
          theory: 'Check back tomorrow! New lessons are added daily.',
          isPlaceholder: true,
        } as LessonPlaceholder);
        setSelectedLessonId(null);
      }
    } catch (err) {
      console.error('Error fetching lesson:', err);
      setSelectedLesson({
        title: 'Error Loading',
        theory: 'Failed to load lesson content.',
        isPlaceholder: true,
      } as LessonPlaceholder);
      setSelectedLessonId(null);
    } finally {
      setIsLoadingLesson(false);
    }
  };

  const handleDayClick = (dayIndex: number) => {
    setSelectedDay(dayIndex);
    fetchLesson(dayIndex);
  };

  const handleCloseModal = () => {
    setSelectedDay(null);
    setSelectedLesson(null);
    setSelectedLessonId(null);
  };

  const handleNavigate = (direction: 'prev' | 'next') => {
    if (!selectedDay) return;
    const newDay = direction === 'prev' ? selectedDay - 1 : selectedDay + 1;
    if (newDay >= 1) {
      setSelectedDay(newDay);
      fetchLesson(newDay);
    }
  };

  const handleToggleComplete = async () => {
    if (!selectedDay || !selectedLessonId) return;
    
    if (isCompleted(selectedDay)) {
      await markIncomplete(selectedLessonId);
    } else {
      await markComplete(selectedLessonId);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">Learning Calendar</h2>
          <p className="text-sm text-muted-foreground">
            Day {currentDay} of your journey
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setPage(p => Math.max(0, p - 1))}
            disabled={page === 0}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted-foreground min-w-[100px] text-center">
            Days {page * DAYS_PER_PAGE + 1}-{(page + 1) * DAYS_PER_PAGE}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setPage(p => p + 1)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
        {calendarDays.map((day) => {
          const completed = isCompleted(day.dayIndex);
          return (
            <button
              key={day.dayIndex}
              onClick={() => handleDayClick(day.dayIndex)}
              className={cn(
                'relative p-3 rounded-xl border transition-all text-center aspect-square flex flex-col items-center justify-center gap-1',
                'hover:border-primary hover:shadow-md',
                day.isToday && 'ring-2 ring-primary ring-offset-2',
                completed && 'bg-primary/10 border-primary/30',
                day.isFuture && !completed && 'opacity-60',
                !day.isToday && !completed && 'bg-card border-border'
              )}
            >
              <span className={cn(
                'text-lg font-bold',
                day.isToday ? 'text-primary' : 'text-foreground'
              )}>
                {day.dayIndex}
              </span>
              {completed ? (
                <CheckCircle className="h-4 w-4 text-primary fill-primary/20" />
              ) : (
                <Circle className="h-4 w-4 text-muted-foreground" />
              )}
            </button>
          );
        })}
      </div>

      {/* Lesson Modal */}
      <Dialog open={selectedDay !== null} onOpenChange={handleCloseModal}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle>Day {selectedDay}</DialogTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleNavigate('prev')}
                  disabled={selectedDay === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleNavigate('next')}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </DialogHeader>
          
          {isLoadingLesson ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : selectedLesson ? (
            <div className="space-y-4">
              <LessonView 
                lesson={selectedLesson} 
                day={selectedDay || 1}
                isLoading={false}
              />
              
              {selectedLessonId && selectedDay && (
                <Button
                  onClick={handleToggleComplete}
                  variant={isCompleted(selectedDay) ? 'outline' : 'default'}
                  className="w-full"
                >
                  {isCompleted(selectedDay) ? (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Completed - Click to Undo
                    </>
                  ) : (
                    'Mark as Completed'
                  )}
                </Button>
              )}
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}

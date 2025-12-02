import { useState } from 'react';
import { ChevronLeft, ChevronRight, CheckCircle, Circle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUserSettings } from '@/hooks/useUserSettings';
import { useUserProgress } from '@/hooks/useUserProgress';
import { supabase, getCurrentDay } from '@/lib/supabase';
import { LessonView } from '@/components/lesson/LessonView';
import { SocialShare } from '@/components/lesson/SocialShare';
import { DailyLesson, LessonData, LessonPlaceholder } from '@/types/lesson';
import { getSampleLesson } from '@/data/sampleLesson';
import { getCurriculumItemByDayIndex } from '@/utils/curriculumHelpers';
import { cn } from '@/lib/utils';

interface CalendarDay {
  dayIndex: number;
  date: Date;
  topic: string;
  isToday: boolean;
  isPast: boolean;
  isFuture: boolean;
}

const TOTAL_DAYS = 121;
const DAYS_PER_PAGE = 30;

type ViewMode = 'paginated' | 'phase' | 'all';

export function LessonCalendar() {
  const { settings } = useUserSettings();
  const { isCompleted, markComplete, markIncomplete } = useUserProgress();
  const [viewMode, setViewMode] = useState<ViewMode>('paginated');
  const [page, setPage] = useState(0);
  const [selectedPhase, setSelectedPhase] = useState(1);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<LessonData | null>(null);
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  const [isLoadingLesson, setIsLoadingLesson] = useState(false);

  const startDate = settings?.start_date ? new Date(settings.start_date) : new Date();
  const currentDay = getCurrentDay(startDate);

  const getCalendarDays = (): CalendarDay[] => {
    const days: CalendarDay[] = [];
    let startDayIndex = 1;
    let endDayIndex = TOTAL_DAYS;

    if (viewMode === 'paginated') {
      startDayIndex = page * DAYS_PER_PAGE + 1;
      endDayIndex = Math.min(startDayIndex + DAYS_PER_PAGE - 1, TOTAL_DAYS);
    } else if (viewMode === 'phase') {
      // Phase 1: days 1-31, Phase 2: days 32-62, Phase 3: days 63-93, Phase 4: days 94-121
      const phaseStarts = [1, 32, 63, 94];
      const phaseEnds = [31, 62, 93, 121];
      startDayIndex = phaseStarts[selectedPhase - 1];
      endDayIndex = phaseEnds[selectedPhase - 1];
    }
    
    for (let dayIndex = startDayIndex; dayIndex <= endDayIndex; dayIndex++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + dayIndex - 1);
      const curriculumItem = getCurriculumItemByDayIndex(dayIndex);
      
      days.push({
        dayIndex,
        date,
        topic: curriculumItem?.topic || 'Lesson content',
        isToday: dayIndex === currentDay,
        isPast: dayIndex < currentDay,
        isFuture: dayIndex > currentDay,
      });
    }
    return days;
  };

  const calendarDays = getCalendarDays();
  const totalPages = Math.ceil(TOTAL_DAYS / DAYS_PER_PAGE);

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
    if (newDay >= 1 && newDay <= TOTAL_DAYS) {
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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground">Learning Calendar</h2>
          <p className="text-sm text-muted-foreground">
            Day {currentDay} of {TOTAL_DAYS}
          </p>
        </div>
        
        {/* View Mode Switcher */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as ViewMode)}>
            <TabsList>
              <TabsTrigger value="paginated">Paginated</TabsTrigger>
              <TabsTrigger value="phase">By Phase</TabsTrigger>
              <TabsTrigger value="all">All Days</TabsTrigger>
            </TabsList>
          </Tabs>
          
          {viewMode === 'paginated' && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setPage(p => Math.max(0, p - 1))}
                disabled={page === 0}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm text-muted-foreground min-w-[80px] text-center">
                Page {page + 1}/{totalPages}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
          
          {viewMode === 'phase' && (
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4].map(phase => (
                <Button
                  key={phase}
                  variant={selectedPhase === phase ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedPhase(phase)}
                >
                  Phase {phase}
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {calendarDays.map((day) => {
          const completed = isCompleted(day.dayIndex);
          const formattedDate = day.date.toISOString().split('T')[0];
          
          return (
            <button
              key={day.dayIndex}
              onClick={() => handleDayClick(day.dayIndex)}
              className={cn(
                'relative p-4 rounded-lg border transition-all text-left',
                'hover:border-primary hover:shadow-md hover:scale-[1.02]',
                day.isToday && 'ring-2 ring-primary ring-offset-2',
                completed && 'bg-primary/5 border-primary/30',
                !day.isToday && !completed && 'bg-card border-border'
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={cn(
                      'text-sm font-semibold',
                      day.isToday ? 'text-primary' : 'text-foreground'
                    )}>
                      Day {day.dayIndex}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formattedDate}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {day.topic}
                  </p>
                </div>
                <div className="flex-shrink-0">
                  {completed ? (
                    <CheckCircle className="h-5 w-5 text-primary fill-primary/20" />
                  ) : (
                    <Circle className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
              </div>
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
                  disabled={selectedDay === TOTAL_DAYS}
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
              
              {selectedLesson && selectedDay && (
                <SocialShare 
                  lessonTitle={selectedLesson.title}
                  lessonSlug={getCurriculumItemByDayIndex(selectedDay)?.topicSlug || ''}
                />
              )}
              
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

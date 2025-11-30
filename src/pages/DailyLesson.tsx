import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Calendar, CheckCircle } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { NotificationModal } from '@/components/modals/NotificationModal';
import { LessonView } from '@/components/lesson/LessonView';
import { Button } from '@/components/ui/button';
import { useSupabaseLesson } from '@/hooks/useSupabaseLesson';
import { useUserProgress } from '@/hooks/useUserProgress';
import { getCurrentDay } from '@/lib/supabase';
import { useUserSettings } from '@/hooks/useUserSettings';

const TOTAL_DAYS = 121;

const DailyLesson = () => {
  const { day: dayParam } = useParams<{ day?: string }>();
  const [notificationOpen, setNotificationOpen] = useState(false);
  const { settings } = useUserSettings();
  const { completedCount, isCompleted, markComplete, markIncomplete } = useUserProgress();
  
  const startDate = settings?.start_date ? new Date(settings.start_date) : new Date();
  const currentDay = getCurrentDay(startDate);
  const initialDay = dayParam ? parseInt(dayParam, 10) : currentDay;
  const [selectedDay, setSelectedDay] = useState(initialDay);
  
  const { lesson, lessonId, isLoading, error } = useSupabaseLesson(selectedDay);
  const percent = Math.round((completedCount / TOTAL_DAYS) * 100);

  const handlePrevDay = () => {
    if (selectedDay > 1) {
      setSelectedDay(prev => prev - 1);
    }
  };

  const handleNextDay = () => {
    setSelectedDay(prev => prev + 1);
  };

  const handleToday = () => {
    setSelectedDay(currentDay);
  };

  const handleToggleComplete = async () => {
    if (!lessonId) return;
    
    if (isCompleted(selectedDay)) {
      await markIncomplete(lessonId);
    } else {
      await markComplete(lessonId);
    }
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
        {/* Day Navigation */}
        <div className="flex items-center justify-between mb-8 p-4 rounded-xl bg-card border border-border">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrevDay}
            disabled={selectedDay <= 1}
            className="gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Previous</span>
          </Button>
          
          <div className="flex items-center gap-3">
            <span className="text-lg font-bold text-foreground">
              Day {selectedDay}
            </span>
            {selectedDay !== currentDay && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleToday}
                className="gap-2 text-primary"
              >
                <Calendar className="h-4 w-4" />
                <span className="hidden sm:inline">Today</span>
              </Button>
            )}
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleNextDay}
            className="gap-2"
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive">
            {error}
          </div>
        )}

        {/* Lesson Content */}
        {lesson && (
          <div className="space-y-6">
            <LessonView 
              lesson={lesson} 
              day={selectedDay}
              isLoading={isLoading}
            />
            
            {lessonId && (
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
        )}
      </main>
    </div>
  );
};

export default DailyLesson;

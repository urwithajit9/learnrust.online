import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Calendar, CheckCircle, Flag } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { NotificationModal } from '@/components/modals/NotificationModal';
import { LessonReportModal } from '@/components/modals/LessonReportModal';
import { LessonView } from '@/components/lesson/LessonView';
import { SocialShare } from '@/components/lesson/SocialShare';
import { Button } from '@/components/ui/button';
import { useSupabaseLesson } from '@/hooks/useSupabaseLesson';
import { useUserProgress } from '@/hooks/useUserProgress';
import { getCurrentDay } from '@/lib/supabase';
import { useUserSettings } from '@/hooks/useUserSettings';

const TOTAL_DAYS = 121;

const DailyLesson = () => {
  const { day: dayParam } = useParams<{ day?: string }>();
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
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
    if (selectedDay < TOTAL_DAYS) {
      setSelectedDay(prev => prev + 1);
    }
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

      <LessonReportModal
        isOpen={reportOpen}
        onClose={() => setReportOpen(false)}
        lessonId={lessonId}
        lessonTitle={lesson?.title || 'Unknown'}
        dayNumber={selectedDay}
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
            disabled={selectedDay >= TOTAL_DAYS}
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
            
            {/* Social Share */}
            <SocialShare 
              lessonTitle={lesson.title}
              lessonDay={selectedDay}
            />
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              {lessonId && (
                <Button
                  onClick={handleToggleComplete}
                  variant={isCompleted(selectedDay) ? 'outline' : 'default'}
                  className="flex-1"
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
              
              <Button
                variant="outline"
                onClick={() => setReportOpen(true)}
                className="gap-2"
              >
                <Flag className="h-4 w-4" />
                Report / Suggest
              </Button>
            </div>

            {/* Navigation Links */}
            <div className="flex justify-center gap-4 pt-4 border-t border-border">
              <Link to="/curriculum" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                View Curriculum
              </Link>
              <Link to="/calendar" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                View Calendar
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default DailyLesson;

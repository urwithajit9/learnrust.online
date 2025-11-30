import { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { NotificationModal } from '@/components/modals/NotificationModal';
import { LessonCalendar } from '@/components/calendar/LessonCalendar';
import { useUserProgress } from '@/hooks/useUserProgress';

export default function CalendarPage() {
  const [notificationOpen, setNotificationOpen] = useState(false);
  const { completedCount } = useUserProgress();
  
  // Calculate rough progress percentage (assuming 121 total days)
  const totalDays = 121;
  const percent = Math.round((completedCount / totalDays) * 100);

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

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <LessonCalendar />
      </main>
    </div>
  );
}

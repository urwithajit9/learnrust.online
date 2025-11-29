import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { getFirestoreDB, FIRESTORE_APP_ID, getCurrentDay } from '@/lib/firebase';
import { DailyLesson, LessonData, LessonPlaceholder } from '@/types/lesson';
import { getSampleLesson } from '@/data/sampleLesson';

interface UseLessonReturn {
  lesson: LessonData | null;
  isLoading: boolean;
  error: string | null;
  currentDay: number;
  refetch: () => void;
}

const placeholderLesson: LessonPlaceholder = {
  title: 'Content Coming Soon...',
  theory: 'Check back tomorrow! New lessons are added daily.',
  isPlaceholder: true,
};

export function useLesson(dayOverride?: number): UseLessonReturn {
  const [lesson, setLesson] = useState<LessonData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refetchTrigger, setRefetchTrigger] = useState(0);
  
  const currentDay = dayOverride ?? getCurrentDay();

  useEffect(() => {
    async function fetchLesson() {
      setIsLoading(true);
      setError(null);
      
      const db = getFirestoreDB();
      
      if (!db) {
        // Firebase not configured - try sample data first, then placeholder
        console.info('Firebase not configured. Using sample/placeholder content.');
        const sampleLesson = getSampleLesson(currentDay);
        setLesson(sampleLesson || placeholderLesson);
        setIsLoading(false);
        return;
      }
      
      try {
        const lessonRef = doc(
          db,
          `/artifacts/${FIRESTORE_APP_ID}/public/data/daily_lessons`,
          String(currentDay)
        );
        
        const snapshot = await getDoc(lessonRef);
        
        if (snapshot.exists()) {
          const data = snapshot.data() as DailyLesson;
          setLesson(data);
        } else {
          // Try sample data as fallback
          const sampleLesson = getSampleLesson(currentDay);
          setLesson(sampleLesson || placeholderLesson);
        }
      } catch (err) {
        console.error('Error fetching lesson:', err);
        setError('Failed to load lesson. Please try again later.');
        // Try sample data as fallback
        const sampleLesson = getSampleLesson(currentDay);
        setLesson(sampleLesson || placeholderLesson);
      } finally {
        setIsLoading(false);
      }
    }

    fetchLesson();
  }, [currentDay, refetchTrigger]);

  const refetch = () => setRefetchTrigger(prev => prev + 1);

  return { lesson, isLoading, error, currentDay, refetch };
}

// Hook to fetch a specific lesson by day number
export function useLessonByDay(day: number): UseLessonReturn {
  return useLesson(day);
}

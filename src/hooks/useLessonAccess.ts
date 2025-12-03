// Hook to determine lesson access based on current day
// Controls whether future lessons are accessible
import { useState, useEffect } from 'react';
import { useUserSettings } from '@/hooks/useUserSettings';
import { getCurrentDay } from '@/lib/supabase';

interface LessonAccessConfig {
  currentDay: number;
  allowFutureLessons: boolean;
  setAllowFutureLessons: (allow: boolean) => void;
  canAccessLesson: (dayIndex: number) => boolean;
  isLessonLocked: (dayIndex: number) => boolean;
}

const STORAGE_KEY = 'learnrust_allow_future_lessons';

export function useLessonAccess(): LessonAccessConfig {
  const { settings } = useUserSettings();
  const [allowFutureLessons, setAllowFutureLessonsState] = useState<boolean>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === 'true';
  });

  const startDate = settings?.start_date ? new Date(settings.start_date) : new Date();
  const currentDay = getCurrentDay(startDate);

  const setAllowFutureLessons = (allow: boolean) => {
    setAllowFutureLessonsState(allow);
    localStorage.setItem(STORAGE_KEY, String(allow));
  };

  const canAccessLesson = (dayIndex: number): boolean => {
    // Always allow access to past and current lessons
    if (dayIndex <= currentDay) return true;
    // Allow future lessons only if setting is enabled
    return allowFutureLessons;
  };

  const isLessonLocked = (dayIndex: number): boolean => {
    return dayIndex > currentDay && !allowFutureLessons;
  };

  return {
    currentDay,
    allowFutureLessons,
    setAllowFutureLessons,
    canAccessLesson,
    isLessonLocked,
  };
}

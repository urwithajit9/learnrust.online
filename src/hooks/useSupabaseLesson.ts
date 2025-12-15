import { useState, useEffect } from 'react';
import { supabase, getCurrentDay, isSupabaseConfigured } from '@/lib/supabase';
import { useUserSettings } from './useUserSettings';
import { DailyLesson, LessonData, LessonPlaceholder } from '@/types/lesson';
import { getSampleLesson } from '@/data/sampleLesson';

interface SupabaseLessonRow {
  id: string;
  day_index: number;
  title: string;
  topic_slug: string;
  estimated_time_minutes: number;
  theory: string;
  core_example: { code: string; explanation: string } | null;
  pitfall_example: { code: string; errorHint: string } | null;
  challenge: { template: string; instructions?: string; task?: string; hint?: string; tools_used?: string; expectedOutput: string } | null;
}

const placeholderLesson: LessonPlaceholder = {
  title: 'Content Coming Soon...',
  theory: 'Check back tomorrow! New lessons are added daily.',
  isPlaceholder: true,
};

function transformToLessonData(row: SupabaseLessonRow): DailyLesson {
  return {
    day: row.day_index,
    title: row.title,
    topicSlug: row.topic_slug,
    estimatedTimeMinutes: row.estimated_time_minutes,
    theory: row.theory,
    coreExample: row.core_example || { code: '', explanation: '' },
    pitfallExample: row.pitfall_example || { code: '', errorHint: '' },
    challenge: row.challenge || { template: '', task: '', expectedOutput: '' },
  };
}

export function useSupabaseLesson(slugOrDay?: string | number) {
  const { settings } = useUserSettings();
  const [lesson, setLesson] = useState<LessonData | null>(null);
  const [lessonId, setLessonId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  const startDate = settings?.start_date ? new Date(settings.start_date) : new Date();
  const currentDay = typeof slugOrDay === 'number' ? slugOrDay : getCurrentDay(startDate);

  useEffect(() => {
    async function fetchLesson() {
      setIsLoading(true);
      setError(null);

      // If Supabase is not configured, use sample/placeholder
      if (!isSupabaseConfigured()) {
        const sampleLesson = getSampleLesson(currentDay);
        setLesson(sampleLesson || placeholderLesson);
        setLessonId(null);
        setIsLoading(false);
        return;
      }

      try {
        let query = supabase.from('lessons').select('*');
        
        // Fetch by slug if provided, otherwise by day_index
        if (typeof slugOrDay === 'string') {
          query = query.eq('topic_slug', slugOrDay);
        } else {
          query = query.eq('day_index', currentDay);
        }

        const { data, error: fetchError } = await query.maybeSingle();

        if (fetchError) {
          throw fetchError;
        }

        if (data) {
          setLesson(transformToLessonData(data as SupabaseLessonRow));
          setLessonId(data.id);
        } else {
          // Fallback to sample lesson
          const sampleLesson = getSampleLesson(currentDay);
          setLesson(sampleLesson || placeholderLesson);
          setLessonId(null);
        }
      } catch (err) {
        console.error('Error fetching lesson:', err);
        setError('Failed to load lesson.');
        const sampleLesson = getSampleLesson(currentDay);
        setLesson(sampleLesson || placeholderLesson);
        setLessonId(null);
      } finally {
        setIsLoading(false);
      }
    }

    fetchLesson();
  }, [slugOrDay, currentDay, refetchTrigger]);

  const refetch = () => setRefetchTrigger(prev => prev + 1);

  return { lesson, lessonId, isLoading, error, currentDay, startDate, refetch };
}

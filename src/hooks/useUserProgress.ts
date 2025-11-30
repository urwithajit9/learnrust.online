import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

interface ProgressItem {
  lesson_id: string;
  day_index: number;
  completed: boolean;
  completed_at: string | null;
}

export function useUserProgress() {
  const { user } = useAuth();
  const [progress, setProgress] = useState<ProgressItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProgress = useCallback(async () => {
    if (!user) {
      setProgress([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const { data, error: fetchError } = await supabase
        .from('user_progress')
        .select(`
          lesson_id,
          completed,
          completed_at,
          lessons!inner(day_index)
        `)
        .eq('user_id', user.id);

      if (fetchError) throw fetchError;

      const progressItems: ProgressItem[] = (data || []).map((item: any) => ({
        lesson_id: item.lesson_id,
        day_index: item.lessons.day_index,
        completed: item.completed,
        completed_at: item.completed_at,
      }));

      setProgress(progressItems);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchProgress();
  }, [fetchProgress]);

  const markComplete = async (lessonId: string) => {
    if (!user || !lessonId) return { error: new Error('Invalid params') };

    const { error } = await supabase
      .from('user_progress')
      .upsert({
        user_id: user.id,
        lesson_id: lessonId,
        completed: true,
        completed_at: new Date().toISOString(),
      }, {
        onConflict: 'user_id,lesson_id'
      });

    if (!error) {
      await fetchProgress();
    }
    return { error };
  };

  const markIncomplete = async (lessonId: string) => {
    if (!user || !lessonId) return { error: new Error('Invalid params') };

    const { error } = await supabase
      .from('user_progress')
      .update({ completed: false, completed_at: null })
      .eq('user_id', user.id)
      .eq('lesson_id', lessonId);

    if (!error) {
      await fetchProgress();
    }
    return { error };
  };

  const isCompleted = (dayIndex: number): boolean => {
    return progress.some(p => p.day_index === dayIndex && p.completed);
  };

  const completedCount = progress.filter(p => p.completed).length;

  return { progress, isLoading, error, markComplete, markIncomplete, isCompleted, completedCount, refetch: fetchProgress };
}

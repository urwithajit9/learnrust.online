// Hook to fetch curriculum data from Supabase database
// Ensures synchronization between Curriculum, Lessons, and Calendar
import { useState, useEffect, useMemo, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { curriculumData as staticCurriculum, CurriculumItem, phaseInfo } from '@/data/curriculum';

// Debug logging
console.log('[useCurriculum] Module loaded');
console.log('[useCurriculum] Static curriculum imported:', {
  exists: !!staticCurriculum,
  isArray: Array.isArray(staticCurriculum),
  length: staticCurriculum?.length || 0,
  firstItem: staticCurriculum?.[0] || 'N/A'
});

export interface EnrichedCurriculumItem extends CurriculumItem {
  dayIndex: number;
  lessonId?: string;
  hasContent: boolean;
  estimatedTimeMinutes: number;
}

interface UseCurriculumResult {
  curriculum: EnrichedCurriculumItem[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
  getItemByDayIndex: (dayIndex: number) => EnrichedCurriculumItem | undefined;
  getItemBySlug: (slug: string) => EnrichedCurriculumItem | undefined;
  getItemsByPhase: (phase: number) => EnrichedCurriculumItem[];
  getItemsByConcept: (concept: string) => EnrichedCurriculumItem[];
  getAllConcepts: () => string[];
}

const TOTAL_DAYS = 121;
const DEFAULT_ESTIMATED_TIME = 10;

// Create placeholder curriculum item for days without content
function createPlaceholderItem(dayIndex: number): EnrichedCurriculumItem {
  return {
    date: `Day ${dayIndex}`,
    day: '',
    topic: 'Coming Soon',
    concept: 'Placeholder',
    phase: Math.ceil(dayIndex / 31), // Approximate phase based on day
    dayIndex,
    topicSlug: `day-${dayIndex}`,
    hasContent: false,
    estimatedTimeMinutes: DEFAULT_ESTIMATED_TIME,
  };
}

export function useCurriculum(): UseCurriculumResult {
  const [lessonsMap, setLessonsMap] = useState<Map<number, { id: string; title: string; topicSlug: string; estimatedTimeMinutes: number }>>(new Map());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  console.log('[useCurriculum] Hook called, isSupabaseConfigured:', isSupabaseConfigured());

  // Fetch lessons from database to sync with curriculum
  const fetchLessons = useCallback(async () => {
    console.log('[useCurriculum] fetchLessons called');
    
    // If Supabase is not configured, use static data only
    if (!isSupabaseConfigured()) {
      console.log('[useCurriculum] Supabase not configured, using static data only');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error: fetchError } = await supabase
        .from('lessons')
        .select('id, day_index, title, topic_slug, estimated_time_minutes')
        .order('day_index', { ascending: true });

      if (fetchError) {
        throw fetchError;
      }

      const map = new Map<number, { id: string; title: string; topicSlug: string; estimatedTimeMinutes: number }>();
      data?.forEach(lesson => {
        map.set(lesson.day_index, {
          id: lesson.id,
          title: lesson.title,
          topicSlug: lesson.topic_slug,
          estimatedTimeMinutes: lesson.estimated_time_minutes || DEFAULT_ESTIMATED_TIME,
        });
      });
      setLessonsMap(map);
    } catch (err) {
      console.error('Error fetching lessons for curriculum:', err);
      setError('Failed to load curriculum data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLessons();
  }, []);

  // Merge static curriculum with database lessons
  // Database takes precedence for existing lessons, static data fills gaps
  const curriculum = useMemo<EnrichedCurriculumItem[]>(() => {
    console.log('[useCurriculum] Building curriculum, staticCurriculum:', {
      exists: !!staticCurriculum,
      isArray: Array.isArray(staticCurriculum),
      length: staticCurriculum?.length || 0
    });
    
    // Ensure we always return a valid array even if staticCurriculum is undefined
    if (!staticCurriculum || !Array.isArray(staticCurriculum)) {
      console.error('[useCurriculum] ERROR: staticCurriculum is invalid!');
      // Return placeholder items for all days
      const placeholders: EnrichedCurriculumItem[] = [];
      for (let i = 1; i <= TOTAL_DAYS; i++) {
        placeholders.push(createPlaceholderItem(i));
      }
      return placeholders;
    }
    
    const items: EnrichedCurriculumItem[] = [];

    for (let dayIndex = 1; dayIndex <= TOTAL_DAYS; dayIndex++) {
      const staticItem = staticCurriculum[dayIndex - 1];
      const dbLesson = lessonsMap.get(dayIndex);

      if (dbLesson) {
        // DB lesson exists - use it with static metadata
        items.push({
          date: staticItem?.date || `Day ${dayIndex}`,
          day: staticItem?.day || '',
          topic: dbLesson.title || staticItem?.topic || 'Lesson',
          concept: staticItem?.concept || 'General',
          phase: staticItem?.phase || Math.ceil(dayIndex / 31),
          dayIndex,
          topicSlug: dbLesson.topicSlug || staticItem?.topicSlug || `day-${dayIndex}`,
          lessonId: dbLesson.id,
          hasContent: true,
          estimatedTimeMinutes: dbLesson.estimatedTimeMinutes,
        });
      } else if (staticItem) {
        // Only static data exists - mark as placeholder if no content in DB
        items.push({
          ...staticItem,
          dayIndex,
          topicSlug: staticItem.topicSlug || `day-${dayIndex}`,
          hasContent: false, // No DB content yet
          estimatedTimeMinutes: DEFAULT_ESTIMATED_TIME,
        });
      } else {
        // No data at all - create placeholder
        items.push(createPlaceholderItem(dayIndex));
      }
    }

    console.log('[useCurriculum] Curriculum built, items:', items.length);
    return items;
  }, [lessonsMap]);

  const getItemByDayIndex = useCallback((dayIndex: number): EnrichedCurriculumItem | undefined => {
    return curriculum.find(item => item.dayIndex === dayIndex);
  }, [curriculum]);

  const getItemBySlug = useCallback((slug: string): EnrichedCurriculumItem | undefined => {
    return curriculum.find(item => item.topicSlug === slug);
  }, [curriculum]);

  const getItemsByPhase = useCallback((phase: number): EnrichedCurriculumItem[] => {
    return curriculum.filter(item => item.phase === phase);
  }, [curriculum]);

  const getItemsByConcept = useCallback((concept: string): EnrichedCurriculumItem[] => {
    return curriculum.filter(item => item.concept === concept);
  }, [curriculum]);

  const getAllConcepts = useCallback((): string[] => {
    return [...new Set(curriculum.map(item => item.concept))];
  }, [curriculum]);

  return {
    curriculum,
    isLoading,
    error,
    refetch: fetchLessons,
    getItemByDayIndex,
    getItemBySlug,
    getItemsByPhase,
    getItemsByConcept,
    getAllConcepts,
  };
}

// Re-export phaseInfo for convenience
export { phaseInfo };

import { CurriculumItem } from '@/data/curriculum';

// Simple fuzzy search implementation
export const fuzzyMatch = (text: string, query: string): boolean => {
  const textLower = text.toLowerCase();
  const queryLower = query.toLowerCase();
  
  // Direct substring match
  if (textLower.includes(queryLower)) return true;
  
  // Fuzzy match - all query characters must appear in order
  let queryIndex = 0;
  for (let i = 0; i < textLower.length && queryIndex < queryLower.length; i++) {
    if (textLower[i] === queryLower[queryIndex]) {
      queryIndex++;
    }
  }
  return queryIndex === queryLower.length;
};

// Generic search function that works with any curriculum-like items
export const searchCurriculum = <T extends CurriculumItem>(
  data: T[], 
  query: string
): T[] => {
  if (!data || !Array.isArray(data)) return [];
  if (!query.trim()) return data;
  
  const normalizedQuery = query.toLowerCase().trim();
  
  return data.filter(item => 
    fuzzyMatch(item.topic, normalizedQuery) ||
    fuzzyMatch(item.concept, normalizedQuery) ||
    fuzzyMatch(item.date, normalizedQuery) ||
    fuzzyMatch(`phase ${item.phase}`, normalizedQuery)
  );
};

export const filterByPhase = <T extends CurriculumItem>(
  data: T[], 
  phase: string
): T[] => {
  if (!data || !Array.isArray(data)) return [];
  if (phase === 'all') return data;
  return data.filter(item => item.phase.toString() === phase);
};

export const filterByConcept = <T extends CurriculumItem>(
  data: T[], 
  concept: string
): T[] => {
  if (!data || !Array.isArray(data)) return [];
  if (!concept || concept === 'all') return data;
  return data.filter(item => item.concept === concept);
};

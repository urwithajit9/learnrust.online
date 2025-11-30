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

export const searchCurriculum = (
  data: CurriculumItem[], 
  query: string
): CurriculumItem[] => {
  if (!query.trim()) return data;
  
  const normalizedQuery = query.toLowerCase().trim();
  
  return data.filter(item => 
    fuzzyMatch(item.topic, normalizedQuery) ||
    fuzzyMatch(item.concept, normalizedQuery) ||
    fuzzyMatch(item.date, normalizedQuery) ||
    fuzzyMatch(`phase ${item.phase}`, normalizedQuery)
  );
};

export const filterByPhase = (
  data: CurriculumItem[], 
  phase: string
): CurriculumItem[] => {
  if (phase === 'all') return data;
  return data.filter(item => item.phase.toString() === phase);
};

export const filterByConcept = (
  data: CurriculumItem[], 
  concept: string
): CurriculumItem[] => {
  if (!concept || concept === 'all') return data;
  return data.filter(item => item.concept === concept);
};

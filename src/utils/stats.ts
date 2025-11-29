import { CurriculumItem, curriculumData } from '@/data/curriculum';

export interface ProgressStats {
  total: number;
  completed: number;
  remaining: number;
  percent: number;
  estimatedHours: number;
  hoursCompleted: number;
}

export const calculateStats = (completedItems: string[]): ProgressStats => {
  const total = curriculumData.length;
  const completed = completedItems.length;
  const remaining = total - completed;
  const percent = Math.round((completed / total) * 100);
  const estimatedHours = Math.round(total * 10 / 60); // 10 min per day
  const hoursCompleted = Math.round(completed * 10 / 60);
  
  return { total, completed, remaining, percent, estimatedHours, hoursCompleted };
};

export interface ConceptDistribution {
  concept: string;
  count: number;
  completedCount: number;
}

export const getConceptDistribution = (
  data: CurriculumItem[], 
  completedItems: string[]
): ConceptDistribution[] => {
  const counts: Record<string, { total: number; completed: number }> = {};
  
  data.forEach(item => {
    if (!counts[item.concept]) {
      counts[item.concept] = { total: 0, completed: 0 };
    }
    counts[item.concept].total++;
    if (completedItems.includes(item.date)) {
      counts[item.concept].completed++;
    }
  });
  
  return Object.entries(counts)
    .map(([concept, { total, completed }]) => ({
      concept,
      count: total,
      completedCount: completed
    }))
    .sort((a, b) => b.count - a.count);
};

export const getPhaseProgress = (
  completedItems: string[]
): { phase: number; total: number; completed: number; percent: number }[] => {
  return [1, 2, 3, 4].map(phase => {
    const phaseItems = curriculumData.filter(item => item.phase === phase);
    const completed = phaseItems.filter(item => completedItems.includes(item.date)).length;
    return {
      phase,
      total: phaseItems.length,
      completed,
      percent: Math.round((completed / phaseItems.length) * 100)
    };
  });
};

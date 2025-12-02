import { curriculumData, CurriculumItem } from '@/data/curriculum';

export function getCurriculumItemByDayIndex(dayIndex: number): CurriculumItem | undefined {
  // Day index is 1-based, array is 0-based
  return curriculumData[dayIndex - 1];
}

export function getDayIndexByDate(date: string): number | undefined {
  const index = curriculumData.findIndex(item => item.date === date);
  return index >= 0 ? index + 1 : undefined;
}
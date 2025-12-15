export interface CoreExample {
  code: string;
  explanation: string;
}

export interface PitfallExample {
  code: string;
  errorHint: string;
}

export interface Challenge {
  template: string;
  instructions?: string; // legacy field
  task?: string; // new field from database
  hint?: string;
  tools_used?: string;
  expectedOutput: string;
}

export interface DailyLesson {
  day: number;
  title: string;
  topicSlug: string;
  estimatedTimeMinutes: number;
  theory: string;
  coreExample: CoreExample;
  pitfallExample: PitfallExample;
  challenge: Challenge;
}

export interface LessonPlaceholder {
  title: string;
  theory: string;
  isPlaceholder: true;
}

export type LessonData = DailyLesson | LessonPlaceholder;

export function isFullLesson(lesson: LessonData): lesson is DailyLesson {
  return !('isPlaceholder' in lesson);
}

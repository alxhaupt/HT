export type TabKey = 'home' | 'goals' | 'body' | 'sleep' | 'activity' | 'meals' | 'rewards';

export type ScoringActionKey =
  | 'sleptSide'
  | 'snoreFree'
  | 'inBedOnTime'
  | 'noEveningAlcohol'
  | 'cookedMeal'
  | 'workout'
  | 'walk';

export const SCORING_ACTIONS: Record<ScoringActionKey, { label: string; points: number }> = {
  sleptSide: { label: 'Slept on side all night', points: 3 },
  snoreFree: { label: 'Snore-free night', points: 3 },
  inBedOnTime: { label: 'In bed by target time', points: 2 },
  noEveningAlcohol: { label: 'No evening alcohol', points: 2 },
  cookedMeal: { label: 'Cooked a real meal at home', points: 2 },
  workout: { label: 'Gym session or run', points: 2 },
  walk: { label: 'A walk', points: 1 }
};

export interface HabitDayRecord { date: string; actions: Partial<Record<ScoringActionKey, boolean>>; }
export interface BodyStats { weightKg?: number; heightCm?: number; age?: number; sex?: 'male'|'female'; activity?: number; goal?: 'cut'|'maintain'|'gain'; }
export interface WeightEntry { date: string; weightKg: number; }
export interface SleepEntry { date: string; hours: number; quality: number; snoring: number; }

export interface AppData {
  habitLogs: HabitDayRecord[];
  weeklyTarget: number;
  archivedWeeklyTargets: { weekEnding: string; score: number }[];
  goals: { weightGoalKg?: number; weeklyScoreGoal?: number; dailyIntention: string; weeklyIntention: string; monthlyIntention: string; };
  body: BodyStats;
  calorieLogs: { date: string; item: string; kcal: number }[];
  weightLogs: WeightEntry[];
  sleep: { targetBedtime: string; targetWakeTime: string; entries: SleepEntry[] };
  activityPlan: Record<number, string>;
  activityDone: string[];
  mealPrefs: { likes: string; dislikes: string; allergies: string; dietStyle: string };
  mealPlan: Record<string, string>;
  groceryList: string;
  rewards: Record<number, string>;
}

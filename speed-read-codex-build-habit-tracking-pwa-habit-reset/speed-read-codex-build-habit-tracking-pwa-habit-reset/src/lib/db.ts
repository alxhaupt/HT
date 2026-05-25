import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { AppData } from './types';

const DB_NAME = 'habit-reset-db';
const STORE = 'kv';
const KEY = 'app-data';
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;
const SUPABASE_PROFILE_ID = (import.meta.env.VITE_SUPABASE_PROFILE_ID as string | undefined) ?? 'default-user';

export const defaultData: AppData = {
  habitLogs: [],
  weeklyTarget: 0,
  archivedWeeklyTargets: [],
  goals: { dailyIntention: '', weeklyIntention: '', monthlyIntention: '' },
  body: {},
  calorieLogs: [],
  weightLogs: [],
  sleep: { targetBedtime: '22:30', targetWakeTime: '06:30', entries: [] },
  activityPlan: {
    0: 'Rest or mobility',
    1: 'Gym upper body',
    2: 'Walk 30 min',
    3: 'Gym lower body',
    4: 'Run intervals',
    5: 'Long walk',
    6: 'Recovery stretch'
  },
  activityDone: [],
  mealPrefs: { likes: '', dislikes: '', allergies: '', dietStyle: '' },
  mealPlan: {},
  groceryList: '',
  rewards: { 2: 'New book', 3: 'Massage', 4: 'Day trip', 5: 'Fitness gear' }
};

let supabase: SupabaseClient | null = null;
const getSupabase = (): SupabaseClient | null => {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return null;
  if (!supabase) supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  return supabase;
};

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(STORE);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function loadFromIndexedDb(): Promise<AppData> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readonly');
    const req = tx.objectStore(STORE).get(KEY);
    req.onsuccess = () => resolve((req.result as AppData) || defaultData);
    req.onerror = () => reject(req.error);
  });
}

async function saveToIndexedDb(data: AppData): Promise<void> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite');
    tx.objectStore(STORE).put(data, KEY);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function loadData(): Promise<AppData> {
  const client = getSupabase();
  if (!client) return loadFromIndexedDb();

  const { data, error } = await client
    .from('habit_reset_profiles')
    .select('app_data')
    .eq('id', SUPABASE_PROFILE_ID)
    .maybeSingle();

  if (error) {
    return loadFromIndexedDb();
  }

  const loaded = (data?.app_data as AppData | null) ?? defaultData;
  await saveToIndexedDb(loaded);
  return loaded;
}

export async function saveData(data: AppData): Promise<void> {
  await saveToIndexedDb(data);

  const client = getSupabase();
  if (!client) return;

  await client.from('habit_reset_profiles').upsert(
    {
      id: SUPABASE_PROFILE_ID,
      app_data: data,
      updated_at: new Date().toISOString()
    },
    { onConflict: 'id' }
  );
}

export const supabaseSchemaSql = `
create table if not exists public.habit_reset_profiles (
  id text primary key,
  app_data jsonb not null,
  updated_at timestamptz not null default now()
);
`;

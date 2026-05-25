# Habit Reset (PWA)

Habit Reset is a single-user habit tracker focused on sleep as the keystone behavior.
It is installable as a PWA and works offline.

## Run locally
```bash
npm install
npm run dev
```

## Build and preview
```bash
npm run build
npm run preview
```

## Database
The app now supports Supabase persistence via `@supabase/supabase-js`.

- If Supabase env vars are set, data loads/saves to Supabase table `habit_reset_profiles`.
- IndexedDB is still used as an offline cache and fallback.

Create `.env` from `.env.example`:

```bash
cp .env.example .env
```

Required variables:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_SUPABASE_PROFILE_ID` (single-user id, e.g. `my-phone`)

SQL to create table:

```sql
create table if not exists public.habit_reset_profiles (
  id text primary key,
  app_data jsonb not null,
  updated_at timestamptz not null default now()
);
```

## Data model and extension
`AppData` lives in `src/lib/types.ts`.
Storage integration lives in `src/lib/db.ts` with `loadData()` and `saveData()`, so changing backend/sync strategy is centralized.

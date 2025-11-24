# Simple Notes (React + Supabase)

A modern two-pane notes app using the Ocean Professional theme.

## Quick start

1) Install dependencies
- npm install

2) Set environment variables
- Copy .env.example to .env
- Set:
  - REACT_APP_SUPABASE_URL
  - REACT_APP_SUPABASE_KEY

3) Run
- npm start
- Open http://localhost:3000

If the Supabase environment is missing, the app still loads with a banner; notes won't persist.

## Database schema

Create a table named notes:

```sql
create extension if not exists "uuid-ossp";

create table if not exists public.notes (
  id uuid primary key default uuid_generate_v4(),
  title text,
  content text,
  created_at timestamptz,
  updated_at timestamptz
);
```

Realtime is enabled via the supabase-js channel on public.notes.

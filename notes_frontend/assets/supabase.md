# Supabase Integration Guide

This app uses Supabase for persistence and optional realtime.

Environment variables (create .env from .env.example):
- REACT_APP_SUPABASE_URL
- REACT_APP_SUPABASE_KEY

Client initialization:
- src/supabaseClient.js creates the client if env vars are present; otherwise exports null and the UI shows a banner.

Database schema:
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

Realtime:
- useNotes subscribes to postgres_changes on public.notes when enableRealtime=true.

Redirects (for auth if added later):
- Use REACT_APP_FRONTEND_URL or REACT_APP_API_BASE if needed.

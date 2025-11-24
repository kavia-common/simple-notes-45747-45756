# simple-notes-45747-45756

This workspace contains the notes_frontend React app.

## Overview

Simple Notes is a modern two‑pane notes application built with React and Supabase. It follows the Ocean Professional theme, featuring a clean aesthetic with blue and amber accents, rounded corners, and subtle shadows. The left pane lists notes; the right pane shows the editor for the selected note.

- Frontend container: simple-notes-45747-45756/notes_frontend
- UI framework: React (Create React App)
- Persistence: Supabase Database (optional). If Supabase is not configured, the app still loads with a banner and operates without persistence.

## Features

- Create, view, edit, and delete notes
- Two‑pane responsive layout (list on the left, editor on the right)
- Realtime updates via Supabase Postgres changes (when configured)
- Graceful handling of missing Supabase configuration (banner shown, app usable without persistence)
- Detection and helpful guidance when the notes table is missing
- Light/Dark toggle (simple theme switch)

## Setup

1) Install dependencies
- cd simple-notes-45747-45756/notes_frontend
- npm install

2) Configure environment
- Copy .env.example to .env
- Set the following variables:
  - REACT_APP_SUPABASE_URL
  - REACT_APP_SUPABASE_KEY

These are the only environment variables the frontend uses for Supabase. The workspace may include other container_env variables commonly used by other apps, but they are not consumed by this frontend.

Reference list from container_env (not used by this app unless you add related features): REACT_APP_API_BASE, REACT_APP_BACKEND_URL, REACT_APP_FRONTEND_URL, REACT_APP_WS_URL, REACT_APP_NODE_ENV, REACT_APP_NEXT_TELEMETRY_DISABLED, REACT_APP_ENABLE_SOURCE_MAPS, REACT_APP_PORT, REACT_APP_TRUST_PROXY, REACT_APP_LOG_LEVEL, REACT_APP_HEALTHCHECK_PATH, REACT_APP_FEATURE_FLAGS, REACT_APP_EXPERIMENTS_ENABLED.

3) Run the app
- npm start
- Open http://localhost:3000

If the Supabase environment is missing, the app will show a banner and continue to work without persistence.

## Environment variables

Required for Supabase:
- REACT_APP_SUPABASE_URL: Your Supabase project URL (e.g., https://xyzcompany.supabase.co)
- REACT_APP_SUPABASE_KEY: Your Supabase anon key

Behavior in code:
- src/supabaseClient.js reads these and conditionally creates a Supabase client.
- src/hooks/useNotes.js sets envMissing to true if the client is not created, which the Header displays as a banner reminder.

## Database schema

Create a table named notes in your Supabase project:

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

Notes:
- The hook useNotes orders by updated_at desc.
- If the table is missing, the UI surfaces a helpful state in the editor pane and sets tableMissing to true.

Realtime:
- The app subscribes to postgres_changes on public.notes when enableRealtime is true (default). Insert, update, and delete events update the local list.

## Run scripts

- npm start: Start development server
- npm run build: Create production build
- npm test: Run tests (default CRA setup)

## Theming: Ocean Professional

Theme variables are defined in src/styles/theme.css:

- Primary: #2563EB (blue)
- Secondary: #F59E0B (amber)
- Error: #EF4444
- Background/surface/text/border tokens for consistent UI
- Subtle gradients and shadows for depth

Components use these variables via CSS files:
- Header: src/components/header.css
- Notes list: src/components/notesList.css
- Note editor: src/components/noteEditor.css

A simple light/dark toggle is available in App.js and sets data-theme on the root element. You can extend theme.css to add dark tokens if desired.

## Key code references

- Supabase client: src/supabaseClient.js
- Notes data hook: src/hooks/useNotes.js (CRUD + realtime + error handling)
- App shell and layout: src/App.js and src/styles/theme.css
- Components:
  - Header: src/components/Header.js
  - NotesList: src/components/NotesList.js
  - NoteEditor: src/components/NoteEditor.js
  - Empty state: src/components/EmptyState.js

## Troubleshooting

- See a “Supabase configuration missing” banner:
  - Ensure REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_KEY are set in .env, then restart npm start.
- “Notes table not found” in the editor:
  - Create the notes table using the SQL above. After creation, the UI will operate normally.
- Realtime not updating:
  - Ensure your Supabase project has Realtime enabled and that your anon key has appropriate permissions.
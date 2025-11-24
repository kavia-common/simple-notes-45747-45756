# Simple Notes (React + Supabase)

A modern two‑pane notes app using the Ocean Professional theme. The left pane lists notes; the right pane lets you edit the selected note. Supabase provides persistence and optional realtime; if not configured, the app remains usable with a clear banner indicating that notes will not persist.

## Feature overview

- Create, view, edit, delete notes
- Responsive two‑pane layout
- Optional realtime updates via Supabase postgres_changes
- Graceful handling of missing Supabase credentials and missing database table
- Simple light/dark theme toggle

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

If the Supabase environment is missing, the app still loads with a banner; notes will not persist.

## Environment variables

Required:
- REACT_APP_SUPABASE_URL
- REACT_APP_SUPABASE_KEY

Behavior:
- src/supabaseClient.js conditionally creates the client if both vars are present.
- When missing, src/hooks/useNotes.js exposes envMissing so the Header can show a banner.

Note: The workspace lists other container_env variables (REACT_APP_API_BASE, REACT_APP_BACKEND_URL, REACT_APP_FRONTEND_URL, REACT_APP_WS_URL, REACT_APP_NODE_ENV, REACT_APP_NEXT_TELEMETRY_DISABLED, REACT_APP_ENABLE_SOURCE_MAPS, REACT_APP_PORT, REACT_APP_TRUST_PROXY, REACT_APP_LOG_LEVEL, REACT_APP_HEALTHCHECK_PATH, REACT_APP_FEATURE_FLAGS, REACT_APP_EXPERIMENTS_ENABLED). These are not used by this app unless you add features that rely on them.

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

- The app orders by updated_at descending and updates updated_at on edits.
- If the table is missing, the editor pane will display guidance and set tableMissing to true.

Realtime:
- The app subscribes to postgres_changes on public.notes when enableRealtime is true (default). See src/hooks/useNotes.js for details.

## Theming: Ocean Professional

Theme tokens live in src/styles/theme.css:
- Primary: #2563EB (blue)
- Secondary: #F59E0B (amber)
- Error: #EF4444
- Background, surface, text, border, and soft background variables provide a cohesive modern look.

Component styles:
- Header: src/components/header.css
- Notes list: src/components/notesList.css
- Note editor: src/components/noteEditor.css

There is a simple light/dark toggle in App.js that sets data-theme on the root element. Extend theme.css for dark-specific variables if needed.

## Key files

- src/supabaseClient.js: Supabase client initialization
- src/hooks/useNotes.js: CRUD operations, realtime subscription, error handling
- src/App.js: App shell, layout, and theme toggle
- src/components: Header, NotesList, NoteEditor, EmptyState

## Scripts

- npm start: Development server
- npm run build: Production build
- npm test: Tests (CRA default)

import React, { useMemo, useState } from 'react';
import './styles/theme.css';
import './App.css';
import Header from './components/Header';
import NotesList from './components/NotesList';
import NoteEditor from './components/NoteEditor';
import EmptyState from './components/EmptyState';
import './components/header.css';
import './components/notesList.css';
import './components/noteEditor.css';
import { useNotes } from './hooks/useNotes';

// PUBLIC_INTERFACE
function App() {
  // Optional simple theme toggle preserved to meet initial template feature, default modern light
  const [theme, setTheme] = useState('light');
  const themeLabel = useMemo(() => (theme === 'light' ? '🌙 Dark' : '☀️ Light'), [theme]);
  const toggleTheme = () => setTheme(prev => (prev === 'light' ? 'dark' : 'light'));

  const {
    notes,
    activeNote,
    activeNoteId,
    loading,
    error,
    tableMissing,
    envMissing,
    setActiveNoteId,
    createNote,
    updateNote,
    deleteNote
  } = useNotes({ enableRealtime: true });

  const handleAdd = async () => {
    try {
      const note = await createNote({ title: 'Untitled', content: '' });
      if (note?.id) setActiveNoteId(note.id);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
    }
  };

  const handleSave = async (payload) => {
    if (!activeNoteId) return;
    try {
      await updateNote(activeNoteId, payload);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
    }
  };

  const handleDelete = async (id) => {
    // confirm lightly
    if (window.confirm('Delete this note?')) {
      try {
        await deleteNote(id);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
      }
    }
  };

  // Set data-theme attribute for legacy CSS variables if needed
  document.documentElement.setAttribute('data-theme', theme);

  return (
    <div className="app-shell" data-theme={theme}>
      <Header onAdd={handleAdd} envMissing={envMissing} />
      <div className="two-pane">
        <aside className="left">
          {loading && <div className="nf-empty-small" style={{ padding: 12 }}>Loading…</div>}
          {error && <div className="nf-banner" style={{ margin: 8, borderColor: 'var(--error)', color: '#7f1d1d' }}>Error: {String(error)}</div>}
          {notes.length === 0 && !loading ? (
            <EmptyState title="No notes yet" actionLabel="+ New Note" onAction={handleAdd} />
          ) : (
            <NotesList
              notes={notes}
              activeId={activeNoteId}
              onSelect={setActiveNoteId}
              onDelete={handleDelete}
            />
          )}
          <div style={{ padding: 8, display: 'flex', justifyContent: 'flex-end' }}>
            <button className="btn" onClick={toggleTheme} aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}>
              {themeLabel}
            </button>
          </div>
        </aside>
        <main className="right">
          <NoteEditor
            note={activeNote}
            onChange={() => {}}
            onSave={handleSave}
            onCreate={handleAdd}
            tableMissing={tableMissing}
          />
        </main>
      </div>
    </div>
  );
}

export default App;

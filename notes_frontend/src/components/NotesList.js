import React from 'react';
import './notesList.css';

/**
 * PUBLIC_INTERFACE
 * NotesList shows the list of notes and allows selecting or deleting a note.
 */
export default function NotesList({ notes, activeId, onSelect, onDelete }) {
  return (
    <div className="nf-list">
      {notes.length === 0 && <div className="nf-empty-small">No notes yet</div>}
      {notes.map(note => (
        <div
          key={note.id}
          className={`nf-list-item ${activeId === note.id ? 'active' : ''}`}
          onClick={() => onSelect(note.id)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => (e.key === 'Enter' ? onSelect(note.id) : null)}
        >
          <div className="title">{note.title || 'Untitled'}</div>
          <div className="meta">
            {note.updated_at ? new Date(note.updated_at).toLocaleString() : ''}
          </div>
          <button
            className="icon-btn"
            title="Delete"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(note.id);
            }}
            aria-label={`Delete ${note.title || 'note'}`}
          >
            🗑
          </button>
        </div>
      ))}
    </div>
  );
}

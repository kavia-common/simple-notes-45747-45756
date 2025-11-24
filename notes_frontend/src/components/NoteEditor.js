import React, { useEffect, useState } from 'react';
import './noteEditor.css';

/**
 * PUBLIC_INTERFACE
 * NoteEditor allows editing a selected note (title and content).
 */
export default function NoteEditor({ note, onChange, onSave, onCreate, tableMissing }) {
  const [local, setLocal] = useState({ title: '', content: '' });

  useEffect(() => {
    if (note) setLocal({ title: note.title || '', content: note.content || '' });
  }, [note]);

  if (tableMissing) {
    return (
      <div className="nf-editor empty">
        <h2>Notes table not found</h2>
        <p>
          It looks like the "notes" table is missing in your Supabase database. Create a table named notes with columns:
        </p>
        <ul>
          <li>id: uuid (primary key, default uuid_generate_v4())</li>
          <li>title: text</li>
          <li>content: text</li>
          <li>created_at: timestamptz</li>
          <li>updated_at: timestamptz</li>
        </ul>
        <button className="btn btn-primary" onClick={onCreate}>Create a quick note</button>
      </div>
    );
  }

  if (!note) {
    return (
      <div className="nf-editor empty">
        <h2>Select a note or create a new one</h2>
        <button className="btn btn-primary" onClick={onCreate}>+ New Note</button>
      </div>
    );
  }

  return (
    <div className="nf-editor">
      <input
        className="nf-input title"
        value={local.title}
        onChange={(e) => {
          const next = { ...local, title: e.target.value };
          setLocal(next);
          onChange && onChange(next);
        }}
        placeholder="Title"
        aria-label="Note title"
      />
      <textarea
        className="nf-input content"
        value={local.content}
        onChange={(e) => {
          const next = { ...local, content: e.target.value };
          setLocal(next);
          onChange && onChange(next);
        }}
        placeholder="Write your note here..."
        aria-label="Note content"
      />
      <div className="nf-editor-actions">
        <button className="btn btn-primary" onClick={() => onSave(local)}>Save</button>
      </div>
    </div>
  );
}

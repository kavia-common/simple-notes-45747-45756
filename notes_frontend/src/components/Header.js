import React from 'react';
import './header.css';

/**
 * PUBLIC_INTERFACE
 * Header renders the top bar with title, add button, and environment warnings.
 */
export default function Header({ onAdd, envMissing }) {
  return (
    <header className="nf-header">
      <div className="nf-header-top">
        <h1 className="nf-brand">Simple Notes</h1>
        <button className="btn btn-primary" onClick={onAdd} aria-label="Add note">
          + New Note
        </button>
      </div>
      {envMissing && (
        <div className="nf-banner" role="status" aria-live="polite">
          Supabase configuration missing. Set REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_KEY in .env to enable persistence.
        </div>
      )}
    </header>
  );
}

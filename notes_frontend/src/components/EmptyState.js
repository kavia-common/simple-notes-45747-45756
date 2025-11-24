import React from 'react';

/**
 * PUBLIC_INTERFACE
 * EmptyState renders a simple placeholder with an action.
 */
export default function EmptyState({ title = 'No items', actionLabel = 'Create', onAction }) {
  return (
    <div style={{ padding: 16, textAlign: 'center', color: 'var(--text-muted)' }}>
      <p style={{ marginBottom: 10 }}>{title}</p>
      <button className="btn btn-primary" onClick={onAction}>{actionLabel}</button>
    </div>
  );
}

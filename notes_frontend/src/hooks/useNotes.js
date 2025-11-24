import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import supabase, { supabaseUrl, supabaseKey } from '../supabaseClient';

/**
 * PUBLIC_INTERFACE
 * useNotes manages the lifecycle of notes: list, create, update, delete.
 * - Handles missing environment variables (no Supabase URL/KEY).
 * - Gracefully handles missing notes table by exposing a flag.
 * - Optionally subscribes to realtime changes if enabled.
 *
 * @param {Object} options
 * @param {boolean} options.enableRealtime - subscribe to realtime changes
 * @returns {Object} state and operations
 */
export function useNotes({ enableRealtime = true } = {}) {
  const [notes, setNotes] = useState([]);
  const [activeNoteId, setActiveNoteId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [tableMissing, setTableMissing] = useState(false);
  const [error, setError] = useState(null);
  const [envMissing, setEnvMissing] = useState(false);
  const channelRef = useRef(null);

  const isSupabaseReady = useMemo(() => Boolean(supabase && supabaseUrl && supabaseKey), [supabaseUrl, supabaseKey]);

  useEffect(() => {
    if (!isSupabaseReady) {
      setEnvMissing(true);
    }
  }, [isSupabaseReady]);

  const fetchNotes = useCallback(async () => {
    if (!isSupabaseReady) return;
    setLoading(true);
    setError(null);
    try {
      const { data, error: err } = await supabase
        .from('notes')
        .select('*')
        .order('updated_at', { ascending: false });

      if (err) {
        // Detect table missing error (Postgres code 42P01)
        if (err.code === '42P01' || (err.message && err.message.toLowerCase().includes('relation') && err.message.toLowerCase().includes('does not exist'))) {
          setTableMissing(true);
          setNotes([]);
          setLoading(false);
          return;
        }
        throw err;
      }

      setTableMissing(false);
      setNotes(data || []);
    } catch (e) {
      setError(e.message || 'Failed to fetch notes');
    } finally {
      setLoading(false);
    }
  }, [isSupabaseReady]);

  const createNote = useCallback(async (partial = {}) => {
    if (!isSupabaseReady) return null;
    const now = new Date().toISOString();
    const payload = {
      title: partial.title ?? 'Untitled',
      content: partial.content ?? '',
      created_at: now,
      updated_at: now
    };

    const { data, error: err } = await supabase.from('notes').insert(payload).select().single();
    if (err) {
      if (err.code === '42P01') setTableMissing(true);
      throw new Error(err.message || 'Failed to create note');
    }
    setTableMissing(false);
    setNotes(prev => [data, ...prev]);
    setActiveNoteId(data.id);
    return data;
  }, [isSupabaseReady]);

  const updateNote = useCallback(async (id, updates) => {
    if (!isSupabaseReady) return null;
    const { data, error: err } = await supabase
      .from('notes')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (err) {
      if (err.code === '42P01') setTableMissing(true);
      throw new Error(err.message || 'Failed to update note');
    }
    setTableMissing(false);
    setNotes(prev => prev.map(n => (n.id === id ? data : n)));
    return data;
  }, [isSupabaseReady]);

  const deleteNote = useCallback(async (id) => {
    if (!isSupabaseReady) return false;
    const { error: err } = await supabase.from('notes').delete().eq('id', id);
    if (err) {
      if (err.code === '42P01') setTableMissing(true);
      throw new Error(err.message || 'Failed to delete note');
    }
    setTableMissing(false);
    setNotes(prev => prev.filter(n => n.id !== id));
    setActiveNoteId(prev => (prev === id ? null : prev));
    return true;
  }, [isSupabaseReady]);

  // Realtime subscription
  useEffect(() => {
    if (!isSupabaseReady || !enableRealtime) return;

    // Initial fetch
    fetchNotes();

    // Subscribe to postgres changes
    const channel = supabase
      .channel('public:notes-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'notes' },
        (payload) => {
          const { eventType, new: newRow, old: oldRow } = payload;
          setNotes(prev => {
            if (eventType === 'INSERT') {
              // Avoid dup on local optimistic add
              const exists = prev.some(n => n.id === newRow.id);
              return exists ? prev.map(n => (n.id === newRow.id ? newRow : n)) : [newRow, ...prev];
            }
            if (eventType === 'UPDATE') {
              return prev.map(n => (n.id === newRow.id ? newRow : n));
            }
            if (eventType === 'DELETE') {
              return prev.filter(n => n.id !== oldRow.id);
            }
            return prev;
          });
        }
      )
      .subscribe((status) => {
        // no-op: could log status
        return status;
      });

    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSupabaseReady, enableRealtime]);

  // Initial fetch without realtime too
  useEffect(() => {
    if (!enableRealtime) fetchNotes();
  }, [enableRealtime, fetchNotes]);

  const activeNote = useMemo(() => notes.find(n => n.id === activeNoteId) || null, [notes, activeNoteId]);

  return {
    // data
    notes,
    activeNote,
    activeNoteId,
    loading,
    error,
    tableMissing,
    envMissing,
    // actions
    setActiveNoteId,
    fetchNotes,
    createNote,
    updateNote,
    deleteNote
  };
}

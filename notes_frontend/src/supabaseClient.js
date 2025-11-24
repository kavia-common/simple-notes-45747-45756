import { createClient } from '@supabase/supabase-js';

/**
 * Creates and exports a Supabase client using environment variables.
 * Gracefully handles missing configuration by returning null and allowing the UI to render a banner.
 *
 * Env vars:
 * - REACT_APP_SUPABASE_URL
 * - REACT_APP_SUPABASE_KEY
 */
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_KEY;

let supabase = null;

if (supabaseUrl && supabaseKey) {
  // Create the client only if creds are present
  supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: true
    },
    db: {
      schema: 'public'
    }
  });
}

export { supabaseUrl, supabaseKey };
export default supabase;

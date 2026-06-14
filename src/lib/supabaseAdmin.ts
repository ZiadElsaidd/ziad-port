import { createClient } from '@supabase/supabase-js';

const url = process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

let supabase = null;
if (url && serviceKey) {
  supabase = createClient(url, serviceKey, { auth: { persistSession: false } });
} else {
  // When not configured, leave supabase null and let callers fall back
  // eslint-disable-next-line no-console
  console.warn('Supabase not configured (SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY missing)');
}

export default supabase;

import { createClient } from '@supabase/supabase-js';

const url = process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  // When not configured, export null to allow fallback to filesystem
  console.warn('Supabase not configured (SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY missing)');
  // eslint-disable-next-line import/no-default-export
  export default null;
} else {
  const supabase = createClient(url, serviceKey, {
    auth: { persistSession: false },
  });
  // eslint-disable-next-line import/no-default-export
  export default supabase;
}

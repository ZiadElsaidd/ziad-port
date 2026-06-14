const fs = require('fs').promises;
const { createClient } = require('@supabase/supabase-js');

async function main() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set');
    process.exit(1);
  }
  const supabase = createClient(url, key);

  const projRaw = await fs.readFile('data/projects.json', 'utf8').catch(() => '[]');
  const revRaw = await fs.readFile('data/reviews.json', 'utf8').catch(() => '[]');
  const projects = JSON.parse(projRaw);
  const reviews = JSON.parse(revRaw);

  if (projects.length) {
    console.log(`Inserting ${projects.length} projects...`);
    const { error } = await supabase.from('projects').insert(projects);
    if (error) console.error('Projects insert error:', error);
  }
  if (reviews.length) {
    console.log(`Inserting ${reviews.length} reviews...`);
    const { error } = await supabase.from('reviews').insert(reviews);
    if (error) console.error('Reviews insert error:', error);
  }

  console.log('Migration complete');
}

main().catch((e) => { console.error(e); process.exit(1); });

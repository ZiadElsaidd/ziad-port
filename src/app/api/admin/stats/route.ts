import { NextRequest } from 'next/server';
import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import supabase from '../../../../lib/supabaseAdmin';
import { checkRateLimit, getClientIP, getSecurityHeaders, validateRequestBody } from '@/lib/security';

type StatPayload = {
  id: string;
  label: string;
  target: number;
  suffix: string;
};

const DATA_FILE = join(process.cwd(), 'data', 'stats.json');

export async function GET() {
  try {
    if (supabase) {
      const { data, error } = await supabase.from('stats').select('*').order('id', { ascending: true });
      if (error) throw error;
      return new Response(JSON.stringify(data ?? []), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }
    const raw = await readFile(DATA_FILE, 'utf8');
    return new Response(raw, { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    return new Response('[]', { status: 200, headers: { 'Content-Type': 'application/json' } });
  }
}

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIP(req);
    if (!checkRateLimit(ip, 10)) {
      return new Response('Too many requests', { status: 429, headers: getSecurityHeaders() });
    }
    const body = (await req.json()) as StatPayload[];
    if (!Array.isArray(body)) {
      return new Response('Invalid payload', { status: 400, headers: getSecurityHeaders() });
    }

    if (supabase) {
      const client = supabase;
      await Promise.all(
        body.map(async (item: StatPayload) => {
          const { id, label, target, suffix } = item;
          const { error } = await client.from('stats').upsert({ id, label, target, suffix }, { onConflict: 'id' });
          if (error) throw error;
        }),
      );
      return new Response(JSON.stringify(body), { status: 200, headers: { ...getSecurityHeaders(), 'Content-Type': 'application/json' } });
    }

    await writeFile(DATA_FILE, JSON.stringify(body, null, 2), 'utf8');
    return new Response(JSON.stringify(body), { status: 200, headers: { ...getSecurityHeaders(), 'Content-Type': 'application/json' } });
  } catch (err) {
    console.error('Stats POST error:', err);
    return new Response(JSON.stringify({ error: 'Failed to update stats' }), { status: 500, headers: getSecurityHeaders() });
  }
}

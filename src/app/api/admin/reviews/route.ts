import { NextRequest } from 'next/server';
import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import supabase from '../../../../lib/supabaseAdmin';
import { checkRateLimit, getClientIP, getSecurityHeaders, sanitizeInput } from '@/lib/security';

type LocalReview = {
  id: string;
  author: string;
  text: string;
  rating: number;
  created_at?: string;
};

const DATA_FILE = join(process.cwd(), 'data', 'reviews.json');

export async function GET() {
  try {
    if (supabase) {
      const { data, error } = await supabase.from('reviews').select('*').order('created_at', { ascending: true });
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
    const body = await req.json();
    body.author = sanitizeInput(body.author || 'Anonymous');
    body.text = sanitizeInput(body.text || '');
    if (supabase) {
      const toInsert = {
        author: body.author || 'Anonymous',
        text: body.text || '',
        rating: body.rating || 5,
        created_at: new Date().toISOString(),
      };
      const { data, error } = await supabase.from('reviews').insert([toInsert]).select();
      if (error) throw error;
      return new Response(JSON.stringify(data?.[0] ?? {}), { status: 201, headers: { 'Content-Type': 'application/json' } });
    }
    const raw = await readFile(DATA_FILE, 'utf8').catch(() => '[]');
    const items = JSON.parse(raw) as LocalReview[];
    const id = body.id || `rev-${Date.now()}`;
    const item = { ...body, id };
    items.push(item);
    await writeFile(DATA_FILE, JSON.stringify(items, null, 2), 'utf8');
    return new Response(JSON.stringify(item), { status: 201, headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    return new Response(String(err), { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, author, text, rating } = body;
    if (!id) return new Response('Missing id', { status: 400 });

    if (supabase) {
      const { data, error } = await supabase
        .from('reviews')
        .update({ author, text, rating })
        .eq('id', id)
        .select();
      if (error) throw error;
      return new Response(JSON.stringify(data?.[0] ?? {}), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }

    const raw = await readFile(DATA_FILE, 'utf8').catch(() => '[]');
    const items = JSON.parse(raw) as LocalReview[];
    const updatedItems = items.map((review) => review.id === id ? { ...review, author, text, rating } : review);
    const updated = updatedItems.find((review) => review.id === id);
    if (!updated) return new Response('Not found', { status: 404 });
    await writeFile(DATA_FILE, JSON.stringify(updatedItems, null, 2), 'utf8');
    return new Response(JSON.stringify(updated), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    return new Response(String(err), { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return new Response('Missing id', { status: 400 });
    if (supabase) {
      const { error } = await supabase.from('reviews').delete().eq('id', id);
      if (error) throw error;
      return new Response('OK', { status: 200 });
    }
    const raw = await readFile(DATA_FILE, 'utf8').catch(() => '[]');
    const items = JSON.parse(raw) as LocalReview[];
    const filtered = items.filter((r) => r.id !== id);
    await writeFile(DATA_FILE, JSON.stringify(filtered, null, 2), 'utf8');
    return new Response('OK', { status: 200 });
  } catch (err) {
    return new Response(String(err), { status: 500 });
  }
}

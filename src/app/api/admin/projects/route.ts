import { NextRequest } from 'next/server';
import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import supabase from '../../../../lib/supabaseAdmin';

type LocalProject = {
  id: string;
  title: string;
  description: string;
  year?: number | string;
  url?: string;
  created_at?: string;
};

const DATA_FILE = join(process.cwd(), 'data', 'projects.json');

export async function GET() {
  try {
    if (supabase) {
      const { data, error } = await supabase.from('projects').select('*').order('created_at', { ascending: true });
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
    const body = await req.json();
    if (supabase) {
      const toInsert = {
        title: body.title || '',
        description: body.description || '',
        year: body.year || null,
        url: body.url || null,
        created_at: new Date().toISOString(),
      };
      const { data, error } = await supabase.from('projects').insert([toInsert]).select();
      if (error) throw error;
      return new Response(JSON.stringify(data?.[0] ?? {}), { status: 201, headers: { 'Content-Type': 'application/json' } });
    }
    const raw = await readFile(DATA_FILE, 'utf8').catch(() => '[]');
    const items = JSON.parse(raw) as LocalProject[];
    const id = body.id || `proj-${Date.now()}`;
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
    const { id, title, description, year, url } = body;
    if (!id) return new Response('Missing id', { status: 400 });

    if (supabase) {
      const { data, error } = await supabase
        .from('projects')
        .update({ title, description, year, url })
        .eq('id', id)
        .select();
      if (error) throw error;
      return new Response(JSON.stringify(data?.[0] ?? {}), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }

    const raw = await readFile(DATA_FILE, 'utf8').catch(() => '[]');
    const items = JSON.parse(raw) as LocalProject[];
    const updatedItems = items.map((project) => project.id === id ? { ...project, title, description, year, url } : project);
    const updated = updatedItems.find((project) => project.id === id);
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
      const { error } = await supabase.from('projects').delete().eq('id', id);
      if (error) throw error;
      return new Response('OK', { status: 200 });
    }
    const raw = await readFile(DATA_FILE, 'utf8').catch(() => '[]');
    const items = JSON.parse(raw) as LocalProject[];
    const filtered = items.filter((p) => p.id !== id);
    await writeFile(DATA_FILE, JSON.stringify(filtered, null, 2), 'utf8');
    return new Response('OK', { status: 200 });
  } catch (err) {
    return new Response(String(err), { status: 500 });
  }
}

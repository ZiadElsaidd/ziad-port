import { redirect } from 'next/navigation';

export default function Page() {
  // normalize lowercase /dash to canonical /Dash
  redirect('/Dash');
}
"use client";

import { useEffect, useState } from 'react';

function Login({ onAuth }: { onAuth: () => void }) {
  const [pw, setPw] = useState('');
  const [err, setErr] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: pw }),
    });
    if (res.ok) {
      // ensure cookie is set (fallback for environments that ignore Set-Cookie on fetch)
      if (typeof document !== 'undefined' && !document.cookie.includes('site-auth')) {
        document.cookie = `site-auth=1; Path=/; Max-Age=${60 * 60 * 24}`;
      }
      sessionStorage.setItem('dash-auth', '1');
      onAuth();
    } else {
      setErr('Incorrect password');
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h2 className="text-2xl font-black mb-4">Dash — Admin</h2>
      <form onSubmit={submit} className="flex gap-2">
        <input
          type="password"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          placeholder="Password"
          className="border px-3 py-2 flex-1"
        />
        <button className="px-4 py-2 bg-black text-white">Enter</button>
      </form>
      {err && <p className="text-red-600 mt-2">{err}</p>}
      <p className="text-sm text-gray-600 mt-4">Note: This dashboard stores data in local JSON files for development. Use a proper DB for production.</p>
    </div>
  );
}

export default function DashPage() {
  const [authed, setAuthed] = useState(false);
  const [projects, setProjects] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');

  useEffect(() => {
    if (sessionStorage.getItem('dash-auth') === '1') setAuthed(true);
  }, []);

  useEffect(() => {
    if (!authed) return;
    fetch('/api/admin/projects').then((r) => r.json()).then(setProjects);
    fetch('/api/admin/reviews').then((r) => r.json()).then(setReviews);
  }, [authed]);

  async function addProject() {
    const res = await fetch('/api/admin/projects', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title, description: desc }) });
    if (res.ok) {
      const added = await res.json();
      setProjects((p) => [...p, added]);
      setTitle(''); setDesc('');
    }
  }

  async function delProject(id: string) {
    const res = await fetch(`/api/admin/projects?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
    if (res.ok) setProjects((p) => p.filter((x) => x.id !== id));
  }

  async function addReview(author: string, text: string) {
    const res = await fetch('/api/admin/reviews', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ author, text, rating: 5 }) });
    if (res.ok) {
      const added = await res.json();
      setReviews((r) => [...r, added]);
    }
  }

  async function delReview(id: string) {
    const res = await fetch(`/api/admin/reviews?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
    if (res.ok) setReviews((r) => r.filter((x) => x.id !== id));
  }

  if (!authed) return <Login onAuth={() => setAuthed(true)} />;

  return (
    <div className="max-w-5xl mx-auto p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-black">Admin Dashboard</h2>
        <button onClick={() => { sessionStorage.removeItem('dash-auth'); setAuthed(false); }} className="px-3 py-2 border">Sign out</button>
      </div>

      <section className="mb-10">
        <h3 className="font-bold mb-3">Projects</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {projects.map((p) => (
            <div key={p.id} className="border p-3">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-semibold">{p.title}</div>
                  <div className="text-sm text-gray-600">{p.description}</div>
                </div>
                <button onClick={() => delProject(p.id)} className="text-red-600">Delete</button>
              </div>
            </div>
          ))}
        </div>

        <div className="border p-4">
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" className="w-full border px-3 py-2 mb-2" />
          <textarea value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Description" className="w-full border px-3 py-2 mb-2" />
          <div className="flex gap-2">
            <button onClick={addProject} className="px-4 py-2 bg-black text-white">Add Project</button>
          </div>
        </div>
      </section>

      <section>
        <h3 className="font-bold mb-3">Reviews</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {reviews.map((r) => (
            <div key={r.id} className="border p-3">
              <div className="flex justify-between">
                <div>
                  <div className="font-semibold">{r.author}</div>
                  <div className="text-sm text-gray-600">{r.text}</div>
                </div>
                <button onClick={() => delReview(r.id)} className="text-red-600">Delete</button>
              </div>
            </div>
          ))}
        </div>

        <div className="border p-4">
          <AddReviewForm onAdd={(a, t) => addReview(a, t)} />
        </div>
      </section>
    </div>
  );
}

function AddReviewForm({ onAdd }: { onAdd: (author: string, text: string) => void }) {
  const [author, setAuthor] = useState('');
  const [text, setText] = useState('');
  return (
    <div>
      <input value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Author" className="w-full border px-3 py-2 mb-2" />
      <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Review text" className="w-full border px-3 py-2 mb-2" />
      <div className="flex gap-2">
        <button onClick={() => { onAdd(author, text); setAuthor(''); setText(''); }} className="px-4 py-2 bg-black text-white">Add Review</button>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from 'react';

type ProjectItem = {
  id: string;
  title: string;
  description: string;
  year?: number | string;
  url?: string;
};

type ReviewItem = {
  id: string;
  author: string;
  text: string;
  rating: number;
};

type StatItem = {
  id: string;
  label: string;
  target: number;
  suffix: string;
};

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
  const [authed, setAuthed] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.sessionStorage.getItem('dash-auth') === '1';
  });
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [stats, setStats] = useState<StatItem[]>([]);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [year, setYear] = useState('');
  const [url, setUrl] = useState('');

  useEffect(() => {
    if (!authed) return;
    fetch('/api/admin/projects').then((r) => r.json()).then(setProjects);
    fetch('/api/admin/reviews').then((r) => r.json()).then(setReviews);
    fetch('/api/admin/stats').then((r) => r.json()).then(setStats);
  }, [authed]);

  async function addProject() {
    const res = await fetch('/api/admin/projects', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title, description: desc, year: year ? Number(year) : undefined, url }) });
    if (res.ok) {
      const added = await res.json();
      setProjects((p) => [...p, added]);
      setTitle('');
      setDesc('');
      setYear('');
      setUrl('');
    }
  }

  async function delProject(id: string) {
    const res = await fetch(`/api/admin/projects?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
    if (res.ok) setProjects((p) => p.filter((x) => x.id !== id));
  }

  async function updateStats() {
    const res = await fetch('/api/admin/stats', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(stats),
    });
    if (res.ok) {
      const updated = await res.json();
      setStats(updated);
    }
  }

  async function addReview(author: string, text: string, rating: number) {
    const res = await fetch('/api/admin/reviews', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ author, text, rating }) });
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
              <div className="flex justify-between items-start gap-4">
                <div>
                  <div className="font-semibold">{p.title}</div>
                  <div className="text-sm text-gray-600 mb-2">{p.description}</div>
                  <div className="text-xs text-black/50">Year: {p.year ?? 'N/A'}</div>
                  {p.url && (
                    <a href={p.url} target="_blank" rel="noreferrer" className="text-xs text-blue-600 hover:underline">
                      Live link
                    </a>
                  )}
                </div>
                <button onClick={() => delProject(p.id)} className="text-red-600">Delete</button>
              </div>
            </div>
          ))}
        </div>

        <div className="border p-4">
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" className="w-full border px-3 py-2 mb-2" />
          <textarea value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Description" className="w-full border px-3 py-2 mb-2" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input value={year} onChange={(e) => setYear(e.target.value)} placeholder="Year" className="w-full border px-3 py-2" />
            <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="URL" className="w-full border px-3 py-2" />
          </div>
          <div className="flex gap-2">
            <button onClick={addProject} className="px-4 py-2 bg-black text-white">Add Project</button>
          </div>
        </div>
      </section>

      <section className="mb-10">
        <h3 className="font-bold mb-3">Stats</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {stats.map((stat, index) => (
            <div key={stat.id} className="border p-3">
              <div className="mb-3 font-semibold">{stat.label}</div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-black/50 mb-1">Value</label>
                  <input
                    type="number"
                    value={stat.target}
                    onChange={(e) => {
                      const next = [...stats];
                      next[index] = { ...next[index], target: Number(e.target.value) };
                      setStats(next);
                    }}
                    className="w-full border px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-xs text-black/50 mb-1">Suffix</label>
                  <input
                    value={stat.suffix}
                    onChange={(e) => {
                      const next = [...stats];
                      next[index] = { ...next[index], suffix: e.target.value };
                      setStats(next);
                    }}
                    className="w-full border px-3 py-2"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
        <button onClick={updateStats} className="px-4 py-2 bg-black text-white">Save stats</button>
      </section>

      <section>
        <h3 className="font-bold mb-3">Reviews</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {reviews.map((r) => (
            <div key={r.id} className="border p-3">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <div className="font-semibold">{r.author}</div>
                  <div className="text-sm text-gray-600 mb-2">{r.text}</div>
                  <div className="text-xs text-black/50">Rating: {r.rating}</div>
                </div>
                <button onClick={() => delReview(r.id)} className="text-red-600">Delete</button>
              </div>
            </div>
          ))}
        </div>

        <div className="border p-4">
          <AddReviewForm onAdd={(a, t, r) => addReview(a, t, r)} />
        </div>
      </section>
    </div>
  );
}

function AddReviewForm({ onAdd }: { onAdd: (author: string, text: string, rating: number) => void }) {
  const [author, setAuthor] = useState('');
  const [text, setText] = useState('');
  const [rating, setRating] = useState(5);
  return (
    <div>
      <input value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Author" className="w-full border px-3 py-2 mb-2" />
      <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Review text" className="w-full border px-3 py-2 mb-2" />
      <div className="grid grid-cols-2 gap-4 mb-4">
        <label className="flex flex-col text-sm text-black/50">
          Rating
          <select value={rating} onChange={(e) => setRating(Number(e.target.value))} className="mt-2 border px-3 py-2">
            {[5, 4, 3, 2, 1].map((value) => (
              <option key={value} value={value}>{value} stars</option>
            ))}
          </select>
        </label>
      </div>
      <div className="flex gap-2">
        <button onClick={() => { onAdd(author, text, rating); setAuthor(''); setText(''); setRating(5); }} className="px-4 py-2 bg-black text-white">Add Review</button>
      </div>
    </div>
  );
}

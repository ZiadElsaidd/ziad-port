"use client";

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function LoginClient() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params?.get('next') || '/';
  const [pw, setPw] = useState('');
  const [err, setErr] = useState('');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr('');
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: pw }),
    });
    if (res.ok) {
      router.push(next);
    } else {
      setErr('Incorrect password');
    }
  }

  return (
    <div className="max-w-xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <form onSubmit={submit} className="flex flex-col gap-3">
        <input type="password" value={pw} onChange={(e) => setPw(e.target.value)} placeholder="Password" className="border px-3 py-2" />
        <button className="px-4 py-2 bg-black text-white">Sign in</button>
        {err && <div className="text-red-600">{err}</div>}
      </form>
      <p className="text-sm text-gray-600 mt-4">This site is protected by a password. For production use, integrate a proper auth provider.</p>
    </div>
  );
}

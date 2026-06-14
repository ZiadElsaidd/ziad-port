import React, { Suspense } from 'react';
import LoginClient from '../../components/LoginClient';

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading…</div>}>
      {/* LoginClient is a client component and uses next/navigation hooks */}
      <LoginClient />
    </Suspense>
  );
}

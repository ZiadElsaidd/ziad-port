import { redirect } from 'next/navigation';

export default function Page() {
  // Always redirect root to login
  redirect('/login');
}

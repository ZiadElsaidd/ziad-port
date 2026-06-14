import { NextRequest } from 'next/server';

const PASSWORD = process.env.DASH_PASSWORD || 'secret';

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json();
    if (typeof password !== 'string') return new Response('Bad request', { status: 400 });
    if (password === PASSWORD) {
      const res = new Response('OK', { status: 200 });
      // set a cookie to mark session (simple prototype cookie)
      res.headers.append('Set-Cookie', `site-auth=1; Path=/; HttpOnly; SameSite=Lax; Max-Age=86400`);
      return res;
    }
    return new Response('Unauthorized', { status: 401 });
  } catch (err) {
    return new Response(String(err), { status: 500 });
  }
}

import { NextFetchEvent, NextRequest, NextResponse } from 'next/server';

export const parse = (req: NextRequest) => {
  let domain = req.headers.get('host');
  const path = req.nextUrl.pathname;
  const key = decodeURIComponent(path.split('/')[1]); // to handle foreign languages like Hebrew
  return { domain, path, key };
};

export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /_proxy & /_auth (special pages for OG tag proxying and password protection)
     * 4. /_static (inside /public)
     * 5. /_vercel (Vercel internals)
     * 6. all root files inside /public (e.g. /favicon.ico)
     */
    '/((?!api|_next|_proxy|_auth|_static|_vercel|[\\w-]+\\.\\w+).*)',
  ],
};

export default async function middleware(req: NextRequest, ev: NextFetchEvent) {
  const { domain, path, key } = parse(req);
  if (domain === 'app.localhost:3000') {
    return NextResponse.rewrite(new URL(`/app${path}`, req.url));
  }
  if (domain === 'api.localhost:3000') {
    return NextResponse.rewrite(new URL(`/api${path}`, req.url));
  }
}

import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const apiKeyValid = await validateApiKey(request);

  if (!apiKeyValid) {
    request.cookies.delete('apiKey');

    if (request.nextUrl.pathname !== '/loginFirst' && request.nextUrl.pathname !== '/doLogin') {
      return NextResponse.rewrite(new URL('/loginFirst', request.url));
    }
    return NextResponse.next();
  }

  // Already logged in, so no need to access those routes
  if (request.nextUrl.pathname === '/loginFirst' || request.nextUrl.pathname === '/doLogin') {
    return NextResponse.redirect(new URL('/', request.url));
  }
  return NextResponse.next();
}

async function validateApiKey(request: NextRequest): Promise<boolean> {
  const apiKey = request.cookies.get('apiKey')?.value;
  if (!apiKey) {
    return false;
  }

  try {
    const response = await fetch(process.env.INTERNAL_API_HOST + '/v1/login/verify', { headers: { apiKey } });
    return response.status === 200;
  } catch {
    return false;
  }
}

export const config = {
  matcher: '/((?!api|_next/static|_next/image|assets|favicon.ico).*)',
};

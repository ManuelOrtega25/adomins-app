import { NextResponse } from 'next/server';

const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001'
];

export function middleware(request) {
  const origin = request.headers.get('origin');

  // permite localhost, falta de origen (misma página) y cualquier dominio de Vercel
  const isAllowed = !origin || allowedOrigins.includes(origin) || (origin && origin.endsWith('.vercel.app'));

  if (isAllowed) {
    const response = NextResponse.next();
    
    response.headers.set('Access-Control-Allow-Origin', origin || '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    return response;
  }

  // bloquea cualquier otro origen
  return new NextResponse('CORS bloqueado papu: ' + origin, {
    status: 403,
    headers: { 'Content-Type': 'text/plain' }
  });
}

export const config = {
  matcher: '/api/:path*',
};
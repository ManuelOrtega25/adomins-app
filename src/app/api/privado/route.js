//get protegido solo admins
import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

export async function GET(request) {
  const header = request.headers.get('authorization');

  if (!header) {
    return NextResponse.json({ error: 'Falta Autorización' }, { status: 401 });
  }

  const [type, token] = header.split(' ');

  if (type !== 'Bearer' || !token) {
    return NextResponse.json({ error: 'Formato inválido' }, { status: 401 });
  }

  try {
    const user = verifyToken(token); 
    

    return NextResponse.json({ 
        ok: true, 
        user: user 
    });

  } catch (error) {
    return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
  }
}
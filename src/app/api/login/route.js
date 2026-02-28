import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import repo from '../../../repositories/users.repository.js';
import { sign } from '../../../lib/auth.js'; 

//post para login
export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    const user = await repo.findByEmail(email);

    if (!user) {
      return NextResponse.json({ error: 'Credenciales incorrectas' }, { status: 401 });
    }

    const ok = await bcrypt.compare(password, user.password_hash);

    if (!ok) {
      return NextResponse.json({ error: 'Credenciales incorrectas' }, { status: 401 });
    }

    const payload = {
      id: user.id,
      email: user.email,
      role: user.role
    };

    const token = sign(payload);

    return NextResponse.json({ 
      message: 'Login exitoso', 
      token: token,
      user: payload 
    }, { status: 200 });

  } catch (error) {
    console.error("Error en login:", error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
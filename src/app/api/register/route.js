import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import repo from '../../../repositories/users.repository.js';

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password, role } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'El email y el password son obligatorios' }, { status: 400 });
    }
    
    //nadie debe de saber, nadie
    const existingUser = await repo.findByEmail(email);
    if (existingUser) {
      return NextResponse.json({ error: 'Credenciales no válidas' }, { status: 400 });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    //todo usuario nuevo es un wey más
    const user = await repo.create({ 
      email: email, 
      passwordHash: hashedPassword, 
      role: role || 'user' //si le veo futuro posiblemente agregue el rol de mod
    });

    delete user.password_hash;

    return NextResponse.json({ 
      ok: true, 
      message: 'Usuario creado con éxito',
      user: user 
    }, { status: 201 });

  } catch (error) {
    console.error("Error al crear usuario:", error);
    return NextResponse.json({ error: 'Error interno del servidor pipipi' }, { status: 500 });
  }
}
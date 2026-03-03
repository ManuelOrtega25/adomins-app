import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import repo from '../../../repositories/users.repository.js';

// Inicializamos el Cadenero VIP de Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password, role } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'El email y el password son obligatorios' }, { status: 400 });
    }
    
    // 1. LE PASAMOS LA CHAMBA A SUPABASE AUTH
    // Esto crea al usuario en la bóveda de Supabase y dispara el correo de verificación
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: email,
      password: password,
    });
    // 👇 AGREGA ESTE CONSOLE.LOG TEMPORAL 👇
    console.log("Respuesta de Supabase Auth:", { authData, authError });

    if (authError) {
      // Supabase nos avisa si el correo ya existe o si la contra es muy débil
      return NextResponse.json({ error: authError.message }, { status: 400 });
    }

    // 2. REGISTRAMOS AL "WEY MÁS" EN TU TABLA PERSONALIZADA
    // Para no romper tus roles de Admin/User en la base de datos
    try {
      await repo.create({ 
        email: email, 
        // Ya no hasheamos nada, Supabase lo maneja. Ponemos un placeholder.
        passwordHash: 'managed-by-supabase', 
        role: role || 'user' // si le veo futuro posiblemente agregue el rol de mod 👀
      });
    } catch (dbError) {
      console.error("Falló la inserción en tu tabla repo, pero Supabase sí lo registró:", dbError);
    }

    // 3. RESPONDEMOS CON ÉXITO
    return NextResponse.json({ 
      ok: true, 
      message: '¡Revisa tu bandeja de entrada! Te hemos enviado un correo de confirmación.',
    }, { status: 201 });

  } catch (error) {
    console.error("Error al crear usuario:", error);
    return NextResponse.json({ error: 'Error interno del servidor pipipi' }, { status: 500 });
  }
}
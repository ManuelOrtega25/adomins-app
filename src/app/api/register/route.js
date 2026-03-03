import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Inicializamos el Cadenero VIP de Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password } = body; // Quitamos 'role' porque el trigger lo pondrá por defecto

    if (!email || !password) {
      return NextResponse.json({ error: 'El email y el password son obligatorios' }, { status: 400 });
    }
    
    // 1. LE PASAMOS LA CHAMBA A SUPABASE AUTH
    // Esto crea al usuario en la bóveda de Supabase y dispara el correo de verificación
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: email,
      password: password,
    });
    
    // Debugging (puedes quitarlo después)
    console.log("Respuesta de Supabase Auth:", { authData, authError });

    if (authError) {
      // Supabase nos avisa si el correo ya existe o si la contra es muy débil
      return NextResponse.json({ error: authError.message }, { status: 400 });
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
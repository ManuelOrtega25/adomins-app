import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import repo from '../../../repositories/users.repository.js';
import { sign } from '../../../lib/auth.js'; 

// Inicializamos el Cadenero VIP de Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// limite de peticiones de login
const rateLimitMap = new Map();
const MAX_INTENTOS = 5; 
const VENTANA_TIEMPO = 3 * 60 * 1000; 

export async function POST(request) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'ip-desconocida';

    // ... (Tu lógica de rate limit se queda exactamente igual) ...
    if (rateLimitMap.has(ip)) {
      const ipData = rateLimitMap.get(ip);
      const tiempoPasado = Date.now() - ipData.timer;

      if (tiempoPasado < VENTANA_TIEMPO) {
        if (ipData.count >= MAX_INTENTOS) {
          return NextResponse.json(
            { error: 'Demasiados intentos fallidos. Cálmate papu y espera 3 minutos.' }, 
            { status: 429 }
          );
        }
        ipData.count += 1;
        rateLimitMap.set(ip, ipData);
      } else {
        rateLimitMap.set(ip, { count: 1, timer: Date.now() });
      }
    } else {
      rateLimitMap.set(ip, { count: 1, timer: Date.now() });
    }

    const body = await request.json();
    const { email, password } = body;

    // 1. LE PREGUNTAMOS A SUPABASE SI LA CONTRASEÑA ES CORRECTA
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (authError) {
      return NextResponse.json({ error: 'Credenciales incorrectas' }, { status: 401 });
    }

    // 2. BUSCAMOS AL USUARIO EN TU TABLA LOCAL PARA SACAR SU ROL
    const user = await repo.findByEmail(email);

    if (!user) {
      // Por si se registró en Supabase pero falló la inserción en tu repo local
      return NextResponse.json({ error: 'Error de sincronización de usuario' }, { status: 500 });
    }

    // Si logra ingresar, borramos su historial de intentos fallidos
    rateLimitMap.delete(ip);

    // 3. GENERAMOS TU JWT PERSONALIZADO COMO LO TENÍAS
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
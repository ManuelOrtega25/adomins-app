import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  
  // Si no hay código, algo salió mal, lo mandamos al home
  if (!code) {
    return NextResponse.redirect(requestUrl.origin);
  }

  // 1. Inicializamos Supabase (Solo necesitamos las llaves públicas aquí)
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  // 2. Intercambiamos el código por una sesión válida
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (!error && data?.session) {
    // 3. SI TODO SALIÓ BIEN:
    // Redirigimos a la página de cambiar contraseña.
    // TRUCAZO: Pasamos los tokens en el Hash (#) para que el cliente los lea automático
    // y sienta que la sesión ya está iniciada.
    
    const { access_token, refresh_token } = data.session;
    
    const redirectUrl = new URL(`${requestUrl.origin}/update-password`);
    
    // Construimos el hash manualmente para simular el "Implicit Flow"
    // Esto hace que la librería de Supabase en el frontend lo capture solito.
    redirectUrl.hash = `access_token=${access_token}&refresh_token=${refresh_token}&type=recovery`;

    return NextResponse.redirect(redirectUrl);
  }

  // 4. Si falló el intercambio (código expirado o inválido)
  return NextResponse.redirect(`${requestUrl.origin}/login?error=Enlace invalido o expirado`);
}
'use client'; 
import { useState } from 'react';
import Link from 'next/link';

// Si usas la librería básica @supabase/supabase-js, descomenta esto y comenta el import de arriba:
import { createClient } from '@supabase/supabase-js';
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);


export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [msg, setMsg] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleReset = async (ev) => {
        ev.preventDefault();
        setLoading(true);
        setMsg('');
        setError('');

        try {
            // El truco para que funcione en Local y Prod
            const redirectUrl = `${window.location.origin}/api/auth/callback`;

            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: redirectUrl,
            });

            if (error) {
                setError(error.message);
            } else {
                setMsg('¡Listo! Revisa tu correo (y el spam) para el enlace de recuperación.');
                setEmail(''); // Limpiamos el campo para que no le den click mil veces
            }

        } catch (err) {
            console.error(err);
            setError('Error de conexión. Inténtalo más tarde.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="min-h-screen relative flex items-center justify-center lg:justify-end p-6 lg:pr-32 overflow-hidden">
            
            {/* wallpaper */}
            <div className="fixed inset-0 z-0 bg-[#0a0a0a]">
                <img 
                    src="/images/forgotpassword.jpg" 
                    alt="Ado Forgot Password Background" 
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40"></div>
            </div>

            {/* formulario */}
            <div className="w-full max-w-md bg-black/40 backdrop-blur-xl border border-white/10 p-8 md:p-10 rounded-3xl shadow-[0_0_40px_rgba(0,0,0,0.5)] relative z-10">
                
                <div className="text-center mb-8 drop-shadow-md">
                    <h1 className="text-3xl font-black text-white mb-2 tracking-tight drop-shadow-lg">
                        Recuperar Cuenta
                    </h1>
                    <p className="text-neutral-300 font-medium text-sm">
                        Ingresa tu correo y te enviaremos un enlace para cambiar tu contraseña.
                    </p>
                </div>

                {/* Mensajes de feedback */}
                {msg && (
                    <div className="mb-6 p-3 rounded-xl text-center text-sm font-bold border backdrop-blur-md shadow-lg bg-green-900/50 border-green-500/50 text-green-300">
                        {msg}
                    </div>
                )}
                {error && (
                    <div className="mb-6 p-3 rounded-xl text-center text-sm font-bold border backdrop-blur-md shadow-lg bg-red-900/50 border-red-500/50 text-red-300">
                        {error}
                    </div>
                )}

                <form onSubmit={handleReset} className="flex flex-col gap-5">
                    <div>
                        <label className="block text-xs font-bold text-neutral-300 mb-2 uppercase tracking-widest drop-shadow-md">Email</label>
                        <input 
                            type="email" 
                            className="w-full bg-black/40 backdrop-blur-md border border-white/20 text-white px-5 py-4 rounded-xl focus:outline-none focus:border-blue-400 transition-all placeholder:text-neutral-400 shadow-inner" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                            placeholder=""
                        />
                    </div>
                    
                    <button 
                        type="submit" 
                        disabled={loading} 
                        className={`w-full text-white font-bold py-4 rounded-xl transition-transform hover:-translate-y-1 shadow-lg mt-4 border border-white/10 ${loading ? 'bg-neutral-800/80 backdrop-blur-md cursor-not-allowed text-neutral-400' : 'bg-blue-600/80 hover:bg-blue-500/90 backdrop-blur-md'}`}
                    >
                        {loading ? 'Enviando...' : 'Enviar enlace'}
                    </button>
                </form>

                {/* links inferiores */}
                <div className="mt-8 text-center border-t border-white/10 pt-6 flex flex-col items-center gap-4">
                    <Link href="/login" className="inline-flex items-center px-6 py-3 rounded-xl bg-black/40 backdrop-blur-md border border-white/10 text-neutral-300 font-bold text-sm hover:bg-white/10 hover:text-white transition-all shadow-lg">
                        Volver al login
                    </Link>
                </div>

            </div>
        </main>
    )
}
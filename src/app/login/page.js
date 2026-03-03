'use client'; 
import { useState, useEffect } from 'react';
import Link from 'next/link';
import AlreadyLoggedIn from '@/components/AlreadyLoggedIn'; 

export default function LoginPage() {
    // ... (todo tu estado y useEffect se queda igual) ...
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [checkingAuth, setCheckingAuth] = useState(true);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [msg, setMsg] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsLoggedIn(true); 
        }
        setCheckingAuth(false); 
    }, []);

    const login = async (ev) => {
        // ... (tu lógica de login se queda igual) ...
        ev.preventDefault();
        setLoading(true);
        setMsg(''); 

        try {
            const res = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();
            if (!res.ok) {
                setMsg(data.error || 'Error al iniciar sesión');
                setLoading(false);
                return; 
            }
            localStorage.setItem('token', data.token);
            setMsg('Login exitoso');
            window.location.href = '/'; 

        } catch (error) {
            console.error(error);
            setMsg('Error de conexión');
        } finally {
            setLoading(false);
        }
    }

    if (checkingAuth) return <div className="min-h-screen bg-neutral-950"></div>;

    if (isLoggedIn) {
        return <AlreadyLoggedIn />;
    }

    return (
        <main className="min-h-screen relative flex items-center justify-center lg:justify-end p-6 lg:pr-32 overflow-hidden">
            
            {/* wallpaper */}
            <div className="fixed inset-0 z-0 bg-[#0a0a0a]">
                <img 
                    src="/images/login.jpg" 
                    alt="Ado Login Background" 
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/30"></div>
            </div>

            {/* formulario */}
            <div className="w-full max-w-md bg-black/40 backdrop-blur-xl border border-white/10 p-8 md:p-10 rounded-3xl shadow-[0_0_40px_rgba(0,0,0,0.5)] relative z-10">
                
                <div className="text-center mb-8 drop-shadow-md">
                    <h1 className="text-4xl font-black text-white mb-2 tracking-tight drop-shadow-lg">
                        Ingresar
                    </h1>
                    <p className="text-neutral-300 font-medium">Inicia sesión en tu cuenta</p>
                </div>

                {msg && (
                    <div className={`mb-6 p-3 rounded-xl text-center text-sm font-bold border backdrop-blur-md shadow-lg ${msg === 'Login exitoso' ? 'bg-green-900/50 border-green-500/50 text-green-300' : 'bg-red-900/50 border-red-500/50 text-red-300'}`}>
                        {msg}
                    </div>
                )}

                <form onSubmit={login} className="flex flex-col gap-5">
                    <div>
                        <label className="block text-xs font-bold text-neutral-300 mb-2 uppercase tracking-widest drop-shadow-md">Email</label>
                        <input 
                            type="email" 
                            className="w-full bg-black/40 backdrop-blur-md border border-white/20 text-white px-5 py-4 rounded-xl focus:outline-none focus:border-blue-400 transition-all placeholder:text-neutral-400 shadow-inner" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-neutral-300 mb-2 uppercase tracking-widest drop-shadow-md">Contraseña</label>
                        <input 
                            type="password" 
                            className="w-full bg-black/40 backdrop-blur-md border border-white/20 text-white px-5 py-4 rounded-xl focus:outline-none focus:border-blue-400 transition-all placeholder:text-neutral-400 shadow-inner" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                        />
                    </div>

                    {/* ✅ NUEVO: Link de recuperación aquí, alineado a la derecha */}
                    <div className="text-center justify-end">
                        <Link 
                            href="/forgot-password" 
                            className="text-sm text-blue-400 hover:text-blue-300 font-bold transition-colors drop-shadow-sm"
                        >
                            ¿Olvidaste tu contraseña?
                        </Link>
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading} 
                        className={`w-full text-white font-bold py-4 rounded-xl transition-transform hover:-translate-y-1 shadow-lg mt-2 border border-white/10 ${loading ? 'bg-neutral-800/80 backdrop-blur-md cursor-not-allowed text-neutral-400' : 'bg-blue-600/80 hover:bg-blue-500/90 backdrop-blur-md'}`}
                    >
                        {loading ? 'Verificando...' : 'Entrar'}
                    </button>
                </form>

                {/* links inferiores */}
                <div className="mt-8 text-center border-t border-white/10 pt-6 flex flex-col items-center">
                    <p className="text-neutral-300 text-sm mb-6 drop-shadow-md">
                        ¿No tienes una cuenta? <Link href="/signup" className="text-blue-400 hover:text-blue-300 font-bold transition-colors drop-shadow-sm">Regístrate</Link>
                    </p>
                    <Link 
                        href="/" 
                        className="inline-flex items-center px-6 py-3 rounded-xl bg-black/40 backdrop-blur-md border border-white/10 text-neutral-300 font-bold text-sm hover:bg-white/10 hover:text-white transition-all shadow-lg"
                    >
                        Volver a la página principal
                    </Link>
                </div>

            </div>
        </main>
    )
}
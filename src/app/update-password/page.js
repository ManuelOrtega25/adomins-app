'use client'; 
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Ojo: usamos 'next/navigation' en App Router
import { createClient } from '@supabase/supabase-js';

// Inicializamos el cliente aquí
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL, 
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function UpdatePasswordPage() {
    const router = useRouter();
    const [password, setPassword] = useState('');
    const [msg, setMsg] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Efecto para verificar que Supabase detectó la sesión del Hash
    useEffect(() => {
        // Supabase busca automáticamente los tokens en el hash de la URL (#access_token=...)
        // y restaura la sesión. Solo verificamos si hay sesión activa.
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                // Si no hay sesión (el link expiró o entraron directo), los sacamos
                setError('Enlace inválido o sesión expirada.');
            }
        };
        checkSession();
    }, []);

    const handleUpdate = async (ev) => {
        ev.preventDefault();
        setLoading(true);
        setError('');
        setMsg('');

        try {
            // Aquí ocurre la magia: Supabase actualiza la contraseña del usuario actual
            const { data, error } = await supabase.auth.updateUser({
                password: password
            });

            if (error) {
                throw error;
            }

            setMsg('¡Contraseña actualizada con éxito!');
            
            // Esperamos unos segundos y mandamos al login
            setTimeout(() => {
                router.push('/login?msg=Contraseña actualizada, inicia sesión');
            }, 2000);

        } catch (err) {
            console.error(err);
            setError(err.message || 'Error al actualizar la contraseña');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen relative flex items-center justify-center lg:justify-end p-6 lg:pr-32 overflow-hidden">
            
            {/* wallpaper */}
            <div className="fixed inset-0 z-0 bg-[#0a0a0a]">
                <img 
                    src="/images/forgotpassword.jpg" 
                    alt="Ado Update Password Background" 
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40"></div>
            </div>

            {/* formulario */}
            <div className="w-full max-w-md bg-black/40 backdrop-blur-xl border border-white/10 p-8 md:p-10 rounded-3xl shadow-[0_0_40px_rgba(0,0,0,0.5)] relative z-10">
                
                <div className="text-center mb-8 drop-shadow-md">
                    <h1 className="text-3xl font-black text-white mb-2 tracking-tight drop-shadow-lg">
                        Nueva Contraseña
                    </h1>
                    <p className="text-neutral-300 font-medium text-sm">
                        Ingresa tu nueva contraseña para recuperar el acceso a tu cuenta.
                    </p>
                </div>

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

                <form onSubmit={handleUpdate} className="flex flex-col gap-5">
                    <div>
                        <label className="block text-xs font-bold text-neutral-300 mb-2 uppercase tracking-widest drop-shadow-md">Nueva Contraseña</label>
                        <input 
                            type="password" 
                            className="w-full bg-black/40 backdrop-blur-md border border-white/20 text-white px-5 py-4 rounded-xl focus:outline-none focus:border-blue-400 transition-all placeholder:text-neutral-400 shadow-inner" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                            minLength={6}
                            placeholder="Mínimo 6 caracteres"
                        />
                    </div>
                    
                    <button 
                        type="submit" 
                        disabled={loading || !!error} 
                        className={`w-full text-white font-bold py-4 rounded-xl transition-transform hover:-translate-y-1 shadow-lg mt-4 border border-white/10 ${loading ? 'bg-neutral-800/80 backdrop-blur-md cursor-not-allowed text-neutral-400' : 'bg-purple-600/80 hover:bg-purple-500/90 backdrop-blur-md'}`}
                    >
                        {loading ? 'Actualizando...' : 'Cambiar Contraseña'}
                    </button>
                </form>

            </div>
        </main>
    )
}
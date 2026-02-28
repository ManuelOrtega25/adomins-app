'use client'; 
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function PrivadoPage() {
    const [user, setUser] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    //este useEffect se ejecuta apenas entras a la página y verifica si el usuario tiene un token válido
    useEffect(() => {
        const verificarGafete = async () => {
            const token = localStorage.getItem('token');

            if (!token) {
                setError('No tienes la llave, papu. Pasa al Login primero.');
                setLoading(false);
                return;
            }

            try {
                const res = await fetch('/api/privado', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                const data = await res.json();

                if (!res.ok) {
                    setError(data.error || 'Token inválido o caducado');
                } else {
                    setUser(data.user); 
                }
            } catch (err) {
                console.error(err);
                setError('Error de conexión con el servidor');
            } finally {
                setLoading(false);
            }
        };

        verificarGafete();
    }, []);

    return (
        <main className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-4 text-white">
            <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl p-8 text-center">
                
                <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
                    Zona Privada - Acceso Autorizado
                </h1>

                {loading && <p className="text-neutral-400 animate-pulse">Revisando tu token...</p>}

                {error && (
                    <div className="flex flex-col gap-4 items-center">
                        <p className="p-4 bg-red-500/10 border border-red-500/50 text-red-400 rounded-lg w-full font-medium">
                            {error}
                        </p>
                        <Link href="/login" className="text-blue-400 hover:text-blue-300 underline">
                            Ir a Iniciar Sesión
                        </Link>
                    </div>
                )}

                {user && (
                    <div className="bg-neutral-800 p-6 rounded-lg text-left border border-neutral-700 w-full">
                        <p className="text-sm text-neutral-400 mb-2 uppercase font-bold tracking-wider">Acceso Concedido</p>
                        <p className="text-lg">¡Bienvenido, <span className="text-blue-400 font-bold">{user.email}</span>!</p>
                        <p className="text-neutral-300 mt-2">Tu rol en el sistema es: <span className="bg-blue-900/50 text-blue-300 px-2 py-1 rounded text-sm uppercase">{user.role}</span></p>
                    </div>
                )}

            </div>
        </main>
    );
}
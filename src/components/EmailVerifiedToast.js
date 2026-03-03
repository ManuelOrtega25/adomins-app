'use client'; // Esto es vital para que funcione en el navegador

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function EmailVerifiedToast() {
    const [showToast, setShowToast] = useState(false);
    const router = useRouter();

    useEffect(() => {
        // Detectamos si la URL tiene el hash de Supabase
        if (typeof window !== 'undefined' && window.location.hash.includes('access_token')) {
            // Limpiamos la URL fea para que se vea bonita
            // Usamos replaceState para no recargar la página
            window.history.replaceState(null, '', '/');
            
            // Mostramos el mensajito de éxito
            setShowToast(true);

            // Ocultamos el mensaje después de 5 segundos
            setTimeout(() => {
                setShowToast(false);
            }, 5000);
        }
    }, []);

    if (!showToast) return null;

    return (
        <div className="fixed top-24 right-5 z-50 animate-bounce-in">
            <div className="bg-green-900/90 backdrop-blur-md border border-green-500/50 text-green-100 px-6 py-4 rounded-2xl shadow-[0_0_30px_rgba(34,197,94,0.3)] flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-green-400">
                    <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                </svg>
                <div>
                    <h4 className="font-bold text-sm">Correo Verificado!</h4>
                    <p className="text-xs text-green-200">Ya puedes iniciar sesión!!!</p>
                </div>
                <button onClick={() => setShowToast(false)} className="ml-2 text-green-300 hover:text-white">✕</button>
            </div>
        </div>
    );
}
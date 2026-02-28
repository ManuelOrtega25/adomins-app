'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Unauthorized from '@/components/Unauthorized'; 

export default function NuevoCancionPage() {
    const [authStatus, setAuthStatus] = useState('loading'); 
    // estado de autenticación
    useEffect(() => {
        const token = localStorage.getItem('token');
        
        // no está logueado
        if (!token) {
            setAuthStatus('unauthorized');
            return;
        }

        try {
            // condicion 1: tiene token
            const payload = JSON.parse(atob(token.split('.')[1]));

            // condicion 2: es token de admin?
            if (payload.role === 'admin') {
                setAuthStatus('authorized'); 
            } else {
                setAuthStatus('unauthorized'); //mandarlo a la verga
            }
        } catch (error) {
            console.error("Error al leer el token:", error);
            setAuthStatus('unauthorized'); // igual mandarlo a la verga
        }
    }, []);

    // estados de los inputs
    const [nombre, setNombre] = useState('');
    const [youtube_id, setYoutube_id] = useState('');
    const [tipo_cancion, setTipo_cancion] = useState('');
    const [album, setAlbum] = useState('');
    const [duracion_segundos, setDuracion_segundos] = useState('0');
    const [visitas, setVisitas] = useState('0');
    const [imagen_url, setImagen_url] = useState('');
    const [fecha_lanzamiento, setFecha_lanzamiento] = useState('');
    const [msg, setMsg] = useState('');
    const [loading, setLoading] = useState(false); 

    // pantalla de carga
    if (authStatus === 'loading') {
        return (
            <main className="min-h-screen relative flex items-center justify-center p-4 text-white">
                <div className="fixed inset-0 z-0 bg-[#0a0a0a]">
                    <img src="/images/edit.jpg" alt="Loading Background" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/60"></div>
                </div>
                <p className="text-xl font-bold text-neutral-300 animate-pulse relative z-10 drop-shadow-md">
                    Verificando credenciales de admin... 
                </p>
            </main>
        );
    }

    if (authStatus === 'unauthorized') {
        return <Unauthorized />; //ado emperrada
    }

    const crear = async (ev) => {
        ev.preventDefault();
        setLoading(true);
        setMsg(''); 

        if (!nombre || !youtube_id || !tipo_cancion || !duracion_segundos || !visitas || !fecha_lanzamiento) {
            setMsg('Faltan datos papu. Llénalos bien.');
            setLoading(false);
            return;
        }

        try {
            const token = localStorage.getItem('token'); 

            const res = await fetch('/api/canciones', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify({
                    nombre, 
                    youtube_id,
                    tipo_cancion,
                    album,
                    duracion_segundos: Number(duracion_segundos),
                    visitas: Number(visitas),
                    imagen_url,
                    fecha_lanzamiento
                })
            });

            const data = await res.json().catch(() => ({}));

            if (!res.ok) {
                setMsg(data.error || 'Error al agregar la canción');
                setLoading(false);
                return; 
            }

            setMsg('Canción agregada correctamente');
            setNombre('');
            setYoutube_id('');
            setTipo_cancion('');
            setAlbum('');
            setDuracion_segundos('0');
            setVisitas('0');
            setImagen_url(''); 
            setFecha_lanzamiento('');

        } catch (error) {
            console.log(error)
            setMsg('Error de conexión con el servidor');
        } finally {
            setLoading(false);
        }
    }

    return ( 
       <main className="min-h-screen relative flex items-center justify-center p-4 lg:py-10 overflow-hidden">
          
          {/* wallpaper */}
          <div className="fixed inset-0 z-0 bg-[#0a0a0a]">
              <img 
                  src="/images/edit.jpg" 
                  alt="Ado Create Background" 
                  className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-black/60"></div>
          </div>

          {/* form */}
          <div className="w-full max-w-md bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] p-8 md:p-10 relative z-10">
            
            <div className="mb-8 text-center drop-shadow-md">
                <h1 className="text-3xl font-black text-white drop-shadow-lg">
                    Nueva canción
                </h1>
                <p className="text-neutral-300 text-sm mt-2 font-medium">Agrega una nueva canción de Ado a la página :D</p>
            </div>

            <form onSubmit={crear} className="flex flex-col gap-5">
                
                <div>
                    <label className="block text-xs font-bold text-neutral-300 mb-2 uppercase tracking-widest drop-shadow-md">Nombre de la canción</label>
                    <input type="text" placeholder='Nombre de la canción de Ado' className="w-full bg-black/40 backdrop-blur-md border border-white/20 text-white rounded-xl px-5 py-3 focus:outline-none focus:border-blue-400 transition-all placeholder-neutral-500 shadow-inner" value={nombre} onChange={(e) => setNombre(e.target.value)} />
                </div>

                <div>
                    <label className="block text-xs font-bold text-neutral-300 mb-2 uppercase tracking-widest drop-shadow-md">Youtube ID</label>
                    <input type="text" placeholder='youtube.com/watch?v=ID_DEL_VIDEO' className="w-full bg-black/40 backdrop-blur-md border border-white/20 text-white rounded-xl px-5 py-3 focus:outline-none focus:border-blue-400 transition-all placeholder-neutral-500 shadow-inner" value={youtube_id} onChange={(e) => setYoutube_id(e.target.value)} />
                </div>

                <div>
                    <label className="block text-xs font-bold text-neutral-300 mb-2 uppercase tracking-widest drop-shadow-md">Tipo de canción</label>
                    <input type="text" placeholder="Original, cover o collab" className="w-full bg-black/40 backdrop-blur-md border border-white/20 text-white rounded-xl px-5 py-3 focus:outline-none focus:border-blue-400 transition-all placeholder-neutral-500 shadow-inner" value={tipo_cancion} onChange={(e) => setTipo_cancion(e.target.value)} />
                </div>
                
                <div>
                    <label className="block text-xs font-bold text-neutral-300 mb-2 uppercase tracking-widest drop-shadow-md">Albúm</label>
                    <input type="text" placeholder="Opcional" className="w-full bg-black/40 backdrop-blur-md border border-white/20 text-white rounded-xl px-5 py-3 focus:outline-none focus:border-blue-400 transition-all placeholder-neutral-500 shadow-inner" value={album} onChange={(e) => setAlbum(e.target.value)} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-neutral-300 mb-2 uppercase tracking-widest drop-shadow-md">Duración (seg)</label>
                        <input type="number" placeholder="Ej: 210" className="w-full bg-black/40 backdrop-blur-md border border-white/20 text-white rounded-xl px-5 py-3 focus:outline-none focus:border-blue-400 transition-all placeholder-neutral-500 shadow-inner" value={duracion_segundos} onChange={(e) => setDuracion_segundos(e.target.value)} />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-neutral-300 mb-2 uppercase tracking-widest drop-shadow-md">Visitas YT</label>
                        <input type="number" placeholder="Ej: 1500000" className="w-full bg-black/40 backdrop-blur-md border border-white/20 text-white rounded-xl px-5 py-3 focus:outline-none focus:border-blue-400 transition-all placeholder-neutral-500 shadow-inner" value={visitas} onChange={(e) => setVisitas(e.target.value)} />
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-bold text-neutral-300 mb-2 uppercase tracking-widest drop-shadow-md">URL de Imagen</label>
                    <input type="text" placeholder="https://..." className="w-full bg-black/40 backdrop-blur-md border border-white/20 text-white rounded-xl px-5 py-3 focus:outline-none focus:border-blue-400 transition-all placeholder-neutral-500 shadow-inner" value={imagen_url} onChange={(e) => setImagen_url(e.target.value)} />
                </div>

                <div>
                    <label className="block text-xs font-bold text-neutral-300 mb-2 uppercase tracking-widest drop-shadow-md">Fecha de lanzamiento</label>
                    <input type="date" className="w-full bg-black/40 backdrop-blur-md border border-white/20 text-white rounded-xl px-5 py-3 focus:outline-none focus:border-blue-400 transition-all placeholder-neutral-500 shadow-inner [color-scheme:dark]" value={fecha_lanzamiento} onChange={(e) => setFecha_lanzamiento(e.target.value)} />
                </div>

                <button 
                    type="submit" 
                    disabled={loading}
                    className={`mt-4 w-full font-bold py-4 rounded-xl transition-all shadow-lg border border-white/10 ${loading ? 'bg-neutral-800/80 backdrop-blur-md cursor-not-allowed text-neutral-400' : 'bg-blue-600/80 hover:bg-blue-500/90 backdrop-blur-md text-white'}`}
                >
                    {loading ? 'Guardando...' : 'Guardar Canción'}
                </button>

            </form>

            {msg && (
                <div className={`mt-6 p-3 rounded-xl text-center text-sm font-bold border backdrop-blur-md shadow-lg ${msg.includes('correctamente') ? 'bg-green-900/50 border-green-500/50 text-green-300' : 'bg-red-900/50 border-red-500/50 text-red-300'}`}>
                    {msg}
                </div>
            )}

            <div className="mt-8 text-center border-t border-white/10 pt-6">
                <Link href="/admin" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-black/40 backdrop-blur-md border border-white/10 text-neutral-300 font-bold text-sm hover:bg-white/10 hover:text-white transition-all shadow-lg">
                    Volver al Dashboard
                </Link>
            </div>

          </div>
       </main>
    )
}
'use client';
import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Unauthorized from '@/components/Unauthorized';

export default function EditarCancionPage({ params }) {
    const router = useRouter();
    const unwrappedParams = use(params);
    const id = unwrappedParams.id;
    
    const [authStatus, setAuthStatus] = useState('loading');
    const [loadingData, setLoadingData] = useState(true);
    const [loadingSubmit, setLoadingSubmit] = useState(false);
    const [msg, setMsg] = useState('');

    //form
    const [nombre, setNombre] = useState('');
    const [youtube_id, setYoutube_id] = useState('');
    const [tipo_cancion, setTipo_cancion] = useState('');
    const [album, setAlbum] = useState('');
    const [duracion_segundos, setDuracion_segundos] = useState('0');
    const [visitas, setVisitas] = useState('0');
    const [imagen_url, setImagen_url] = useState('');
    const [fecha_lanzamiento, setFecha_lanzamiento] = useState('');

    //verificar si es admin, cargar los datos y ver si está caducado el token
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            setAuthStatus('unauthorized');
            return;
        }

        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            
            //asegurar al frontend cuando se acaba el token
            //calcular el tiempo actual en segundos
            const tiempoActual = Date.now() / 1000; 
            
            //si el token caduca
            if (payload.exp && payload.exp < tiempoActual) {
                console.warn("El token ya caducó. Expulsando al usuario...");
                localStorage.removeItem('token'); 
                setAuthStatus('unauthorized'); 
                return;
            }

            //si si llega aquí el token está activoy es admin
            if (payload.role === 'admin') {
                setAuthStatus('authorized');
                cargarDatosDeCancion();
            } else {
                setAuthStatus('unauthorized');
            }
        } catch (error) {
            setAuthStatus('unauthorized');
        }
    }, [id]);

    const cargarDatosDeCancion = async () => {
        try {
            const res = await fetch(`/api/canciones/${id}`);
            if (res.ok) {
                const data = await res.json();
                setNombre(data.nombre);
                setYoutube_id(data.youtube_id);
                setTipo_cancion(data.tipo_cancion);
                setAlbum(data.album || '');
                setDuracion_segundos(data.duracion_segundos.toString());
                setVisitas(data.visitas.toString());
                setImagen_url(data.imagen_url || '');
                setFecha_lanzamiento(data.fecha_lanzamiento ? data.fecha_lanzamiento.split('T')[0] : '');
            } else {
                setMsg('No se encontró la canción.');
            }
        } catch (error) {
            setMsg('Error de conexión.');
        } finally {
            setLoadingData(false);
        }
    };

    const actualizar = async (ev) => {
        ev.preventDefault();
        setLoadingSubmit(true);
        setMsg(''); 

        try {
            const token = localStorage.getItem('token'); 
            const res = await fetch(`/api/canciones/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify({
                    nombre, youtube_id, tipo_cancion, album,
                    duracion_segundos: Number(duracion_segundos),
                    visitas: Number(visitas), imagen_url, fecha_lanzamiento
                })
            });

            const data = await res.json().catch(() => ({}));

            if (!res.ok) {
                //si hay error se queda en el formulario
                setMsg(data.error || 'Error al actualizar');
                setLoadingSubmit(false);
                return; 
            }

            // si todo salió bien
            setMsg('Canción actualizada correctamente!');
            
            //despues de 1.5 segundos de vuelta al /admin
            setTimeout(() => {
                router.push('/admin');
            }, 1500);

        } catch (error) {
            setMsg('Error de conexión con el servidor');
            setLoadingSubmit(false); 
        } 
    }

    //tablear a los no autorizados
    if (authStatus === 'unauthorized') return <Unauthorized />;

    //si es admin pasale carnal
    if (authStatus === 'loading' || loadingData) {
        return (
            <main className="min-h-screen relative flex items-center justify-center p-4">
                <div className="fixed inset-0 z-0 bg-[#0a0a0a]">
                    <img src="/images/edit.jpg" alt="Loading Background" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/60"></div>
                </div>
                <p className="text-xl font-bold text-neutral-300 animate-pulse relative z-10 drop-shadow-md">Preparando el page de editar...</p>
            </main>
        );
    }

    //cargar el formulario
    return ( 
       <main className="min-h-screen relative flex items-center justify-center p-4 lg:py-10 overflow-hidden">
          
          {/* wallpaper */}
          <div className="fixed inset-0 z-0 bg-[#0a0a0a]">
              <img 
                  src="/images/edit.jpg" 
                  alt="Ado Edit Background" 
                  className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-black/60"></div>
          </div>

          {/* formulario */}
          <div className="w-full max-w-md bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] p-8 md:p-10 relative z-10">
            <div className="mb-8 text-center drop-shadow-md">
                <h1 className="text-3xl font-black text-white drop-shadow-lg">
                    Editar Canción
                </h1>
                <p className="text-neutral-300 text-sm mt-2 font-medium">Modificando: <span className="font-bold text-white">{nombre}</span></p>
            </div>

            <form onSubmit={actualizar} className="flex flex-col gap-5">
                
                <div>
                    <label className="block text-xs font-bold text-neutral-300 mb-2 uppercase tracking-widest drop-shadow-md">Nombre de la canción</label>
                    <input type="text" className="w-full bg-black/40 backdrop-blur-md border border-white/20 text-white rounded-xl px-5 py-3 focus:outline-none focus:border-blue-400 transition-all shadow-inner" value={nombre} onChange={(e) => setNombre(e.target.value)} />
                </div>

                <div>
                    <label className="block text-xs font-bold text-neutral-300 mb-2 uppercase tracking-widest drop-shadow-md">Youtube ID</label>
                    <input type="text" className="w-full bg-black/40 backdrop-blur-md border border-white/20 text-white rounded-xl px-5 py-3 focus:outline-none focus:border-blue-400 transition-all shadow-inner" value={youtube_id} onChange={(e) => setYoutube_id(e.target.value)} />
                </div>

                <div>
                    <label className="block text-xs font-bold text-neutral-300 mb-2 uppercase tracking-widest drop-shadow-md">Tipo de canción</label>
                    <input type="text" className="w-full bg-black/40 backdrop-blur-md border border-white/20 text-white rounded-xl px-5 py-3 focus:outline-none focus:border-blue-400 transition-all shadow-inner" value={tipo_cancion} onChange={(e) => setTipo_cancion(e.target.value)} />
                </div>
                
                <div>
                    <label className="block text-xs font-bold text-neutral-300 mb-2 uppercase tracking-widest drop-shadow-md">Albúm</label>
                    <input type="text" className="w-full bg-black/40 backdrop-blur-md border border-white/20 text-white rounded-xl px-5 py-3 focus:outline-none focus:border-blue-400 transition-all shadow-inner" value={album} onChange={(e) => setAlbum(e.target.value)} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-neutral-300 mb-2 uppercase tracking-widest drop-shadow-md">Duración (seg)</label>
                        <input type="number" className="w-full bg-black/40 backdrop-blur-md border border-white/20 text-white rounded-xl px-5 py-3 focus:outline-none focus:border-blue-400 transition-all shadow-inner" value={duracion_segundos} onChange={(e) => setDuracion_segundos(e.target.value)} />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-neutral-300 mb-2 uppercase tracking-widest drop-shadow-md">Visitas YT</label>
                        <input type="number" className="w-full bg-black/40 backdrop-blur-md border border-white/20 text-white rounded-xl px-5 py-3 focus:outline-none focus:border-blue-400 transition-all shadow-inner" value={visitas} onChange={(e) => setVisitas(e.target.value)} />
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-bold text-neutral-300 mb-2 uppercase tracking-widest drop-shadow-md">URL de Imagen</label>
                    <input type="text" className="w-full bg-black/40 backdrop-blur-md border border-white/20 text-white rounded-xl px-5 py-3 focus:outline-none focus:border-blue-400 transition-all shadow-inner" value={imagen_url} onChange={(e) => setImagen_url(e.target.value)} />
                </div>

                <div>
                    <label className="block text-xs font-bold text-neutral-300 mb-2 uppercase tracking-widest drop-shadow-md">Fecha de lanzamiento</label>
                    <input type="date" className="w-full bg-black/40 backdrop-blur-md border border-white/20 text-white rounded-xl px-5 py-3 focus:outline-none focus:border-blue-400 transition-all shadow-inner [color-scheme:dark]" value={fecha_lanzamiento} onChange={(e) => setFecha_lanzamiento(e.target.value)} />
                </div>

                <button 
                    type="submit" 
                    disabled={loadingSubmit}
                    className={`mt-4 w-full font-bold py-4 rounded-xl transition-all shadow-lg border border-white/10 ${loadingSubmit ? 'bg-neutral-800/80 backdrop-blur-md cursor-not-allowed text-neutral-400' : 'bg-green-600/80 hover:bg-green-500/90 backdrop-blur-md text-white'}`}
                >
                    {loadingSubmit ? 'Guardando...' : 'Guardar Cambios'}
                </button>
            </form>

            {msg && (
                <div className={`mt-6 p-3 rounded-xl text-center text-sm font-bold border backdrop-blur-md shadow-lg ${msg.includes('✅') || msg.includes('correctamente') ? 'bg-green-900/50 border-green-500/50 text-green-300' : 'bg-red-900/50 border-red-500/50 text-red-300'}`}>
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
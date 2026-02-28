'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Unauthorized from '@/components/Unauthorized';
import { useCanciones } from '@/hooks/useCanciones'; 

// esta función la usé más abajo para cambiar los seg en min
const formatDuration = (seconds) => {
    if (!seconds) return '--:--';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export default function AdminDashboard() {
    const router = useRouter();
    const [authStatus, setAuthStatus] = useState('loading');
    
    // guardar qué canción quiere borrar solo el admin
    const [cancionABorrar, setCancionABorrar] = useState(null); 

    // extraer datos del hook
    const { 
        canciones, 
        loading, 
        eliminarCancion, 
        busqueda, 
        setBusqueda, 
        filtroTipo, 
        setFiltroTipo,
        paginaActual, 
        setPaginaActual, 
        totalPaginas 
    } = useCanciones();

    // verificar si es admin cargar los datos y ver si está caducado el token
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            setAuthStatus('unauthorized');
            return;
        }

        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            
            // asegurar al frontedn cuando se acaba el token
            const tiempoActual = Date.now() / 1000; 
            
            // si el token caduca
            if (payload.exp && payload.exp < tiempoActual) {
                console.warn("El token ya caducó. Expulsando al usuario...");
                localStorage.removeItem('token'); 
                setAuthStatus('unauthorized'); 
                return;
            }

            // si si llega aquí el token está activo y es admin
            if (payload.role === 'admin') {
                setAuthStatus('authorized');
            } else {
                setAuthStatus('unauthorized');
            }
        } catch (error) {
            setAuthStatus('unauthorized');
        }
    }, []); 

    const handleEditar = (e, id) => {
        e.stopPropagation(); 
        router.push(`/admin/${id}/editar`);
    };

    const prepararEliminacion = (e, id, nombre) => {
        e.stopPropagation(); 
        setCancionABorrar({ id, nombre }); 
    };

    const confirmarEliminacion = async () => {
        if (!cancionABorrar) return;
        
        const exito = await eliminarCancion(cancionABorrar.id);
        if (exito) {
            console.log(`La canción "${cancionABorrar.nombre}" fue eliminada.`);
        } else {
            alert(`Error al borrar "${cancionABorrar.nombre}". Revisa la consola en fa.`);
        }
        
        setCancionABorrar(null);
    };

    if (authStatus === 'loading') {
        return (
            <main className="min-h-screen bg-neutral-950 flex items-center justify-center text-white">
                <p className="text-xl font-bold text-neutral-500 animate-pulse">Cargando la lista de canciones...</p>
            </main>
        );
    }

    if (authStatus === 'unauthorized') {
        return <Unauthorized />;
    }

    return (
        <main className="min-h-screen relative text-white pb-20 pt-10">
            
            {/* wallpaper de admin */}
            <div className="fixed inset-0 z-0 bg-[#0a0a0a]">
                <img 
                    src="/images/admin.jpg" 
                    alt="Ado Admin Background" 
                    className="w-full h-full object-cover object-top"
                />
                <div className="absolute inset-0 bg-black/60"></div>
            </div>

            {/* aviso de eliminacion */}
            {cancionABorrar && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
                    <div className="bg-neutral-900 border border-red-900/50 rounded-2xl p-8 max-w-md w-full shadow-[0_0_50px_rgba(239,68,68,0.15)] text-center transform transition-all">
                        <h3 className="text-2xl font-bold text-white mb-2">Are u sure??</h3>
                        <p className="text-neutral-400 mb-8">
                            Estás a punto de borrar <span className="text-red-400 font-bold drop-shadow-[0_0_5px_rgba(248,113,113,0.5)]">"{cancionABorrar.nombre}"</span> de la base de datos. Esta acción no se puede deshacer!!
                        </p>
                        
                        <div className="flex gap-4 justify-center">
                            <button 
                                onClick={() => setCancionABorrar(null)} 
                                className="px-6 py-3 rounded-xl bg-neutral-800 text-neutral-300 font-bold hover:bg-neutral-700 hover:text-white transition-all w-1/2"
                            >
                                Cancelar
                            </button>
                            <button 
                                onClick={confirmarEliminacion} 
                                className="px-6 py-3 rounded-xl bg-red-600 text-white font-bold hover:bg-red-500 shadow-lg shadow-red-500/20 transition-all w-1/2"
                            >
                                Sí, eliminar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* contenido flotante */}
            <div className="relative z-10 max-w-[100rem] mx-auto px-6 lg:px-12 flex flex-col lg:flex-row gap-8 items-start">
                
                {/* barra lateral estatica */}
                <aside className="w-full lg:w-1/4 flex flex-col gap-6 sticky top-24">
                    
                    <div className="bg-black/40 backdrop-blur-xl border border-white/10 p-6 rounded-3xl shadow-[0_0_30px_rgba(0,0,0,0.5)]">
                        <h2 className="text-xl font-bold mb-6 text-white-400 drop-shadow-md">Controles de administración</h2>
                        
                        {/* barra de búsqueda */}
                        <div className="flex flex-col gap-2 mb-6">
                            <label className="text-xs font-bold text-white drop-shadow-md uppercase tracking-widest">Buscar Canción</label>
                            <input 
                                type="text"
                                placeholder="Nombre de la canción"
                                value={busqueda}
                                onChange={(e) => setBusqueda(e.target.value)}
                                className="w-full bg-black/50 backdrop-blur-md border border-white/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-400 transition-all text-white placeholder:text-neutral-400 shadow-inner"
                            />
                        </div>

                        {/* filtro por tipo */}
                        <div className="flex flex-col gap-2 mb-8">
                            <label className="text-xs font-bold text-white drop-shadow-md uppercase tracking-widest">Filtrar por Tipo</label>
                            <select 
                                value={filtroTipo}
                                onChange={(e) => setFiltroTipo(e.target.value)}
                                className="w-full bg-black/50 backdrop-blur-md border border-white/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-400 transition-all cursor-pointer text-white shadow-inner"
                            >
                                <option value="todos" className="bg-neutral-900">Todas los tracks</option>
                                <option value="original" className="bg-neutral-900">Originales</option>
                                <option value="cover" className="bg-neutral-900">Covers</option>
                                <option value="collab" className="bg-neutral-900">Colaboraciones</option>
                            </select>
                        </div>

                        <button 
                            onClick={() => router.push('/canciones/nuevo')}
                            className="w-full py-4 bg-black-600/90 backdrop-blur-md hover:bg-green-500 text-white border border-black-400/30 rounded-xl font-bold transition-all shadow-lg shadow-black-500/20 active:scale-95"
                        >
                            Agregar Nueva Canción
                        </button>
                    </div>

                    {/* contador de resultados */}
                    <div className="px-6 py-4 bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl shadow-lg">
                        <p className="text-white text-sm drop-shadow-md">
                            Mostrando: <span className="text-white font-bold">{canciones.length}</span> canciones
                        </p>
                    </div>
                </aside>

                <section className="w-full lg:w-3/4">
                    <h2 className="text-3xl font-black mb-8 text-white drop-shadow-lg flex items-center gap-3">
                        Lista de canciones de la gritona
                    </h2>
                    
                    {loading ? (
                        <p className="text-neutral-300 font-bold bg-black/50 backdrop-blur-md p-6 rounded-2xl border border-white/10 animate-pulse">Cargando la base de datos de la Patrona...</p>
                    ) : canciones.length === 0 ? (
                        <p className="text-neutral-300 bg-black/50 backdrop-blur-md p-6 rounded-2xl border border-white/10">No se encontraron canciones con esos filtros.</p>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {canciones.map((cancion) => {
                                    const tagColor = cancion.tipo_cancion === 'original' 
                                        ? 'bg-blue-900/60 text-blue-200 border-blue-800/50' 
                                        : cancion.tipo_cancion === 'cover' 
                                        ? 'bg-purple-900/60 text-purple-200 border-purple-800/50' 
                                        : 'bg-teal-900/60 text-teal-200 border-teal-800/50';

                                    const fechaSegura = cancion.fecha_lanzamiento 
                                        ? new Date(cancion.fecha_lanzamiento).toISOString().split('T')[0] 
                                        : 'Desconocida';

                                    return (
                                        <div 
                                            key={cancion.id} 
                                            onClick={() => router.push(`/canciones/${cancion.id}`)}
                                            className="group bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(59,130,246,0.2)] hover:border-blue-500/50 flex flex-col cursor-pointer relative"
                                        >
                                            <div className="w-full h-48 bg-black/60 relative border-b border-white/10 overflow-hidden">
                                                {cancion.imagen_url ? (
                                                    <img src={cancion.imagen_url} alt={cancion.nombre} className="w-full h-full object-cover opacity-90 transition-all duration-500 group-hover:scale-105 group-hover:opacity-100" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-neutral-500 font-bold">Sin Portada</div>
                                                )}
                                                <span className={`absolute top-3 right-3 text-[10px] font-bold px-2 py-1 rounded backdrop-blur-xl border uppercase tracking-widest ${tagColor}`}>
                                                    {cancion.tipo_cancion}
                                                </span>
                                            </div>

                                            <div className="p-5 flex flex-col flex-grow">
                                                <h3 className="text-lg font-bold text-white line-clamp-1 mb-1 drop-shadow-sm" title={cancion.nombre}>{cancion.nombre}</h3>
                                                <p className="text-xs text-neutral-300 mb-3">Álbum: <span className="text-white font-medium">{cancion.album || 'Sencillo'}</span></p>
                                                
                                                <span className="text-xs text-neutral-300 font-mono mb-4">Lanzamiento: {fechaSegura}</span>
                                                <span className="text-xs text-neutral-300 font-mono">
                                                    Duración: <span className="text-white font-medium">{formatDuration(cancion.duracion_segundos)}</span>
                                                </span>

                                                {/* admin buttons */}
                                                <div className="mt-auto grid grid-cols-2 gap-2 pt-4 border-t border-white/10">
                                                    <button 
                                                        onClick={(e) => handleEditar(e, cancion.id)}
                                                        className="w-full py-2 bg-green-900/40 backdrop-blur-md text-green-300 border border-green-500/30 rounded-lg text-xs font-bold hover:bg-green-600 hover:text-white hover:border-green-500 transition-colors"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button 
                                                        onClick={(e) => prepararEliminacion(e, cancion.id, cancion.nombre)}
                                                        className="w-full py-2 bg-red-900/40 backdrop-blur-md text-red-300 border border-red-500/30 rounded-lg text-xs font-bold hover:bg-red-600 hover:text-white hover:border-red-500 transition-colors"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* paginacion */}
                            {totalPaginas > 1 && (
                                <div className="mt-12 flex justify-center items-center gap-3">
                                    <button 
                                        disabled={paginaActual === 1}
                                        onClick={() => {
                                            setPaginaActual(prev => prev - 1);
                                            window.scrollTo({ top: 0, behavior: 'smooth' });
                                        }}
                                        className="px-5 py-2.5 rounded-xl bg-black/40 backdrop-blur-md border border-white/10 text-neutral-300 font-bold text-sm disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 hover:text-white transition-all shadow-lg"
                                    >
                                        Anterior
                                    </button>

                                    <div className="flex gap-2">
                                        {[...Array(totalPaginas)].map((_, i) => (
                                            <button
                                                key={i + 1}
                                                onClick={() => {
                                                    setPaginaActual(i + 1);
                                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                                }}
                                                className={`w-10 h-10 rounded-lg font-bold transition-all border ${
                                                    paginaActual === i + 1 
                                                    ? 'bg-blue-600/90 border-blue-400/50 text-white shadow-[0_0_15px_rgba(37,99,235,0.5)] backdrop-blur-md' 
                                                    : 'bg-black/40 backdrop-blur-md border-white/10 text-neutral-300 hover:bg-white/10 hover:text-white'
                                                }`}
                                            >
                                                {i + 1}
                                            </button>
                                        ))}
                                    </div>

                                    <button 
                                        disabled={paginaActual === totalPaginas}
                                        onClick={() => {
                                            setPaginaActual(prev => prev + 1);
                                            window.scrollTo({ top: 0, behavior: 'smooth' });
                                        }}
                                        className="px-5 py-2.5 rounded-xl bg-black/40 backdrop-blur-md border border-white/10 text-neutral-300 font-bold text-sm disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 hover:text-white transition-all shadow-lg"
                                    >
                                        Siguiente
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </section>
            </div>
        </main>
    );
}
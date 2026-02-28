'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { usePublicCanciones } from '@/hooks/usePublicCanciones';

// la funcion para formatear la duracion
const formatearDuracion = (segundosTotales) => {
    if (!segundosTotales) return '0:00';
    const minutos = Math.floor(segundosTotales / 60);
    const segundos = segundosTotales % 60;
    return `${minutos}:${segundos.toString().padStart(2, '0')}`;
};

//función para ponerle comas a las visitas 
const formatearVisitas = (visitas) => {
    if (!visitas) return '0';
    return Number(visitas).toLocaleString('en-US');
};

export default function CatalogoPublico() {
    const router = useRouter();
    
    const { 
        canciones, 
        loading, 
        busqueda, setBusqueda, 
        filtroTipo, setFiltroTipo,
        orden, setOrden,
        paginaActual, setPaginaActual, 
        totalPaginas,
        totalResultados
    } = usePublicCanciones();

    return (
        <main className="min-h-screen relative text-white pb-20 pt-10">
            
            {/* wallpaper */}
            <div className="fixed inset-0 z-0 bg-[#0a0a0a]">
                <img 
                    src="/images/roses.jpg" 
                    alt="Ado Roses Background" 
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40"></div>
            </div>

            <div className="relative z-10 max-w-[100rem] mx-auto px-6 lg:px-12 flex flex-col lg:flex-row gap-10 items-start">
                
                <aside className="w-full lg:w-1/4 flex flex-col gap-6 sticky top-24">
                    {/* busqueda */}
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-white drop-shadow-md uppercase tracking-widest">Buscar Canción</label>
                        <input 
                            type="text"
                            placeholder="Nombre de la canción"
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                            className="w-full bg-[#141414] border border-[#262626] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-all text-neutral-200 placeholder:text-neutral-600"
                        />
                    </div>

                    {/* el filtro de tipo */}
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-white drop-shadow-md uppercase tracking-widest">Filtrar por Tipo</label>
                        <select 
                            value={filtroTipo}
                            onChange={(e) => setFiltroTipo(e.target.value)}
                            className="w-full bg-[#141414] border border-[#262626] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-all cursor-pointer text-neutral-300"
                        >
                            <option value="todos">Todas los tracks</option>
                            <option value="original">Originales</option>
                            <option value="cover">Covers</option>
                            <option value="collab">Colaboraciones</option>
                        </select>
                    </div>

                    {/* ordenar por visitas y fecha*/}
                    <div className="flex flex-col gap-2 mb-4">
                        <label className="text-xs font-bold text-white drop-shadow-md uppercase tracking-widest">Ordenar por</label>
                        <select 
                            value={orden}
                            onChange={(e) => setOrden(e.target.value)}
                            className="w-full bg-[#141414] border border-[#262626] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-all cursor-pointer text-neutral-300"
                        >
                            <option value="populares">Más populares</option>
                            <option value="recientes">Más recientes</option>
                            <option value="antiguas">Más antiguas</option>
                        </select>
                    </div>

                    {/* contador de resultados de canciones */}
                    <div className="px-6 py-4 bg-[#141414]/50 border border-[#262626] rounded-xl">
                        <p className="text-white drop-shadow-md text-sm">
                            Mostrando: <span className="text-white font-bold">{totalResultados}</span> canciones
                        </p>
                    </div>
                    <div className="max-w-7xl mx-auto mb-8">
                     <Link 
                        href="/" 
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-neutral-900/50 border border-blue-800 text-neutral-400 font-bold text-sm hover:bg-neutral-800 hover:text-white hover:border-neutral-600 transition-all shadow-sm"
                    >
                        <span></span> Volver a la página principal.
                    </Link>
                    </div>
                </aside>
                <section className="w-full lg:w-3/4">
                    <h1 className="text-3xl font-black mb-8 text-white-400">
                        Catálogo de Canciones de Ado
                    </h1>
                    
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-pulse">
                            {[...Array(8)].map((_, i) => (
                                <div key={i} className="bg-[#141414] h-72 rounded-2xl border border-[#262626]"></div>
                            ))}
                        </div>
                    ) : canciones.length === 0 ? (
                        <p className="text-neutral-500 bg-[#141414] p-6 rounded-lg border border-[#262626]">No se encontraron canciones con esos filtros.</p>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {canciones.map((cancion) => {
                                    const tagColor = cancion.tipo_cancion === 'original' 
                                        ? 'bg-blue-900/40 text-blue-300' 
                                        : cancion.tipo_cancion === 'cover' 
                                        ? 'bg-purple-900/40 text-purple-300' 
                                        : 'bg-teal-900/40 text-teal-300';

                                    const fechaSegura = cancion.fecha_lanzamiento 
                                        ? new Date(cancion.fecha_lanzamiento).toISOString().split('T')[0] 
                                        : 'Desconocida';

                                    return (
                                        <div 
                                            key={cancion.id} 
                                            onClick={() => router.push(`/canciones/${cancion.id}`)}
                                            className="group bg-[#141414] rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-500/10 flex flex-col cursor-pointer"
                                        >
                                            <div className="w-full h-48 bg-[#0a0a0a] relative overflow-hidden">
                                                {cancion.imagen_url ? (
                                                    <img src={cancion.imagen_url} alt={cancion.nombre} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-neutral-600 font-bold">Sin Portada</div>
                                                )}
                                                <span className={`absolute bottom-3 right-3 text-xs font-bold px-2 py-1 rounded backdrop-blur-md ${tagColor}`}>
                                                    {cancion.tipo_cancion}
                                                </span>
                                            </div>

                                            <div className="p-5 flex flex-col flex-grow">
                                                <h3 className="text-lg font-bold text-white line-clamp-1 mb-1" title={cancion.nombre}>{cancion.nombre}</h3>
                                                <p className="text-xs text-neutral-400 mb-4">Álbum: <span className="text-neutral-300">{cancion.album || 'Sencillo'}</span></p>
                                                
                                                <div className="mt-auto flex flex-col gap-1 text-xs text-neutral-500">
                                                    <p>Lanzamiento: {fechaSegura}</p>
                                                    <div className="flex justify-between items-center mt-1">
                                                        <p>Duración: {formatearDuracion(cancion.duracion_segundos)}</p>
                                                        <p className="flex items-center gap-1">
                                                            {formatearVisitas(cancion.visitas)}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* dolor de cabeza. paginación */}
                            {totalPaginas > 1 && (
                                <div className="mt-14 flex justify-center items-center gap-2">
                                    <button 
                                        disabled={paginaActual === 1}
                                        onClick={() => { setPaginaActual(prev => prev - 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                                        className="px-4 py-2 rounded-lg text-sm font-bold text-neutral-400 hover:text-white disabled:opacity-30 transition-colors"
                                    >
                                        Anterior
                                    </button>

                                    <div className="flex gap-1">
                                        {[...Array(totalPaginas)].map((_, i) => (
                                            <button
                                                key={i + 1}
                                                onClick={() => { setPaginaActual(i + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                                                className={`w-9 h-9 rounded-full text-sm font-bold transition-all ${
                                                    paginaActual === i + 1 
                                                    ? 'bg-blue-600 text-white' 
                                                    : 'text-neutral-400 hover:bg-[#262626] hover:text-white'
                                                }`}
                                            >
                                                {i + 1}
                                            </button>
                                        ))}
                                    </div>

                                    <button 
                                        disabled={paginaActual === totalPaginas}
                                        onClick={() => { setPaginaActual(prev => prev + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                                        className="px-4 py-2 rounded-lg text-sm font-bold text-neutral-400 hover:text-white disabled:opacity-30 transition-colors"
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
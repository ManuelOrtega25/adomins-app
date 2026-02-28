import Link from 'next/link';
import { pool } from '@/lib/db';
import albumesRepo from '@/repositories/albumes.repository';

// forzar carga dinámica para datos frescos
export const dynamic = 'force-dynamic';

// funciones de formateo
const formatearDuracion = (segundosTotales) => {
    if (!segundosTotales) return '0:00';
    const minutos = Math.floor(segundosTotales / 60);
    const segundos = segundosTotales % 60;
    return `${minutos}:${segundos.toString().padStart(2, '0')}`;
};

const formatearVisitas = (visitas) => {
    if (!visitas) return '0';
    return Number(visitas).toLocaleString('en-US');
};

export default async function HomePage() {
    // top 4 canciones por visitas
    let topCanciones = [];
    try {
        const resCanciones = await pool.query('SELECT * FROM canciones ORDER BY visitas DESC NULLS LAST LIMIT 4');
        topCanciones = resCanciones.rows;
    } catch (error) {
        console.error('Error cargando top canciones en Home:', error);
    }

    // top 4 álbumes por fecha de lanzamiento
    let topAlbumes = [];
    try {
        const todosAlbumes = await albumesRepo.getAll();
        topAlbumes = todosAlbumes
            .sort((a, b) => new Date(b.fecha_lanzamiento) - new Date(a.fecha_lanzamiento))
            .slice(0, 4);
    } catch (error) {
        console.error('Error cargando top álbumes en Home:', error);
    }

    return (
        <main className="min-h-screen relative flex flex-col items-center">

            {/* wallpaper */}
            <div className="fixed inset-0 z-0">
                <img 
                    src="/images/wallpaper.png" 
                    alt="Ado 8K Background" 
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50"></div>
            </div>

            {/* contenido */}
            <div className="relative z-10 w-full flex flex-col items-center pb-24">

                {/* adomins banner */}
                <section className="w-full pt-10 pb-6 px-6 flex flex-col items-center justify-center">
                    <img
                        src="/images/banner.png"
                        alt="Adomins Banner Oficial"
                        className="w-full max-w-md h-auto drop-shadow-[0_0_30px_rgba(59,130,246,0.3)] hover:scale-105 transition-transform duration-500"
                    />
                </section>

                <div className="w-full max-w-[100rem] mx-auto px-6 lg:px-12 flex flex-col gap-20">

                    {/* sección 1 top de la gritona */}
                    <section>
                        <div className="flex justify-between items-end mb-8 drop-shadow-md">
                            <div>
                                <h2 className="text-3xl font-black text-white">Top más populares</h2>
                                <p className="text-neutral-300 mt-1 font-medium">Las canciones más escuchadas en YouTube</p>
                            </div>
                            <Link href="/canciones" className="hidden sm:inline-block text-blue-300 hover:text-blue-200 font-bold text-sm transition-colors border-b border-transparent hover:border-blue-300 pb-1">
                                Ver catálogo completo
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {topCanciones.map((cancion) => {
                                const tagColor = cancion.tipo_cancion === 'original'
                                    ? 'bg-blue-900/60 text-blue-200'
                                    : cancion.tipo_cancion === 'cover'
                                        ? 'bg-purple-900/60 text-purple-200'
                                        : 'bg-teal-900/60 text-teal-200';

                                const fechaSegura = cancion.fecha_lanzamiento
                                    ? new Date(cancion.fecha_lanzamiento).toISOString().split('T')[0]
                                    : 'Desconocida';

                                return (
                                    <Link
                                        href={`/canciones/${cancion.id}`}
                                        key={cancion.id}
                                        className="group bg-black/40 backdrop-blur-md rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(59,130,246,0.3)] flex flex-col cursor-pointer border border-white/10 hover:border-blue-500/50"
                                    >
                                        <div className="w-full h-48 bg-black/50 relative overflow-hidden">
                                            {cancion.imagen_url ? (
                                                <img src={cancion.imagen_url} alt={cancion.nombre} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-neutral-400 font-bold">Sin Portada</div>
                                            )}
                                            <span className={`absolute bottom-3 right-3 text-[10px] font-bold px-2 py-1 rounded backdrop-blur-xl uppercase tracking-widest border border-white/10 ${tagColor}`}>
                                                {cancion.tipo_cancion}
                                            </span>
                                        </div>

                                        <div className="p-5 flex flex-col flex-grow">
                                            <h3 className="text-lg font-bold text-white line-clamp-1 mb-1 group-hover:text-blue-300 transition-colors drop-shadow-sm" title={cancion.nombre}>{cancion.nombre}</h3>
                                            <p className="text-xs text-neutral-300 mb-4">Álbum: <span className="text-white">{cancion.album || 'Sencillo'}</span></p>

                                            <div className="mt-auto flex flex-col gap-1 text-xs text-neutral-300">
                                                <div className="flex justify-between items-center mt-1">
                                                    <p>Duración: {formatearDuracion(cancion.duracion_segundos)}</p>
                                                    <p className="flex items-center gap-1 text-white font-bold drop-shadow-sm">
                                                        <span className="text-blue-400">Visitas:</span> {formatearVisitas(cancion.visitas)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                        <Link href="/canciones" className="block sm:hidden text-center mt-8 text-blue-300 font-bold text-sm bg-black/40 py-3 rounded-xl backdrop-blur-md border border-white/10">
                            Ver catálogo completo &rarr;
                        </Link>
                    </section>


                    {/* sección 2 últimos álbumes */}
                    <section>
                        <div className="flex justify-between items-end mb-8 drop-shadow-md">
                            <div>
                                <h2 className="text-3xl font-black text-white">Discografía más recientes</h2>
                                <p className="text-neutral-300 mt-1 font-medium">Los discos más recientes.</p>
                            </div>
                            <Link href="/albumes" className="hidden sm:inline-block text-purple-300 hover:text-purple-200 font-bold text-sm transition-colors border-b border-transparent hover:border-purple-300 pb-1">
                                Ver todos los álbumes
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {topAlbumes.map((album) => (
                                <Link
                                    href={`/albumes/${album.id}`}
                                    key={album.id}
                                    className="group bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(168,85,247,0.3)] hover:border-purple-500/50 flex flex-col cursor-pointer"
                                >
                                    <div className="aspect-square relative overflow-hidden bg-black/50">
                                        <img
                                            src={album.imagen_url}
                                            alt={`Portada de ${album.nombre}`}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100"
                                        />
                                    </div>

                                    <div className="p-5 flex flex-col flex-grow">
                                        <div className="flex justify-between items-start mb-3">
                                            <span className={`text-[10px] font-bold px-2 py-1 rounded border border-white/10 backdrop-blur-xl uppercase tracking-widest ${album.tipo_album === 'Banda sonora'
                                                    ? 'bg-pink-900/60 text-pink-200'
                                                    : album.tipo_album === 'Compilación'
                                                        ? 'bg-green-900/60 text-green-200'
                                                        : 'bg-blue-900/60 text-blue-200'
                                                }`}>
                                                {album.tipo_album}
                                            </span>
                                            <span className="text-xs text-white font-mono font-bold drop-shadow-sm">
                                                {new Date(album.fecha_lanzamiento).getFullYear()}
                                            </span>
                                        </div>

                                        <h2 className="text-lg font-bold text-white mb-2 line-clamp-2 leading-tight group-hover:text-purple-300 transition-colors drop-shadow-sm">
                                            {album.nombre}
                                        </h2>
                                    </div>
                                </Link>
                            ))}
                        </div>
                        <Link href="/albumes" className="block sm:hidden text-center mt-8 text-purple-300 font-bold text-sm bg-black/40 py-3 rounded-xl backdrop-blur-md border border-white/10">
                            Ver todos los álbumes
                        </Link>
                    </section>

                </div>
            </div>
        </main>
    );
}
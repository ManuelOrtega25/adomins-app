import Link from 'next/link';
import albumesRepo from '@/repositories/albumes.repository';
import { notFound } from 'next/navigation';

// esta función la usé más abajo para cambiar los seg en min
const formatDuration = (seconds) => {
  if (!seconds) return '--:--';
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

// colores bonitos
const getTheme = (type) => {
    if (type === 'Banda sonora') return { accent: 'text-rose-400', hover: 'group-hover:text-rose-300' };
    if (type === 'Compilación') return { accent: 'text-emerald-400', hover: 'group-hover:text-emerald-300' };
    return { accent: 'text-sky-400', hover: 'group-hover:text-sky-300' }; 
};

export const dynamic = 'force-dynamic';

export default async function DetalleAlbumPage({ params }) {
  const { id } = await params;
  const albumData = await albumesRepo.getByIdWithSongs(id);

  if (!albumData) {
    notFound();
  }

  // Obtenemos los colores elegantes según el tipo
  const theme = getTheme(albumData.tipo_album);

  return (
    <main className="min-h-screen relative text-white p-8 md:p-12">

      {/* wallpaper */}
      <div className="fixed inset-0 z-0 bg-[#0a0a0a]">
          <img 
              src="/images/albumes2.jpg" 
              alt="Ado Albumes Background" 
              className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto flex flex-col md:flex-row gap-12 md:gap-20 items-start">
        
        {/* portada y tipo_album */}
        <div className="w-full md:w-[400px] lg:w-[420px] flex-shrink-0 md:sticky md:top-16 flex flex-col items-center text-center">
            
            <h1 className="text-5xl lg:text-6xl font-black mb-6 tracking-tight bg-gradient-to-br from-white to-neutral-500 bg-clip-text text-transparent leading-tight">
                {albumData.nombre}
            </h1>
            
            {/* portada */}
            <div className="w-full aspect-square rounded-[2rem] overflow-hidden shadow-2xl shadow-neutral-950 border border-neutral-800 mb-6">
                <img 
                    src={albumData.imagen_url} 
                    alt={albumData.nombre}
                    className="w-full h-full object-cover"
                 />
            </div>

            {/* este es dinamico pues cambia el color segun su tipo, igual que en la página de álbum*/}
            <span className={`text-xl font-mono font-bold uppercase tracking-widest ${theme.accent}`}>
                {albumData.tipo_album}
            </span>
        </div>

        {/* descripción y fecha === */}
        <div className="flex-grow w-full relative">
            
            {/* header fijo */}
            <div className="sticky top-0 z-10 bg-neutral-900/40 backdrop-blur-xl p-6 md:p-8 mb-8 border border-neutral-800/50 rounded-3xl flex flex-col items-center md:items-end text-center md:text-right shadow-xl">
                
                <span className="text-neutral-400 font-bold mb-3 uppercase tracking-wider text-sm">
                    Lanzamiento: <span className="text-white">{new Date(albumData.fecha_lanzamiento).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </span>
                <p className="text-lg w-full max-w-2xl leading-relaxed text-neutral-300 font-medium">
                    {albumData.descripcion}
                </p>
                
            </div>

            {/* lista de cancionones */}
            <div className="bg-neutral-900/40 p-4 md:p-6 rounded-3xl border border-neutral-800/50">
            {/* regresar*/}
            <div className="max-w-7xl mx-auto mb-8">
             <Link 
            href="/albumes" 
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-neutral-900/50 border border-blue-800 text-neutral-400 font-bold text-sm hover:bg-neutral-800 hover:text-white hover:border-neutral-600 transition-all shadow-sm"
        >
            <span></span> Volver a álbumes
             </Link>
             </div>
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-3 pb-2 border-b border-neutral-800/50">
                    <span className={theme.accent}>▶</span> Tracks ({albumData.canciones.length})
                </h3>

                {albumData.canciones.length > 0 ? (
                    <div className="flex flex-col gap-1">
                        {albumData.canciones.map((cancion, index) => (
                            <Link 
                                key={cancion.id}
                                href={`/canciones/${cancion.id}`}
                                className="group flex items-center p-3 rounded-xl hover:bg-neutral-800/50 transition-all border border-transparent hover:border-neutral-700/50"
                            >
                                {/* número de track */}
                                <span className="font-mono text-neutral-500 w-8 text-center text-lg font-bold group-hover:text-white transition-colors">
                                    {cancion.track_numero || index + 1}
                                </span>

                                {/* imagen_url de la canción todo hermoso */}
                                <div className="w-14 h-14 flex-shrink-0 rounded-md overflow-hidden mx-4 border border-neutral-800 shadow-sm">
                                    <img 
                                        src={cancion.imagen_url} 
                                        alt={cancion.nombre}
                                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                    />
                                </div>

                                {/* nombre de la cancion */}
                                <div className="flex-grow">
                                    <h4 className={`text-lg font-bold text-neutral-100 transition-colors truncate ${theme.hover}`}>
                                        {cancion.nombre}
                                    </h4>
                                </div>

                                {/* duracion */}
                                <span className="font-mono text-neutral-500 text-sm font-bold ml-4 group-hover:text-white transition-colors">
                                    {formatDuration(cancion.duracion_segundos)}
                                </span>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="p-10 text-center text-neutral-500 bg-neutral-900/50 rounded-2xl border border-neutral-800 border-dashed">
                        <p className="text-xl">Aún no se han agregado canciones a este álbum</p>
                        <p className="text-sm mt-2 text-neutral-600">(el puente en la base de datos fallo pipipi, obvio nunca va fallar, lo hice a medida xd)</p>
                    </div>
                )}
            </div>

        </div>

      </div>
    </main>
  );
}
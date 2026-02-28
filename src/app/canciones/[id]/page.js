import { pool } from '@/lib/db'; 
import Link from 'next/link';

//función de extracción de ID de YouTube (futuro Ado request)
function obtenerYouTubeID(urlOrId) {
  if (!urlOrId) return null;
  if (urlOrId.includes('v=')) return urlOrId.split('v=')[1].split('&')[0];
  if (urlOrId.includes('youtu.be/')) return urlOrId.split('youtu.be/')[1].split('?')[0];
  return urlOrId;
}

//esta función la usé más abajo para cambiar los seg en min x2
const formatDuration = (seconds) => {
  if (!seconds) return '--:--';
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

//función de búsqueda de canción por ID anti SQL injection
async function getCancionPorID(id) {
  try {
    const query = 'SELECT * FROM canciones WHERE id = $1';
    const values = [id];
    const result = await pool.query(query, values);
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error buscando canción:', error);
    return null;
  }
}

//cancion id page
export default async function CancionDetallePage({ params }) {
  const { id } = await params; 

  const cancion = await getCancionPorID(id);

  if (!cancion) {
    return (
      <div className="p-10 text-center min-h-screen flex flex-col items-center justify-center bg-neutral-950 text-white">
        <h1 className="text-3xl font-bold text-red-500 mb-4">Canción no encontrada</h1>
        <p className="text-gray-400 mb-6">El ID {id} no existe en la base de datos.</p>
        <div className="max-w-7xl mx-auto mb-8">
          <Link 
              href="/canciones" 
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-neutral-900/50 border border-blue-800 text-neutral-400 font-bold text-sm hover:bg-neutral-800 hover:text-white hover:border-neutral-600 transition-all shadow-sm"
          >
            Volver a canciones
          </Link>
        </div>
      </div>
    );
  }

  // colores para los tags 
  const tagColor = cancion.tipo_cancion === 'original' 
    ? 'bg-blue-900/60 text-blue-200 border-blue-800/50' 
    : cancion.tipo_cancion === 'cover' 
      ? 'bg-purple-900/60 text-purple-200 border-purple-800/50' 
      : 'bg-teal-900/60 text-teal-200 border-teal-800/50';

  const fechaSegura = cancion.fecha_lanzamiento 
    ? new Date(cancion.fecha_lanzamiento).toISOString().split('T')[0] 
    : 'Desconocida';

  const ytID = obtenerYouTubeID(cancion.youtube_id);

  return (
    <main className="min-h-screen relative text-white p-6 md:p-10 flex flex-col items-center">
      
      <div className="fixed inset-0 z-0 bg-[#0a0a0a]">
          <img 
              src="/images/roses.jpg" 
              alt="Ado Roses Background" 
              className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60"></div>
      </div>

      {/* contenido flotante */}
      <div className="relative z-10 w-full max-w-[100rem] flex flex-col items-center">


          <div className="w-full flex flex-col lg:flex-row gap-8 items-stretch">
            
            {/* reproductor */}
            <div className="w-full lg:w-[60%] flex flex-col">
              <div className="bg-black border border-white/10 rounded-3xl shadow-2xl overflow-hidden w-full aspect-video relative">
                {ytID ? (
                  <iframe 
                    className="w-full h-full absolute top-0 left-0"
                    src={`https://www.youtube.com/embed/${ytID}?autoplay=0&rel=0`} 
                    title={`Reproductor de ${cancion.nombre}`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                    allowFullScreen
                  ></iframe>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-neutral-600 font-bold">
                    Link de YouTube no disponible
                  </div>
                )}
              </div>
            </div>

            <div className="w-full lg:w-[40%] bg-neutral-900/40 backdrop-blur-xl border border-neutral-800/50 rounded-3xl p-8 md:p-10 shadow-xl flex flex-col justify-center">
              
              {/* header */}
              <div className="flex flex-wrap justify-between items-start mb-8 gap-4 drop-shadow-md">
                <h1 className="text-4xl md:text-5xl font-extrabold text-white break-words drop-shadow-sm">
                  {cancion.nombre}
                </h1>
                <span className={`text-xs font-bold px-4 py-2 rounded-full border uppercase tracking-widest mt-2 whitespace-nowrap backdrop-blur-xl ${tagColor}`}>
                  {cancion.tipo_cancion}
                </span>
              </div>

              {/* album */}
              <div className="bg-black/40 backdrop-blur-md p-6 rounded-2xl border border-white/10 mb-8 shadow-lg">
                <h3 className="text-xs font-bold text-neutral-400 mb-2 uppercase tracking-wider drop-shadow-md">Álbum</h3>
                <p className="text-2xl text-white font-bold drop-shadow-sm">
                  {cancion.album || "Sencillo"}
                </p>
              </div>

              {/* estadisticas */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
                
                <div className="bg-black/40 backdrop-blur-md border border-white/10 p-4 rounded-2xl text-center flex flex-col justify-center transition-all hover:border-blue-400/50 hover:-translate-y-1 shadow-lg">
                   <p className="text-[10px] text-neutral-400 uppercase font-bold tracking-widest mb-1 drop-shadow-md">Duración</p>
                   <p className="font-bold text-base xl:text-lg text-white drop-shadow-sm">{formatDuration(cancion.duracion_segundos)} <span className="text-[10px] text-neutral-400 font-normal">min</span></p>
                </div>
                
                <div className="bg-black/40 backdrop-blur-md border border-white/10 p-4 rounded-2xl text-center flex flex-col justify-center transition-all hover:border-blue-400/50 hover:-translate-y-1 shadow-lg">
                   <p className="text-[10px] text-neutral-400 uppercase font-bold tracking-widest mb-1 drop-shadow-md">Visitas YT</p>
                   <p className="font-bold text-base xl:text-lg text-white drop-shadow-sm tracking-tighter">
                     {new Intl.NumberFormat('es-MX').format(cancion.visitas || 0)}
                   </p>
                </div>
                
                <div suppressHydrationWarning className="bg-black/40 backdrop-blur-md border border-white/10 p-4 rounded-2xl text-center flex flex-col justify-center transition-all hover:border-blue-400/50 hover:-translate-y-1 shadow-lg">
                   <p className="text-[10px] text-neutral-400 uppercase font-bold tracking-widest mb-1 drop-shadow-md">Lanzamiento</p>
                   <p className="font-bold text-base xl:text-lg text-white font-mono drop-shadow-sm tracking-tighter">{fechaSegura}</p>
                </div>

              </div>
              
              {/* volver */}
              <div className="mt-auto pt-8">
                <Link 
                    href="/canciones" 
                    className="flex items-center justify-center w-full py-4 rounded-2xl bg-neutral-900/60 backdrop-blur-md border border-blue-800/50 text-neutral-300 font-bold text-sm hover:bg-neutral-800 hover:text-white hover:border-blue-500 transition-all shadow-lg"
                >
                    Volver al Catálogo
                </Link>
              </div>

            </div>
          </div>
      </div>
    </main>
  );
}
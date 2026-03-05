import { pool } from '@/lib/db'; 
import Link from 'next/link';
import SongInfoCard from '@/components/SongInfoCard';

// Función de extracción de ID de YouTube
function obtenerYouTubeID(urlOrId) {
  if (!urlOrId) return null;
  if (urlOrId.includes('v=')) return urlOrId.split('v=')[1].split('&')[0];
  if (urlOrId.includes('youtu.be/')) return urlOrId.split('youtu.be/')[1].split('?')[0];
  return urlOrId;
}

// Función auxiliar para formatear duración (aunque SongInfoCard ya tiene la suya, no estorba aquí)
const formatDuration = (seconds) => {
  if (!seconds) return '--:--';
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

// Función de búsqueda de canción por ID
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

  const ytID = obtenerYouTubeID(cancion.youtube_id);

  return (
    <main className="min-h-screen relative text-white p-6 md:p-10 flex flex-col items-center">
      
      {/* Fondo */}
      <div className="fixed inset-0 z-0 bg-[#0a0a0a]">
          <img 
              src="/images/roses.jpg" 
              alt="Ado Roses Background" 
              className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60"></div>
      </div>

      {/* Contenido flotante */}
      <div className="relative z-10 w-full max-w-[100rem] flex flex-col items-center">

          <div className="w-full flex flex-col lg:flex-row gap-8 items-stretch">
            
            {/* IZQUIERDA: Reproductor (60% del ancho) */}
            <div className="w-full lg:w-[60%] flex flex-col">
              <div className="bg-black border border-white/10 rounded-3xl shadow-2xl overflow-hidden w-full aspect-video relative sticky top-10">
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

            {/* DERECHA: SongInfoCard (40% del ancho) */}
            {/* Aquí estaba el error: borramos el contenedor viejo y dejamos solo el wrapper limpio */}
            <div className="w-full lg:w-[40%]">
               <SongInfoCard cancion={cancion} />
            </div>

          </div>
      </div>
    </main>
  );
}
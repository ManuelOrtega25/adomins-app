import Link from 'next/link';
import albumesRepo from '@/repositories/albumes.repository'; 

//traer datos nuevos
export const dynamic = 'force-dynamic';

export default async function AlbumesPage() {
  //repo de supabase
  const albumes = await albumesRepo.getAll();

  return (
    <main className="min-h-screen relative text-white p-6 md:p-10">
      
      {/* wallpaper */}
      <div className="fixed inset-0 z-0 bg-[#0a0a0a]">
          <img 
              src="/images/albumes2.jpg" 
              alt="Ado Albumes Background" 
              className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60"></div>
      </div>

      <div className="relative z-10 w-full">
        
        <div className="max-w-7xl mx-auto">
          
          <div className="mb-8 drop-shadow-md">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white-400 mb-4 drop-shadow-sm">
              Álbumes de la patrona
            </h1>
            <p className="text-neutral-400 text-lg drop-shadow-md">
              Estos son los álbumes de Ado. Escoge uno para ver sus canciones!
            </p>
          </div>

          {/* grid de las tarjetas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {albumes.map((album) => (
              <Link 
                href={`/albumes/${album.id}`} 
                key={album.id} 
                className="group bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-blue-500/20 hover:border-blue-500/50 flex flex-col cursor-pointer"
              >
                <div className="aspect-square relative overflow-hidden bg-neutral-800">
                  <img 
                    src={album.imagen_url} 
                    alt={`Portada de ${album.nombre}`} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>

                {/* info de la tarjeta */}
                <div className="p-5 flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-3">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded border uppercase tracking-widest ${
                      album.tipo_album === 'Banda sonora' 
                        ? 'bg-pink-900/40 text-pink-300 border-pink-800/50' 
                        : album.tipo_album === 'Compilación' 
                          ? 'bg-green-900/40 text-green-300 border-green-800/50' 
                          : 'bg-blue-900/40 text-blue-300 border-blue-800/50' 
                    }`}>
                      {album.tipo_album}
                    </span>
                    <span className="text-xs text-neutral-500 font-mono font-bold">
                      {new Date(album.fecha_lanzamiento).getFullYear()}
                    </span>
                  </div>

                  <h2 className="text-xl font-bold text-white mb-2 line-clamp-2 leading-tight group-hover:text-blue-400 transition-colors">
                    {album.nombre}
                  </h2>
                  
                  <p className="text-sm text-neutral-400 line-clamp-2 mb-5 flex-grow">
                    {album.descripcion}
                  </p>

                  {/* botón de ver canciones */}
                  <div className="mt-auto block text-center bg-neutral-800 text-white font-bold py-2.5 px-4 rounded-xl text-sm transition-colors border border-neutral-700 group-hover:bg-neutral-700 group-hover:border-neutral-500">
                    Ver álbum 
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="max-w-7xl mx-auto mt-12 mb-6 flex justify-center md:justify-start">
            <Link 
                href="/" 
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-neutral-900/50 backdrop-blur-md border border-blue-800 text-neutral-400 font-bold text-sm hover:bg-neutral-800 hover:text-white hover:border-neutral-600 transition-all shadow-lg"
            >
              Volver a la página principal
            </Link>
          </div>

          {/* si no hay álbumes */}
          {albumes.length === 0 && (
            <div className="text-center py-20 text-neutral-500">
              <p className="text-xl">No se encontraron álbumes en la base de datos.</p>
            </div>
          )}

        </div>
      </div>
    </main>
  );
}
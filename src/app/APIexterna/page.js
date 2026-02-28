import Link from 'next/link';

//función para consumir la API Externa 
async function getAnimeData() {
  try {
    const res = await fetch('https://api.jikan.moe/v4/anime/50410', {
      next: { revalidate: 3600 } 
    });
    
    if (!res.ok) throw new Error('Fallo al conectar con la API de Jikan');
    
    const data = await res.json();
    return data.data; 
  } catch (error) {
    console.error("Error fetching anime:", error);
    return null;
  }
}

export default async function ApiExternaPage() {
  // Llamada a la API
  const anime = await getAnimeData();

  return (
    <main className="min-h-screen relative text-white p-6 md:p-10 flex flex-col items-center">
      
      {/* wallpaper */}
      <div className="fixed inset-0 z-0">
          <img 
              src="/images/apiexterna2.jpg" 
              alt="Uta Background" 
              className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50"></div>
      </div>

      {/* contenido flotante */}
      <div className="relative z-10 w-full max-w-5xl flex flex-col items-center">

        {/* contenedor principal de la API externa */}
        <div className="w-full">

          <h1 className="text-4xl md:text-5xl font-extrabold mb-2 text-center text-white drop-shadow-lg">
            Ado en el Anime
          </h1>
          <p className="text-center text-neutral-300 font-mono text-sm mb-10 drop-shadow-md">
            Datos extraídos en vivo vía MyAnimeList API (Jikan)
          </p>

          {anime ? (
            <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.5)] flex flex-col">
              
              {/* portada y datos principales */}
              <div className="flex flex-col md:flex-row border-b border-white/10">
                <div className="md:w-[35%] bg-black/50 flex-shrink-0 relative">
                  <img 
                    src={anime.images.jpg.large_image_url} 
                    alt={anime.title} 
                    className="w-full h-full object-cover aspect-[3/4] opacity-90 hover:opacity-100 transition-opacity"
                  />
                  <div className="absolute top-4 left-4 bg-red-600/90 backdrop-blur-md text-white text-xs font-black px-3 py-1.5 rounded-md shadow-lg uppercase tracking-widest border border-red-500/50">
                    Colaboración Épica
                  </div>
                </div>
                
                {/* datos de la api */}
                <div className="p-8 md:p-10 md:w-[65%] flex flex-col justify-center bg-gradient-to-br from-black/20 to-black/60">
                  
                  {/* estadisticas rapidas */}
                  <div className="flex flex-wrap gap-4 mb-4">
                    <span className="flex items-center gap-1 bg-yellow-500/20 backdrop-blur-md text-yellow-400 font-bold px-3 py-1 rounded-full border border-yellow-500/30 text-sm shadow-md">
                      ⭐ {anime.score} Score
                    </span>
                    <span className="bg-blue-500/20 backdrop-blur-md text-blue-300 font-bold px-3 py-1 rounded-full border border-blue-500/30 text-sm shadow-md">
                      Rank #{anime.rank}
                    </span>
                    <span className="bg-purple-500/20 backdrop-blur-md text-purple-300 font-bold px-3 py-1 rounded-full border border-purple-500/30 text-sm shadow-md">
                      Pop #{anime.popularity}
                    </span>
                  </div>
                  
                  <h3 className="text-3xl font-black text-white mb-2 leading-tight drop-shadow-md">
                    {anime.title} <span className="text-xl text-neutral-300 font-normal">({anime.year})</span>
                  </h3>
                  
                  <div className="bg-blue-950/40 backdrop-blur-md border border-blue-500/30 p-4 rounded-xl mb-6 inline-block shadow-lg">
                    <p className="text-blue-300 font-bold text-sm uppercase tracking-wider mb-1">El rol de Ado</p>
                    <p className="text-white font-medium drop-shadow-sm">Voz cantante oficial de Uta (Toda la banda sonora)</p>
                  </div>
                  
                  {/* géneros extraídos del array de la API */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {anime.genres.map((genre) => (
                      <span key={genre.mal_id} className="text-xs font-bold text-neutral-200 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-md border border-white/20 shadow-sm">
                        {genre.name}
                      </span>
                    ))}
                  </div>

                  <p className="text-neutral-200 text-sm leading-relaxed mb-8 flex-grow drop-shadow-md font-medium">
                    {anime.synopsis}
                  </p>

                  {/* botones */}
                  <div className="mt-auto flex flex-col sm:flex-row gap-4 items-center w-full">
                    
                    <a 
                      href={anime.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-center text-sm bg-white/90 hover:bg-white text-black font-bold py-3 px-6 rounded-xl transition-transform hover:-translate-y-1 shadow-[0_0_20px_rgba(255,255,255,0.2)] w-full sm:w-fit"
                    >
                      Abrir en MyAnimeList
                    </a>

                    <Link 
                        href="/" 
                        className="text-center px-6 py-3 rounded-xl bg-neutral-900/50 backdrop-blur-md border border-blue-800 text-neutral-300 font-bold text-sm hover:bg-neutral-800 hover:text-white hover:border-blue-400 transition-all shadow-lg w-full sm:w-fit"
                    >
                        Volver a la página principal
                    </Link>

                  </div>
                </div>
              </div>

              {/* casi todos los datos de la API */}
              <div className="flex flex-col lg:flex-row bg-black/60 backdrop-blur-xl">
                
                {/* metadatos */}
                <div className="p-8 lg:w-1/3 flex flex-col gap-6 border-r border-white/10">
                  <div>
                    <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest mb-1 drop-shadow-md">Estudio de Animación</p>
                    <p className="text-white font-medium drop-shadow-sm">{anime.studios[0]?.name || 'Desconocido'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest mb-1 drop-shadow-md">Fecha de lanzamiento</p>
                    <p className="text-white font-medium drop-shadow-sm">28 de Julio de 2022</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest mb-1 drop-shadow-md">Duración</p>
                    <p className="text-white font-medium drop-shadow-sm">{anime.duration}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest mb-1 drop-shadow-md">Clasificación</p>
                    <p className="text-white font-medium drop-shadow-sm">{anime.rating}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest mb-1 drop-shadow-md">Miembros en Jikan</p>
                    <p className="text-white font-medium drop-shadow-sm">{new Intl.NumberFormat('en-US').format(anime.members)}</p>
                  </div>
                </div>

                {/* trailer de YouTube */}
                <div className="p-8 lg:w-2/3 flex flex-col">
                  <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest mb-4 drop-shadow-md">Tráiler Oficial</p>
                  {anime.trailer?.embed_url ? (
                    <div className="w-full aspect-video rounded-xl overflow-hidden border border-white/10 shadow-2xl">
                      <iframe 
                        className="w-full h-full"
                        src={anime.trailer.embed_url} 
                        title="Anime Trailer"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowFullScreen
                      ></iframe>
                    </div>
                  ) : (
                    <div className="w-full aspect-video rounded-xl border border-white/10 bg-black/50 flex items-center justify-center text-neutral-500 font-bold backdrop-blur-md">
                      Tráiler no disponible
                    </div>
                  )}
                </div>

              </div>

            </div>
          ) : (
            <div className="bg-black/60 backdrop-blur-md border border-red-500/30 p-8 rounded-2xl text-center shadow-lg">
              <p className="text-red-400 font-bold animate-pulse">Error al conectar con la API de MyAnimeList. Revisa tu conexión.</p>
            </div>
          )}

        </div>
      </div>
    </main>
  );
}
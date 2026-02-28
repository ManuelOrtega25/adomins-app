import Link from 'next/link';

export default function AboutPage() {
  return (
    <main className="min-h-screen relative text-white p-6 md:p-10 flex flex-col items-center justify-center overflow-hidden">
      
      {/* wallpaper */}
      <div className="fixed inset-0 z-0 bg-[#0a0a0a]">
          <img 
              src="/images/about.jpg" 
              alt="Ready Steady" 
              className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50"></div>
      </div>

      {/* contenido flotante */}
      <div className="relative z-10 w-full max-w-4xl flex flex-col items-center">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-10 text-white text-center drop-shadow-lg leading-tight">
          Acerca del Proyecto Adomins
        </h1>
        <div className="w-full bg-black/40 backdrop-blur-xl border border-white/10 p-10 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.4)] flex flex-col items-center">
          
          <h2 className="text-2xl font-bold mb-5 text-white drop-shadow-md">¿Qué es Adomins?</h2>
          
          <p className="text-neutral-200 leading-relaxed font-medium mb-10 text-center max-w-2xl drop-shadow-md">
            Adomins es una página donde recopilamos todas las canciones de Ado y sus álbumes. ¡Próximamente habrá más secciones para la comunidad! 
            Esta versión release 1.0 está construida full stack con Next.js, Supabase y Tailwind CSS.
          </p>

          <div className="flex flex-col sm:flex-row gap-5 items-center w-full justify-center">
            <Link 
              href="/canciones" 
              className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-neutral-900/50 backdrop-blur-md border border-blue-800 text-neutral-300 font-bold text-sm hover:bg-neutral-800 hover:text-white hover:border-neutral-600 transition-all shadow-lg w-full sm:w-fit"
            >
              Explorar el catálogo de canciones
            </Link>
            <Link 
                href="/" 
                className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-neutral-900/50 backdrop-blur-md border border-blue-800 text-neutral-300 font-bold text-sm hover:bg-neutral-800 hover:text-white hover:border-neutral-600 transition-all shadow-lg w-full sm:w-fit"
            >
                Volver a la página principal
            </Link>

          </div>

        </div>
      </div>

    </main>
  );
}
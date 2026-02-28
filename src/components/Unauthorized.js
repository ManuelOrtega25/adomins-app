import Link from 'next/link';

// componente para mostrar mensaje cuando el usuario no tiene permisos
export default function Unauthorized() {
  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-6 text-center">
      
      {/* imagen de Ado enchilada cfff */}
      <img 
          src="/images/adonop.png" 
          alt="No eres admin"
          className="w-full max-w-3xl h-auto object-contain mb-8 drop-shadow-2xl" 
      />

      {/* largate de aqui */}
      <Link 
                href="/" 
                className="inline-flex items-center px-5 py-2.5 rounded-xl bg-neutral-900/50 border border-blue-800 text-neutral-400 font-bold text-sm hover:bg-neutral-800 hover:text-white hover:border-neutral-600 transition-all shadow-sm"
            >
                Volver a la página principal
            </Link>

    </div>
  );
}
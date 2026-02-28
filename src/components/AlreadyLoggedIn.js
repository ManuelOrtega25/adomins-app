import Link from 'next/link';

// componente para mostrar mensaje cuando el usuario ya está logueado
export default function AlreadyLoggedIn() {
  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-6 md:p-12 overflow-hidden">
      
      <div className="flex flex-col md:flex-row items-center justify-center gap-8 lg:gap-16 max-w-[100rem] w-full">

        {/* la ado*/}
        <div className="w-full md:w-3/5 flex justify-center md:justify-end relative">
            <img 
                src="/images/ado-reganando.png" 
                alt="Ado regañándote"
                className="w-[120%] md:w-[130%] lg:w-[100%] max-w-none h-auto object-contain -ml-12 md:-ml-24" 
            />
        </div>
        <div className="w-full md:w-2/5 flex flex-col items-center md:items-start text-center md:text-left relative z-10">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-red-500 leading-tight">
                Hm? <br /> Muy listo eh?
            </h2>

            <p className="text-red-400 text-lg mb-8 font-medium leading-relaxed max-w-sm">
                Si quieres entrar a donde quisiste ir... primero cierra sesión, tontín.
            </p>

            <Link 
                href="/" 
                className="inline-flex items-center px-5 py-2.5 rounded-xl bg-neutral-900/50 border border-blue-800 text-neutral-400 font-bold text-sm hover:bg-neutral-800 hover:text-white hover:border-neutral-600 transition-all shadow-sm"
            >
                Volver al inicio
            </Link>
        </div>

      </div>
    </div>
  );
}
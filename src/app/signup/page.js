'use client'; 
import Link from 'next/link';
import { useState, useEffect } from 'react'; 
import AlreadyLoggedIn from '@/components/AlreadyLoggedIn'; 

export default function SignUpPage() {
  //estados de protección
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [cargando, setCargando] = useState(false);

  //misma protección que en login
  useEffect(() => {
      const token = localStorage.getItem('token');
      if (token) {
          setIsLoggedIn(true);
      }
      setCheckingAuth(false);
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault(); 
    setError('');
    setMensaje('');
    setCargando(true);
    try {
      const res = await fetch('/api/register', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role: 'user' }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Ocurrió un error al registrarse');
      }
      setMensaje('¡Cuenta creada con éxito! Ya puedes iniciar sesión.');
      setEmail('');
      setPassword('');
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  if (checkingAuth) return <div className="min-h-screen bg-neutral-950"></div>;

  //misma protección que en login
  if (isLoggedIn) {
      return <AlreadyLoggedIn />;
  }

  //si no está logueado mostramos el formulario 
  return (
    <main className="min-h-screen relative flex items-center justify-center lg:justify-end p-6 lg:pr-32 overflow-hidden">
      
      {/* wallpaper */}
      <div className="fixed inset-0 z-0 bg-[#0a0a0a]">
          <img 
              src="/images/register2.webp" 
              alt="Ado Register Background" 
              className="w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-black/30"></div>
      </div>

      {/* formulario */}
      <div className="w-full max-w-md bg-black/40 backdrop-blur-xl border border-white/10 p-8 md:p-10 rounded-3xl shadow-[0_0_40px_rgba(0,0,0,0.5)] relative z-10">
        
        <div className="text-center mb-8 drop-shadow-md">
          <h1 className="text-4xl font-black text-white mb-2 tracking-tight drop-shadow-lg">Registrarse</h1>
          <p className="text-neutral-300 font-medium">Únete a la comunidad de la Patrona</p>
        </div>

        {error && <div className="mb-4 p-3 bg-red-900/50 backdrop-blur-md border border-red-500/50 text-red-300 rounded-xl text-sm text-center font-bold shadow-lg">{error}</div>}
        {mensaje && <div className="mb-4 p-3 bg-green-900/50 backdrop-blur-md border border-green-500/50 text-green-300 rounded-xl text-sm text-center font-bold shadow-lg">{mensaje}</div>}
        
        <form onSubmit={handleRegister} className="flex flex-col gap-5">
          <div>
            <label className="block text-xs font-bold text-neutral-300 mb-2 uppercase tracking-widest drop-shadow-md">Email</label>
            <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                className="w-full bg-black/40 backdrop-blur-md border border-white/20 text-white px-5 py-4 rounded-xl focus:outline-none focus:border-purple-400 transition-all placeholder:text-neutral-400 shadow-inner" 
                required 
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-neutral-300 mb-2 uppercase tracking-widest drop-shadow-md">Contraseña</label>
            <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                className="w-full bg-black/40 backdrop-blur-md border border-white/20 text-white px-5 py-4 rounded-xl focus:outline-none focus:border-purple-400 transition-all placeholder:text-neutral-400 shadow-inner" 
                required 
            />
          </div>
          
          <button 
            type="submit" 
            disabled={cargando} 
            className={`w-full text-white font-bold py-4 rounded-xl transition-transform hover:-translate-y-1 shadow-lg mt-4 border border-white/10 ${cargando ? 'bg-neutral-800/80 backdrop-blur-md cursor-not-allowed text-neutral-400' : 'bg-purple-600/80 hover:bg-purple-500/90 backdrop-blur-md'}`}
          >
            {cargando ? 'Creando cuenta...' : 'Crear Cuenta'}
          </button>
        </form>

        {/* links de abajo */}
        <div className="mt-8 text-center border-t border-white/10 pt-6 flex flex-col items-center">
            <p className="text-neutral-300 text-sm mb-6 drop-shadow-md">
                ¿Ya tienes una cuenta? <Link href="/login" className="text-purple-400 hover:text-purple-300 font-bold transition-colors drop-shadow-sm">Inicia sesión</Link>
            </p>
            <Link 
                href="/" 
                className="inline-flex items-center px-6 py-3 rounded-xl bg-black/40 backdrop-blur-md border border-white/10 text-neutral-300 font-bold text-sm hover:bg-white/10 hover:text-white transition-all shadow-lg"
            >
                Volver a la página principal
            </Link>
        </div>
      </div>
    </main>
  );
}
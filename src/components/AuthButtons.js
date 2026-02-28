'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AuthButtons() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false); 
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem('token');
    
    if (token) {
      setIsLoggedIn(true);
      
      try {
        //leer el tipo de token
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.role === 'admin') {
          setIsAdmin(true); 
        }
      } catch (error) {
        console.error("Error al leer el token para el botón VIP:", error);
      }
    }
  }, []);
  
  //función para cerrar sesión tablenado el token y recargando la página
  const handleLogout = () => {
    localStorage.removeItem('token'); 
    window.location.href = '/'; 
  };

  //evitar parpadeos
  if (!mounted) return <div className="w-[140px]"></div>; 

  //si ya esta logueado mostrar botones 
  if (isLoggedIn) {
    return (
      <div className="flex items-center gap-4">
        
        {/* dashboard admin */}
        {isAdmin && (
          <Link 
            href="/admin" 
            className="hover:text-white transition-colors"
          >
            Dashboard admin
          </Link>
        )}

        {/* cerrar sesión */}
        <button 
          onClick={handleLogout}
          className="hover:text-red-400 transition-colors"
        >
          Cerrar sesión
        </button>
      </div>
    );
  }

  //si no esta logueado mostrar botones de login y signup
  return (
    <>
      <Link 
        href="/login" 
        className="hover:text-white transition-colors"
      >
        Ingresar
      </Link>

      <Link 
        href="/signup" 
        className="hover:text-white transition-colors"
      >
        Registrarse
      </Link>
    </>
  );
}
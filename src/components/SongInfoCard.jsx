'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLyrics } from '@/hooks/useLyrics';

// Función auxiliar para formatear duración
const formatDuration = (seconds) => {
  if (!seconds) return '--:--';
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export default function SongInfoCard({ cancion }) {
  // Estados para las pestañas
  const [activeTab, setActiveTab] = useState('INFO'); 
  const [activeSubTab, setActiveSubTab] = useState('ROMAJI'); 
  
  const { lyrics, loading: lyricsLoading } = useLyrics(cancion.id);

  // --- LÓGICA DE COLORES DINÁMICOS ---
  const colorStyles = {
    original: {
      tag: 'bg-blue-900/60 text-blue-200 border-blue-800/50',
      borderActive: 'border-blue-500',
      // Brillo SÚPER sutil: Radio bajado a 3px y Opacidad bajada a 0.3
      textGlow: 'drop-shadow-[0_0_3px_rgba(59,130,246,0.3)]', 
      scrollbar: '[&::-webkit-scrollbar-thumb]:bg-blue-600',
      buttonHover: 'hover:border-blue-500 hover:text-blue-200'
    },
    cover: {
      tag: 'bg-purple-900/60 text-purple-200 border-purple-800/50',
      borderActive: 'border-purple-500',
      textGlow: 'drop-shadow-[0_0_3px_rgba(168,85,247,0.3)]',
      scrollbar: '[&::-webkit-scrollbar-thumb]:bg-purple-600',
      buttonHover: 'hover:border-purple-500 hover:text-purple-200'
    },
    collab: { 
      tag: 'bg-teal-900/60 text-teal-200 border-teal-800/50',
      borderActive: 'border-teal-500',
      textGlow: 'drop-shadow-[0_0_3px_rgba(20,184,166,0.3)]',
      scrollbar: '[&::-webkit-scrollbar-thumb]:bg-teal-600',
      buttonHover: 'hover:border-teal-500 hover:text-teal-200'
    },
  };

  const currentStyle = colorStyles[cancion.tipo_cancion] || colorStyles.original;

  const fechaSegura = cancion.fecha_lanzamiento 
    ? new Date(cancion.fecha_lanzamiento).toISOString().split('T')[0] 
    : 'Desconocida';

  return (
    <div className="w-full h-full bg-neutral-900/40 backdrop-blur-xl border border-neutral-800/50 rounded-3xl p-8 md:p-10 shadow-xl flex flex-col transition-all duration-500">
      
      {/* --- HEADER --- */}
      <div className="flex flex-wrap justify-between items-start mb-6 gap-4 drop-shadow-md">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white break-words drop-shadow-sm">
          {cancion.nombre}
        </h1>
        <span className={`text-xs font-bold px-4 py-2 rounded-full border uppercase tracking-widest mt-2 whitespace-nowrap backdrop-blur-xl ${currentStyle.tag}`}>
          {cancion.tipo_cancion}
        </span>
      </div>

      {/* --- TABS PRINCIPALES --- */}
      <div className="flex gap-8 border-b border-white/10 mb-6">
        <button
          onClick={() => setActiveTab('INFO')}
          className={`pb-3 text-sm font-bold tracking-wider transition-all duration-300 ${
            activeTab === 'INFO'
              ? `text-white border-b-2 ${currentStyle.borderActive} ${currentStyle.textGlow}`
              : 'text-neutral-500 hover:text-neutral-300 border-b-2 border-transparent'
          }`}
        >
          DESCRIPCIÓN
        </button>
        <button
          onClick={() => setActiveTab('LYRICS')}
          className={`pb-3 text-sm font-bold tracking-wider transition-all duration-300 ${
            activeTab === 'LYRICS'
              ? `text-white border-b-2 ${currentStyle.borderActive} ${currentStyle.textGlow}`
              : 'text-neutral-500 hover:text-neutral-300 border-b-2 border-transparent'
          }`}
        >
          LETRA
        </button>
      </div>

      {/* --- CONTENIDO --- */}
      <div className="flex-grow flex flex-col min-h-[350px]"> 
        
        {/* VISTA 1: INFORMACIÓN */}
        {activeTab === 'INFO' && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 flex flex-col h-full">
             {/* Info Cards */}
             <div className="bg-black/40 backdrop-blur-md p-6 rounded-2xl border border-white/10 mb-8 shadow-lg">
                <h3 className="text-xs font-bold text-neutral-400 mb-2 uppercase tracking-wider drop-shadow-md">Álbum</h3>
                <p className="text-2xl text-white font-bold drop-shadow-sm">
                  {cancion.album || "Sencillo"}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 mb-8">
                <div className="bg-black/40 backdrop-blur-md border border-white/10 p-4 rounded-2xl text-center flex flex-col justify-center transition-all hover:border-white/20 hover:-translate-y-1 shadow-lg">
                    <p className="text-[10px] text-neutral-400 uppercase font-bold tracking-widest mb-1">Duración</p>
                    <p className="font-bold text-base xl:text-lg text-white">{formatDuration(cancion.duracion_segundos)} <span className="text-[10px] text-neutral-400 font-normal">min</span></p>
                </div>
                <div className="bg-black/40 backdrop-blur-md border border-white/10 p-4 rounded-2xl text-center flex flex-col justify-center transition-all hover:border-white/20 hover:-translate-y-1 shadow-lg">
                    <p className="text-[10px] text-neutral-400 uppercase font-bold tracking-widest mb-1">Visitas YT</p>
                    <p className="font-bold text-base xl:text-lg text-white tracking-tighter">
                      {new Intl.NumberFormat('es-MX').format(cancion.visitas || 0)}
                    </p>
                </div>
                <div className="bg-black/40 backdrop-blur-md border border-white/10 p-4 rounded-2xl text-center flex flex-col justify-center transition-all hover:border-white/20 hover:-translate-y-1 shadow-lg">
                    <p className="text-[10px] text-neutral-400 uppercase font-bold tracking-widest mb-1">Lanzamiento</p>
                    <p className="font-bold text-base xl:text-lg text-white font-mono tracking-tighter">{fechaSegura}</p>
                </div>
              </div>

              {/* Volver (Botón pequeño y centrado) */}
             <div className="mt-6 flex justify-center">
                <Link 
                  href="/canciones" 
                  className={`px-8 py-3 rounded-xl bg-neutral-900/80 border border-white/10 text-neutral-400 font-bold text-xs uppercase tracking-widest hover:bg-neutral-800 hover:text-white transition-all shadow-md ${currentStyle.buttonHover}`}
                >
                  Volver
                </Link>
             </div>
          </div>
        )}

        {/* VISTA 2: LETRAS */}
        {activeTab === 'LYRICS' && (
          <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-2 duration-300">
            
            {/* Sub-menú de Idiomas (ESTILO TABS SUTILES) */}
            <div className="flex gap-6 mb-4 px-2 border-b border-white/5">
              {['ROMAJI', 'KANJI', 'SPANISH'].map((lang) => (
                <button
                  key={lang}
                  onClick={() => setActiveSubTab(lang)}
                  className={`pb-2 text-xs font-bold tracking-widest transition-all duration-300 ${
                    activeSubTab === lang
                      ? `text-white border-b-2 ${currentStyle.borderActive} ${currentStyle.textGlow}`
                      : 'text-neutral-500 hover:text-neutral-300 border-b-2 border-transparent'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>

            {/* Contenedor de la Letra */}
            <div className={`flex-grow bg-black/40 rounded-2xl border border-white/5 p-6 overflow-hidden relative group`}>
               <div className={`
                  w-full h-[400px] overflow-y-auto pr-4 whitespace-pre-wrap 
                  font-sans text-base leading-loose tracking-wide
                  [&::-webkit-scrollbar]:w-1.5
                  [&::-webkit-scrollbar-track]:bg-black/20
                  [&::-webkit-scrollbar-thumb]:rounded-full
                  ${currentStyle.scrollbar}
               `}>
                  {lyricsLoading ? (
                    <div className="flex items-center justify-center h-full text-neutral-500 animate-pulse">
                      Cargando versos...
                    </div>
                  ) : lyrics && lyrics[activeSubTab] ? (
                    <p className="text-white/90 drop-shadow-sm">
                      {lyrics[activeSubTab]}
                    </p>
                  ) : (
                    <div className="flex items-center justify-center h-full text-neutral-500 italic">
                      No hay letra disponible en este idioma.
                    </div>
                  )}
               </div>
            </div>

             {/* Volver (Botón pequeño y centrado) */}
             <div className="mt-6 flex justify-center">
                <Link 
                  href="/canciones" 
                  className={`px-8 py-3 rounded-xl bg-neutral-900/80 border border-white/10 text-neutral-400 font-bold text-xs uppercase tracking-widest hover:bg-neutral-800 hover:text-white transition-all shadow-md ${currentStyle.buttonHover}`}
                >
                  Volver
                </Link>
             </div>
          </div>
        )}

      </div>
    </div>
  );
}
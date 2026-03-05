'use client';
import { useState } from 'react';
import { useLyrics } from '@/hooks/useLyrics';

export default function LyricsTester({ songId }) {
  // songId debe ser el UUID de una canción que SÍ tenga letras (ej. Backlight)
  const { lyrics, loading } = useLyrics(songId);
  const [activeTab, setActiveTab] = useState('SPANISH'); // Default en español

  if (loading) return <p className="text-purple-400">Cargando letras...</p>;
  if (!lyrics) return <p className="text-red-400">No hay letra pa' esta rola :(</p>;

  return (
    <div className="p-6 bg-neutral-900 rounded-xl border border-neutral-800 max-w-2xl mx-auto mt-10">
      {/* Tabs para cambiar idioma */}
      <div className="flex gap-4 mb-6 border-b border-neutral-700 pb-2">
        {['KANJI', 'ROMAJI', 'SPANISH'].map((type) => (
          <button
            key={type}
            onClick={() => setActiveTab(type)}
            className={`pb-2 text-sm font-bold transition-colors ${
              activeTab === type 
                ? 'text-purple-400 border-b-2 border-purple-400' 
                : 'text-neutral-500 hover:text-white'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* IMPORTANTE: `whitespace-pre-wrap` es la clase de Tailwind 
         que hace que los saltos de línea de la base de datos se vean bien.
      */}
      <div className="whitespace-pre-wrap text-neutral-300 font-mono leading-relaxed h-96 overflow-y-auto pr-2 custom-scrollbar">
        {lyrics[activeTab] || 'No disponible en este idioma'}
      </div>
    </div>
  );
}
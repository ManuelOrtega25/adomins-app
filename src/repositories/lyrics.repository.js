import supabase from '@/utils/supabase/client';

const getLyricsBySongId = async (songId) => {  
  // Hacemos el fetch a la tabla 'lyrics'
  const { data, error } = await supabase
    .from('lyrics')
    .select('*')
    .eq('cancion_id', songId);

  if (error) {
    console.error('Error fetching lyrics:', error);
    return null;
  }

  // TRUCAZO DE PAPU: 🧠
  // La base de datos te devuelve un array de 3 filas (una por tipo).
  // Para el Frontend, es mejor transformar eso en un OBJETO fácil de usar.
  // Convertimos: [{tipo: 'KANJI', contenido: '...'}, ...] 
  // A esto: { KANJI: '...', ROMAJI: '...', SPANISH: '...' }
  
  const lyricsMap = {
    KANJI: null,
    ROMAJI: null,
    SPANISH: null
  };

  data.forEach(item => {
    if (lyricsMap.hasOwnProperty(item.tipo)) {
      lyricsMap[item.tipo] = item.contenido;
    }
  });

  return lyricsMap;
};

export default {
  getLyricsBySongId
};
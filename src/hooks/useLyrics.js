'use client';
import { useState, useEffect } from 'react';
import lyricsRepo from '@/repositories/lyrics.repository';

export function useLyrics(songId) {
  const [lyrics, setLyrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!songId) return;

    const fetchLyrics = async () => {
      setLoading(true);
      try {
        const data = await lyricsRepo.getLyricsBySongId(songId);
        setLyrics(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchLyrics();
  }, [songId]); // Se re-ejecuta si cambias de canción

  return { lyrics, loading };
}
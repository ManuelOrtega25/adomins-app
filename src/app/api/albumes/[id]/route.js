import { NextResponse } from 'next/server';
import albumesRepo from '@/repositories/albumes.repository';

export async function GET(request, { params }) {
  try {
    // extraer el ID de la URL
    const { id } = await params;

    const album = await albumesRepo.getByIdWithSongs(id);

    if (!album) {
      return NextResponse.json({ error: 'Álbum no encontrado' }, { status: 404 });
    }

    return NextResponse.json(album, { status: 200 });
  } catch (error) {
    console.error('Error en API de álbum individual:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
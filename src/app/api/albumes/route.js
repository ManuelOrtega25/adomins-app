import { NextResponse } from 'next/server';
import albumesRepo from '@/repositories/albumes.repository'; 

export async function GET() {
  try {
    const albumes = await albumesRepo.getAll();
    return NextResponse.json(albumes, { status: 200 });
  } catch (error) {
    console.error('Error en API de álbumes:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor al obtener álbumes' },
      { status: 500 }
    );
  }
}
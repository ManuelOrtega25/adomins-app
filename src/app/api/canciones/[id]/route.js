import { NextResponse } from 'next/server';
import { pool } from '@/lib/db'; 
import { verifyToken } from '@/lib/auth'; 

//get publico una sola cancion
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const result = await pool.query('SELECT * FROM canciones WHERE id = $1', [id]);
    
    if (result.rowCount === 0) {
        return NextResponse.json({ error: 'Canción no encontrada' }, { status: 404 });
    }
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener la canción' }, { status: 500 });
  }
}

//delete protegido solo admins
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) return NextResponse.json({ error: 'Falta token' }, { status: 401 });
    const token = authHeader.split(' ')[1];
    let payload;
    try { payload = verifyToken(token); } catch (error) { return NextResponse.json({ error: 'Token inválido' }, { status: 401 }); }
    if (payload.role !== 'admin') return NextResponse.json({ error: 'No autorizado prro' }, { status: 403 });

    const result = await pool.query('DELETE FROM canciones WHERE id = $1 RETURNING *', [id]);
    if (result.rowCount === 0) return NextResponse.json({ error: 'No existe' }, { status: 404 });
    return NextResponse.json({ message: 'Eliminada' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}

//put protegido solo admins
export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    
    //cadenero para verificar que es admin
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) return NextResponse.json({ error: 'Falta token' }, { status: 401 });
    const token = authHeader.split(' ')[1];
    let payload;
    try { payload = verifyToken(token); } catch (error) { return NextResponse.json({ error: 'Token inválido' }, { status: 401 }); }
    if (payload.role !== 'admin') return NextResponse.json({ error: 'No autorizado papulocnhe cfffffff' }, { status: 403 });

    const data = await request.json();
    
    //actualizar cancion en la base de datos anti sql injection
    const result = await pool.query(
      `UPDATE canciones 
       SET nombre = $1, youtube_id = $2, tipo_cancion = $3, album = $4, duracion_segundos = $5, visitas = $6, imagen_url = $7, fecha_lanzamiento = $8
       WHERE id = $9 RETURNING *`,
      [
        data.nombre, data.youtube_id, data.tipo_cancion, data.album || null, 
        data.duracion_segundos, data.visitas, data.imagen_url, data.fecha_lanzamiento, id
      ]
    );

    if (result.rowCount === 0) return NextResponse.json({ error: 'No existe' }, { status: 404 });
    return NextResponse.json(result.rows[0], { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Error al actualizar' }, { status: 500 });
  }
}
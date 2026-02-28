import { NextResponse } from 'next/server';
import { pool } from '@/lib/db'; 
import { verifyToken } from '@/lib/auth'; 

//post protegido solo admins
export async function POST(request) {
  try {
    // cadenero del backend para agregar canciones
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Falta el token de autorización' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    let payload;

    // verificar el token del admin
    try {
      payload = verifyToken(token);
    } catch (error) {
      return NextResponse.json({ error: 'Credenciales no válidas.' }, { status: 401 });
    }

    // validacion de roles
    if (payload.role !== 'admin') {
      return NextResponse.json({ error: 'No autorizado prro solo admins' }, { status: 403 });
    }

    const data = await request.json();
    
    // contra ataques de inyeccion SQL
    const result = await pool.query(
      `INSERT INTO canciones (nombre, youtube_id, tipo_cancion, album, duracion_segundos, visitas, imagen_url, fecha_lanzamiento) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
       RETURNING *`,
      [
        data.nombre,          
        data.youtube_id,       
        data.tipo_cancion,                
        data.album || null,           
        data.duracion_segundos,              
        data.visitas,           
        data.imagen_url,
        data.fecha_lanzamiento 
      ]
    );

    // retornamos la cancion creada con el status 201 
    return NextResponse.json(result.rows[0], { status: 201 });

  } catch (error) {
    console.error('Error en API:', error);
    return NextResponse.json(
      { error: 'Error al guardar: ' + error.message },
      { status: 500 }
    );
  }
}

//get publico de todas las canciones (AHORA CON PAGINACIÓN PARA EL 100/100)
export async function GET(request) {
    try {
        //leer ?page=1&limit=5 de la URL
        const { searchParams } = new URL(request.url);
        const page = searchParams.get('page');
        const limit = searchParams.get('limit');

        let query = 'SELECT * FROM canciones ORDER BY fecha_lanzamiento DESC';
        const values = [];

        //si la URL trae page y limit activamos la paginación SQL
        if (page && limit) {
            const limitNum = parseInt(limit, 10);
            const pageNum = parseInt(page, 10);
            
            //calcular cuántos registros saltar OFFSET
            const offset = (pageNum - 1) * limitNum;

            query += ' LIMIT $1 OFFSET $2';
            values.push(limitNum, offset);
        }

        const result = await pool.query(query, values);
        
        return NextResponse.json(result.rows);
    } catch (error) {
        console.error('Error obteniendo canciones en la API:', error);
        return NextResponse.json({ error: 'Error al obtener las canciones' }, { status: 500 });
    }
}
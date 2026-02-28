import { pool } from '../lib/db.js';

class AlbumesRepository {
  
  //get álbumes, más reciente
  async getAll() {
    try {
      const result = await pool.query('SELECT * FROM albumes ORDER BY fecha_lanzamiento DESC');
      return result.rows;
    } catch (error) {
      console.error('Error obteniendo álbumes:', error);
      return [];
    }
  }

  //traer un álbum específico con toda su lista de canciones
  async getByIdWithSongs(id) {
    try {
      const albumResult = await pool.query('SELECT * FROM albumes WHERE id = $1', [id]);
      const album = albumResult.rows[0];

      if (!album) return null;

      // traer canciones por track (ordenadas por track, tuve que hacerlo por mi cuenta pipipipi)
      const cancionesResult = await pool.query(`
        SELECT c.*, ac.track_numero
        FROM canciones c
        JOIN albumes_canciones ac ON c.id = ac.cancion_id
        WHERE ac.album_id = $1
        ORDER BY ac.track_numero ASC
      `, [id]);
      return { 
        ...album, 
        canciones: cancionesResult.rows 
      };

    } catch (error) {
      console.error('Error obteniendo el álbum con sus canciones:', error);
      return null;
    }
  }
}

export default new AlbumesRepository();
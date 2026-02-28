'use client';
import { useState, useEffect } from 'react';

// hook para gestionar las canciones públicas, accesible para todos los usuarios
export function usePublicCanciones() {
    const [cancionesOriginales, setCancionesOriginales] = useState([]); 
    const [cancionesFiltradas, setCancionesFiltradas] = useState([]);   
    const [loading, setLoading] = useState(true);

    //filtros
    const [busqueda, setBusqueda] = useState('');
    const [filtroTipo, setFiltroTipo] = useState('todos');
    
    //las más populares por defecto
    const [orden, setOrden] = useState('populares');

    //paginación pública
    const [paginaActual, setPaginaActual] = useState(1);
    const cancionesPorPagina = 30; 

    const fetchCanciones = async () => {
        try {
            //get de la api
            const res = await fetch('/api/canciones');
            const data = await res.json();
            if (Array.isArray(data)) {
                setCancionesOriginales(data);
            }
        } catch (error) {
            console.error('Error al cargar canciones:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCanciones();
    }, []);

    //motor de búsqueda, filtrado y ordenamiento
    useEffect(() => {
        let resultado = [...cancionesOriginales];

        //barrita de búsqueda
        if (busqueda) {
            const termino = busqueda.toLowerCase();
            resultado = resultado.filter(c => 
                c.nombre.toLowerCase().includes(termino) || 
                (c.album && c.album.toLowerCase().includes(termino))
            );
        }

        //tipo
        if (filtroTipo !== 'todos') {
            resultado = resultado.filter(c => c.tipo_cancion === filtroTipo);
        }

        //ordenamiento
        resultado.sort((a, b) => {
            if (orden === 'populares') {
                //como me di la tarea de recolectar las visitas de TODAS las canciones, entonces ordeno por visitas
                return (b.visitas || 0) - (a.visitas || 0); 
            } else if (orden === 'recientes') {
                //más recientes
                return new Date(b.fecha_lanzamiento) - new Date(a.fecha_lanzamiento);
            } else if (orden === 'antiguas') {
                //más antiguas
                return new Date(a.fecha_lanzamiento) - new Date(b.fecha_lanzamiento);
            }
            return 0;
        });

        setCancionesFiltradas(resultado);
        setPaginaActual(1); 
    }, [busqueda, filtroTipo, orden, cancionesOriginales]);

    const totalPaginas = Math.ceil(cancionesFiltradas.length / cancionesPorPagina);
    
    const indiceFinal = paginaActual * cancionesPorPagina;
    const indiceInicial = indiceFinal - cancionesPorPagina;
    const cancionesPaginadas = cancionesFiltradas.slice(indiceInicial, indiceFinal);
    
    return { 
        canciones: cancionesPaginadas, 
        loading, 
        busqueda, setBusqueda, 
        filtroTipo, setFiltroTipo,
        orden, setOrden, 
        paginaActual, setPaginaActual, 
        totalPaginas,
        totalResultados: cancionesFiltradas.length 
    };
}
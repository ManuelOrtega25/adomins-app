'use client';
import { useState, useEffect } from 'react';

// hook para gestionar las canciones solo para admins, es privadoooooooooooooooooooooo
export function useCanciones() {
    const [cancionesOriginales, setCancionesOriginales] = useState([]); 
    const [cancionesFiltradas, setCancionesFiltradas] = useState([]);   
    const [loading, setLoading] = useState(true);

    //filtros
    const [busqueda, setBusqueda] = useState('');
    const [filtroTipo, setFiltroTipo] = useState('todos');

    const [paginaActual, setPaginaActual] = useState(1);
    const cancionesPorPagina = 21; 

    const fetchCanciones = async () => {
        try {
            const res = await fetch('/api/canciones');
            const data = await res.json();
            if (Array.isArray(data)) {
                setCancionesOriginales(data);
                setCancionesFiltradas(data);
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

    //motor de búsqueda y filtrado 
    useEffect(() => {
        let resultado = [...cancionesOriginales];

        if (busqueda) {
            const termino = busqueda.toLowerCase();
            resultado = resultado.filter(c => 
                c.nombre.toLowerCase().includes(termino) || 
                (c.album && c.album.toLowerCase().includes(termino))
            );
        }

        if (filtroTipo !== 'todos') {
            resultado = resultado.filter(c => c.tipo_cancion === filtroTipo);
        }

        setCancionesFiltradas(resultado);
        setPaginaActual(1); 
    }, [busqueda, filtroTipo, cancionesOriginales]);

    const totalPaginas = Math.ceil(cancionesFiltradas.length / cancionesPorPagina);
    
    // solo 21 canciones por página
    const indiceFinal = paginaActual * cancionesPorPagina;
    const indiceInicial = indiceFinal - cancionesPorPagina;
    const cancionesPaginadas = cancionesFiltradas.slice(indiceInicial, indiceFinal);

    const eliminarCancion = async (id) => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`/api/canciones/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                setCancionesOriginales(prev => prev.filter(c => c.id !== id));
                return true;
            }
            return false;
        } catch (error) { return false; }
    };
    
    return { 
        canciones: cancionesPaginadas, 
        loading, 
        eliminarCancion,
        busqueda, setBusqueda, 
        filtroTipo, setFiltroTipo,
        paginaActual, setPaginaActual, 
        totalPaginas                   
    };
}
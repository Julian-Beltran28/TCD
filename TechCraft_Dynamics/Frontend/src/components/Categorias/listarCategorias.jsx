// Importaciones necesarias
import { Link, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios'; 
import { useAuth } from '../../context/AuthContext';
// Css
import '../../css/Categorias/ListarCategorias.css';

export default function ListarCategorias() {
    const navigate = useNavigate();
    const [categoriasLista, setCategoriasLista] = useState([]);
    const [busqueda, setBusqueda] = useState("");
    const [pagina, setPagina] = useState(1);
    const [total, setTotal] = useState(0);
    const limite = 10;
    const { user } = useAuth();

    // Conexion Local o con el Railway
    const API_URL = window.location.hostname === 'localhost'
        ? 'http://localhost:4000'
        : 'https://tcd-production.up.railway.app';

    // Muestra todas las categorias existentes (paginadas)
    const getCategorias = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/categorias?page=${pagina}&limit=${limite}`);
            const payload = res.data;

            // Aceptamos varias formas de respuesta:
            // 1) payload === array (backend devuelve directamente el array)
            // 2) payload.data === array (forma común)
            // 3) payload.categorias || payload.categoriasLista (nombres posibles)
            let items = [];
            if (Array.isArray(payload)) {
                items = payload;
            } else if (Array.isArray(payload.data)) {
                items = payload.data;
            } else if (Array.isArray(payload.categorias)) {
                items = payload.categorias;
            } else if (Array.isArray(payload.categoriasLista)) {
                items = payload.categoriasLista;
            } else if (Array.isArray(payload.items)) {
                items = payload.items;
            } else {
                // Si no hay un arreglo, intenta buscar dentro de payload.data?.data u otras anidaciones
                const maybe = payload?.data?.data || payload?.result || [];
                items = Array.isArray(maybe) ? maybe : [];
            }

            // Si el backend provee total, úsalo; si no, usa el length como fallback.
            const totalFromBackend = Number.isFinite(Number(payload?.total)) ? Number(payload.total) : null;
            const computedTotal = totalFromBackend !== null ? totalFromBackend : items.length;

            setCategoriasLista(items || []);
            setTotal(computedTotal || 0);
        } catch (error) {
            console.error("Error al obtener categorías:", error);
            Swal.fire('Error', 'No se pudieron cargar las categorías', 'error');
            setCategoriasLista([]);
            setTotal(0);
        }
    };

    // Llamamos al backend cuando cambie la página
    useEffect(() => {
        getCategorias();

    }, [pagina]); // NOTA: no incluimos `busqueda` aquí, el buscador es local sobre la página cargada

    // Si total cambia y la página actual queda fuera de rango, la ajustamos
    useEffect(() => {
        const maxPages = Math.max(1, Math.ceil((total || 0) / limite));
        if (pagina > maxPages) {
            setPagina(maxPages);
        }
        if (pagina < 1) {
            setPagina(1);
        }
        
    }, [total]);

    // Funcion para eliminar categorias
    const deleteCate = (id) => {
        Swal.fire({
            title: "¿Estás segur@ de eliminar esta categoría?",
            text: "¡No podrás deshacer esta acción!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Eliminar",
            cancelButtonText: "Cancelar",
            confirmButtonColor: '#2fa779',
            cancelButtonColor: '#2fa779'
        }).then((result) => {
            if (result.isConfirmed){
                axios.delete(`${API_URL}/api/categorias/delete/${id}`)
                    .then(() =>{
                        // si eliminas el último elemento de la última página, la página puede quedar vacía;
                        // mejor recargar y dejar que el effect de total/pagina ajuste la página.
                        getCategorias();
                        Swal.fire("Eliminado", "Categoría eliminada exitosamente", "success");
                    })
                    .catch(err => Swal.fire('Error al eliminar', err.message, 'error'));
            }
        });
    };

    // Search o Buscador (local, sobre la página cargada)
    const categoriasFiltradas = (categoriasLista || []).filter((cate) => 
        cate?.Nombre_categoria?.toLowerCase().includes((busqueda || "").toLowerCase())
    );

    const maxPagesDisplay = Math.max(1, Math.ceil((total || categoriasLista.length) / limite));

    return(
        <>
            <h1 className="titulo">CATEGORÍAS</h1>  

            <main className="contenedor-principal">

                {/* Boton para agregar una categoria nueva */}
                <Link to="/admin/agregar/categoria">
                    <button className="btn-outline-success">+ Nueva Categoría</button>
                </Link>

                {/* Input del buscador */}
                <div className="ms-auto" style={{ marginTop: 12, marginBottom: 12 }}>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Buscar..."
                        value={busqueda}
                        onChange={e => setBusqueda(e.target.value)}
                    />
                </div>
                    
                <section className="Listado">

                    {/* Tabla de categorias */}
                    <table className="L-Categorias">
                        <thead>
                            <tr>
                                <th>Imágenes</th>
                                <th>Nombres</th>
                                <th>SubCategorías</th>
                                <th>Editar</th>
                                {user?.rol === "admin" && <th>Eliminar</th>}
                            </tr>
                        </thead>

                        <tbody>
                            {/* Ciclo de las categorias */}
                            {categoriasFiltradas.map((cat) => (
                                <tr key={cat.id}>
                                    <td className="td">
                                        <img 
                                            src={`${API_URL}/uploads/${cat.Imagen_categoria}`}
                                            alt={cat.Nombre_categoria} 
                                            className="Imagen" 
                                        />
                                    </td>
                                    <td>{cat.Nombre_categoria}</td>

                                    {/* Seleccion de la subcategoria */}
                                    <td>
                                        <Link to={`/admin/categoria/${cat.id}`} className="L-subcategoria">
                                            {cat.Nombre_categoria}
                                        </Link>
                                    </td>

                                    <td>
                                        <button 
                                            className="btn-outline-warning"
                                            onClick={() => navigate(`/admin/editar/categoria/${cat.id}`)}
                                            title="Editar categoría"
                                        >
                                            <i className='bx bx-edit'></i>
                                        </button>
                                    </td>

                                    {user?.rol === "admin" && (
                                        <td>
                                            <button 
                                                className="btn-outline-danger"
                                                onClick={() => deleteCate(cat.id)}
                                                title="Eliminar categoría"
                                            >
                                                <i className='bx bx-trash'></i>
                                            </button>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Paginación */}
                    <div className="usuarios-paginacion d-flex justify-content-between mt-3">
                        <button
                            className="btn-outline-primary"
                            disabled={pagina === 1}
                            onClick={() => setPagina(prev => Math.max(1, prev - 1))}
                        >
                            ← Anterior
                        </button>

                        <span>
                            Página {pagina} de {maxPagesDisplay}
                        </span>

                        <button
                            className="btn-outline-primary"
                            disabled={pagina >= maxPagesDisplay || maxPagesDisplay === 0}
                            onClick={() => setPagina(prev => Math.min(maxPagesDisplay, prev + 1))}
                        >
                            Siguiente →
                        </button>
                    </div>

                </section> 

                {/* Regresar */}
                <div className='regresar'>
                    <button className="btn-outline-secondary" onClick={() => navigate('/admin/Categorias')}>
                        Regresar
                    </button>
                </div>

            </main>
        </>
    );
}

// src/components/admin/Subcategoria.jsx
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import '../../css/Categorias/Subcategorias.css';

export default function Subcategoria() {
    const { idCategoria } = useParams();
    const [subcategorias, setSubcategorias] = useState([]);
    const [productos, setProductos] = useState([]);
    const [subSeleccionada, setSubSeleccionada] = useState(null);
    const [categoria, setCategoria] = useState(null);
    const navigate = useNavigate();

    // Subcategorías
    const getSubCategorias = useCallback(async () => {
        try {
            const res = await axios.get('http://localhost:3000/api/subcategorias');
            const filtradas = res.data.filter(sub => sub.id_Categorias == idCategoria);
            setSubcategorias(filtradas);
        } catch (error) {
            console.error("❌ Error al obtener subcategorías:", error);
        }
    }, [idCategoria]);

    // Categoría
    const getCategoria = useCallback(async () => {
        try {
            const res = await axios.get(`http://localhost:3000/api/categorias/${idCategoria}`);
            setCategoria(res.data);
        } catch (error) {
            console.error("❌ Error al obtener la categoría:", error);
        }
    }, [idCategoria]);

    // Productos (nuevo -> un solo endpoint)
    const fetchProductos = useCallback(async () => {
        try {
            const res = await axios.get("http://localhost:3000/api/productos");
            setProductos(res.data.filter(p => p.activo !== 0));
        } catch (error) {
            console.error('❌ Error al obtener productos:', error);
        }
    }, []);

    useEffect(() => {
        getSubCategorias();
        getCategoria();
        fetchProductos();
    }, [getSubCategorias, getCategoria, fetchProductos]);

    // Eliminar subcategoría
    const deleteSub = (id) => {
        Swal.fire({
            title: "¿Estás segur@ de eliminar esta subcategoría?",
            text: "¡No podrás deshacer esta acción!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Eliminar",
            cancelButtonText: "Cancelar",
        }).then((result) => {
            if (result.isConfirmed) {
                axios.delete(`http://localhost:3000/api/subcategorias/delete/${id}`)
                    .then(() => {
                        getSubCategorias();
                        Swal.fire("✅ Eliminado", "Subcategoría eliminada con éxito", "success");
                    })
                    .catch(err => Swal.fire('❌ Error', err.message, 'error'));
            }
        });
    };

    // Eliminar producto (soft delete en backend)
    const deleteProducto = (id) => {
        Swal.fire({
            title: "¿Estás segur@ de eliminar este producto?",
            text: "¡No podrás deshacer esta acción!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Eliminar",
            cancelButtonText: "Cancelar",
        }).then((result) => {
            if (result.isConfirmed) {
                axios.delete(`http://localhost:3000/api/productos/${id}`)
                    .then(() => {
                        fetchProductos();
                        Swal.fire("✅ Eliminado", "Producto eliminado con éxito", "success");
                    })
                    .catch(err => Swal.fire('❌ Error', err.message, 'error'));
            }
        });
    };

    // Filtrar productos por subcategoría
    const productosFiltrados = subSeleccionada
        ? productos.filter(p => p.id_SubCategorias === subSeleccionada.id)
        : [];

    return (
        <>
            <h1 className="titulo">SUBCATEGORÍAS</h1>
            <main className="contenedor-principal">

                <Link to="/admin/agregar/subcategoria">
                    <button className="A-Subcategorias">Agregar subcategoría nueva</button>
                </Link>

                <div style={{ display: "flex" }}>
                    {/* Panel de subcategorías */}
                    <div className="C-SubCategorias">
                        <h3 className="Titulo-S">
                            {categoria ? `SUBCATEGORÍAS DE ${categoria.Nombre_categoria.toUpperCase()}` : "SUBCATEGORÍAS"}
                        </h3>

                        {subcategorias.map(sub => (
                            <div
                                className="B-Subcategorias"
                                key={sub.id}
                                onClick={() => setSubSeleccionada(sub)}
                            >
                                <span>{sub.Nombre_Subcategoria}</span>

                                <div className="botones-sub" onClick={(e) => e.stopPropagation()}>
                                    <Link to={`/admin/editar/subcategoria/${sub.id}`}>
                                        <button className="btn btn-success btn-sm">
                                            <i className='bx bx-edit'></i>
                                        </button>
                                    </Link>
                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            deleteSub(sub.id);
                                        }}
                                    >
                                        <i className='bx bx-trash'></i>
                                    </button>
                                </div>
                            </div>
                        ))}

                        <button onClick={() => navigate('/admin/Categorias/Listado')} className="Regresar">
                            Regresar
                        </button>
                    </div>

                    {/* Panel de productos */}
                    <div className="Productos col-12 col-md-10 col-lg-8">
                        {subSeleccionada && (
                            <Link to={`/admin/agregar/producto?id=${subSeleccionada.id}&categoria=${idCategoria}`}>
                                <button className="A-Subcategorias">Agregar producto nuevo</button>
                            </Link>
                        )}

                        <h3 className="Titulo-P">PRODUCTOS</h3>

                        {subSeleccionada ? (
                            <div className="Apartado-P" style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
                                {productosFiltrados.map(p => (
                                    <div key={p.id} className="card-producto">
                                        <img
                                            src={`http://localhost:3000/uploads/${p.Imagen_producto}`}
                                            alt={p.Nombre_producto}
                                            className="img-producto"
                                        />
                                        <p className="nombre-producto">{p.Nombre_producto}</p>

                                        {p.tipo_producto === "paquete" ? (
                                            <p className="precio-producto">
                                                ${Number(p.precio).toLocaleString()}
                                            </p>
                                        ) : (
                                            <>
                                                {p.Kilogramos && (
                                                    <p className="precio-producto">
                                                        Kilos: {p.Kilogramos} — ${Number(p.Precio_kilogramo).toLocaleString()} /kg
                                                    </p>
                                                )}
                                                {p.Libras && (
                                                    <p className="precio-producto">
                                                        Libras: {p.Libras} — ${Number(p.Precio_libras).toLocaleString()} /lb
                                                    </p>
                                                )}
                                            </>
                                        )}

                                        <div className="botones-pro">
                                            <Link to={`/admin/editar/producto/${p.id}?categoria=${idCategoria}&tipo=${p.tipo_producto}`}>
                                                <button className="btn btn-success btn-sm">
                                                    <i className='bx bx-edit'></i>
                                                </button>
                                            </Link>
                                            <button
                                                className="btn btn-danger btn-sm"
                                                onClick={() => deleteProducto(p.id)}
                                            >
                                                <i className='bx bx-trash'></i>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="Subtitulo">Selecciona una subcategoría</p>
                        )}
                    </div>
                </div>
            </main>
        </>
    );
}

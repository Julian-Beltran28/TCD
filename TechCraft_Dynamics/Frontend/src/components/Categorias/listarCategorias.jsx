// importaciones de link, etc..
import { Link, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios'; 

// importaciones de css
import '../../css/Categorias/ListarCategorias.css';


export default function ListarCategorias(){

    // Uso de las constantes 
    const navigate = useNavigate();
    const [categoriasLista, setCategoriasLista] = useState([]);
    const [busqueda, setBusqueda] = useState("");

    // Captura la informacion
    useEffect(() => {
        getCategorias();

    }, []);
    
    // LLamado al bases de datos para en listar mas adelante
    const getCategorias = async () => {
    try {
        const res = await axios.get('http://localhost:3000/api/categorias');
        setCategoriasLista(res.data);
        } catch (error) {
        console.error("Error al obtener categorías:", error);
        }
    };

    // Alerta al borrar categoria
    const deleteCate = (id) => {
        Swal.fire({
            title: "¿Estas segur@ de eliminar esta categoría?",
            text: "!No podras deshacer esta accion!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Eliminar",
            cancelButtonText: "Cancelar",
        }).then((result) => {
            if (result.isConfirmed){
                axios.delete(`http://localhost:3000/api/categorias/delete/${id}`)
                .then(() =>{
                    getCategorias();
                    Swal.fire("Eliminado", "Categoria eliminada con exito", "success");
                })
                .catch(err => Swal.fire('Error al eliminar', err.message, 'error'));
            }
        });
    };

    // Buscador, filtra lo que uno busca en la tabla en base a el nombre.
    const categoriasFiltradas = categoriasLista.filter((cate) => 
        cate.Nombre_categoria && cate.Nombre_categoria.toLowerCase().includes(busqueda.toLowerCase())
    );

    return(
        <>
            <h1 className="titulo">CATEGORíAS</h1>  

            <main className="contenedor-principal">
                {/* Boton para ir a agregar categorias */}
                    <Link to="/admin/agregar/categoria" >
                        <button className="A-categorias">Agregar categoria nueva</button>
                    </Link>

                    <div className="ms-auto">
                        <input
                            type="text"
                            className="form-control"
                            id="Buscar"
                            placeholder="Buscar..."
                            value={busqueda}
                            onChange={e => setBusqueda(e.target.value)}
                        />
                    </div>
                    
                <section  className="Listado">

                    {/* Proximo a cambiar a map  */}
                    {/* De momento esta visual */}
                    <table className="L-Categorias">
                        <thead>
                            <tr>
                                <th>Imagenes</th>
                                <th>Nombres</th>
                                <th>SubCategorías</th>
                                <th>Editar</th>
                                <th>Eliminar</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* Aca se hace el tipo bucle para traer todas las categorias */}
                            {categoriasFiltradas.map((cat)=>
                            // La llave va ser por su id
                            <tr key={cat.id}>
                                <td className="td"><img src={`http://localhost:3000/uploads/${cat.Imagen_categoria}`}
                                    alt={cat.Nombre_categoria} width="50%" className="Imagen" /></td>
                                <td>{cat.Nombre_categoria}</td>
                                <td>
                                    <Link to={`/admin/categoria/${cat.id}`} className="L-subcategoria">{cat.Nombre_categoria}</Link>
                                </td>
                                <td>
                                    <Link to={`/admin/editar/categoria/${cat.id}`}>
                                        <button className="btn btn-success btn-sm d-flex justify-content-center align-items-center mx-auto">
                                            <i className='bx bx-edit'></i>
                                        </button>
                                    </Link>
                                </td>
                                <td>
                                    <button className="btn btn-danger btn-sm d-flex justify-content-center align-items-center mx-auto" onClick={() => deleteCate(cat.id)}>
                                        <i className='bx bx-trash'></i>
                                    </button>
                                </td>        
                            </tr>  
                            )}
                        </tbody>
                    </table>
                </section>  
                {/* Boton para regresar a la pagina anterior */}
                <div className='regresar'>
                    <button className="Regresar" onClick={() => navigate('/Categorias')}>Regresar</button>
                </div>              
            </main>
        </>
    );
}
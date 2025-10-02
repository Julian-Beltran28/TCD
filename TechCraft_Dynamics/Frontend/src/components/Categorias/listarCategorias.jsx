import { Link, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios'; 
import { useAuth } from '../../context/AuthContext';

import '../../css/Categorias/ListarCategorias.css';

export default function ListarCategorias() {
  const navigate = useNavigate();
  const [categoriasLista, setCategoriasLista] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const { user } = useAuth();

  const API_URL = 'https://tcd-production.up.railway.app';

  const getCategorias = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/categorias`);
      setCategoriasLista(res.data);
    } catch (error) {
      console.error("Error al obtener categorías:", error);
      Swal.fire('Error', 'No se pudieron cargar las categorías', 'error');
    }
  };

  useEffect(() => {
    getCategorias();
  }, []);

  const deleteCate = (id) => {
    Swal.fire({
      title: "¿Estás segur@ de eliminar esta categoría?",
      text: "¡No podrás deshacer esta acción!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed){
        axios.delete(`${API_URL}/api/categorias/delete/${id}`)
          .then(() =>{
            getCategorias();
            Swal.fire("Eliminado", "Categoría eliminada con éxito", "success");
          })
          .catch(err => Swal.fire('Error al eliminar', err.message, 'error'));
      }
    });
  };

  const categoriasFiltradas = categoriasLista.filter((cate) => 
    cate.Nombre_categoria && cate.Nombre_categoria.toLowerCase().includes(busqueda.toLowerCase())
  );

  return(
    <>
      <h1 className="titulo">CATEGORÍAS</h1>  

      <main className="contenedor-principal">
        <Link to="/admin/agregar/categoria">
          <button className="btn-outline-success">+ Nueva Categoría</button>
        </Link>

        <div className="ms-auto">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar..."
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
          />
        </div>
            
        <section className="Listado">
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
              {categoriasFiltradas.map((cat) =>
                <tr key={cat.id}>
                  <td className="td">
                    <img 
                      src={`${API_URL}/uploads/${cat.Imagen_categoria}`}
                      alt={cat.Nombre_categoria} 
                      className="Imagen" 
                    />
                  </td>
                  <td>{cat.Nombre_categoria}</td>
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
              )}
            </tbody>
          </table>
        </section>  

        <div className='regresar'>
          <button className="btn-outline-secondary" onClick={() => navigate('/admin/Categorias')}>
            Regresar
          </button>
        </div>              
      </main>
    </>
  );
}

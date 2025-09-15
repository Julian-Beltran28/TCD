import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

export default function EditarSubcategorias({id}){
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false); 
    const [categorias, setCategorias] = useState([]);

    // EStado de los datos para formularios.
        const [subcategoria, setSubCategoria] = useState({
            Nombre_Subcategoria: '',
            Descripcion: '',
            id_Categorias: ''
        })
        // Actualizamos datos del formulario.
        const handleChange = (e) => {
            setSubCategoria({
                ...subcategoria,
                [e.target.name]: e.target.value
            });
        };

            // Definir URL base API una sola vez
  const API_URL = window.location.hostname === 'localhost'
    ? 'http://localhost:4000'
    : 'https://tcd-production.up.railway.app';
    
        // Cargamos los datos cuando se abre el formulario.
        useEffect(() => {
        const obtenerDatos = async () => {
            try {
                const [resSubcategoria, resCategorias] = await Promise.all([
                    axios.get(`http://localhost:3000/api/subcategorias/${id}`),
                    axios.get(`http://localhost:3000/api/categorias`)
                ]);
                setSubCategoria({
                    ...resSubcategoria.data,
                    id_Categorias: String(resSubcategoria.data.id_Categorias)
                });
                setCategorias(resCategorias.data);
                } catch (error) {
                    console.error("Error al obtener datos: ", error);
                }
            };
            obtenerDatos();
        }, [id]);

    const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const { Nombre_Subcategoria, id_Categorias, Descripcion } = subcategoria;

    if (!Nombre_Subcategoria.trim() || !id_Categorias) {
        setIsSubmitting(false);
        return Swal.fire('Campo obligatorio', 'El nombre de la subcategoría y el tipo son requeridos.', 'warning');
    }

    try {
        await axios.put(`http://localhost:3000/api/subcategorias/${id}`, {
            Nombre_Subcategoria,
            Descripcion,
            id_Categorias
        });

        Swal.fire('Actualizado', 'La subcategoría se actualizó correctamente.', 'success')
            .then(() => navigate(-1));
    } catch (error) {
        console.error("Error al actualizar la subcategoría: ", error);
        await Swal.fire('Error', 'No se pudo actualizar la subcategoría.', 'error');
    } finally {
        setIsSubmitting(false);
    }
};
    // funcion para la alerta de cancelar
    const handleCancelar = (e) => {
                        e.preventDefault();
                        Swal.fire({
                        title: 'Cancelado.',
                        text: 'El proceso se canceló con éxito.',
                        icon: 'warning',
                        showConfirmButton: false,
                        timer: 1000,
                        timerProgressBar: true,
                        }).then(() => {
                        navigate(-1);
                        });
                    };
    return(
        <>
            <h1 className="titulo">EDITAR SUBCATEGORÍA</h1>  

            <main className="contenedor-principal">
                <div className="datos card p-4 shadow">
                    {/* Formulario principal en dos columnas */}
                    <form onSubmit={handleSubmit}>
                        <div className="row mb-3">
                            {/* Columna izquierda */}
                            <div className="col-md-4">
                            <div className="mb-3">
                                {/* nombre de la subcategoria */}
                                <label className="form-label">Nombre de la subcategoría: <span className="span">*</span></label>
                                <input type="text"
                                    id="nombre" 
                                    name="Nombre_Subcategoria"
                                        value={subcategoria.Nombre_Subcategoria}
                                        onChange={handleChange}
                                        className="form-control" />
                            </div>
                            <div className="mb-3">
                                {/* Seleccion de la categoria */}
                                <label className="form-label">Tipo de categoría: <span className="span">*</span></label>
                                <select
                                    id="tipo"
                                    name="id_Categorias"
                                    className="form-control"
                                    value={subcategoria.id_Categorias}
                                    onChange={handleChange}
                                >
                                    <option value="">Seleccione una categoría</option>
                                    {categorias.map((cat) => (
                                    <option key={cat.id} value={String(cat.id)}>
                                        {cat.Nombre_categoria}
                                    </option>
                                    ))}
                                </select>
                            </div>
                            </div>

                            {/* Columna derecha */}
                            <div className="col-md-8">
                            <div className="mb-3">
                                {/* Descripcion */}
                                <label className="form-label">Descripción:</label>
                                <textarea id="descripcion" 
                                    rows="6" className="form-control"
                                    name="Descripcion"
                                    placeholder="Escribe una descripción aquí..."
                                    value={subcategoria.Descripcion}
                                    onChange={handleChange}
                                    ></textarea>
                            </div>
                            </div>
                        </div>

                        {/* Botones */}
                        <div className="d-flex justify-content-center gap-3">
                            <button type="submit" className="btn btn-success" disabled={isSubmitting}>{isSubmitting ? 'Guardando...' : 'Guardar'}</button>
                            <button type="button" className="btn btn-danger" onClick={handleCancelar}>Regresar</button>
                        </div>
                    </form>
                </div>
            </main>
        </>
    );
}
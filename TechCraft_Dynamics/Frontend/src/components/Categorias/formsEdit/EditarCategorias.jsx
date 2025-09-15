import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import Categorias from '../Categorias';


export default function EditarCategoria({id}){
    const navigate = useNavigate(); // Variable para regresar 1 pagina 

    const [imagenFormulario2, setImagenFormulario2] = useState(null);
    const [nuevaImagen, setNuevaImagen] = useState(null);  // Para la nueva imagen
    const [isSubmitting, setIsSubmitting] = useState(false); 

        // Definir URL base API una sola vez
  const API_URL = window.location.hostname === 'localhost'
    ? 'http://localhost:4000'
    : 'https://tcd-production.up.railway.app';

    // capturar la imagen y cambiarla
    const handleImagenChange2 = (e) => {
        const file = e.target.files[0];
        if (file){
            setNuevaImagen(file);
            setImagenFormulario2(URL.createObjectURL(file))
        }
    }
    
    // EStado de los datos para formularios.
    const [categoria, setCategoria] = useState({
        Nombre_categoria: '',
        Descripcion: '',
        Imagen_categoria: ''
    })
    // Actualizamos datos del formulario.
    const handleChange = (e) => {
        setCategoria({
            ...categoria,
            [e.target.name]: e.target.value
        });
    };

    // Cargamos los datos cuando se abre el formulario.
    useEffect(() => {
        const obtenerCategorias = async () =>{
            try {
                const res = await axios.get(`${API_URL}/api/categorias/${id}`)
                setCategoria(res.data);
                setImagenFormulario2(`${API_URL}/uploads/${res.data.Imagen_categoria}`);              
            } catch (error){
                console.error("Error al obtener categoria: ", error)
                
            }
        };
        obtenerCategorias();
    }, [id, API_URL]);


    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const {Nombre_categoria} = categoria;
        
        if(!Nombre_categoria.trim()){
            setIsSubmitting(false);
                return Swal.fire('Campo obligatorio', 'El nombre de la categoría es requerido.', 'warning');
        }

        const formData = new FormData();
        formData.append("Nombre_categoria", categoria.Nombre_categoria);
        formData.append("Descripcion", categoria.Descripcion);
        if(nuevaImagen){
            formData.append("imagen", nuevaImagen);
        } else{
            formData.append("Imagen_categoria", categoria.Imagen_categoria);
        }

        try {
            await axios.put(`${API_URL}/api/categorias/${id}`, formData, {
            });
            
            navigate(-1);
        } catch (error){
            console.error("Erro al actualizar la categoria: ", error)
            await Swal.fire('Campo obligatorio', 'El nombre de la categoría es requerido.', 'warning');
        }finally{
            setIsSubmitting(false); // Siempre se va a ejecutar haya o no error
        }
        
    }

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
            <h1 className="titulo">EDITAR CATEGORíA</h1>  
            <main class="contenedor-principal">
                <div className="datos card p-4 shadow">

                    {/* Imagen con su informacion */}
                    <div className="row mb-4 align-items-center ">
                        <div className="col-md-4 text-center  imagen">
                            
                            {/* Imagen del producto */}
                            <div className="rounded-circle bg-secondary mx-auto mb-2" 
                                    style={{
                                    width: "120px",
                                    height: "120px",
                                    borderRadius: "50%",
                                    backgroundColor: "#ccc",
                                    overflow: "hidden",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    }}
                                            >

                                    {imagenFormulario2 ? (
                                        <img src={imagenFormulario2} alt="preview" 
                                        style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                        ) : (
                                            <span style={{ color: "#666", fontSize: "12px" }}>Sin imagen</span>
                                    )}
                            </div>
                            <label className="btn btn-primary btn-sm">Seleciona una imagen
                                    <input type="file" 
                                    accept="image/" 
                                    onChange={handleImagenChange2} hidden />
                            </label>
                        </div>

                                {/* Los inputs van a la derecha */}
                        <section className="col-md-8 formulario">
                            <form onSubmit={handleSubmit}>
                                <div className="row">
                                    <div className="col-md-6">

                                        {/* Nombre de la categoria */}
                                        <div className="mb-3">
                                            <label className="form-label">Nombre de la categoría: <span className="span">*</span></label>
                                            <input type="text" 
                                                id="N-Categorias" 
                                                name="Nombre_categoria"
                                                value={categoria.Nombre_categoria}
                                                onChange={handleChange}
                                                className="form-control" />
                                        </div>

                                        {/* Descripcion de la categoria */}
                                        <div className="mb-3 peticiones">
                                            <label className="form-label">Descripción:</label>
                                            <textarea className="form-control" 
                                                id="D-Categorias" 
                                                name="descripcion" 
                                                rows="4" 
                                                placeholder="Escribe una descripcion aqui..."
                                                value={categoria.Descripcion}
                                                onChange={handleChange}
                                                ></textarea>
                                        </div>
                                        </div>
                                    </div>

                                    {/* Botones */}
                                    <div className="d-flex justify-content-center gap-3 mt-4">
                                        <button type="submit" className="btn btn-success" disabled={isSubmitting}>{isSubmitting ? 'Guardando...' : 'Guardar'}</button>
                                        <button type="button" className="btn btn-danger" onClick={handleCancelar}>Regresar</button>
                                    </div>
                            </form>
                        </section>
                    </div>
                </div>
            </main>   
        </>
    );
}

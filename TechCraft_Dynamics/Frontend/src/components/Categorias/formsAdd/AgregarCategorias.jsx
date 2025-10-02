// importaciones de rutas etc..
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react'; // Hook para manejar los estados de los componentes.
import axios from 'axios'; // peticiones por HTTPS:
import Swal from 'sweetalert2'; // Para hacer alertas en guardar o eliminar o editar

// importaciones de css 
import '../../../css/Categorias/Agregar.css';

export default function AgregarCategoria(){

    // Constantes en uso para logicas
    const navigate = useNavigate(); // Regresar una pagina
    const [imagenFormulario2, setImagenFormulario2] = useState(null); // capturar la imagen necesaria
    const [selectedFile, setSelectedFile] = useState(null); // Captura el archvio real
    const [isSubmitting, setIsSubmitting] = useState(false); // Esto desabilita el boton de guardar

      const API_URL = 'https://tcd-production.up.railway.app';    // Usando el useState para el formulario.
    const [values, setValues] = useState({
        Nombre_categoria: "",
        Descripcion: "",
        
    });

    // funcion para capturar la imagen
    const handleImagenChange2 = (e) => {
        const file = e.target.files[0]; // Accede primnero al archivo seleccionado
        if (file){
            setImagenFormulario2(URL.createObjectURL(file)); // crear una URL temporal
            setSelectedFile(file); // aca captura la imagen realmente.
        }else {
            alert("Por favor selecciona un archivo de imagen válido.");
        }
    }

    // El handleChange dice que va a ser cada useState.
    const handleChange = (event) => {
        const {name, value} = event.target; // Se extraen las propiedades de los inputs 
        setValues({ // Se actualiza el estado pero sin perder los valores anteriores.
            ...values,
            [name]: value // Se usa como clave dinamica
        })
    }

    
    // Manda los datos del formulario a la base de datos.
    const handleSubmit = async (event) => {
        event.preventDefault(); // aca no se recarga la pagina una vez ingresado los datos.
        setIsSubmitting(true); // Aca indica que se envio el formulario
        

        const {Nombre_categoria} = values;

        if(!Nombre_categoria.trim()){
            setIsSubmitting(false);
            return Swal.fire('Campo obligatorio', 'El nombre de la categoría es requerido.', 'warning');
            }
        
        const formData = new FormData(); // Sirve para enviar datos de formularios 
        formData.append('Nombre_categoria', values.Nombre_categoria); // el append sirve para agregar el campo al formulario
        formData.append('Descripcion', values.Descripcion);
        if (selectedFile){
            formData.append('imagen', selectedFile);
        }

        try {
            await axios.post(`${API_URL}/api/categorias`, formData,{ // Envia los datos de modo post
                onUploadProgress: progressEvent => {
                    const percentCompleted = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total
                    );
                    console.log(percentCompleted);
                }
            });
            Swal.fire("Categoría guardada", "Se ha agregado la categoría exitosamente", "success")
                .then(() => { // Son los datos devueltos por el servidor.
                    navigate('/admin/Categorias/Listado');    
            });
        } catch (err){ // Se capturan errores de las peticiones.
            console.error('Error al guardar', err);
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


    return (
        <>  
            {/* Titulo */}
            <h1 className="titulo">AGREGAR CATEGORíA NUEVA</h1>  

            {/* Contenedor trasero */}
            <main className="contenedor-principal">
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
                                            <span style={{ color: "black", fontSize: "12px" }}>Sin imagen</span>
                                    )}
                            </div>
                            <label id='S-imagen' className="btn btn-primary btn-sm">Seleciona una imagen
                                                <input  type="file" accept="image/*" onChange={handleImagenChange2} hidden />
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
                                            className="form-control" 
                                            name="Nombre_categoria" 
                                            value={values.Nombre_categoria} onChange={handleChange} />
                                        </div>

                                        {/* Descripcion de la categoria */}
                                        <div className="mb-3 peticiones">
                                            <label className="form-label">Descripción:</label>
                                            <textarea className="form-control" id="D-Categorias" name="Descripcion" value={values.Descripcion} onChange={handleChange} rows="4" placeholder="Escribe una descripcion aqui..."></textarea>
                                        </div>
                                        </div>
                                    </div>

                                    {/* Botones */}
                                    <div className="d-flex justify-content-center gap-3 mt-4">
                                        <button type="submit" className="btn btn-success boton-igual" disabled={isSubmitting}>{isSubmitting ? 'Guardando...' : 'Guardar'}</button>
                                        <button type="button" className="btn btn-danger boton-igual" onClick={handleCancelar}>Cancelar</button>
                                    </div>
                            </form>
                        </section>
                    </div>
                </div>
            </main>
        </>
    );
}
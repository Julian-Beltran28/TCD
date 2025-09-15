import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react'; // Hook para manejar los estados de los componentes.
import axios from 'axios'; // peticiones por HTTPS:
import Swal from 'sweetalert2'; // Para hacer alertas en guardar o eliminar o editar

export default function AgregarSubcategoria(){
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false); // Esto desabilita el boton de guardar
    
      const API_URL = window.location.hostname === 'localhost'
    ? 'http://localhost:4000'
    : 'https://tcd-production.up.railway.app';

    // Usando el useState para el formulario.
    const [values, setValues] = useState({
        Nombre_Subcategoria: '',
        Descripcion: '',
        id_Categorias: '',
    });
    
    const [categorias, setCategorias] = useState([]); // Para traer todas la categorias exitentes...

    useEffect(() =>{
        axios.get(`${API_URL}/api/categorias`)
            .then(res => setCategorias(res.data))
            .catch(err => console.error('Error cargando categorias: ', err));
    }, [API_URL])

   // El handleChange dice que va a ser cada useState.
    const handleChange = (event) => {
        const {name, value} = event.target; // Se extraen las propiedades de los inputs 
        setValues({ // Se actualiza el estado pero sin perder los valores anteriores.
            ...values,
            [name]: value // Se usa como clave dinamica
        })
    };

    // Manda los datos del formulario a la base de datos.
    const handleSubmit = async (event) => {
        event.preventDefault(); // aca no se recarga la pagina una vez ingresado los datos.
        setIsSubmitting(true); // Aca indica que se envio el formulario

        const {Nombre_Subcategoria, id_Categorias} = values;

        if(!Nombre_Subcategoria.trim() || !id_Categorias ){
            setIsSubmitting(false);
            return Swal.fire('Campo obligatorio', 'El nombre y tipo de categoría son requeridos.', 'warning');
            }
        
        const formData = new FormData(); // Sirve para enviar datos de formularios 
        formData.append('Nombre_Subcategoria', values.Nombre_Subcategoria); // el append sirve para agregar el campo al formulario
        formData.append('Descripcion', values.Descripcion);
        formData.append('id_Categoria', values.id_Categorias)

        try {
            await axios.post(`${API_URL}/api/subcategorias`, values);
            Swal.fire("Subcategoría guardada", "Se ha agregado la subcategoría exitosamente", "success")
                .then(() => { 
                navigate(`/admin/Categoria/${values.id_Categorias}`);
                });
        } catch (err){ // Se capturan errores de las peticiones.
            console.error('Error al guardar', err);
        }finally{
            setIsSubmitting(false); // Siempre se va a ejecutar haya o no error
        }
    };

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
            <h1 className="titulo">AGREGAR SUBCATEGORíA NUEVA</h1>  

            <main className="contenedor-principal">
                <div className="datos card p-4 shadow">
                    {/* Formulario principal en dos columnas */}
                    <form onSubmit={handleSubmit}>
                        <div className="row mb-3">
                            {/* Columna izquierda */}
                            <div className="col-md-4">
                                <div className="mb-3">
                                    {/* Nombre de la subcategoria */}
                                    <label className="form-label">Nombre de la subcategoría: <span className="span">*</span></label>
                                    <input type="text" 
                                        id="nombre" 
                                        className="form-control" 
                                        name="Nombre_Subcategoria" 
                                        value={values.Nombre_Subcategoria} 
                                        onChange={handleChange}/>
                                </div>
                                <div className="mb-3">
                                    {/* Seleccion de la subcategoria */}
                                    <label className="form-label">Tipo de categoría:</label>
                                    <select
                                        id="categoria"
                                        className="form-control"
                                        name="id_Categorias"
                                        value={values.id_Categorias}
                                        onChange={handleChange}
                                    >
                                        <option value="">--Selecciona una categoría--</option>
                                        {categorias.map(cat => (
                                            <option key={cat.id} value={cat.id}>
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
                                        placeholder="Escribe una descripción aquí..."
                                        name="Descripcion" 
                                        value={values.Descripcion} 
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
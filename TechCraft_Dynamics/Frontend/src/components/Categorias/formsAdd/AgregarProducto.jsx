import { useNavigate,useLocation } from "react-router-dom";
import { useState, useEffect } from 'react';
import axios from 'axios'; // peticiones por HTTPS:
import Swal from 'sweetalert2'; // Para hacer alertas en guardar o eliminar o editar


export default function EditarProducto({idSubcategoria}){
    const location = useLocation();
    const navigate = useNavigate(); // Navegacion por paginas
    
    const queryParams = new URLSearchParams(location.search)
    const idCategoria = queryParams.get('categoria');

    // Variables para el formulario.
    const [tipoProducto, setTipoProducto] = useState(''); // Se slecciona el tipo de producto que se desea.
    const [imagenFormulario1, setImagenFormulario1] = useState(null); // tomamos solo la imagen sin guardar
    const [imagenFormulario2, setImagenFormulario2] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null); // Captura el archvio real
    const [isSubmitting, setIsSubmitting] = useState(false); // Desactivacion de botones.
    const [proveedor, setProveedor] = useState([]);

    // Usando el useState para el formulario para productos en paquetes.
    const [productoP, setProductoP] = useState({
        Imagen_producto: '',
        Nombre_producto: '',
        Precio: '',
        Descripcion: '',
        Codigo_de_barras: '',
        Stock: '',
        id_SubCategorias: idSubcategoria || '',
        id_Proveedor: '',
            
    });
    // Usando el useState para el formulario para productos en gramaje.
    const [productoG, setProductoG] = useState({
        Imagen_producto: '',
        Nombre_producto: '',
        Kilogramos: '',
        Precio_kilogramo: '',
        Libras: '',
        Precio_libras: '',
        Descripcion: '',
        id_SubCategorias: idSubcategoria || '',
        id_Proveedor: ''
    });

    const handleChangeProductoP = (event) => {
        const {name, value} = event.target; // Se extraen las propiedades de los inputs 
        setProductoP({ // Se actualiza el estado pero sin perder los valores anteriores.
            ...productoP,
            [name]: value // Se usa como clave dinamica
        })
    }
    const handleChangeProductoG = (event) => {
        const {name, value} = event.target; // Se extraen las propiedades de los inputs 
        setProductoG({ // Se actualiza el estado pero sin perder los valores anteriores.
            ...productoG,
            [name]: value // Se usa como clave dinamica
        })
    }

    // Manda los datos del formulario a la base de datos.
        const handleSubmit = async (event) => {
            event.preventDefault(); // aca no se recarga la pagina una vez ingresado los datos.
            setIsSubmitting(true); // Aca indica que se envio el formulario
            
            const formData = new FormData();
            
            if (tipoProducto === 'paquete'){

                const {Nombre_producto, Stock, Precio, id_Proveedor} = productoP;
                const precioEntero = parseInt(Precio.trim());
                const stockEntero = parseInt(Stock.trim());
                console.log("DEBUG:", { Nombre_producto, Precio, precioEntero, Stock, stockEntero });

                // Condicion para ver si los campos requeridos estan llenos y no vacios
                if(!Nombre_producto.trim() || isNaN(stockEntero) || stockEntero < 0 || isNaN(precioEntero) || precioEntero <= 0 || !id_Proveedor){
                    setIsSubmitting(false);
                    return Swal.fire('Campo obligatorio', 'El nombre y la cantidad son requeridos.', 'warning');
                    }
                    // Peticion o envio de datos.
                    formData.append('Nombre_producto', productoP.Nombre_producto); // el append sirve para agregar el campo al formulario
                    formData.append('Precio', precioEntero);
                    formData.append('Descripcion', productoP.Descripcion);
                    formData.append('Codigo_de_barras', productoP.Codigo_de_barras);
                    formData.append('Stock', stockEntero);
                    formData.append('id_Proveedor', productoP.id_Proveedor);
                    formData.append('id_SubCategorias', productoP.id_SubCategorias); 

            } else if (tipoProducto === 'gramaje' ){ 
                const {Nombre_producto, Kilogramos, Precio_kilogramo, Libras, Precio_libras, id_Proveedor} = productoG;
                const precioKilogramosEntero = parseInt(Precio_kilogramo.trim());
                const precioLibrasEntero = parseInt(Precio_libras.trim());
                const kilogramosEntero = parseInt(Kilogramos.trim());
                const librasEntero = parseInt(Libras.trim());

                if(!Nombre_producto.trim() || isNaN(precioKilogramosEntero) || precioKilogramosEntero <= 0 || isNaN(precioLibrasEntero) || precioLibrasEntero <= 0 || isNaN(kilogramosEntero)  || kilogramosEntero <= 0 || isNaN(librasEntero) || librasEntero <= 0 || !id_Proveedor) {
                    setIsSubmitting(false);
                    return Swal.fire('Campos obligatorios', 'Faltan campos por llenar', 'warning');
                }
                //Peticion de datos.
                formData.append('Nombre_producto', productoG.Nombre_producto);
                formData.append('Kilogramos', kilogramosEntero);
                formData.append('Precio_kilogramo', precioKilogramosEntero);
                formData.append('Libras', librasEntero);
                formData.append('Precio_libras', precioLibrasEntero);
                formData.append('id_Proveedor', productoG.id_Proveedor);
                formData.append('id_SubCategorias', productoG.id_SubCategorias); 
            }else{
                setIsSubmitting(false);
                return Swal.fire('Error', 'Debes selecionar al menos un tipo de producto', 'error')
            }

            if (selectedFile){
                    formData.append('imagen', selectedFile);
            }
            const url = tipoProducto === 'paquete'
                ? 'http://localhost:3000/api/productos/paquete'
                : 'http://localhost:3000/api/productos/gramaje';
                
    
            try {
                for (let pair of formData.entries()) {
                    console.log(`${pair[0]}: ${pair[1]}`);
                    }
                await axios.post(url, formData,{
                    onUploadProgress: (ProgressEvent) => {
                        const percentCompleted = Math.round(
                            (ProgressEvent.loaded * 100) / ProgressEvent.total
                        );
                        console.log(`Progreso: ${percentCompleted}%`)
                    }
                });
                Swal.fire("Producto guardado", "Se ha agregado el producto exitosamente", "success")
                    .then(() => {
                        navigate(`/admin/Categoria/${idCategoria}`); // Redirige a la subcategoría específica
                    });
            } catch (err){
                console.error('Error al guardar el producto', err);
            } finally{
                setIsSubmitting(false);
            }
        }

        useEffect(() => {
        const obtenerProveedores = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/proveedores/listar');
                console.log('Respuesta proveedores:', response.data); // Para depurar
                // Ajusta aquí según la estructura real:
                setProveedor(response.data.proveedores || response.data.data || []); 
                // Si response.data ya es un array, esta línea igual funciona porque || [] es fallback
            } catch (error){
                console.error("Error al cargar proveedores: ", error);
                Swal.fire('Error', 'No se puede cargar los proveedores.', 'error');
            }
        };
        obtenerProveedores();
    }, [])

    const handleImagenChange1 = (e) => {
        const file = e.target.files[0];
        if (file){
            setImagenFormulario1(URL.createObjectURL(file))
            setSelectedFile(file);
        }
    }
    const handleImagenChange2 = (e) => {
        const file = e.target.files[0];
        if (file){
            setImagenFormulario2(URL.createObjectURL(file))
            setSelectedFile(file);
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
                <h1 className="titulo">AGREGAR PRODUCTO NUEVO</h1>  

                <main className="contenedor-principal">

                    <div className="Formulario-producto">
                        {/* Seleccion de formulario gramaje o paquete */}
                        <label htmlFor="tipo" >Tipo de prodcuto</label>
                        <select className="form-control" id="tipo" value={tipoProducto}  onChange={(e) => setTipoProducto(e.target.value)}>
                            <option value="">--Selecciona un opción--</option>
                            <option value="paquete">Productos en paquetes</option>
                            <option value="gramaje">Productos en gramaje</option>
                        </select>

                        {/* Primer formulario: Paquete */}
                        {tipoProducto === 'paquete' &&(
                            <div className="datos card p-4 shadow">
                                {/* Formulario principal en dos columnas */}
                                <form onSubmit={handleSubmit}>
                                    <div className="row mb-3">
                                        {/* Columna izquierda */}
                                        <div className="col-md-4">
                                            <div className="mb-3">
                                                <div className="mb-3 text-center">
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

                                                            {imagenFormulario1 ? (
                                                                <img src={imagenFormulario1} alt="preview" 
                                                                style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                                                ) : (
                                                                    <span style={{ color: "Black", fontSize: "12px" }}>Sin imagen</span>
                                                            )}
                                                    </div>
                                                    <label className="btn btn-primary btn-sm">Seleciona una imagen
                                                        <input type="file" accept="image/" onChange={handleImagenChange1} hidden />
                                                    </label>
                                            </div>
                                                
                                                {/* Nombre del producto */}
                                                <label className="form-label">Nombre del producto: <span className="span">*</span></label>
                                                <input type="text" 
                                                    id="nombre" 
                                                    className="form-control" 
                                                    name="Nombre_producto"
                                                    value={productoP.Nombre_producto}
                                                    onChange={handleChangeProductoP}
                                                    />

                                                {/* Cantidad de productos */}
                                                <label className="form-label">Cantidad de productos: <span className="span">*</span></label>
                                                <input type="number" 
                                                    id="number" 
                                                    className="form-control" 
                                                    placeholder="999" 
                                                    min="1"
                                                    name="Stock"
                                                    value={productoP.Stock}
                                                    onChange={handleChangeProductoP}
                                                    />
                                                {/* Precio del producto */}
                                                <label className="form-label">Precio del producto: <span className="span">*</span></label>
                                                <input type="number" 
                                                    id="number" 
                                                    className="form-control" 
                                                    placeholder="10000 (sin '.' y sin ',' )" 
                                                    min="1"
                                                    name="Precio"
                                                    value={productoP.Precio}
                                                    onChange={handleChangeProductoP}
                                                    />
                                            </div>
                                            
                                        </div>

                                        {/* Columna derecha */}
                                        <div className="col-md-8">
                                            <div className="mb-3">
                                                {/* Codigo de barras del producto */}
                                                <label className="form-label">Código de barras:</label>
                                                <input type="number" 
                                                    id="number" 
                                                    className="form-control" 
                                                    placeholder="0000000"
                                                    name="Codigo_de_barras"
                                                    value={productoP.Codigo_de_barras}
                                                    onChange={handleChangeProductoP}
                                                    />
                                                
                                                {/* Tipo de proveedor al que proviene el producto */}
                                                <label htmlFor="tipo" >Proveedor: </label>
                                                <select 
                                                    className="form-control"
                                                    id="Proveedor"
                                                    name="id_Proveedor"
                                                    value={productoP.id_Proveedor}
                                                    onChange={handleChangeProductoP}
                                                    >
                                                    <option value="">--Selecciona un opción--</option>
                                                    {Array.isArray(proveedor) && proveedor.map(prov => (
                                                        <option key={prov.id} value={prov.id}>
                                                            {prov.nombre_empresa}
                                                        </option>
                                                    ))}
                                                </select>

                                                {/* Descripcion del producto */}
                                                <label className="form-label">Descripción:</label>
                                                <textarea id="descripcion" 
                                                rows="6" 
                                                className="form-control" 
                                                placeholder="Escribe una descripción aquí..."
                                                name="Descripcion"
                                                value={productoP.Descripcion}
                                                onChange={handleChangeProductoP}
                                                ></textarea>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Botones */}
                                    <div className="d-flex justify-content-center gap-3">
                                        <button type="submit" className="btn btn-success" disabled={isSubmitting}>{isSubmitting ? 'Guardando...' : 'Guardar'}</button>
                                        <button type="button" className="btn btn-danger" onClick={() => navigate(-1)}>Regresar</button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {/* Segundo formulario: Gramaje */}
                        {tipoProducto === 'gramaje' && (
                            <div className="datos card p-4 shadow">
                                <form onSubmit={handleSubmit}>
                                    <div className="row mb-3">
                                    {/* Columna izquierda */}
                                        <div className="col-md-4">
                                            <div className="mb-3 text-center">
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
                                                    <input type="file" accept="image/" onChange={handleImagenChange2} hidden />
                                                </label>
                                            </div>

                                            {/* Nombre del producto */}
                                            <div className="mb-3">
                                                <label className="form-label">Nombre del producto: <span className="span">*</span></label>
                                                <input type="text" 
                                                id="nombre" 
                                                className="form-control"
                                                name="Nombre_producto"
                                                value={productoG.Nombre_producto}
                                                onChange={handleChangeProductoG}
                                                />
                                            </div>

                                            {/* Tipo de proveedor al que proviene el producto */}
                                            <label htmlFor="tipo" >Proveedor: </label>
                                                <select 
                                                    className="form-control"
                                                    id="Proveedor"
                                                    name="id_Proveedor"
                                                    value={productoG.id_Proveedor}
                                                    onChange={handleChangeProductoG}
                                                >
                                                    <option value="">--Selecciona un opción--</option>
                                                    {Array.isArray(proveedor) && proveedor.map(prov => (
                                                        <option key={prov.id} value={prov.id}>
                                                            {prov.nombre_empresa}
                                                        </option>
                                                    ))}
                                                </select>

                                        </div>

                                        {/* Columna derecha */}
                                        <div className="col-md-8">
                                            <div className="mb-3">
                                                {/* Peso KG */}
                                                <label className="form-label">Peso en kilos: <span className="span">*</span></label>
                                                <input type="number" 
                                                    className="form-control" 
                                                    placeholder="Kilogramos " 
                                                    name="Kilogramos"
                                                    min="1"
                                                    value={productoG.Kilogramos}
                                                    onChange={handleChangeProductoG}
                                                    />
                                                {/* Precio del kilogramo */}
                                                <label className="form-label">Precio: <span className="span">*</span></label>
                                                <input type="number" 
                                                    className="form-control" 
                                                    placeholder="10000"
                                                    min="1"
                                                    name="Precio_kilogramo"
                                                    value={productoG.Precio_kilogramo}
                                                    onChange={handleChangeProductoG}
                                                    />

                                                {/* Peso LB */}
                                                <label className="form-label">Peso en libras: <span className="span">*</span></label>
                                                <input type="number" 
                                                    className="form-control" 
                                                    placeholder="Libras"
                                                    name="Libras"
                                                    min="1"
                                                    value={productoG.Libras}
                                                    onChange={handleChangeProductoG}
                                                    />
                                                {/* Precio de las libras */}
                                                <label className="form-label">Precio: <span className="span">*</span></label>
                                                <input type="number" 
                                                    className="form-control" 
                                                    name="Precio_libras"
                                                    min="1"
                                                    value={productoG.Precio_libras}
                                                    onChange={handleChangeProductoG}
                                                />
                                                </div>                                    

                                                {/* Descripción */}
                                                <div className="mb-3">
                                                <label className="form-label">Descripción:</label>
                                                <textarea
                                                    id="descripcion"
                                                    rows="6"
                                                    className="form-control"
                                                    placeholder="Escribe una descripción aquí..."
                                                    name="Descripcion"
                                                    value={productoG.Descripcion}
                                                    onChange={handleChangeProductoG}
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
                        )}

                    </div>
                </main>
            </>
        );
}
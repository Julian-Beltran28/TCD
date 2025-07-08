import { useNavigate, useLocation, useParams } from "react-router-dom";
import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

export default function EditarProducto({ idSubcategoria }) {
    const location = useLocation();
    const navigate = useNavigate();
    const { id } = useParams();

    const queryParams = new URLSearchParams(location.search);
    const idCategoria = queryParams.get('categoria');
    const tipoDesdeUrl = queryParams.get('tipo');

    const [tipoProducto, setTipoProducto] = useState('');
    const [imagenFormulario1, setImagenFormulario1] = useState(null);
    const [imagenFormulario2, setImagenFormulario2] = useState(null);
    const [proveedor, setProveedor] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [productoP, setProductoP] = useState({
        Imagen_producto: '', Nombre_producto: '', Precio: '', Descripcion: '',
        Codigo_de_barras: '', Stock: '', id_SubCategorias: idSubcategoria || '', id_Proveedor: ''
    });
    const [productoG, setProductoG] = useState({
        Imagen_producto: '', Nombre_producto: '', Kilogramos: '', Precio_kilogramo: '',
        Libras: '', Precio_libras: '', Descripcion: '', id_SubCategorias: idSubcategoria || '', id_Proveedor: ''
    });

    useEffect(() => {
    const fetchProducto = async () => {
        try {
            const resPaquete = await axios.get('http://localhost:3000/api/productos/paquete');
            const resGramaje = await axios.get('http://localhost:3000/api/productos/gramaje');

            let productoEncontrado = null;

            if (tipoDesdeUrl === 'paquete') {
                productoEncontrado = resPaquete.data.find(p => p.id == id);
                setTipoProducto('paquete');
                if (productoEncontrado) {
                    // Asegura que no haya undefined
                    setProductoP({
                        Imagen_producto: productoEncontrado.Imagen_producto || '',
                        Nombre_producto: productoEncontrado.Nombre_producto || '',
                        Precio: productoEncontrado.precio || '', // ojo: puede venir como "precio"
                        Descripcion: productoEncontrado.Descripcion || '',
                        Codigo_de_barras: productoEncontrado.Codigo_de_barras || '',
                        Stock: productoEncontrado.stock || '',
                        id_SubCategorias: productoEncontrado.id_SubCategorias || idSubcategoria || '',
                        id_Proveedor: productoEncontrado.id_Proveedor || ''
                    });
                    setImagenFormulario1(`http://localhost:3000/uploads/${productoEncontrado.Imagen_producto}`);
                }
            } else {
                productoEncontrado = resGramaje.data.find(p => p.id == id);
                setTipoProducto('gramaje');
                if (productoEncontrado) {
                    setProductoG({
                        Imagen_producto: productoEncontrado.Imagen_producto || '',
                        Nombre_producto: productoEncontrado.Nombre_producto || '',
                        Kilogramos: productoEncontrado.Kilogramos || '',
                        Precio_kilogramo: productoEncontrado.Precio_kilogramo || '',
                        Libras: productoEncontrado.Libras || '',
                        Precio_libras: productoEncontrado.Precio_libras || '',
                        Descripcion: productoEncontrado.Descripcion || '',
                        id_SubCategorias: productoEncontrado.id_SubCategorias || idSubcategoria || '',
                        id_Proveedor: productoEncontrado.id_Proveedor || ''
                    });
                    setImagenFormulario2(`http://localhost:3000/uploads/${productoEncontrado.Imagen_producto}`);
                }
            }

            if (!productoEncontrado) {
                Swal.fire("Error", "Producto no encontrado", "error");
            }

        } catch (error) {
            console.error("Error al cargar producto:", error);
            Swal.fire("Error", "No se pudo cargar el producto", "error");
        }
    };

    fetchProducto();
}, [id, tipoDesdeUrl, idSubcategoria]);

    useEffect(() => {
        const obtenerProveedores = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/proveedores');
                setProveedor(response.data);
            } catch (error) {
                console.error("Error al cargar proveedores: ", error);
                Swal.fire('Error', 'No se puede cargar los proveedores.', 'error');
            }
        };
        obtenerProveedores();
    }, []);

    const handleImagenChange1 = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImagenFormulario1(URL.createObjectURL(file));
            setSelectedFile(file);
        }
    };

    const handleImagenChange2 = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImagenFormulario2(URL.createObjectURL(file));
            setSelectedFile(file);
        }
    };

    const handleChangeProductoP = (e) => {
        const { name, value } = e.target;
        setProductoP({ ...productoP, [name]: value });
    };

    const handleChangeProductoG = (e) => {
        const { name, value } = e.target;
        setProductoG({ ...productoG, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const formData = new FormData();

        let url = '';

        if (tipoProducto === 'paquete') {
            for (let key in productoP) {
                formData.append(key, productoP[key]);
            }
            url = `http://localhost:3000/api/productos/paquete/${id}`;
        } else {
            for (let key in productoG) {
                formData.append(key, productoG[key]);
            }
            url = `http://localhost:3000/api/productos/gramaje/${id}`;
        }

        if (selectedFile) {
            formData.append('imagen', selectedFile);
        }

        try {
            console.log("Contenido de FormData:");
for (let pair of formData.entries()) {
  console.log(`${pair[0]}: ${pair[1]}`);
}
            await axios.put(url, formData);
            Swal.fire('Actualizado', 'El producto ha sido actualizado con éxito', 'success')
                .then(() => navigate(`/Categoria/${idCategoria}`));
        } catch (error) {
            console.error('Error al actualizar producto:', error);
            Swal.fire('Error', 'No se pudo actualizar el producto', 'error');
        } finally {
            setIsSubmitting(false);
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
            <h1 className="titulo">EDITAR PRODUCTO</h1>  

            <main className="contenedor-principal">
                <div className="Formulario-producto">
                    <label htmlFor="tipo" >Tipo de producto</label>
                    <select className="form-control" id="tipo" value={tipoProducto}  onChange={(e) => setTipoProducto(e.target.value)}>
                        <option value="">--Selecciona una opción--</option>
                        <option value="paquete">Productos en paquetes</option>
                        <option value="gramaje">Productos en gramaje</option>
                    </select>

                    {tipoProducto === 'paquete' &&(
                        <div className="datos card p-4 shadow">
                            <form onSubmit={handleSubmit}>
                                <div className="row mb-3">
                                    <div className="col-md-4">
                                        <div className="mb-3 text-center">
                                            <div className="rounded-circle bg-secondary mx-auto mb-2" style={{ width: "120px", height: "120px", borderRadius: "50%", backgroundColor: "#ccc", overflow: "hidden", display: "flex", justifyContent: "center", alignItems: "center" }}>
                                                {imagenFormulario1 ? (
                                                    <img src={imagenFormulario1} alt="preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                                ) : (
                                                    <span style={{ color: "#666", fontSize: "12px" }}>Sin imagen</span>
                                                )}
                                            </div>
                                            <label className="btn btn-primary btn-sm">Seleciona una imagen
                                                <input type="file" accept="image/*" onChange={handleImagenChange1} hidden />
                                            </label>
                                        </div>

                                        <label className="form-label">Nombre del producto:</label>
                                        <input type="text" id="nombre" name="Nombre_producto" className="form-control" value={productoP.Nombre_producto} onChange={handleChangeProductoP} />

                                        <label className="form-label">Cantidad de productos:</label>
                                        <input type="number" id="cantidad" name="Stock" className="form-control" value={productoP.Stock} onChange={handleChangeProductoP} />

                                        <label className="form-label">Proveedor:</label>
                                        <select name="id_Proveedor" className="form-control" value={productoP.id_Proveedor} onChange={handleChangeProductoP}>
                                            <option value="">--Selecciona un proveedor--</option>
                                            {proveedor.map((prov) => (
                                                <option key={prov.id} value={prov.id}>{prov.nombre_empresa}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="col-md-8">
                                        <label className="form-label">Código de barras:</label>
                                        <input type="number" id="codigo" name="Codigo_de_barras" className="form-control" value={productoP.Codigo_de_barras} onChange={handleChangeProductoP} />

                                        <label className="form-label">Descripción:</label>
                                        <textarea id="descripcion" name="Descripcion" rows="6" className="form-control" value={productoP.Descripcion || ''} onChange={handleChangeProductoP}></textarea>
                                    </div>
                                </div>

                                <div className="d-flex justify-content-center gap-3">
                                    <button type="submit" className="btn btn-success" disabled={isSubmitting}>{isSubmitting ? 'Guardando...' : 'Guardar'}</button>
                                    <button type="button" className="btn btn-danger" onClick={handleCancelar}>Regresar</button>
                                </div>
                            </form>
                        </div>
                    )}

                    {tipoProducto === 'gramaje' && (
                        <div className="datos card p-4 shadow">
                            <form onSubmit={handleSubmit}>
                                <div className="row mb-3">
                                    <div className="col-md-4">
                                        <div className="mb-3 text-center">
                                            <div className="rounded-circle bg-secondary mx-auto mb-2" style={{ width: "120px", height: "120px", borderRadius: "50%", backgroundColor: "#ccc", overflow: "hidden", display: "flex", justifyContent: "center", alignItems: "center" }}>
                                                {imagenFormulario2 ? (
                                                    <img src={imagenFormulario2} alt="preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                                ) : (
                                                    <span style={{ color: "#666", fontSize: "12px" }}>Sin imagen</span>
                                                )}
                                            </div>
                                            <label className="btn btn-primary btn-sm">Seleciona una imagen
                                                <input type="file" accept="image/*" onChange={handleImagenChange2} hidden />
                                            </label>
                                        </div>

                                        <label className="form-label">Nombre del producto:</label>
                                        <input type="text" name="Nombre_producto" className="form-control" value={productoG.Nombre_producto} onChange={handleChangeProductoG} />

                                        <label className="form-label">Proveedor:</label>
                                        <select name="id_Proveedor" className="form-control" value={productoG.id_Proveedor} onChange={handleChangeProductoG}>
                                            <option value="">--Selecciona un proveedor--</option>
                                            {proveedor.map((prov) => (
                                                <option key={prov.id} value={prov.id}>{prov.nombre_empresa}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="col-md-8">
                                        <label className="form-label">Peso en kilos:</label>
                                        <input type="number" name="Kilogramos" className="form-control" value={productoG.Kilogramos} onChange={handleChangeProductoG} />

                                        <label className="form-label">Precio por kilo:</label>
                                        <input type="number" name="Precio_kilogramo" className="form-control" value={productoG.Precio_kilogramo} onChange={handleChangeProductoG} />

                                        <label className="form-label">Peso en libras:</label>
                                        <input type="number" name="Libras" className="form-control" value={productoG.Libras} onChange={handleChangeProductoG} />

                                        <label className="form-label">Precio por libra:</label>
                                        <input type="number" name="Precio_libras" className="form-control" value={productoG.Precio_libras} onChange={handleChangeProductoG} />

                                        <label className="form-label">Descripción:</label>
                                        <textarea name="Descripcion" rows="6" className="form-control" value={productoG.Descripcion || ''} onChange={handleChangeProductoG}></textarea>
                                    </div>
                                </div>

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

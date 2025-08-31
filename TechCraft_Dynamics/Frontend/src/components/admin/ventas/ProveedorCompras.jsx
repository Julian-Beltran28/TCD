import React, { useState, useEffect } from 'react';
import axios from 'axios'; 
import "../../../css/admin/ventas/Lista_Productos.css";

const ProveedorCompras = () => {
  const [productos, setProductos] = useState([]); // Todos los productos
  const [proveedores, setProveedores] = useState([]);
  const [proveedorSeleccionado, setProveedorSeleccionado] = useState(null); // Cambiar a objeto
  const [carrito, setCarrito] = useState({});
  const [descuentos, setDescuentos] = useState({});
  const [search, setSearch] = useState('');
  const [paginaActual, setPaginaActual] = useState(1);
  const [mostrarPago, setMostrarPago] = useState(false);
  const [metodoPago, setMetodoPago] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [pagoInfo, setPagoInfo] = useState({});

  const productosPorPagina = 5; // Número de productos a mostrar por página

  // Función para obtener todos los productos
  const obtenerProductos = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/productos/todos');
      setProductos(res.data);
    } catch (error) {
      console.error('Error al obtener productos:', error);
    }
  };

  // Cargar proveedores y productos al montar el componente
  useEffect(() => {
    const fetchProveedores = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/proveedores/listar');
        setProveedores(res.data.proveedores);
      } catch (error) {
        console.error("Error cargando proveedores:", error);
      }
    };
    fetchProveedores();
    obtenerProductos(); // Cargar todos los productos al inicio
  }, []);

  // Función para obtener productos por proveedor
  const obtenerProductosPorProveedor = async (idProveedor) => {
    try {
      if (!idProveedor) {
        // Si no hay proveedor seleccionado, cargar todos los productos
        obtenerProductos();
        return;
      }

      const res = await axios.get(`http://localhost:3000/api/proveedores/productos/${idProveedor}`);
      setProductos(res.data);
    } catch (error) {
      console.error('Error al obtener productos del proveedor:', error);
      setProductos([]);
    }
  };

  // Función para agregar un producto al carrito
  const agregarAlCarrito = (id) => {
    setCarrito(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const eliminarDelCarrito = (id) => {
    setCarrito(prev => {
      const nuevo = { ...prev };
      if (nuevo[id] > 1) nuevo[id]--;
      else delete nuevo[id];
      return nuevo;
    });
  };

  const eliminarProducto = (id) => {
    setCarrito(prev => {
      const nuevo = { ...prev };
      delete nuevo[id];
      return nuevo;
    });
  };

  const formatearPrecio = (precio) =>
    new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(precio);

  const obtenerPrecio = (p) =>
    p.tipo_producto === 'paquete'
      ? Number(p.precio) || 0
      : p.tipo_producto === 'gramaje'
      ? Number(p.Precio_kilogramo) || 0
      : 0;

  const productosFiltrados = productos.filter(p =>
    (p.Nombre_producto && p.Nombre_producto.toLowerCase().includes(search.toLowerCase())) ||
    (p.Codigo_de_barras && p.Codigo_de_barras.includes(search))
  );

  const totalPaginas = Math.ceil(productosFiltrados.length / productosPorPagina);
  const productosPagina = productosFiltrados.slice(
    (paginaActual - 1) * productosPorPagina,
    paginaActual * productosPorPagina
  );

  const totalCarrito = Object.entries(carrito).reduce((total, [id, cant]) => {
    const prod = productos.find(p => p.id === parseInt(id));
    if (!prod) return total;
    const precio = obtenerPrecio(prod);
    const desc = descuentos[id] || 0;
    return total + (precio * cant * (1 - desc / 100));
  }, 0);

  const totalDescuento = Object.entries(carrito).reduce((total, [id, cant]) => {
    const prod = productos.find(p => p.id === parseInt(id));
    if (!prod) return total;
    const precio = obtenerPrecio(prod);
    const desc = descuentos[id] || 0;
    return total + (precio * cant * (desc / 100));
  }, 0);

  const handleRealizarVenta = async () => {
    if (!metodoPago || Object.keys(carrito).length === 0) {
      alert('Selecciona método de pago y agrega productos al carrito.');
      return;
    }

    const detalles = Object.entries(carrito).map(([id, cantidad]) => {
    const prod = productos.find(p => p.id === parseInt(id));
    const desc = descuentos[id] || 0;
    return {
    id_proveedor: prod.id_Proveedor, 
    producto_id: prod.id,
    cantidad,
    valor_unitario: obtenerPrecio(prod),  // mejor usar tu función para evitar NaN
    descuento: (obtenerPrecio(prod) * cantidad * (desc / 100)),
    metodo_pago: metodoPago,
    info_pago: pagoInfo,
    detalle_venta: descripcion,
    tipo: prod.tipo_producto   // tipo ('paquete' o 'gramaje')
    };
  });


    const datosVenta = detalles; // Cambiar a detalles directamente

    try {
      const res = await axios.post('http://localhost:3000/api/proveedores/comprar', datosVenta);
      alert(res.data.mensaje || 'Venta exitosa');
      // Limpiar estado
      setCarrito({});
      setDescuentos({});
      setMetodoPago('');
      setDescripcion('');
      setMostrarPago(false);
      setPagoInfo({});
    } catch (error) {
      console.error('Error al registrar la venta:', error.response?.data || error.message);
      alert('Error al registrar la venta');
    }
  };

  // Renderizar el componente
    return (
    <div className="lista-productos-container">
      <div className="lista-productos-wrapper py-3">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="text-primary fw-bold">
            <i className="bi bi-cart4 me-2"></i> Lista de Productos - Proveedores
          </h2>
          <span className="badge bg-orange fs-6">
            {Object.values(carrito).reduce((a, b) => a + b, 0)} items en carrito
          </span>
        </div>
        
        {/* Seleccionar proveedor */}
        <div className="select-proveedor-wrapper">
          <div className="mb-3">
            <label className="form-label">Seleccionar Proveedor</label>
            <select
              className="form-select"
              value={proveedorSeleccionado ? proveedorSeleccionado.nombre_empresa : ''}
              onChange={(e) => {
                const valorSeleccionado = e.target.value;
                const proveedor = proveedores.find(p => p.nombre_empresa === valorSeleccionado);
                setProveedorSeleccionado(proveedor || null); // Guardar el proveedor completo
                if (proveedor) {
                  obtenerProductosPorProveedor(proveedor.id);
                } else {
                  obtenerProductos();
                }
              }}
            >
              <option value="">-- Seleccione un proveedor --</option>
              {proveedores.map(p => (
                <option key={p.id} value={p.nombre_empresa}>
                  {p.nombre_empresa}
                </option>
              ))}
            </select>
            </div>
        {/* Vista previa del proveedor seleccionado */}
        {proveedorSeleccionado && (
          <div className="proveedor-preview">
            <img src={`http://localhost:3000/uploads/${proveedorSeleccionado.imagen_empresa}`} alt={proveedorSeleccionado.nombre_empresa} />
            <h5>{proveedorSeleccionado.nombre_empresa}</h5>
          </div>
        )}
        </div>


        {/* Barra de búsqueda */}
        <div className="input-group mb-4 shadow-sm">
          <span className="input-group-text bg-success text-white">
            <i className="bi bi-search"></i>
          </span>
          <input
            type="text"
            className="form-control form-control-lg"
            placeholder="Buscar por nombre o código de barras..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
          />
        </div>

        {/* Tabla de productos */}
        <div className="cardshadow-sm">
          <div className="card-header">
            <h5 className="mb-0">Inventario</h5>
          </div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Imagen</th>
                    <th>Producto</th>
                    <th>Código</th>
                    <th>Tipo</th>
                    <th className="text-end">Precio</th>
                    <th className="text-center">Stock</th>
                    <th className="text-center">Cantidad</th>
                    <th className="text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {productosPagina.map((p, i) => (
                    <tr key={p.id}>
                      <td>{(paginaActual - 1) * productosPorPagina + i + 1}</td>
                      <td>
                        <img
                          className="ImagenTabla"
                          src={p.Imagen_producto ? `http://localhost:3000/uploads/${p.Imagen_producto}` : '/path/to/default/image.jpg'} // Ruta a una imagen por defecto si no hay imagen
                          alt={p.Nombre_producto}
                          style={{ width: '50px' }}
                        />
                      </td>
                      <td>{p.Nombre_producto}</td>
                      <td><code>{p.Codigo_de_barras || 'N/A'}</code></td>
                      <td>
                        <span className="badge bg-info">
                          {p.tipo_producto === 'paquete' ? 'Paquete' : 'Gramaje'}
                        </span>
                      </td>
                      <td className="text-end text-success fw-bold">
                        {formatearPrecio(obtenerPrecio(p))}
                      </td>
                      <td className="text-center">
                        <span className={`badge ${p.Stock < 10 ? 'bg-warning' : 'bg-success'}`}>
                          {p.Stock}
                        </span>
                      </td>
                      <td className="text-center">
                        {carrito[p.id] ? (
                          <div className="btn-group btn-group-sm">
                            <button className="btn btn-outline-danger" onClick={() => eliminarDelCarrito(p.id)}>-</button>
                            <span className="btn btn-outline-secondary disabled">{carrito[p.id]}</span>
                            <button className="btn btn-outline-success" onClick={() => agregarAlCarrito(p.id)}>+</button>
                          </div>
                        ) : (
                          <span className="badge bg-secondary">0</span>
                        )}
                      </td>
                      <td className="text-center">
                        {carrito[p.id] ? (
                          <div className="btn-group btn-group-sm">
                            <button className="btn btn-success" onClick={() => agregarAlCarrito(p.id)}>+</button>
                            <button className="btn btn-danger" onClick={() => eliminarProducto(p.id)}>Eliminar</button>
                          </div>
                        ) : (
                          <button className="btn btn-primary btn-sm" onClick={() => agregarAlCarrito(p.id)}>
                            <i className="bi bi-plus me-1"></i> Agregar
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Paginación */}
        <nav className="my-4 d-flex justify-content-center">
          <ul className="pagination custom-pagination">
            <li className={`page-item ${paginaActual === 1 && 'disabled'}`}>
              <button className="page-link" onClick={() => setPaginaActual(paginaActual - 1)}>&laquo;</button>
            </li>
            {[...Array(totalPaginas)].map((_, i) => (
              <li key={i} className={`page-item ${paginaActual === i + 1 && 'active'}`}>
                <button className="page-link" onClick={() => setPaginaActual(i + 1)}>{i + 1}</button>
              </li>
            ))}
            <li className={`page-item ${paginaActual === totalPaginas && 'disabled'}`}>
              <button className="page-link" onClick={() => setPaginaActual(paginaActual + 1)}>&raquo;</button>
            </li>
          </ul>
        </nav>

        {/* Resumen del carrito */}
        {Object.keys(carrito).length > 0 && (
          <div className="card shadow-sm">
            <div className="card-header">
              <h5><i className="bi bi-cart-check me-2"></i>Resumen del Carrito</h5>
            </div>
            <div className="card-body">
              <table className="table table-sm">
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th className="text-center">Cantidad</th>
                    <th className="text-end">Precio Unit.</th>
                    <th className="text-end">Subtotal</th>
                    <th className="text-center">% Desc.</th>
                    <th className="text-center">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(carrito).map(([id, cantidad]) => {
                    const producto = productos.find(p => p.id === parseInt(id));
                    if (!producto) return null; // Evitar errores si no se encuentra el producto
                    
                    return (
                      <tr key={id}>
                        <td>{producto.Nombre_producto}</td>
                        <td className="text-center"><span className="badge bg-primary">{cantidad}</span></td>
                        <td className="text-end">{formatearPrecio(obtenerPrecio(producto))}</td>
                        <td className="text-end fw-bold">
                          {formatearPrecio((obtenerPrecio(producto) * cantidad) * (1 - (descuentos[id] || 0) / 100))}
                        </td>
                        <td className="text-center">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            className="form-control form-control-sm"
                            value={descuentos[id] || ''}
                            placeholder="%"
                            onChange={(e) =>
                              setDescuentos({
                                ...descuentos,
                                [id]: Math.min(100, Math.max(0, parseInt(e.target.value) || 0))
                              })
                            }
                            style={{ width: '70px' }}
                          />
                        </td>
                        <td className="text-center">
                          <button className="btn btn-danger btn-sm" onClick={() => eliminarProducto(producto.id)}>Eliminar</button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="table-warning">
                    <th colSpan="3" className="text-end">Descuento total:</th>
                    <th className="text-end text-danger">{formatearPrecio(totalDescuento)}</th>
                    <th colSpan="2"></th>
                  </tr>
                  <tr className="table-success">
                    <th colSpan="3" className="text-end">TOTAL:</th>
                    <th className="text-end fs-5">{formatearPrecio(totalCarrito)}</th>
                    <th colSpan="2"></th>
                  </tr>
                </tfoot>
              </table>

              {/* Botón para seleccionar método de pago */}
              {!mostrarPago && (
                <div className="text-end">
                  <button className="btn btn-success" onClick={() => setMostrarPago(true)}>
                    <i className="bi bi-cash me-2"></i>Seleccionar método de pago
                  </button>
                </div>
              )}

              {/* Formulario para ingresar información de pago */}
              {mostrarPago && (
                <>
                  {/* Método de pago */}
                  <div className="mb-3">
                    <label className="form-label">Seleccionar método de pago</label>
                    <select className="form-select" value={metodoPago} onChange={(e) => setMetodoPago(e.target.value)}>
                      <option value="">-- Seleccione --</option>
                      <option value="efectivo">Efectivo</option>
                      <option value="nequi">Nequi</option>
                      <option value="tarjeta">Tarjeta</option>
                      <option value="transferencia">Transferencia</option>
                      <option value="daviplata">Daviplata</option>
                    </select>
                  </div>

                  {/* Campos dinámicos según el método de pago seleccionado */}
                  {metodoPago === 'nequi' && (
                    <>
                      <input type="text" className="form-control mb-2" placeholder="Número de teléfono"
                        onChange={(e) => setPagoInfo({ ...pagoInfo, telefono: e.target.value })} />
                      <input type="password" className="form-control mb-2" placeholder="Clave dinámica"
                        onChange={(e) => setPagoInfo({ ...pagoInfo, clave: e.target.value })} />
                    </>
                  )}
                  {metodoPago === 'tarjeta' && (
                    <>
                      <input type="text" className="form-control mb-2" placeholder="Número de tarjeta"
                        onChange={(e) => setPagoInfo({ ...pagoInfo, numero_tarjeta: e.target.value })} />
                      <input type="text" className="form-control mb-2" placeholder="Nombre del titular"
                        onChange={(e) => setPagoInfo({ ...pagoInfo, titular: e.target.value })} />
                      <input type="text" className="form-control mb-2" placeholder="Fecha vencimiento (MM/AA)"
                        onChange={(e) => setPagoInfo({ ...pagoInfo, vencimiento: e.target.value })} />
                      <input type="text" className="form-control mb-2" placeholder="CVV"
                                                onChange={(e) => setPagoInfo({ ...pagoInfo, cvv: e.target.value })} />
                    </>
                  )}
                  {metodoPago === 'transferencia' && (
                    <>
                      <input type="text" className="form-control mb-2" placeholder="Entidad bancaria"
                        onChange={(e) => setPagoInfo({ ...pagoInfo, banco: e.target.value })} />
                      <input type="text" className="form-control mb-2" placeholder="Número de referencia"
                        onChange={(e) => setPagoInfo({ ...pagoInfo, referencia: e.target.value })} />
                    </>
                  )}
                  {metodoPago === 'daviplata' && (
                    <>
                      <input type="text" className="form-control mb-2" placeholder="Número Daviplata"
                        onChange={(e) => setPagoInfo({ ...pagoInfo, numero: e.target.value })} />
                      <input type="password" className="form-control mb-2" placeholder="Clave/llave Daviplata"
                        onChange={(e) => setPagoInfo({ ...pagoInfo, llave: e.target.value })} />
                    </>
                  )}

                  {/* Descripción opcional */}
                  <div className="mt-3">
                    <label className="form-label">Descripción (opcional):</label>
                    <textarea className="form-control" rows="2" value={descripcion} onChange={(e) => setDescripcion(e.target.value)}></textarea>
                  </div>

                  {/* Botones para realizar la venta, guardar como pendiente o cancelar */}
                  <div className="mt-4 d-flex gap-3">
                    <button className="btn btn-primary" onClick={handleRealizarVenta}>
                      <i className="bi bi-send"></i> Realizar Venta
                    </button>
                    <button className="btn btn-danger" onClick={() => setMostrarPago(false)}>
                      <i className="bi bi-x-circle"></i> Cancelar Venta
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Exportar el componente para usarlo en otras partes de la aplicación
export default ProveedorCompras;

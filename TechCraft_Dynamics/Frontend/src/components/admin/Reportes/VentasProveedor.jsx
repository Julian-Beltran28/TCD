import React, { useEffect, useState } from 'react';
import axios from 'axios';

const VentasProveedor = () => {
  const [ventas, setVentas] = useState([]);
  const [ventaActivaId, setVentaActivaId] = useState(null);

  const cargarVentas = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/ventas');
      setVentas(res.data);
    } catch (err) {
      console.error('Error cargando ventas:', err);
    }
  };

  const eliminarVenta = async (id) => {
    if (window.confirm("¿Seguro que deseas eliminar TODA esta venta (grupo de productos)?")) {
      try {
        await axios.delete(`http://localhost:3000/api/ventas/${id}`);
        cargarVentas();
      } catch (err) {
        console.error('Error al eliminar la venta:', err);
        alert('Error al eliminar la venta');
      }
    }
  };

  const toggleDetalles = (id) => {
    setVentaActivaId(prev => (prev === id ? null : id));
  };

  useEffect(() => {
    cargarVentas();
  }, []);

  return (
    <div className="container py-4" style={{ paddingBottom: '120px', minHeight: '100%' }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">Ventas Realizadas</h2>
      </div>

      {ventas.length === 0 ? (
        <div className="alert alert-info">No hay ventas registradas todavía.</div>
      ) : (
        ventas.map((venta) => (
          <div key={venta.id} className="card mb-4 shadow-sm">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h5 className="card-title mb-0 text-warning">Venta #{venta.id}</h5>
                <div>
                  <button
                    className="btn btn-outline-primary btn-sm me-2"
                    onClick={() => toggleDetalles(venta.id)}
                  >
                    {ventaActivaId === venta.id ? 'Ocultar Detalles' : 'Detalles'}
                  </button>
                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => eliminarVenta(venta.id)}
                  >
                    Eliminar
                  </button>
                </div>
              </div>

              {ventaActivaId === venta.id && (
                <div className="mt-3 border-top pt-3">
                  <h6 className="fw-bold mb-3">Información de la Venta</h6>
                  <table className="table table-bordered table-sm align-middle">
                    <tbody>
                      <tr>
                        <th>Método de Pago</th>
                        <td>{venta.metodo_pago}</td>
                      </tr>
                      <tr>
                        <th>Descripción</th>
                        <td>{venta.descripcion}</td>
                      </tr>
                      <tr>
                        <th>Fecha</th>
                        <td>{new Date(venta.fecha).toLocaleString()}</td>
                      </tr>
                      <tr>
                        <th>Info Pago</th>
                        <td><code>{venta.info_pago ? JSON.stringify(venta.info_pago) : 'null'}</code></td>
                      </tr>
                    </tbody>
                  </table>

                  <h6 className="fw-bold mt-4">Productos Vendidos</h6>
                  <table className="table table-striped table-bordered table-sm align-middle">
                    <thead className="table-dark">
                      <tr>
                        <th>Producto</th>
                        <th className="text-center">Cantidad</th>
                        <th className="text-end">Valor Unitario</th>
                        <th className="text-end">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{venta.producto}</td>
                        <td className="text-center">
                          <span className="badge bg-primary">{venta.cantidad}</span>
                        </td>
                        <td className="text-end">${venta.valor_unitario.toLocaleString()}</td>
                        <td className="text-end fw-bold">
                          ${(venta.valor_unitario * venta.cantidad).toLocaleString()}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default VentasProveedor;

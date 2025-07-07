// src/pages/admin/Reportes/PanelPrincipal.jsx
import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import '../../../css/admin/Reportes/PanelPrincipal.css';
import axios from 'axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useAuth } from '../../../context/AuthContext'; // o la ruta correcta


export default function PanelPrincipal() {
  const [pedidos, setPedidos] = useState([]);
  const [productosCriticos, setProductosCriticos] = useState([]);
  const [actividadReciente, setActividadReciente] = useState([]);
  const [ventas, setVentas] = useState([]);
  const navigate = useNavigate();
  const { user } = useAuth();
  const userRole = user?.rol?.toLowerCase() || 'admin';

  const formatearFecha = (fechaStr) => {
    const fecha = new Date(fechaStr);
    return fecha.toLocaleDateString('es-CO', { year: 'numeric', month: '2-digit', day: '2-digit' });
  };

  useEffect(() => {
    setPedidos([
      { id: 1, cliente: 'Carlos Ruiz', total: 32000, fecha: '2025-07-01' },
      { id: 2, cliente: 'Luisa Gómez', total: 15000, fecha: '2025-07-02' }
    ]);

    setProductosCriticos([
      { id: 101, nombre: 'Impermeable Azul', stock: 36 },
      { id: 102, nombre: 'Abrigo Térmico', stock: 30 }
    ]);

    setActividadReciente([
      { id: 1, tipo: 'Nuevo producto', detalle: 'Agregado "Gato Gold"', fecha: '2025-07-03' },
      { id: 2, tipo: 'Nuevo producto', detalle: 'Agregado "Amoxicilina 500mg"', fecha: '2025-07-03' },
      { id: 2, tipo: 'Nuevo producto', detalle: 'Agregado "Vitavet Complejo B"', fecha: '2025-07-03' }
    ]);

    cargarVentas();
  }, []);

  const cargarVentas = async () => {
    try {
      const [ventasRes, comprasRes] = await Promise.all([
        axios.get('http://localhost:3000/api/ventas'),
        axios.get('http://localhost:3000/api/compras')
      ]);

      const todas = [...ventasRes.data, ...comprasRes.data].map((v) => ({
        ...v,
        tipo: v.id_proveedor ? 'Compra a proveedor' : 'Venta a cliente',
        fecha: formatearFecha(v.fecha || v.fecha_compra)
      }));

      setVentas(todas);
    } catch (err) {
      console.error('Error cargando ventas y compras:', err);
    }
  };

  const aceptarPedido = (id) => {
    Swal.fire('Aceptado', `Pedido #${id} aceptado`, 'success');
    setPedidos(prev => prev.filter(p => p.id !== id));
  };

  const cancelarPedido = (id) => {
    Swal.fire({
      title: '¿Cancelar pedido?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, cancelar',
      cancelButtonText: 'No, conservar',
    }).then(result => {
      if (result.isConfirmed) {
        Swal.fire('Cancelado', `Pedido #${id} cancelado`, 'info');
        setPedidos(prev => prev.filter(p => p.id !== id));
      }
    });
  };

  const mostrarDetalles = (venta) => {
    Swal.fire({
      title: `Detalles`,
      html: `
        <p><b>Tipo:</b> ${venta.tipo}</p>
        <p><b>Producto:</b> ${venta.producto}</p>
        <p><b>Cantidad:</b> ${venta.cantidad}</p>
        <p><b>Precio Unitario:</b> $${venta.valor_unitario?.toLocaleString() || 0}</p>
        <p><b>Descuento:</b> $${venta.descuento?.toLocaleString() || 0}</p>
        <p><b>Subtotal:</b> $${venta.subtotal?.toLocaleString() || 0}</p>
        <p><b>Método de pago:</b> ${venta.metodo_pago}</p>
        <p><b>Descripción:</b> ${venta.descripcion || 'N/A'}</p>
        <p><b>Fecha:</b> ${venta.fecha}</p>
      `,
      confirmButtonText: 'Cerrar',
    });
  };

  const eliminarVenta = async (id) => {
    const confirm = await Swal.fire({
      title: '¿Estás seguro?',
      text: 'Se eliminará este registro.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (!confirm.isConfirmed) return;

    const venta = ventas.find(v => v.id === id);
    const url = venta?.id_proveedor
      ? `http://localhost:3000/api/compras/${id}`
      : `http://localhost:3000/api/ventas/unidad/${id}`;

    try {
      await axios.delete(url);
      Swal.fire('Eliminado', 'Registro eliminado correctamente', 'success');
      cargarVentas();
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'No se pudo eliminar el registro', 'error');
    }
  };

  const descargarPDF = (venta) => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Detalle de la venta/compra', 20, 20);
    doc.setFontSize(12);
    doc.text(`Generado el: ${formatearFecha(new Date())}`, 20, 30);

    autoTable(doc, {
      startY: 40,
      head: [['Campo', 'Valor']],
      body: [
        ['Tipo', venta.tipo],
        ['Producto', venta.producto],
        ['Cantidad', venta.cantidad],
        ['Valor Unitario', `$${venta.valor_unitario?.toLocaleString()}`],
        ['Descuento', `$${venta.descuento?.toLocaleString()}`],
        ['Subtotal', `$${venta.subtotal?.toLocaleString()}`],
        ['Método de pago', venta.metodo_pago],
        ['Descripción', venta.descripcion || 'N/A'],
        ['Fecha', venta.fecha]
      ]
    });

    doc.save(`detalle_venta_${venta.id}.pdf`);
  };

  const descargarTodasVentasPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Reporte de Ventas y Compras', 20, 20);
    doc.setFontSize(12);
    doc.text(`Generado el: ${formatearFecha(new Date())}`, 20, 30);

    autoTable(doc, {
      startY: 40,
      head: [['Producto', 'Tipo', 'Cantidad', 'Subtotal', 'Método', 'Fecha']],
      body: ventas.map(v => [
        v.producto,
        v.tipo,
        v.cantidad,
        `$${v.subtotal?.toLocaleString()}`,
        v.metodo_pago,
        v.fecha
      ])
    });

    doc.save('reporte_general.pdf');
  };

  return (
    <div className="panelprincipal-container">
      <h1 className="mb-4">Panel Principal</h1>

      {/* Pedidos pendientes */}
      <section className="mb-5">
        <h3>🕒 Pedidos Pendientes</h3>
        {pedidos.length === 0 ? <p>No hay pedidos.</p> : (
          <table className="table">
            <thead><tr><th>Cliente</th><th>Total</th><th>Fecha</th><th>Acciones</th></tr></thead>
            <tbody>
              {pedidos.map(p => (
                <tr key={p.id}>
                  <td>{p.cliente}</td>
                  <td>${p.total.toLocaleString()}</td>
                  <td>{formatearFecha(p.fecha)}</td>
                  <td>
                    <button className="btn btn-success btn-sm me-2" onClick={() => aceptarPedido(p.id)}>Aceptar</button>
                    <button className="btn btn-danger btn-sm" onClick={() => cancelarPedido(p.id)}>Cancelar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

{/* Stock Crítico */}
<section className="mb-5">
  <div className="d-flex justify-content-between align-items-center mb-2">
    <h3> Stock Crítico</h3>
  </div>
  {productosCriticos.length === 0 ? <p>Stock suficiente.</p> : (
    <table className="table table-bordered">
      <thead><tr><th>Producto</th><th>Stock</th></tr></thead>
      <tbody>
        {productosCriticos.map(p => (
          <tr key={p.id}>
            <td>{p.nombre}</td>
            <td style={{ color: 'red', fontWeight: 'bold' }}>{p.stock}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )}
  
  <div style={{ textAlign: 'right' }}>
    <button
      className="btn btn-outline-danger btn-sm"
      onClick={() => navigate('/admin/ventas')}
      title="Ir a la sección de ventas"
    >
      Ir a Ventas
    </button>
  </div>
</section>


      {/* Actividad Reciente */}
      <section className="mb-5">
        <h3> Actividad Reciente</h3>
        <ul className="list-group">
          {actividadReciente.map(a => (
            <li key={a.id} className="list-group-item d-flex justify-content-between">
              <span><strong>{a.tipo}</strong>: {a.detalle}</span>
              <span className="badge bg-secondary">{formatearFecha(a.fecha)}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Ventas y Compras */}
      <section className="mb-5">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3> Ventas y Compras</h3>
         <button
             style={{ backgroundColor: '#006400', borderColor: '#006400' }}
             className="btn btn-primary"
             onClick={descargarTodasVentasPDF}
           >
             Descargar PDF
          </button>

        </div>
        <table className="table table-hover">
          <thead className="table-success">
            <tr><th>Producto</th><th>Tipo</th><th>Subtotal</th><th>Fecha</th><th>Acciones</th></tr>
          </thead>
          <tbody>
            {ventas.map(v => (
              <tr key={v.id}>
                <td>{v.producto}</td>
                <td>{v.tipo}</td>
                <td>${v.subtotal?.toLocaleString()}</td>
                <td>{v.fecha}</td>
                <td>
                  <button className="btn btn-outline-info btn-sm me-2" onClick={() => mostrarDetalles(v)}>Detalles</button>
                  {userRole === 'admin' && (
                  <button className="btn btn-outline-danger btn-sm me-2" onClick={() => eliminarVenta(v.id)}>
                    Eliminar
                  </button>
                )}

                  <button className="btn btn-outline-success btn-sm" onClick={() => descargarPDF(v)}>PDF</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

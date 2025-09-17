// src/pages/admin/Reportes/PanelPrincipal.jsx
import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import '../../../css/admin/Reportes/PanelPrincipal.css';
import axios from 'axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

  const API_URL = window.location.hostname === 'localhost'
  ? 'http://localhost:4000'
  : 'https://tcd-production.up.railway.app';

export default function PanelPrincipal() {
  const [pedidos, setPedidos] = useState([]);
  const [productosCriticos, setProductosCriticos] = useState([]);
  const [actividadReciente, setActividadReciente] = useState([]);
  const [ventas, setVentas] = useState([]);
  const [tabActivo, setTabActivo] = useState('Usuarios');



  // Función unificada para fechas con hora
  const formatearFechaHora = (fechaStr) => {
    const fecha = new Date(fechaStr);
    return fecha.toLocaleString('es-CO', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  useEffect(() => {
    cargarPedidos();
    cargarStockCritico();
    cargarActividadReciente();
    cargarVentas();
  }, []);

  // --- Pedidos ---
  const cargarPedidos = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/ventas?activo=0`);
      setPedidos(data);
    } catch (err) {
      console.error('Error cargando pedidos:', err);
    }
  };

  const confirmarPedido = async (pedido) => {
    const result = await Swal.fire({
      title: `¿Confirmar pedido de ${pedido.Nombre_producto}?`,
      text: "Esto activará la compra y actualizará el stock.",
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, confirmar',
      cancelButtonText: 'Cancelar',
    });
    if (result.isConfirmed) {
      try {
        await axios.put(`${API_URL}/api/ventas/${pedido.id}`, { activo: 1 });

        // Actualizar stock sumando cantidad del detalle
        const productoRes = await axios.get(`${API_URL}/api/productos/${pedido.id_producto}`);
        const producto = productoRes.data;
        const nuevoStock = (producto.stock || 0) + pedido.cantidad;
        await axios.put(`${API_URL}/api/productos/${pedido.id_producto}`, { stock: nuevoStock });

        Swal.fire('Confirmado', `Pedido de ${pedido.Nombre_producto} activado y stock actualizado`, 'success');
        cargarPedidos(); 
        cargarVentas(); 
        cargarStockCritico();
      } catch (err) {
        console.error(err);
        Swal.fire('Error', 'No se pudo confirmar el pedido', 'error');
      }
    }
  };

  const cancelarPedido = async (pedido) => {
    const result = await Swal.fire({
      title: `¿Cancelar pedido de ${pedido.Nombre_producto}?`,
      text: "Esto marcará el pedido como cancelado.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, cancelar',
      cancelButtonText: 'Volver',
    });
    if (result.isConfirmed) {
      try {
        await axios.put(`${API_URL}/api/ventas/${pedido.id}`, { activo: 0 });
        Swal.fire('Cancelado', `Pedido de ${pedido.Nombre_producto} cancelado`, 'success');
        cargarPedidos(); 
        cargarVentas();
      } catch (err) {
        console.error(err);
        Swal.fire('Error', 'No se pudo cancelar el pedido', 'error');
      }
    }
  };

  // --- Stock crítico ---
  const cargarStockCritico = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/productos`);
      const critico = data.filter(p => {
        if (p.activo !== 1) return false;
        const cantidad = p.tipo_producto === 'gramaje' ? (p.Kilogramos || p.Libras || 0) : (p.stock || 0);
        return cantidad < (p.tipo_producto === 'gramaje' ? 10 : 30);
      }).map(p => ({ ...p, stockMostrar: p.tipo_producto === 'gramaje' ? (p.Kilogramos || p.Libras) : p.stock }));
      setProductosCriticos(critico);
    } catch (err) {
      console.error('Error cargando stock crítico:', err);
    }
  };

  // --- Actividad reciente ---
  const cargarActividadReciente = async () => {
    try {
      const [usuariosRes, productosRes, proveedoresRes, ventasRes] = await Promise.all([
        axios.get(`${API_URL}/api/usuarios`),
        axios.get(`${API_URL}/api/productos`),
        axios.get(`${API_URL}/api/proveedores/listar`),
        axios.get(`${API_URL}/api/ventas`)
      ]);

      let idxCounter = 0;
      const usuarios = Array.isArray(usuariosRes.data.usuarios) ? usuariosRes.data.usuarios : usuariosRes.data;
      const productos = Array.isArray(productosRes.data) ? productosRes.data : [];
      const proveedores = Array.isArray(proveedoresRes.data.proveedores) ? proveedoresRes.data.proveedores : [];
      const ventasData = Array.isArray(ventasRes.data) ? ventasRes.data : [];

      const actividad = [
        ...usuarios.map(u => ({ tipo: 'Usuario', detalle: `${u.Primer_Nombre} ${u.Primer_Apellido}`, fecha: u.created_at ? new Date(u.created_at) : new Date(), _idx: idxCounter++ })),
        ...productos.map(p => ({ tipo: 'Producto', detalle: p.Nombre_producto, fecha: p.created_at ? new Date(p.created_at) : new Date(), _idx: idxCounter++ })),
        ...proveedores.map(p => ({ tipo: 'Proveedor', detalle: p.nombre_empresa, fecha: p.created_at ? new Date(p.created_at) : new Date(), _idx: idxCounter++ })),
        ...ventasData.map(v => ({
          tipo: v.id_proveedor ? 'Compra' : 'Venta',
          detalle: v.id_proveedor ? `Compra ID: ${v.id}` : `Venta ID: ${v.id}`,
          fecha: v.fecha ? new Date(v.fecha) : new Date(),
          _idx: idxCounter++,
          id: v.id,
          detalles: v.detalles || [],
        }))
      ];

      actividad.sort((a, b) => b.fecha - a.fecha || b._idx - a._idx);
      setActividadReciente(actividad);
    } catch (err) {
      console.error(err);
    }
  };

  const actividadRecienteFiltrada = actividadReciente
    .filter(a => tabActivo === 'Usuarios' ? a.tipo === 'Usuario' : tabActivo === 'Proveedores' ? a.tipo === 'Proveedor' : tabActivo === 'Productos' ? a.tipo === 'Producto' : a.tipo === 'Venta' || a.tipo === 'Compra')
    .slice(0, 5);

  const mostrarDetallesActividad = async (ventaActividad) => {
    try {
      const { data } = await axios.get(`${API_URL}/api/ventas/${ventaActividad.id}`);
      const venta = data;
      const detallesHTML = venta.detalles?.map(d => `
        <p><b>Producto:</b> ${d.Nombre_producto}</p>
        <p><b>Cantidad:</b> ${d.cantidad}</p>
        <p><b>Precio Unitario:</b> $${d.valor_unitario?.toLocaleString() || 0}</p>
        <p><b>Descuento:</b> $${d.descuento?.toLocaleString() || 0}</p>
        <p><b>Subtotal:</b> $${d.subtotal?.toLocaleString() || 0}</p>
        <hr/>
      `).join('') || '<p>No hay detalles.</p>';

      Swal.fire({
        title: `Detalles de ${venta.id_proveedor ? 'Compra' : 'Venta'}`,
        html: `
          ${detallesHTML}
          <p><b>Método de pago:</b> ${venta.metodo_pago}</p>
          <p><b>Descripción:</b> ${venta.detalle || 'N/A'}</p>
          <p><b>Fecha:</b> ${formatearFechaHora(venta.fecha)}</p>
        `,
        confirmButtonText: 'Cerrar'
      });
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'No se pudieron cargar los detalles', 'error');
    }
  };

  // --- Ventas y compras ---
  const cargarVentas = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/ventas?activo=1`); 
      setVentas(data.map(v => ({
        ...v,
        tipo: v.id_proveedor ? 'Compra a proveedor' : 'Venta a cliente',
        fecha: formatearFechaHora(v.fecha || v.fecha_compra)
      })));
    } catch (err) {
      console.error('Error cargando ventas y compras:', err);
    }
  };

  const mostrarDetalles = (venta) => {
    const detallesHTML = venta.detalles?.map(d => `
      <p><b>Producto:</b> ${d.Nombre_producto}</p>
      <p><b>Cantidad:</b> ${d.cantidad}</p>
      <p><b>Precio Unitario:</b> $${d.valor_unitario?.toLocaleString() || 0}</p>
      <p><b>Descuento:</b> $${d.descuento?.toLocaleString() || 0}</p>
      <p><b>Subtotal:</b> $${d.subtotal?.toLocaleString() || 0}</p>
      <hr/>
    `).join('') || '<p>No hay detalles.</p>';

    Swal.fire({
      title: `Detalles`,
      html: `
        ${detallesHTML}
        <p><b>Método de pago:</b> ${venta.metodo_pago}</p>
        <p><b>Descripción:</b> ${venta.detalle || 'N/A'}</p>
        <p><b>Fecha:</b> ${venta.fecha}</p>
      `,
      confirmButtonText: 'Cerrar',
    });
  };

  const cancelarVenta = async (venta) => {
    const result = await Swal.fire({
      title: `¿Cancelar ${venta.tipo}?`,
      text: "Esto marcará la venta o compra como inactiva.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, cancelar',
      cancelButtonText: 'Volver',
    });
    if (result.isConfirmed) {
      try {
        await axios.put(`${API_URL}/api/ventas/${venta.id}`, { activo: 0 });
        Swal.fire('Cancelado', `${venta.tipo} cancelada correctamente`, 'success');
        cargarVentas(); 
        cargarPedidos();
      } catch (err) {
        console.error(err); 
        Swal.fire('Error', 'No se pudo cancelar la venta', 'error'); 
      }
    }
  };

const descargarPDF = (venta) => {
  const doc = new jsPDF();
  doc.setFontSize(16);
  doc.text('Detalle de la venta/compra', 20, 20);
  doc.setFontSize(12);
  doc.text(`Generado el: ${formatearFechaHora(new Date())}`, 20, 30);

  const body = venta.detalles?.map(d => [
    d.Nombre_producto,
    d.cantidad,
    `$${d.valor_unitario?.toLocaleString() || 0}`,
    `$${d.descuento?.toLocaleString() || 0}`,
    `$${d.subtotal?.toLocaleString() || 0}`,
    formatearFechaHora(venta.fecha) // <--- Agregamos fecha de la venta a cada fila
  ]) || [];

  autoTable(doc, {
    startY: 40,
    head: [['Producto','Cantidad','Precio Unitario','Descuento','Subtotal','Fecha']],
    body
  });

  doc.save(`detalle_venta_${venta.id}.pdf`);
};

const descargarTodasVentasPDF = () => {
  const doc = new jsPDF();
  doc.setFontSize(16);
  doc.text('Reporte de Ventas y Compras', 20, 20);
  doc.setFontSize(12);
  doc.text(`Generado el: ${formatearFechaHora(new Date())}`, 20, 30);

  const body = ventas.flatMap(v => v.detalles?.map(d => [
    d.Nombre_producto,
    v.tipo,
    d.cantidad,
    `$${d.valor_unitario?.toLocaleString() || 0}`,
    `$${d.descuento?.toLocaleString() || 0}`,
    `$${d.subtotal?.toLocaleString() || 0}`,
    formatearFechaHora(v.fecha) // <--- fecha con hora
  ]) || []);

  autoTable(doc, {
    startY: 40,
    head: [['Producto','Tipo','Cantidad','Precio Unitario','Descuento','Subtotal','Fecha']],
    body
  });

  doc.save('reporte_general.pdf');
};


  return (
    <div className="panelprincipal-container">
      <h1 className="mb-4">Panel Principal</h1>

      {/* Pedidos Pendientes */}
      <section className="mb-5">
        <h3>Pedidos Pendientes</h3>
        {pedidos.length === 0 ? <p>No hay pedidos pendientes.</p> : (
          <table className="table">
            <thead><tr><th>Tipo</th><th>Acciones</th></tr></thead>
            <tbody>
              {pedidos.map(p => (
                <tr key={p.id}>
                  <td>{p.tipo || 'Pedido'}</td>
                  <td>
                    <button className="btn-outline-ver" onClick={() => mostrarDetallesActividad(p)}>Ver</button>
                    <button className="btn-outline-confirmar" onClick={() => confirmarPedido(p)}>Confirmar</button>
                    <button className="btn-outline-cancelar" onClick={() => cancelarPedido(p)}>Cancelar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {/* Stock Crítico */}
      <section className="mb-5">
        <h3>Stock Crítico</h3>
        {productosCriticos.length === 0 ? <p>Stock suficiente.</p> : (
          <div className="stock-critico-container">
            <div style={{ flex: 1 }}>
              <h5>Paquete</h5>
              <table className="table table-bordered">
                <thead><tr><th>Producto</th><th>Stock</th></tr></thead>
                <tbody>
                  {productosCriticos.filter(p => p.tipo_producto === 'paquete').slice(0, 5).map(p => (
                    <tr key={p.id}>
                      <td>{p.Nombre_producto}</td>
                      <td style={{ color: 'red', fontWeight: 'bold' }}>{p.stockMostrar}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ flex: 1 }}>
              <h5>Gramaje</h5>
              <table className="table table-bordered">
                <thead><tr><th>Producto</th><th>Stock</th></tr></thead>
                <tbody>
                  {productosCriticos.filter(p => p.tipo_producto === 'gramaje').slice(0, 5).map(p => (
                    <tr key={p.id}>
                      <td>{p.Nombre_producto}</td>
                      <td style={{ color: 'red', fontWeight: 'bold' }}>{p.stockMostrar}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>

      {/* Actividad Reciente */}
      <section className="mb-5">
        <h3>Actividad Reciente</h3>
        <div className="tabs-container">
          {['Usuarios','Proveedores','Productos','Ventas'].map(tab => (
            <button
              key={tab}
              className={`tab-btn-outline ${tabActivo === tab ? 'tab-activo-outline' : ''}`}
              onClick={() => setTabActivo(tab)}
            >{tab}</button>
          ))}
        </div>
        <ul className="list-group">
          {actividadRecienteFiltrada.map((a, i) => (
            <li key={i} className="list-group-item d-flex justify-content-between align-items-start">
              <div>
                <strong>{a.tipo}</strong>: {a.detalle}
                {(a.tipo === 'Venta' || a.tipo === 'Compra') && (
                  <button className="btn-outline-ver-detalles mt-1" onClick={() => mostrarDetallesActividad(a)}>
                    Ver detalles
                  </button>
                )}
              </div>
              <span className="badge bg-secondary">{formatearFechaHora(a.fecha)}</span>
            </li>
          ))}
          {actividadRecienteFiltrada.length === 0 && <li className="list-group-item">No hay registros recientes.</li>}
        </ul>
      </section>

      {/* Ventas y Compras */}
      <section className="mb-5">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3>Ventas y Compras</h3>
          <button className="btn-outline-descargar" onClick={descargarTodasVentasPDF}>Descargar PDF</button>
        </div>
        {ventas.length === 0 ? (
          <p>No hay ventas o compras registradas.</p>
        ) : (
          <table className="table table-hover table-striped">
            <thead>
              <tr>
                <th>Tipo</th>
                <th>Cantidad</th>
                <th>Subtotal</th>
                <th>Método</th>
                <th>Fecha</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {ventas.map(v => {
                const cantidadTotal = v.detalles?.reduce((acc, d) => acc + Number(d.cantidad || 0), 0) || 0;
                const subtotalTotal = v.detalles?.reduce((acc, d) => acc + Number(d.subtotal || 0), 0) || 0;

                return (
                  <tr key={v.id}>
                    <td>{v.tipo}</td>
                    <td>{cantidadTotal}</td>
                    <td>${subtotalTotal.toLocaleString()}</td>
                    <td>{v.metodo_pago}</td>
                    <td>{v.fecha}</td>
                    <td>
                      <button className="btn-outline-ver" onClick={() => mostrarDetalles(v)}>Ver</button>
                      <button className="btn-outline-cancelar-venta" onClick={() => cancelarVenta(v)}>Cancelar</button>
                      <button className="btn-outline-pdf" onClick={() => descargarPDF(v)}>PDF</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}

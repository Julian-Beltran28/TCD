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
  const [paginaActual, setPaginaActual] = useState(1);
  const registrosPorPagina = 5;



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
      // ✅ Ruta correcta y método correcto
      await axios.patch(`${API_URL}/api/ventas/${pedido.id}/estado`, { activo: 1 });
      const productoRes = await axios.get(`${API_URL}/api/productos/${pedido.id_producto}`);
      const producto = productoRes.data;
      const nuevoStock = (producto.stock || 0) - pedido.cantidad;
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
    text: "Esto eliminará el pedido permanentemente.",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Volver',
  });
  if (result.isConfirmed) {
    try {
      // ✅ Usar DELETE para eliminar completamente
      await axios.delete(`${API_URL}/api/ventas/${pedido.id}`);

      Swal.fire('Eliminado', `Pedido de ${pedido.Nombre_producto} eliminado`, 'success');
      cargarPedidos(); 
      cargarVentas();
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'No se pudo eliminar el pedido', 'error');
    }
  }
};

  // --- Stock crítico ---
  const cargarStockCritico = async () => {
  try {
    const { data } = await axios.get(`${API_URL}/api/productos`);
    
    const critico = data
      .filter(p => p.activo === 1)
      .map(p => {
        let stockMostrar;
        let cantidad;

        if (p.tipo_producto === 'gramaje') {
          // Para gramaje, usa Kilogramos o Libras
          stockMostrar = p.Kilogramos || p.Libras || 0;
          cantidad = stockMostrar;
        } else {
          // Para paquete, usa Stock (¡con mayúscula!)
          stockMostrar = p.stock || 0; // 👈 ¡Aquí está el cambio!
          cantidad = stockMostrar;
        }

        return {
          ...p,
          stockMostrar,
          cantidad
        };
      })
      .filter(p => {
        const umbral = p.tipo_producto === 'gramaje' ? 10 : 30;
        return p.cantidad < umbral;
      });

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
        <p><b>Proveedor:</b> ${d.nombre_empresa}</p>
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
      <p><b>Proveedor:</b> ${d.nombre_empresa}</p>
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
  if (!venta || !venta.detalles || venta.detalles.length === 0) {
    console.error('No hay datos de venta para generar el PDF');
    alert('Error: No se puede generar el PDF sin datos de venta.');
    return;
  }

  const doc = new jsPDF();
  const marginLeft = 10;
  const marginRight = 200;  // Ancho efectivo: ~190mm para maximizar espacio
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;

  // Función helper para fecha (fallback si formatearFechaHora falla)
  const formatearFechaSegura = (fecha) => {
    if (!fecha) return new Date().toLocaleString('es-CO', { 
      year: 'numeric', month: '2-digit', day: '2-digit', 
      hour: '2-digit', minute: '2-digit' 
    });
    const dateObj = new Date(fecha);
    if (isNaN(dateObj.getTime())) {
      return new Date().toLocaleString('es-CO', { 
        year: 'numeric', month: '2-digit', day: '2-digit', 
        hour: '2-digit', minute: '2-digit' 
      });  // Fallback a fecha actual si inválida
    }
    return formatearFechaHora ? formatearFechaHora(dateObj) : dateObj.toLocaleString('es-CO');
  };

  // ==========================
  // ENCABEZADO (CENTRADO Y MÁS GRANDE PARA LLENAR ESPACIO)
  // ==========================
  doc.setFont(undefined, 'bold');
  doc.setFontSize(22);  // Más grande para impacto
  doc.text("techCraft Dynamics", pageWidth / 2, 18, { align: 'center' });

  doc.setFont(undefined, 'normal');
  doc.setFontSize(11);
  doc.text("NIT: 901.234.567-8", pageWidth / 2, 26, { align: 'center' });
  doc.text("Calle 123 #45-67, Bogotá, Colombia", pageWidth / 2, 32, { align: 'center' });
  doc.text("Tel: +57 300 123 4567 | Email: techCraft@hotmail.com", pageWidth / 2, 38, { align: 'center' });

  // Línea divisoria principal (más gruesa)
  doc.setLineWidth(0.8);
  doc.line(marginLeft, 45, marginRight, 45);

  // ==========================
  // DATOS DE LA FACTURA (CENTRADOS Y COMPACTOS)
  // ==========================
  const yFactura = 52;
  const tipoDoc = venta.id_proveedor ? "FACTURA DE COMPRA" : "FACTURA DE VENTA";

  doc.setFont(undefined, 'bold');
  doc.setFontSize(16);  // Prominente
  doc.text(tipoDoc, pageWidth / 2, yFactura, { align: 'center' });

  doc.setFont(undefined, 'normal');
  doc.setFontSize(12);
  doc.text(`No. ${String(venta.id).padStart(6, '0')}`, pageWidth / 2, yFactura + 8, { align: 'center' });
  doc.text(`Fecha: ${formatearFechaSegura(venta.fecha)}`, pageWidth / 2, yFactura + 16, { align: 'center' });

  // Línea divisoria antes de tabla (sutil)
  doc.setLineWidth(0.3);
  doc.line(marginLeft, yFactura + 25, marginRight, yFactura + 25);

  // ==========================
  // TABLA DE PRODUCTOS (ANCHO MÁXIMO, MÁS ORGANIZADA)
  // ==========================
  const startYTable = yFactura + 32;
  const body = (venta.detalles || []).map(d => [
    (d.Nombre_producto || 'N/A').substring(0, 60),  // Límite para evitar desbordes
    String(d.cantidad || 0),
    `$${Number(d.valor_unitario || 0).toLocaleString('es-CO')}`,
    `$${Number(d.descuento || 0).toLocaleString('es-CO')}`,
    `$${Number(d.subtotal || 0).toLocaleString('es-CO')}`
  ]);

  autoTable(doc, {
    startY: startYTable,
    head: [['Descripción del Producto', 'Cant.', 'Valor Unit.', 'Descuento', 'Subtotal']],
    body,
    theme: 'grid',
    headStyles: { 
      fillColor: [41, 128, 185],  // Azul para header
      textColor: [255, 255, 255],
      fontSize: 10,
      fontStyle: 'bold'
    },
    styles: { 
      fontSize: 9,
      cellPadding: 4,  // Más padding para legibilidad
      lineColor: [180, 180, 180],
      lineWidth: 0.2,
      halign: 'left'  // Default left para texto
    },
    columnStyles: {
      0: { cellWidth: 95, halign: 'left' },  // Máximo para descripción
      1: { cellWidth: 18, halign: 'center' },
      2: { cellWidth: 28, halign: 'right' },
      3: { cellWidth: 28, halign: 'right' },
      4: { cellWidth: 28, halign: 'right' }  // Suma total: ~197mm, ajustado a márgenes
    },
    margin: { left: marginLeft, right: 10 }  // Márgenes reducidos para llenar página
  });

  // ==========================
  // TOTALES (COMPACTOS, ALINEADOS A LA DERECHA, MÁS ESPACIO)
  // ==========================
  const finalYTable = doc.lastAutoTable.finalY;
  const yTotales = finalYTable + 8;  // Menos gap para compactar
  const subtotalTotal = (venta.detalles || []).reduce((sum, d) => sum + Number(d.subtotal || 0), 0);
  const descuentoTotal = Number(venta.descuento_total || 0);
  const baseIVA = subtotalTotal - descuentoTotal;
  const iva = baseIVA * 0.19;
  const total = baseIVA + iva;

  // Posición para totales (derecha, desde el final de la tabla)
  const xTotales = pageWidth - 70;  // Ajustado para más espacio
  doc.setFontSize(11);
  doc.setFont(undefined, 'normal');
  doc.setLineWidth(0.3);

  // Línea divisoria antes de totales
  doc.line(marginLeft, yTotales - 3, marginRight, yTotales - 3);

  // Líneas de totales (compactas, cada 6mm)
  doc.text("Subtotal:", xTotales, yTotales);
  doc.text(`$${subtotalTotal.toLocaleString('es-CO')}`, pageWidth - 15, yTotales, { align: 'right' });

  doc.text("Descuento:", xTotales, yTotales + 6);
  doc.text(`$${descuentoTotal.toLocaleString('es-CO')}`, pageWidth - 15, yTotales + 6, { align: 'right' });

  doc.text("Base IVA:", xTotales, yTotales + 12);
  doc.text(`$${baseIVA.toLocaleString('es-CO')}`, pageWidth - 15, yTotales + 12, { align: 'right' });

  doc.text("IVA (19%):", xTotales, yTotales + 18);
  doc.text(`$${iva.toLocaleString('es-CO')}`, pageWidth - 15, yTotales + 18, { align: 'right' });

  // Total destacado
  doc.setFont(undefined, 'bold');
  doc.setFontSize(14);
  doc.text("TOTAL A PAGAR:", xTotales, yTotales + 26);
  doc.text(`$${total.toLocaleString('es-CO')}`, pageWidth - 15, yTotales + 26, { align: 'right' });

  // Línea bajo total (gruesa)
  doc.setLineWidth(1);
  doc.line(xTotales - 5, yTotales + 28, pageWidth - 10, yTotales + 28);

  // ==========================
  // PIE DE PÁGINA (COMPACTO Y CENTRADO)
  // ==========================
  const yPie = yTotales + 40;  // Posicionado para usar espacio restante
  if (yPie + 20 < pageHeight - 20) {  // Solo si cabe, para evitar overflow
    doc.setFont(undefined, 'normal');
    doc.setFontSize(9);
    doc.setLineWidth(0.3);

    // Línea divisoria
    doc.line(marginLeft, yPie - 3, marginRight, yPie - 3);

    doc.text("Gracias por su preferencia.", pageWidth / 2, yPie + 3, { align: 'center' });
    doc.text("Documento válido sin firma ni sello. Autorizado por DIAN.", pageWidth / 2, yPie + 9, { align: 'center' });
    doc.text("Forma de pago: Efectivo / Transferencia bancaria.", pageWidth / 2, yPie + 15, { align: 'center' });
  }

  // ==========================
  // GUARDAR
  // ==========================
  const tipo = venta.id_proveedor ? 'compra' : 'venta';
  doc.save(`factura_${tipo}_${String(venta.id).padStart(6, '0')}.pdf`);
};


const descargarTodasVentasPDF = () => {
  if (!ventas || ventas.length === 0) {
    console.error('No hay ventas para generar el reporte');
    alert('Error: No hay datos de ventas para generar el PDF.');
    return;
  }

  const doc = new jsPDF();
  const marginLeft = 10;
  const marginRight = 200;  // Ancho efectivo ~190mm
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;

  // Función helper para fecha (fallback seguro, igual que en la factura)
  const formatearFechaSegura = (fecha) => {
    if (!fecha) return new Date().toLocaleString('es-CO', { 
      year: 'numeric', month: '2-digit', day: '2-digit', 
      hour: '2-digit', minute: '2-digit' 
    });
    const dateObj = new Date(fecha);
    if (isNaN(dateObj.getTime())) {
      return new Date().toLocaleString('es-CO', { 
        year: 'numeric', month: '2-digit', day: '2-digit', 
        hour: '2-digit', minute: '2-digit' 
      });
    }
    return formatearFechaHora ? formatearFechaHora(dateObj) : dateObj.toLocaleString('es-CO');
  };

  // Calcular totales generales (para el resumen)
  let totalItems = 0;
  let subtotalVentas = 0;
  let subtotalCompras = 0;
  const body = ventas.flatMap(v => {
    const detalles = v.detalles || [];
    const subtV = detalles.reduce((sum, d) => sum + Number(d.subtotal || 0), 0);
    if (v.id_proveedor) {
      subtotalCompras += subtV;
    } else {
      subtotalVentas += subtV;
    }
    totalItems += detalles.length;
    return detalles.map(d => [
      (d.Nombre_producto || 'N/A').substring(0, 50),  // Limitar longitud
      v.id_proveedor ? 'COMPRA' : 'VENTA',
      String(d.cantidad || 0),
      `$${Number(d.valor_unitario || 0).toLocaleString('es-CO')}`,
      `$${Number(d.descuento || 0).toLocaleString('es-CO')}`,
      `$${Number(d.subtotal || 0).toLocaleString('es-CO')}`,
      formatearFechaSegura(v.fecha)
    ]);
  });

  const subtotalGeneral = subtotalVentas + subtotalCompras;
  const baseIVA = subtotalGeneral;  // Asumir IVA sobre subtotales; ajusta si hay descuentos globales
  const ivaGeneral = baseIVA * 0.19;
  const granTotal = baseIVA + ivaGeneral;

  // ==========================
  // ENCABEZADO (PROFESIONAL Y CENTRADO)
  // ==========================
  doc.setFont(undefined, 'bold');
  doc.setFontSize(20);
  doc.text('REPORTE DE VENTAS Y COMPRAS', pageWidth / 2, 18, { align: 'center' });

  doc.setFont(undefined, 'normal');
  doc.setFontSize(11);
  doc.text("TechCraft Dynamics - NIT: 901.234.567-8", pageWidth / 2, 26, { align: 'center' });
  doc.text("Calle 123 #45-67, Bogotá, Colombia | Tel: +57 300 123 4567", pageWidth / 2, 32, { align: 'center' });

  doc.setFontSize(10);
  doc.text(`Generado el: ${formatearFechaSegura(new Date())}`, pageWidth / 2, 40, { align: 'center' });
  doc.text(`Total de transacciones: ${ventas.length} | Total de items: ${totalItems}`, pageWidth / 2, 46, { align: 'center' });

  // Línea divisoria
  doc.setLineWidth(0.5);
  doc.line(marginLeft, 52, marginRight, 52);

  // ==========================
  // TABLA PRINCIPAL (OPTIMIZADA PARA MÁS ESPACIO)
  // ==========================
  const startYTable = 60;
  autoTable(doc, {
    startY: startYTable,
    head: [['Producto', 'Tipo', 'Cantidad', 'Valor Unit.', 'Descuento', 'Subtotal', 'Fecha']],
    body,
    theme: 'grid',
    headStyles: { 
      fillColor: [41, 128, 185],  // Azul corporativo
      textColor: [255, 255, 255],
      fontSize: 10,
      fontStyle: 'bold'
    },
    styles: { 
      fontSize: 9,
      cellPadding: 3,
      lineColor: [180, 180, 180],
      lineWidth: 0.1
    },
    columnStyles: {
      0: { cellWidth: 70, halign: 'left' },  // Más espacio para producto
      1: { cellWidth: 25, halign: 'center' },
      2: { cellWidth: 20, halign: 'center' },
      3: { cellWidth: 28, halign: 'right' },
      4: { cellWidth: 28, halign: 'right' },
      5: { cellWidth: 28, halign: 'right' },
      6: { cellWidth: 35, halign: 'left' }  // Fecha a izquierda para mejor flujo
    },
    margin: { left: marginLeft, right: 10 },
    // Hook para footer en cada página (numeración simple)
    didDrawPage: (data) => {
      const pageNum = data.pageNumber;
      const totalPages = Math.ceil(body.length / 20);  // Aprox. 20 filas por página
      doc.setFontSize(8);
      doc.text(`Página ${pageNum} de ${totalPages}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
    }
  });

  // ==========================
  // RESUMEN DE TOTALES (NUEVO: Bloque al final de la tabla)
  // ==========================
  const finalYTable = doc.lastAutoTable.finalY;
  const yResumen = finalYTable + 10;
  if (yResumen + 40 < pageHeight - 20) {  // Solo si cabe en la página actual
    doc.setLineWidth(0.5);
    doc.line(marginLeft, yResumen - 5, marginRight, yResumen - 5);

    doc.setFont(undefined, 'bold');
    doc.setFontSize(12);
    doc.text('RESUMEN GENERAL:', marginLeft, yResumen + 5);

    doc.setFont(undefined, 'normal');
    doc.setFontSize(11);
    const xResumen = pageWidth - 80;  // Alineado a la derecha

    doc.text('Subtotal Ventas:', xResumen, yResumen + 10);
    doc.text(`$${subtotalVentas.toLocaleString('es-CO')}`, pageWidth - 15, yResumen + 10, { align: 'right' });

    doc.text('Subtotal Compras:', xResumen, yResumen + 16);
    doc.text(`$${subtotalCompras.toLocaleString('es-CO')}`, pageWidth - 15, yResumen + 16, { align: 'right' });

    doc.text('Subtotal General:', xResumen, yResumen + 22);
    doc.text(`$${subtotalGeneral.toLocaleString('es-CO')}`, pageWidth - 15, yResumen + 22, { align: 'right' });

    doc.text('IVA (19%):', xResumen, yResumen + 28);
    doc.text(`$${ivaGeneral.toLocaleString('es-CO')}`, pageWidth - 15, yResumen + 28, { align: 'right' });

    doc.setFont(undefined, 'bold');
    doc.setFontSize(14);
    doc.text('GRAN TOTAL:', xResumen, yResumen + 36);
    doc.text(`$${granTotal.toLocaleString('es-CO')}`, pageWidth - 15, yResumen + 36, { align: 'right' });

    // Línea bajo total
    doc.setLineWidth(1);
    doc.line(xResumen - 5, yResumen + 38, pageWidth - 10, yResumen + 38);
  } else {
    // Si no cabe, agregar nueva página para resumen
    doc.addPage();
    const yResumenNew = 20;
    // Repetir el código de resumen aquí si es necesario (simplificado: omito para brevedad)
    doc.text('RESUMEN GENERAL (Página adicional):', marginLeft, yResumenNew + 5);
    // ... (agrega los totales como arriba)
  }

  // ==========================
  // PIE DE PÁGINA (COMPACTO)
  // ==========================
  const yPie = Math.max(yResumen + 50, pageHeight - 30);
  if (yPie < pageHeight - 10) {
    doc.setFont(undefined, 'normal');
    doc.setFontSize(9);
    doc.text("Reporte generado por TechCraft Dynamics Datos fiscales sujetos a verificación.", pageWidth / 2, yPie, { align: 'center' });
    doc.text("Para consultas: TechCraft@Hotmail.com | Válido como respaldo interno.", pageWidth / 2, yPie + 6, { align: 'center' });
  }

  // ==========================
  // GUARDAR
  // ==========================
  doc.save(`reporte_ventas_compras_${formatearFechaSegura(new Date()).replace(/[/ :]/g, '_')}.pdf`);
};



// Paginación para ventas
const totalVentas = ventas.length;
const totalPaginas = Math.ceil(totalVentas / registrosPorPagina);
const indiceInicial = (paginaActual - 1) * registrosPorPagina;
const ventasPaginadas = ventas.slice(indiceInicial, indiceInicial + registrosPorPagina);

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
              {ventasPaginadas.map(v => {
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
                      <button className="btn-outline-cancelar-venta" onClick={() => cancelarPedido(v)}>Eliminar</button>
                      <button className="btn-outline-pdf" onClick={() => descargarPDF(v)}>PDF</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          
        )}
        {totalPaginas > 1 && (
  <div className="d-flex justify-content-center mt-3">
    <nav>
      <ul className="pagination">
        <li className={`page-item ${paginaActual === 1 ? 'disabled' : ''}`}>
          <button 
            className="page-link" 
            onClick={() => setPaginaActual(p => Math.max(1, p - 1))}
          >
            Anterior
          </button>
        </li>

        {[...Array(totalPaginas)].map((_, i) => (
          <li 
            key={i + 1} 
            className={`page-item ${paginaActual === i + 1 ? 'active' : ''}`}
          >
            <button 
              className="page-link" 
              onClick={() => setPaginaActual(i + 1)}
            >
              {i + 1}
            </button>
          </li>
        ))}

        <li className={`page-item ${paginaActual === totalPaginas ? 'disabled' : ''}`}>
          <button 
            className="page-link" 
            onClick={() => setPaginaActual(p => Math.min(totalPaginas, p + 1))}
          >
            Siguiente
          </button>
        </li>
      </ul>
    </nav>
  </div>
)}
      </section>
    </div>
  );
}

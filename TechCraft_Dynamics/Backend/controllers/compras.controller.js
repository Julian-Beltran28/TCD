const db = require('../models/conexion');

// Crear compra a proveedor con productos paquete o gramaje
const crearCompraProveedor = async (req, res) => {
  const { id_proveedor, detalles, metodo_pago, info_pago, detalle_compra } = req.body;

  // Validar que existan detalles
  if (!detalles || !Array.isArray(detalles) || detalles.length === 0) {
    return res.status(400).json({ error: 'Debes enviar al menos un producto en la compra' });
  }

  // Construir valores para insertar múltiples registros
  const valores = detalles.map(item => {
    const esPaquete = item.tipo === 'paquete';

    return [
      id_proveedor,
      esPaquete ? item.producto_id : null,            // id_ProductosPaquete
      !esPaquete ? item.producto_id : null,           // id_ProductosGramaje
      item.cantidad,
      item.precio_compra,
      item.descuento || 0,
      (item.precio_compra * item.cantidad) - (item.descuento || 0), // Subtotal
      metodo_pago,
      JSON.stringify(info_pago || {}),
      detalle_compra || ''
    ];
  });

  const query = `
    INSERT INTO DetalleCompraProveedores (
      id_proveedor,
      id_ProductosPaquete,
      id_ProductosGramaje,
      cantidad,
      precio_compra,
      descuento,
      subtotal,
      metodo_pago,
      info_pago,
      detalle_compra
    ) VALUES ?
  `;

  try {
    await db.query(query, [valores]);
    res.status(201).json({ mensaje: 'Compra registrada correctamente' });
  } catch (err) {
    console.error('Error al registrar compra:', err);
    res.status(500).json({ error: 'Error al registrar compra' });
  }
};

// Función segura para parsear JSON
const safeParseJSON = (json) => {
  if (!json) return null;
  try {
    return typeof json === 'string' ? JSON.parse(json) : json;
  } catch (err) {
    console.warn('Error al parsear info_pago:', err);
    return null;
  }
};

// 📋 Listar compras a proveedores con JOIN y tipo de producto
const listarComprasProveedores = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        c.id, 
        c.id_proveedor, 
        c.id_ProductosPaquete, 
        c.id_ProductosGramaje,
        c.cantidad, 
        c.precio_compra,
        c.descuento, 
        c.subtotal, 
        c.metodo_pago, 
        c.info_pago,
        c.detalle_compra, 
        c.fecha_compra,
        COALESCE(pp.Nombre_producto, pg.Nombre_producto) AS producto,
        pr.nombre_empresa AS proveedor,
        CASE 
          WHEN c.id_ProductosPaquete IS NOT NULL THEN 'paquete'
          WHEN c.id_ProductosGramaje IS NOT NULL THEN 'gramaje'
          ELSE 'desconocido'
        END AS tipo
      FROM DetalleCompraProveedores c
      LEFT JOIN ProductosPaquete pp ON c.id_ProductosPaquete = pp.id
      LEFT JOIN ProductosGramaje pg ON c.id_ProductosGramaje = pg.id
      JOIN Proveedores pr ON c.id_proveedor = pr.id
      ORDER BY c.id DESC
    `);

    const compras = rows.map(row => ({
      id: row.id,
      proveedor: row.proveedor,
      tipo: row.tipo,
      producto: row.producto,
      cantidad: row.cantidad,
      precio_compra: row.precio_compra,
      descuento: row.descuento,
      subtotal: row.subtotal,
      metodo_pago: row.metodo_pago,
      info_pago: safeParseJSON(row.info_pago),
      detalle_compra: row.detalle_compra,
      fecha_compra: row.fecha_compra
    }));

    res.json(compras);
  } catch (err) {
    console.error('Error al listar compras:', err);
    res.status(500).json({ error: 'Error al listar compras' });
  }
};

// ✏️ Actualizar compra a proveedor con validación de tipo
const actualizarCompraProveedor = async (req, res) => {
  const { id } = req.params;
  const {
    id_proveedor,
    id_ProductosPaquete,
    id_ProductosGramaje,
    cantidad,
    precio_compra,
    descuento,
    metodo_pago,
    info_pago,
    detalle_compra
  } = req.body;

  // Validar que sea solo uno: paquete o gramaje
  if ((id_ProductosPaquete && id_ProductosGramaje) || (!id_ProductosPaquete && !id_ProductosGramaje)) {
    return res.status(400).json({
      error: 'Debes enviar solo un tipo de producto: Paquete o Gramaje'
    });
  }

  try {
    await db.query(`
      UPDATE DetalleCompraProveedores
      SET 
        id_proveedor = ?,
        id_ProductosPaquete = ?,
        id_ProductosGramaje = ?,
        cantidad = ?,
        precio_compra = ?,
        descuento = ?,
        metodo_pago = ?,
        info_pago = ?,
        detalle_compra = ?
      WHERE id = ?
    `, [
      id_proveedor,
      id_ProductosPaquete || null,
      id_ProductosGramaje || null,
      cantidad,
      precio_compra,
      descuento,
      metodo_pago,
      JSON.stringify(info_pago || {}),
      detalle_compra || '',
      id
    ]);

    res.json({ mensaje: 'Compra actualizada correctamente' });
  } catch (err) {
    console.error('Error al actualizar compra:', err);
    res.status(500).json({ error: 'Error al actualizar compra' });
  }
};

// ❌ Eliminar compra individual
const eliminarCompraProveedor = async (req, res) => {
  const { id } = req.params;

  try {
    await db.query(`DELETE FROM DetalleCompraProveedores WHERE id = ?`, [id]);
    res.json({ mensaje: 'Compra eliminada correctamente' });
  } catch (err) {
    console.error('Error al eliminar compra:', err);
    res.status(500).json({ error: 'Error al eliminar compra' });
  }
};

module.exports = {
  listarComprasProveedores,
  crearCompraProveedor,
  actualizarCompraProveedor,
  eliminarCompraProveedor
};


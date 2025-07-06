const db = require('../models/conexion');

// Listar compras a proveedores
const listarComprasProveedores = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT c.id, c.id_proveedor, c.id_producto, c.cantidad, c.precio_compra,
             c.descuento, c.subtotal, c.metodo_pago, c.info_pago,
             c.detalle_compra, c.fecha_compra,
             p.Nombre_productos AS producto,
             pr.nombre_empresa AS proveedor
      FROM DetalleCompraProveedores c
      JOIN Productos p ON c.id_producto = p.id
      JOIN Proveedores pr ON c.id_proveedor = pr.id
      ORDER BY c.id DESC
    `);

    const compras = rows.map(row => ({
      id: row.id,
      proveedor: row.proveedor,
      producto: row.producto,
      cantidad: row.cantidad,
      precio_compra: row.precio_compra,
      descuento: row.descuento,
      subtotal: row.subtotal,
      metodo_pago: row.metodo_pago,
      info_pago: typeof row.info_pago === 'string' ? JSON.parse(row.info_pago) : row.info_pago,
      detalle_compra: row.detalle_compra,
      fecha_compra: row.fecha_compra
    }));

    res.json(compras);
  } catch (err) {
    console.error('Error al listar compras:', err);
    res.status(500).json({ error: 'Error al listar compras' });
  }
};

// Actualizar compra
const actualizarCompraProveedor = async (req, res) => {
  const { id } = req.params;
  const {
    id_proveedor, id_producto, cantidad,
    precio_compra, descuento, metodo_pago,
    info_pago, detalle_compra
  } = req.body;

  try {
    await db.query(`
      UPDATE DetalleCompraProveedores
      SET id_proveedor = ?, id_producto = ?, cantidad = ?, precio_compra = ?,
          descuento = ?, metodo_pago = ?, info_pago = ?, detalle_compra = ?
      WHERE id = ?
    `, [
      id_proveedor, id_producto, cantidad, precio_compra,
      descuento, metodo_pago, JSON.stringify(info_pago), detalle_compra, id
    ]);

    res.json({ mensaje: 'Compra actualizada correctamente' });
  } catch (err) {
    console.error('Error al actualizar compra:', err);
    res.status(500).json({ error: 'Error al actualizar compra' });
  }
};

// Eliminar compra individual
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
  actualizarCompraProveedor,
  eliminarCompraProveedor
};

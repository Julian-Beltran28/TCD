// src/controllers/proveedores.controller.js
const db = require('../models/conexion');

// Listar proveedores
const listarProveedores = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT id, nombre_empresa, imagen_empresa FROM Proveedores"
    );
    res.json(rows);
  } catch (err) {
    console.error('Error al listar proveedores:', err);
    res.status(500).json({ error: err.message });
  }
};

// Listar productos por proveedor
const listarProductosPorProveedor = async (req, res) => {
  const idProveedor = req.params.id;
  try {
    const [rows] = await db.query(
      "SELECT * FROM Productos WHERE id_proveedor = ?",
      [idProveedor]
    );
    res.json(rows);
  } catch (err) {
    console.error('Error al listar productos por proveedor:', err);
    res.status(500).json({ error: err.message });
  }
};

// Comprar productos (aumentar stock y registrar compra)
const comprarProductos = async (req, res) => {
  const detalles = req.body; // [{ producto_id, cantidad, ... }]

  const connection = await db.getConnection();
  await connection.beginTransaction();

  try {
    for (const d of detalles) {
      // 1. Aumentar el stock
      await connection.query(
        "UPDATE Productos SET stock = stock + ? WHERE id = ?",
        [d.cantidad, d.producto_id]
      );

      // 2. Insertar en DetalleCompraProveedores
      await connection.query(
        `INSERT INTO DetalleCompraProveedores 
        (id_proveedor, id_producto, cantidad, precio_compra, descuento, metodo_pago, info_pago, detalle_compra) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          d.id_proveedor,
          d.producto_id,
          d.cantidad,
          d.valor_unitario,
          d.descuento || 0,
          d.metodo_pago,
          JSON.stringify(d.info_pago),
          d.detalle_venta
        ]
      );
    }

    await connection.commit();
    res.json({ mensaje: 'Compra registrada y stock actualizado' });
  } catch (err) {
    await connection.rollback();
    console.error('Error al registrar compra:', err);
    res.status(500).json({ error: 'Error al procesar la compra' });
  } finally {
    connection.release();
  }
};

// Listar compras de proveedores
const listarComprasProveedores = async (req, res) => {
  const query = `
    SELECT iv.id, iv.metodo_pago, iv.info_pago, iv.Detalle_Compra AS descripcion, iv.fecha,
           iv.cantidad AS Cantidad, iv.precio_compra AS Valor_Unitario, iv.descuento AS Descuento,
           (iv.cantidad * iv.precio_compra - iv.descuento) AS SubTotal,
           p.Nombre_productos
    FROM DetalleCompraProveedores iv
    JOIN Productos p ON iv.id_producto = p.id
    ORDER BY iv.id DESC
  `;

  try {
    const [rows] = await db.query(query);
    const compras = rows.map(row => ({
      id: row.id,
      producto: row.Nombre_productos,
      cantidad: row.Cantidad,
      valor_unitario: row.Valor_Unitario,
      descuento: row.Descuento,
      subtotal: row.SubTotal,
      metodo_pago: row.metodo_pago,
      info_pago: typeof row.info_pago === 'string'
        ? JSON.parse(row.info_pago)
        : row.info_pago,
      descripcion: row.descripcion,
      fecha: row.fecha
    }));

    res.json(compras);
  } catch (err) {
    console.error('Error al listar compras:', err);
    res.status(500).json({ error: 'Error al listar las compras' });
  }
};

module.exports = {
  listarProveedores,
  listarProductosPorProveedor,
  comprarProductos,
  listarComprasProveedores
};

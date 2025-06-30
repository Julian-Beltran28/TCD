const db = require('../models/conexion');

// Listar proveedores
const listarProveedores = (req, res) => {
  db.query(
    "SELECT id, nombre_empresa, imagen_empresa FROM Proveedores",
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    }
  );
};

// Listar productos por proveedor
const listarProductosPorProveedor = (req, res) => {
  const idProveedor = req.params.id;
  db.query(
    "SELECT * FROM Productos WHERE id_proveedor = ?",
    [idProveedor],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    }
  );
};

// Comprar productos (aumentar stock y registrar compra)
const comprarProductos = (req, res) => {
  const detalles = req.body; // [{ producto_id, cantidad, descuento, metodo_pago, info_pago, detalle_venta }]

  const queries = detalles.map((d) =>
    new Promise((resolve, reject) => {
      // 1. Actualizar stock
      db.query(
        "UPDATE Productos SET stock = stock + ? WHERE id = ?",
        [d.cantidad, d.producto_id], // Aquí también debes asegurarte de que d.producto_id esté definido
        (err) => {
          if (err) return reject(err);

          // 2. Insertar en DetalleCompraProveedores
          db.query(
            `INSERT INTO DetalleCompraProveedores 
            (id_proveedor, id_producto, cantidad, precio_compra, descuento, metodo_pago, info_pago, detalle_compra) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              d.id_proveedor, // Asegúrate de que este campo esté en el objeto d
              d.producto_id, // Cambia producto_id a id_producto
              d.cantidad,
              d.valor_unitario,
              d.descuento || 0,
              d.metodo_pago,
              JSON.stringify(d.info_pago),
              d.detalle_venta,
            ],
            (err2) => (err2 ? reject(err2) : resolve())
          );
        }
      );
    })
  );

  Promise.all(queries)
    .then(() => res.json({ mensaje: 'Compra registrada y stock actualizado' }))
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: 'Error al procesar la compra' });
    });
};




module.exports = {
  listarProveedores,
  listarProductosPorProveedor,
  comprarProductos
};

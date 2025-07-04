const db = require('../models/conexion');
const fs = require('fs');
const path = require('path');

const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const ListarProveedores = (req, res) => {
  db.query('SELECT * FROM Proveedores WHERE activo != 0 OR activo IS NULL', (err, results) => {
    if (err) {
      console.error("🔥 ERROR EN CONSULTA MySQL:", err.message); // <-- importante
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
};


const ObtenerProveedor = (req, res) => {
  db.query('SELECT * FROM Proveedores WHERE id = ?', [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result[0]);
  });
};

const CrearProveedor = (req, res) => {
  const datos = req.body;
  const imagen = req.file ? req.file.filename : null;
  const proveedor = {
    nombre_empresa: datos.nombre_empresa,
    tipo_exportacion: datos.tipo_exportacion,
    nombre_representante: datos.nombre_representante,
    apellido_representante: datos.apellido_representante,
    numero_empresarial: datos.numero_empresarial,
    correo_empresarial: datos.correo_empresarial,
    imagen_empresa: imagen
  };

  db.query('INSERT INTO Proveedores SET ?', proveedor, (err) => {
  if (err) return res.status(500).json({ error: err.message });
  res.json({ mensaje: 'Proveedor creado' });
});

};

// Soft delete de proveedor
const SoftDeleteProveedor = (req, res) => {
  const id = req.params.id;
  db.query('UPDATE Proveedores SET activo = 0 WHERE id = ?', [id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ mensaje: 'Proveedor eliminado (soft delete)' });
  });
};

const ActualizarProveedor = (req, res) => {
  const datos = req.body;
  const id = req.params.id;
  const nuevoArchivo = req.file ? req.file.filename : null;

  const actualizar = () => {
    const updateData = {
      nombre_empresa: datos.nombre_empresa,
      tipo_exportacion: datos.tipo_exportacion,
      nombre_representante: datos.nombre_representante,
      apellido_representante: datos.apellido_representante,
      numero_empresarial: datos.numero_empresarial,
      correo_empresarial: datos.correo_empresarial,
    };

    if (nuevoArchivo) updateData.imagen_empresa = nuevoArchivo;

    db.query('UPDATE Proveedores SET ? WHERE id = ?', [updateData, id], (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ mensaje: 'Proveedor actualizado' });
    });
  };

  if (nuevoArchivo) {
    db.query('SELECT imagen_empresa FROM Proveedores WHERE id = ?', [id], (err, result) => {
      if (!err && result[0]?.imagen_empresa) {
        const ruta = path.join(__dirname, '../uploads', result[0].imagen_empresa);
        if (fs.existsSync(ruta)) fs.unlinkSync(ruta);
      }
      actualizar();
    });
  } else {
    actualizar();
  }
};

const ListarProductosPorProveedor = (req, res) => {
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

const ComprarProductos = (req, res) => {
  const detalles = req.body;

  const queries = detalles.map((d) =>
    new Promise((resolve, reject) => {
      db.query(
        "UPDATE Productos SET stock = stock + ? WHERE id = ?",
        [d.cantidad, d.producto_id],
        (err) => {
          if (err) return reject(err);

          db.query(
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
  ListarProveedores,
  ObtenerProveedor,
  CrearProveedor,
  ActualizarProveedor,
  SoftDeleteProveedor,
  ListarProductosPorProveedor,
  ComprarProductos
};
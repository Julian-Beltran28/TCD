// src/controllers/proveedores.controller.js
const db = require('../models/conexion');
const fs = require('fs');
const path = require('path');

const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// 📌 Listar proveedores con paginación, orden y filtro por primera letra
const ListarProveedores = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const letra = req.query.letra || "";
    const offset = (page - 1) * limit;

    const filtro = letra ? `AND nombre_empresa LIKE ?` : "";

    const [rows] = await db.query(
      `SELECT id, nombre_empresa, tipo_exportacion, nombre_representante,
              apellido_representante, numero_empresarial, correo_empresarial, imagen_empresa
       FROM Proveedores
       WHERE (activo != 0 OR activo IS NULL) ${filtro}
       ORDER BY id DESC
       LIMIT ? OFFSET ?`,
      letra ? [`${letra}%`, limit, offset] : [limit, offset]
    );

    const [[{ total }]] = await db.query(
      `SELECT COUNT(*) AS total
       FROM Proveedores
       WHERE (activo != 0 OR activo IS NULL) ${filtro}`,
      letra ? [`${letra}%`] : []
    );

    res.json({ proveedores: rows, total });
  } catch (err) {
    console.error('🔥 ERROR EN CONSULTA MySQL:', err.message);
    res.status(500).json({ error: err.message });
  }
};

// 📌 Obtener proveedor por ID
const ObtenerProveedor = async (req, res) => {
  try {
    const [result] = await db.query('SELECT * FROM Proveedores WHERE id = ?', [req.params.id]);
    res.json(result[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 📌 Crear proveedor
const CrearProveedor = async (req, res) => {
  const datos = req.body;
  const imagen = req.file ? req.file.filename : null;

  const proveedor = {
    nombre_empresa: datos.nombre_empresa,
    tipo_exportacion: datos.tipo_exportacion,
    nombre_representante: datos.nombre_representante,
    apellido_representante: datos.apellido_representante,
    numero_empresarial: datos.numero_empresarial,
    correo_empresarial: datos.correo_empresarial,
    imagen_empresa: imagen,
  };

  try {
    await db.query('INSERT INTO Proveedores SET ?', [proveedor]);
    res.json({ mensaje: 'Proveedor creado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 📌 Soft delete proveedor
const SoftDeleteProveedor = async (req, res) => {
  try {
    await db.query('UPDATE Proveedores SET activo = 0 WHERE id = ?', [req.params.id]);
    res.json({ mensaje: 'Proveedor eliminado (soft delete)' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 📌 Actualizar proveedor
const ActualizarProveedor = async (req, res) => {
  const datos = req.body;
  const id = req.params.id;
  const nuevoArchivo = req.file ? req.file.filename : null;

  try {
    if (nuevoArchivo) {
      const [result] = await db.query('SELECT imagen_empresa FROM Proveedores WHERE id = ?', [id]);
      if (result[0]?.imagen_empresa) {
        const ruta = path.join(__dirname, '../uploads', result[0].imagen_empresa);
        if (fs.existsSync(ruta)) fs.unlinkSync(ruta);
      }
    }

    const updateData = {
      nombre_empresa: datos.nombre_empresa,
      tipo_exportacion: datos.tipo_exportacion,
      nombre_representante: datos.nombre_representante,
      apellido_representante: datos.apellido_representante,
      numero_empresarial: datos.numero_empresarial,
      correo_empresarial: datos.correo_empresarial,
    };

    if (nuevoArchivo) updateData.imagen_empresa = nuevoArchivo;

    await db.query('UPDATE Proveedores SET ? WHERE id = ?', [updateData, id]);

    res.json({ mensaje: 'Proveedor actualizado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 📌 Listar productos de paquete y gramaje por proveedor
const ListarProductosPorProveedor = async (req, res) => {
  const idProveedor = req.params.id;
  try {
    const [paquetes] = await db.query(
      'SELECT *, "paquete" AS tipo FROM ProductosPaquete WHERE id_Proveedor = ? AND activo = 1',
      [idProveedor]
    );

    const [gramajes] = await db.query(
      'SELECT *, "gramaje" AS tipo FROM ProductosGramaje WHERE id_Proveedor = ? AND activo = 1',
      [idProveedor]
    );

    res.json([...paquetes, ...gramajes]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 📌 Comprar productos y actualizar stock
const ComprarProductos = async (req, res) => {
  const detalles = req.body;

  try {
    const promises = detalles.map(async (d) => {
      if (d.tipo_producto === 'paquete') {
        await db.query(
          'UPDATE ProductosPaquete SET stock = stock + ? WHERE id = ?',
          [d.cantidad, d.producto_id]
        );
      } else if (d.tipo_producto === 'gramaje') {
        // Aquí sumamos solo kilogramos o libras según lo que venga
        if (d.unidad === 'kilogramos') {
          await db.query(
            'UPDATE ProductosGramaje SET Kilogramos = Kilogramos + ? WHERE id = ?',
            [d.cantidad, d.producto_id]
          );
        } else if (d.unidad === 'libras') {
          await db.query(
            'UPDATE ProductosGramaje SET Libras = Libras + ? WHERE id = ?',
            [d.cantidad, d.producto_id]
          );
        }
      }

      await db.query(
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
        ]
      );
    });

    await Promise.all(promises);

    res.json({ mensaje: 'Compra registrada y stock actualizado' });
  } catch (err) {
    console.error('🔥 ERROR AL COMPRAR PRODUCTOS:', err);
    res.status(500).json({ error: 'Error al procesar la compra' });
  }
};

module.exports = {
  ListarProveedores,
  ObtenerProveedor,
  CrearProveedor,
  ActualizarProveedor,
  SoftDeleteProveedor,
  ListarProductosPorProveedor,
  ComprarProductos,
};

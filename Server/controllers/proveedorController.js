const path = require('path');
const fs = require('fs');
const db = require('../config/db');

// Crear carpeta uploads si no existe
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

exports.registrarProveedor = (req, res) => {
  const { nombre, exportacion, represent, apellido, numero, correo } = req.body;
  const imagen = req.file;

  if (!imagen) {
    return res.status(400).json({ mensaje: 'Imagen no proporcionada' });
  }

  const sql = `
    INSERT INTO proveedores 
    (nombre_empresa, tipo_exportacion, nombre_representante, apellido_representante, numero_empresarial, correo_empresarial, imagen_empresa) 
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [nombre, exportacion, represent, apellido, numero, correo, imagen.filename],
    (err) => {
      if (err) {
        console.error('Error al insertar proveedor:', err);
        return res.status(500).json({ mensaje: 'Error al registrar proveedor' });
      }
      res.json({ mensaje: 'Proveedor registrado con imagen' });
    }
  );
};

exports.listarProveedores = (req, res) => {
  db.query("SELECT * FROM proveedores", (err, result) => {
    if (err) return res.status(500).send("Error al obtener proveedores");
    res.json(result);
  });
};

exports.obtenerProveedor = (req, res) => {
  const id = parseInt(req.params.id);
  db.query("SELECT * FROM proveedores WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ mensaje: "Error al obtener proveedor" });
    if (result.length === 0) return res.status(404).json({ mensaje: "Proveedor no encontrado" });
    res.json(result[0]);
  });
};

exports.actualizarProveedor = (req, res) => {
  const id = req.params.id;
  const { nombre, exportacion, represent, apellido, numero, correo } = req.body;
  const imagen = req.file ? req.file.filename : null;

  let sql, values;

  if (imagen) {
    sql = `
      UPDATE proveedores 
      SET nombre_empresa = ?, tipo_exportacion = ?, nombre_representante = ?, apellido_representante = ?, 
          numero_empresarial = ?, correo_empresarial = ?, imagen_empresa = ?
      WHERE id = ?
    `;
    values = [nombre, exportacion, represent, apellido, numero, correo, imagen, parseInt(id)];
  } else {
    sql = `
      UPDATE proveedores 
      SET nombre_empresa = ?, tipo_exportacion = ?, nombre_representante = ?, apellido_representante = ?, 
          numero_empresarial = ?, correo_empresarial = ?
      WHERE id = ?
    `;
    values = [nombre, exportacion, represent, apellido, numero, correo, parseInt(id)];
  }

  db.query(sql, values, (err) => {
    if (err) return res.status(500).send("Error al actualizar proveedor");
    res.send("Proveedor actualizado correctamente");
  });
};

exports.eliminarProveedor = (req, res) => {
  const id = parseInt(req.params.id);
  db.query("DELETE FROM proveedores WHERE id = ?", [id], (err) => {
    if (err) return res.status(500).send("Error al eliminar proveedor");
    res.send("Proveedor eliminado correctamente");
  });
};

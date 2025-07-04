const db = require('../models/conexion');
const fs = require('fs');
const path = require('path');

exports.listarProveedores = (req, res) => {
  db.query('SELECT * FROM proveedores', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

exports.obtenerProveedor = (req, res) => {
  db.query('SELECT * FROM proveedores WHERE id = ?', [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result[0]);
  });
};

exports.crearProveedor = (req, res) => {
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

  db.query('INSERT INTO proveedores SET ?', proveedor, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ mensaje: 'Proveedor creado' });
  });
};

exports.actualizarProveedor = (req, res) => {
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

    db.query('UPDATE proveedores SET ? WHERE id = ?', [updateData, id], (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ mensaje: 'Proveedor actualizado' });
    });
  };

  if (nuevoArchivo) {
    db.query('SELECT imagen_empresa FROM proveedores WHERE id = ?', [id], (err, result) => {
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

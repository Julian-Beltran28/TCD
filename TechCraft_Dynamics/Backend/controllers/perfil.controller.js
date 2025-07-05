const db = require('../config/db.config');
const fs = require('fs');
const path = require('path');

// Obtener perfil de usuario por ID
const obtenerPerfil = (req, res) => {
  const id = req.params.id;
  db.query('SELECT id, nombre, apellido, correo, rol, imagen FROM usuarios WHERE id = ?', [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(results[0]);
  });
};

// Actualizar perfil de usuario
const actualizarPerfil = (req, res) => {
  const id = req.params.id;
  const { nombre, apellido, correo } = req.body;
  const nuevaImagen = req.file ? req.file.filename : null;

  const actualizar = () => {
    const updateData = { nombre, apellido, correo };
    if (nuevaImagen) updateData.imagen = nuevaImagen;

    db.query('UPDATE usuarios SET ? WHERE id = ?', [updateData, id], (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ mensaje: 'Perfil actualizado' });
    });
  };

  if (nuevaImagen) {
    db.query('SELECT imagen FROM usuarios WHERE id = ?', [id], (err, results) => {
      if (!err && results[0]?.imagen) {
        const ruta = path.join(__dirname, '../uploads', results[0].imagen);
        if (fs.existsSync(ruta)) fs.unlinkSync(ruta);
      }
      actualizar();
    });
  } else {
    actualizar();
  }
};

module.exports = {
  obtenerPerfil,
  actualizarPerfil,
};
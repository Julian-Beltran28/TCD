const db = require('../models/conexion');
const fs = require('fs');
const path = require('path');

// Obtener perfil de usuario por ID
const obtenerPerfil = async (req, res) => {
  const id = req.params.id;

  try {
    const [results] = await db.query(`
      SELECT 
        u.id,
        u.Primer_Nombre,
        u.Segundo_Nombre,
        u.Primer_Apellido,
        u.Segundo_Apellido,
        u.Tipo_documento,
        u.Numero_documento,
        u.Numero_celular,
        u.Correo_personal,
        u.Correo_empresarial,
        u.contrasena,
        r.nombreRol AS Rol,
        u.imagen
      FROM Usuarios u
      LEFT JOIN Roles r ON u.id_Rol = r.id
      WHERE u.id = ?
    `, [id]);

    if (results.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json(results[0]);
  } catch (err) {
    console.error("Error en obtenerPerfil:", err);
    res.status(500).json({ error: 'Error interno al consultar perfil' });
  }
};

// Actualizar perfil de usuario
const actualizarPerfil = async (req, res) => {
  const id = req.params.id;

  const {
    Primer_Nombre,
    Segundo_Nombre,
    Primer_Apellido,
    Segundo_Apellido,
    Tipo_documento,
    Numero_documento,
    Numero_celular,
    Correo_personal,
    Correo_empresarial
  } = req.body;

  const nuevaImagen = req.file ? req.file.filename : null;

  const updateData = {
    Primer_Nombre,
    Segundo_Nombre,
    Primer_Apellido,
    Segundo_Apellido,
    Tipo_documento,
    Numero_documento,
    Numero_celular,
    Correo_personal,
    Correo_empresarial
  };

  if (nuevaImagen) updateData.imagen = nuevaImagen;

  try {
    if (nuevaImagen) {
      const [rows] = await db.query('SELECT imagen FROM Usuarios WHERE id = ?', [id]);
      const imagenAnterior = rows[0]?.imagen;
      if (imagenAnterior) {
        const ruta = path.join(__dirname, '../uploads', imagenAnterior);
        if (fs.existsSync(ruta)) fs.unlinkSync(ruta);
      }
    }

    await db.query('UPDATE Usuarios SET ? WHERE id = ?', [updateData, id]);
    res.json({ mensaje: 'Perfil actualizado correctamente' });

  } catch (err) {
    console.error("Error en actualizarPerfil:", err);
    res.status(500).json({ error: 'Error interno al actualizar perfil' });
  }
};

module.exports = {
  obtenerPerfil,
  actualizarPerfil
};

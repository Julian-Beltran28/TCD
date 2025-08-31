const db = require('../models/conexion');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

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
    res.status(500).json({ error: err.message });
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
    res.status(500).json({ error: err.message });
  }
};

// Cambiar contraseña
const cambiarPassword = async (req, res) => {
  const id = req.params.id;
  const { passwordActual, passwordNueva } = req.body;

  console.log("ID recibido:", id);
  console.log("Body recibido:", req.body);

  try {
    // 1. Obtener contraseña guardada en BD
    const [rows] = await db.query('SELECT Contrasena FROM Usuarios WHERE id = ?', [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const contraseñaBD = rows[0].Contrasena;

    // 2. Comparar contraseña actual
    const match = await bcrypt.compare(passwordActual, contraseñaBD);
    if (!match) {
      return res.status(400).json({ error: 'La contraseña actual es incorrecta' });
    }

    // 3. Hashear nueva contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(passwordNueva, salt);

    // 4. Guardar nueva en BD
    await db.query('UPDATE Usuarios SET Contrasena = ? WHERE id = ?', [hashedPassword, id]);

    res.json({ mensaje: 'Contraseña actualizada correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


module.exports = {
  obtenerPerfil,
  actualizarPerfil,
  cambiarPassword
};

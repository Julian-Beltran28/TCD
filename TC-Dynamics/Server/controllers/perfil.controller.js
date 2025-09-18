const db = require('../models/conexion');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');


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

  // LOGS DE DEPURACIÓN
  console.log("=== INICIO ACTUALIZAR PERFIL ===");
  console.log("ID del usuario:", id);
  console.log("req.body completo:", JSON.stringify(req.body, null, 2));
  console.log("req.file:", req.file);

  const {
    Primer_Nombre,
    Segundo_Nombre,
    Primer_Apellido,
    Segundo_Apellido,
    Tipo_documento,
    Numero_documento,
    Numero_celular,
    Correo_personal,
    Correo_empresarial,
    password 
  } = req.body;

  // LOG ESPECÍFICO DE PASSWORD
  console.log("Contraseña recibida:", password);
  console.log("¿Hay contraseña?:", !!password);
  console.log("¿Contraseña no vacía?:", password && password.trim() !== '');

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

  console.log("updateData inicial:", JSON.stringify(updateData, null, 2));

  try {

    if (password && password.trim() !== '') {
      console.log("PROCESANDO CONTRASEÑA...");
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      updateData.contrasena = hashedPassword;
      console.log("Contraseña hasheada exitosamente");
      console.log("Hash generado:", hashedPassword);
    } else {
      console.log("NO SE PROCESÓ CONTRASEÑA - Razón:", !password ? "password es falsy" : "password está vacío");
    }

    if (nuevaImagen) {
      updateData.imagen = nuevaImagen;
      console.log("Nueva imagen:", nuevaImagen);
      
      const [rows] = await db.query('SELECT imagen FROM Usuarios WHERE id = ?', [id]);
      const imagenAnterior = rows[0]?.imagen;
      if (imagenAnterior) {
        const ruta = path.join(__dirname, '../uploads', imagenAnterior);
        if (fs.existsSync(ruta)) fs.unlinkSync(ruta);
        console.log("Imagen anterior eliminada:", imagenAnterior);
      }
    }

    console.log("updateData final:", JSON.stringify(updateData, null, 2));

    console.log("Ejecutando query de actualización...");
    const [result] = await db.query('UPDATE Usuarios SET ? WHERE id = ?', [updateData, id]);
    console.log("Resultado de la query:", result);
    
    res.json({ 
      success: true,
      mensaje: 'Perfil actualizado correctamente',
      passwordChanged: !!password,
      affectedRows: result.affectedRows
    });

    console.log("=== FIN ACTUALIZAR PERFIL ===");

  } catch (err) {
    console.error("Error en actualizarPerfil:", err);
    res.status(500).json({ error: 'Error interno al actualizar perfil' });
  }
};

module.exports = {
  obtenerPerfil,
  actualizarPerfil
};
const db = require('../models/conexion');
const jwt = require('jsonwebtoken');

const SECRET_KEY = 'tu_clave_super_segura';

const loginUsuario = async (req, res) => {
  const { correo, contrasena } = req.body;

  try {
    const [result] = await db.query(
      `SELECT u.*, r.nombreRol AS rol 
       FROM Usuarios u 
       JOIN Roles r ON u.id_Rol = r.id 
       WHERE u.Correo_empresarial = ? OR u.Correo_personal = ?`,
      [correo, correo]
    );

    if (result.length === 0) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    const usuario = result[0];

    if (contrasena !== usuario.Contrasena) {
      return res.status(401).json({ mensaje: 'Contraseña incorrecta' });
    }

    const payload = {
  id: usuario.id,
  rol: usuario.rol.toLowerCase(), // ✅ ← CAMBIADO AQUÍ
  nombre: `${usuario.Primer_Nombre} ${usuario.Primer_Apellido}`
};


    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '3h' });

    res.json({
      token,
      usuario: {
        id: usuario.id,
        nombre: payload.nombre,
        rol: payload.rol,
        email: usuario.Correo_empresarial || usuario.Correo_personal,
      },
    });

  } catch (error) {
    console.error('Error al autenticar:', error);
    res.status(500).json({ mensaje: 'Error del servidor' });
  }
};

module.exports = {
  loginUsuario,
};

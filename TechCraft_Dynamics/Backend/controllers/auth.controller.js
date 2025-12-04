const db = require('../models/conexion');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');


const SECRET_KEY = process.env.JWT_SECRET || 'clave_fuerte_backend';

const loginUsuario = async (req, res) => {
  const { correo, contrasena } = req.body;

  try {
    if (!correo || !contrasena) {
      return res.status(400).json({ ok: false, mensaje: 'Faltan datos en la solicitud' });
    }

    // Buscar usuario
    const [result] = await db.query(
      `SELECT u.*, r.nombreRol AS rol
       FROM Usuarios u
       JOIN Roles r ON u.id_Rol = r.id
       WHERE u.Correo_empresarial = ? OR u.Correo_personal = ?`,
      [correo, correo]
    );

    if (!result || result.length === 0) {
      return res.status(401).json({ ok: false, mensaje: 'Usuario o contraseña incorrecta' });
    }

    const usuario = result[0];

    // Verificar contraseña
    const contraseñaValida = await bcrypt.compare(contrasena, usuario.Contrasena);
    if (!contraseñaValida) {
      return res.status(401).json({ ok: false, mensaje: 'Usuario o contraseña incorrecta' });
    }

    // Payload del token
    const payload = {
      id: usuario.id,
      rol: usuario.rol?.toLowerCase() || "sin rol",
      nombre: `${usuario.Primer_Nombre} ${usuario.Primer_Apellido}`
    };

    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '3h' });

    return res.json({
      ok: true,
      mensaje: "Inicio de sesión exitoso",
      token,
      usuario: {
        id: usuario.id,
        nombre: payload.nombre,
        rol: payload.rol,
        correo: usuario.Correo_empresarial || usuario.Correo_personal
      }
    });

  } catch (error) {
    console.error("🔥 Error al autenticar:", error);
    return res.status(500).json({ ok: false, mensaje: "Error interno del servidor" });
  }
};

module.exports = { loginUsuario };

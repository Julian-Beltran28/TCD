import { pool } from '../config/db.js';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config(); // Cargar variables de entorno

export const loginUser = async (req, res) => {
  const { correo, contrasena } = req.body;

  try {
    const [rows] = await pool.query(`
      SELECT u.*, r.nombreRol 
      FROM Usuarios u
      JOIN Roles r ON u.id_Rol = r.id
      WHERE u.Correo_empresarial = ?
    `, [correo]);

    if (rows.length === 0) {
      return res.send("Usuario no encontrado");
    }

    const usuario = rows[0];
    const match = await bcrypt.compare(contrasena, usuario.Contrasena);

    if (!match) {
      return res.send("Contraseña incorrecta");
    }

    // ✅ Generar token JWT
    const token = jwt.sign(
      {
        id: usuario.id,
        correo: usuario.Correo_empresarial,
        rol: usuario.nombreRol
      },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    //  Enviar token y rol en respuesta JSON
    return res.json({
      message: "Login exitoso",
      token: token,
      rol: usuario.nombreRol
    });

  } catch (err) {
    console.error("Error en login:", err);
    res.status(500).send("Error del servidor");
  }
};

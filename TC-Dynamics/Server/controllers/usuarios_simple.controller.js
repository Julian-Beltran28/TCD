const db = require('../config/db');
const bcryptjs = require('bcryptjs');
const crypto = require('crypto');

// Generar una contraseña aleatoria de 10 caracteres
function generarContrasena() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  return Array.from({ length: 10 }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join('');
}

// Crear un nuevo usuario - VERSION SIMPLE
const crearUsuario = async (req, res) => {
  console.log('🔥🔥🔥 RAILWAY SIMPLE VERSION 🔥🔥🔥');
  
  try {
    const {
      Primer_Nombre, Segundo_Nombre, Primer_Apellido,
      Segundo_Apellido, Tipo_documento, Numero_documento,
      Numero_celular, Correo_personal, Correo_empresarial, id_Rol, Contrasena
    } = req.body;

    console.log('🔥 PASSWORD RECIBIDA:', Contrasena);

    // Obtener contraseña
    const rawPassword = Contrasena || generarContrasena();
    console.log('🔥 PASSWORD A ENCRIPTAR:', rawPassword);
    
    // ENCRIPTACIÓN SIMPLE CON BCRYPTJS
    let encryptedPassword;
    
    try {
      console.log('🔥 USANDO BCRYPTJS...');
      encryptedPassword = bcryptjs.hashSync(rawPassword, 10);
      console.log('🔥 BCRYPTJS RESULTADO:', encryptedPassword);
    } catch (error) {
      console.log('🔥 BCRYPTJS FALLO, USANDO SHA256...');
      encryptedPassword = '$sha256$' + crypto.createHash('sha256').update(rawPassword + 'SALT2024').digest('hex');
      console.log('🔥 SHA256 RESULTADO:', encryptedPassword);
    }
    
    console.log('🔥 PASSWORD FINAL:', encryptedPassword);
    console.log('🔥 ES DIFERENTE?', encryptedPassword !== rawPassword);
    
    // Validación básica
    if (Contrasena && rawPassword.length < 8) {
      return res.status(400).json({ error: 'La contraseña debe tener al menos 8 caracteres' });
    }

    // SQL INSERT
    const sql = `
      INSERT INTO Usuarios 
      (Primer_Nombre, Segundo_Nombre, Primer_Apellido, Segundo_Apellido, Contrasena,
       Tipo_documento, Numero_documento, Numero_celular, 
       Correo_personal, Correo_empresarial, id_Rol, activo)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`;

    const values = [
      Primer_Nombre, Segundo_Nombre, Primer_Apellido,
      Segundo_Apellido, encryptedPassword, Tipo_documento, Numero_documento,
      Numero_celular, Correo_personal, Correo_empresarial, id_Rol
    ];

    console.log('🔥 VALORES PARA DB:', values);
    console.log('🔥 PASSWORD EN ARRAY:', values[4]);

    const [result] = await db.query(sql, values);
    
    console.log('🔥 USUARIO CREADO CON ID:', result.insertId);
    
    // Respuesta
    const response = {
      message: 'Usuario creado exitosamente',
      id: result.insertId
    };
    
    if (!Contrasena) {
      response.contrasena = rawPassword;
      response.info = 'Contraseña generada automáticamente';
    } else {
      response.info = 'Contraseña establecida por el usuario';
    }

    res.status(201).json(response);
    
  } catch (error) {
    console.error('🔥 ERROR COMPLETO:', error);
    res.status(500).json({ 
      error: 'Error al crear usuario',
      details: error.message 
    });
  }
};

module.exports = {
  crearUsuario
};
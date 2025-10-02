const db = require('../models/conexion');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

// Cambiar contraseña del usuario
const cambiarContrasena = async (req, res) => {
  const id = req.params.id;
  const { nuevaContrasena } = req.body;

  if (!nuevaContrasena || nuevaContrasena.length < 6) {
    return res.status(400).json({ error: 'La nueva contraseña es inválida o muy corta' });
  }

  try {
    const hash = bcrypt.hashSync(nuevaContrasena, 10);
    await db.query('UPDATE Usuarios SET Contrasena = ? WHERE id = ?', [hash, id]);
    res.json({ message: 'Contraseña actualizada correctamente' });
  } catch (error) {
    console.error('❌ Error al cambiar contraseña:', error);
    res.status(500).json({ error: error.message });
  }
};

// Generar una contraseña aleatoria de 10 caracteres
function generarContrasena() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  return Array.from({ length: 10 }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join('');
}

// Función de fallback para encriptación usando crypto nativo
function encriptarConCrypto(password) {
  try {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    return `$crypto$${salt}$${hash}`;
  } catch (error) {
    console.error('❌ Error en encriptación con crypto:', error);
    throw error;
  }
}

// Función para verificar contraseñas (bcrypt o crypto)
function verificarContrasena(password, hash) {
  try {
    if (hash.startsWith('$2a$') || hash.startsWith('$2b$') || hash.startsWith('$2y$')) {
      // Hash de bcrypt
      return bcrypt.compareSync(password, hash);
    } else if (hash.startsWith('$crypto$')) {
      // Hash de crypto
      const parts = hash.split('$');
      if (parts.length !== 4) return false;
      
      const salt = parts[2];
      const storedHash = parts[3];
      const testHash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
      
      return testHash === storedHash;
    }
    return false;
  } catch (error) {
    console.error('❌ Error al verificar contraseña:', error);
    return false;
  }
}

// Obtener todos los usuarios activos
const getUsuarios = async (req, res) => {
  try {
    const [results] = await db.query('SELECT * FROM Usuarios WHERE activo = 1');
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Obtener un usuario por ID
const getUsuarioPorId = async (req, res) => {
  const id = req.params.id;
  try {
    const [results] = await db.query('SELECT * FROM Usuarios WHERE id = ?', [id]);
    if (results.length === 0) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json(results[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Crear un nuevo usuario
const crearUsuario = async (req, res) => {
  console.log('�🚨🚨 RAILWAY DEBUG - FUNCIÓN CREAR USUARIO LLAMADA 🚨🚨🚨');
  console.log('🚨 TIMESTAMP:', new Date().toISOString());
  console.log('🚨 REQUEST BODY RAW:', JSON.stringify(req.body, null, 2));
  
  try {
    const {
      Primer_Nombre, Segundo_Nombre, Primer_Apellido,
      Segundo_Apellido, Tipo_documento, Numero_documento,
      Numero_celular, Correo_personal, Correo_empresarial, id_Rol, Contrasena
    } = req.body;

    console.log('🚨 CONTRASEÑA EXTRAÍDA:', {
      existe: !!Contrasena,
      tipo: typeof Contrasena,
      valor: Contrasena, // MOSTRAR VALOR REAL PARA DEBUG
      longitud: Contrasena ? Contrasena.length : 'N/A'
    });

    // OBTENER CONTRASEÑA (simple)
    const rawPassword = Contrasena || generarContrasena();
    console.log('� RAW PASSWORD FINAL:', rawPassword, 'LENGTH:', rawPassword.length);
    
    // ENCRIPTAR INMEDIATAMENTE (sin condiciones) - FORZAR LOGS
    console.log('🚨 INICIANDO ENCRIPTACIÓN CON CRYPTO...');
    const salt = crypto.randomBytes(16).toString('hex');
    console.log('🚨 SALT GENERADO:', salt);
    const hashValue = crypto.pbkdf2Sync(rawPassword, salt, 10000, 64, 'sha512').toString('hex');
    console.log('🚨 HASH VALUE GENERADO:', hashValue.substring(0, 20) + '...');
    const encryptedPassword = `$crypto$${salt}$${hashValue}`;
    console.log('🚨 ENCRYPTED PASSWORD FINAL:', encryptedPassword.substring(0, 30) + '...');
    
    console.log('🚨 VERIFICACIÓN DE ENCRIPTACIÓN:', {
      originalPassword: rawPassword,
      encryptedPassword: encryptedPassword.substring(0, 50) + '...',
      sonIguales: rawPassword === encryptedPassword,
      encryptedLength: encryptedPassword.length,
      startsWithCrypto: encryptedPassword.startsWith('$crypto$')
    });
    
    // VALIDACIÓN SIMPLE DE CONTRASEÑA (solo si no fue generada automáticamente)
    if (Contrasena && rawPassword.length < 8) {
      return res.status(400).json({ error: 'La contraseña debe tener al menos 8 caracteres' });
    }

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

    console.log('🚨🚨🚨 PRE-INSERCIÓN DATABASE 🚨🚨🚨');
    console.log('🚨 SQL QUERY:', sql);
    console.log('🚨 VALUES ARRAY:', values);
    console.log('🚨 PASSWORD EN POSITION 4:', values[4]);
    console.log('🚨 PASSWORD TYPE:', typeof values[4]);
    console.log('🚨 PASSWORD LENGTH:', values[4] ? values[4].length : 'N/A');
    console.log('🚨 PASSWORD PREVIEW:', values[4] ? values[4].substring(0, 30) + '...' : 'NULL');
    
    console.log('💾 INSERCIÓN EN BD - Preparando inserción:', {
      passwordHash: {
        exists: !!encryptedPassword,
        length: encryptedPassword.length,
        startsCorrect: encryptedPassword.startsWith('$crypto$'),
        prefix: encryptedPassword.substring(0, 15)
      },
      valuesCount: values.length
    });

    const [result] = await db.query(sql, values);
    
    console.log('✅ ÉXITO - Usuario insertado en BD:', {
      userId: result.insertId,
      affectedRows: result.affectedRows
    });
    
    // Solo devolver la contraseña si fue generada automáticamente
    const response = {
      message: 'Usuario creado exitosamente',
      id: result.insertId
    };
    
    // Si no se proporcionó contraseña, se generó automáticamente y la devolvemos
    if (!Contrasena) {
      response.contrasena = rawPassword;
    }
    
    res.status(201).json(response);
  } catch (error) {
    console.error('❌ Error general al crear usuario:', error);
    console.error('❌ Mensaje:', error.message);
    console.error('❌ Stack:', error.stack);
    
    // Proporcionar información más específica del error
    let errorMessage = 'Error interno del servidor';
    if (error.message) {
      errorMessage = error.message;
    }
    
    res.status(500).json({ 
      error: errorMessage,
      details: 'Error al crear el usuario en la base de datos',
      timestamp: new Date().toISOString()
    });
  }
};

// Actualizar usuario
const actualizarUsuario = async (req, res) => {
  const id = req.params.id;
  const {
    Primer_Nombre, Segundo_Nombre, Primer_Apellido,
    Segundo_Apellido, Tipo_documento, Numero_documento,
    Numero_celular, Correo_personal, Correo_empresarial, id_Rol
  } = req.body;

  const sql = `
    UPDATE Usuarios SET
    Primer_Nombre = ?, Segundo_Nombre = ?, Primer_Apellido = ?, Segundo_Apellido = ?,
    Tipo_documento = ?, Numero_documento = ?, Numero_celular = ?, 
    Correo_personal = ?, Correo_empresarial = ?, id_Rol = ?
    WHERE id = ?`;

  const values = [
    Primer_Nombre, Segundo_Nombre, Primer_Apellido, Segundo_Apellido,
    Tipo_documento, Numero_documento, Numero_celular,
    Correo_personal, Correo_empresarial, id_Rol, id
  ];

  try {
    await db.query(sql, values);
    res.json({ message: 'Usuario actualizado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Eliminar (desactivar) usuario
const eliminarUsuario = async (req, res) => {
  const id = req.params.id;
  try {
    await db.query('UPDATE Usuarios SET activo = 0 WHERE id = ?', [id]);
    res.json({ message: 'Usuario eliminado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Listar usuarios paginados con búsqueda por letra
const listarUsuarios = async (req, res) => {
  const { page = 1, limit = 10, letra = '' } = req.query;
  const offset = (page - 1) * limit;

  try {
    let query;
    let countQuery;
    let values;

    if (letra) {
      query = `
        SELECT * FROM Usuarios 
        WHERE activo = 1 AND Primer_Nombre LIKE ? 
        ORDER BY Primer_Nombre ASC 
        LIMIT ? OFFSET ?
      `;
      countQuery = `
        SELECT COUNT(*) AS total 
        FROM Usuarios 
        WHERE activo = 1 AND Primer_Nombre LIKE ?
      `;
      values = [`${letra}%`, parseInt(limit), offset];
    } else {
      query = `
        SELECT * FROM Usuarios 
        WHERE activo = 1 
        ORDER BY Primer_Nombre ASC 
        LIMIT ? OFFSET ?
      `;
      countQuery = `
        SELECT COUNT(*) AS total 
        FROM Usuarios 
        WHERE activo = 1
      `;
      values = [parseInt(limit), offset];
    }

    const [usuarios] = await db.query(query, values);
    const [totalResult] = await db.query(countQuery, letra ? [`${letra}%`] : []);
    const total = totalResult[0].total;

    res.json({ usuarios, total });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Exportar funciones
module.exports = {
  getUsuarios,
  getUsuarioPorId,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario,
  cambiarContrasena,
  listarUsuarios
};

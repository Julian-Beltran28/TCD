const db = require('../models/conexion');
const bcrypt = require('bcryptjs');

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
  try {
    const {
      Primer_Nombre, Segundo_Nombre, Primer_Apellido,
      Segundo_Apellido, Tipo_documento, Numero_documento,
      Numero_celular, Correo_personal, Correo_empresarial, id_Rol, Contrasena
    } = req.body;

    // Usar la contraseña enviada desde el frontend o generar una nueva
    const contrasenaFinal = Contrasena || generarContrasena();
    
    // Validar contraseña segura (solo si no está ya encriptada)
    if (!contrasenaFinal.startsWith('$2a$') && !contrasenaFinal.startsWith('$2b$') && !contrasenaFinal.startsWith('$2y$')) {
      if (contrasenaFinal.length < 8) {
        return res.status(400).json({ error: 'La contraseña debe tener al menos 8 caracteres' });
      }
      
      // Validar criterios de seguridad
      const tieneMinuscula = /[a-z]/.test(contrasenaFinal);
      const tieneMayuscula = /[A-Z]/.test(contrasenaFinal);
      const tieneNumero = /[0-9]/.test(contrasenaFinal);
      const tieneEspecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(contrasenaFinal);
      
      if (!tieneMinuscula || !tieneMayuscula || !tieneNumero || !tieneEspecial) {
        return res.status(400).json({ 
          error: 'La contraseña debe incluir mayúsculas, minúsculas, números y caracteres especiales' 
        });
      }
    }

    // Verificar si la contraseña ya está encriptada (bcrypt hashes empiezan con $2a$, $2b$, etc.)
    let hash;
    if (contrasenaFinal.startsWith('$2a$') || contrasenaFinal.startsWith('$2b$') || contrasenaFinal.startsWith('$2y$')) {
      // La contraseña ya está encriptada
      hash = contrasenaFinal;
      console.log('✅ Contraseña ya encriptada recibida del frontend');
    } else {
      // Encriptar la contraseña con manejo de errores mejorado
      try {
        console.log('🔐 Iniciando encriptación de contraseña...');
        console.log('🔐 Tipo de bcrypt:', typeof bcrypt);
        console.log('🔐 Función hashSync disponible:', typeof bcrypt.hashSync === 'function');
        console.log('🔐 Longitud de contraseña:', contrasenaFinal.length);
        
        // Validar que bcrypt esté disponible
        if (!bcrypt || typeof bcrypt.hashSync !== 'function') {
          throw new Error('bcryptjs no está disponible o no es válido');
        }
        
        // Usar método síncrono con bcryptjs para mejor compatibilidad
        hash = bcrypt.hashSync(contrasenaFinal, 10);
        console.log('✅ Contraseña encriptada exitosamente en el backend');
        
      } catch (bcryptError) {
        console.error('❌ Error al encriptar contraseña:', bcryptError);
        console.error('❌ Mensaje del error:', bcryptError.message);
        console.error('❌ Stack del error:', bcryptError.stack);
        
        // Enviar error específico al frontend
        return res.status(500).json({ 
          error: 'Error al procesar la contraseña: ' + bcryptError.message,
          details: 'El servidor tuvo problemas al encriptar la contraseña'
        });
      }
    }

    const sql = `
      INSERT INTO Usuarios 
      (Primer_Nombre, Segundo_Nombre, Primer_Apellido, Segundo_Apellido, Contrasena,
       Tipo_documento, Numero_documento, Numero_celular, 
       Correo_personal, Correo_empresarial, id_Rol, activo)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`;

    const values = [
      Primer_Nombre, Segundo_Nombre, Primer_Apellido,
      Segundo_Apellido, hash, Tipo_documento, Numero_documento,
      Numero_celular, Correo_personal, Correo_empresarial, id_Rol
    ];

    const [result] = await db.query(sql, values);
    
    // Solo devolver la contraseña si fue generada automáticamente
    const response = {
      message: 'Usuario creado exitosamente',
      id: result.insertId
    };
    
    // Si no se proporcionó contraseña, se generó automáticamente y la devolvemos
    if (!Contrasena) {
      response.contrasena = contrasenaFinal;
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

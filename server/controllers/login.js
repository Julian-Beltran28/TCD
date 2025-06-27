// server.js
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Configuración de seguridad
app.use(helmet());
app.use(morgan('combined'));

// Configuración de CORS
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));

// Middleware para parsear JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 5, // máximo 5 intentos por IP
    message: {
        error: 'Demasiados intentos de inicio de sesión. Intenta de nuevo en 15 minutos.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Simulación de base de datos (en producción usar MongoDB, PostgreSQL, etc.)
const users = [
    {
        id: 1,
        correo: 'sr.mateusstiven@gmail.com',
        contrasena: '$12$uGsTaBXn6Itsw3VwAY8kSuZ5YKKWE5CY3o48e.WHrVwsbz5RGMYNG', // password
        nombre: 'Administrador',
        rol: 'admin'
    },
    {
        id: 2,
        correo: 'usuario@ejemplo.com',
        contrasena: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
        nombre: 'Usuario',
        rol: 'user'
    }
];

// Middleware para verificar JWT
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Token de acceso requerido' });
    }

    jwt.verify(token, process.env.JWT_SECRET || 'tu-clave-secreta', (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Token inválido' });
        }
        req.user = user;
        next();
    });
};

// Rutas

// Ruta de login
app.post('/login', loginLimiter, async (req, res) => {
    try {
        const { correo, contrasena } = req.body;

        // Validación de datos
        if (!correo || !contrasena) {
            return res.status(400).json({
                error: 'Correo y contraseña son requeridos'
            });
        }

        // Buscar usuario
        const user = users.find(u => u.correo === correo);
        if (!user) {
            return res.status(401).json({
                error: 'Credenciales inválidas'
            });
        }

        // Verificar contraseña
        const isValidPassword = await bcrypt.compare(contrasena, user.contrasena);
        if (!isValidPassword) {
            return res.status(401).json({
                error: 'Credenciales inválidas'
            });
        }

        // Generar JWT
        const token = jwt.sign(
            { 
                id: user.id, 
                correo: user.correo, 
                rol: user.rol 
            },
            process.env.JWT_SECRET || 'tu-clave-secreta',
            { expiresIn: '24h' }
        );

        res.json({
            message: 'Inicio de sesión exitoso',
            token,
            user: {
                id: user.id,
                correo: user.correo,
                nombre: user.nombre,
                rol: user.rol
            }
        });

    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({
            error: 'Error interno del servidor'
        });
    }
});

// Ruta para verificar token
app.get('/verify-token', authenticateToken, (req, res) => {
    res.json({
        valid: true,
        user: req.user
    });
});

// Ruta protegida del panel de administración
app.get('/dashboard', authenticateToken, (req, res) => {
    res.json({
        message: 'Bienvenido al panel de administración',
        user: req.user,
        data: {
            stats: {
                totalUsers: users.length,
                activeUsers: users.filter(u => u.rol === 'user').length,
                adminUsers: users.filter(u => u.rol === 'admin').length
            }
        }
    });
});

// Ruta para obtener perfil del usuario
app.get('/profile', authenticateToken, (req, res) => {
    const user = users.find(u => u.id === req.user.id);
    if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json({
        id: user.id,
        correo: user.correo,
        nombre: user.nombre,
        rol: user.rol
    });
});

// Ruta para logout (opcional, para invalidar token del lado del cliente)
app.post('/logout', authenticateToken, (req, res) => {
    res.json({
        message: 'Sesión cerrada exitosamente'
    });
});

// Ruta para cambiar contraseña
app.post('/change-password', authenticateToken, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        
        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                error: 'Contraseña actual y nueva contraseña son requeridas'
            });
        }

        const user = users.find(u => u.id === req.user.id);
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        // Verificar contraseña actual
        const isValidPassword = await bcrypt.compare(currentPassword, user.contrasena);
        if (!isValidPassword) {
            return res.status(401).json({
                error: 'Contraseña actual incorrecta'
            });
        }

        // Hashear nueva contraseña
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        user.contrasena = hashedNewPassword;

        res.json({
            message: 'Contraseña actualizada exitosamente'
        });

    } catch (error) {
        console.error('Error al cambiar contraseña:', error);
        res.status(500).json({
            error: 'Error interno del servidor'
        });
    }
});

// Manejo de errores 404
app.use((req, res) => {
    res.status(404).json({
        error: 'Ruta no encontrada'
    });
});

// Manejo de errores globales
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Error interno del servidor'
    });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(` Servidor corriendo en puerto ${PORT}`);
    console.log(` Frontend URL: ${process.env.FRONTEND_URL | 'http://localhost:3000'}`);
    console.log(` Usuarios de prueba:`);
    console.log(`   Admin: admin@ejemplo.com / password`);
    console.log(`   Usuario: usuario@ejemplo.com / password`);
});

module.exports = app;
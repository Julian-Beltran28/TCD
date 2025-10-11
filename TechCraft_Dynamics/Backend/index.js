const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Base de datos
const db = require('./models/conexion');

// Rutas
const ventasRoutes = require('./routes/ventas.routes');
const productosRoutes = require('./routes/productos.routes');
const proveedoresRoutes = require('./routes/proveedores.routes');
const authRoutes = require('./routes/auth.routes');
const perfilRoutes = require('./routes/perfil.routes');
const usuariosRoutes = require('./routes/usuarios.routes');
const categoriasRoutes = require('./routes/Categorias.routes');
const subcategoriasRoutes = require('./routes/Subcategorias.routes');

// Swagger
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Detectar URL base dinámicamente
const SERVER_URL = process.env.SERVER_URL || `http://localhost:${process.env.PORT || 4000}`;

// Configuración Swagger
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API del proyecto TechCraft Dynamics',
      version: '1.0.0',
      description: 'Documentación del API REST con Swagger',
    },
    servers: [
      {
        url: SERVER_URL, // Se adapta a local o producción
        description: 'Servidor detectado automaticamente'
      },
    ],
  },
  apis: ['./Documentation/*.yaml'],
};

const specs = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Montar rutas
app.use('/api/ventas', ventasRoutes);
app.use('/api/proveedores', proveedoresRoutes);
app.use('/api/login', authRoutes);
app.use('/api/perfil', perfilRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/categorias', categoriasRoutes);
app.use('/api/subcategorias', subcategoriasRoutes);
app.use('/api/productos', productosRoutes);

// Servir imágenes
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Función para verificar conexión antes de iniciar servidor
async function startServer() {
  try {
    // Probar conexión a la base de datos
    await db.query('SELECT 1');
    console.log('✅ Base de datos conectada correctamente');
    
    // Arrancar servidor
    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
      console.log(`🚀 Servidor TechCraft Dynamics corriendo en ${SERVER_URL}`);
      console.log(`📖 Swagger docs disponibles en ${SERVER_URL}/api-docs`);
      console.log(`🗄️  Base de datos: ${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || 3306}/${process.env.DB_NAME || 'techCraft'}`);
    });
  } catch (error) {
    console.error('❌ Error al conectar con la base de datos:', error.message);
    console.log('🔧 Verifica la configuración en el archivo .env');
    process.exit(1);
  }
}

// Iniciar servidor
startServer();

const express = require('express');
const cors = require('cors');
const path = require('path');

// Rutas
const ventasRoutes = require('./routes/ventas.routes');
const productosRoutes = require('./routes/productos.routes');
const proveedoresRoutes = require('./routes/proveedores.routes');
const authRoutes = require('./routes/auth.routes');
const perfilRoutes = require('./routes/perfil.routes');
const usuariosRoutes = require('./routes/usuarios.routes');
const categoriasRoutes = require('./routes/Categorias.routes');
const subcategoriasRoutes = require('./routes/Subcategorias.routes');

const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

const SERVER_URL = process.env.SERVER_URL || `http://localhost:${process.env.PORT || 4000}`;

// Swagger config
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
        url: SERVER_URL,
        description: 'Servidor detectado automaticamente'
      },
    ],
  },
  apis: ['./Documentation/*.yaml'],
};

const specs = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Rutas
app.use('/api/ventas', ventasRoutes);
app.use('/api/proveedores', proveedoresRoutes);
app.use('/api/login', authRoutes);
app.use('/api/perfil', perfilRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/categorias', categoriasRoutes);
app.use('/api/subcategorias', subcategoriasRoutes);
app.use('/api/productos', productosRoutes);

// Archivos estáticos
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 🚀 IMPORTANTE: NO arrancar servidor si estamos en modo test
if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en ${SERVER_URL}`);
    console.log(`📖 Swagger docs disponibles en ${SERVER_URL}/api-docs`);
  });
}

module.exports = app;

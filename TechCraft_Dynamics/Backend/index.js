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

// Swagger
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Detectar URL base dinámicamente
const SERVER_URL = process.env.SERVER_URL || `http://localhost:${process.env.PORT || 3000}`;

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

// Arrancar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en ${SERVER_URL}`);
  console.log(`📖 Swagger docs disponibles en ${SERVER_URL}/api-docs`);
});

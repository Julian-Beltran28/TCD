const express = require('express');
const cors = require('cors');
const path = require('path');
require("dotenv").config();

// Importar rutas
const ventasRoutes = require('./routes/ventas.routes');
const comprasRoutes = require('./routes/compras.routes');
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

app.use(cors());
app.use(express.json());

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
        url: `http://localhost:${process.env.PORT}`,
      },
    ],
  },
  apis: ['./Documentation/*.yaml'],
};

const specs = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Rutas
app.use('/api/ventas', ventasRoutes);
app.use('/api/compras', comprasRoutes);
app.use('/api/proveedores', proveedoresRoutes);
app.use('/api/login', authRoutes);
app.use('/api/perfil', perfilRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/categorias', categoriasRoutes);
app.use('/api/subcategorias', subcategoriasRoutes);
app.use('/api/productos', productosRoutes);

  // Servir imágenes
  app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 🚨 Manejo de rutas inexistentes
app.use((req, res, next) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// 🚨 Manejo de errores internos
app.use((err, req, res, next) => {
  console.error('❌ Error en servidor:', err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// Puerto dinámico
const PORT = process.env.PORT || 8084;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Servidor corriendo en http://0.0.0.0:${PORT}`);
  console.log(`📄 Swagger docs: http://localhost:${PORT}/api-docs`);
});

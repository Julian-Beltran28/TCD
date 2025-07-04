const express = require('express');
const cors = require('cors');
const app = express();
const proveedorRoutes = require('./routes/proveedores.routes');
const path = require('path');

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Servir imágenes
app.use('/api/proveedores', proveedorRoutes);

app.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});
